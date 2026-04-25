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
    <div className="relative rounded-4xl overflow-hidden shadow h-60 sm:h-70 animate-fade-up">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/0" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-center p-5 md:p-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/50 rounded-xl p-2">
                <Image src={slide?.uni_logo} alt={slide?.name} width={80} height={80} className="rounded-xl w-full h-8 object-cover" />
              </div>
            </div>

            <h2 className="text-base sm:text-2xl font-heading font-bold text-white mb-1">
              {slide.name}
            </h2>
            <p className="text-white text-xs sm:text-base max-w-lg text-sm mb-2 font-medium line-clamp-2">
              {slide?.short_description}
            </p>

            <div className="flex items-center gap-4 text-white/80 text-xs sm:text-sm mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {slide?.address}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/dashboard/universities/${slide?.slug}`} className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-md">
                View Details
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={goPrev}
        className="absolute left-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/0 text-white hover:bg-black/50 transition-colors hidden md:block z-10 backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/0 text-white hover:bg-black/50 transition-colors hidden md:block z-10 backdrop-blur-sm"
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
    <div className="bg-pink-50 rounded-3xl p-6 pb-12 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-heading font-bold text-foreground">My Progress</h3>
        </div>
        <div className="text-right">
          <span className="text-sm text-muted-foreground font-medium">
            Step {calculatedStep} of {steps.length}
          </span>
        </div>
      </div>

      {/* Steps with SVG path */}
      <div className="relative">
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
                className="flex flex-col items-center gap-3 z-10 cursor-pointer transition-transform hover:scale-105"
                style={{ width: `${100 / steps.length}%` }}
              // onClick={() => isAccessible && handleStepClick(step)}
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
                  className={`text-xs md:text-base mt-4 font-medium text-center leading-tight ${isComplete ? "text-gray-900" : isAccessible ? "text-gray-600" : "text-muted-foreground"
                    }`}
                >
                  {step.label}

                </span>
                <Link href={step.route}>
                  <SquareArrowOutUpRight className={`w-5 h-5 ${isComplete ? "text-secondary" : "text-gray-400"} ${isCurrent ? "block" : "hidden"}`} />
                </Link>
           

              </div>
            );
          })}
        </div>
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