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
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter out englishProficiency step from steps
  const filteredSteps = profileSchema.chooseCourse.steps.filter(step => step.name !== "englishProficiency")
  const steps = filteredSteps
  const step = steps[stepIndex]

  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
    shouldUnregister: false
  })

  const { handleSubmit, getValues } = methods

  const isLastStep = stepIndex === steps.length - 1;
  const isFirststep = stepIndex === 0

  const nextStep = async () => {
    if (!isLastStep) {
      setStepIndex((p) => p + 1)
    } else {
      // If it's the last step, submit the form
      await onSubmit()
    }
  }

  const previousStep = () => {
    if (!isFirststep) {
      setStepIndex((p) => p - 1)
    }
  }

  const onSubmit = async () => {
    const allValues = getValues()
    const payload = {
      preferredCountries: [allValues?.countryInterested],
      preferredCourse: [allValues?.studyPreference],
      level: allValues?.studyLevel,
      budgetRange: {
        min: 0,
        max: allValues?.financialFunds
      },
      // preferredIntake: [allValues?.intake]
    }
    setIsSubmitting(true)
    try {
      const response = await axiosInstance.put('/auth/profile', { preferences: payload, nationality: allValues?.nationality })

      if (response.data.success) {
        window.location.href = "/dashboard"

      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/countries?limit=300')
      const data = response.data.data
      let formatData = data.map(country => ({ label: country.name, value: country.name, flg: country.flg }))
      setCountries(formatData)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/courses/categories?limit=300')
      const data = response.data.data
      let formatData = data.map(category => ({ label: category.name, value: category.slug, icon: category.icon, description: category.description }))
      setCategories(formatData)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchCountries()
    fetchCategories()
  }, [fetchCountries, fetchCategories])

  // Log current form values whenever they change (for debugging)
  useEffect(() => {
    const subscription = methods.watch((value) => {
      //console.log("Current form values:", value)
    })
    return () => subscription.unsubscribe()
  }, [methods.watch])

  return (
    <div>
      <div className="min-h-screen bg-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <FormProvider {...methods}>
            <div className="bg-card shadow-xl rounded-xl shadow-primary/5 border border-border/50 overflow-hidden">

              <div className="px-6 pt-6 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-primary">Study Abroad</span>
                </div>
                <ProgressBar currentStep={stepIndex} totalSteps={steps.length} />
                <h2 className="text-lg font-bold text-foreground mb-1">{steps?.label}</h2>
              </div>

              {/* Content */}
              <div className="px-6 pb-4 min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepIndex}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <StepRenderer step={step} categories={categories} countries={countries} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-2 flex gap-3">
                {!isFirststep && (
                  <button
                    type="button"
                    onClick={previousStep}
                    className="flex-1 h-12 rounded-xl border-2 text-sm font-semibold hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : isLastStep ? (
                    "Submit & Get Study Plan"
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>

      <div className="absolute z-[-1] bottom-0 overflow-hidden w-full">
        <style>
          {`
              @keyframes marquee {
                from {
                  transform: translateX(0);
                }
                to {
                  transform: translateX(-50%);
                }
              }
            `}
        </style>

        <div
          className="flex w-max opacity-80"
          style={{
            animation: 'marquee 100s linear infinite',
          }}
          onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
        >
          <div className="flex-shrink-0">
            <img src="./onboarding/bg.png" className="h-[300px] w-auto" alt="footer" />
          </div>

          <div className="flex-shrink-0">
            <img src="./onboarding/bg.png" className="h-[300px] w-auto" alt="footer" />
          </div>

          <div className="flex-shrink-0">
            <img src="./onboarding/bg.png" className="h-[300px] w-auto" alt="footer" />
          </div>
        </div>
      </div>
    </div>
  )
}