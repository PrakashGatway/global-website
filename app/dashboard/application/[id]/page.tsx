"use client";

import Image from "next/image";
import {
  Phone,
  Pencil,
  Download,
  GraduationCap,
  MapPin,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Eye,
  RefreshCw,
  Award,
  Briefcase,
  User,
  Mail as MailIcon,
  Building2,
  BadgeCheck,
  Link as LinkIcon,
  EyeOff,
  Activity,
  FileSearch,
  Paperclip,
  Link2,
  Image as ImageIcon,
  File,
  Loader2,
  UploadCloud,
  XCircle,
  School,
  Globe2,
  Link2Icon,
  Edit2Icon,
  Link2OffIcon,
  SendHorizonal,
  Play,
  SquareAsterisk,
  Ban,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Gift,
  ClipboardCheck,
  Hourglass,
  FileText,
  ShieldCheck,
  Check,
  Calendar,
  Clock3,
  Circle,
  Info,
  MessageCircle,
  Mail,
  BadgeDollarSign,
  Globe,
  CalendarDays,
  Hash,
  ChevronDown,
  Languages,
  Monitor,
  MonitorCheck,
  MonitorCheckIcon,
  FileCheck,
  FileBadge,
  ChevronRight,
  Menu
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect, Suspense } from "react";
import { format } from "date-fns";
import axiosInstance from "@/app/axiosInstance";
import DynamicFormFields from "@/components/dashboard/application/dynamicform";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobal } from "@/src/statecontext";
import ApplicationFlow from "@/components/dashboard/application/applicationFlow";
import ReviewApplication from "@/components/dashboard/application/reviewApllication";
import SubmittedtoSchool from "@/components/dashboard/application/submittedtoSchool";
import AdmissionProcessing from "@/components/dashboard/application/admissionProcessing";
import ApplicationForm from "@/components/dashboard/application/applicationForm";
import ProfileTabs from "@/components/couseller/ProfileSteps";
import Comments from "@/components/dashboard/application/comments";
import EnrollmentDeposit from "@/components/dashboard/application/enrollmentDeposit";
import Documents from "@/components/couseller/Documents";

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

