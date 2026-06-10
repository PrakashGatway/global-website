import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, MapPin, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { ModernSelect } from "@/components/ui/select";
import { DynamicLucideIcon } from "@/components/DynamicLucideIcon";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, type: "spring" as const, stiffness: 300, damping: 24 },
  }),
};

const slideIn = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.25 } },
};

export default function StepRenderer({ step, categories, countries }) {
  const { watch, setValue, register } = useFormContext();
  const value = watch(step.name);

  const options = [
    { label: "Undergraduate", value: "undergraduate" },
    { label: "Postgraduate", value: "postgraduate" },
    { label: "Diploma", value: "diploma" },
    { label: "Certificate", value: "certificate" },
  ]

  const getStudyLevelStyle = (level: string) => {
    switch (level?.toLowerCase()) {
      case "undergraduate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "postgraduate":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "diploma":
        return "bg-green-100 text-green-700 border-green-200";
      case "certificate":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // — Country —
  const renderCountry = () => (
    <div className="max-h-[60vh] p-1 overflow-y-auto">
      <div className="grid grid-cols-3 gap-3">
        {countries?.map((opt, i) => (
          <motion.div
            key={opt.value}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setValue(step.name, opt.label)}
            className={`flex flex-col items-center justify-center h-28 rounded-2xl border-2 cursor-pointer transition-shadow ${value === opt.label
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
              : "border-border hover:border-primary/40 hover:shadow-md"
              }`}
          >
            <img src={opt.flg} className="w-10 h-10 rounded-sm mb-2 object-cover" alt={opt.label} />
            <span className="text-sm font-medium text-foreground">{opt.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // — Study Field —
  const renderStudyField = () => (
    <div className="max-h-[60vh] p-1 overflow-y-auto">
      <div className="flex items-start gap-3 mb-4">
        <p className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm font-medium text-foreground">
          {step.label}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {categories?.map((opt, i) => (
          <motion.div
            key={opt.value}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setValue(step.name, opt.value)}
            className={`flex flex-col items-center justify-center p-2 py-4 rounded-2xl border-2 cursor-pointer transition-shadow ${value === opt.value
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
              : "border-border hover:border-primary/40 hover:shadow-md"
              }`}
          >
            <DynamicLucideIcon name={opt.icon} className="w-7 h-7 stroke-[1.7px] text-gray-700 mb-1 object-cover" />
            <span className="text-sm font-medium text-foreground">{opt.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // — Study Level —
  const renderStudyLevel = () => (
    <div>
      <div className="flex items-start gap-3 mb-4">
        <p className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm font-medium text-foreground">
          {step.label}
        </p>
      </div>
      <div className="space-y-3">
        {options?.map((opt, i) => {
          const isSelected = value === opt.value;

          return (
            <motion.div
              key={opt.value}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setValue(step.name, opt.value)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                ? getStudyLevelStyle(opt.value)
                : "border-border hover:border-primary/30"
                }`}
            >
              <span className="font-medium flex-1">{opt.label}</span>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-current" : "border-border"
                  }`}
              >
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // — Nationality —
  const renderNationality = () => (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <p className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm font-medium text-foreground">{step.label}</p>
      </div>
      <div className="rounded-2xl overflow-hidden">
        <img src={"https://baselang.com/wp-content/uploads/2016/04/nationalities-in-spanish.jpg"} alt="Nationality" className="w-full h-40 object-cover" />
      </div>
      <div className="relative">
        <ModernSelect
          options={countries}
          value={watch(step.name)}
          onChange={(value) => setValue(step.name, value)}
          placeholder={`Select ${step.label}`}
          className="py-0 font-medium text-foreground"
        />
      </div>
    </div>
  );

  // — Financial —
  const renderFinancial = () => {
    const amount = watch(step.name) || 5000;
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <p className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm font-medium text-foreground">Available funds for tuition and living expenses abroad? (Rupees)</p>
        </div>
        <div className="flex justify-center">
          <motion.div
            className="w-36 h-36 rounded-3xl border-2 border-primary/20 flex flex-col items-center justify-center bg-primary/5"
            key={amount}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="text-primary text-lg font-bold">₹</span>
            <motion.span
              className="text-3xl font-bold text-foreground"
              key={amount}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {Number(amount).toLocaleString()}
            </motion.span>
            <span className="text-xs text-muted-foreground mt-1">per year</span>
          </motion.div>
        </div>
        <div className="px-2">
          <input
            type="range"
            min={step.min}
            max={500000}
            step={step.step}
            value={amount}
            onChange={(e) => setValue(step.name, Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-primary
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-background"
          />
          <div className="flex font-medium justify-between text-sm text-muted-foreground mt-2">
            <span>₹{step.min?.toLocaleString()}</span>
            <span>₹{500000}</span>
          </div>
        </div>
      </div>
    );
  };

  // — Success —
  const renderSuccessStep = () => (
    <div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl"
        >
          🎉
        </motion.span>
      </motion.div>
      <h2 className="text-center text-xl font-bold text-foreground mb-2">{step.bannerMessage}</h2>
      <p className="bg-primary/5 rounded-2xl p-4 text-center text-sm text-muted-foreground mb-6">
        {step.description}
      </p>
      <h3 className="font-semibold text-foreground mb-3">Your Exclusive Benefits</h3>

      {step.freeService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-4 mb-5 bg-muted"
        >
          <p className="font-semibold text-sm text-foreground">{step.freeService.title}</p>
          <p className="text-xs text-muted-foreground">{step.freeService.desc}</p>
        </motion.div>
      )}
      <div className="grid grid-cols-3 text-center">
        {step.stats?.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <p className="font-bold text-lg text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  switch (step.name) {
    case "countryInterested":
      return renderCountry();
    case "studyPreference":
      return renderStudyField();
    case "studyLevel":
      return renderStudyLevel();
    case "nationality":
      return renderNationality();
    case "financialFunds":
      return renderFinancial();
    case "studyPlanUnlocked":
      return renderSuccessStep();
    default:
      return null;
  }
}

export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="mb-4 relative mt-4">
      <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-muted rounded-full">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step Circles */}
      <div className="flex justify-between relative z-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              scale: i === currentStep ? 1.15 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
              ${i <= currentStep
                ? "bg-primary text-white"
                : "bg-muted text-gray-500"
              }`}
          >
            {i < currentStep ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              i + 1
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}