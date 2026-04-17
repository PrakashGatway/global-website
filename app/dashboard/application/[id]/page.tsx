"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Save,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  MessageCircle,
  Award,
  TrendingUp,
  Star,
  Flag,
  Users,
  Briefcase,
  BookOpen,
  Home,
  Settings,
  User,
  Mail as MailIcon,
  ChevronDown,
  ChevronUp,
  FileCheck,
  FileWarning,
  FileX,
  CircleDollarSign,
  Shield,
  Globe,
  Building2,
  BadgeCheck,
  Link as LinkIcon,
  ExternalLink,
  AlertTriangle,
  Info,
  CreditCard,
  Banknote,
  Landmark,
  Percent,
  CalendarDays,
  ChevronLeft,
  Pencil,
  MoreHorizontal,
  Copy,
  Printer,
  Bell,
  BellRing,
  Check,
  HelpCircle,
  FileSignature,
  Bookmark,
  Heart,
  Share2,
  Lock,
  Unlock,
  EyeOff,
  Activity,
  MessageSquare,
  ClipboardList,
  ThumbsUp,
  ThumbsDown,
  AlertOctagon,
  CheckCheck,
  FolderOpen,
  FileUp,
  FileDown,
  RotateCcw,
  ArrowRight,
  Circle,
  CircleCheck,
  CircleDot,
  CircleDashed,
  CircleEllipsis,
  Sparkles,
  Layers,
  Zap,
  ShieldAlert,
  FileStack,
  FileCheck2,
  FileX2,
  FileClock,
  FileSearch,
  FileMinus,
  FilePlus,
  Paperclip,
  Link2,
  Image,
  Video,
  Archive,
  File,
  Loader2,
  UploadCloud,
  XCircle,
  Linkedin,
  BanknoteIcon,
  School,
  Globe2,
  Link2Icon,
  Edit2Icon
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useParams } from "next/navigation"
import axiosInstance from "@/app/axiosInstance"
import { useNotification } from "@/components/dashboard/Notification"
import { get } from "http"

// Types based on your schema
interface Document {
  id: string
  name: string
  description?: string
  status: 'Pending' | 'Approved' | 'Rejected'
  rejectReason?: string
  docUrl?: string
  docType?: string
  uploadedAt?: string
}

interface BackupProgram {
  id: string
  course: {
    _id: string
    name: string
    university?: {
      name: string
      logo?: string
    }
  }
  intake: string
  order: number
  status: 'pending' | 'processing' | 'submitted' | 'accepted' | 'rejected'
}

interface ActivityLog {
  id: string
  action: string
  description: string
  status: string
  user: string
  userType: 'student' | 'ooshas' | 'admin' | 'system'
  timestamp: string
}

interface Note {
  id: string
  content: string
  user: string
  userType: 'student' | 'ooshas' | 'admin'
  createdAt: string
  isPrivate?: boolean
}

interface Requirement {
  id: string
  title: string
  description: string
  type: 'document' | 'question' | 'link' | 'info'
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  state: 'required' | 'optional' | 'early_access'
  document?: Document
  questions?: Array<{
    id: string
    question: string
    answer?: string
    status: 'pending' | 'answered' | 'reviewed'
  }>
  link?: {
    url: string
    text: string
  }
  isExpanded?: boolean
}

