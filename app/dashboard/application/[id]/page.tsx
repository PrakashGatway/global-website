"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap, MapPin, Calendar, DollarSign, FileText, Upload,
  Download, CheckCircle, AlertCircle, Clock, X, ChevronRight,
  Plus, Search, Filter, Eye, Edit2, Save, Trash2, RefreshCw,
  Mail, Phone, MessageCircle, Award, TrendingUp, Star, Flag,
  Users, Briefcase, BookOpen, Home, Settings, User, Mail as MailIcon,
  ChevronDown, ChevronUp, FileCheck, FileWarning, FileX,
  CircleDollarSign, Shield, Globe, Building2, BadgeCheck,
  Link as LinkIcon, ExternalLink, AlertTriangle, Info,
  CreditCard, Banknote, Landmark, Percent, CalendarDays,
  ChevronLeft, Pencil, MoreHorizontal, Copy, Printer,
  Bell, BellRing, Check, HelpCircle, FileSignature,
  Bookmark, Heart, Share2, Lock, Unlock, EyeOff
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

// Types
interface Requirement {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  state: 'required' | 'optional' | 'early_access'
  questionsAnswered?: number
  totalQuestions?: number
  documentsUploaded?: number
  link?: string
  linkText?: string
  isExpanded?: boolean
}

interface BackupProgram {
  id: string
  name: string
  university: string
  intake: string
  status: 'pending' | 'processing' | 'submitted'
  priority: number
  logo?: string
}

interface ApplicationJourney {
  id: string
  title: string
  status: 'completed' | 'current' | 'pending' | 'warning' | 'blocked'
  description?: string
  action?: {
    label: string
    href: string
  }
  date?: string
}

