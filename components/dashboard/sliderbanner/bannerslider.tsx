import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Globe, Share2, Link2, SquareArrowOutUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, User, GraduationCap, FileCheck, Target, CreditCard, UserPlus, ArrowRight, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGlobal } from "@/src/statecontext";

export default function RewardSlider({ universities }: any) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % universities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [universities.length]);

  if (!universities || universities.length === 0) return null;

  const slide = universities[current];

  const goPrev = () => {
    setDirection(-1);
    setCurrent((current - 1 + universities.length) % universities.length);
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((current + 1) % universities.length);
  };

  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      y: dir > 0 ? "-0%" : "100%",
      opacity: 1,
    }),
  };

  return (
    <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow h-[240px] sm:h-[280px] md:h-70 animate-fade-up w-full">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide._id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide?.cover_photo || "https://www.ox.ac.uk/sites/files/oxford/styles/ow_large_feature/s3/field/field_image_main/GAF%20Radcliffe%20Square%20Dawn%20-%20Elizabeth%20Nyikos.jpg?itok=U-0F0aPx"}
            alt={slide?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/10 sm:to-black/0" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-center p-4 sm:p-6 md:p-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-1.5 sm:p-2 shadow-sm">
                <Image 
                  src={slide?.uni_logo} 
                  alt={slide?.name} 
                  width={80} 
                  height={80} 
                  className="rounded-md sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10 object-contain" 
                />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-white mb-1 leading-tight">
              {slide.name}
            </h2>
            <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-lg font-medium line-clamp-2 mb-3 sm:mb-4">
              {slide?.short_description}
            </p>

            <div className="flex items-center gap-3 text-white/80 text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4">
              <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-md backdrop-blur-md">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate max-w-[150px] sm:max-w-none">{slide?.address}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/dashboard/universities/${slide?.slug}`} className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white text-black font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors shadow-md whitespace-nowrap">
                View Details
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors hidden md:block z-10 backdrop-blur-sm border border-white/10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors hidden md:block z-10 backdrop-blur-sm border border-white/10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
  completedIcon: React.ReactNode;
  route?: string;
  requiredProfilePercentage?: number;
}

const steps: Step[] = [
  {
    id: 1,
    label: "Complete profile",
    icon: <User className="w-5 h-5" />,
    completedIcon: <Check className="w-5 h-5" />,
    route: "/dashboard/settings",
    requiredProfilePercentage: 0,
  },
  {
    id: 2,
    label: "Start applying",
    icon: <GraduationCap className="w-5 h-5" />,
    completedIcon: <Check className="w-5 h-5" />,
    route: "/dashboard/universities",
    requiredProfilePercentage: 60,
  },
  {
    id: 3,
    label: "Review & submit",
    icon: <FileCheck className="w-5 h-5" />,
    completedIcon: <Check className="w-5 h-5" />,
    route: "/dashboard/application",
    requiredProfilePercentage: 80,
  },
  {
    id: 4,
    label: "Get your results",
    icon: <Target className="w-5 h-5" />,
    completedIcon: <Check className="w-5 h-5" />,
    route: "/dashboard/application",
    requiredProfilePercentage: 90,
  },
  {
    id: 5,
    label: "Apply for visa",
    icon: <CreditCard className="w-5 h-5" />,
    completedIcon: <Check className="w-5 h-5" />,
    route: "/dashboard",
    requiredProfilePercentage: 95,
  },
  {
    id: 6,
    label: "Enrol & settle",
    icon: <UserPlus className="w-5 h-5" />,
    completedIcon: <Check className="w-5 h-5" />,
    route: "/dashboard",
    requiredProfilePercentage: 100,
  },
];

export function StepProgress() {
  const [calculatedStep, setCalculatedStep] = useState(1);
  const { allProfile } = useGlobal();

  useEffect(() => {
    if (allProfile) {
      const completion = allProfile.profileCompletion || 0;
      if (completion >= 60) {
        setCalculatedStep(2);
      }
    }
  }, [allProfile]);

  return (
    <div className="bg-pink-50 rounded-3xl p-4 sm:p-6 pb-8 sm:pb-12 animate-fade-up w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">My Progress</h3>
        </div>
        <div className="text-right">
          <span className="text-xs sm:text-sm text-muted-foreground font-medium bg-white/50 px-2 py-1 rounded-md">
            Step {calculatedStep} of {steps.length}
          </span>
        </div>
      </div>

      {/* DESKTOP VIEW: Horizontal SVG Wave (Hidden on Mobile/Tablet) */}
      <div className="hidden md:block relative">
        <svg
          className="absolute top-0 left-0 w-full h-22 pointer-events-none"
          viewBox="0 0 1000 80"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d={generateWavePath(1000, calculatedStep, steps.length)}
            stroke="#F26D44"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={generatePendingPath(1000, calculatedStep, steps.length)}
            stroke="#c5baba"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Step circles */}
        <div className="relative mt-6 pt-4 flex justify-between">
          {steps.map((step) => {
            const isComplete = step.id <= calculatedStep;
            const isCurrent = step.id === calculatedStep;
            const isAccessible = true;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-3 z-10 cursor-pointer transition-transform hover:scale-105 group"
                style={{ width: `${100 / steps.length}%` }}
              >
                <div className="relative">
                  <span
                    className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center z-20 ${isComplete
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-step-pending text-step-pending-foreground"
                      }`}
                  >
                    {step.id}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isComplete
                      ? "bg-white text-secondary shadow-xl border-2 border-gray-400"
                      : isAccessible
                        ? "bg-white/50 text-gray-500 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-white hover:shadow-md"
                        : "bg-muted text-muted-foreground border-2 border-border opacity-50 cursor-not-allowed"
                      } ${isCurrent ? "ring-2 ring-secondary/20 scale-110" : ""}`}
                  >
                    {isComplete ? step.completedIcon : step.icon}
                  </div>
                </div>

                <span
                  className={`text-sm md:text-base mt-2 font-medium text-center leading-tight px-1 ${isComplete ? "text-gray-900" : isAccessible ? "text-gray-600" : "text-muted-foreground"
                    }`}
                >
                  {step.label}
                </span>
                
                <Link href={step.route || "#"} className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <SquareArrowOutUpRight className={`w-4 h-4 ${isComplete ? "text-secondary" : "text-gray-400"}`} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE/TABLET VIEW: Vertical Timeline (Visible only on < md) */}
      <div className="md:hidden flex flex-col space-y-4 relative">
        {/* Vertical Line Background */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200 z-0"></div>
        
        {steps.map((step, index) => {
          const isComplete = step.id <= calculatedStep;
          const isCurrent = step.id === calculatedStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative flex items-start gap-4 z-10">
              {/* Icon Circle */}
              <div className="flex-shrink-0">
                 <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isComplete
                      ? "bg-white text-[#F26D44] border-2 border-[#F26D44]" // Using hardcoded secondary color approx for safety or rely on class
                      : isCurrent
                        ? "bg-white text-gray-700 border-2 border-gray-400 ring-2 ring-gray-100"
                        : "bg-gray-50 text-gray-400 border-2 border-dashed border-gray-300"
                      }`}
                  >
                    {isComplete ? step.completedIcon : step.icon}
                  </div>
              </div>

              {/* Content */}
              <div className="flex-grow pt-2 pb-2">
                <div className="flex justify-between items-center">
                  <h4 className={`text-sm font-bold ${isComplete ? 'text-gray-900' : isCurrent ? 'text-gray-800' : 'text-gray-500'}`}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                     <Link href={step.route || "#"} className="text-[#F26D44]">
                       <SquareArrowOutUpRight className="w-4 h-4" />
                     </Link>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current Step
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper functions
function generateWavePath(width: number, currentStep: number, totalSteps: number): string {
  const segmentWidth = width / totalSteps;
  const completedEnd = (currentStep - 0.5) * segmentWidth;
  const startX = segmentWidth / 2;

  let path = `M ${startX} 20`;

  for (let i = 1; i < currentStep; i++) {
    const x = startX + i * segmentWidth;
    const cpY = i % 2 === 0 ? -30 : 90;
    const cp1X = startX + (i - 0.5) * segmentWidth;
    path += ` Q ${cp1X} ${cpY} ${x} 40`;
  }

  return path;
}

function generatePendingPath(width: number, currentStep: number, totalSteps: number): string {
  const segmentWidth = width / totalSteps;
  const startX = (currentStep - 0.5) * segmentWidth;

  if (currentStep >= totalSteps) return "";

  let path = `M ${startX} 40`;

  for (let i = currentStep; i < totalSteps; i++) {
    const x = segmentWidth / 2 + i * segmentWidth;
    const cpY = i % 2 === 0 ? -30 : 90;
    const cpX = (startX + (i - currentStep) * segmentWidth + x) / 2;
    path += ` Q ${cpX} ${cpY} ${x} 40`;
  }

  return path;
}