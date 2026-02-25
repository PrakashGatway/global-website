'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Check, GraduationCap, Calendar, BookOpen, AlertCircle, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axiosInstance from '@/app/axiosInstance'
import { ApplicationForm, PrerequisitesForm, BackupsForm, ExpectationsForm } from './applicationSteps'

interface CreateApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onApplicationCreated?: () => void
  program: {
    _id: string
    name: string
    university: {
      _id: string
      name: string
      slug: string
      country: string
      city: string
      uni_logo?: string
      intakes?: string[]
    }
    subject?: {
      _id: string
      name: string
    }
    studyMode?: string
    shortName?: string
    tuitionFee?: number
    currency?: string
    level?: string
    duration?: string
    applicationFee?: number
    intake?: string
    deadline?: string
    school?: string
    requirements?: Record<string, string>
    docsRequired?: Array<Record<string, string>>
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
  
  // Get available intakes from program data
  const availableIntakes = React.useMemo(() => {
    return program?.university?.intakes || [program?.intake].filter(Boolean) || ['Fall 2024', 'Spring 2025']
  }, [program])

  const [formData, setFormData] = React.useState({
    selectedIntake: program?.intake || (availableIntakes[0] || ''),
    prerequisites: {
      documents: [] as Array<{ name: string; uploaded: boolean; url?: string }>,
      requirements: [] as Array<{ name: string; met: boolean }>,
      isVerified: false
    },
    backups: [] as Array<{
      programId: string
      programName: string
      university: string
      priority: number
    }>,
    expectations: {
      understood: false,
      agreed: false
    }
  })

  // Initialize prerequisites from program requirements
  React.useEffect(() => {
    if (program?.requirements) {
      const reqs = Object.entries(program.requirements).map(([key, value]) => ({
        name: `${key}: ${value}`,
        met: false
      }))
      setFormData(prev => ({
        ...prev,
        prerequisites: {
          ...prev.prerequisites,
          requirements: reqs
        }
      }))
    }

    if (program?.docsRequired) {
      const docs = program?.docsRequired?.flatMap(doc => 
        Object.entries(doc).map(([key, value]) => ({
          name: `${key}${value !== 'copy' ? ` - ${value}` : ''}`,
          uploaded: false
        }))
      )
      setFormData(prev => ({
        ...prev,
        prerequisites: {
          ...prev.prerequisites,
          documents: docs
        }
      }))
    }
  }, [program])

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
      const applicationData = {
        programId: program._id,
        programName: program.name,
        university: {
          id: program.university._id,
          name: program.university.name,
          country: program.university.country,
          city: program.university.city
        },
        school: program.subject?.name || program.university.name,
        selectedIntake: formData.selectedIntake,
        prerequisites: {
          documents: formData.prerequisites.documents.filter(doc => doc.uploaded).map(doc => doc.name),
          requirements: formData.prerequisites.requirements.filter(req => req.met).map(req => req.name),
          isVerified: formData.prerequisites.isVerified
        },
        backups: formData.backups,
        expectations: formData.expectations,
        status: 'submitted',
        applicationFee: program.applicationFee,
        tuitionFee: program.tuitionFee,
        currency: program.currency || 'INR',
        duration: program.duration,
        level: program.level,
        studyMode: program.studyMode
      }

      const response = await axiosInstance.post('/applications', applicationData)

      toast.success('Application submitted successfully!')
      onApplicationCreated?.()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to submit application')
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Intakes
        return !!formData.selectedIntake
      case 1: // Prerequisites
        // Check if all required documents are uploaded and requirements are met
        const allDocsUploaded = formData.prerequisites.documents.every(doc => doc.uploaded)
        const allReqsMet = formData.prerequisites.requirements.every(req => req.met)
        return allDocsUploaded && allReqsMet && formData.prerequisites.isVerified
      case 2: // Backups
        return true // Optional
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
            availableIntakes={availableIntakes}
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
            className="fixed inset-0 top-0 bottom-0 h-screen bg-black/20 backdrop-blur-[1px] z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex items-center justify-center p-2 overflow-hidden"
          >
            <div className="relative rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="bg-pink-100 p-6"
              >
                <div className="flex items-start justify-between !text-gray-800">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      New Application
                    </h2>
                    <p className="text-xs">
                      Apply for {program.name}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Program Summary Card */}
                {/* <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-4"
                >
                  <div className="grid grid-cols-12 gap-2">
                    <div className='col-span-4'>
                      <p className="text-blue-200 text-xs">Program</p>
                      <p className="text-white font-medium text-sm truncate">{program.name}</p>
                      {program.shortName && (
                        <p className="text-blue-200 text-xs">{program.shortName}</p>
                      )}
                    </div>
                    <div className='col-span-4'>
                      <p className="text-blue-200 text-xs">University</p>
                      <p className="text-white font-medium text-sm truncate">{program.university?.name}</p>
                      <p className="text-blue-200 text-xs">{program.university?.country}, {program.university?.city}</p>
                    </div>
                    <div className='col-span-2'>
                      <p className="text-blue-200 text-xs">Intake</p>
                      <p className="text-white font-medium text-sm">{program.intake || 'Flexible'}</p>
                    </div>
                    <div className='col-span-2'>
                      <p className="text-blue-200 text-xs">Fee</p>
                      <p className="text-white font-medium text-sm">
                        {program.currency} {program.tuitionFee?.toLocaleString()}
                      </p>
                      {program.applicationFee && (
                        <p className="text-blue-200 text-xs">App Fee: {program.currency} {program.applicationFee}</p>
                      )}
                    </div>
                  </div>
                </motion.div> */}

                {/* Progress Steps */}
                <div className="mt-4 flex items-center justify-center gap-1">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep
                    
                    return (
                      <React.Fragment key={step.id}>
                      <div key={step.id} className="flex gap-1 items-center">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isActive ? 1.1 : 0.9,
                            backgroundColor: isActive ? '#ffffff' : isCompleted ? '#30ff7c' : 'rgb(231, 223, 223)'
                          }}
                          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                            isActive ? 'text-gray-600' : isCompleted ? 'text-gray-800' : 'text-gray-600'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" strokeWidth={1.7} />
                          ) : (
                            <StepIcon className="w-5 h-5" strokeWidth={1.7} />
                          )}
                        </motion.div>
                        <div className="ml-2 flex-1">
                          <p className={`text-xs font-medium ${
                            isActive ? 'text-gray-800' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </p>
                        </div>
                       
                      </div>
                       {index < steps.length - 1 && (
                          <ChevronRight className="w-6 h-6 text-gray-400 mx-2" />
                        )}
                      </React.Fragment>
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
                      className="px-6 py-2 bg-gradient-to-r from-[#F26D44] to-[#626363] text-white text-sm font-medium rounded-lg hover:from-[#d55a3a] hover:to-[#4a4a4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                      // disabled={!isStepValid()}
                      className="px-6 py-2 bg-gradient-to-r from-[#F26D44] to-[#626363] text-white text-sm font-medium rounded-lg hover:from-[#d55a3a] hover:to-[#4a4a4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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