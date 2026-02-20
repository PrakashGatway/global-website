'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Check, GraduationCap, Calendar, BookOpen, AlertCircle, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axiosInstance from '@/app/axiosInstance'
import { ApplicationForm ,PrerequisitesForm ,BackupsForm,ExpectationsForm} from './applicationSteps'


interface CreateApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onApplicationCreated?: () => void
  program: {
    id: string
    name: string
    university: string
    intake: string
    deadline: string
    school?: string
  }
}

const steps = [
  { id: 'intakes', title: 'Intakes', icon: Calendar },
  { id: 'prerequisites', title: 'Prerequisites', icon: BookOpen },
  { id: 'backups', title: 'Backup Programs', icon: GraduationCap },
  { id: 'expectations', title: 'What to Expect', icon: AlertCircle },
]

export function CreateApplicationModal({
  isOpen,
  onClose,
  onApplicationCreated,
  program,
}: CreateApplicationModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    selectedIntake: program.intake,
    prerequisites: {
      documents: [],
      requirements: [],
      isVerified: false
    },
    backups: [],
    expectations: {
      understood: false,
      agreed: false
    }
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.post('/applications', {
        programId: program.id,
        programName: program.name,
        university: program.university,
        school: program.school,
        selectedIntake: formData.selectedIntake,
        prerequisites: formData.prerequisites,
        backups: formData.backups,
        expectations: formData.expectations,
        status: 'submitted'
      })

      toast.success('Application submitted successfully!')
      onApplicationCreated?.()
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Intakes
        return !!formData.selectedIntake
      case 1: // Prerequisites
        return formData.prerequisites.isVerified
      case 2: // Backups
        return true // Optional, but we can add validation if needed
      case 3: // Expectations
        return formData.expectations.understood && formData.expectations.agreed
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ApplicationForm
            program={program}
            formData={formData}
            setFormData={setFormData}
          />
        )
      case 1:
        return (
          <PrerequisitesForm
            program={program}
            formData={formData}
            setFormData={setFormData}
          />
        )
      case 2:
        return (
          <BackupsForm
            program={program}
            formData={formData}
            setFormData={setFormData}
          />
        )
      case 3:
        return (
          <ExpectationsForm
            program={program}
            formData={formData}
            setFormData={setFormData}
          />
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 top-0 buttom-0 h-screen bg-black/50 backdrop-blur-[1px] z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex items-center justify-center p-2 overflow-hidden"
          >
            <div className="relative rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="bg-gradient-to-r from-[#F26D44] to-[#626363] p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      New Application
                    </h2>
                    <p className="text-blue-100 text-xs">
                      Apply for {program.name}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Program Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-4"
                >
                  <div className="grid grid-cols-12 gap-2">
                    <div className='col-span-4'>
                      <p className="text-blue-200 text-xs">Program</p>
                      <p className="text-white font-medium text-sm truncate">{program.name}</p>
                    </div>
                    <div className='col-span-4'>
                      <p className="text-blue-200 text-xs">School</p>
                      <p className="text-white font-medium text-sm truncate">{program.school || program.university}</p>
                    </div>
                    <div className='col-span-2'>
                      <p className="text-blue-200 text-xs">Intake</p>
                      <p className="text-white font-medium text-sm">{program.intake}</p>
                    </div>
                    <div className='col-span-2'>
                      <p className="text-blue-200 text-xs">Deadline</p>
                      <p className="text-white font-medium text-sm">{program.deadline}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Progress Steps */}
                <div className="mt-6 flex items-center justify-center">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep
                    
                    return (
                      <div key={step.id} className="flex items-center">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isActive ? 1.1 : 1,
                            backgroundColor: isActive ? '#ffffff' : isCompleted ? '#22c55e' : 'rgba(255,255,255,0.2)'
                          }}
                          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                            isActive ? 'text-blue-600' : isCompleted ? 'text-white' : 'text-white'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <StepIcon className="w-4 h-4" />
                          )}
                        </motion.div>
                        <div className="ml-2 flex-1">
                          <p className={`text-xs font-medium ${
                            isActive ? 'text-white' : 'text-blue-200'
                          }`}>
                            {step.title}
                          </p>
                        </div>
                        {index < steps.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-blue-300 mx-2" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer with Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="border-t px-8 py-4 bg-white flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${
                      currentStep === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </motion.button>

                  {currentStep === steps.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={!isStepValid() || isLoading}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}