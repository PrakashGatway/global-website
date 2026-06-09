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
  Hash
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
import ApplicationFlow from "@/components/dashboard/application/applicationFlow";
import ReviewApplication from "@/components/dashboard/application/reviewApllication";
import SubmittedtoSchool from "@/components/dashboard/application/submittedtoSchool";
import AdmissionProcessing from "@/components/dashboard/application/admissionProcessing";
import ApplicationForm from "@/components/dashboard/application/applicationForm";
import ProfileTabs from "@/components/couseller/ProfileSteps";
import Comments from "@/components/dashboard/application/comments";
import EnrollmentDeposit from "@/components/dashboard/application/enrollmentDeposit";

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
  const { profile, allProfile } = useGlobal()
  const [activeMenu, setActiveMenu] = useState("Overview");

  console.log(allProfile)

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

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      'Approved': 'bg-green-100 text-green-700 border-green-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Completed': 'bg-green-100 text-green-700 border-green-200',
      'Failed': 'bg-red-100 text-red-700 border-red-200',
      'processing': 'bg-orange-100 text-orange-700 border-orange-200',
      'submitted': 'bg-purple-100 text-purple-700 border-purple-200',
      'accepted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'in_review': 'bg-orange-100 text-orange-700 border-orange-200',
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
        return <RefreshCw className="w-4 h-4 text-orange-600 animate-spin" />
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
  // ==============================
  // STATES
  // ==============================




  // Stores: { name: string, url: string }





  const [showApplicationFlow, setShowApplicationFlow] = useState(true)

  const [showApplicationForm, setshowApplicationForm] = useState(false)

  const [stepchange, setstepchange] = useState("Started")
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

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [countriesRes] = await Promise.all([
          axiosInstance.get("/countries?limit=250"),
        ]);

        setCountriesList(countriesRes.data.data || []);
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (application?.data?.student?._id) {
      fetchStudentData();
    }
  }, [application?.data?.student?._id]);

  // Add this effect to check if application is already completed/submitted
  // Modify this useEffect in your component
  useEffect(() => {
    if (application) {
      // TEMPORARILY COMMENT THIS OUT TO SEE THE FLOW
      // const completedStatuses = ['SubmitToSchool', 'AwaitingSchoolResponse', 'AdmissionProcessing', 'OfferReceived', 'Refused', 'Withdrawn', 'Completed']
      // if (completedStatuses.includes(application?.primaryStatus)) {
      //   setShowApplicationFlow(false)
      // } else {
      //   setShowApplicationFlow(true)
      // }

      // Force show the flow for testing
      setShowApplicationFlow(true)
    }
  }, [application])








  const getApplicationFlow = (status: string) => {
    // Refused path
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

  const currentStepIndex = timelineSteps.findIndex(
    (step) => step.key === application?.primaryStatus
  );

  const isStepCompleted = (index: number) =>
    index < currentStepIndex;

  const isStepCurrent = (index: number) =>
    index === currentStepIndex;



  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-5"></div>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-8 mb-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-8 mb-6">
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

  const steps = [
    {
      id: 1,
      title: "Application Started",
      status: "current",
      subTitle: "In Progress",
      step: "Started",
      icon: FileText,
    },
    {
      id: 2,
      title: "Under OOSHAS Review",
      status: "pending",
      step: "ReviewbyOoshas",
      icon: Clock,
    },
    {
      id: 3,
      title: "Submitted to School",
      status: "completed",
      subTitle: "In Progress",
      step: "SubmitToSchool",
      icon: Upload,
    },
    {
      id: 4,
      title: "Awaiting School Response",
      status: "pending",
      subTitle: "In Progress",
      step: "AwaitingSchoolResponse",
      icon: Hourglass,
    },
    {
      id: 5,
      title: "Offer Received",
      subTitle: "In Progress",
      status: "pending",
      step: "OfferReceived",
      icon: Gift,
    },
    {
      id: 6,
      title: "Pay Enrollenment Deposit",
      subTitle: "In Progress",
      status: "pending",
      step: "PayEnrollenmentDeposit",
      icon: ClipboardCheck,
    },
    {
      id: 7,
      title: "Confirmmation Letter",
      subTitle: "In Progress",
      status: "pending",
      step: "ConfirmmationLetter",
      icon: ClipboardCheck,
    },
  ];




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
        break;

      case "Upload Documents":
        setActiveMenu("Communication");
        setActiveTab("documents");
        break;

      case "Review & Submit":
        setActiveMenu("Communication");
        setActiveTab("information");
        break;

      default:
        break;
    }
  };


  const currentStep = steps.find(
    (item) => item.step === stepchange
  );




  return (
    <div className="min-h-screen ">
      <div className="bg-white ">
        {/* Course Details */}
        <div className="space-y-3 bg-white">
          <div className="flex items-start justify-between pb-0">
            <div className="flex items-top gap-3">
              {application?.course?.university?.uni_logo ? (
                <img
                  src={application.course.university.uni_logo}
                  alt={application.course.university.name}
                  className="w-12 h-12 mt-1  object-cover"
                />
              ) : (
                <div className="w-12 h-12  bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-orange-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href={`/dashboard/programs/${application?.course?.slug}`} className="flex  items-center gap-1">
                    <h1 className="text-2xl font-medium text-gray-800 hover:text-orange-900">{application?.course?.name}</h1>
                    <span className="inline-flex"><Link href={`/dashboard/programs/${application?.course?.slug}`} className="text-orange-500 underline"><Link2Icon className="w-6 h-6" /></Link></span>
                  </Link>
                  <span className="text-xl font-medium text-gray-600"> ({application?.applicationNumber})</span>
                  {application.course?.applicationFee > 0 && application?.paymentStatus == "Pending" && <span className={`px-3 py-1 text-xs font-medium border flex items-center gap-1.5 ${getPaymentStatusBadge(application?.paymentStatus)}`}>
                    {application?.paymentStatus === 'Completed' ? <CheckCircle className="w-3.5 h-3.5" /> :
                      application?.paymentStatus === 'Failed' ? <XCircle className="w-3.5 h-3.5" /> :
                        <Clock className="w-3.5 h-3.5" />}
                    Payment: {application?.paymentStatus || 'Pending'}
                  </span>}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{application?.course?.university?.name}  </span>
                  <span className="inline-flex"><Link href={`/dashboard/universities/${application?.course?.university?.slug}`} className="text-orange-500 underline"><Link2Icon className="w-5 h-5" /></Link></span>
                  <span className="text-gray-300">•</span>
                  <Globe2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{application?.country}</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm gap-2 mt-1 flex-wrap">
                  <span>Application No: {application?.applicationNumber}</span> |
                  <span>Selected Intake: {application?.intake}</span>
                  <button onClick={() => setShowIntakeModal(true)} className="inline-flex hover:text-orange-500 p-1 transition-colors">
                    <Edit2Icon className="w-4 h-4" />
                  </button> |
                  <span>Submission deadline: {application?.deadline || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>


          {/* Staff Details */}
          {/* <div className="mt-2 w-full border-t pt-5 px-8 grid grid-cols-3 gap-10 mt-8 pt-8 border-t">
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
            </div> */}

          <div className="w-full py-1">
            <div className="relative flex items-start justify-between">

              {/* Timeline Line */}
              <div className="absolute top-7 left-14 right-5 h-[1px] bg-gray-300 z-0 " />

              {steps.map((step, index) => {
                const isActive =
                  step.status !== "completed" &&
                  step.status !== "pending";

                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center z-10"
                  >
                    {isActive ? (
                      <div className="relative flex flex-col items-center">

                        {/* Active Circle */}
                        <div className="relative z-20">
                          <div className="absolute inset-0  bg-orange-400/20 scale-125" />

                          <div className="w-14 h-14  border border-orange-500 bg-white flex items-center justify-center shadow-sm">
                            <FileText className="w-6 h-6 text-orange-500" />
                          </div>
                        </div>

                        {/* Active Card */}
                        <div onClick={() => setstepchange(step.step)} className="mt-[-6px] w-[170px] h-[115px] bg-orange-50 border border-orange-500 rounded-lg flex flex-col items-center justify-center px-2">
                          <h3 className="text-lg font-semibold text-orange-600 text-center leading-6">
                            {step.title}
                          </h3>

                          <p className="mt-1 text-xs text-orange-600">
                            {step.status}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Inactive Circle */}
                        <div
                          className={`w-14 h-14 rounded-full border flex items-center justify-center
    ${step.status === "completed"
                              ? "bg-green-500 border-green-500"
                              : "bg-white border-gray-300"
                            }
  `}
                        >
                          {step.icon ? (
                            <step.icon className={`w-5 h-5  ${step.status === "completed" ? "text-white" : "text-gray-500"}`} />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-500" />
                          )}
                        </div>

                        {/* Title */}
                        <h4 onClick={() => setstepchange(step.step)} className="mt-2 text-center font-medium text-sm text-gray-700 max-w-[200px] leading-5">
                          {step.title}
                        </h4>

                        {/* Status */}
                        {step.status && (
                          <p className={`text-xs  mt-1 ${step.status === "completed" ? "text-black" : "text-gray-500"}`}>
                            {step.status}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>






          <div>
            {currentStep?.step === "Started" && (
              <div className="grid grid-cols-12 gap-2">
                {/* Left Sidebar */}
                <div className="col-span-3">
                  <div className="bg-white border sticky top-6  overflow-hidden">


                    <div className="space-y-1 p-2">
                      {[
                        "Overview",
                        "Application Form",
                        "Document",
                        "Communication",
                        "Activity Log",
                      ].map((item) => (
                        <motion.div
                          key={item}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
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

                              default:
                                setshowApplicationForm(false);
                            }
                          }}
                          className={`relative cursor-pointer px-5 py-4`}
                        >
                          {/* Active Background Animation */}
                          {activeMenu === item && (
                            <motion.div
                              layoutId="activeSidebar"
                              className="absolute inset-0 bg-green-50 border-l-4 border-green-500"
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 30,
                              }}
                            />
                          )}

                          <div className="relative z-10 flex items-center gap-3">
                            <FileText
                              className={`w-4 h-4 ${activeMenu === item
                                ? "text-green-700"
                                : "text-gray-500"
                                }`}
                            />

                            <span
                              className={`text-sm ${activeMenu === item
                                ? "font-semibold text-green-700"
                                : "text-gray-700"
                                }`}
                            >
                              {item}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t p-6">
                      <h3 className="font-semibold text-sm">
                        Need Help?
                      </h3>

                      <p className="text-sm text-gray-500 mt-2">
                        Contact our support team for assistance.
                      </p>

                      <button className="mt-4 text-orange-600 font-medium">
                        Contact Support →
                      </button>
                    </div>
                  </div>
                </div>



                <AnimatePresence mode="wait">
                  {showApplicationForm ? (
                    <motion.div
                      key="application-form"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="col-span-9"
                    >
                      <ProfileTabs
                        studentId={application?.data?.student?._id}
                        user={user}
                        profile={profile2}
                        countriesList={[]}
                        onUpdate={() => {
                          axiosInstance.get(`/users/${application?.data?.student?._id}`).then(res => {
                            setUser(res.data.data || res.data);
                            setProfile(res.data.data?.profile || res.data?.profile);
                          });
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeMenu}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="col-span-9 gap-4"
                    >
                      {/* Overview Content */}
                      {/* Application Started Card */}
                      {activeMenu === "Overview" && (
                        <>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white border p-3 flex justify-between">


                              <div className="w-sm lg:mt-6">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h2 className="text-lg font-bold">
                                    Application Started
                                  </h2>

                                  <span className="px-3 py-1 bg-green-100 text-green-700  text-sm font-medium">
                                    {application?.primaryStatus}
                                  </span>
                                </div>

                                <p className="mt-4 text-gray-600 w-3xl text-[16px]">
                                  You have started your application for {application?.course?.name} at {application?.course?.university?.name}
                                </p>

                                <div className="flex items-center gap-3 mt-2">
                                  <Calendar className="w-5 h-5 text-green-600" />

                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Started On
                                    </p>

                                    <p className="font-semibold">
                                      {new Date(application?.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>


                              </div>

                              <div className="shrink-0">
                                <img
                                  src="https://png.pngtree.com/png-vector/20260505/ourmid/pngtree-d-purple-clipboard-checklist-icon-with-yellow-pencil-for-task-management-png-image_19233480.webp"
                                  alt=""
                                  className="w-48 lg:w-60 lg:h-50"
                                />
                              </div>

                            </div>
                            <div className="bg-white border p-4">
                              {activeTab === 'information' && (
                                <div className="px-3 py-8">
                                  <div>
                                    <h2 className="text-[20px] font-semibold text-[#2b1640] mb-6">
                                      Basic Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                      <DetailItem
                                        label="Full Name"
                                        value={application?.student?.name || "N/A"}
                                      />
                                      <DetailItem
                                        label="Gender"
                                        value={application?.student?.gender || "N/A"}
                                      />
                                      <DetailItem
                                        label="Nationality"
                                        value={application?.student?.nationality || "N/A"}
                                      />
                                      <DetailItem
                                        label="Date of Birth"
                                        value={application?.student?.dateOfBirth ? format(new Date(application.student.dateOfBirth), 'yyyy-MM-dd') : "N/A"}
                                      />
                                      <DetailItem
                                        label="Application ID"
                                        value={application?.applicationNumber || "N/A"}
                                      />
                                      <DetailItem
                                        label="E-Mail"
                                        value={application?.student?.email || "N/A"}
                                      />
                                      <DetailItem
                                        label="Passport No."
                                        value={application?.student?.passportNumber || "N/A"}
                                      />
                                      <DetailItem
                                        label="Created At"
                                        value={application?.createdAt ? format(new Date(application.createdAt), 'dd/MM/yyyy hh:mm a') : "N/A"}
                                      />
                                    </div>
                                  </div>

                                  {/* Course Details Section */}
                                  <div className="mt-8 border-t pt-8">
                                    <h2 className="text-[20px] font-semibold text-[#2b1640] mb-6">
                                      Course Details
                                    </h2>
                                    {application.course && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                          { label: "Course Name", value: application?.course?.name },
                                          { label: "University", value: application?.course?.university?.name },
                                          { label: "Address", value: application?.course?.university?.address },
                                          { label: "Course Intake", value: application?.intake },
                                          { label: "Level", value: application?.course?.level },
                                          { label: "Duration", value: application?.course?.duration },
                                          { label: "Tuition Fee", value: `${application?.course?.currency || ""} ${application?.course?.tuitionFee || ""}` },
                                          { label: "QS Ranking", value: application?.course?.university?.uni_rank?.find((item: any) => item.type === "QS World")?.rank || "N/A" },
                                        ].map((item, index) => (
                                          <div key={index}>
                                            <p className="text-sm font-medium text-gray-800 mb-1">{item.label}</p>
                                            <h3 className="font-medium text-gray-800">{item.value || "N/A"}</h3>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>


                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              {/* Application Tasks */}
                              <div className="bg-white border p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                  Application Tasks
                                </h3>

                                {tasks.map((task, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between py-4 px-4 border-b last:border-0 transition-all
      ${task.completed
                                        ? "bg-green-50"
                                        : "bg-white"
                                      }`}
                                  >
                                    <div className="flex items-start gap-4">
                                      <input
                                        type="checkbox"
                                        checked={task.completed}
                                        readOnly
                                        className="w-5 h-5 mt-1 accent-green-500"
                                      />

                                      <div>
                                        <h4
                                          className={`font-semibold ${task.completed
                                            ? "text-green-700"
                                            : "text-gray-800"
                                            }`}
                                        >
                                          {task.title}
                                        </h4>

                                        <p className="text-gray-500 text-sm">
                                          {task.description}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      {task.completed ? (
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                          Completed
                                        </span>
                                      ) : (
                                        <>
                                          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                                            Pending
                                          </span>

                                          <button
                                            onClick={() => handleContinue(task.title)}
                                            className="text-orange-600 font-medium hover:text-orange-700"
                                          >
                                            Continue →
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Right Panel */}
                              <div className="">
                                <div className="bg-white border p-6">
                                  <h3 className="text-lg font-semibold mb-6">
                                    Helpful Information
                                  </h3>

                                  <div className="space-y-8">
                                    <div className="flex gap-4">
                                      <Clock className="text-green-600" />

                                      <div>
                                        <h4 className="font-semibold">
                                          Estimated Time
                                        </h4>

                                        <p className="text-gray-500 text-sm">
                                          20–30 minutes to complete
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex gap-4">
                                      <FileText className="text-orange-600" />

                                      <div>
                                        <h4 className="font-semibold">
                                          Information Needed
                                        </h4>

                                        <p className="text-gray-500 text-sm">
                                          Personal details, academic records,
                                          ID proof, etc.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex gap-4">
                                      <ShieldCheck className="text-green-600" />

                                      <div>
                                        <h4 className="font-semibold">
                                          Save Progress
                                        </h4>

                                        <p className="text-gray-500 text-sm">
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

                      {(
                        activeMenu === "Communication" || activeMenu === "Document") && (
                          <>  {/* Tabs */}
                            <div className="bg-white border">
                              <div className="border-b border-gray-200 overflow-x-auto no-scrollbar px-3">
                                {/* <div className="flex min-w-max">
                                  {[
                                    { id: "information", label: "Information" },
                                    { id: "documents", label: "Documents" },
                                    { id: "activity", label: "Comments" }
                                  ].map((tab) => {
                                    const isActive = activeTab === tab.id;

                                    return (
                                      <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`relative px-4 py-3 text-base font-medium whitespace-nowrap transition-all duration-200 ${isActive
                                          ? "text-orange-600"
                                          : "text-gray-500 hover:text-gray-800"
                                          }`}
                                      >
                                        {tab.label}

                                        {isActive && (
                                          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-full" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div> */}
                              </div>



                              {/* Information Tab Content */}
                              {activeTab === 'information' && (
                                <div className="px-3 py-8">
                                  <div>
                                    <h2 className="text-[20px] font-semibold text-[#2b1640] mb-6">
                                      Basic Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                      <DetailItem
                                        label="Full Name"
                                        value={application?.student?.name || "N/A"}
                                      />
                                      <DetailItem
                                        label="Gender"
                                        value={application?.student?.gender || "N/A"}
                                      />
                                      <DetailItem
                                        label="Nationality"
                                        value={application?.student?.nationality || "N/A"}
                                      />
                                      <DetailItem
                                        label="Date of Birth"
                                        value={application?.student?.dateOfBirth ? format(new Date(application.student.dateOfBirth), 'yyyy-MM-dd') : "N/A"}
                                      />
                                      <DetailItem
                                        label="Application ID"
                                        value={application?.applicationNumber || "N/A"}
                                      />
                                      <DetailItem
                                        label="E-Mail"
                                        value={application?.student?.email || "N/A"}
                                      />
                                      <DetailItem
                                        label="Passport No."
                                        value={application?.student?.passportNumber || "N/A"}
                                      />
                                      <DetailItem
                                        label="Created At"
                                        value={application?.createdAt ? format(new Date(application.createdAt), 'dd/MM/yyyy hh:mm a') : "N/A"}
                                      />
                                    </div>
                                  </div>

                                  {/* Course Details Section */}
                                  <div className="mt-8 border-t pt-8">
                                    <h2 className="text-[20px] font-semibold text-[#2b1640] mb-6">
                                      Course Details
                                    </h2>
                                    {application.course && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                          { label: "Course Name", value: application?.course?.name },
                                          { label: "University", value: application?.course?.university?.name },
                                          { label: "Address", value: application?.course?.university?.address },
                                          { label: "Course Intake", value: application?.intake },
                                          { label: "Level", value: application?.course?.level },
                                          { label: "Duration", value: application?.course?.duration },
                                          { label: "Tuition Fee", value: `${application?.course?.currency || ""} ${application?.course?.tuitionFee || ""}` },
                                          { label: "QS Ranking", value: application?.course?.university?.uni_rank?.find((item: any) => item.type === "QS World")?.rank || "N/A" },
                                        ].map((item, index) => (
                                          <div key={index}>
                                            <p className="text-sm font-medium text-gray-800 mb-1">{item.label}</p>
                                            <h3 className="font-medium text-gray-800">{item.value || "N/A"}</h3>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>


                                </div>
                              )}


                              {/* Documents Tab Content */}
                              {activeTab === "documents" && (
                                <div className="min-h-screen">
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
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${req.status === "Approved"
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
                                                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${req.required === "required"
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
                                // <div className="bg-white">

                                //   {/* Header */}
                                //   <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                                //     <div>
                                //       <h3 className="text-lg font-semibold text-gray-800">
                                //         Ticket Communication History
                                //       </h3>
                                //       <p>Track all agent updates, internal discussions, and resolution milestones.</p>
                                //     </div>

                                //     <button
                                //       onClick={() => setIsCommentModalOpen(true)}
                                //       className="bg-[#F26D44] hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md transition-colors"
                                //     >
                                //       ADD COMMENTS
                                //     </button>
                                //   </div>

                                //   {/* Table Header */}
                                //   <div className="grid grid-cols-12 gap-4 bg-gray-100 px-8 py-4 text-sm font-semibold text-gray-700 border-b">
                                //     <div className="col-span-2">Details</div>
                                //     <div className="col-span-6">Comment</div>
                                //     <div className="col-span-3">Status</div>
                                //     <div className="col-span-1">Commented By</div>
                                //   </div>

                                //   {/* Messages */}
                                //   <div className="max-h-[650px] overflow-y-auto divide-y divide-gray-200">

                                //     {messageList?.map((item, index) => (

                                //       <motion.div
                                //         key={index}
                                //         initial={{ opacity: 0, y: 15 }}
                                //         animate={{ opacity: 1, y: 0 }}
                                //         transition={{ delay: index * 0.05 }}
                                //         className="grid grid-cols-12 gap-4 px-8 py-6 hover:bg-gray-50 transition-colors"
                                //       >

                                //         {/* Details */}
                                //         <div className="col-span-2">

                                //           <div className="text-sm text-gray-700 leading-6">

                                //             <p className="font-medium">
                                //               {item?.createdAt.split("T")[0]}
                                //             </p>

                                //             <div className="mt-4">

                                //               <p className="font-semibold text-gray-800">
                                //                 Subject:
                                //               </p>

                                //               <p className="font-semibold text-gray-900 mt-2">
                                //                 {item?.extra_content?.subject}
                                //               </p>

                                //             </div>

                                //           </div>

                                //         </div>


                                //         {/* Comment */}
                                //         <div className="col-span-6">

                                //           <div className="space-y-3">

                                //             <div className="text-gray-700 leading-7 text-[15px]">
                                //               {item.content}
                                //             </div>

                                //             {item.extra_content?.attachments?.[0]?.name && (

                                //               <a
                                //                 href={`https://api.ooshasglobal.com${item.extra_content?.attachments?.[0]?.url}`}
                                //                 target="_blank"
                                //                 className="flex items-center gap-2"
                                //               >
                                //                 <Paperclip className="w-4 h-4 text-slate-400" />

                                //                 {item.extra_content?.attachments?.[0]?.name}

                                //               </a>

                                //             )}

                                //           </div>

                                //         </div>


                                //         {/* Status */}
                                //         <div className="col-span-3">

                                //           <div className="space-y-5 text-sm">

                                //             <div>

                                //               <p className="font-bold text-gray-800">
                                //                 Primary Status:
                                //               </p>

                                //               <p className="text-gray-700">
                                //                 {item.primaryStatus || "Application Processed"}
                                //               </p>

                                //             </div>

                                //             <div>

                                //               <p className="font-bold text-gray-800">
                                //                 Message Status:
                                //               </p>

                                //               <p className="text-gray-700">
                                //                 {item?.isRead ? "true" : "false"}
                                //               </p>

                                //             </div>

                                //           </div>

                                //         </div>


                                //         {/* User */}
                                //         <div className="col-span-1 flex flex-col items-center justify-between">

                                //           <span className="text-gray-700 font-medium">
                                //             {item.userType === "student" ? "Me" : item.userType}
                                //           </span>

                                //           {item.userType !== "student" && !item?.isRead && (
                                //             <button
                                //               onClick={() => {
                                //                 setIsCommentModalOpen(true);
                                //                 setMessageSubject(item?.extra_content?.subject);
                                //                 markMessagesAsRead();
                                //               }}
                                //               className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1 px-2 rounded-md transition-colors"
                                //             >
                                //               reply <SendHorizonal className="h-4" />
                                //             </button>
                                //           )}

                                //         </div>
                                //       </motion.div>

                                //     ))}

                                //   </div>


                                //   {/* Modal */}
                                //   <AnimatePresence>

                                //     {isCommentModalOpen && (

                                //       <motion.div
                                //         initial={{ opacity: 0 }}
                                //         animate={{ opacity: 1 }}
                                //         exit={{ opacity: 0 }}
                                //         className="fixed inset-0 z-50 flex items-end justify-end p-6"
                                //       >

                                //         <motion.div
                                //           initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                //           animate={{ scale: 1, opacity: 1, y: 0 }}
                                //           exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                //           transition={{ type: "spring", duration: 0.4 }}
                                //           className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
                                //         >

                                //           {/* Header */}
                                //           <div className="bg-white border-b border-slate-100 px-5 py-4">

                                //             <div className="flex items-center justify-between">

                                //               <div>

                                //                 <h3 className="text-base font-bold text-slate-800">
                                //                   New Message
                                //                 </h3>

                                //                 <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                //                   <span>To</span>
                                //                   <span className="font-medium text-slate-700">
                                //                     Ooshas
                                //                   </span>
                                //                 </div>
                                //               </div>
                                //               <button
                                //                 onClick={() => setIsCommentModalOpen(false)}
                                //                 className="text-slate-400 hover:text-slate-600 transition-colors"
                                //               >
                                //                 <svg
                                //                   className="w-5 h-5"
                                //                   fill="none"
                                //                   stroke="currentColor"
                                //                   viewBox="0 0 24 24"
                                //                 >
                                //                   <path
                                //                     strokeLinecap="round"
                                //                     strokeLinejoin="round"
                                //                     strokeWidth={2}
                                //                     d="M6 18L18 6M6 6l12 12"
                                //                   />
                                //                 </svg>
                                //               </button>
                                //             </div>
                                //           </div>


                                //           {/* Body */}
                                //           <div className="p-5 space-y-5">

                                //             {/* Subject */}
                                //             <div className="space-y-1.5">

                                //               <div className="flex items-center gap-2 text-sm">

                                //                 <label className="font-medium text-slate-600 w-16">
                                //                   Subject
                                //                 </label>

                                //                 <select
                                //                   value={messageSubject}
                                //                   onChange={(e) => setMessageSubject(e.target.value)}
                                //                   className="flex-1 bg-transparent border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none focus:border-orange-500"
                                //                 >

                                //                   <option value="">
                                //                     Select a subject...
                                //                   </option>

                                //                   <option value="Application Processed">
                                //                     Application Processed
                                //                   </option>

                                //                   <option value="Document Uploaded">
                                //                     Document Uploaded
                                //                   </option>

                                //                   <option value="University Update">
                                //                     University Update
                                //                   </option>

                                //                 </select>

                                //               </div>

                                //             </div>


                                //             {/* Message */}
                                //             <div className="space-y-1.5">

                                //               <textarea
                                //                 rows={5}
                                //                 value={messageText}
                                //                 onChange={(e) => setMessageText(e.target.value)}
                                //                 placeholder="Type your comment details here..."
                                //                 className="w-full p-3 outline-none resize-none text-sm text-slate-700 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-100 focus:border-orange-500 focus:bg-white transition-all"
                                //               />

                                //             </div>


                                //             {/* Attachments */}
                                //             {messageAttachments.length > 0 && (

                                //               <div className="space-y-2">

                                //                 <div className="flex flex-wrap gap-2">

                                //                   {messageAttachments.map((file, index) => (

                                //                     <div
                                //                       key={index}
                                //                       className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1 text-xs text-slate-600"
                                //                     >

                                //                       <svg
                                //                         className="w-3 h-3 text-slate-400"
                                //                         fill="none"
                                //                         stroke="currentColor"
                                //                         viewBox="0 0 24 24"
                                //                       >

                                //                         <path
                                //                           strokeLinecap="round"
                                //                           strokeLinejoin="round"
                                //                           strokeWidth={2}
                                //                           d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                //                         />

                                //                       </svg>

                                //                       <span className="max-w-[120px] truncate">
                                //                         {file.name}
                                //                       </span>

                                //                       <button
                                //                         type="button"
                                //                         onClick={() => removeUploadedFile(index)}
                                //                         className="text-slate-400 hover:text-rose-500 ml-1"
                                //                       >
                                //                         ×
                                //                       </button>

                                //                     </div>

                                //                   ))}

                                //                 </div>

                                //               </div>

                                //             )}


                                //             {/* Actions */}
                                //             <div className="flex items-center justify-end gap-2 pt-2">

                                //               {/* Upload */}
                                //               <button
                                //                 type="button"
                                //                 disabled={
                                //                   messageSubject !== "Document Uploaded" ||
                                //                   isAttachmentUploading ||
                                //                   isCommentSubmitting
                                //                 }
                                //                 onClick={() => fileInputRef.current.click()}
                                //                 className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                //               >

                                //                 <svg
                                //                   className="w-5 h-5"
                                //                   fill="none"
                                //                   stroke="currentColor"
                                //                   viewBox="0 0 24 24"
                                //                 >

                                //                   <path
                                //                     strokeLinecap="round"
                                //                     strokeLinejoin="round"
                                //                     strokeWidth={2}
                                //                     d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                //                   />

                                //                 </svg>

                                //               </button>


                                //               {/* Send */}
                                //               <button
                                //                 type="button"
                                //                 onClick={sendMessage}
                                //                 disabled={
                                //                   isCommentSubmitting ||
                                //                   isAttachmentUploading ||
                                //                   !messageText.trim()
                                //                 }
                                //                 className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium px-5 py-2 rounded-full text-sm transition-all"
                                //               >

                                //                 {isCommentSubmitting ? "Sending..." : "Send"}

                                //               </button>

                                //             </div>

                                //           </div>


                                //           {/* Hidden File Input */}
                                //           <input
                                //             type="file"
                                //             ref={fileInputRef}
                                //             onChange={handleFileChange}
                                //             multiple
                                //             disabled={
                                //               isAttachmentUploading ||
                                //               isCommentSubmitting
                                //             }
                                //             className="hidden"
                                //           />

                                //         </motion.div>

                                //       </motion.div>

                                //     )}

                                //   </AnimatePresence>

                                // </div>
                                <Comments application={application} profile={profile}/>
                              )}
                            </div>
                          </>
                        )}

                      {activeMenu === "Activity Log" && (
                        <motion.div
                          key="activity-log"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.35 }}
                          className="bg-white border p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
                        >
                          {/* Animated Icon */}
                          <motion.div
                            animate={{
                              y: [0, -8, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="mb-6"
                          >
                            <Clock className="w-20 h-20 text-orange-500" />
                          </motion.div>

                          <h2 className="text-2xl font-bold text-gray-800">
                            No Activity Yet
                          </h2>

                          <p className="mt-3 text-gray-500 max-w-md">
                            Your application activity timeline will appear here.
                            Updates such as document submissions, application reviews,
                            university responses, and status changes will be tracked automatically.
                          </p>

                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "220px" }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="h-1 bg-orange-500 rounded-full mt-8"
                          />
                        </motion.div>
                      )}


                    </motion.div>
                  )}
                </AnimatePresence>





              </div>
            )}

            {currentStep?.step === "ReviewbyOoshas" && (
              <ReviewApplication application={application} allProfile={allProfile} profile = {profile} />
  )}

            {currentStep?.step === "SubmitToSchool" ? (
              <SubmittedtoSchool application={application} allProfile={allProfile} profile = {profile} currentstep={currentStep} />
            ) : currentStep?.step === "AwaitingSchoolResponse" ? (
              <SubmittedtoSchool application={application} allProfile={allProfile} profile = {profile} currentstep={currentStep} />
            ) : currentStep?.step === "OfferReceived" ? (
              <SubmittedtoSchool application={application} allProfile={allProfile} profile = {profile} currentstep={currentStep} />
            ) : currentStep?.step === "ConfirmmationLetter"? (
              <SubmittedtoSchool application={application} allProfile={allProfile} profile = {profile} currentstep={currentStep}/>
            ):null}

            {currentStep?.step === "AdmissionProcessing" && (
              <AdmissionProcessing application={application} profile = {profile}/>
            )}

            {currentStep?.step === "PayEnrollenmentDeposit" && (
              <EnrollmentDeposit/>
            )}

          </div>



        </div>



      </div>

      {/* Intake Modal */}
      {
        showIntakeModal && (
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
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedIntake === item ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 hover:border-gray-400 hover:shadow-sm"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedIntake === item ? "border-orange-500 bg-orange-500" : "border-gray-300"}`}>
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
                <button onClick={() => setShowIntakeModal(false)}
                  className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50">Cancel</button>
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
                  className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )
      }

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
    </div >
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-1">
        {label}
      </p>
      <p className="text-gray-700 font-medium text-sm">{value}</p>
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
        <p className="text-gray-700 font-medium text-sm">{value}</p>
        {/* <Pencil size={14} className="text-gray-500 cursor-pointer hover:text-[#ff6a1a]" /> */}
      </div>
    </div>
  );
}