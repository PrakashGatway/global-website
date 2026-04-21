"use client"

import { profileSchema } from "@/config/schema"
import { useCallback, useEffect, useState } from "react"
import StepRenderer, { ProgressBar } from "./StepRenderer"
import { FormProvider, useForm } from "react-hook-form"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import axiosInstance from "@/app/axiosInstance"

export default function OnboardingStepper() {

  const [stepIndex, setStepIndex] = useState(0)
  const [countries, setCountries] = useState([])

  const steps = profileSchema.chooseCourse.steps
  const step = steps[stepIndex]

  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
    shouldUnregister: false
  })

  const isLastStep = stepIndex === steps.length - 1;
  const isFirststep = stepIndex === 0

  const nextStep = () => {
    if (!isLastStep) {
      setStepIndex((p) => p + 1)
    }
  }

  const previousStep = () => {
    if (!isFirststep) {
      setStepIndex((p) => p - 1)
    }


  }

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/countries?limit=300')
      const data = response.data.data
      let formatData = data.map(country => ({ label: country.name, value: country.code }))
      setCountries(formatData)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  })

  useEffect(() => {
    fetchCountries()
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormProvider {...methods}>
          <div className="bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border/50 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Study Abroad</span>
              </div>
              <ProgressBar currentStep={stepIndex} totalSteps={steps.length} />
              <h2 className="text-lg font-bold text-foreground mb-1">{steps?.label}</h2>
            </div>

            {/* Content */}
            <div className="px-6 pb-4 min-h-[400px]">
              <AnimatePresence mode="wait" >
                <motion.div
                  key={stepIndex}
                  // custom={direction}
                  // variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <StepRenderer step={step} countries={countries} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}

            <div className="px-6 pb-6 pt-2 flex gap-3">
              {!isFirststep && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex-1 h-12 rounded-xl border-2 text-sm font-semibold"
                >
                  Back
                </button>
              )}

              <button
                type="button"
                variant="outline"
                onClick={nextStep}
                className="flex-1 h-12 rounded-xl border-2 text-sm font-semibold "
              >
                Continue

              </button>
            </div>



            {/* <div className="px-6 pb-6 pt-2 space-y-3">
                <button className="w-full h-12 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20">
                  Get My Free Study Plan
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  type="button"
                  variant="ghost"
                  onClick={prev}
                  className="w-full text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Go Back
                </button>
              </div> */}

          </div>
        </FormProvider>
      </div>
    </div>
  )
}