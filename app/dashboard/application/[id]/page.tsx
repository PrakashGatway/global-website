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
  XCircle
} from "lucide-react"
import Link from "next/link"
import { format, set } from "date-fns"
import { useParams } from "next/navigation"
import axiosInstance from "@/app/axiosInstance"

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
    university: {
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
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'documents' | 'backups' | 'activity' | 'notes'>('overview')
  const [expandedRequirements, setExpandedRequirements] = useState<string[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [noteContent, setNoteContent] = useState('')
  const [noteType, setNoteType] = useState<'user' | 'ooshas'>('user')
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [activeDocTab, setActiveDocTab] = useState<'student' | 'ooshas'>('student')
  const [activeNoteTab, setActiveNoteTab] = useState<'all' | 'student' | 'ooshas' | 'admin'>('all')
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState()


  useEffect(() => {
    fetchApplication()
  }, [params.id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/applications/${params.id}`)
      const data = response.data?.data
      setApplication(data)
    } catch (error) {
      console.error('Error fetching course details:', error)
    } finally {
      setLoading(false)
    }
  }

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Passport Copy",
      description: "Valid passport with at least 6 months validity",
      status: "Approved",
      docUrl: "/docs/passport.pdf",
      docType: "application/pdf",
      uploadedAt: "2024-01-16T11:20:00Z"
    },
    {
      id: "2",
      name: "Academic Transcripts",
      description: "High school transcripts with English translation",
      status: "Pending",
      docUrl: "/docs/transcripts.pdf",
      docType: "application/pdf",
      uploadedAt: "2024-01-16T11:25:00Z"
    },
    {
      id: "3",
      name: "English Proficiency Test",
      description: "IELTS/TOEFL score report",
      status: "Rejected",
      rejectReason: "Document is not legible. Please upload a clearer copy.",
      docUrl: "/docs/ielts.pdf",
      docType: "application/pdf",
      uploadedAt: "2024-01-16T11:30:00Z"
    }
  ])

  const [ooshasDocuments, setOoshasDocuments] = useState<Document[]>([
    {
      id: "4",
      name: "Application Form - Signed",
      description: "Signed university application form",
      status: "Approved",
      docUrl: "/docs/application-form.pdf",
      docType: "application/pdf",
      uploadedAt: "2024-01-17T09:15:00Z"
    },
    {
      id: "5",
      name: "SOP - Statement of Purpose",
      description: "Personal statement as per university guidelines",
      status: "Pending",
      docUrl: "/docs/sop.pdf",
      docType: "application/pdf",
      uploadedAt: "2024-01-17T09:20:00Z"
    }
  ])

  const [backups, setBackups] = useState<BackupProgram[]>([
    {
      id: "1",
      course: {
        _id: "101",
        name: "Bachelor of Science - Computer Science",
        university: {
          name: "University of Regina",
          logo: "/api/placeholder/40/40"
        }
      },
      intake: "January 2026",
      order: 1,
      status: 'submitted'
    },
    {
      id: "2",
      course: {
        _id: "102",
        name: "Bachelor of Business Administration",
        university: {
          name: "University of Winnipeg",
          logo: "/api/placeholder/40/40"
        }
      },
      intake: "May 2026",
      order: 2,
      status: 'processing'
    },
    {
      id: "3",
      course: {
        _id: "103",
        name: "Bachelor of Arts - Economics",
        university: {
          name: "University of Lethbridge",
          logo: "/api/placeholder/40/40"
        }
      },
      intake: "September 2026",
      order: 3,
      status: 'pending'
    }
  ])

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "1",
      action: "Application Created",
      description: "Application was successfully created",
      status: "Pending",
      user: "John Doe",
      userType: "student",
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      action: "Document Uploaded",
      description: "Passport copy uploaded successfully",
      status: "Pending",
      user: "John Doe",
      userType: "student",
      timestamp: "2024-01-16T11:20:00Z"
    },
    {
      id: "3",
      action: "Document Reviewed",
      description: "Passport copy approved by OOSHAS team",
      status: "Approved",
      user: "Sarah Johnson",
      userType: "ooshas",
      timestamp: "2024-01-17T14:30:00Z"
    },
    {
      id: "4",
      action: "Document Rejected",
      description: "English proficiency test rejected - Please upload clearer copy",
      status: "Rejected",
      user: "Sarah Johnson",
      userType: "ooshas",
      timestamp: "2024-01-17T14:35:00Z"
    }
  ])

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Student has requested expedited processing due to upcoming deadline.",
      user: "Sarah Johnson",
      userType: "ooshas",
      createdAt: "2024-01-17T15:20:00Z",
      isPrivate: true
    },
    {
      id: "2",
      content: "Need assistance with document upload for English proficiency test.",
      user: "John Doe",
      userType: "student",
      createdAt: "2024-01-18T10:15:00Z"
    },
    {
      id: "3",
      content: "Advised student to resubmit clearer copy of IELTS scorecard.",
      user: "Mike Chen",
      userType: "admin",
      createdAt: "2024-01-18T11:30:00Z"
    }
  ])

  const requirements: Requirement[] = [
    {
      id: "1",
      title: "Country Specific GPA",
      description: "Please refer to the attached link to check country specific GPA requirements for your region.",
      status: 'pending',
      state: 'required',
      type: 'link',
      link: {
        url: "http://www.ulethbridge.ca/ross/admissions/undergrad/international/intreq_table",
        text: "www.ulethbridge.ca/ross/admissions/undergrad/international/intreq_table"
      }
    },
    {
      id: "2",
      title: "Emergency Contact Information",
      description: "Please provide the details of the applicant's emergency contact information.",
      status: 'rejected',
      state: 'required',
      type: 'question',
      questions: [
        { id: "q1", question: "Full Name of Emergency Contact", status: 'answered' },
        { id: "q2", question: "Relationship to Applicant", status: 'answered' },
        { id: "q3", question: "Contact Phone Number", status: 'answered' },
        { id: "q4", question: "Alternative Contact Number", status: 'pending' }
      ]
    },
    {
      id: "3",
      title: "ApplyAlberta Account Information",
      description: "All applicants are required to create an account on ApplyAlberta and submit their application through the portal.",
      status: 'pending',
      state: 'required',
      type: 'link',
      link: {
        url: "http://www.applyalberta.ca/",
        text: "www.applyalberta.ca/"
      }
    },
    {
      id: "4",
      title: "Passport Copy",
      description: "Please attach a copy of the applicant's passport. Ensure it is valid for at least 6 months beyond your intended stay.",
      status: 'approved',
      state: 'required',
      type: 'document',
      document: documents[0]
    }
  ]

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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            {/* Breadcrumb skeleton */}
            <div className="h-5 bg-gray-200 rounded w-64"></div>

            {/* Hero skeleton */}
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

            {/* Stats skeleton */}
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
    <main className="min-h-screen">
      {/* Header */}
      <div className="sticky top-2 z-10">
        <div className="container mx-auto px-2 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/application"
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-1">

                  <h1 className="text-xl font-bold text-gray-900">{application?.course?.name}</h1>
                  <div>

                  </div>
                  <span className="px-3  py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-mono border border-gray-200">
                    ID: {application?.applicationNumber}
                  </span>
                  {/* <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${application?.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                    application?.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                    {getStatusIcon(application?.paymentStatus)}
                    Payment: {application?.paymentStatus}
                  </span> */}
                </div>
                <p className="text-sm text-gray-500 mt-1">{application?.program}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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

          {/* Status Timeline */}


          {/* Tab Navigation */}
          <div className="flex gap-1 mt-4 border-t border-gray-200 pt-2">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'requirements', label: 'Requirements', icon: ClipboardList },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'backups', label: 'Backup Programs', icon: Layers },
              { id: 'activity', label: 'Activity Log', icon: Activity },
              { id: 'notes', label: 'Notes', icon: MessageSquare }
            ].map(tab => {
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                    ${activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto px-2 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >

              <div className="mt-8 overflow-x-auto pb-4">
                <div className="relative flex items-center min-w-[600px]">

                  {/* Background Line */}
                  {/* <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200 rounded-full"></div> */}

                  <div className="flex w-full p-0 sm:px-8 justify-between">
                    {PRIMARY_STATUS_STEPS.map((step, index) => {
                      const StepIcon = step.icon
                      const isCompleted = isStepCompleted(index)
                      const isCurrent = isStepCurrent(index)

                      return (
                        <div key={step.key} className="flex flex-col items-center relative">

                          {/* Step Circle */}
                          <div
                            className={`
                w-11 h-11 rounded-full flex items-center justify-center
                border-2 transition-all duration-300 z-10
                ${isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : isCurrent
                                  ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200"
                                  : "bg-white border-gray-300 text-gray-400"}
              `}
                          >
                            <StepIcon className="w-5 h-5" />
                          </div>

                          {/* Step Label */}
                          <span
                            className={`
                text-xs mt-3 font-medium text-center max-w-[200px]
                ${isCompleted
                                ? "text-green-600"
                                : isCurrent
                                  ? "text-orange-500"
                                  : "text-gray-500"}
              `}
                          >
                            {step.label}
                          </span>

                          {/* Connector Line */}
                          {index < PRIMARY_STATUS_STEPS.length - 1 && (
                            <div
                              className={`
                  absolute top-5 left-1/2 w-[220%] h-[3px]
                  ${isCompleted ? "bg-green-600" : "bg-gray-400"}
                `}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              {/* University Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-500/10 to-gray-500/10 border border-gray-200 p-3 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{application?.course.name}</h2>
                    <p className="text-gray-600 mt-1">{application?.program}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">App ID</p>
                        <p className="font-medium text-gray-900 font-mono">{application?.applicationNumber}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Intake</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {application?.intake}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">School</p>
                        <p className="font-medium text-gray-900">{application?.school}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Country</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {application?.university?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Documents</p>
                      <p className="text-2xl font-bold text-gray-900">{documents.length + ooshasDocuments.length}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {[...documents, ...ooshasDocuments].filter(d => d.status === 'Approved').length} approved
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Requirements</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {requirements.filter(r => r.status === 'approved').length}/{requirements.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Completed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Backup Programs</p>
                      <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
                      <p className="text-xs text-gray-500 mt-1">Selected</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment</p>
                      <p className="text-2xl font-bold text-gray-900">${application?.course.applicationFee}</p>
                      <p className="text-xs text-gray-500 mt-1">Application Fee</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Alert */}
              {application?.paymentStatus !== 'Completed' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
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
                </div>
              )}
            </motion.div>
          )}

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
                {requirements.map((req, index) => (
                  <div
                    key={req.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Requirement Header */}
                    <div
                      onClick={() => toggleRequirement(req.id)}
                      className="p-5 cursor-pointer"
                    >
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
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${req.state === 'required' ? 'bg-red-100 text-red-700' :
                              req.state === 'optional' ? 'bg-gray-100 text-gray-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                              {req.state === 'required' ? 'Required' :
                                req.state === 'optional' ? 'Optional' :
                                  'Early Access'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {req.type}
                            </span>
                          </div>

                          <h4 className="font-medium text-gray-900 text-lg">{req.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{req.description}</p>

                          {/* Requirement-specific content */}
                          {req.type === 'link' && req.link && (
                            <a
                              href={req.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <LinkIcon className="w-3 h-3" />
                              {req.link.text}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {req.type === 'document' && req.document && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm text-gray-700">{req.document.name}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(req.document.status)}`}>
                                  {req.document.status}
                                </span>
                              </div>
                              {req.document.rejectReason && (
                                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  {req.document.rejectReason}
                                </p>
                              )}
                            </div>
                          )}

                          {req.type === 'question' && req.questions && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-500 mb-2">
                                {req.questions.filter(q => q.status === 'answered').length} of {req.questions.length} questions answered
                              </p>
                              <div className="flex gap-1">
                                {req.questions.map((q) => (
                                  <div
                                    key={q.id}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${q.status === 'answered'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-400'
                                      }`}
                                  >
                                    {q.status === 'answered' ? <Check className="w-4 h-4" /> : '?'}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedRequirements.includes(req.id) ? 'rotate-180' : ''
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
                            {req.type === 'question' && req.questions && (
                              <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-700">Questions</h5>
                                {req.questions.map((q) => (
                                  <div key={q.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                    <p className="text-sm text-gray-700 font-medium">{q.question}</p>
                                    {q.answer ? (
                                      <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">{q.answer}</p>
                                    ) : (
                                      <div className="mt-2">
                                        <textarea
                                          placeholder="Enter your answer..."
                                          className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                          rows={3}
                                        />
                                        <button className="mt-2 px-3 py-1 bg-orange-500 text-white text-sm rounded-lg">
                                          Submit Answer
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {req.type === 'document' && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Upload Document</h5>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors cursor-pointer">
                                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                                  <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2 mt-4">
                              <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors">
                                Complete Now
                              </button>
                              <button className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-white transition-colors">
                                Need Help?
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
              {/* Document Tabs */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveDocTab('student')}
                      className={`px-6 py-3 text-sm font-medium relative ${activeDocTab === 'student'
                        ? 'text-orange-500'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Student Documents
                      {activeDocTab === 'student' && (
                        <motion.div
                          layoutId="docTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveDocTab('ooshas')}
                      className={`px-6 py-3 text-sm font-medium relative ${activeDocTab === 'ooshas'
                        ? 'text-orange-500'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      OOSHAS Documents
                      {activeDocTab === 'ooshas' && (
                        <motion.div
                          layoutId="docTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                        />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid gap-4">
                    {(activeDocTab === 'student' ? documents : ooshasDocuments).map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getDocumentStatusIcon(doc.status)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(doc.status)}`}>
                                  {doc.status}
                                </span>
                              </div>
                              {doc.description && (
                                <p className="text-sm text-gray-500">{doc.description}</p>
                              )}
                              {doc.rejectReason && (
                                <p className="text-xs text-red-600 mt-2 flex items-center gap-1 bg-red-50 p-2 rounded">
                                  <AlertTriangle className="w-3 h-3" />
                                  {doc.rejectReason}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-400">
                                  Uploaded: {doc.uploadedAt ? format(new Date(doc.uploadedAt), 'MMM dd, yyyy') : 'Not uploaded'}
                                </span>
                                {doc.docUrl && (
                                  <a
                                    href={doc.docUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    View Document
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {doc.status === 'Rejected' && (
                              <button
                                onClick={() => {
                                  setSelectedDocument(doc)
                                  handleFileUpload(doc.id)
                                }}
                                className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                              >
                                Re-upload
                              </button>
                            )}
                            {doc.status === 'Pending' && (
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <RefreshCw className="w-4 h-4 text-gray-600" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Upload Progress */}
                        {uploadProgress[doc.id] !== undefined && uploadProgress[doc.id] < 100 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Uploading...</span>
                              <span className="text-xs text-gray-500">{uploadProgress[doc.id]}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress[doc.id]}%` }}
                                className="h-full bg-orange-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {(activeDocTab === 'student' ? documents : ooshasDocuments).length === 0 && (
                    <div className="text-center py-12">
                      <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No documents uploaded yet</p>
                      <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">
                        Upload First Document
                      </button>
                    </div>
                  )}
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
                  {backups.map((backup, index) => (
                    <div
                      key={backup.id}
                      draggable
                      onDragStart={() => setDraggedItem(index)}
                      onDragEnd={() => setDraggedItem(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (draggedItem !== null) {
                          handleBackupReorder(draggedItem, index)
                          setDraggedItem(null)
                        }
                      }}
                      className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 transition-all ${draggedItem === index ? 'border-orange-500 opacity-50' : 'border-transparent hover:border-gray-200'
                        } cursor-move`}
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                        {backup.order}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{backup.course.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(backup.status)}`}>
                            {backup.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {backup.course.university.name}
                          </span>
                          <span className="text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {backup.intake}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
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
                {filteredActivity.map((log, index) => (
                  <div
                    key={log.id}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getUserTypeColor(log.userType)}`}>
                        {getUserTypeIcon(log.userType)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{log.action}</h4>
                          <span className="text-xs text-gray-500">
                            {format(new Date(log.timestamp), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{log.description}</p>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-500">By: {log.user}</span>
                          {log.status && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className={`px-2 py-0.5 rounded-full ${getStatusBadge(log.status)}`}>
                                {log.status}
                              </span>
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

                {/* Note Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-2">
                  {['all', 'student', 'ooshas', 'admin'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveNoteTab(tab as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeNoteTab === tab
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Note */}
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setNoteType('user')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${noteType === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                  >
                    <User className="w-4 h-4" />
                    Student Note
                  </button>
                  <button
                    onClick={() => setNoteType('ooshas')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${noteType === 'ooshas'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                  >
                    <Shield className="w-4 h-4" />
                    OOSHAS Note {noteType === 'ooshas' && '(Private)'}
                  </button>
                </div>

                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={noteType === 'ooshas'
                    ? "Add a private note for OOSHAS team..."
                    : "Add a note for the student..."}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  rows={3}
                />

                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getUserTypeColor(note.userType)}`}>
                        {getUserTypeIcon(note.userType)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{note.user}</h4>
                            {note.isPrivate && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Private
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(note.createdAt), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${note.userType === 'student' ? 'bg-blue-100 text-blue-700' :
                            note.userType === 'ooshas' ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                            {note.userType}
                          </span>
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

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
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
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Payment Methods */}
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-3 border-2 border-orange-500 bg-orange-50 rounded-lg flex flex-col items-center gap-2">
                    <CreditCard className="w-5 h-5 text-orange-500" />
                    <span className="text-xs">Card</span>
                  </button>
                  <button className="p-3 border-2 border-gray-200 rounded-lg flex flex-col items-center gap-2 hover:bg-gray-50">
                    <Landmark className="w-5 h-5 text-gray-600" />
                    <span className="text-xs">Bank Transfer</span>
                  </button>
                  <button className="p-3 border-2 border-gray-200 rounded-lg flex flex-col items-center gap-2 hover:bg-gray-50">
                    <img src="/api/placeholder/20/20" alt="PayPal" className="w-5 h-5" />
                    <span className="text-xs">PayPal</span>
                  </button>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Application Fee</span>
                    <span className="font-medium">${application?.course.applicationFee} CAD</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">$25 CAD</span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-orange-500">${application?.course.applicationFee + 25} CAD</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-gray-600 text-white rounded-lg hover:from-orange-600 hover:to-gray-700 transition-all font-medium">
                  Pay ${application?.course.applicationFee + 25} CAD
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}