import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, MapPin, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { ModernSelect } from "@/components/ui/select";


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



export default function StepRenderer({ step, countries }) {
  const { watch, setValue, register } = useFormContext();
  const value = watch(step.name);

  // — Country —
  const renderCountry = () => (
    <div>
      <div className="rounded-2xl overflow-hidden mb-6 relative">
        <img src={step.image} alt="study abroad" className="w-full h-36 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {step.options?.map((opt, i) => (
          <motion.div
            key={opt.value}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setValue(step.name, opt.value)}
            className={`flex flex-col items-center justify-center h-28 rounded-2xl border-2 cursor-pointer transition-shadow ${value === opt.value
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                : "border-border hover:border-primary/40 hover:shadow-md"
              }`}
          >
            <img src={opt.image} className="w-10 h-10 rounded-sm mb-2 object-cover" alt={opt.label} />
            <span className="text-sm font-medium text-foreground">{opt.label}</span>
            {/* {value === opt.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )} */}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // — Study Field —
  const renderStudyField = () => (
    <div>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-lg shrink-0">
          🎓
        </div>
        <p className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm font-medium text-foreground">
          {step.label}
        </p>
      </div>
      <div className="rounded-2xl overflow-hidden mb-5">
        <img src={step.image} alt="study" className="w-full h-32 object-cover" />
      </div>
      <div className="space-y-3">
        {step.fields?.map((field, idx) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
          >
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{field.label}</label>
            <div className="relative border-2 border-border rounded-xl focus-within:border-primary transition-colors">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                {...register(field.name)}
                className="w-full pl-9 pr-8 py-3 text-sm bg-transparent outline-none appearance-none rounded-xl text-foreground"
              >
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // — Study Level —
  const renderStudyLevel = () => (
    <div>
      <div className="rounded-2xl overflow-hidden mb-6">
        <img src={step.image} className="w-full h-36 object-cover" alt="study level" />
      </div>
      <div className="space-y-3">
        {step.options?.map((opt, i) => (
          <motion.div
            key={opt.value}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setValue(step.name, opt.value)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${value === opt.value
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-border hover:border-primary/30"
              }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${value === opt.value ? "bg-primary/10" : "bg-muted"
              }`}>
              {opt.icon}
            </div>
            <span className="font-medium text-foreground flex-1">{opt.label}</span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${value === opt.value ? "border-primary bg-primary" : "border-border"
              }`}>
              {value === opt.value && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // — Nationality —
  //   const [nationalitySearch, setNationalitySearch] = useState("");
  //   const filteredNationalities = useMemo(
  //     () =>
  //       step.name === "nationality"
  //         ? step.options?.filter((o) =>
  //             o.label.toLowerCase().includes(nationalitySearch.toLowerCase())
  //           )
  //         : [],
  //     [step, nationalitySearch]
  //   );

  const renderNationality = () => (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-lg shrink-0">🎓</div>
        <p className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm font-medium text-foreground">{step.label}</p>
      </div>
      <div className="rounded-2xl overflow-hidden">
        <img src={step.image} alt="Nationality" className="w-full h-40 object-cover" />
      </div>
      <div className="relative">

        <ModernSelect
          options={countries}   // API data
          value={watch(step.name)}
          onChange={(value) => setValue(step.name, value)}
          placeholder={`Select ${step.label}`}
          className="py-0 "
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>(auto detected) — you can change this if needed</span>
      </div>
    </div>
  );

  // — English Proficiency —
  const renderEnglish = () => {
    const selected = watch(step.name);
    const yesOption = step.options?.find((o) => o.value === "yes");
    return (
      <div className="space-y-5">
        <div className="rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-40 object-cover"
            alt="English Test"
          />
        </div>
        <div>
          <p className="font-semibold text-foreground">{step.question}</p>
          <p className="text-sm text-muted-foreground mt-1">{step.subLabel}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {step.options?.map((opt) => (
            <motion.button
              type="button"
              key={opt.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setValue(step.name, opt.value)}
              className={`border-2 rounded-2xl py-5 text-sm font-semibold transition-all ${selected === opt.value
                  ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40"
                }`}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {selected === "yes" && yesOption?.fields && (
            <motion.div variants={slideIn} initial="hidden" animate="visible" exit="exit" className="space-y-4 overflow-hidden">
              {yesOption.fields.map((field) => (
                <div key={field.name}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{field.label}</label>
                  {field.type === "select" ? (
                    <div className="relative border-2 border-border rounded-xl focus-within:border-primary transition-colors">
                      <select
                        {...register(field.name)}
                        className="w-full px-4 py-3 text-sm bg-transparent outline-none appearance-none rounded-xl text-foreground"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      {...register(field.name)}
                      className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors bg-background text-foreground"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // — Financial —
  const renderFinancial = () => {
    const amount = watch(step.name) || 5000;
    return (
      <div className="space-y-6">
        <div className="rounded-2xl overflow-hidden">
          <img src={step.image} alt="Financials" className="w-full h-40 object-cover" />
        </div>
        <div className="flex justify-center">
          <motion.div
            className="w-36 h-36 rounded-3xl border-2 border-primary/20 flex flex-col items-center justify-center bg-primary/5"
            key={amount}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="text-primary text-lg font-bold">$</span>
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
            max={step.max}
            step={step.step}
            value={amount}
            onChange={(e) => setValue(step.name, Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-primary
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-background"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>${step.min?.toLocaleString()}</span>
            <span>${step.max?.toLocaleString()}</span>
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
      <div className="space-y-3 mb-6">
        {step.benefits?.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-3 border-2 border-border rounded-2xl p-4 hover:border-primary/30 transition-colors"
          >
            <span className="text-2xl">{b.icon}</span>
            <div>
              <p className="font-medium text-foreground text-sm">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
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
      {step.offerBox && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="border-2 border-destructive/30 rounded-2xl p-5 mb-6 text-center"
        >
          <p className="font-bold text-destructive mb-3">{step.offerBox.title}</p>
          <div className="bg-muted rounded-xl p-3 text-sm mb-4 text-foreground">{step.offerBox.message}</div>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            {step.offerBox.points.map((p, i) => (
              <span key={i}>{p}</span>
            ))}
          </div>
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
    case "englishProficiency":
      return renderEnglish();
    case "financialFunds":
      return renderFinancial();
    case "studyPlanUnlocked":
      return renderSuccessStep();
    default:
      return null;
  }
}





interface Props {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: Props) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="mb-4 relative px-4 mt-4">

      {/* Progress Line Background */}
      <div className="absolute top-4 left-4 right-4 h-1.5 bg-muted rounded-full">
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
    ${
      i <= currentStep
        ? "bg-primary text-white"
        : "bg-muted text-gray-500"
    }
  `}
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
