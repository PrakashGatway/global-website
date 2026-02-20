'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import { Check, X, FileText, Download, Upload } from 'lucide-react'
import {  AnimatePresence } from 'framer-motion'
import { GraduationCap, Plus, ChevronUp, ChevronDown } from 'lucide-react'

interface ApplicationFormProps {
  program: any
  formData: any
  setFormData: (data: any) => void
}

export function ApplicationForm({ program, formData, setFormData }: ApplicationFormProps) {
  const intakes = [
    { id: 'jan2027', month: 'January', year: '2027', deadline: 'Nov 02, 2026', status: 'available' },
    { id: 'may2027', month: 'May', year: '2027', deadline: 'Mar 15, 2027', status: 'available' },
    { id: 'sep2027', month: 'September', year: '2027', deadline: 'Jul 30, 2027', status: 'coming-soon' },
  ]

  return (
    <div className="space-y-6">
      {/* Program Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Program</p>
            <p className="font-medium text-gray-900">{program.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">School</p>
            <p className="font-medium text-gray-900">{program.school || program.university}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Intake</p>
            <p className="font-medium text-gray-900">{program.intake}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Deadline</p>
            <p className="font-medium text-red-600">{program.deadline}</p>
          </div>
        </div>
      </motion.div>

      {/* Intake Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Intake</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose your preferred intake date for this program.
        </p>

        <div className="grid gap-3">
          {intakes.map((intake, index) => (
            <motion.label
              key={intake.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.selectedIntake === intake.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${intake.status === 'coming-soon' ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="intake"
                value={intake.id}
                checked={formData.selectedIntake === intake.id}
                onChange={(e) => setFormData({ ...formData, selectedIntake: e.target.value })}
                disabled={intake.status === 'coming-soon'}
                className="sr-only"
              />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    formData.selectedIntake === intake.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Calendar className={`w-5 h-5 ${
                      formData.selectedIntake === intake.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {intake.month} {intake.year}
                    </p>
                    <p className="text-sm text-gray-500">
                      Deadline: {intake.deadline}
                    </p>
                  </div>
                </div>
                {intake.status === 'coming-soon' ? (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.selectedIntake === intake.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.selectedIntake === intake.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                )}
              </div>
            </motion.label>
          ))}
        </div>

        {/* Warning Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Please ensure you select the correct intake. Changes to intake after submission may require approval.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}



interface PrerequisitesFormProps {
  program: any
  formData: any
  setFormData: (data: any) => void
}

export function PrerequisitesForm({ program, formData, setFormData }: PrerequisitesFormProps) {
  const prerequisites = [
    {
      id: 'transcript',
      name: 'Official Transcripts',
      description: 'Official transcripts from all previous institutions',
      required: true,
      format: 'PDF (max 10MB)'
    },
    {
      id: 'english',
      name: 'English Proficiency Test',
      description: 'TOEFL/IELTS score report',
      required: true,
      format: 'PDF (max 5MB)'
    },
    {
      id: 'recommendation',
      name: 'Letters of Recommendation',
      description: 'Minimum 2 academic/professional recommendations',
      required: true,
      format: 'PDF (max 5MB)'
    },
    {
      id: 'statement',
      name: 'Statement of Purpose',
      description: '500-1000 words explaining your goals',
      required: true,
      format: 'PDF/DOC (max 5MB)'
    },
    {
      id: 'resume',
      name: 'Resume/CV',
      description: 'Updated resume highlighting relevant experience',
      required: false,
      format: 'PDF (max 5MB)'
    }
  ]

  const handleFileUpload = (prerequisiteId: string, file: File) => {
    // Handle file upload logic here
    const updatedDocuments = [...(formData.prerequisites.documents || [])]
    const index = updatedDocuments.findIndex(d => d.id === prerequisiteId)
    
    if (index >= 0) {
      updatedDocuments[index] = { id: prerequisiteId, file, uploaded: true }
    } else {
      updatedDocuments.push({ id: prerequisiteId, file, uploaded: true })
    }

    const allRequiredUploaded = prerequisites
      .filter(p => p.required)
      .every(p => updatedDocuments.some(d => d.id === p.id && d.uploaded))

    setFormData({
      ...formData,
      prerequisites: {
        ...formData.prerequisites,
        documents: updatedDocuments,
        isVerified: allRequiredUploaded
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Program Prerequisites</h3>
        <p className="text-sm text-gray-500">
          Please upload all required documents to proceed with your application.
        </p>
      </motion.div>

      {/* Prerequisites List */}
      <div className="space-y-3">
        {prerequisites.map((prerequisite, index) => (
          <motion.div
            key={prerequisite.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                formData.prerequisites.documents?.some(d => d.id === prerequisite.id)
                  ? 'bg-green-100'
                  : prerequisite.required
                  ? 'bg-amber-100'
                  : 'bg-gray-100'
              }`}>
                {formData.prerequisites.documents?.some(d => d.id === prerequisite.id) ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <FileText className={`w-4 h-4 ${
                    prerequisite.required ? 'text-amber-600' : 'text-gray-500'
                  }`} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{prerequisite.name}</h4>
                  {prerequisite.required && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{prerequisite.description}</p>
                <p className="text-xs text-gray-400 mt-1">{prerequisite.format}</p>

                {/* Upload Area */}
                <div className="mt-3">
                  {formData.prerequisites.documents?.some(d => d.id === prerequisite.id) ? (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Uploaded successfully</span>
                      </div>
                      <button className="text-xs text-green-600 hover:text-green-700">
                        Replace
                      </button>
                    </div>
                  ) : (
                    <label className="relative block">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(prerequisite.id, e.target.files[0])
                          }
                        }}
                      />
                      <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sample Documents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 rounded-lg p-4 border border-blue-200"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Download className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Need help?</h4>
            <p className="text-xs text-blue-700 mt-1">
              Download sample documents to understand the format requirements.
            </p>
            <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
              Download Samples →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}



interface BackupsFormProps {
  program: any
  formData: any
  setFormData: (data: any) => void
}

export function BackupsForm({ program, formData, setFormData }: BackupsFormProps) {
  const [showProgramSelector, setShowProgramSelector] = React.useState(false)
  
  // Mock available programs
  const availablePrograms = [
    { id: '1', name: 'Computer Science', university: 'Middle Tennessee State University', school: 'College of Basic and Applied Sciences' },
    { id: '2', name: 'Information Systems', university: 'Middle Tennessee State University', school: 'Jones College of Business' },
    { id: '3', name: 'Data Analytics', university: 'Middle Tennessee State University', school: 'College of Basic and Applied Sciences' },
    { id: '4', name: 'Cybersecurity', university: 'Middle Tennessee State University', school: 'College of Basic and Applied Sciences' },
    { id: '5', name: 'Software Engineering', university: 'Middle Tennessee State University', school: 'College of Basic and Applied Sciences' },
  ]

  const addBackup = (backupProgram: any) => {
    if (formData.backups.length >= 10) {
      return
    }
    setFormData({
      ...formData,
      backups: [...formData.backups, { ...backupProgram, priority: formData.backups.length + 1 }]
    })
    setShowProgramSelector(false)
  }

  const removeBackup = (index: number) => {
    const newBackups = formData.backups.filter((_: any, i: number) => i !== index)
    // Update priorities
    newBackups.forEach((backup: any, i: number) => {
      backup.priority = i + 1
    })
    setFormData({ ...formData, backups: newBackups })
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newBackups = [...formData.backups]
    const temp = newBackups[index]
    newBackups[index] = newBackups[index - 1]
    newBackups[index - 1] = temp
    // Update priorities
    newBackups.forEach((backup: any, i: number) => {
      backup.priority = i + 1
    })
    setFormData({ ...formData, backups: newBackups })
  }

  const moveDown = (index: number) => {
    if (index === formData.backups.length - 1) return
    const newBackups = [...formData.backups]
    const temp = newBackups[index]
    newBackups[index] = newBackups[index + 1]
    newBackups[index + 1] = temp
    // Update priorities
    newBackups.forEach((backup: any, i: number) => {
      backup.priority = i + 1
    })
    setFormData({ ...formData, backups: newBackups })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Backup Programs</h3>
        <p className="text-sm text-gray-500">
          Choose up to 10 backup programs in order of preference. These will be considered if your main program is not available.
        </p>
      </motion.div>

      {/* Current Backups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">
            Backup Programs ({formData.backups.length}/10)
          </h4>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            Max 10
          </span>
        </div>

        {formData.backups.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No backup programs added yet.</p>
            <p className="text-gray-400 text-xs mt-1">
              Click the button below to explore available options.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {formData.backups.map((backup: any, index: number) => (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {backup.priority}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{backup.name}</p>
                    <p className="text-xs text-gray-500">{backup.university}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                        index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === formData.backups.length - 1}
                      className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                        index === formData.backups.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeBackup(index)}
                      className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowProgramSelector(true)}
          disabled={formData.backups.length >= 10}
          className={`mt-4 w-full py-3 rounded-lg border-2 border-dashed transition-colors ${
            formData.backups.length >= 10
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          <Plus className={`w-5 h-5 mx-auto ${
            formData.backups.length >= 10 ? 'text-gray-400' : 'text-blue-500'
          }`} />
        </motion.button>
      </motion.div>

      {/* Program Selector Modal */}
      <AnimatePresence>
        {showProgramSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProgramSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Select Backup Program</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Choose from available programs at {program.university}
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                <div className="space-y-2">
                  {availablePrograms
                    .filter(p => !formData.backups.some((b: any) => b.id === p.id))
                    .map((prog, index) => (
                      <motion.button
                        key={prog.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => addBackup(prog)}
                        className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <p className="font-medium text-gray-900">{prog.name}</p>
                        <p className="text-sm text-gray-500">{prog.school}</p>
                      </motion.button>
                    ))}
                </div>
              </div>
              
              <div className="p-6 border-t bg-gray-50">
                <button
                  onClick={() => setShowProgramSelector(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200"
      >
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Choose up to 10 backup programs in order of preference. These will be considered if your main program is not available.
        </p>
      </motion.div>
    </div>
  )
}

import { DollarSign, BookOpen, Users } from 'lucide-react'

interface ExpectationsFormProps {
  program: any
  formData: any
  setFormData: (data: any) => void
}

export function ExpectationsForm({ program, formData, setFormData }: ExpectationsFormProps) {
  const expectations = [
    {
      icon: Clock,
      title: 'Program Duration',
      description: '4 years (8 semesters) full-time study',
      color: 'blue'
    },
    {
      icon: BookOpen,
      title: 'Course Load',
      description: '15-18 credit hours per semester',
      color: 'green'
    },
    {
      icon: DollarSign,
      title: 'Tuition & Fees',
      description: 'Approximately $25,000 per year for international students',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Class Size',
      description: 'Average 25-30 students per class',
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">What to Expect</h3>
        <p className="text-sm text-gray-500">
          Please review the following information about your program and university.
        </p>
      </motion.div>

      {/* Expectations Grid */}
      <div className="grid grid-cols-2 gap-4">
        {expectations.map((item, index) => {
          const Icon = item.icon
          const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          }
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-lg ${colors[item.color as keyof typeof colors]} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.description}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Important Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          Important Information
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-red-600">1</span>
            </div>
            <p className="text-sm text-gray-600">
              Application deadline: <span className="font-medium text-red-600">{program.deadline}</span>. 
              Late applications will not be considered.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-amber-600">2</span>
            </div>
            <p className="text-sm text-gray-600">
              All documents must be uploaded in the required format. Incomplete applications may be rejected.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-green-600">3</span>
            </div>
            <p className="text-sm text-gray-600">
              You will receive a confirmation email within 24 hours of submission.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">4</span>
            </div>
            <p className="text-sm text-gray-600">
              Application processing time: 2-3 weeks. Check your email for updates.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Checkboxes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.expectations.understood}
              onChange={(e) => setFormData({
                ...formData,
                expectations: {
                  ...formData.expectations,
                  understood: e.target.checked
                }
              })}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              I understand the program requirements and expectations as outlined above.
            </span>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.expectations.agreed}
              onChange={(e) => setFormData({
                ...formData,
                expectations: {
                  ...formData.expectations,
                  agreed: e.target.checked
                }
              })}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              I agree to the terms and conditions of the application process.
            </span>
          </label>
        </div>
      </motion.div>

      {/* Final Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
      >
        <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          By checking both boxes and submitting, you confirm that all information provided is accurate and complete.
        </p>
      </motion.div>
    </div>
  )
}