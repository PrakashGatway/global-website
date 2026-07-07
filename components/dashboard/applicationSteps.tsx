'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, AlertCircle, Check, X, FileText,
  Download, Upload, GraduationCap, Plus, ChevronUp,
  ChevronDown, DollarSign, BookOpen, Users,
  IndianRupee, Eye, MapPin, Building2, Award,
  Globe, ChevronRight, ChevronLeft, ChevronFirst, ChevronLast,
  PlusIcon
} from 'lucide-react'
import axiosInstance from '@/app/axiosInstance'
import toast from 'react-hot-toast'
import Image from 'next/image'

// Types
interface BackupProgram {
  _id: string
  name: string
  university: {
    _id: string
    name: string
    uni_logo?: string
    country: string
    city: string
    intakes?: string[]
  }
  tuitionFee?: number
  currency?: string
  level?: string
  duration?: string
  intake?: string
}

interface BackupWithIntake extends BackupProgram {
  priority: number
  selectedIntake: string
  programId: string
  programName: string
  availableIntakes: string[]
}

interface ApplicationFormProps {
  program: any
  formData: any
  setFormData: (data: any) => void
  availableIntakes?: string[]
}

export function ApplicationForm({ program, formData, setFormData, availableIntakes }: ApplicationFormProps) {
  const intakes = React.useMemo(() => {
    if (availableIntakes && availableIntakes.length > 0) {
      return availableIntakes.map((intake, index) => {
        const parts = intake.split(' ')
        const month = parts[0]
        const year = new Date().getFullYear()

        const deadlineDate = new Date()
        deadlineDate.setMonth(deadlineDate.getMonth() + (index + 1))

        return {
          id: intake.toLowerCase().replace(' ', ''),
          month,
          year,
          deadline: deadlineDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          status: index === 0 ? 'available' : index === 1 ? 'available' : 'coming-soon',
          fullIntake: intake
        }
      })
    }
    return [
      { id: 'fall', month: 'Fall', status: 'available', fullIntake: 'Fall 2024' },
      { id: 'spring', month: 'Spring', status: 'available', fullIntake: 'Spring 2025' },
    ]
  }, [availableIntakes])

  return (
    <div className="space-y-2">
      {/* Intake Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-2"
      >
        <h3 className="text-base font-bold text-gray-700">Select Intake</h3>
        <p className="text-xs text-gray-500 mb-4">
          Choose your preferred intake date for this program.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {intakes.map((intake, index) => (
            <motion.label
              key={intake.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative flex items-center p-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.selectedIntake === intake.fullIntake
                ? 'border-[#F26D44] bg-orange-50'
                : 'border-gray-300 hover:border-gray-300'
                }`}
            >
              <input
                type="radio"
                name="intake"
                value={intake.fullIntake}
                checked={formData.selectedIntake === intake.fullIntake}
                onChange={(e) => setFormData({ ...formData, selectedIntake: e.target.value })}
                className="sr-only"
              />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={formData.selectedIntake === intake.fullIntake ? '' : ''}>
                    <Calendar className={`w-7 h-7 stroke-[1.5px] ${formData.selectedIntake === intake.fullIntake ? 'text-[#F26D44]' : 'text-gray-700'
                      }`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {intake.month}
                    </p>
                  </div>
                </div>
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
          <p className="text-xs text-red-700 font-medium">
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

  function toNormalCase(str) {
    return str
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .trim()
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter
  }

  const prerequisites = React.useMemo(() => {
    let prereqs = []
    //console.log(program.requirements)
    if (program.requirements) {
      prereqs = Object.entries(program?.requirements).map(([name, data]) => ({
        name,
        value: data
      }));
    }
    return prereqs
  }, [program])

  return (
    <div className="p-3">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Program Prerequisites</h3>
        <p className="text-xs text-gray-500">
          Please review all requirements and documents to proceed with your application.
        </p>
      </motion.div>

      {program?.metaInfo?.EntryRequirement && (
        <div className='mt-3'>
          <h3 className='text-gray-600 mb-1 font-bold'>
            Entry Requirements
          </h3>

          <p className="text-gray-700 font-medium">
            {program?.metaInfo?.EntryRequirement}
          </p>
        </div>
      )}

      {/* Prerequisites List */}
      <div className="space-y-3 grid grid-cols-2 gap-2 mt-4">
        {prerequisites.map((prerequisite, index) => (
          <motion.div
            key={index}
            className="p-3 border-2 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <div className="">
                <div className="">
                  <h4 className="font-medium uppercase text-gray-900">{toNormalCase(prerequisite.name)}</h4>
                </div>
                <p className="text-base text-gray-500 mt-1">{prerequisite.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Program Details Modal Component
interface ProgramDetailsModalProps {
  program: BackupProgram
  isOpen: boolean
  onClose: () => void
  onSelect: (program: BackupProgram, selectedIntake: string) => void
}

function ProgramDetailsModal({ program, isOpen, onClose, onSelect }: ProgramDetailsModalProps) {
  const [selectedIntake, setSelectedIntake] = React.useState<string>('')

  // Get available intakes for this program
  const availableIntakes = React.useMemo(() => {
    return program.university?.intakes || [program.intake].filter(Boolean) || ['Fall 2024', 'Spring 2025']
  }, [program])

  React.useEffect(() => {
    if (availableIntakes.length > 0 && !selectedIntake) {
      setSelectedIntake(availableIntakes[0])
    }
  }, [availableIntakes, selectedIntake])

  const handleSelect = () => {
    if (!selectedIntake) {
      toast.error('Please select an intake')
      return
    }
    onSelect(program, selectedIntake)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-[#F26D44] to-[#626363] p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg p-3 flex items-center justify-center">
                    {program.university?.uni_logo ? (
                      <Image
                        src={program.university.uni_logo}
                        alt={program.university.name}
                        width={80}
                        loading="lazy"
                        height={80}
                        className="object-contain"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-16 p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{program.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{program.university?.name}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{program.university?.city}, {program.university?.country}</p>
                  </div>
                </div>

                {/* Program Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-[#F26D44]" />
                      <span className="text-sm font-medium text-gray-700">Level</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{program.level || 'Graduate'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-[#F26D44]" />
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{program.duration || '2 Years'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="w-4 h-4 text-[#F26D44]" />
                      <span className="text-sm font-medium text-gray-700">Tuition Fee</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {program.currency || 'USD'} {program.tuitionFee?.toLocaleString() || 'Contact Uni'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#F26D44]" />
                      <span className="text-sm font-medium text-gray-700">Next Intake</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{program.intake || 'Rolling'}</p>
                  </div>
                </div>

                {/* Intake Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Intake for Backup Program <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedIntake}
                    onChange={(e) => setSelectedIntake(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#F26D44] focus:outline-none transition-colors"
                  >
                    <option value="">Choose an intake</option>
                    {availableIntakes.map((intake) => (
                      <option key={intake} value={intake}>
                        {intake}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSelect}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#F26D44] to-[#626363] text-white rounded-xl hover:from-[#d55a3a] hover:to-[#4a4a4a] transition-colors font-medium"
                  >
                    Add as Backup
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface BackupsFormProps {
  program: any
  formData: any
  setFormData: (data: any) => void
}

export function BackupsForm({ program, formData, setFormData }: BackupsFormProps) {
  const [showProgramSelector, setShowProgramSelector] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedProgramForDetails, setSelectedProgramForDetails] = React.useState<BackupProgram | null>(null)
  const [availablePrograms, setAvailablePrograms] = React.useState<BackupProgram[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const fetchAvailablePrograms = async () => {
    setIsLoading(true)
    const params = new URLSearchParams({
      isExtra: 'false',
      university: program.university?._id
    })
    try {
      const response = await axiosInstance.get(`/courses?${params}&limit=20`)
      const data = response.data.result || response.data.data || []
      const filtered = data.filter((p: any) => p._id !== program._id)
      setAvailablePrograms(filtered)
    } catch (error) {
      toast.error('Failed to fetch programs. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchAvailablePrograms()
  }, [])

  const addBackup = (backupProgram: BackupProgram, selectedIntake: string) => {
    if (formData.backups.length >= 10) {
      toast.error('Maximum 10 backup programs allowed')
      return
    }

    // Check if program already added
    if (formData.backups.some((b: BackupWithIntake) => b.programId === backupProgram._id)) {
      toast.error('This program is already added as a backup')
      return
    }

    const newBackup: BackupWithIntake = {
      ...backupProgram,
      priority: formData.backups.length + 1,
      programId: backupProgram._id,
      programName: backupProgram.name,
      selectedIntake,
      availableIntakes: backupProgram.university?.intakes || [backupProgram.intake].filter(Boolean) || ['Fall 2024', 'Spring 2025']
    }

    setFormData({
      ...formData,
      backups: [...formData.backups, newBackup]
    })

    toast.success('Backup program added successfully')
  }

  const removeBackup = (index: number) => {
    const newBackups = formData.backups.filter((_: any, i: number) => i !== index)
    newBackups.forEach((backup: BackupWithIntake, i: number) => {
      backup.priority = i + 1
    })
    setFormData({ ...formData, backups: newBackups })
    toast.success('Backup program removed')
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newBackups = [...formData.backups]
    const temp = newBackups[index]
    newBackups[index] = newBackups[index - 1]
    newBackups[index - 1] = temp
    newBackups.forEach((backup: BackupWithIntake, i: number) => {
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
    newBackups.forEach((backup: BackupWithIntake, i: number) => {
      backup.priority = i + 1
    })
    setFormData({ ...formData, backups: newBackups })
  }

  const updateBackupIntake = (index: number, newIntake: string) => {
    const newBackups = [...formData.backups]
    newBackups[index].selectedIntake = newIntake
    setFormData({ ...formData, backups: newBackups })
  }

  return (
    <div className="space-y-3 mt-3">
      {/* Current Backups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 border-2"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">
              Backup Programs ({formData.backups.length}/10)
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Add backup programs with their preferred intakes
            </p>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            Max 10
          </span>
        </div>

        {formData.backups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed"
          >
            <div className="flex items-center justify-center mx-auto mb-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <GraduationCap className="w-12 h-12 stroke-[1px] text-[#F26D44]" />
              </div>
            </div>
            <p className="text-gray-700 font-medium">No backup programs added yet</p>
            <p className="text-gray-400 text-xs mt-1 mb-4">
              Click the button below to explore and add backup options
            </p>
            <button
              onClick={() => setShowProgramSelector(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F26D44] text-white rounded-lg hover:bg-[#d55a3a] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Backup
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {formData.backups.map((backup: BackupWithIntake, index: number) => (
                <motion.div
                  key={`${backup.programId}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-[#F26D44] transition-colors group"
                >
                  {/* Priority Badge */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Priority #{backup.priority}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded hover:bg-white transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === formData.backups.length - 1}
                          className={`p-1 rounded hover:bg-white transition-colors ${index === formData.backups.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeBackup(index)}
                      className="p-1 rounded hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Program Info */}
                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                        {backup.university?.uni_logo ? (
                          <Image
                            src={backup.university.uni_logo}
                            alt={backup.university.name}
                            width={60}
                            loading="lazy"
                            height={60}
                            className="object-contain"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{backup.name}</h5>
                        <p className="text-sm text-gray-600">{backup.university?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {backup.university?.city}, {backup.university?.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Intake Selection */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Select Intake <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={backup.selectedIntake || ''}
                          onChange={(e) => updateBackupIntake(index, e.target.value)}
                          className="w-full p-2 text-sm border-2 border-gray-200 rounded-lg focus:border-[#F26D44] focus:outline-none"
                        >
                          <option value="">Choose intake</option>
                          {backup.availableIntakes?.map((intake) => (
                            <option key={intake} value={intake}>
                              {intake}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Tuition Fee
                        </label>
                        <div className="p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                          {backup.currency || 'USD'} {backup.tuitionFee?.toLocaleString() || 'Contact Uni'}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-3 flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {backup.level || 'Graduate'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {backup.duration || '2 Years'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add More Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProgramSelector(true)}
              disabled={formData.backups.length >= 10}
              className={`mt-4 w-full py-4 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${formData.backups.length >= 10
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400'
                : 'border-[#F26D44] border-opacity-30 hover:border-[#F26D44] hover:bg-orange-50 text-[#F26D44]'
                }`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Backup Program</span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Program Selector Modal */}
      <AnimatePresence>
        {showProgramSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center p-4"
            onClick={() => setShowProgramSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 py-4 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Select Backup Program</h3>
                    <p className="text-xs text-gray-500">
                      Choose from available programs at {program.university?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowProgramSelector(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto min-h-[50vh] max-h-[calc(90vh-200px)]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[#F26D44] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : availablePrograms.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No programs found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availablePrograms.map((prog) => (
                      <motion.div
                        key={prog._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group"
                      >
                        <div className="flex items-center gap-4 p-4 py-3 bg-gray-100 rounded-xl hover:bg-orange-50 transition-colors border-2 border-transparent hover:border-[#F26D44]">
                          <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg p-2 flex items-center justify-center">
                            {prog.university?.uni_logo ? (
                              <Image
                                src={prog.university.uni_logo}
                                alt={prog.university.name}
                                width={60}
                                height={60}
                                loading="lazy"
                                className="object-contain"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium  text-gray-900">{prog.name}</h4>
                            <p className="text-xs text-gray-600">{prog.university?.name}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {prog.level || 'Graduate'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {prog.currency || 'USD'} {prog.tuitionFee?.toLocaleString() || 'Contact Uni'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center h-full">
                            {/* <button
                              onClick={() => setSelectedProgramForDetails(prog)}
                              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5 text-gray-600" />
                            </button> */}
                            <button
                              onClick={() => {
                                const defaultIntake = prog.university?.intakes?.[0] || prog.intake || 'Fall 2024'
                                addBackup(prog, defaultIntake)
                                setShowProgramSelector(false)
                              }}
                              className="p-3 rounded-full bg-white hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                              <PlusIcon className="w-7 h-7" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={() => setShowProgramSelector(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Program Details Modal */}
      {selectedProgramForDetails && (
        <ProgramDetailsModal
          program={selectedProgramForDetails}
          isOpen={!!selectedProgramForDetails}
          onClose={() => setSelectedProgramForDetails(null)}
          onSelect={(prog, intake) => {
            addBackup(prog, intake)
            setSelectedProgramForDetails(null)
            setShowProgramSelector(false)
          }}
        />
      )}

      {/* Validation Note */}
      {formData.backups.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-blue-700 font-medium">Intake Selection Required</p>
            <p className="text-xs text-blue-600 mt-1">
              Please select an intake for each backup program. This helps us process your applications correctly.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface ExpectationsFormProps {
  program: any
  formData: any
  setFormData: (data: any) => void
}

export function ExpectationsForm({ program, formData, setFormData }: ExpectationsFormProps) {
  const expectations = React.useMemo(() => {
    const items = [
      {
        icon: Clock,
        title: 'Program Duration',
        description: program.duration || '4 years full-time study',
        color: 'blue'
      },
      {
        icon: BookOpen,
        title: 'Study Mode',
        description: program.studyMode || 'Full-time on campus',
        color: 'green'
      },
      {
        icon: DollarSign,
        title: 'Tuition & Fees',
        description: `${program.currency || 'USD'} ${program.tuitionFee?.toLocaleString() || 'Contact university'} per year`,
        color: 'purple'
      },
      {
        icon: Users,
        title: 'Class Size',
        description: 'Average 25-30 students per class',
        color: 'orange'
      }
    ]

    return items
  }, [program])

  return (
    <div className="space-y-2 mt-3 p-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=""
      >
        <h3 className="text-lg font-semibold text-gray-900">What to Expect</h3>
        <p className="text-xs text-gray-500">
          Please review the following information about your program and university.
        </p>
      </motion.div>

      {/* Important Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 mt-3 border-2"
      >
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          Important Information
        </h4>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-red-600">1</span>
            </div>
            <p className="text-sm text-gray-600">
              Application deadline: <span className="font-medium text-red-600">{program.deadline || 'Rolling admission'}</span>.
              Late applications may not be considered.
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border-2"
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
              className="mt-1 w-4 h-4 text-[#F26D44] rounded focus:ring-[#F26D44]"
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
              className="mt-1 w-4 h-4 text-[#F26D44] rounded focus:ring-[#F26D44]"
            />
            <span className="text-sm text-gray-600">
              I agree to the terms and conditions of the application process.
            </span>
          </label>
        </div>
      </motion.div>

      {/* Application Fee Notice */}
      {program.applicationFee && program.applicationFee > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <IndianRupee className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            An application fee of <strong>{program.currency} {program.applicationFee}</strong> will be charged upon submission.
          </p>
        </motion.div>
      )}

      {/* Final Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
      >
        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-green-700">
          By checking both boxes and submitting, you confirm that all information provided is accurate and complete.
        </p>
      </motion.div>
    </div>
  )
}