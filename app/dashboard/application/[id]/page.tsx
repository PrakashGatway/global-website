"use client"

import { useEffect, useRef, useState } from "react"
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
  Edit2Icon,
  Send,
  Mic,
  Smile,
  MoreVertical,
  PhoneCall,
  PhoneOff,
  Voicemail,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Timer,
  UserCheck,
  UserX,
  CheckBadge,
  Link2OffIcon
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useParams } from "next/navigation"
import axiosInstance from "@/app/axiosInstance"
import DynamicFormFields from "@/components/dashboard/application/dynamicform"
import toast from "react-hot-toast"

// Types
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

interface ActivityLog {
  _id: string
  action: string
  description: string
  status: string
  user: { name: string }
  userType: 'student' | 'ooshas' | 'admin' | 'system'
  createdAt: string
  callDuration?: string
  callType?: 'incoming' | 'outgoing' | 'missed'
  metadata?: Record<string, any>
}

interface Note {
  id: string
  content: string
  user: string
  userType: 'student' | 'ooshas' | 'admin'
  createdAt: string
  isPrivate?: boolean
  attachments?: Array<{ name: string; url: string; type: string }>
  isRead?: boolean
}

interface Message {
  _id: string
  content: string
  sender: { name: string }
  senderType: 'student' | 'ooshas' | 'admin'
  createdAt: string
  isRead: boolean
  attachments?: Array<{ name: string; url: string; type: string }>
}

interface OoshasDocument {
  _id: string
  name: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
  isRequired: boolean
}

