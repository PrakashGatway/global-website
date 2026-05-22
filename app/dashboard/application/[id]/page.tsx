"use client";

import Image from "next/image";
import {
  Phone,
  Pencil,
  Download,
  GraduationCap,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Upload,
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
  Image as ImageIcon,
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
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { format } from "date-fns";
import axiosInstance from "@/app/axiosInstance";
import DynamicFormFields from "@/components/dashboard/application/dynamicform";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobal } from "@/src/statecontext";

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

export default function StudentDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'information' | 'documents' | 'activity'>('information');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState("");
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [unreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [answerText, setAnswerText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicValues, setDynamicValues] = useState({});
  const [activeDocTab, setActiveDocTab] = useState('All');
  let validateFormRef = useRef<any>(null);
  const messagesEndRef = useRef<any>(null);
  const {profile} = useGlobal()

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  useEffect(() => {
    if (application?._id) {
      fetchActivities();
    }
  }, [application?._id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/applications/${params.id}`);
      const data = response.data?.data;
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get(`/communication/applications/${application._id}/activities?limit=100`);
      const activities = response.data?.data || [];
      const formattedActivities = activities.map((activity: any) => ({
        ...activity,
        id: activity._id,
        user: activity.user?.name || 'System',
        timestamp: activity.createdAt
      }));
      setActivityLogs(formattedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleDynamicChange = (values: any, validateFn: any) => {
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
          setApplication((prev: any) => {
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
    };
    return styles[status] || styles.pending;
  };

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
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Failed':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  };

  const currentStepIndex = PRIMARY_STATUS_STEPS.findIndex(step => step.key === application?.primaryStatus);
  const isStepCompleted = (index: number) => index < currentStepIndex;
  const isStepCurrent = (index: number) => index === currentStepIndex;
  const [openCommentModal,setopenCommentModal] = useState();
  const [MessageData,setMessageData] = useState([])

  const [newMessage, setNewMessage] = useState('');
const [subject, setSubject] = useState('');
const [uploadedFiles1, setUploadedFiles1] = useState([]); // Stores { name: string, url: string }
const [isUploading, setIsUploading] = useState(false);
const [isSending, setIsSending] = useState(false);
const fileInputRef = useRef(null);
const [sendto,setsendto] = useState('');

const handleFileChange = async (e) => {
  if (!e.target.files || e.target.files.length === 0) return;
  
  const filesArray = Array.from(e.target.files);
  setIsUploading(true);

  try {
    // Process and upload each selected file
    for (const file of filesArray) {
      const formData = new FormData();
      formData.append("file", file);


      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success && response.data?.docUrl) {
        let fileUrl = response.data.docUrl;

        // Validation rule from your snippet
        if (
          fileUrl.includes("nofile") || 
          fileUrl === "/uploads/docs/nofile" || 
          (!fileUrl.startsWith('/uploads/') && !fileUrl.startsWith('http'))
        ) {
          throw new Error("Server returned an invalid file URL.");
        }

        // Keep track of the file metadata and server string url
        setUploadedFiles((prev) => [
          ...prev, 
          { name: file.name, url: fileUrl }
        ]);
        
        toast.success(`${file.name} uploaded successfully!`);
      } else {
        throw new Error(response.data?.message || "Upload failed");
      }
    }
  } catch (error) {
    console.error("File upload error:", error);
    toast.error(error.message || "Failed to upload file");
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file selector input
  }
};

const removeUploadedFile = (indexToRemove) => {
  setUploadedFiles1((prev) => prev.filter((_, index) => index !== indexToRemove));
};

  // Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      await axiosInstance.put(`/communication/applications/${application._id}/messages/read`)
      // setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })))
      // setUnreadCount(0)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/communication/applications/${application._id}/messages`)
        setMessageData(response.data?.data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    useEffect(()=> {
       fetchMessages();
    },[application])

const sendMessage = async () => {
  if (!newMessage.trim()) return;

  setIsSending(true);
  try {
    const response = await axiosInstance.post(`/communication/applications/${application._id}/messages`, {
      content: newMessage.trim(),
      userId : subject === "Document Uploaded" ? profile.role === "user" ? profile._id : sendto : "",
      extra_content: {
        subject: subject || 'General Update',
        camsId: application._id,
        recipient: 'Ooshas',
        attachments: uploadedFiles // Sends array of { name, url } items to backend
      }
    });

    const newMsg = response.data?.data;
    // setMessages(prev => [...prev, newMsg]);
    
    // Clear state data
    setNewMessage('');
    setSubject('');
    setUploadedFiles([]);
    setopenCommentModal(false);

    await markMessagesAsRead();
    await fetchMessages();
    fetchActivities();
    toast.success('Comment saved');
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
  } finally {
    setIsSending(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-5"></div>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[24px] font-semibold text-black">
          {application?.student?.name || "Student Name"}{" "}
          <span className="text-gray-600 text-lg">
            | CAMS ID: {application?.applicationNumber || "N/A"}
          </span>
        </h1>

        <div className="flex gap-3">
          <button className="bg-[#ff6a1a] hover:bg-[#f45f0d] text-white px-6 py-3 rounded-md font-medium text-sm">
            MARK AS UNREAD
          </button>

        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Course Details */}
        <div className="space-y-6 bg-white">
          <div className="flex items-start justify-between p-8 pb-0">
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

          {/* <div className="mt-2 w-full border-t pt-5 px-8">
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
          </div> */}

          {/* Tab Navigation - Only 3 tabs */}
          <div className="border-b border-gray-200 overflow-x-auto no-scrollbar px-8">
            <div className="flex min-w-max">
              {[
                { id: 'information', label: 'Information', icon: User },
                // { id: 'documents', label: 'Documents', icon: FileCheck2 },
                { id: 'activity', label: 'Application History', icon: Activity }
              ].map(tab => {
                const TabIcon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium whitespace-nowrap transition-all duration-200 ${isActive ? 'text-orange-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === 'documents' && unreadCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{unreadCount}</span>
                    )}
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-full" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Information Tab Content */}
        {activeTab === 'information' && (
          <div className="px-8 py-8">
            <div className="grid grid-cols-4 gap-y-10 gap-x-10">
              <DetailItem
                label="Student Name"
                value={application?.student?.name || "N/A"}
              />
              <DetailItem
                label="CAMS ID"
                value={application?.applicationNumber || "N/A"}
              />
              <DetailItem
                label="Student ID"
                value={application?.student?._id || "-"}
              />
              <DetailItem
                label="Date & Time Added"
                value={application?.createdAt ? format(new Date(application.createdAt), 'dd/MM/yyyy hh:mm a') : "N/A"}
              />
              <DetailItem
                label="Student Passport No."
                value={application?.student?.passportNumber || "N/A"}
              />
              <EditableItem
                label="Student Date of Birth"
                value={application?.student?.dateOfBirth ? format(new Date(application.student.dateOfBirth), 'yyyy-MM-dd') : "N/A"}
              />
              <DetailItem
                label="Student E-Mail"
                value={application?.student?.email || "N/A"}
              />
              <DetailItem
                label="Student Phone No"
                value={application?.student?.phone || "N/A"}
              />
              {/* <EditableItem
                label="Communication E-Mail ID"
                value={application?.communicationEmail || "N/A"}
              />
              <EditableItem
                label="Communication Phone No."
                value={application?.communicationPhone || "N/A"}
              /> */}
            </div>

            {/* Course Details Section */}
            <div className="mt-12 border-t pt-8">
              <h2 className="text-[20px] font-semibold text-[#2b1640] mb-6">
                Course Details
              </h2>
              <div className="grid grid-cols-5 gap-10 items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 relative">
                    {application?.course?.university?.uni_logo ? (
                      <img
                        src={application.course.university.uni_logo}
                        alt="University"
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <School className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">University</p>
                    <h3 className="font-medium text-gray-800">{application?.course?.university?.name || "N/A"}</h3>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Course Name</p>
                  <h3 className="font-medium text-gray-800">{application?.course?.name || "N/A"}</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Course Intake</p>
                  <h3 className="font-medium text-gray-800">{application?.intake || "N/A"}</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tuition Fees</p>
                  <h3 className="font-medium text-gray-800">{application?.course?.tuitionFee || "N/A"}</h3>
                </div>
              </div>
            </div>

            {/* Staff Details */}
            <div className="grid grid-cols-3 gap-10 mt-8 pt-8 border-t">
              <div>
                <h4 className="font-semibold underline text-gray-700 mb-3">Case Owner:</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Name :</span> {application?.caseOwner?.name || "N/A"}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold underline text-gray-700 mb-3">URM Details:</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Name:</span> {application?.urm?.name || "N/A"}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Number :</span>
                    <span>{application?.urm?.phone || "N/A"}</span>
                    <Phone size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold underline text-gray-700 mb-3">SRM Details:</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Name :</span> {application?.srm?.name || "N/A"}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Mobile No :</span>
                    <span>{application?.srm?.phone || "N/A"}</span>
                    <Phone size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Downloads */}
            {/* <div className="mt-12 border-t pt-8">
              <h3 className="font-semibold text-gray-700 mb-5">Document Downloads</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  "CHANGE OF AGENT",
                  "APPOINTMENT OF AGENT",
                  "SPONSORSHIP LETTER",
                  "NO OBJECTION LETTER",
                ].map((item, index) => (
                  <button
                    key={index}
                    className="bg-[#ff6a1a] hover:bg-[#f45f0d] text-white px-6 py-3 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    {item}
                    <Download size={16} />
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        )}

      {/* Documents Tab Content */}
{activeTab === "documents" && (
  <div className="bg-[#fafafa] min-h-screen">
    {/* Top Tabs */}
    {/* <div className="border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-8 overflow-x-auto">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() =>
              setActiveDocTab(status === "All" ? "All" : status)
            }
            className={`relative py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeDocTab === status
                ? "text-[#ff6a1a]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {status}

            {activeDocTab === status && (
              <motion.div
                layoutId="docTab"
                className="absolute left-0 bottom-0 h-[2px] w-full bg-[#ff6a1a]"
              />
            )}
          </button>
        ))}
      </div>
    </div> */}

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 p-6">
      
      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 min-h-[520px] flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mb-6">
          <Upload className="w-12 h-12 text-[#ff6a1a]" />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Upload Documents
        </h3>

        <p className="text-sm text-gray-500 mb-6 max-w-[260px]">
          Please upload only color scan copies in PDF, DOC, or image format.
        </p>

        <button className="px-6 py-3 rounded-xl bg-[#ff6a1a] hover:bg-[#f45f0d] text-white font-medium shadow-md transition-all duration-200 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
          {application?.documents?.filter((doc: any) => {
            if (activeDocTab === "All") return doc.type === "user";
            return (
              doc.status === activeDocTab && doc.type === "user"
            );
          }).length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-500 text-sm">
                No documents found
              </p>
            </div>
          ) : (
            application?.documents
              ?.filter((doc: any) => {
                if (activeDocTab === "All")
                  return doc.type === "user";

                return (
                  doc.status === activeDocTab &&
                  doc.type === "user"
                );
              })
              .map((req: any, index: number) => (
                <motion.div
                  key={req._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ backgroundColor: "#fafafa" }}
                  className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 transition-all"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Status Icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : req.status === "Rejected"
                          ? "bg-red-100 text-red-600"
                          : req.status === "inreview"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {getStatusIcon(req.status)}
                    </div>

                    {/* File Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-medium text-gray-800 truncate">
                          {req.name}
                        </h4>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            req.required === "required"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : req.required === "optional"
                              ? "bg-gray-50 text-gray-700 border border-gray-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {req.required === "required"
                            ? "Required"
                            : req.required === "optional"
                            ? "Optional"
                            : "Early Access"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded on{" "}
                        {req.createdAt
                          ? new Date(req.createdAt).toDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        req.status
                      )}`}
                    >
                      {req.status === "Rejected" && "Rejected"}
                      {req.status === "inreview" && "In Review"}
                      {req.status === "Approved" && "Approved"}
                      {req.status === "Pending" && "Pending"}
                    </span>

                    {/* View */}
                    <button className="text-[#ff6a1a] hover:scale-110 transition-all">
                      <Eye className="w-5 h-5" />
                    </button>

                    {/* Download */}
                    <button className="text-[#ff6a1a] hover:scale-110 transition-all">
                      <Download className="w-5 h-5" />
                    </button>

                    {/* Answer */}
                    {(req.status === "Pending" ||
                      req.status === "Rejected") && (
                      <button
                        onClick={() => {
                          setSelectedRequirement(req);
                          setIsDrawerOpen(true);
                        }}
                        className="px-4 py-2 bg-[#ff6a1a] hover:bg-[#f45f0d] text-white text-sm font-medium rounded-lg transition-all duration-200"
                      >
                        Answer
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </div>
    </div>
  </div>
)}

{/* Activity Log Tab Content */}
{activeTab === 'activity' && (
  <div className="bg-white">
    {/* Header */}
    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Agent Communication Status
        </h3>
      </div>

      <button
        onClick={() => setopenCommentModal(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
      >
        ADD COMMENTS
      </button>
    </div>

    {/* Table Header */}
    <div className="grid grid-cols-12 gap-4 bg-gray-100 px-8 py-4 text-sm font-semibold text-gray-700 border-b">
      <div className="col-span-3">Details</div>
      <div className="col-span-5">Comment</div>
      <div className="col-span-3">Status</div>
      <div className="col-span-1">Commented By</div>
    </div>

    {/* Activity List */}
    <div className="max-h-[650px] overflow-y-auto divide-y divide-gray-200">
      {MessageData.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="grid grid-cols-12 gap-4 px-8 py-6 hover:bg-gray-50 transition-colors"
        >
          {/* Details */}
          <div className="col-span-3">
            <div className="text-sm text-gray-700 leading-6">
              <p className="font-medium">{item?.createdAt.split("T")[0]}</p>
              {/* <p>({item.createdAt.split("T")['1']})</p> */}

              <div className="mt-4">
                <p className="font-semibold text-gray-800">
                  Subject:
                </p>

                <p className=" font-semibold text-gray-900 mt-2">
                  {item?.extra_content?.subject}
                </p>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="col-span-5">
            <div className="space-y-3">
            
              <div className="text-gray-700 leading-7 text-[15px]">
                {item.content}
              </div>
              {item.extra_content?.attachments[0]?.name && 
              <a href={`http://localhost:5000${item.extra_content?.attachments[0]?.url}`} target="_blank"  className="flex items-center gap-2">
                
      <Paperclip className="w-4 h-4 text-slate-400" />{item.extra_content?.attachments[0]?.name}
              </a>}
            </div>
          </div>

          {/* Status */}
          <div className="col-span-3">
            <div className="space-y-5 text-sm">
              <div>
                <p className="font-bold text-gray-800">
                  Primary Status:
                </p>

                <p className="text-gray-700">
                  {item.primaryStatus || "Application Processed"}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-800">
                  Message Status:
                </p>

                <p className="text-gray-700">
                  {item?.isRead?"true":"false"}
                </p>
              </div>
            </div>
          </div>

          {/* Commented By */}
          <div className="col-span-1 flex items-start justify-center">
            <span className="text-gray-700 font-medium">
              {item.userType}
            </span>
          </div>
        </motion.div>
      ))}
    </div>

{/* Add Comment Modal */}
<AnimatePresence>
  {openCommentModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
      >
      {/* Modal Body */}
<div className="p-6 space-y-6">
  {/* Native Hidden File Input Trigger */}
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    multiple
    disabled={isUploading || isSending}
    className="hidden"
  />

  {/* Top Info Cards */}
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cams ID</span>
      <span className="text-lg font-bold text-slate-700">1198162</span>
    </div>
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recipient</span>
      <span className="text-lg font-bold text-slate-700">Ooshas</span>
    </div>
  </div>

  {/* Subject Dropdown */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
      Subject <span className="text-rose-500">*</span>
    </label>
    <select 
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:bg-white"
    >
      <option value="">Select a subject...</option>
      <option value="Application Processed">Application Processed</option>
      <option value="Document Uploaded">Document Uploaded</option>
      <option value="University Update">University Update</option>
    </select>
  </div>

  {/* Editor Container */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all">
      <textarea
        rows={5}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your comment details here..."
        className="w-full p-4 outline-none resize-none text-sm text-slate-700 placeholder-slate-400 bg-white"
      />
    </div>
  </div>

  {/* Uploaded Files Chips view layout */}
  {uploadedFiles.length > 0 && (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
        Uploaded Attachments ({uploadedFiles.length})
      </label>
      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
        {uploadedFiles.map((file, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs text-emerald-800"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[200px] font-medium">{file.name}</span>
            <button
              type="button"
              onClick={() => removeUploadedFile(index)}
              className="text-emerald-500 hover:text-rose-500 font-bold ml-1 text-sm leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Footer Actions */}
  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
    <button 
      type="button"
      disabled={isUploading || isSending}
      onClick={() => fileInputRef.current.click()}
      className="border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors disabled:opacity-50"
    >
      <Paperclip className="w-4 h-4 text-slate-400" />
      <span>{isUploading ? 'Uploading to Server...' : 'Attach files'}</span>
    </button>

    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={isSending || isUploading}
        onClick={() => setopenCommentModal(false)}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      
      <button
        type="button"
        onClick={sendMessage}
        disabled={isSending || isUploading || !newMessage.trim()}
        className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-orange-500/10 transition-all"
      >
        {isSending ? 'Sending...' : 'Send Comment'}
      </button>
    </div>
  </div>
</div>


      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  </div>
)}

      </div>

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
                onClick={async () => {
                  if (selectedIntake) {
                    try {
                      await axiosInstance.put(`/applications/update/${application._id}`, { intake: selectedIntake });
                      toast.success("Intake updated successfully");
                      fetchApplication();
                      setShowIntakeModal(false);
                    } catch (error) {
                      toast.error("Failed to update intake");
                    }
                  }
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Drawer */}
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
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                  {(selectedRequirement.docType == 'form') ? (
                    <DynamicFormFields fieldsData={selectedRequirement.extra} onChange={handleDynamicChange} />
                  ) : (
                    <>
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
                                <button type="button" onClick={() => removeFile(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
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
                    </>
                  )}
                </div>
                <div className="p-4 border-t bg-white flex gap-3 shrink-0">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-[#ff6a1a] text-white rounded-lg hover:bg-[#f45f0d] transition-colors disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">
        {label}
      </p>
      <p className="text-gray-600 text-sm">{value}</p>
    </div>
  );
}

function EditableItem({ label, value }: DetailProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-gray-600 text-sm">{value}</p>
        <Pencil size={14} className="text-gray-500 cursor-pointer hover:text-[#ff6a1a]" />
      </div>
    </div>
  );
}