// Primary status steps configuration
const PRIMARY_STATUS_STEPS = [
  { key: 'Pending', label: 'Application Created', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { key: 'Started', label: 'Application Started', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { key: 'ReviewbyOoshas', label: 'Under OOSHAS Review', icon: FileSearch, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { key: 'SubmitToSchool', label: 'Submitting to School', icon: UploadCloud, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { key: 'AwaitingSchoolResponse', label: 'Awaiting School Response', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { key: 'AdmissionProcessing', label: 'Admission Processing', icon: RefreshCw, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { key: 'PreArrival', label: 'Pre-Arrival', icon: Briefcase, color: 'text-teal-600', bgColor: 'bg-teal-100' },
  { key: 'Arrived', label: 'Arrived on Campus', icon: MapPin, color: 'text-green-600', bgColor: 'bg-green-100' }
]

export default function ApplicationDetailPage() {

  const params = useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'documents' | 'backups' | 'activity' | 'notes'>('requirements')
  const [expandedRequirements, setExpandedRequirements] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [noteContent, setNoteContent] = useState('')
  const [noteType, setNoteType] = useState<'user' | 'ooshas'>('user')
  const [activeDocTab, setActiveDocTab] = useState<'student' | 'ooshas'>('student')
  const [activeNoteTab, setActiveNoteTab] = useState<'all' | 'student' | 'ooshas' | 'admin'>('all')
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<any>(null)

  const [showIntakeModal, setShowIntakeModal] = useState(false)
  const [selectedIntake, setSelectedIntake] = useState("")

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'review'>('all')

  useEffect(() => {
    fetchApplication()
  }, [params.id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/applications/${params.id}`)
      const data = response.data?.data
      console.log(data)
      setApplication(data)
    } catch (error) {
      console.error('Error fetching application details:', error)
    } finally {
      setLoading(false)
    }
  }

  const [documents, setDocuments] = useState<Document[]>([])
  const [ooshasDocuments, setOoshasDocuments] = useState<Document[]>([])
  const [backups, setBackups] = useState<BackupProgram[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const requirements: Requirement[] = []

  const filteredRequirements = requirements.filter((r) => {
    if (activeFilter === "all") return true
    if (activeFilter === "review") return r.status === "in_review"
    return r.status === activeFilter
  })

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Rejected':
      case 'rejected':
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'in_review':
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      case 'submitted':
        return <UploadCloud className="w-4 h-4 text-purple-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      'Approved': 'bg-green-100 text-green-700 border-green-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Completed': 'bg-green-100 text-green-700 border-green-200',
      'Failed': 'bg-red-100 text-red-700 border-red-200',
      'processing': 'bg-blue-100 text-blue-700 border-blue-200',
      'submitted': 'bg-purple-100 text-purple-700 border-purple-200',
      'accepted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'in_review': 'bg-blue-100 text-blue-700 border-blue-200',
      'approved': 'bg-green-100 text-green-700 border-green-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return styles[status] || styles.pending
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Failed':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <FileCheck2 className="w-5 h-5 text-green-600" />
      case 'Rejected':
        return <FileX2 className="w-5 h-5 text-red-600" />
      default:
        return <FileClock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'student':
        return <User className="w-4 h-4 text-blue-600" />
      case 'ooshas':
        return <Shield className="w-4 h-4 text-purple-600" />
      case 'admin':
        return <Settings className="w-4 h-4 text-amber-600" />
      default:
        return <Zap className="w-4 h-4 text-gray-600" />
    }
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'student': return 'bg-blue-100'
      case 'ooshas': return 'bg-purple-100'
      case 'admin': return 'bg-amber-100'
      default: return 'bg-gray-100'
    }
  }

  const handleFileUpload = (documentId: string) => {
    setUploadProgress(prev => ({ ...prev, [documentId]: 0 }))
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const progress = prev[documentId] || 0
        if (progress >= 100) {
          clearInterval(interval)
          if (activeDocTab === 'student') {
            setDocuments(prev => prev.map(doc =>
              doc.id === documentId ? { ...doc, status: 'Pending' } : doc
            ))
          } else {
            setOoshasDocuments(prev => prev.map(doc =>
              doc.id === documentId ? { ...doc, status: 'Pending' } : doc
            ))
          }
          return { ...prev, [documentId]: 100 }
        }
        return { ...prev, [documentId]: progress + 10 }
      })
    }, 200)
  }

  const handleAddNote = () => {
    if (!noteContent.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      content: noteContent,
      user: noteType === 'user' ? 'John Doe' : 'OOSHAS Agent',
      userType: noteType === 'user' ? 'student' : 'ooshas',
      createdAt: new Date().toISOString(),
      isPrivate: noteType === 'ooshas'
    }

    setNotes(prev => [newNote, ...prev])
    setNoteContent('')
  }

  const handleBackupReorder = (dragIndex: number, dropIndex: number) => {
    const reordered = [...backups]
    const [dragged] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, dragged)

    const updated = reordered.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    setBackups(updated)
  }

  const toggleRequirement = (id: string) => {
    setExpandedRequirements(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const currentStepIndex = PRIMARY_STATUS_STEPS.findIndex(step => step.key === application?.primaryStatus)
  const isStepCompleted = (index: number) => index < currentStepIndex
  const isStepCurrent = (index: number) => index === currentStepIndex

  const filteredNotes = notes.filter((note: Note) => {
    if (activeNoteTab === 'all') return true
    return note.userType === activeNoteTab
  })

  const filteredActivity = activityLogs

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const notification = useNotification()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-5 bg-gray-200 rounded w-64"></div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="relative max-w-7xl mx-auto px-4 overflow-y-auto">
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Change Intake</h2>
              <button onClick={() => setShowIntakeModal(false)}>✖</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
              {(application?.course?.university?.intakes || application?.intake ? [application.intake, "September 2026", "January 2027", "May 2027", "September 2027"] : ["September 2026", "January 2027", "May 2027", "September 2027", "January 2028"]).map((item: string) => (
                <div
                  key={item}
                  onClick={() => setSelectedIntake(item)}
                  className={`border rounded-lg p-3 cursor-pointer transition ${selectedIntake === item ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-400"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input type="radio" checked={selectedIntake === item} readOnly />
                    <p className="font-medium text-sm">{item}</p>
                  </div>
                  <p className="text-xs text-gray-500">Success: High (75%)</p>
                  <p className="text-xs text-gray-500">Status: Open</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowIntakeModal(false)} className="px-3 py-1 text-sm border rounded-md">Cancel</button>
              <button onClick={() => { console.log("Selected Intake:", selectedIntake); setShowIntakeModal(false); }} className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-top gap-3">
            {application?.course?.university?.uni_logo ? (
              <img
                src={application.course.university.uni_logo}
                alt={application.course.university.name}
                className="w-12 h-12 mt-1 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-orange-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-medium text-gray-800">{application?.course?.name}</h1>
                  <span className="inline-flex"><Link href={`/dashboard/programs/${application?.course?.slug}`} className="text-blue-500 underline"><Link2Icon className="w-6 h-6" /></Link></span>
                </div>
                {application?.paymentStatus == "Pending" && <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getPaymentStatusBadge(application?.paymentStatus)}`}>
                  {application?.paymentStatus === 'Completed' ? <CheckCircle className="w-3.5 h-3.5" /> :
                    application?.paymentStatus === 'Failed' ? <XCircle className="w-3.5 h-3.5" /> :
                      <Clock className="w-3.5 h-3.5" />}
                  Payment: {application?.paymentStatus || 'Pending'}
                </span>}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{application?.course?.university?.name}  </span>
                <span className="inline-flex"><Link href={`/dashboard/universities/${application?.course?.university?.slug}`} className="text-blue-500 underline"><Link2Icon className="w-5 h-5" /></Link></span>
                <span className="text-gray-300">•</span>
                <Globe2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{application?.country}</span>
              </div>
              <div className="flex items-center text-gray-700 text-sm gap-2 mt-1">
                <span>Application No: {application?.applicationNumber}</span> |
                <span>Selected Intake: {application?.intake}</span> <button onClick={() => setShowIntakeModal(true)} className="inline-flex hover:text-blue-500 p-1 transition-colors"><Edit2Icon className="w-4 h-4" /></button> |
                <span>Submission deadline: {application?.deadline || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="mt-2 w-full border-t pt-5">
          {/* Desktop View: Horizontal Stepper */}
          <div className="hidden md:block relative">
            <div className="relative flex justify-between items-start">
              {PRIMARY_STATUS_STEPS.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = isStepCompleted(index)
                const isCurrent = isStepCurrent(index)
                const isLast = index === PRIMARY_STATUS_STEPS.length - 1
                const nextStepCompleted = index < PRIMARY_STATUS_STEPS.length - 1 && isStepCompleted(index + 1)
                const connectorColor = nextStepCompleted ? "bg-emerald-500" : "bg-slate-300"

                return (
                  <div key={step.key} className="flex relative flex-col items-center relative flex-1">
                    <div className={`absolute top-5 w-full left-1/2 max-auto h-0.5 bg-gray-400 ${nextStepCompleted ? "bg-emerald-600" : "bg-slate-300"} ${isLast ? "hidden" : ""}`}>
                    </div>
                    <div className="relative flex items-center justify-center mb-2">

                      {isCurrent && <div className="absolute w-12 h-12 rounded-full bg-orange-400 animate-ping opacity-20" />}
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] border-2 transition-all duration-300 ${isCompleted ? "bg-emerald-500 border-emerald-100 text-white" : isCurrent ? "bg-white border-orange-500 text-orange-600 scale-105" : "bg-white border-slate-200 text-slate-600"}`}>
                        <StepIcon className="w-5 h-5" />
                        {isCompleted && (
                          <div className="absolute p-1.5 bg-primary rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]">
                            <svg className=" w-5 h-5 text-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`text-[13px] font-medium text-center word-break word-wrap whitespace-wrap leading-tight ${isCurrent ? "text-orange-600" : isCompleted ? "text-emerald-600" : "text-slate-600"}`}>
                      {step.label}
                    </p>
                    {index < PRIMARY_STATUS_STEPS.length - 1 && (
                      <div className="absolute top-4 left-1/2 w-full h-[2px] -z-10">
                        <div className={`h-full w-full ${connectorColor}`} style={{ transform: "translateX(0%)" }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="md:hidden relative pl-8 space-y-3 before:absolute before:left-[11px] before:top-2 before:h-full before:w-0.5 before:bg-slate-200">
            {PRIMARY_STATUS_STEPS.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = isStepCompleted(index)
              const isCurrent = isStepCurrent(index)
              return (
                <div key={step.key} className="relative flex items-start gap-1">
                  <div className={`absolute -left-[38px] top-1 w-8 h-8 rounded-full border-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] flex items-center justify-center bg-white z-10 ${isCompleted ? "border-emerald-500 text-emerald-500" : isCurrent ? "border-orange-500 text-orange-500" : "border-slate-300 text-slate-300"}`}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-orange-500 animate-pulse" : "bg-slate-300"}`} />
                    )}
                  </div>
                  <div className={`flex-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] p-4 rounded-xl border transition-all ${isCurrent ? "bg-orange-50/50 border-orange-200 shadow-sm" : isCompleted ? "bg-emerald-50/30 border-emerald-100" : "bg-white border-slate-100 opacity-70"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <StepIcon className={`w-4 h-4 ${isCurrent ? "text-orange-600" : isCompleted ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className={`text-sm font-bold ${isCurrent ? "text-orange-900" : "text-slate-700"}`}>{step.label}</span>
                    </div>
                    {isCurrent && <p className="text-xs text-orange-700 mt-1 font-medium">In Progress</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 pt-2">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'requirements', label: 'Requirements', icon: ClipboardList },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'backups', label: 'Backup Programs', icon: Layers },
              { id: 'activity', label: 'Activity Log', icon: Activity },
              { id: 'notes', label: 'Notes', icon: MessageSquare }
            ].map(tab => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-md text-base font-medium whitespace-nowrap transition-all duration-200 ${isActive ? 'text-orange-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  {tab.label}
                  {isActive && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-orange-500 rounded-full" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto px-2 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'requirements' && (
            <motion.div
              key="requirements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-orange-500/5 to-transparent">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-orange-500" />
                  Application Requirements
                </h3>
                <p className="text-sm text-gray-500 mt-1">Complete all required items to proceed with your application</p>
              </div>
              <div className="divide-y divide-gray-100">
                {[...application?.documents,...application?.extraRequirements].map((req) => (
                  <div key={req.id} className="hover:bg-gray-50 transition-colors">
                    <div onClick={() => toggleRequirement(req.id)} className="p-5 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(req.status)}`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(req.status)}
                                {req.status === 'rejected' && 'Rejected'}
                                {req.status === 'in_review' && 'In Review'}
                                {req.status === 'approved' && 'Approved'}
                                {req.status === 'pending' && 'Pending'}
                              </span>
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${req.state === 'required' ? 'bg-red-100 text-red-700' : req.state === 'optional' ? 'bg-gray-100 text-gray-700' : 'bg-purple-100 text-purple-700'}`}>
                              {req.state === 'required' ? 'Required' : req.state === 'optional' ? 'Optional' : 'Early Access'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{req.type}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 text-lg">{req.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                          {req.type === 'link' && req.link && (
                            <a href={req.link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2" onClick={(e) => e.stopPropagation()}>
                              <LinkIcon className="w-3 h-3" />
                              {req.link.text}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedRequirements.includes(req.id) ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button onClick={() => setActiveDocTab('student')} className={`px-6 py-3 text-sm font-medium relative ${activeDocTab === 'student' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
                      Student Documents
                      {activeDocTab === 'student' && <motion.div layoutId="docTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
                    </button>
                    <button onClick={() => setActiveDocTab('ooshas')} className={`px-6 py-3 text-sm font-medium relative ${activeDocTab === 'ooshas' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
                      OOSHAS Documents
                      {activeDocTab === 'ooshas' && <motion.div layoutId="docTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid gap-4">
                    {(activeDocTab === 'student' ? (application?.documents || []) : (application?.OoshasDocuments || [])).length === 0 ? (
                      <div className="text-center py-12">
                        <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No documents uploaded yet</p>
                        <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">Upload First Document</button>
                      </div>
                    ) : (
                      (activeDocTab === 'student' ? application?.documents : application?.OoshasDocuments).map((doc: any) => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">{getDocumentStatusIcon(doc.status)}</div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(doc.status)}`}>{doc.status}</span>
                                </div>
                                {doc.description && <p className="text-sm text-gray-500">{doc.description}</p>}
                                {doc.rejectReason && (
                                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1 bg-red-50 p-2 rounded">
                                    <AlertTriangle className="w-3 h-3" />
                                    {doc.rejectReason}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-400">Uploaded: {doc.uploadedAt ? format(new Date(doc.uploadedAt), 'MMM dd, yyyy') : 'Not uploaded'}</span>
                                  {doc.docUrl && (
                                    <a href={doc.docUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      View Document
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            {doc.status === 'Rejected' && (
                              <button onClick={() => handleFileUpload(doc.id)} className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors">Re-upload</button>
                            )}
                          </div>
                          {uploadProgress[doc.id] !== undefined && uploadProgress[doc.id] < 100 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Uploading...</span>
                                <span className="text-xs text-gray-500">{uploadProgress[doc.id]}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress[doc.id]}%` }} className="h-full bg-orange-500" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'backups' && (
            <motion.div
              key="backups"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-orange-500" />
                    Backup Programs
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Drag to reorder your backup preferences</p>
                </div>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Backup
                </button>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {(application?.backups || []).map((backup: any, index: number) => (
                    <div key={backup._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-gray-200 cursor-move">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">{backup.order}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{backup.course.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(backup.status || 'pending')}`}>{backup.status || 'pending'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {backup.course.university?.name || 'University'}
                          </span>
                          <span className="text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {backup.intake}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors"><Eye className="w-4 h-4 text-gray-600" /></button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-gray-600" /></button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-gray-600" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Activity Log
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredActivity.map((log) => (
                  <div key={log.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getUserTypeColor(log.userType)}`}>{getUserTypeIcon(log.userType)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{log.action}</h4>
                          <span className="text-xs text-gray-500">{format(new Date(log.timestamp), 'MMM dd, yyyy h:mm a')}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-500">By: {log.user}</span>
                          {log.status && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className={`px-2 py-0.5 rounded-full ${getStatusBadge(log.status)}`}>{log.status}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  Notes & Communication
                </h3>
                <div className="flex gap-2 border-b border-gray-200 pb-2">
                  {['all', 'student', 'ooshas', 'admin'].map((tab) => (
                    <button key={tab} onClick={() => setActiveNoteTab(tab as any)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeNoteTab === tab ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{tab}</button>
                  ))}
                </div>
              </div>
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setNoteType('user')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${noteType === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                    <User className="w-4 h-4" />
                    Student Note
                  </button>
                  <button onClick={() => setNoteType('ooshas')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${noteType === 'ooshas' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                    <Shield className="w-4 h-4" />
                    OOSHAS Note {noteType === 'ooshas' && '(Private)'}
                  </button>
                </div>
                <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder={noteType === 'ooshas' ? "Add a private note for OOSHAS team..." : "Add a note for the student..."} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" rows={3} />
                <div className="flex justify-end mt-3">
                  <button onClick={handleAddNote} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors">Add Note</button>
                </div>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getUserTypeColor(note.userType)}`}>{getUserTypeIcon(note.userType)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{note.user}</h4>
                            {note.isPrivate && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1"><Lock className="w-3 h-3" />Private</span>}
                          </div>
                          <span className="text-xs text-gray-500">{format(new Date(note.createdAt), 'MMM dd, yyyy h:mm a')}</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${note.userType === 'student' ? 'bg-blue-100 text-blue-700' : note.userType === 'ooshas' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{note.userType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}