interface BackupProgram {
  _id: string
  course: {
    _id: string
    name: string
    slug: string
    university?: {
      _id: string
      name: string
      slug: string
      uni_logo?: string
    }
  }
  intake: string
  order: number
  status: 'pending' | 'processing' | 'accepted' | 'rejected'
  applicationId?: string
  submittedAt?: string
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
  const [activeTab, setActiveTab] = useState<'requirements' | 'ooshas_docs' | 'backups' | 'activity' | 'notes'>('requirements')
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [noteContent, setNoteContent] = useState('')
  const [noteType, setNoteType] = useState<'user' | 'ooshas'>('user')
  const [activeDocTab, setActiveDocTab] = useState('All')
  const [activeNoteTab, setActiveNoteTab] = useState<'all' | 'student' | 'ooshas' | 'admin'>('all')
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<any>(null)
  const [showIntakeModal, setShowIntakeModal] = useState(false)
  const [selectedIntake, setSelectedIntake] = useState("")
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [ooshasDocuments, setOoshasDocuments] = useState<OoshasDocument[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicValues, setDynamicValues] = useState({});
  const [isUpdating, setIsUpdating] = useState(false)
  let validateFormRef = useRef(null);
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedBackupIntake, setSelectedBackupIntake] = useState("")
  const [availableIntakes, setAvailableIntakes] = useState<string[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [loadingBackups, setLoadingBackups] = useState(false)

  // Fetch course intakes
  const fetchCourseIntakes = async (courseId: string) => {
    if (!courseId) {
      setAvailableIntakes([])
      setSelectedBackupIntake("")
      return
    }

    try {
      setLoadingCourses(true)
      const response = await axiosInstance.get(`/courses/${courseId}`)
      const courseData = response.data?.data
      const intakes = courseData?.university?.intakes || []
      setAvailableIntakes(intakes)
      if (intakes.length > 0) {
        setSelectedBackupIntake(intakes[0])
      }
    } catch (error) {
      console.error('Error fetching course intakes:', error)
      toast.error("Failed to fetch course intakes")
      setAvailableIntakes([])
    } finally {
      setLoadingCourses(false)
    }
  }

  // Add backup program
  const handleAddBackup = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a program")
      return
    }

    if (!selectedBackupIntake) {
      toast.error("Please select an intake")
      return
    }

    try {
      setLoadingBackups(true)

      const newBackup = {
        course: selectedCourseId,
        intake: selectedBackupIntake,
        order: (application?.backups?.length || 0) + 1
      }

      const updatedBackups = [...(application?.backups || []), newBackup]

      const response = await axiosInstance.put(
        `/applications/update/${application._id}`,
        { backups: updatedBackups }
      )
      toast.success("Backup program added successfully!")
      setShowBackupModal(false)
      resetBackupModal()
      fetchApplication();
      fetchActivities();
    } catch (error: any) {
      console.error('Error adding backup:', error)
      toast.error(error.response?.data?.message || "Failed to add backup program")
    } finally {
      setLoadingBackups(false)
    }
  }

  const resetBackupModal = () => {
    setSelectedCourseId("")
    setSelectedBackupIntake("")
    setAvailableIntakes([])
  }

  // Remove backup program
  const handleRemoveBackup = async (backupId: string) => {
    try {
      setLoadingBackups(true)
      const updatedBackups = (application?.backups || []).filter((b: BackupProgram) => b._id !== backupId)
      const reorderedBackups = updatedBackups.map((backup: BackupProgram, index: number) => ({
        ...backup,
        order: index + 1
      }))

      await axiosInstance.put(
        `/applications/update/${application._id}`,
        { backups: reorderedBackups }
      )
      toast.success("Backup program removed successfully!")
      fetchApplication();
      fetchActivities();
    } catch (error: any) {
      console.error('Error removing backup:', error)
      toast.error(error.response?.data?.message || "Failed to remove backup program")
    } finally {
      setLoadingBackups(false)
    }
  }

  const handleDynamicChange = (values, validateFn) => {
    setDynamicValues(values);
    validateFormRef.current = validateFn;
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name} (max 10MB)`);
        return false;
      }
      return true;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
    e.target.value = '';
  };

  // Update intake
  const handleUpdateIntakeAndBackups = async (intake: string, backups?: BackupProgram[]) => {
    try {
      setIsUpdating(true)
      const updateData: any = {}

      if (intake && intake !== application?.intake) {
        updateData.intake = intake
      }

      if (backups) {
        updateData.backups = backups
      }

      if (Object.keys(updateData).length === 0) return

      const response = await axiosInstance.put(
        `/applications/update/${application._id}`,
        updateData
      )

      setApplication(prev => ({
        ...prev,
        ...response.data.data
      }))

      toast.success("Updated successfully")
      await fetchActivities();
      return response.data
    } catch (error) {
      console.error(error)
      toast.error("Failed to update")
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const handleIntakeChange = async () => {
    if (!selectedIntake) return
    await handleUpdateIntakeAndBackups(selectedIntake)
    setShowIntakeModal(false)
  }

  const uploadDocument = async (
    applicationId: string,
    documentId: string,
    file: File,
    answer?: string,
    onProgress?: (progress: number) => void
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    if (answer) formData.append('answer', answer);
    formData.append('docType', selectedRequirement?.docType);

    const response = await axiosInstance.put(
      `/applications/documents/${applicationId}/${documentId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );
    return response.data;
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFormRef.current && !validateFormRef.current()) {
      toast.error('Please fill all required fields');
      return;
    }
    let fields = [];
    try {
      fields = typeof selectedRequirement.extra === "string"
        ? JSON.parse(selectedRequirement.extra)
        : selectedRequirement.extra || [];
    } catch (err) {
      console.error("Invalid JSON in extra fields");
    }
    const emptyRequiredFields = fields.filter((field: any) => {
      const value = dynamicValues[field.label];
      return field.required && (!value || value.toString().trim() === "");
    });
    if (emptyRequiredFields.length > 0) {
      toast.error(`Missing required fields: ${emptyRequiredFields.map((f: any) => f.label).join(", ")}`);
      return;
    }
    setIsSubmitting(true);
    try {
      if (uploadedFiles.length > 0) {
        const file = uploadedFiles[0];
        const result = await uploadDocument(
          application._id,
          selectedRequirement._id,
          file,
          answerText,
          (progress) => setUploadProgress(prev => ({ ...prev, [selectedRequirement._id]: progress }))
        );
        if (result.success) {
          setApplication(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              documents: prev.documents.map((doc: any) =>
                doc.id === selectedRequirement._id
                  ? { ...doc, ...result.data, status: 'Pending' }
                  : doc
              )
            };
          });
          toast.success('Document uploaded successfully!');
          fetchApplication();
          fetchActivities();
        }
      } else if (Object.keys(dynamicValues).length > 0) {
        const response = await axiosInstance.put(
          `/applications/documents/${application._id}/${selectedRequirement._id}`,
          { answer: JSON.stringify(dynamicValues), docType: selectedRequirement.docType }
        );
        if (response.data.success) {
          fetchApplication();
          fetchActivities();
          toast.success('Answer submitted successfully!');
        }
      }
      setIsDrawerOpen(false);
      setAnswerText('');
      setUploadedFiles([]);
      setDynamicValues({});
      setUploadProgress({});
    } catch (error: any) {
      console.error('Submission error:', error);
      const message = error.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send message to API
  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await axiosInstance.post(`/communication/applications/${application._id}/messages`, {
        content: newMessage
      })

      const newMsg = response.data?.data
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
      scrollToBottom()

      // Mark as read after sending
      await markMessagesAsRead()
      fetchActivities()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  // Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      await axiosInstance.put(`/communication/applications/${params.id}/messages/read`)
      setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchApplication()
  }, [params.id])

  useEffect(() => {
    if (application?._id) {
      fetchAvailableCourses()
      fetchMessages()
      fetchActivities()
    }
  }, [application?._id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/applications/${params.id}`)
      const data = response.data?.data
      setApplication(data)
    } catch (error) {
      console.error('Error fetching application details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      const response = await axiosInstance.get('/courses?limit=50')
      setAvailableCourses(response.data?.data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(`/communication/applications/${application._id}/messages`)
      setMessages(response.data?.data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get(`/communication/applications/${application._id}/activities?limit=100`)
      const activities = response.data?.data || []
      // Transform to match the expected format
      const formattedActivities = activities.map(activity => ({
        ...activity,
        id: activity._id,
        user: activity.user?.name || 'System',
        timestamp: activity.createdAt
      }))
      setActivityLogs(formattedActivities)
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }

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

  const getCallIcon = (callType?: string) => {
    switch (callType) {
      case 'incoming':
        return <PhoneIncoming className="w-5 h-5 text-green-500" />
      case 'outgoing':
        return <PhoneOutgoing className="w-5 h-5 text-blue-500" />
      case 'missed':
        return <PhoneMissed className="w-5 h-5 text-red-500" />
      default:
        return <PhoneCall className="w-5 h-5 text-gray-500" />
    }
  }

  const currentStepIndex = PRIMARY_STATUS_STEPS.findIndex(step => step.key === application?.primaryStatus)
  const isStepCompleted = (index: number) => index < currentStepIndex
  const isStepCurrent = (index: number) => index === currentStepIndex

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
    <main className="relative max-w-7xl mx-auto px-4 overflow-y-auto pb-8">
      {/* Intake Modal */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Change Intake</h2>
              <button onClick={() => setShowIntakeModal(false)} className="p-1 hover:bg-gray-100 rounded">✖</button>
            </div>
            <div className="min-h-[200px]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 overflow-y-auto max-h-[400px]">
                {((application?.course?.university?.intakes || [])).map((item: string) => (
                  <div
                    key={item}
                    onClick={() => setSelectedIntake(item)}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedIntake === item ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-400 hover:shadow-sm"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedIntake === item ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                        {selectedIntake === item && <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>}
                      </div>
                      <p className="font-medium text-sm">{item}</p>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">Status: Open</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowIntakeModal(false)} className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleIntakeChange}
                disabled={isUpdating}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? "Updating..." : "Submit"}
              </button>
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
              <div className="flex items-center text-gray-700 text-sm gap-2 mt-1 flex-wrap">
                <span>Application No: {application?.applicationNumber}</span> |
                <span>Selected Intake: {application?.intake}</span>
                <button onClick={() => setShowIntakeModal(true)} className="inline-flex hover:text-blue-500 p-1 transition-colors">
                  <Edit2Icon className="w-4 h-4" />
                </button> |
                <span>Submission deadline: {application?.deadline || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 w-full border-t pt-5">
          {/* Desktop View: Horizontal Stepper */}
          <div className="hidden md:block relative overflow-x-auto pb-4">
            <div className="relative flex justify-between items-start min-w-max pt-4">
              {PRIMARY_STATUS_STEPS.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = isStepCompleted(index)
                const isCurrent = isStepCurrent(index)
                const isLast = index === PRIMARY_STATUS_STEPS.length - 1
                const nextStepCompleted = index < PRIMARY_STATUS_STEPS.length - 1 && isStepCompleted(index + 1)
                return (
                  <div key={step.key} className="flex relative flex-col items-center relative flex-1 min-w-[120px]">
                    {!isLast && (
                      <div className={`absolute top-5 w-full left-1/2 h-0.5 ${nextStepCompleted ? "bg-emerald-600" : "bg-slate-300"}`} style={{ width: 'calc(100% - 40px)', left: 'calc(50% + 20px)' }}></div>
                    )}
                    <div className="relative flex items-center justify-center mb-2">
                      {isCurrent && <div className="absolute w-12 h-12 rounded-full bg-orange-400 animate-ping opacity-20" />}
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] border-2 transition-all duration-300 ${isCompleted ? "bg-emerald-500 border-emerald-100 text-white" : isCurrent ? "bg-white border-orange-500 text-orange-600 scale-105" : "bg-white border-slate-200 text-slate-600"}`}>
                        <StepIcon className="w-5 h-5" />
                        {isCompleted && (
                          <div className="absolute p-1.5 bg-primary rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`text-[13px] font-medium text-center break-words whitespace-normal leading-tight max-w-[100px] ${isCurrent ? "text-orange-600" : isCompleted ? "text-emerald-600" : "text-slate-600"}`}>
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden relative space-y-3 before:absolute before:left-[11px] before:top-2 before:h-full before:w-0.5 before:bg-slate-200">
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

        {/* Tab Navigation - Horizontally Scrollable */}
        <div className="border-b border-gray-200 overflow-x-auto no-scrollbar">
          <div className="flex min-w-max">
            {[
              { id: 'requirements', label: 'Requirements', icon: ClipboardList },
              { id: 'ooshas_docs', label: 'OOSHA Documents', icon: FileCheck2 },
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
                  className={`relative flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium whitespace-nowrap transition-all duration-200 ${isActive ? 'text-orange-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  {/* <TabIcon className="w-4 h-4" /> */}
                  {tab.label}
                  {tab.id === 'notes' && unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{unreadCount}</span>
                  )}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-full" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto py-4">
        {activeTab === 'requirements' && (
          <motion.div
            key="requirements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 overflow-hidden rounded-lg shadow-sm"
          >
            <div className="border-b border-gray-200 bg-gradient-to-r from-primary to-primary-dark">
              <div className="flex px-4 overflow-x-auto no-scrollbar">
                {["All", 'Pending', 'In Review', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveDocTab(status === 'In Review' ? 'inreview' : status === 'All' ? 'All' : status)}
                    className={`px-5 py-3 text-sm font-medium relative transition-all duration-200 whitespace-nowrap ${(activeDocTab === 'All' && status === 'All') ||
                      (activeDocTab === 'Pending' && status === 'Pending') ||
                      (activeDocTab === 'inreview' && status === 'In Review') ||
                      (activeDocTab === 'Approved' && status === 'Approved') ||
                      (activeDocTab === 'Rejected' && status === 'Rejected')
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                      }`}
                  >
                    {status}
                    {((activeDocTab === 'All' && status === 'All') ||
                      (activeDocTab === 'Pending' && status === 'Pending') ||
                      (activeDocTab === 'inreview' && status === 'In Review') ||
                      (activeDocTab === 'Approved' && status === 'Approved') ||
                      (activeDocTab === 'Rejected' && status === 'Rejected')) && (
                        <motion.div
                          layoutId="reqTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {application?.documents?.filter((doc) => {
                if (activeDocTab === 'All') return doc.type === 'user';
                return doc.status === activeDocTab && doc.type === 'user';
              }).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">📄</div>
                  <p className="text-gray-500 text-sm">No requirements found</p>
                </div>
              ) : (
                application?.documents?.filter((doc) => {
                  if (activeDocTab === 'All') return doc.type === 'user';
                  return doc.status === activeDocTab && doc.type === 'user';
                }).map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                    className="hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 border-gray-100 hover:border-primary/50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold p-0 text-gray-900 text-base">{req.name}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${req.required === 'required'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : req.required === 'optional'
                                ? 'bg-gray-50 text-gray-700 border border-gray-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                              {req.required === 'required' ? 'Required' : req.required === 'optional' ? 'Optional' : 'Early Access'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                              <span className="flex items-center gap-1.5">
                                {getStatusIcon(req.status)}
                                {req.status === 'Rejected' && 'Rejected'}
                                {req.status === 'inreview' && 'In Review'}
                                {req.status === 'Approved' && 'Approved'}
                                {req.status === 'Pending' && 'Pending'}
                              </span>
                            </span>
                          </div>
                        </div>

                        {(req.status === 'Pending' || req.status === 'Rejected') && <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequirement(req);
                            setIsDrawerOpen(true);
                          }}
                          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Answer
                        </button>}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* OOSHA Documents Tab */}
        {activeTab === 'ooshas_docs' && (
          <motion.div
            key="ooshas_docs"
            className="bg-white"
          >
            <div className="">
              <h3 className="text-lg font-semibold mb-4">Official Documents from OOSHA</h3>
              {application?.documents?.filter((doc) => {
                  return doc.type === 'ooshas';
                }).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">📄</div>
                  <p className="text-gray-500 text-sm">No documents available yet</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {application?.documents?.filter((doc) => {
                    return doc.type === 'ooshas';
                  }).map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileCheck2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          <p className="text-sm text-gray-500">{doc.description}</p>
                          {/* <p className="text-xs text-gray-400 mt-1">Uploaded: {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}</p> */}
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(doc.docUrl, '_blank')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Right Side Drawer */}
        <AnimatePresence>
          {isDrawerOpen && selectedRequirement && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-black/50 z-50"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
              >
                <div className="sticky shrink-0 top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Answer Requirement</h2>
                    <p className="text-sm text-gray-500">Provide the requested information</p>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmitAnswer} className="flex flex-col flex-1 min-h-0">
                  <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-semibold text-gray-900">{selectedRequirement.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedRequirement.required === 'required'
                          ? 'bg-red-100 text-red-700'
                          : selectedRequirement.required === 'optional'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-purple-100 text-purple-700'
                          }`}>
                          {selectedRequirement.required === 'required' ? 'Required' : selectedRequirement.required === 'optional' ? 'Optional' : 'Early Access'}
                        </span>
                      </div>
                      {selectedRequirement.description && (
                        <div dangerouslySetInnerHTML={{ __html: selectedRequirement.description }} />
                      )}
                    </div>
                    {(selectedRequirement.docType == 'form') ? <DynamicFormFields
                      fieldsData={selectedRequirement.extra}
                      onChange={handleDynamicChange}
                    /> : <>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Provide your answer here..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Attach Files <span className="text-gray-400 font-normal">(PDF, DOC, JPG, PNG - max 10MB)</span>
                        </label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                          onClick={() => document.getElementById('fileInput')?.click()}
                        >
                          <input
                            id="fileInput"
                            type="file"
                            multiple
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileSelect}
                          />
                          <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 font-medium">Click or drag files to upload</p>
                          <p className="text-xs text-gray-400 mt-1">Supports PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                        </div>
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                  <File className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {uploadProgress[selectedRequirement?.id] > 0 && uploadProgress[selectedRequirement?.id] < 100 && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Uploading...</span>
                              <span className="text-xs text-gray-500 font-medium">{uploadProgress[selectedRequirement.id]}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress[selectedRequirement.id]}%` }}
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>}
                  </div>
                  <div className="p-4 border-t bg-white flex gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            className="bg-white rounded-xl border border-gray-200 max-w-3xl mx-auto overflow-hidden"
          >
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {activityLogs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No activity records found</p>
                </div>
              ) : (
                activityLogs.map((log, index) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">


                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{log.action.replace(/_/g, ' ').toUpperCase()}</h4>
                            {log.status && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(log.status)}`}>
                                {log.status}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {format(new Date(log.createdAt), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{log.description}</p>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-500 flex uppercase items-center gap-1">
                            By: {log.user || 'System'}
                          </span>
                          {log.callDuration && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                Duration: {log.callDuration}
                              </span>
                            </>
                          )}
                          {log.callType && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className={`flex items-center gap-1 ${log.callType === 'missed' ? 'text-red-600' :
                                log.callType === 'incoming' ? 'text-green-600' : 'text-blue-600'
                                }`}>
                                {log.callType === 'missed' ? 'Missed Call' :
                                  log.callType === 'incoming' ? 'Incoming Call' : 'Outgoing Call'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {showBackupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Add Backup Program</h2>
                  <p className="text-xs text-gray-500">Select an alternative program to increase your chances</p>
                </div>
                <button
                  onClick={() => {
                    setShowBackupModal(false)
                    resetBackupModal()
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Program <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value)
                      fetchCourseIntakes(e.target.value)
                    }}
                  >
                    <option value="">Choose a program...</option>
                    {availableCourses
                      .filter(course => course._id !== application?.course?._id)
                      .map(course => (
                        <option key={course._id} value={course._id}>
                          {course.name} - {course.university?.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Intake <span className="text-red-500">*</span>
                  </label>
                  {loadingCourses ? (
                    <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                      <span className="ml-2 text-sm text-gray-500">Loading intakes...</span>
                    </div>
                  ) : (
                    <select
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                      value={selectedBackupIntake}
                      onChange={(e) => setSelectedBackupIntake(e.target.value)}
                      disabled={availableIntakes.length === 0}
                    >
                      {availableIntakes.length === 0 ? (
                        <option value="">No intakes available</option>
                      ) : (
                        availableIntakes.map(intake => (
                          <option key={intake} value={intake}>{intake}</option>
                        ))
                      )}
                    </select>
                  )}
                  {selectedCourseId && availableIntakes.length === 0 && !loadingCourses && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      No intakes available for this program
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowBackupModal(false)
                    resetBackupModal()
                  }}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBackup}
                  disabled={!selectedCourseId || !selectedBackupIntake || loadingBackups}
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingBackups ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Program
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'backups' && (
          <motion.div
            key="backups"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden"
          >
            <div className="">
              {(application?.backups || []).length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-900 mb-2">No Backup Programs</h4>
                  <p className="text-gray-500 text-sm mb-6">Add backup programs to increase your chances of admission</p>
                  <button
                    onClick={() => setShowBackupModal(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add Your First Backup
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {(application?.backups || [])
                      .sort((a: BackupProgram, b: BackupProgram) => a.order - b.order)
                      .map((backup: BackupProgram, index: number) => (
                        <motion.div
                          key={backup._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          <div className="absolute top-0 left-0 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600">
                            <span className="text-white font-bold text-sm">#{backup.order}</span>
                          </div>

                          <div className="pl-16 pr-4 py-4">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  {backup.course?.university?.uni_logo ? (
                                    <img
                                      src={backup.course.university.uni_logo}
                                      alt={backup.course.university.name}
                                      className="w-10 h-10 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                      <School className="w-5 h-5 text-gray-500" />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{backup.course?.name}</h4>
                                    <p className="text-xs text-gray-500">{backup.course?.university?.name}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Intake: {backup.intake}
                                  </span>
                                  {backup.submittedAt && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      Submitted: {format(new Date(backup.submittedAt), 'MMM dd, yyyy')}
                                    </span>
                                  )}
                                  {backup.applicationId && (
                                    <span className="flex items-center gap-1">
                                      <FileText className="w-3.5 h-3.5" />
                                      App ID: {backup.applicationId}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Link href={`/dashboard/programs/${backup.course?.slug}`}>
                                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Program">
                                    <Eye className="w-5 h-5" />
                                  </button>
                                </Link>
                                <button
                                  onClick={() => handleRemoveBackup(backup._id)}
                                  disabled={loadingBackups}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Remove Backup"
                                >
                                  {loadingBackups ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  <button
                    onClick={() => setShowBackupModal(true)}
                    className="px-4 py-2 bg-orange-500 mt-6 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add Another Backup
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Notes Tab - Chat-like Interface with API Integration */}
        {activeTab === 'notes' && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-[600px]"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-gray-900">Messages & Notes</h3>
                  <p className="text-xs text-gray-500">Chat with the OOSHAS team</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setNoteType('user')}
                  className={`p-2 rounded-lg transition-colors ${noteType === 'user' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  title="Student Note"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setNoteType('ooshas')}
                  className={`p-2 rounded-lg transition-colors ${noteType === 'ooshas' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
                  title="Private OOSHAS Note"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400">Start a conversation with the OOSHAS team</p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.senderType === 'student' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[70%] ${message.senderType === 'student' ? 'flex-row' : 'flex-row-reverse'} flex items-end gap-2`}>
                      {/* <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.senderType === 'student' ? 'bg-blue-100' : 'bg-orange-100'
                        }`}>
                        <User className="w-4 h-4 text-blue-600" />
                      </div> */}
                      <div>
                        <div className={`px-4 py-2 rounded-xl ${message.senderType === 'student'
                          ? 'bg-white border border-gray-200 text-gray-800'
                          : 'bg-gradient-to-r from-orange-500 to-orange-400 text-white'
                          } shadow-sm`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-400 ${message.senderType === 'student' ? 'justify-start' : 'justify-end'}`}>
                          <span>{format(new Date(message.createdAt), 'dd/MM/yyyy hh:mm a')}</span>
                          {message.senderType !== 'student' && message.isRead && (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message here..."
                  className="flex-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 px-4 flex justify-center items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift + Enter for new line</p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}