// Primary status steps configuration
const STATUS_CONFIG = {
  Pending: {
    key: 'Pending',
    label: 'Application Created',
    icon: Clock,
  },
  Started: {
    key: 'Started',
    label: 'Application Started',
    icon: Play,
  },
  ReviewbyOoshas: {
    key: 'ReviewbyOoshas',
    label: 'Under OOSHAS Review',
    icon: FileSearch,
  },
  SubmitToSchool: {
    key: 'SubmitToSchool',
    label: 'Submitted to School',
    icon: UploadCloud,
  },
  AwaitingSchoolResponse: {
    key: 'AwaitingSchoolResponse',
    label: 'Awaiting School Response',
    icon: Clock,
  },
  AdmissionProcessing: {
    key: 'AdmissionProcessing',
    label: 'Admission Processing',
    icon: RefreshCw,
  },
  OfferReceived: {
    key: 'OfferReceived',
    label: 'Offer Received',
    icon: Award,
  },
  Refused: {
    key: 'Refused',
    label: 'Application Refused',
    icon: XCircle,
  },
  Withdrawn: {
    key: 'Withdrawn',
    label: 'Application Withdrawn',
    icon: Ban,
  },
  VisaProcessing: {
    key: 'VisaProcessing',
    label: 'Visa Processing',
    icon: SquareAsterisk,
  },
  PreArrival: {
    key: 'PreArrival',
    label: 'Pre Arrival',
    icon: Briefcase,
  },
  Arrived: {
    key: 'Arrived',
    label: 'Arrived',
    icon: MapPin,
  },
  Completed: {
    key: 'Completed',
    label: 'Completed',
    icon: CheckCircle2,
  },
};

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
  const { profile, allProfile, updateProfile } = useGlobal()
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");

    if (tab === "document") {
      setActiveTab("documents");
      setActiveMenu("Document")
      setshowApplicationForm(false);
    } else if (tab) {
      setshowApplicationForm(true);
    }
  }, []);

  const [showCelebration, setShowCelebration] = useState(false);

  const sections = [
    {
      title: "Personal Information",
      description: "Name, Date of Birth, Gender, Nationality, Passport details",
      tab: "personal",
      icon: User,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Contact Information",
      description: "Email address, Phone number, Current address",
      tab: "contact",
      icon: Mail,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Academic Background",
      description: "School details, Education history, Marks/Grades",
      tab: "academic",
      icon: GraduationCap,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "English Language Proficiency",
      tab: "tests",
      description: "IELTS / TOEFL / Other test scores",
      icon: Languages,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      title: "Additional Information",
      tab: "work",
      description: "Work experience, Motivation letter, Reference letters",
      icon: Briefcase,
      bg: "bg-cyan-50",
      color: "text-cyan-600",
    },
    {
      title: "Document",
      tab: "document",
      description: "All Related Documents",
      icon: Briefcase,
      bg: "bg-red-50",
      color: "text-red-600",
    }
  ];

  const submitNotes = [
    {
      icon: AlertCircle,
      title: "Complete Information",
      text: "Please ensure all the details are correct and complete.",
    },
    {
      icon: MonitorCheck,
      title: "Submission Lock",
      text: "Once submitted, you will not be able to make changes to your application.",
    },
    {
      icon: MonitorCheckIcon,
      title: "Track Status",
      text: "You can track your application status from the dashboard.",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 rounded-full";
      case "pending":
        return "bg-orange-100 text-orange-700 rounded-full";
      case "rejected":
        return "bg-red-100 text-red-700 rounded-full";
      default:
        return "bg-gray-100 text-gray-700 rounded-full";
    }
  };

  const Parsedocuments =
   allProfile?.profile?.documents && typeof allProfile?.profile?.documents === "string"
      ? JSON.parse(allProfile?.profile?.documents)
      : allProfile?.profile?.documents;

  const documentList = Object.values(Parsedocuments || {});

  const steps = [
    {
      id: 1,
      title: "Application Started",
      subTitle: "In Progress",
      step: "Started",
      icon: FileText,
    },
    {
      id: 2,
      title: "Under OOSHAS Review",
      subTitle: "current",
      step: "ReviewbyOoshas",
      icon: Clock,
    },
    {
      id: 3,
      title: "Submitted to School",
      subTitle: "In Progress",
      step: "SubmitToSchool",
      icon: Upload,
    },
    {
      id: 4,
      title: "Awaiting School Response",
      subTitle: "In Progress",
      step: "AwaitingSchoolResponse",
      icon: Hourglass,
    },
    {
      id: 5,
      title: "Offer Received",
      subTitle: "In Progress",
      step: "OfferReceived",
      icon: Gift,
    },
    {
      id: 6,
      title: "Pay Enrollenment Deposit",
      subTitle: "In Progress",
      step: "PayEnrollenmentDeposit",
      icon: ClipboardCheck,
    },
    {
      id: 7,
      title: "Confirmmation Letter",
      subTitle: "In Progress",
      step: "Completed",
      icon: ClipboardCheck,
    },
  ];

  const timelinesteps =
    application?.primaryStatus === "Refused"
      ? [
        ...steps.filter(
          (item) =>
            item.step !== "PayEnrollenmentDeposit" &&
            item.step !== "Completed"
        ),
        {
          id: 8,
          title: "Rejection Overview",
          subTitle: "Rejected",
          step: "Refused",
          icon: FileText,
        },
      ]
      : steps;

  const currentprimarystep = application?.primaryStatus
  const currentStatus = application?.primaryStatus;

  const currentStep =
    timelinesteps.find(
      item => item.step === currentStatus
    ) || timelinesteps[0];

  const currentIndex = timelinesteps.findIndex(
    item => item.step === currentStatus
  );

  useEffect(() => {
    if (currentStep?.step === "OfferReceived") {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [currentStep?.step]);

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
      const response = await axiosInstance.get(
        `/applications/${params.id}`
      );
      const applicationData = response.data?.data;
      setApplication(applicationData);
      if (applicationData?.student?._id) {
        setProfile(allProfile?.profile);
        setUser(profile);
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      console.log(error?.response?.data);
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get(`/communication/applications/${application._id}/activities?limit=100&status=STATUS_CHANGED`);
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
    console.log(formData)

    const response = await axiosInstance.put(
      `/auth/updateDocuments/${applicationId}/doc?type=application`,
      {
        documents: [
          {
            fileName: formData,
            docType: selectedRequirement?.docType,
            answer,
          },
        ],
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
          application?.student?._id,
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

  const [showApplicationFlow, setShowApplicationFlow] = useState(true)
  const [showApplicationForm, setshowApplicationForm] = useState(false)
  const [stepchange, setstepchange] = useState("Started")
  const [steptitle, setsteptitle] = useState({
    title: "Application Started",
    subTitle: "In Progress",
    step: "Started",
  });
  const [CountriesList, setCountriesList] = useState()
  const [user, setUser] = useState()
  const [profile2, setProfile] = useState();
  const [tasks, setTasks] = useState([
    {
      title: "Fill Application Form",
      description: "Provide your personal details",
      completed: true,
    },
    {
      title: "Upload Documents",
      description: "Upload required documents",
      completed: false,
    },
    {
      title: "Review & Submit",
      description: "Review your application and submit",
      completed: false,
    },
  ]);

  console.log(stepchange)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const countriesRes = await axiosInstance.get("/countries?limit=250")
        const data = countriesRes.data.data
        setCountriesList(data)
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [application?.data?.student?._id]);

  useEffect(() => {
    if (application) {
      setShowApplicationFlow(true)
    }
  }, [application])

  const getApplicationFlow = (status: string) => {
    if (['Refused', 'Withdrawn'].includes(status)) {
      return [
        'Application Started',
        'ReviewbyOoshas',
        'SubmitToSchool',
        'AwaitingSchoolResponse',
        'AdmissionProcessing',
        'OfferReceived',
      ];
    }
    return [
      'Started',
      'ReviewbyOoshas',
      'SubmitToSchool',
      'AwaitingSchoolResponse',
      'AdmissionProcessing',
      'OfferReceived',
    ];
  };

  const timelineSteps = getApplicationFlow(
    application?.primaryStatus
  ).map((key) => STATUS_CONFIG[key]);

  const currentStepIndex = timelineSteps?.findIndex(
    (step) => step?.key === application?.primaryStatus
  );

  const isStepCompleted = (index: number) =>
    index < currentStepIndex;

  const isStepCurrent = (index: number) =>
    index === currentStepIndex;

  const menuItems = [
    "Overview",
    "Application Form",
    "Document",
    "Communication",
    "Activity Log",
    "Review & Submit"
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-7 sm:h-8 bg-gray-200 rounded w-40 sm:w-48 md:w-64 mb-4 sm:mb-5"></div>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleTaskCheck = (index) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleContinue = (title) => {
    switch (title) {
      case "Fill Application Form":
        setActiveMenu("Application Form");
        setshowApplicationForm(true);
        if (isMobile) setIsMobileMenuOpen(false);
        break;
      case "Upload Documents":
        setActiveMenu("Document");
        setActiveTab("documents");
        if (isMobile) setIsMobileMenuOpen(false);
        break;
      case "Review & Submit":
        setActiveMenu("Review & Submit");
        if (isMobile) setIsMobileMenuOpen(false);
        break;
      default:
        break;
    }
  };

  const handleMenuClick = (item) => {
    setActiveMenu(item);
    switch (item) {
      case "Application Form":
        setshowApplicationForm(true);
        break;
      case "Communication":
        setshowApplicationForm(false);
        setActiveTab("activity");
        break;
      case "Document":
        setshowApplicationForm(false);
        setActiveMenu("Document")
        setActiveTab("documents")
        break
      case "Overview":
        setshowApplicationForm(false);
        setActiveMenu("Overview");
        setActiveTab("information")
        break;
      case "Activity Log":
        setActiveMenu("Activity Log")
        setshowApplicationForm(false);
        break;
      case "Review & Submit":
        setActiveMenu("Review & Submit")
        break;
      default:
        setshowApplicationForm(false);
    }
    if (isMobile) setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white">
        {/* Course Details */}
        <div className="space-y-2 sm:space-y-3 bg-white">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-10">
            <h2 className="font-bold text-sm sm:text-base md:text-lg">{currentStep.title}</h2>
            <span className="bg-orange-100 text-orange-500 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-base rounded">
              {currentStep.subTitle}
            </span>
          </div>

          {/* Mobile Sidebar Toggle */}
          {isMobile && (
            <div className="mb-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <span className="font-semibold text-sm">{activeMenu}</span>
                <ChevronDown className={`w-5 h-5 text-orange-500 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          <div className="w-full py-1 sm:py-2 md:py-3 overflow-x-auto">
            <div className="relative flex justify-between items-start min-w-[500px] sm:min-w-[600px] md:min-w-[700px] lg:min-w-full px-1">
              {/* Background Line */}
              <div className="absolute top-5 sm:top-6 md:top-7 left-8 sm:left-10 md:left-14 right-4 sm:right-5 h-[2px] bg-gray-300 z-0" />

              {/* Progress Line */}
              <div
                className="absolute top-5 sm:top-6 md:top-7 left-8 sm:left-10 md:left-14 h-[2px] bg-orange-500 z-0 transition-all duration-500"
                style={{
                  width: `${(currentIndex / (timelinesteps.length - 1)) * 90}%`,
                  right: "auto",
                }}
              />

              {timelinesteps.map((step, index) => {
                const status =
                  index < currentIndex
                    ? "completed"
                    : index === currentIndex
                      ? "current"
                      : "pending";

                const isActive = status === "current";

                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center z-10 flex-shrink-0"
                  >
                    {isActive ? (
                      <div className="relative flex flex-col items-center">
                        <div className="relative z-20">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full border-2 border-orange-500 bg-white flex items-center justify-center shadow-sm">
                            {step.icon ? (
                              <step.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6 text-orange-500" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6 text-orange-500" />
                            )}
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setstepchange(step.step)
                            setsteptitle(step)
                          }}
                          className="mt-[-4px] sm:mt-[-6px] w-[90px] sm:w-[120px] md:w-[170px] h-[70px] sm:h-[85px] md:h-[115px] bg-orange-50 border border-orange-500 rounded-lg flex flex-col items-center justify-center px-1 sm:px-2 cursor-pointer"
                        >
                          <h3 className="text-[10px] sm:text-xs md:text-lg font-semibold text-orange-600 text-center leading-3 sm:leading-4 md:leading-6">
                            {step.title.length > 15 ? step.title.substring(0, 15) + '...' : step.title}
                          </h3>
                          <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs md:text-base text-orange-600">
                            {status}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center
                          ${status === "completed"
                              ? "bg-green-500 border-green-500"
                              : "bg-white border-gray-300"
                            }`}
                        >
                          {step.icon ? (
                            <step.icon
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${status === "completed"
                                ? "text-white"
                                : "text-gray-500"
                                }`}
                            />
                          ) : (
                            <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${status === "completed" ? "text-white" : "text-gray-500"}`} />
                          )}
                        </div>
                        <h4
                          onClick={() => {
                            setstepchange(step.step)
                            setsteptitle(step)
                          }}
                          className="mt-1 sm:mt-1.5 md:mt-2 text-center font-medium text-[8px] sm:text-xs md:text-base text-gray-700 max-w-[60px] sm:max-w-[100px] md:max-w-[200px] leading-3 sm:leading-4 md:leading-5 cursor-pointer"
                        >
                          {step.title.length > 12 ? step.title.substring(0, 12) + '...' : step.title}
                        </h4>
                        <p className={`text-[7px] sm:text-xs md:text-base mt-0.5 ${status === "completed" ? "text-black" : "text-gray-500"}`}>
                          {status}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            {currentStep?.step === "Started" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
                {/* Left Sidebar - Desktop */}
                <div className="hidden lg:block lg:col-span-3 order-2 lg:order-1">
                  <div className="bg-white border sticky top-6 overflow-hidden">
                    <div className="space-y-0.5 p-1 sm:p-2">
                      {menuItems.map((item) => (
                        <motion.div
                          key={item}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMenuClick(item)}
                          className={`relative cursor-pointer px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4`}
                        >
                          {activeMenu === item && (
                            <motion.div
                              layoutId="activeSidebar"
                              className="absolute inset-0 bg-orange-50 border-l-4 border-orange-500"
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 30,
                              }}
                            />
                          )}
                          <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 md:gap-3">
                            <FileText
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${activeMenu === item
                                ? "text-orange-500"
                                : "text-gray-500"
                                }`}
                            />
                            <span
                              className={`text-xs sm:text-sm md:text-base ${activeMenu === item
                                ? "font-semibold text-orange-500"
                                : "text-gray-700"
                                }`}
                            >
                              {item}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t p-3 sm:p-4 md:p-6">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base">
                        Need Help?
                      </h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-1.5 md:mt-2">
                        Contact our support team for assistance.
                      </p>
                      <Link href={"/dashboard/support"}>
                        <button className="mt-1.5 sm:mt-2 md:mt-4 text-orange-600 font-medium text-xs sm:text-sm md:text-base">
                          Contact Support →
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Mobile Sidebar Drawer */}
                <AnimatePresence>
                  {isMobile && isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="lg:hidden col-span-12 order-1"
                    >
                      <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
                        <div className="space-y-0.5 p-1">
                          {menuItems.map((item) => (
                            <div
                              key={item}
                              onClick={() => handleMenuClick(item)}
                              className={`relative cursor-pointer px-3 py-2.5 rounded-md ${activeMenu === item ? 'bg-orange-50' : 'hover:bg-gray-50'
                                }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <FileText
                                  className={`w-3.5 h-3.5 ${activeMenu === item
                                    ? "text-orange-500"
                                    : "text-gray-500"
                                    }`}
                                />
                                <span
                                  className={`text-sm ${activeMenu === item
                                    ? "font-semibold text-orange-500"
                                    : "text-gray-700"
                                    }`}
                                >
                                  {item}
                                </span>
                                {activeMenu === item && (
                                  <div className="ml-auto w-1.5 h-8 bg-orange-500 rounded-full" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {showApplicationForm ? (
                    <motion.div
                      key="application-form"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="col-span-12 lg:col-span-9 order-1 lg:order-2"
                    >
                      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                        <ProfileTabs
                          studentId={profile?._id}
                          user={profile}
                          profile={allProfile?.profile}
                          countriesList={CountriesList}
                          onUpdate={updateProfile}
                        />
                      </Suspense>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeMenu}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="col-span-12 lg:col-span-9 gap-3 sm:gap-4 order-1 lg:order-2"
                    >
                      {activeMenu === "Overview" && (
                        <>
                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            <div className="bg-[#fefaf8] border border-orange-400 p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div className="w-full sm:w-auto md:mt-6">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3">
                                  <h2 className="text-sm sm:text-base md:text-lg font-bold">
                                    Application Started
                                  </h2>
                                  <span className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-orange-100 text-orange-700 text-[10px] sm:text-xs md:text-sm rounded">
                                    {application?.primaryStatus}
                                  </span>
                                </div>
                                <p className="mt-1.5 sm:mt-2 md:mt-4 text-gray-600 text-xs sm:text-sm md:text-[16px] w-full md:w-3xl">
                                  You have started your application for {application?.course?.name} at {application?.course?.university?.name}
                                </p>
                                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mt-1 sm:mt-1.5 md:mt-2">
                                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-600 flex-shrink-0" />
                                  <div>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                                      Started On
                                    </p>
                                    <p className="text-xs sm:text-sm md:text-base font-semibold">
                                      {new Date(application?.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="shrink-0 mt-2 sm:mt-0">
                                <img
                                  src="/started-application.gif"
                                  alt=""
                                  className="w-24 sm:w-32 md:w-40 lg:w-48 h-18 sm:h-24 md:h-32 lg:h-40"
                                />
                              </div>
                            </div>

                            <div className="bg-white border p-2 sm:p-3 md:p-4 overflow-x-auto">
                              {activeTab === 'information' && (
                                <div className="space-y-4 sm:space-y-5 md:space-y-8">
                                  <div>
                                    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
                                      Basic Details
                                    </h2>
                                    <div className="w-full overflow-x-auto">
                                      <table className="w-full min-w-[500px] sm:min-w-[600px] border border-gray-300">
                                        <tbody>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Full Name</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.student?.name || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Gender</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.student?.gender || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Nationality</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.student?.nationality || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Date of Birth</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">
                                              {application?.student?.dateOfBirth
                                                ? format(new Date(application.student.dateOfBirth), "yyyy-MM-dd")
                                                : "N/A"}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Application ID</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.applicationNumber || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Email</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm break-words">{application?.student?.email || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Passport No.</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.student?.passportNumber || "N/A"}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  <div>
                                    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
                                      Course Details
                                    </h2>
                                    <div className="w-full overflow-x-auto">
                                      <table className="w-full min-w-[500px] sm:min-w-[600px] border border-gray-300">
                                        <tbody>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Course Name</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.course?.name || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">University</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.course?.university?.name || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Address</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.course?.university?.address || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Course Intake</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.intake || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Level</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.course?.level || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Duration</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">{application?.course?.duration || "N/A"}</td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">Tuition Fee</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">
                                              {application?.course?.currency} {application?.course?.tuitionFee}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="border p-1.5 sm:p-2 md:p-3 font-medium bg-gray-50 text-[10px] sm:text-xs md:text-sm">QS Ranking</td>
                                            <td className="border p-1.5 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">
                                              {application?.course?.university?.uni_rank?.find(
                                                (item) => item.type === "QS World"
                                              )?.rank || "N/A"}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                              <div className="bg-white border p-3 sm:p-4 md:p-6">
                                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">
                                  Application Tasks
                                </h3>
                                {tasks.map((task, index) => (
                                  <div
                                    key={index}
                                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b last:border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-orange-50`}
                                  >
                                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                                      <div>
                                        <h4 className={`font-semibold text-xs sm:text-sm md:text-base`}>
                                          {task.title}
                                        </h4>
                                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
                                          {task.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-0">
                                      <button
                                        onClick={() => handleContinue(task.title)}
                                        className="text-orange-600 font-medium hover:text-orange-700 cursor-pointer text-xs sm:text-sm md:text-base"
                                      >
                                        Continue →
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="">
                                <div className="bg-white border p-3 sm:p-4 md:p-6">
                                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 md:mb-6">
                                    Helpful Information
                                  </h3>
                                  <div className="space-y-3 sm:space-y-4 md:space-y-8">
                                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                                      <Clock className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                                      <div>
                                        <h4 className="font-semibold text-xs sm:text-sm md:text-base">
                                          Estimated Time
                                        </h4>
                                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
                                          20–30 minutes to complete
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                                      <FileText className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                                      <div>
                                        <h4 className="font-semibold text-xs sm:text-sm md:text-base">
                                          Information Needed
                                        </h4>
                                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
                                          Personal details, academic records,
                                          ID proof, etc.
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                                      <ShieldCheck className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                                      <div>
                                        <h4 className="font-semibold text-xs sm:text-sm md:text-base">
                                          Save Progress
                                        </h4>
                                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
                                          You can save progress and continue later.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {(activeMenu === "Communication" || activeMenu === "Document") && (
                        <div className="bg-white border">
                          {activeTab === "documents" && profile && allProfile && (
                            <Documents application={application} profile={allProfile.profile} studentId={profile?._id} onUpdate={() => updateProfile()} />
                          )}
                          {activeMenu === "Communication" && (
                            <Comments application={application} profile={profile} />
                          )}
                        </div>
                      )}

                      {activeMenu === "Activity Log" && (
                        <motion.div
                          key="activity-log"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.35 }}
                          className="bg-white border p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
                        >
                          <motion.div
                            animate={{
                              y: [0, -8, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="mb-3 sm:mb-4 md:mb-6"
                          >
                            <Clock className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-orange-500" />
                          </motion.div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                            No Activity Yet
                          </h2>
                          <p className="mt-1.5 sm:mt-2 md:mt-3 text-xs sm:text-sm md:text-base text-gray-500 max-w-md">
                            Your application activity timeline will appear here.
                            Updates such as document submissions, application reviews,
                            university responses, and status changes will be tracked automatically.
                          </p>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "140px" }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="h-1 bg-orange-500 rounded-full mt-4 sm:mt-6 md:mt-8"
                          />
                        </motion.div>
                      )}

                      {activeMenu === "Review & Submit" && (
                        <div className="border border-gray-300 p-2 sm:p-3 md:p-6 overflow-x-auto">
                          <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                              <div className="lg:col-span-2 space-y-2 sm:space-y-3 md:space-y-4">
                                <div>
                                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-800">
                                    Review & Submit
                                  </h1>
                                  <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1">
                                    Please review all the information below before submitting your application.
                                  </p>
                                </div>

                                {sections.map((item, index) => (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      const params = new URLSearchParams(window.location.search);
                                      params.set("tab", item.tab);
                                      window.history.replaceState(
                                        {},
                                        "",
                                        `${window.location.pathname}?${params}`
                                      );
                                      if (item.tab === "document") {
                                        setActiveMenu("documents");
                                        setActiveMenu("Document")
                                        setshowApplicationForm(false);
                                      } else {
                                        setActiveMenu("Application Form");
                                        setshowApplicationForm(true);
                                      }
                                    }}
                                    className="bg-white border p-2.5 sm:p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-sm transition cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                      <div className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                                        <item.icon size={14} className={item.color} />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base">
                                          {item.title}
                                        </h3>
                                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-0">
                                      <button className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border text-orange-600 font-medium hover:bg-orange-50 text-[10px] sm:text-xs md:text-sm rounded">
                                        Edit
                                      </button>
                                      <ChevronRight size={14} className="text-gray-500 flex-shrink-0" />
                                    </div>
                                  </div>
                                ))}

                                <div className="bg-white border p-3 sm:p-4 md:p-5">
                                  <h3 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
                                    Before you submit
                                  </h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                    {submitNotes.map((note, index) => (
                                      <div key={index} className="flex gap-1.5 sm:gap-2 md:gap-3">
                                        <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 bg-orange-50 flex items-center justify-center flex-shrink-0 rounded">
                                          <note.icon size={14} className="text-orange-600" />
                                        </div>
                                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                                          {note.text}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="sticky top-6 space-y-2 sm:space-y-3 md:space-y-4">
                                  <div className="bg-white p-2.5 sm:p-3 md:p-4 border border-gray-200 shadow-sm rounded-lg">
                                    <div className="flex justify-between items-center mb-1.5 sm:mb-2 md:mb-3">
                                      <h4 className="text-xs sm:text-sm md:text-base font-bold text-gray-800">Application Summary</h4>
                                    </div>
                                    <div className="space-y-1 text-[10px] sm:text-xs md:text-sm">
                                      <div className="flex flex-col sm:flex-row justify-between border-b border-gray-50 pb-1 gap-0.5 sm:gap-1">
                                        <span className="text-gray-500">Student Name</span>
                                        <span className="font-medium text-gray-800 break-words">{application?.student?.name || "--"}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-1 border-b border-gray-100 pb-1">
                                        <span className="text-gray-500 w-full sm:w-[120px] flex-shrink-0">
                                          Student Email
                                        </span>
                                        <span className="font-medium text-gray-800 flex-1 break-all text-left sm:text-right">
                                          {application?.student?.email || "--"}
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row justify-between border-b border-gray-50 pb-1 gap-0.5 sm:gap-1">
                                        <span className="text-gray-500">Student Phone</span>
                                        <span className="font-medium text-gray-800 break-words">{application?.student?.phone || "--"}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row justify-between border-b border-gray-50 pb-1 gap-0.5 sm:gap-1">
                                        <span className="text-gray-500">Country</span>
                                        <span className="font-medium text-gray-800 flex items-center gap-0.5 sm:gap-1 break-words">
                                          {application?.country || "India"}
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row justify-between border-b border-gray-50 pb-1 gap-0.5 sm:gap-1">
                                        <span className="text-gray-500">Course</span>
                                        <span className="font-medium text-gray-800 break-words">{application?.course?.name || "Computer Science"}</span>
                                      </div>
                                      {application.applicationId && (
                                        <div className="flex flex-col sm:flex-row justify-between border-b border-gray-50 pb-1 gap-0.5 sm:gap-1">
                                          <span className="text-gray-500">Application ID</span>
                                          <span className="font-medium text-gray-800 break-words">{application.applicationId}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="bg-white border p-3 sm:p-4 md:p-5 rounded-lg">
                                    <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-5">
                                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-[#1E293B]">
                                        Document Uploaded
                                      </h3>
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2 md:space-y-4">
                                      {documentList.map((item) => {
                                        if (
                                          item.applicationId &&
                                          item.applicationId !== application?.applicationNumber
                                        ) {
                                          return null;
                                        }
                                        return (
                                          <div
                                            key={item.docKey}
                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-0.5 sm:gap-1"
                                          >
                                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                                              {item.status === "approved" ? (
                                                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                                              ) : item.status === "pending" ? (
                                                <Clock3 size={14} className="text-orange-500 flex-shrink-0" />
                                              ) : (
                                                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                                              )}
                                              <span className="text-[10px] sm:text-xs md:text-sm text-gray-700 break-words">
                                                {item?.docName}
                                              </span>
                                            </div>
                                            <span
                                              className={`px-1.5 sm:px-2 md:px-3 py-0.5 text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusStyle(
                                                item.status
                                              )}`}
                                            >
                                              {item.status}
                                            </span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>

                                  <div className="bg-slate-50 border p-3 sm:p-4 md:p-5 rounded-lg">
                                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                                      <ShieldCheck className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                                      <div>
                                        <h4 className="font-medium text-xs sm:text-sm md:text-base">
                                          Secure & Confidential
                                        </h4>
                                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                                          Your information is secure and encrypted.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {currentStep?.step === "ReviewbyOoshas" && (
              <ReviewApplication application={application} allProfile={allProfile} profile={profile} activity={activityLogs} />
            )}

            {currentStep?.step === "SubmitToSchool" ? (
              <SubmittedtoSchool application={application} allProfile={allProfile} profile={profile} currentstep={currentStep} activity={activityLogs} />
            ) : currentStep?.step === "AwaitingSchoolResponse" ? (
              <SubmittedtoSchool application={application} allProfile={allProfile} profile={profile} currentstep={currentStep} activity={activityLogs} />
            ) : currentStep?.step === "OfferReceived" ? (
              <div className="relative">
                <SubmittedtoSchool
                  application={application}
                  allProfile={allProfile}
                  profile={profile}
                  currentstep={currentStep}
                  activity={activityLogs}
                  fetchApplication={fetchApplication}
                />
                {showCelebration && (
                  <div className="absolute -top-32 sm:-top-40 md:-top-60 lg:-top-76 inset-x-0 flex justify-center pointer-events-none z-10">
                    <img
                      src="/celebration.gif"
                      alt="Celebration"
                      className="w-full max-w-screen-sm md:max-w-screen-md lg:max-w-full"
                    />
                  </div>
                )}
              </div>
            ) : currentStep?.step === "Completed" && currentprimarystep !== "Refused" ? (
              <SubmittedtoSchool application={application} allProfile={allProfile} profile={profile} currentstep={currentStep} />
            ) : null}

            {currentStep?.step === "AdmissionProcessing" && (
              <AdmissionProcessing application={application} profile={profile} />
            )}

            {currentStep?.step === "PayEnrollenmentDeposit" && (
              <EnrollmentDeposit application={application} allprofile={allProfile} />
            )}

            {currentStep?.step === "Refused" && (
              <div className="w-full bg-white border border-red-100 shadow-sm overflow-hidden rounded-lg">
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-red-50 border border-red-200 p-3 sm:p-4 md:p-5 rounded-lg">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-100 flex items-center justify-center flex-shrink-0 rounded-lg">
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600" />
                          </div>
                          <div>
                            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-red-700">
                              Application Rejected
                            </h2>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-3 md:mt-4 bg-white border border-red-100 p-2 sm:p-2.5 md:p-3 rounded">
                          <p className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase text-red-700">
                            Rejection Reason
                          </p>
                          <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-0.5 sm:mt-1 md:mt-2">
                            {application?.documents?.[0]?.rejectReason ||
                              "No rejection reason provided."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-3 sm:p-4 md:p-5 rounded-lg h-[250px] sm:h-[300px] md:h-[400px] lg:h-[480px] overflow-y-auto">
                        <div className="space-y-3 sm:space-y-4 md:space-y-6">
                          {activityLogs?.map((item, index) => (
                            <div key={item._id} className="relative flex gap-2 sm:gap-3 md:gap-4">
                              {index !== activityLogs.length - 1 && (
                                <div className="absolute left-[9px] sm:left-[10px] top-5 sm:top-6 h-full w-[2px] bg-slate-200" />
                              )}
                              <div className="z-10">
                                {item.action === "STATUS_CHANGED" ? (
                                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-green-500 bg-white flex items-center justify-center rounded-full">
                                    <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-green-500" />
                                  </div>
                                ) : item.action === "APPLICATION_UPDATED" ? (
                                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-orange-600 flex items-center justify-center rounded-full">
                                    <Hourglass className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-slate-300 bg-white rounded-full" />
                                )}
                              </div>
                              <div>
                                <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 mb-0.5">
                                  {new Date(item.createdAt).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>
                                <h4 className="font-medium text-xs sm:text-sm md:text-base text-slate-800">
                                  {item.newValue || item.action.replaceAll("_", " ")}
                                </h4>
                                <p className={`text-[10px] sm:text-xs md:text-sm mt-0.5 ${item.action === "STATUS_CHANGED" ? "text-green-600 font-medium" : "text-slate-400"}`}>
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="border-b">
                        <div className="bg-slate-50 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b">
                          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">
                            Basic Details
                          </h2>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[400px] sm:min-w-[500px]">
                            <tbody>
                              {[
                                { label: "Full Name", value: application?.student?.name },
                                { label: "Gender", value: application?.student?.gender },
                                { label: "Nationality", value: application?.student?.nationality },
                                {
                                  label: "Date of Birth",
                                  value: application?.student?.dateOfBirth
                                    ? format(
                                      new Date(application.student.dateOfBirth),
                                      "yyyy-MM-dd"
                                    )
                                    : "N/A",
                                },
                                {
                                  label: "Application ID",
                                  value: application?.applicationNumber,
                                },
                                {
                                  label: "Email",
                                  value: application?.student?.email,
                                },
                                {
                                  label: "Passport No.",
                                  value: application?.student?.passportNumber,
                                },
                                {
                                  label: "Created At",
                                  value: application?.createdAt
                                    ? format(
                                      new Date(application.createdAt),
                                      "dd/MM/yyyy hh:mm a"
                                    )
                                    : "N/A",
                                },
                              ].map((item, index) => (
                                <tr
                                  key={index}
                                  className="border-b last:border-b-0 hover:bg-slate-50"
                                >
                                  <td className="w-1/3 px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-4 font-medium text-slate-700 bg-slate-50 text-[10px] sm:text-xs md:text-sm">
                                    {item.label}
                                  </td>
                                  <td className="px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-4 text-slate-900 text-[10px] sm:text-xs md:text-sm break-words">
                                    {item.value || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <div className="bg-slate-50 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b">
                          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">
                            Course Details
                          </h2>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[400px] sm:min-w-[500px]">
                            <tbody>
                              {[
                                {
                                  label: "Course Name",
                                  value: application?.course?.name,
                                },
                                {
                                  label: "University",
                                  value: application?.course?.university?.name,
                                },
                                {
                                  label: "Address",
                                  value: application?.course?.university?.address,
                                },
                                {
                                  label: "Course Intake",
                                  value: application?.intake,
                                },
                                {
                                  label: "Level",
                                  value: application?.course?.level,
                                },
                                {
                                  label: "Duration",
                                  value: application?.course?.duration,
                                },
                                {
                                  label: "Tuition Fee",
                                  value: `${application?.course?.currency || ""} ${application?.course?.tuitionFee || ""
                                    }`,
                                },
                                {
                                  label: "QS Ranking",
                                  value:
                                    application?.course?.university?.uni_rank?.find(
                                      (item) => item.type === "QS World"
                                    )?.rank || "N/A",
                                },
                              ].map((item, index) => (
                                <tr
                                  key={index}
                                  className="border-b last:border-b-0 hover:bg-slate-50"
                                >
                                  <td className="w-1/3 px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-4 font-medium text-slate-700 bg-slate-50 text-[10px] sm:text-xs md:text-sm">
                                    {item.label}
                                  </td>
                                  <td className="px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-4 text-slate-900 text-[10px] sm:text-xs md:text-sm break-words">
                                    {item.value || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-6 bg-amber-50 border border-amber-200 p-2.5 sm:p-3 md:p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-800 text-xs sm:text-sm md:text-base">
                      What's Next?
                    </h4>
                    <p className="text-[10px] sm:text-xs md:text-sm text-amber-700 mt-0.5 sm:mt-1 md:mt-2 leading-4 sm:leading-5 md:leading-6">
                      Please review the rejection reason carefully. You may contact your
                      education consultant for alternative course options, backup
                      applications, or guidance on reapplying in a future intake.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Intake Modal */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold">Change Intake</h2>
              <button onClick={() => setShowIntakeModal(false)} className="p-1 hover:bg-gray-100 rounded">✖</button>
            </div>
            <div className="min-h-[120px] sm:min-h-[150px] md:min-h-[200px]">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 mt-3 sm:mt-4 md:mt-6">
                {((application?.course?.university?.intakes || [])).map((item: string) => (
                  <div
                    key={item}
                    onClick={() => setSelectedIntake(item)}
                    className={`border rounded-lg p-1.5 sm:p-2 md:p-3 cursor-pointer transition-all ${selectedIntake === item ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 hover:border-gray-400 hover:shadow-sm"}`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 md:mb-2">
                      <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full border-2 ${selectedIntake === item ? "border-orange-500 bg-orange-500" : "border-gray-300"}`}>
                        {selectedIntake === item && <div className="w-1.5 h-1.5 rounded-full bg-white m-0.5"></div>}
                      </div>
                      <p className="font-medium text-xs sm:text-sm md:text-base">{item}</p>
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 ml-4 sm:ml-5 md:ml-6">Status: Open</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              <button onClick={() => setShowIntakeModal(false)}
                className="px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border rounded-md hover:bg-gray-50 w-full sm:w-auto">Cancel</button>
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
                className="px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors w-full sm:w-auto"
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
              <div className="sticky shrink-0 top-0 bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Answer Requirement</h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500">Provide the requested information</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitAnswer} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 min-h-0">
                  <div className="mb-3 sm:mb-4 md:mb-6 p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 md:mb-3">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">{selectedRequirement.name}</h3>
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${selectedRequirement.required === 'required'
                        ? 'bg-red-100 text-red-700'
                        : selectedRequirement.required === 'optional'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-purple-100 text-purple-700'
                        }`}>
                        {selectedRequirement.required === 'required' ? 'Required' : selectedRequirement.required === 'optional' ? 'Optional' : 'Early Access'}
                      </span>
                    </div>
                    {selectedRequirement.description && (
                      <div className="text-xs sm:text-sm md:text-base" dangerouslySetInnerHTML={{ __html: selectedRequirement.description }} />
                    )}
                  </div>
                  {(selectedRequirement.docType == 'form') ? (
                    <DynamicFormFields fieldsData={selectedRequirement.extra} onChange={handleDynamicChange} />
                  ) : (
                    <>
                      <div className="mb-2 sm:mb-3">
                        <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">
                          Your Notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-2.5 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-xs sm:text-sm md:text-base"
                          placeholder="Provide your answer here..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3 sm:mb-4">
                        <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Attach Files <span className="text-gray-400 font-normal text-[8px] sm:text-[10px] md:text-xs">(PDF, DOC, JPG, PNG - max 10MB)</span>
                        </label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 md:p-6 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                          <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400 mx-auto mb-1.5 sm:mb-2 md:mb-3" />
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Click or drag files to upload</p>
                          <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 mt-0.5 sm:mt-1">Supports PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                        </div>
                        {uploadedFiles.length > 0 && (
                          <div className="mt-2 sm:mt-3 md:mt-4 space-y-1.5 sm:space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-white border border-gray-200 p-1.5 sm:p-2 md:p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
                                  <File className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-500 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <button type="button" onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {uploadProgress[selectedRequirement?.id] > 0 && uploadProgress[selectedRequirement?.id] < 100 && (
                          <div className="mt-2 sm:mt-3 md:mt-4">
                            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500">Uploading...</span>
                              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium">{uploadProgress[selectedRequirement.id]}%</span>
                            </div>
                            <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
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
                <div className="p-2.5 sm:p-3 md:p-4 border-t bg-white flex flex-col sm:flex-row gap-1.5 sm:gap-2 md:gap-3 shrink-0">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm md:text-base">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#ff6a1a] text-white rounded-lg hover:bg-[#f45f0d] transition-colors disabled:opacity-50 text-xs sm:text-sm md:text-base" disabled={isSubmitting}>
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
      <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-0.5 sm:mb-1">
        {label}
      </p>
      <p className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">{value}</p>
    </div>
  );
}

function EditableItem({ label, value }: DetailProps) {
  return (
    <div>
      <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
        {label}
      </p>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <p className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">{value}</p>
      </div>
    </div>
  );
}






// "use client";

// import Image from "next/image";
// import {
//   Phone,
//   Pencil,
//   Download,
//   GraduationCap,
//   MapPin,
//   Upload,
//   CheckCircle,
//   AlertCircle,
//   Clock,
//   X,
//   Eye,
//   RefreshCw,
//   Award,
//   Briefcase,
//   User,
//   Mail as MailIcon,
//   Building2,
//   BadgeCheck,
//   Link as LinkIcon,
//   EyeOff,
//   Activity,
//   FileSearch,
//   Paperclip,
//   Link2,
//   Image as ImageIcon,
//   File,
//   Loader2,
//   UploadCloud,
//   XCircle,
//   School,
//   Globe2,
//   Link2Icon,
//   Edit2Icon,
//   Link2OffIcon,
//   SendHorizonal,
//   Play,
//   SquareAsterisk,
//   Ban,
//   CheckCircle2,
//   FileCheck2,
//   ArrowRight,
//   Gift,
//   ClipboardCheck,
//   Hourglass,
//   FileText,
//   ShieldCheck,
//   Check,
//   Calendar,
//   Clock3,
//   Circle,
//   Info,
//   MessageCircle,
//   Mail,
//   BadgeDollarSign,
//   Globe,
//   CalendarDays,
//   Hash,
//   ChevronDown,
//   Languages,
//   Monitor,
//   MonitorCheck,
//   MonitorCheckIcon,
//   FileCheck,
//   FileBadge,
//   ChevronRight
// } from "lucide-react";
// import Link from "next/link";
// import { useParams, useSearchParams } from "next/navigation";
// import { useRef, useState, useEffect, Suspense } from "react";
// import { format } from "date-fns";
// import axiosInstance from "@/app/axiosInstance";
// import DynamicFormFields from "@/components/dashboard/application/dynamicform";
// import toast from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";
// import { useGlobal } from "@/src/statecontext";
// import ApplicationFlow from "@/components/dashboard/application/applicationFlow";
// import ReviewApplication from "@/components/dashboard/application/reviewApllication";
// import SubmittedtoSchool from "@/components/dashboard/application/submittedtoSchool";
// import AdmissionProcessing from "@/components/dashboard/application/admissionProcessing";
// import ApplicationForm from "@/components/dashboard/application/applicationForm";
// import ProfileTabs from "@/components/couseller/ProfileSteps";
// import Comments from "@/components/dashboard/application/comments";
// import EnrollmentDeposit from "@/components/dashboard/application/enrollmentDeposit";
// import Documents from "@/components/couseller/Documents";

// interface ActivityLog {
//   _id: string
//   action: string
//   description: string
//   status: string
//   user: { name: string }
//   userType: 'student' | 'ooshas' | 'admin' | 'system'
//   createdAt: string
//   callDuration?: string
//   callType?: 'incoming' | 'outgoing' | 'missed'
//   metadata?: Record<string, any>
// }

// // Primary status steps configuration
// const STATUS_CONFIG = {
//   Pending: {
//     key: 'Pending',
//     label: 'Application Created',
//     icon: Clock,
//   },
//   Started: {
//     key: 'Started',
//     label: 'Application Started',
//     icon: Play,
//   },
//   ReviewbyOoshas: {
//     key: 'ReviewbyOoshas',
//     label: 'Under OOSHAS Review',
//     icon: FileSearch,
//   },
//   SubmitToSchool: {
//     key: 'SubmitToSchool',
//     label: 'Submitted to School',
//     icon: UploadCloud,
//   },
//   AwaitingSchoolResponse: {
//     key: 'AwaitingSchoolResponse',
//     label: 'Awaiting School Response',
//     icon: Clock,
//   },
//   AdmissionProcessing: {
//     key: 'AdmissionProcessing',
//     label: 'Admission Processing',
//     icon: RefreshCw,
//   },
//   OfferReceived: {
//     key: 'OfferReceived',
//     label: 'Offer Received',
//     icon: Award,
//   },
//   Refused: {
//     key: 'Refused',
//     label: 'Application Refused',
//     icon: XCircle,
//   },
//   Withdrawn: {
//     key: 'Withdrawn',
//     label: 'Application Withdrawn',
//     icon: Ban,
//   },
//   VisaProcessing: {
//     key: 'VisaProcessing',
//     label: 'Visa Processing',
//     icon: SquareAsterisk,
//   },
//   PreArrival: {
//     key: 'PreArrival',
//     label: 'Pre Arrival',
//     icon: Briefcase,
//   },
//   Arrived: {
//     key: 'Arrived',
//     label: 'Arrived',
//     icon: MapPin,
//   },
//   Completed: {
//     key: 'Completed',
//     label: 'Completed',
//     icon: CheckCircle2,
//   },
// };

// export default function StudentDetailsPage() {
//   const params = useParams();
//   const [activeTab, setActiveTab] = useState<'information' | 'documents' | 'activity'>('information');
//   const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
//   const [loading, setLoading] = useState(true);
//   const [application, setApplication] = useState<any>(null);
//   const [showIntakeModal, setShowIntakeModal] = useState(false);
//   const [selectedIntake, setSelectedIntake] = useState("");
//   const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
//   const [unreadCount] = useState(0);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
//   const [answerText, setAnswerText] = useState('');
//   const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [dynamicValues, setDynamicValues] = useState({});
//   const [activeDocTab, setActiveDocTab] = useState('All');
//   let validateFormRef = useRef<any>(null);
//   const messagesEndRef = useRef<any>(null);
//   const { profile, allProfile, updateProfile } = useGlobal()
//   const [activeMenu, setActiveMenu] = useState("Overview");

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const tab = params.get("tab");

//     if (tab === "document") {
//       setActiveTab("documents");
//       setActiveMenu("Document")

//       setshowApplicationForm(false);
//     } else if (tab) {
//       setshowApplicationForm(true);
//     }
//   }, []);

//   const [showCelebration, setShowCelebration] = useState(false);




//   const sections = [
//     {
//       title: "Personal Information",
//       description: "Name, Date of Birth, Gender, Nationality, Passport details",
//       tab: "personal",
//       icon: User,
//       bg: "bg-blue-50",
//       color: "text-blue-600",
//     },
//     {
//       title: "Contact Information",
//       description: "Email address, Phone number, Current address",
//       tab: "contact",
//       icon: Mail,
//       bg: "bg-green-50",
//       color: "text-green-600",
//     },
//     {
//       title: "Academic Background",
//       description: "School details, Education history, Marks/Grades",
//       tab: "academic",
//       icon: GraduationCap,
//       bg: "bg-purple-50",
//       color: "text-purple-600",
//     },
//     {
//       title: "English Language Proficiency",
//       tab: "tests",
//       description: "IELTS / TOEFL / Other test scores",
//       icon: Languages,
//       bg: "bg-orange-50",
//       color: "text-orange-600",
//     },
//     {
//       title: "Additional Information",
//       tab: "work",
//       description: "Work experience, Motivation letter, Reference letters",
//       icon: Briefcase,
//       bg: "bg-cyan-50",
//       color: "text-cyan-600",
//     },
//     {
//       title: "Document",
//       tab: "document",
//       description: "All Related Documents",
//       icon: Briefcase,
//       bg: "bg-red-50",
//       color: "text-red-600",
//     }
//   ];


//   const submitNotes = [
//     {
//       icon: AlertCircle,
//       title: "Complete Information",
//       text: "Please ensure all the details are correct and complete.",
//     },
//     {
//       icon: MonitorCheck,
//       title: "Submission Lock",
//       text: "Once submitted, you will not be able to make changes to your application.",
//     },
//     {
//       icon: MonitorCheckIcon,
//       title: "Track Status",
//       text: "You can track your application status from the dashboard.",
//     },
//   ];


//   const getStatusStyle = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return "bg-green-100 text-green-700 rounded-full";

//       case "pending":
//         return "bg-orange-100 text-orange-700 rounded-full";

//       case "rejected":
//         return "bg-red-100 text-red-700 rounded-full";

//       default:
//         return "bg-gray-100 text-gray-700 rounded-full";
//     }
//   };

//   const Parsedocuments =
//     typeof allProfile?.profile?.documents === "string"
//       ? JSON.parse(allProfile.profile.documents)
//       : allProfile?.profile?.documents;



//   const documentList = Object.values(Parsedocuments || {});

//     const steps = [
//     {
//       id: 1,
//       title: "Application Started",
//       subTitle: "In Progress",
//       step: "Started",
//       icon: FileText,
//     },
//     {
//       id: 2,
//       title: "Under OOSHAS Review",
//       subTitle: "current",
//       step: "ReviewbyOoshas",
//       icon: Clock,
//     },
//     {
//       id: 3,
//       title: "Submitted to School",
//       subTitle: "In Progress",
//       step: "SubmitToSchool",
//       icon: Upload,
//     },
//     {
//       id: 4,
//       title: "Awaiting School Response",
//       subTitle: "In Progress",
//       step: "AwaitingSchoolResponse",
//       icon: Hourglass,
//     },
//     {
//       id: 5,
//       title: "Offer Received",
//       subTitle: "In Progress",
//       step: "OfferReceived",
//       icon: Gift,
//     },
//     {
//       id: 6,
//       title: "Pay Enrollenment Deposit",
//       subTitle: "In Progress",
//       step: "PayEnrollenmentDeposit",
//       icon: ClipboardCheck,
//     },
//     {
//       id: 7,
//       title: "Confirmmation Letter",
//       subTitle: "In Progress",
//       step: "Completed",
//       icon: ClipboardCheck,
//     },
//   ];


//   const timelinesteps =
//     application?.primaryStatus === "Refused"
//       ? [
//         ...steps.filter(
//           (item) =>
//             item.step !== "PayEnrollenmentDeposit" &&
//             item.step !== "Completed"
//         ),
//         {
//           id: 8,
//           title: "Rejection Overview",
//           subTitle: "Rejected",
//           step: "Refused",
//           icon: FileText,
//         },
//       ]
//       : steps;

//         const currentprimarystep = application?.primaryStatus

//   const currentStatus = application?.primaryStatus;

//   const currentStep =
//     timelinesteps.find(
//       item => item.step === currentStatus
//     ) || timelinesteps[0];

//   const currentIndex = timelinesteps.findIndex(
//     item => item.step === currentStatus
//   );


//   useEffect(() => {
//   if (currentStep?.step === "OfferReceived") {
//     setShowCelebration(true);

//     const timer = setTimeout(() => {
//       setShowCelebration(false);
//     }, 6000); // hide after 5 seconds

//     return () => clearTimeout(timer);
//   }
// }, [currentStep?.step]);



//   useEffect(() => {
//     fetchApplication();
//   }, [params.id]);

//   useEffect(() => {
//     if (application?._id) {
//       fetchActivities();
//     }
//   }, [application?._id]);

//   const fetchApplication = async () => {
//     try {
//       setLoading(true);

//       const response = await axiosInstance.get(
//         `/applications/${params.id}`
//       );

//       const applicationData = response.data?.data;

//       setApplication(applicationData);

//       if (applicationData?.student?._id) {
//         setProfile(allProfile?.profile);
//         setUser(profile);
//       }
//     } catch (error) {
//       console.error("Error fetching application details:", error);
//       console.log(error?.response?.data);
//       toast.error("Failed to load application details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchActivities = async () => {
//     try {
//       const response = await axiosInstance.get(`/communication/applications/${application._id}/activities?limit=100&status=STATUS_CHANGED`);
//       const activities = response.data?.data || [];
//       const formattedActivities = activities.map((activity: any) => ({
//         ...activity,
//         id: activity._id,
//         user: activity.user?.name || 'System',
//         timestamp: activity.createdAt
//       }));
//       setActivityLogs(formattedActivities);
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//     }
//   };

//   const handleDynamicChange = (values: any, validateFn: any) => {
//     setDynamicValues(values);
//     validateFormRef.current = validateFn;
//   };

//   const removeFile = (index: number) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const allowedTypes = [
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'image/jpeg',
//       'image/png',
//       'image/gif',
//       'image/webp'
//     ];
//     const maxSize = 10 * 1024 * 1024;
//     const validFiles = files.filter(file => {
//       if (!allowedTypes.includes(file.type)) {
//         toast.error(`Invalid file type: ${file.name}`);
//         return false;
//       }
//       if (file.size > maxSize) {
//         toast.error(`File too large: ${file.name} (max 10MB)`);
//         return false;
//       }
//       return true;
//     });
//     setUploadedFiles(prev => [...prev, ...validFiles]);
//     e.target.value = '';
//   };

//   const uploadDocument = async (
//     applicationId: string,
//     documentId: string,
//     file: File,
//     answer?: string,
//     onProgress?: (progress: number) => void
//   ) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     if (answer) formData.append('answer', answer);
//     formData.append('docType', selectedRequirement?.docType);
//     console.log(formData)

//     const response = await axiosInstance.put(
//       `/auth/updateDocuments/${applicationId}/doc?type=application`,
//       {
//         documents: [
//           {
//             fileName: formData,
//             docType: selectedRequirement?.docType,
//             answer,
//           },
//         ],
//       }
//     );
//     return response.data;
//   };

//   const handleSubmitAnswer = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateFormRef.current && !validateFormRef.current()) {
//       toast.error('Please fill all required fields');
//       return;
//     }
//     let fields = [];
//     try {
//       fields = typeof selectedRequirement.extra === "string"
//         ? JSON.parse(selectedRequirement.extra)
//         : selectedRequirement.extra || [];
//     } catch (err) {
//       console.error("Invalid JSON in extra fields");
//     }
//     const emptyRequiredFields = fields.filter((field: any) => {
//       const value = dynamicValues[field.label];
//       return field.required && (!value || value.toString().trim() === "");
//     });
//     if (emptyRequiredFields.length > 0) {
//       toast.error(`Missing required fields: ${emptyRequiredFields.map((f: any) => f.label).join(", ")}`);
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       if (uploadedFiles.length > 0) {
//         const file = uploadedFiles[0];
//         const result = await uploadDocument(
//           application?.student?._id,
//           selectedRequirement._id,
//           file,
//           answerText,
//           (progress) => setUploadProgress(prev => ({ ...prev, [selectedRequirement._id]: progress }))
//         );
//         if (result.success) {
//           setApplication((prev: any) => {
//             if (!prev) return prev;
//             return {
//               ...prev,
//               documents: prev.documents.map((doc: any) =>
//                 doc.id === selectedRequirement._id
//                   ? { ...doc, ...result.data, status: 'Pending' }
//                   : doc
//               )
//             };
//           });
//           toast.success('Document uploaded successfully!');
//           fetchApplication();
//           fetchActivities();
//         }
//       } else if (Object.keys(dynamicValues).length > 0) {
//         const response = await axiosInstance.put(
//           `/applications/documents/${application._id}/${selectedRequirement._id}`,
//           { answer: JSON.stringify(dynamicValues), docType: selectedRequirement.docType }
//         );
//         if (response.data.success) {
//           fetchApplication();
//           fetchActivities();
//           toast.success('Answer submitted successfully!');
//         }
//       }
//       setIsDrawerOpen(false);
//       setAnswerText('');
//       setUploadedFiles([]);
//       setDynamicValues({});
//       setUploadProgress({});
//     } catch (error: any) {
//       console.error('Submission error:', error);
//       const message = error.response?.data?.message || 'Upload failed. Please try again.';
//       toast.error(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };





//   const getPaymentStatusBadge = (status: string) => {
//     switch (status) {
//       case 'Completed':
//         return 'bg-green-100 text-green-700 border-green-200'
//       case 'Failed':
//         return 'bg-red-100 text-red-700 border-red-200'
//       default:
//         return 'bg-yellow-100 text-yellow-700 border-yellow-200'
//     }
//   };
//   // ==============================
//   // STATES
//   // ==============================






//   // Stores: { name: string, url: string }





//   const [showApplicationFlow, setShowApplicationFlow] = useState(true)

//   const [showApplicationForm, setshowApplicationForm] = useState(false)

//   const [stepchange, setstepchange] = useState("Started")
//   const [steptitle, setsteptitle] = useState({
//     title: "Application Started",
//     subTitle: "In Progress",
//     step: "Started",
//   });
//   const [CountriesList, setCountriesList] = useState()
//   const [user, setUser] = useState()
//   const [profile2, setProfile] = useState();


//   const [tasks, setTasks] = useState([
//     {
//       title: "Fill Application Form",
//       description: "Provide your personal details",
//       completed: true,
//     },
//     {
//       title: "Upload Documents",
//       description: "Upload required documents",
//       completed: false,
//     },
//     {
//       title: "Review & Submit",
//       description: "Review your application and submit",
//       completed: false,
//     },
//   ]);

//   console.log(stepchange)

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         setLoading(true);

//         const countriesRes = await axiosInstance.get("/countries?limit=250")
//         const data = countriesRes.data.data

//         setCountriesList(data)
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//         toast.error("Failed to load student data");
//       } finally {
//         setLoading(false);
//       }
//     };


//     fetchStudentData();

//   }, [application?.data?.student?._id]);

//   // Add this effect to check if application is already completed/submitted
//   // Modify this useEffect in your component
//   useEffect(() => {
//     if (application) {
//       // TEMPORARILY COMMENT THIS OUT TO SEE THE FLOW
//       // const completedStatuses = ['SubmitToSchool', 'AwaitingSchoolResponse', 'AdmissionProcessing', 'OfferReceived', 'Refused', 'Withdrawn', 'Completed']
//       // if (completedStatuses.includes(application?.primaryStatus)) {
//       //   setShowApplicationFlow(false)
//       // } else {
//       //   setShowApplicationFlow(true)
//       // }

//       // Force show the flow for testing
//       setShowApplicationFlow(true)
//     }
//   }, [application])








//   const getApplicationFlow = (status: string) => {
//     // Refused path
//     if (['Refused', 'Withdrawn'].includes(status)) {
//       return [
//         'Application Started',
//         'ReviewbyOoshas',
//         'SubmitToSchool',
//         'AwaitingSchoolResponse',
//         'AdmissionProcessing',
//         'OfferReceived',

//       ];
//     }
//     return [
//       'Started',
//       'ReviewbyOoshas',
//       'SubmitToSchool',
//       'AwaitingSchoolResponse',
//       'AdmissionProcessing',
//       'OfferReceived',
//     ];
//   };

//   const timelineSteps = getApplicationFlow(
//     application?.primaryStatus
//   ).map((key) => STATUS_CONFIG[key]);

//   const currentStepIndex = timelineSteps?.findIndex(
//     (step) => step?.key === application?.primaryStatus
//   );

//   const isStepCompleted = (index: number) =>
//     index < currentStepIndex;

//   const isStepCurrent = (index: number) =>
//     index === currentStepIndex;



//   if (loading) {
//     return (
//       <div className="min-h-screen p-6">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-64 mb-5"></div>
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-8 mb-6">
//             <div className="space-y-4">
//               <div className="h-6 bg-gray-200 rounded w-3/4"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-8 mb-6">
//             <div className="space-y-4">
//               <div className="h-6 bg-gray-200 rounded w-3/4"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }







//   const handleTaskCheck = (index) => {
//     setTasks((prev) =>
//       prev.map((task, i) =>
//         i === index
//           ? { ...task, completed: !task.completed }
//           : task
//       )
//     );
//   };


//   const handleContinue = (title) => {
//     switch (title) {
//       case "Fill Application Form":
//         setActiveMenu("Application Form");
//         setshowApplicationForm(true);
//         break;

//       case "Upload Documents":
//         setActiveMenu("Document");
//         setActiveTab("documents");
//         break;

//       case "Review & Submit":
//         setActiveMenu("Review & Submit");
//         break;

//       default:
//         break;
//     }
//   };




//   return (
//     <div className="min-h-screen ">
//       <div className="bg-white ">
//         {/* Course Details */}
//         <div className="space-y-3 bg-white">

//           <div className="flex gap-4 items-center mb-10">
//             <h2 className="font-bold text-lg">{currentStep.title}</h2>
//             <span className="bg-orange-100 text-orange-500 p-2 text-base">{currentStep.subTitle}</span>
//           </div>





//           <div className="w-full py-1">


//             <div className="relative flex justify-between items-start">
//               {/* Background Line */}
//               <div className="absolute top-7 left-14 right-5 h-[2px] bg-gray-300 z-0" />


//               {/* Progress Line */}
//               <div
//                 className="absolute top-7 left-14 h-[2px] bg-orange-500 z-0 transition-all duration-500"
//                 style={{
//                   width: `${(currentIndex / (timelinesteps.length - 1)) * 90}%`,
//                   right: "auto",
//                 }}
//               />

//               {timelinesteps.map((step, index) => {






//                 const status =
//                   index < currentIndex
//                     ? "completed"
//                     : index === currentIndex
//                       ? "current"
//                       : "pending";

//                 const isActive = status === "current";

//                 return (
//                   <div
//                     key={index}
//                     className="relative flex flex-col items-center z-10"
//                   >
//                     {isActive ? (
//                       <div className="relative flex flex-col items-center">
//                         {/* Active Circle */}
//                         <div className="relative z-20">
//                           {/* <div className="absolute inset-0 bg-orange-400/20 scale-125" /> */}

//                           <div className="w-14 h-14 rounded-full border border-orange-500 bg-white flex items-center justify-center shadow-sm">
//                             {step.icon ? (
//                               <step.icon className="w-6 h-6 text-orange-500" />
//                             ) : (
//                               <FileText className="w-6 h-6 text-orange-500" />
//                             )}
//                           </div>
//                         </div>

//                         {/* Active Card */}
//                         <div
//                           onClick={() => {
//                             setstepchange(step.step)
//                             setsteptitle(step)
//                           }}
//                           className="mt-[-6px] w-[170px] h-[115px] bg-orange-50 border border-orange-500 rounded-lg flex flex-col items-center justify-center px-2 cursor-pointer"
//                         >
//                           <h3 className="text-lg font-semibold text-orange-600 text-center leading-6">
//                             {step.title}
//                           </h3>

//                           <p className="mt-1 text-base text-orange-600">
//                             {status}
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <>
//                         {/* Inactive Circle */}
//                         <div
//                           className={`w-14 h-14 rounded-full border flex items-center justify-center
//                 ${status === "completed"
//                               ? "bg-green-500 border-green-500"
//                               : "bg-white border-gray-300"
//                             }`}
//                         >
//                           {step.icon ? (
//                             <step.icon
//                               className={`w-5 h-5 ${status === "completed"
//                                 ? "text-white"
//                                 : "text-gray-500"
//                                 }`}
//                             />
//                           ) : (
//                             <Clock className="w-5 h-5 text-gray-500" />
//                           )}
//                         </div>

//                         {/* Title */}
//                         <h4
//                           onClick={() => {
//                             setstepchange(step.step)
//                             setsteptitle(step)

//                           }}
//                           className="mt-2 text-center font-medium text-base text-gray-700 max-w-[200px] leading-5 cursor-pointer"
//                         >
//                           {step.title}
//                         </h4>

//                         {/* Status */}
//                         <p
//                           className={`text-base mt-1 ${status === "completed"
//                             ? "text-black"
//                             : "text-gray-500"
//                             }`}
//                         >
//                           {status}
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>






//           <div>
//             {currentStep?.step === "Started" && (
//               <div className="grid grid-cols-12 gap-2">
//                 {/* Left Sidebar */}
//                 <div className="col-span-3">
//                   <div className="bg-white border sticky top-6  overflow-hidden">


//                     <div className="space-y-1 p-2">
//                       {[
//                         "Overview",
//                         "Application Form",
//                         "Document",
//                         "Communication",
//                         "Activity Log",
//                         "Review & Submit"
//                       ].map((item) => (
//                         <motion.div
//                           key={item}
//                           whileHover={{ x: 4 }}
//                           whileTap={{ scale: 0.98 }}
//                           onClick={() => {
//                             setActiveMenu(item);

//                             switch (item) {
//                               case "Application Form":
//                                 setshowApplicationForm(true);
//                                 break;

//                               case "Communication":
//                                 setshowApplicationForm(false);
//                                 setActiveTab("activity");
//                                 break;
//                               case "Document":
//                                 setshowApplicationForm(false);
//                                 setActiveMenu("Document")
//                                 setActiveTab("documents")
//                                 break

//                               case "Overview":
//                                 setshowApplicationForm(false);
//                                 setActiveMenu("Overview");
//                                 setActiveTab("information")
//                                 break;

//                               case "Activity Log":
//                                 setActiveMenu("Activity Log")
//                                 setshowApplicationForm(false);

//                                 break;

//                               case "Review & Submit":
//                                 setActiveMenu("Review & Submit")

//                               default:
//                                 setshowApplicationForm(false);
//                             }
//                           }}
//                           className={`relative cursor-pointer px-5 py-4`}
//                         >
//                           {/* Active Background Animation */}
//                           {activeMenu === item && (
//                             <motion.div
//                               layoutId="activeSidebar"
//                               className="absolute inset-0 bg-orange-50 border-l-4 border-orange-500"
//                               transition={{
//                                 type: "spring",
//                                 stiffness: 350,
//                                 damping: 30,
//                               }}
//                             />
//                           )}

//                           <div className="relative z-10 flex items-center gap-3">
//                             <FileText
//                               className={`w-4 h-4 ${activeMenu === item
//                                 ? "text-orange-500"
//                                 : "text-gray-500"
//                                 }`}
//                             />

//                             <span
//                               className={`text-base ${activeMenu === item
//                                 ? "font-semibold text-orange-500"
//                                 : "text-gray-700"
//                                 }`}
//                             >
//                               {item}
//                             </span>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>

//                     <div className="border-t p-6">
//                       <h3 className="font-semibold text-base">
//                         Need Help?
//                       </h3>

//                       <p className="text-base text-gray-500 mt-2">
//                         Contact our support team for assistance.
//                       </p>
//                       <Link href={"/dashboard/support"}>
//                         <button className="mt-4 text-orange-600 font-medium">
//                           Contact Support →
//                         </button></Link>
//                     </div>
//                   </div>
//                 </div>



//                 <AnimatePresence mode="wait">
//                   {showApplicationForm ? (
//                     <motion.div
//                       key="application-form"
//                       initial={{ opacity: 0, y: -20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 20 }}
//                       transition={{ duration: 0.3 }}
//                       className="col-span-9"
//                     >
//                       <Suspense fallback={<div>Loading...</div>}>
//                         <ProfileTabs
//                           studentId={profile?._id}
//                           user={profile}
//                           profile={allProfile?.profile}
//                           countriesList={CountriesList}
//                           onUpdate={updateProfile}
//                         /></Suspense>
//                     </motion.div>
//                   ) : (
//                     <motion.div
//                       key={activeMenu}
//                       initial={{ opacity: 0, y: -20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 20 }}
//                       transition={{ duration: 0.3 }}
//                       className="col-span-9 gap-4"
//                     >
//                       {/* Overview Content */}
//                       {/* Application Started Card */}
//                       {activeMenu === "Overview" && (
//                         <>
//                           <div className="grid grid-cols-1 gap-4">
//                             <div className="bg-[#fefaf8] border border-orange-400 p-3 flex justify-between">


//                               <div className="w-sm lg:mt-6">
//                                 <div className="flex items-center gap-3 flex-wrap">
//                                   <h2 className="text-lg font-bold">
//                                     Application Started
//                                   </h2>

//                                   <span className="px-3 py-1 bg-orange-100 text-orange-700  text-base font-medium">
//                                     {application?.primaryStatus}
//                                   </span>
//                                 </div>

//                                 <p className="mt-4 text-gray-600 w-3xl text-[16px]">
//                                   You have started your application for {application?.course?.name} at {application?.course?.university?.name}
//                                 </p>

//                                 <div className="flex items-center gap-3 mt-2">
//                                   <Calendar className="w-5 h-5 text-orange-600" />

//                                   <div>
//                                     <p className="text-base text-gray-500">
//                                       Started On
//                                     </p>

//                                     <p className="font-semibold">
//                                       {new Date(application?.createdAt).toLocaleString()}
//                                     </p>
//                                   </div>
//                                 </div>


//                               </div>

//                               <div className="shrink-0">
//                                 <img
//                                   src="/started-application.gif"
//                                   alt=""
//                                   className="w-48 lg:w-40 lg:h-40 mt-4"
//                                 />
//                               </div>

//                             </div>
//                             <div className="bg-white border p-4">
//                               {activeTab === 'information' && (
//                                 <div className="space-y-8">

//                                   {/* Basic Details */}
//                                   <div>
//                                     <h2 className="text-xl font-semibold mb-4">
//                                       Basic Details
//                                     </h2>

//                                     <table className="w-full border border-gray-300">
//                                       <tbody>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Full Name</td>
//                                           <td className="border p-3">{application?.student?.name || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Gender</td>
//                                           <td className="border p-3">{application?.student?.gender || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Nationality</td>
//                                           <td className="border p-3">{application?.student?.nationality || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Date of Birth</td>
//                                           <td className="border p-3">
//                                             {application?.student?.dateOfBirth
//                                               ? format(new Date(application.student.dateOfBirth), "yyyy-MM-dd")
//                                               : "N/A"}
//                                           </td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Application ID</td>
//                                           <td className="border p-3">{application?.applicationNumber || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Email</td>
//                                           <td className="border p-3">{application?.student?.email || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Passport No.</td>
//                                           <td className="border p-3">{application?.student?.passportNumber || "N/A"}</td>
//                                         </tr>
//                                       </tbody>
//                                     </table>
//                                   </div>

//                                   {/* Course Details */}
//                                   <div>
//                                     <h2 className="text-xl font-semibold mb-4">
//                                       Course Details
//                                     </h2>

//                                     <table className="w-full border border-gray-300">
//                                       <tbody>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Course Name</td>
//                                           <td className="border p-3">{application?.course?.name || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">University</td>
//                                           <td className="border p-3">{application?.course?.university?.name || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Address</td>
//                                           <td className="border p-3">{application?.course?.university?.address || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Course Intake</td>
//                                           <td className="border p-3">{application?.intake || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Level</td>
//                                           <td className="border p-3">{application?.course?.level || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Duration</td>
//                                           <td className="border p-3">{application?.course?.duration || "N/A"}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">Tuition Fee</td>
//                                           <td className="border p-3">
//                                             {application?.course?.currency} {application?.course?.tuitionFee}
//                                           </td>
//                                         </tr>
//                                         <tr>
//                                           <td className="border p-3 font-medium bg-gray-50">QS Ranking</td>
//                                           <td className="border p-3">
//                                             {application?.course?.university?.uni_rank?.find(
//                                               (item) => item.type === "QS World"
//                                             )?.rank || "N/A"}
//                                           </td>
//                                         </tr>
//                                       </tbody>
//                                     </table>
//                                   </div>

//                                 </div>
//                               )}
//                             </div>

//                             <div className="grid grid-cols-2 gap-6">
//                               {/* Application Tasks */}
//                               <div className="bg-white border p-6">
//                                 <h3 className="text-lg font-semibold mb-4">
//                                   Application Tasks
//                                 </h3>

//                                 {tasks.map((task, index) => (

//                                   <div
//                                     key={index}
//                                     className={`flex items-center justify-between py-4 px-4 border-b last:border-0 transition-all
//  transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-orange-50`}
//                                   >
//                                     <div className="flex items-start gap-4 ">


//                                       <div>
//                                         <h4
//                                           className={`font-semibold`}
//                                         >
//                                           {task.title}
//                                         </h4>

//                                         <p className="text-gray-500 text-base">
//                                           {task.description}
//                                         </p>
//                                       </div>
//                                     </div>

//                                     <div className="flex items-center gap-3">
//                                       {(
//                                         <button
//                                           onClick={() => handleContinue(task.title)}
//                                           className="text-orange-600 font-medium hover:text-orange-700 cursor-pointer"
//                                         >
//                                           Continue →
//                                         </button>
//                                       )}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>

//                               {/* Right Panel */}
//                               <div className="">
//                                 <div className="bg-white border p-6">
//                                   <h3 className="text-lg font-semibold mb-6">
//                                     Helpful Information
//                                   </h3>

//                                   <div className="space-y-8">
//                                     <div className="flex gap-4">
//                                       <Clock className="text-green-600" />

//                                       <div>
//                                         <h4 className="font-semibold">
//                                           Estimated Time
//                                         </h4>

//                                         <p className="text-gray-500 text-base">
//                                           20–30 minutes to complete
//                                         </p>
//                                       </div>
//                                     </div>

//                                     <div className="flex gap-4">
//                                       <FileText className="text-orange-600" />

//                                       <div>
//                                         <h4 className="font-semibold">
//                                           Information Needed
//                                         </h4>

//                                         <p className="text-gray-500 text-base">
//                                           Personal details, academic records,
//                                           ID proof, etc.
//                                         </p>
//                                       </div>
//                                     </div>

//                                     <div className="flex gap-4">
//                                       <ShieldCheck className="text-green-600" />

//                                       <div>
//                                         <h4 className="font-semibold">
//                                           Save Progress
//                                         </h4>

//                                         <p className="text-gray-500 text-base">
//                                           You can save progress and continue later.
//                                         </p>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       )}

//                       {(
//                         activeMenu === "Communication" || activeMenu === "Document") && (
//                           <>  {/* Tabs */}
//                             <div className="bg-white border">




//                               {/* Information Tab Content */}



//                               {/* Documents Tab Content */}
//                               {activeTab === "documents" && profile && allProfile && (
//                                 <Documents application={application} profile={allProfile.profile} studentId={profile?._id} onUpdate={() => updateProfile()} />
//                               )}

//                               {
//                                 activeMenu === "Communication" && (
//                                   <Comments application={application} profile={profile} />
//                                 )
//                               }


//                             </div>
//                           </>
//                         )}

//                       {activeMenu === "Activity Log" && (
//                         <motion.div
//                           key="activity-log"
//                           initial={{ opacity: 0, scale: 0.95 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           exit={{ opacity: 0, scale: 0.95 }}
//                           transition={{ duration: 0.35 }}
//                           className="bg-white border p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
//                         >
//                           {/* Animated Icon */}
//                           <motion.div
//                             animate={{
//                               y: [0, -8, 0],
//                             }}
//                             transition={{
//                               duration: 2,
//                               repeat: Infinity,
//                               ease: "easeInOut",
//                             }}
//                             className="mb-6"
//                           >
//                             <Clock className="w-20 h-20 text-orange-500" />
//                           </motion.div>

//                           <h2 className="text-2xl font-bold text-gray-800">
//                             No Activity Yet
//                           </h2>

//                           <p className="mt-3 text-gray-500 max-w-md">
//                             Your application activity timeline will appear here.
//                             Updates such as document submissions, application reviews,
//                             university responses, and status changes will be tracked automatically.
//                           </p>

//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: "220px" }}
//                             transition={{ delay: 0.4, duration: 1 }}
//                             className="h-1 bg-orange-500 rounded-full mt-8"
//                           />
//                         </motion.div>
//                       )}

//                       {activeMenu === "Review & Submit" && (
//                         <div className="border border-gray-300 p-6">
//                           <div className="max-w-7xl mx-auto">
//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                               {/* Left Section */}
//                               <div className="lg:col-span-2 space-y-4">

//                                 <div>
//                                   <h1 className="text-lg font-bold text-slate-800">
//                                     Review & Submit
//                                   </h1>
//                                   <p className="text-gray-500 text-base mt-1">
//                                     Please review all the information below before submitting your application.
//                                   </p>
//                                 </div>

//                                 {sections.map((item, index) => (
//                                   <div
//                                     key={index}
//                                     onClick={() => {
//                                       const params = new URLSearchParams(window.location.search);

//                                       params.set("tab", item.tab);

//                                       window.history.replaceState(
//                                         {},
//                                         "",
//                                         `${window.location.pathname}?${params}`
//                                       );

//                                       if (item.tab === "document") {
//                                         setActiveMenu("documents");
//                                         setActiveMenu("Document")
//                                         setshowApplicationForm(false);
//                                       } else {
//                                         setActiveMenu("Application Form");
//                                         setshowApplicationForm(true);
//                                       }
//                                     }}
//                                     className="bg-white border p-4 flex items-center justify-between hover:shadow-sm transition"
//                                   >
//                                     <div className="flex items-center gap-4">
//                                       <div className={`h-12 w-12 flex items-center justify-center ${item.bg}`}>
//                                         <item.icon size={22} className={item.color} />
//                                       </div>

//                                       <div>
//                                         <h3 className="font-semibold text-slate-800 text-base">
//                                           {item.title}
//                                         </h3>

//                                         <p className="text-base text-gray-500">
//                                           {item.description}
//                                         </p>
//                                       </div>
//                                     </div>

//                                     <div className="flex items-center gap-2">


//                                       <button className="px-4 py-2 border text-orange-600 font-medium hover:bg-orange-50">
//                                         Edit
//                                       </button>

//                                       <ChevronRight size={18} className="text-gray-500" />
//                                     </div>
//                                   </div>
//                                 ))}

//                                 {/* Before Submit */}
//                                 <div className="bg-white border p-5">
//                                   <h3 className="font-semibold mb-4 text-lg">
//                                     Before you submit
//                                   </h3>

//                                   <div className="grid md:grid-cols-3 gap-4">
//                                     {submitNotes.map((note, index) => (
//                                       <div
//                                         key={index}
//                                         className="flex gap-3"
//                                       >
//                                         <div className="h-9 w-9 bg-orange-50 flex items-center justify-center">
//                                           <note.icon
//                                             size={18}
//                                             className="text-orange-600"
//                                           />
//                                         </div>

//                                         <p className="text-base text-gray-600">
//                                           {note.text}
//                                         </p>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Right Sidebar */}
//                               <div>
//                                 <div className="sticky top-6 space-y-4">

//                                   {/* Summary */}
//                                   {/* Application Summary */}
//                                   <div className="bg-white p-4  border border-gray-200 shadow-sm">
//                                     <div className="flex justify-between items-center mb-3">
//                                       <h4 className="text-base font-bold text-gray-800">Application Summary</h4>
//                                     </div>
//                                     <div className="space-y-1.5 text-base">
//                                       <div className="flex justify-between border-b border-gray-50 pb-1.5">
//                                         <span className="text-gray-500">Student Name</span>
//                                         <span className="font-medium text-gray-800">{application?.student?.name || "--"}</span>
//                                       </div>
//                                       <div className="flex gap-3 border-b border-gray-100 pb-2">
//                                         <span className="text-gray-500 w-[120px] flex-shrink-0">
//                                           Student Email
//                                         </span>

//                                         <span className="font-medium text-gray-800 flex-1 break-all text-right">
//                                           {application?.student?.email || "--"}
//                                         </span>
//                                       </div>
//                                       <div className="flex justify-between border-b border-gray-50 pb-1.5">
//                                         <span className="text-gray-500">Student Phone</span>
//                                         <span className="font-medium text-gray-800">{application?.student?.phone || "--"}</span>
//                                       </div>
//                                       <div className="flex justify-between border-b border-gray-50 pb-1.5">
//                                         <span className="text-gray-500">Country</span>
//                                         <span className="font-medium text-gray-800 flex items-center gap-1">
//                                           {application?.country || "India"}
//                                         </span>
//                                       </div>

//                                       <div className="flex justify-between border-b border-gray-50 pb-1.5">
//                                         <span className="text-gray-500">Course</span>
//                                         <span className="font-medium text-gray-800">{application?.course?.name || application?.course?.name || "Computer Science"}</span>
//                                       </div>
//                                       {application.applicationId && (
//                                         <div className="flex justify-between border-b border-gray-50 pb-1.5">
//                                           <span className="text-gray-500">Application ID</span>
//                                           <span className="font-medium text-gray-800">{application.applicationId}</span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>

//                                   {/* Documents */}
//                                   <div className="bg-white border p-5 ">
//                                     <div className="flex justify-between items-center mb-5">
//                                       <div className="flex items-center gap-2">


//                                         <h3 className="font-bold text-lg text-[#1E293B] text-lg">
//                                           Document Uploaded
//                                         </h3>

//                                       </div>


//                                     </div>

//                                     <div className="space-y-4">
//                                       {documentList.map((item) => {
//                                         if (
//                                           item.applicationId &&
//                                           item.applicationId !== application?.applicationNumber
//                                         ) {
//                                           return null;
//                                         }
//                                         return (
//                                           <div
//                                             key={item.docKey}
//                                             className="flex justify-between items-center gap-2"
//                                           >
//                                             <div className="flex items-center gap-3">
//                                               {item.status === "approved" ? (
//                                                 <CheckCircle size={18} className="text-green-500" />
//                                               ) : item.status === "pending" ? (
//                                                 <Clock3 size={18} className="text-orange-500" />
//                                               ) : (
//                                                 <AlertCircle size={18} className="text-red-500" />
//                                               )}

//                                               <span className="text-base text-gray-700">
//                                                 {item?.docName}
//                                               </span>
//                                             </div>

//                                             <span
//                                               className={`px-3 py-1 text-base font-medium ${getStatusStyle(
//                                                 item.status
//                                               )}`}
//                                             >
//                                               {item.status}
//                                             </span>
//                                           </div>
//                                         )
//                                       })}
//                                     </div>
//                                   </div>

//                                   {/* Security */}
//                                   <div className="bg-slate-50 border p-5">
//                                     <div className="flex items-center gap-3">
//                                       <ShieldCheck className="text-orange-600" />
//                                       <div>
//                                         <h4 className="font-medium">
//                                           Secure & Confidential
//                                         </h4>

//                                         <p className="text-base text-gray-500">
//                                           Your information is secure and encrypted.
//                                         </p>
//                                       </div>
//                                     </div>
//                                   </div>



//                                 </div>
//                               </div>

//                             </div>
//                           </div>
//                         </div>
//                       )}


//                     </motion.div>
//                   )}
//                 </AnimatePresence>





//               </div>
//             )}

//             {currentStep?.step === "ReviewbyOoshas" && (
//               <ReviewApplication application={application} allProfile={allProfile} profile={profile} activity={activityLogs} />
//             )}

//             {currentStep?.step === "SubmitToSchool" ? (
//               <SubmittedtoSchool application={application} allProfile={allProfile} profile={profile} currentstep={currentStep} activity={activityLogs} />
//             ) : currentStep?.step === "AwaitingSchoolResponse" ? (
//               <SubmittedtoSchool application={application} allProfile={allProfile} profile={profile} currentstep={currentStep} activity={activityLogs} />
//             ) : currentStep?.step === "OfferReceived" ? (
//               <div className="relative">
//                 <SubmittedtoSchool
//                   application={application}
//                   allProfile={allProfile}
//                   profile={profile}
//                   currentstep={currentStep}
//                   activity={activityLogs}
//                   fetchApplication={fetchApplication}
//                 />

//                 {showCelebration && (
//                   <div className="absolute -top-76 inset-x-0 flex justify-center pointer-events-none z-10">
//                     <img
//                       src="/celebration.gif"
//                       alt="Celebration"
//                       className="w-full"
//                     />
//                   </div>
//                 )}
//               </div>
//             ) : currentStep?.step === "Completed" && currentprimarystep !== "Refused" ? (
//               <SubmittedtoSchool application={application} allProfile={allProfile} profile={profile} currentstep={currentStep} />
//             ) : null}

//             {currentStep?.step === "AdmissionProcessing" && (
//               <AdmissionProcessing application={application} profile={profile} />
//             )}

//             {currentStep?.step === "PayEnrollenmentDeposit" && (
//               <EnrollmentDeposit application={application} allprofile={allProfile} />
//             )}

//             {
//               currentStep?.step === "Refused" && (
//                 <div className="w-full bg-white border border-red-100  shadow-sm overflow-hidden">



//                   {/* Body */}
//                   <div className="p-6">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


//                       {/* Header */}
//                       <div className="">

//                         {/* Left Small Card */}
//                         <div className="space-y-4 mb-4">
//                           <div className="bg-red-50 border border-red-200 p-5">
//                             <div className="flex items-center gap-3">
//                               <div className="w-12 h-12 bg-red-100 flex items-center justify-center">
//                                 <XCircle className="w-6 h-6 text-red-600" />
//                               </div>

//                               <div>
//                                 <h2 className="text-lg font-semibold text-red-700">
//                                   Application Rejected
//                                 </h2>
//                               </div>
//                             </div>

//                             <div className="mt-4 bg-white border border-red-100  p-3">
//                               <p className="text-base font-semibold uppercase text-red-700">
//                                 Rejection Reason
//                               </p>

//                               <p className="text-base text-slate-600 mt-2">
//                                 {application?.documents?.[0]?.rejectReason ||
//                                   "No rejection reason provided."}
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Right Large Card */}
//                         <div className="bg-slate-50 border border-slate-200  p-5 h-120 overflow-y-auto">
//                           <div className="space-y-6">
//                             {activityLogs?.map((item, index) => (
//                               <div key={item._id} className="relative flex gap-4">
//                                 {index !== activityLogs.length - 1 && (
//                                   <div className="absolute left-[10px] top-6 h-full w-[2px] bg-slate-200" />
//                                 )}

//                                 <div className="z-10">
//                                   {item.action === "STATUS_CHANGED" ? (
//                                     <div className="w-5 h-5 border-2 border-green-500 bg-white flex items-center justify-center">
//                                       <Check className="w-3 h-3 text-green-500" />
//                                     </div>
//                                   ) : item.action === "APPLICATION_UPDATED" ? (
//                                     <div className="w-5 h-5 bg-orange-600 flex items-center justify-center">
//                                       <Hourglass className="w-3 h-3 text-white" />
//                                     </div>
//                                   ) : (
//                                     <div className="w-5 h-5 border-2 border-slate-300 bg-white" />
//                                   )}
//                                 </div>

//                                 <div>
//                                   <p className="text-base text-slate-500 mb-1">
//                                     {new Date(item.createdAt).toLocaleString("en-IN", {
//                                       day: "2-digit",
//                                       month: "short",
//                                       year: "numeric",
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                       hour12: true,
//                                     })}
//                                   </p>

//                                   <h4 className="font-medium text-base text-slate-800">
//                                     {item.newValue || item.action.replaceAll("_", " ")}
//                                   </h4>

//                                   <p
//                                     className={`text-base mt-1 ${item.action === "STATUS_CHANGED"
//                                       ? "text-green-600 font-medium"
//                                       : "text-slate-400"
//                                       }`}
//                                   >
//                                     {item.description}
//                                   </p>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                       </div>


//                       {/* Application Details */}
//                       <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

//                         {/* Basic Details */}
//                         <div className="border-b">
//                           <div className="bg-slate-50 px-6 py-4 border-b">
//                             <h2 className="text-lg font-semibold text-slate-800">
//                               Basic Details
//                             </h2>
//                           </div>

//                           <div className="overflow-x-auto">
//                             <table className="w-full">
//                               <tbody>
//                                 {[
//                                   { label: "Full Name", value: application?.student?.name },
//                                   { label: "Gender", value: application?.student?.gender },
//                                   { label: "Nationality", value: application?.student?.nationality },
//                                   {
//                                     label: "Date of Birth",
//                                     value: application?.student?.dateOfBirth
//                                       ? format(
//                                         new Date(application.student.dateOfBirth),
//                                         "yyyy-MM-dd"
//                                       )
//                                       : "N/A",
//                                   },
//                                   {
//                                     label: "Application ID",
//                                     value: application?.applicationNumber,
//                                   },
//                                   {
//                                     label: "Email",
//                                     value: application?.student?.email,
//                                   },
//                                   {
//                                     label: "Passport No.",
//                                     value: application?.student?.passportNumber,
//                                   },
//                                   {
//                                     label: "Created At",
//                                     value: application?.createdAt
//                                       ? format(
//                                         new Date(application.createdAt),
//                                         "dd/MM/yyyy hh:mm a"
//                                       )
//                                       : "N/A",
//                                   },
//                                 ].map((item, index) => (
//                                   <tr
//                                     key={index}
//                                     className="border-b last:border-b-0 hover:bg-slate-50"
//                                   >
//                                     <td className="w-1/3 px-6 py-4 font-medium text-slate-700 bg-slate-50">
//                                       {item.label}
//                                     </td>
//                                     <td className="px-6 py-4 text-slate-900">
//                                       {item.value || "N/A"}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>

//                         {/* Course Details */}
//                         <div>
//                           <div className="bg-slate-50 px-6 py-4 border-b">
//                             <h2 className="text-lg font-semibold text-slate-800">
//                               Course Details
//                             </h2>
//                           </div>

//                           <div className="overflow-x-auto">
//                             <table className="w-full">
//                               <tbody>
//                                 {[
//                                   {
//                                     label: "Course Name",
//                                     value: application?.course?.name,
//                                   },
//                                   {
//                                     label: "University",
//                                     value: application?.course?.university?.name,
//                                   },
//                                   {
//                                     label: "Address",
//                                     value: application?.course?.university?.address,
//                                   },
//                                   {
//                                     label: "Course Intake",
//                                     value: application?.intake,
//                                   },
//                                   {
//                                     label: "Level",
//                                     value: application?.course?.level,
//                                   },
//                                   {
//                                     label: "Duration",
//                                     value: application?.course?.duration,
//                                   },
//                                   {
//                                     label: "Tuition Fee",
//                                     value: `${application?.course?.currency || ""} ${application?.course?.tuitionFee || ""
//                                       }`,
//                                   },
//                                   {
//                                     label: "QS Ranking",
//                                     value:
//                                       application?.course?.university?.uni_rank?.find(
//                                         (item) => item.type === "QS World"
//                                       )?.rank || "N/A",
//                                   },
//                                 ].map((item, index) => (
//                                   <tr
//                                     key={index}
//                                     className="border-b last:border-b-0 hover:bg-slate-50"
//                                   >
//                                     <td className="w-1/3 px-6 py-4 font-medium text-slate-700 bg-slate-50">
//                                       {item.label}
//                                     </td>
//                                     <td className="px-6 py-4 text-slate-900">
//                                       {item.value || "N/A"}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>

//                       </div>
//                     </div>

//                     {/* Timeline Message */}
//                     <div className="mt-6 bg-amber-50 border border-amber-200 p-4">
//                       <h4 className="font-semibold text-amber-800">
//                         What's Next?
//                       </h4>

//                       <p className="text-base text-amber-700 mt-2 leading-6">
//                         Please review the rejection reason carefully. You may contact your
//                         education consultant for alternative course options, backup
//                         applications, or guidance on reapplying in a future intake.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )
//             }

//           </div>



//         </div>



//       </div>

//       {/* Intake Modal */}
//       {
//         showIntakeModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//             <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="text-lg font-semibold">Change Intake</h2>
//                 <button onClick={() => setShowIntakeModal(false)} className="p-1 hover:bg-gray-100 rounded">✖</button>
//               </div>
//               <div className="min-h-[200px]">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 overflow-y-auto max-h-[400px]">
//                   {((application?.course?.university?.intakes || [])).map((item: string) => (
//                     <div
//                       key={item}
//                       onClick={() => setSelectedIntake(item)}
//                       className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedIntake === item ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 hover:border-gray-400 hover:shadow-sm"}`}
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className={`w-4 h-4 rounded-full border-2 ${selectedIntake === item ? "border-orange-500 bg-orange-500" : "border-gray-300"}`}>
//                           {selectedIntake === item && <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>}
//                         </div>
//                         <p className="font-medium text-base">{item}</p>
//                       </div>
//                       <p className="text-base text-gray-500 ml-6">Status: Open</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2 mt-4">
//                 <button onClick={() => setShowIntakeModal(false)}
//                   className="px-3 py-2 text-base border rounded-md hover:bg-gray-50">Cancel</button>
//                 <button
//                   onClick={async () => {
//                     if (selectedIntake) {
//                       try {
//                         await axiosInstance.put(`/applications/update/${application._id}`, { intake: selectedIntake });
//                         toast.success("Intake updated successfully");
//                         fetchApplication();
//                         setShowIntakeModal(false);
//                       } catch (error) {
//                         toast.error("Failed to update intake");
//                       }
//                     }
//                   }}
//                   className="px-4 py-2 text-base bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       }

//       {/* Document Upload Drawer */}
//       <AnimatePresence>
//         {isDrawerOpen && selectedRequirement && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsDrawerOpen(false)}
//               className="fixed inset-0 bg-black/50 z-50"
//             />
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 30, stiffness: 300 }}
//               className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
//             >
//               <div className="sticky shrink-0 top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-10">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Answer Requirement</h2>
//                   <p className="text-base text-gray-500">Provide the requested information</p>
//                 </div>
//                 <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmitAnswer} className="flex flex-col flex-1 min-h-0">
//                 <div className="flex-1 overflow-y-auto p-6 min-h-0">
//                   <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-2 mb-3">
//                       <h3 className="font-semibold text-gray-900">{selectedRequirement.name}</h3>
//                       <span className={`px-2 py-0.5 rounded-full text-base font-medium ${selectedRequirement.required === 'required'
//                         ? 'bg-red-100 text-red-700'
//                         : selectedRequirement.required === 'optional'
//                           ? 'bg-gray-100 text-gray-700'
//                           : 'bg-purple-100 text-purple-700'
//                         }`}>
//                         {selectedRequirement.required === 'required' ? 'Required' : selectedRequirement.required === 'optional' ? 'Optional' : 'Early Access'}
//                       </span>
//                     </div>
//                     {selectedRequirement.description && (
//                       <div dangerouslySetInnerHTML={{ __html: selectedRequirement.description }} />
//                     )}
//                   </div>
//                   {(selectedRequirement.docType == 'form') ? (
//                     <DynamicFormFields fieldsData={selectedRequirement.extra} onChange={handleDynamicChange} />
//                   ) : (
//                     <>
//                       <div className="mb-3">
//                         <label className="block text-base font-medium text-gray-700 mb-1">
//                           Your Notes <span className="text-red-500">*</span>
//                         </label>
//                         <textarea
//                           rows={3}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
//                           placeholder="Provide your answer here..."
//                           value={answerText}
//                           onChange={(e) => setAnswerText(e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div className="mb-4">
//                         <label className="block text-base font-medium text-gray-700 mb-2">
//                           Attach Files <span className="text-gray-400 font-normal">(PDF, DOC, JPG, PNG - max 10MB)</span>
//                         </label>
//                         <div
//                           className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
//                           onClick={() => document.getElementById('fileInput')?.click()}
//                         >
//                           <input
//                             id="fileInput"
//                             type="file"
//                             multiple
//                             className="hidden"
//                             accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
//                             onChange={handleFileSelect}
//                           />
//                           <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
//                           <p className="text-base text-gray-600 font-medium">Click or drag files to upload</p>
//                           <p className="text-base text-gray-400 mt-1">Supports PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
//                         </div>
//                         {uploadedFiles.length > 0 && (
//                           <div className="mt-4 space-y-2">
//                             {uploadedFiles.map((file, index) => (
//                               <div key={index} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
//                                 <div className="flex items-center gap-3 min-w-0">
//                                   <File className="w-5 h-5 text-orange-500 flex-shrink-0" />
//                                   <div className="min-w-0">
//                                     <p className="text-base font-medium text-gray-900 truncate">{file.name}</p>
//                                     <p className="text-base text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
//                                   </div>
//                                 </div>
//                                 <button type="button" onClick={() => removeFile(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
//                                   <X className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         )}

//                         {uploadProgress[selectedRequirement?.id] > 0 && uploadProgress[selectedRequirement?.id] < 100 && (
//                           <div className="mt-4">
//                             <div className="flex items-center justify-between mb-1">
//                               <span className="text-base text-gray-500">Uploading...</span>
//                               <span className="text-base text-gray-500 font-medium">{uploadProgress[selectedRequirement.id]}%</span>
//                             </div>
//                             <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                               <motion.div
//                                 initial={{ width: 0 }}
//                                 animate={{ width: `${uploadProgress[selectedRequirement.id]}%` }}
//                                 className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="p-4 border-t bg-white flex gap-3 shrink-0">
//                   <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
//                     Cancel
//                   </button>
//                   <button type="submit" className="flex-1 px-4 py-2 bg-[#ff6a1a] text-white rounded-lg hover:bg-[#f45f0d] transition-colors disabled:opacity-50" disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Submit Answer'}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div >
//   );
// }

// type DetailProps = {
//   label: string;
//   value: string;
// };

// function DetailItem({ label, value }: DetailProps) {
//   return (
//     <div>
//       <p className="text-base font-semibold text-gray-800 mb-1">
//         {label}
//       </p>
//       <p className="text-gray-700 font-medium text-base">{value}</p>
//     </div>
//   );
// }

// function EditableItem({ label, value }: DetailProps) {
//   return (
//     <div>
//       <p className="text-base font-semibold text-gray-700 mb-2">
//         {label}
//       </p>
//       <div className="flex items-center gap-2">
//         <p className="text-gray-700 font-medium text-base">{value}</p>
//         {/* <Pencil size={14} className="text-gray-500 cursor-pointer hover:text-[#ff6a1a]" /> */}
//       </div>
//     </div>
//   );
// }