export default function ApplicationDetailPage() {
  const [activeTab, setActiveTab] = useState<'requirements' | 'documents' | 'backups' | 'timeline'>('requirements')
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [filterState, setFilterState] = useState<string[]>([])
  const [expandedRequirements, setExpandedRequirements] = useState<string[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Mock data - replace with actual API data
  const application = {
    id: "5470651",
    program: "Bachelor of Arts - Psychology (Optional Co-op)",
    university: {
      name: "University of Lethbridge",
      campus: "Lethbridge",
      country: "Canada",
      logo: "/api/placeholder/80/80",
      website: "www.ulethbridge.ca"
    },
    intake: "September 2026",
    intakeStatus: "Open",
    school: "University of Lethbridge - Lethbridge",
    paymentStatus: "pending",
    profileComplete: false
  }

  const requirements: Requirement[] = [
    {
      id: "1",
      title: "Country Specific GPA",
      description: "Please refer to the attached link to check country specific GPA requirements for your region.",
      status: 'pending',
      state: 'required',
      link: "http://www.ulethbridge.ca/ross/admissions/undergrad/international/intreq_table",
      linkText: "www.ulethbridge.ca/ross/admissions/undergrad/international/intreq_table",
      isExpanded: true
    },
    {
      id: "2",
      title: "Emergency Contact Information",
      description: "Please provide the details of the applicant's emergency contact information.",
      status: 'rejected',
      state: 'required',
      questionsAnswered: 0,
      totalQuestions: 4,
      isExpanded: false
    },
    {
      id: "3",
      title: "ApplyAlberta Account Information",
      description: "All applicants are required to create an account on ApplyAlberta and submit their application through the portal.",
      status: 'pending',
      state: 'required',
      link: "http://www.applyalberta.ca/",
      linkText: "www.applyalberta.ca/",
      isExpanded: false
    },
    {
      id: "4",
      title: "ApplyAlberta Instructions",
      description: "Follow these instructions to complete your ApplyAlberta application.",
      status: 'pending',
      state: 'required',
      documentsUploaded: 0,
      isExpanded: false
    },
    {
      id: "5",
      title: "Passport Copy",
      description: "Please attach a copy of the applicant's passport. Ensure it is valid for at least 6 months beyond your intended stay.",
      status: 'pending',
      state: 'required',
      questionsAnswered: 0,
      totalQuestions: 4,
      documentsUploaded: 0,
      isExpanded: false
    },
    {
      id: "6",
      title: "Apply for a Student Loan",
      description: "ApplyBoard partners with leading banks & financial institutions to offer education loans with competitive interest rates.",
      status: 'pending',
      state: 'optional',
      link: "https://example.com",
      linkText: "ApplyBoard requirement",
      questionsAnswered: 0,
      totalQuestions: 0,
      isExpanded: false
    }
  ]

  const backups: BackupProgram[] = [
    {
      id: "1",
      name: "Bachelor of Science - Computer Science",
      university: "University of Regina",
      intake: "January 2026",
      status: 'submitted',
      priority: 1
    },
    {
      id: "2",
      name: "Bachelor of Business Administration",
      university: "University of Winnipeg",
      intake: "May 2026",
      status: 'processing',
      priority: 2
    },
    {
      id: "3",
      name: "Bachelor of Arts - Economics",
      university: "University of Lethbridge",
      intake: "September 2026",
      status: 'pending',
      priority: 3
    }
  ]

  const journey: ApplicationJourney[] = [
    {
      id: "1",
      title: "Application created",
      status: 'completed',
      date: "2024-01-15"
    },
    {
      id: "2",
      title: "Application created",
      status: 'warning',
      description: "Action needed: Pay the application fee to get started.",
      action: {
        label: "Pay Now",
        href: "#"
      }
    },
    {
      id: "3",
      title: "You can view and edit your selected backup programs below.",
      status: 'pending'
    }
  ]

  const toggleRequirement = (id: string) => {
    setExpandedRequirements(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <X className="w-4 h-4 text-red-600" />
      case 'in_review':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      in_review: 'bg-blue-100 text-blue-700 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const getJourneyIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'current':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      case 'blocked':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getJourneyBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100'
      case 'current':
        return 'bg-blue-100'
      case 'warning':
        return 'bg-amber-100'
      case 'blocked':
        return 'bg-red-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/applications"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">Application Details</h1>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-mono">
                    ID: {application.id}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{application.program}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Printer className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* University Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 p-3 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{application.university.name}</h2>
                  <p className="text-gray-600 mt-1">{application.program}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">App ID</p>
                      <p className="font-medium text-gray-900 font-mono">{application.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Main selected intake</p>
                      <p className="font-medium text-gray-900">
                        {application.intake}, {application.intakeStatus}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Academic program school</p>
                      <p className="font-medium text-gray-900">{application.school}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Country</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {application.university.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Alert */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-amber-50 border border-amber-200 rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800">Application will not be processed until payment received.</h3>
                  <p className="text-amber-700 text-sm mt-1">
                    Your application is pending payment. Please complete the payment to proceed with the review process.
                  </p>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    Complete Payment Now
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Profile Completion Alert */}
            {!application.profileComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800">Your profile is not complete yet</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Finish your profile to view all mandatory requirements and proceed with your application.
                    </p>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Complete Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Requirements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#F26D44]" />
                    Requirements
                  </h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Requirement status</p>
                          <div className="space-y-2">
                            {['Rejected', 'In review by ApplyBoard', 'Approved'].map(status => (
                              <label key={status} className="flex items-center gap-2">
                                <input type="checkbox" className="rounded text-[#F26D44]" />
                                <span className="text-sm text-gray-700">{status}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Requirement state</p>
                          <div className="space-y-2">
                            {['Required', 'Optional', 'Early access'].map(state => (
                              <label key={state} className="flex items-center gap-2">
                                <input type="checkbox" className="rounded text-[#F26D44]" />
                                <span className="text-sm text-gray-700">{state}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="divide-y divide-gray-100">
                {requirements.map((req, index) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Requirement Header */}
                    <div
                      onClick={() => toggleRequirement(req.id)}
                      className="p-5 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(req.status)}`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(req.status)}
                                {req.status === 'rejected' && 'Rejected'}
                                {req.status === 'in_review' && 'In review by ApplyBoard'}
                                {req.status === 'approved' && 'Approved'}
                                {req.status === 'pending' && 'To be completed by applicant'}
                              </span>
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              req.state === 'required' ? 'bg-red-100 text-red-700' :
                              req.state === 'optional' ? 'bg-gray-100 text-gray-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {req.state === 'required' ? 'Required' :
                               req.state === 'optional' ? 'Optional' :
                               'Early access'}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900">{req.title}</h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{req.description}</p>
                          
                          {/* Links */}
                          {req.link && (
                            <a
                              href={req.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <LinkIcon className="w-3 h-3" />
                              {req.linkText || req.link}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {/* Questions/Documents Status */}
                          {(req.questionsAnswered !== undefined || req.documentsUploaded !== undefined) && (
                            <div className="flex items-center gap-4 mt-2 text-xs">
                              {req.questionsAnswered !== undefined && (
                                <span className="text-gray-500">
                                  {req.questionsAnswered} questions answered
                                </span>
                              )}
                              {req.documentsUploaded !== undefined && (
                                <span className="text-gray-500">
                                  {req.documentsUploaded} documents uploaded
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedRequirements.includes(req.id) ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedRequirements.includes(req.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 bg-gray-50 border-t border-gray-100">
                            <div className="space-y-4">
                              {/* Questions Section */}
                              {req.questionsAnswered !== undefined && req.totalQuestions && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Questions</h5>
                                  <div className="space-y-2">
                                    {Array.from({ length: req.totalQuestions }).map((_, i) => (
                                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                        <span className="text-sm text-gray-600">Question {i + 1}</span>
                                        {i < (req.questionsAnswered || 0) ? (
                                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Answered</span>
                                        ) : (
                                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Pending</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Documents Section */}
                              {req.documentsUploaded !== undefined && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-[#F26D44] text-white text-sm rounded-lg hover:bg-[#d55a3a] transition-colors">
                                  Complete Now
                                </button>
                                <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-white transition-colors">
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Backup Programs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#F26D44]" />
                  Backup Programs
                </h3>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Pencil className="w-4 h-4" />
                  Manage Backups
                </button>
              </div>

              <div className="space-y-3">
                {backups.map((backup, index) => (
                  <div
                    key={backup.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F26D44]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#F26D44]">#{backup.priority}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{backup.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          backup.status === 'submitted' ? 'bg-green-100 text-green-700' :
                          backup.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {backup.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{backup.university}</p>
                      <p className="text-xs text-gray-500 mt-1">Intake: {backup.intake}</p>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Application Journey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F26D44]" />
                Application journey
              </h3>

              <div className="space-y-4">
                {journey.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index < journey.length - 1 && (
                      <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full ${getJourneyBgColor(step.status)} flex items-center justify-center flex-shrink-0`}>
                        {getJourneyIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        {step.description && (
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        )}
                        {step.action && (
                          <button className="mt-2 text-sm text-[#F26D44] font-medium hover:underline">
                            {step.action.label}
                          </button>
                        )}
                        {step.date && (
                          <p className="text-xs text-gray-500 mt-1">{format(new Date(step.date), 'MMM dd, yyyy')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education Loan Offering */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Landmark className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Education Loan Offering</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ApplyBoard partners with trusted loan providers to make education more accessible, starting interest rate at 10.25%.
                  </p>
                  <button className="mt-3 text-purple-600 text-sm font-medium hover:underline flex items-center gap-1">
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Payment Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#F26D44]" />
                Payment Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Application Fee</span>
                  <span className="font-medium text-gray-900">$150 CAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-gray-900">$25 CAD</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#F26D44]">$175 CAD</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-[#F26D44] to-[#626363] text-white rounded-lg hover:from-[#d55a3a] hover:to-[#4a4a4a] transition-all font-medium"
                >
                  Submit payment now
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Contact Support</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Download Application</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Printer className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Print Summary</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <PaymentModal onClose={() => setShowPaymentModal(false)} />
        )}
      </AnimatePresence>
    </main>
  )
}

// Payment Modal Component
function PaymentModal({ onClose }: { onClose: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Complete Payment</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Payment Methods */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === 'card' ? 'border-[#F26D44] bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#F26D44]' : 'text-gray-600'}`} />
              <span className="text-xs">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('bank')}
              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === 'bank' ? 'border-[#F26D44] bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Landmark className={`w-5 h-5 ${paymentMethod === 'bank' ? 'text-[#F26D44]' : 'text-gray-600'}`} />
              <span className="text-xs">Bank Transfer</span>
            </button>
            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === 'wallet' ? 'border-[#F26D44] bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <img src="/api/placeholder/20/20" alt="PayPal" className="w-5 h-5" />
              <span className="text-xs">PayPal</span>
            </button>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Application Fee</span>
              <span className="font-medium">$150 CAD</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-medium">$25 CAD</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[#F26D44]">$175 CAD</span>
              </div>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
              />
            </div>
          )}

          <button className="w-full py-3 bg-gradient-to-r from-[#F26D44] to-[#626363] text-white rounded-lg hover:from-[#d55a3a] hover:to-[#4a4a4a] transition-all font-medium mt-4">
            Pay $175 CAD
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Missing XCircle component
const XCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)