"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  User,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Fingerprint,
  Globe,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MessageCircle,
  Download,
  Printer,
  Bell,
  Eye,
  ExternalLink,
  TrendingUp,
  Shield,
  BookOpen,
  Check,
  AlertTriangle,
  Menu,
  Home,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Award,
  Bookmark,
  FileCheck,
  Users,
  Star,
  ThumbsUp,
  Video,
  PlayCircle,
  Sparkles,
  Rocket,
  Zap,
  Heart,
  Gift,
  Coffee,
  Plane,
  CalendarDays,
  Map,
  School,
  Briefcase as BriefcaseIcon,
  CreditCard as CreditCardIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MessageSquare,
  Video as VideoIcon,
  ArrowRight,
  ExternalLink as ExternalLinkIcon,
  Info,
  CheckCircle2,
  AlertCircle as AlertCircleIcon,
  Loader2,
  RefreshCw,
  Upload,
  Edit,
  Trash2,
  MoreVertical,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Slack
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { FaPassport } from "react-icons/fa";
import { Rigthsidebar } from "@/components/dashboard/application/rightsidebar";

// ============================================
// TYPES
// ============================================

interface Step {
  title: string;
  status: "Completed" | "Pending" | "In Progress" | "VisaProcessing" | "Approved";
  completedAt: string | null;
  stepDetails?: { description: string }[];
}

interface Document {
  key: string;
  url: string;
  status: string;
}

interface Education {
  educationLevel: string;
  institutionName: string;
  degreeName: string;
  startDate: string;
  endDate: string;
  city: string;
  state: string;
  country: string;
}

interface Application {
  _id: string;
  applicationNumber: string;
  country: string;
  course: string;
  intake: string;
  paymentStatus: string;
  primaryStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface VisaDetails {
  category: string;
  country: string;
  embassy: string;
  purpose: string;
  intake: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  profileImage: string;
}

interface UserProfile {
  _id: string;
  documents: Record<string, Document>;
  educationHistory: Education[];
  profileCompletion: number;
  currentAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface ApiResponse {
  _id: string;
  application: Application;
  visaDetails: VisaDetails;
  steps: Step[];
  documents: any[];
  biometrics: {
    status: string;
    completedDate: string | null;
    validityPeriod: string;
  };
  financialInfo: {
    method: string;
    accountNumber: string;
    totalamount: number;
    currency: string;
    paymentStatus: string;
  };
  user: User;
  userprofile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

const PRIMARY_COLOR = "#f56e45";
const SECONDARY_COLOR = "#2d3748";

export default function VisaDecisionPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/visa/user');
        console.log("API Response:", response.data);
        
        if (response.data.success && response.data.data?.length > 0) {
          setData(response.data.data[0]);
        } else {
          setError("No visa data found");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load visa data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Approved': 'bg-green-100 text-green-700 border-green-200',
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'VisaProcessing': 'bg-purple-100 text-purple-700 border-purple-200',
      'Verified': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'true': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'false': 'bg-red-100 text-red-700 border-red-200'
    };
    return statusMap[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, any> = {
      'Completed': CheckCircle2,
      'Approved': CheckCircle2,
      'Pending': Clock,
      'In Progress': Loader2,
      'VisaProcessing': Loader2,
      'Verified': CheckCircle2,
      'true': CheckCircle2,
      'false': XCircle
    };
    const Icon = iconMap[status] || AlertCircle;
    return <Icon size={16} />;
  };

  const getStepIcon = (title: string) => {
    const iconMap: Record<string, any> = {
      'APS Applied': FileText,
      'APS Approval': Award,
      'Visa Application': FileCheck,
      'Biometrics': Fingerprint,
      'Visa Decision': TrendingUp,
      'Visa Approved': Sparkles
    };
    const Icon = iconMap[title] || CheckCircle;
    return Icon;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = () => {
    if (!data) return 0;
    const totalSteps = data.steps.length;
    const completedSteps = data.steps.filter(step => 
      step.status === 'Completed' || step.status === 'Approved'
    ).length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const getCountryName = (code: string) => {
    const countryMap: Record<string, string> = {
      'IT': 'Italy',
      'DE': 'Germany',
      'FR': 'France',
      'UK': 'United Kingdom',
      'US': 'United States',
      'CA': 'Canada',
      'AU': 'Australia',
      'NZ': 'New Zealand',
      'IN': 'India'
    };
    return countryMap[code] || code;
  };

  const getVisaStatusMessage = (status: string) => {
    const messageMap: Record<string, string> = {
      'Completed': 'Your application step has been successfully completed.',
      'Pending': 'This step is pending and awaiting processing.',
      'In Progress': 'Your application is currently being processed.',
      'VisaProcessing': 'Your visa application is under review by the embassy.',
      'Approved': 'Your visa has been approved! Congratulations!'
    };
    return messageMap[status] || 'Status is currently being updated.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-[#f56e45] border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket size={32} className="text-[#f56e45] animate-bounce" />
            </div>
          </div>
          <p className="text-slate-600 font-medium text-lg">Loading your visa journey...</p>
          <p className="text-slate-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircleIcon size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            {error || "Something went wrong"}
          </h2>
          <p className="text-slate-600 mb-8">
            Please try again later or contact support if the issue persists.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#f56e45] to-[#f56e45]/80 text-white font-semibold hover:shadow-xl hover:shadow-[#f56e45]/30 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const isApproved = data.application.primaryStatus === 'VisaProcessing';
  const hasCompletedSteps = data.steps.some(step => step.status === 'Completed');

  return (
    <div className="min-h-screen ">
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 110, 69, 0.2); }
          50% { box-shadow: 0 0 40px rgba(245, 110, 69, 0.4); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, transparent 40%, rgba(245, 110, 69, 0.1) 50%, transparent 60%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }
        .gradient-text {
          background: linear-gradient(135deg, #f56e45 0%, #f56e45 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #f56e45 0%, #f56e45/80 100%);
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto p-4 ">
        
        {/* Hero Section */}
        {/* <div className="relative mb-8 overflow-hidden rounded-3xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 md:p-8 animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f56e45]/5 via-transparent to-transparent" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#f56e45]/5 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#f56e45]/5 blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-3 py-1 rounded-full ${getStatusColor(data.application.primaryStatus)} border`}>
                  <span className="text-xs font-semibold flex items-center gap-1">
                    {getStatusIcon(data.application.primaryStatus)}
                    {isApproved ? "🎉 Visa Processing" : "📋 " + data.application.primaryStatus}
                  </span>
                </div>
                <div className="animate-float">
                  {isApproved ? (
                    <Rocket size={24} className="text-[#f56e45]" />
                  ) : (
                    <Clock size={24} className="text-amber-500" />
                  )}
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-800 leading-tight">
                {isApproved ? (
                  <>Your Visa Journey, <br /><span className="gradient-text">{data.user.name}</span></>
                ) : (
                  <>Your Visa Journey, <br /><span className="gradient-text">{data.user.name}</span></>
                )}
              </h1>
              <p className="text-slate-500 mt-2 text-lg max-w-xl">
                {isApproved 
                  ? "Your application is being processed. Stay tuned for updates on your visa status."
                  : "Your application is being processed. We'll keep you updated on every step."
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-[#f56e45] hover:text-[#f56e45] hover:shadow-md transition-all">
                <Printer size={18} />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full gradient-bg text-white hover:shadow-xl hover:shadow-[#f56e45]/30 transition-all">
                <Download size={18} />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div> */}

        {/* Status Banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#f56e45]/10 to-[#f56e45]/5 border border-[#f56e45]/20 p-4 md:p-6 animate-slide-up">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full ${isApproved ? 'bg-[#f56e45] text-white' : 'bg-amber-100 text-amber-600'}`}>
                {isApproved ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <Clock size={24} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  {isApproved ? "Visa Processing" : "Application Under Review"}
                </h3>
                <p className="text-sm text-slate-500">
                  Status: {data.application.primaryStatus} | Application #{data.application.applicationNumber}
                </p>
              </div>
            </div>
            <div className="md:ml-auto flex flex-wrap gap-3">
              <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-1">
                <Calendar size={12} /> Updated: {formatDateTime(data.updatedAt)}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-1">
                <Globe size={12} /> {getCountryName(data.visaDetails.country)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Timeline - Enhanced */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#f56e45]" />
                  Visa Progress
                </h2>
                <span className="text-sm text-slate-400">{progress}% Complete</span>
              </div>
              
              <div className="relative">
                <div className="flex justify-between items-center relative overflow-x-auto pb-4">
                  <div className="w-[90%] absolute top-[2rem] left-5 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
                  
                  <div  className={` absolute top-[2rem] left-5 h-1 bg-gradient-to-r from-[#f56e45]
                         ${progress === 100 ? 'to-[#f56e45]/70' : 'to-transparent'} 
                         -translate-y-1/2 z-0 rounded-full transition-all duration-1000`} 
                      style={{ width: `${progress === 100 ? (progress-10) : progress}%` }} 
                    />
                  
                  {data.steps.map((step, idx) => {
                    const isCompleted = step.status === 'Completed' || step.status === 'Approved';
                    const isCurrent = step.status === 'In Progress' || step.status === 'VisaProcessing';
                    const Icon = getStepIcon(step.title);
                    
                    return (
                      <div key={idx} className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => setSelectedStep(idx)}>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-[#f56e45] shadow-lg shadow-[#f56e45]/20' 
                            : isCurrent
                            ? 'bg-amber-100 border-2 border-amber-400'
                            : 'bg-slate-200'
                        } transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                          {isCompleted ? (
                            <Check size={24} className="text-white" />
                          ) : isCurrent ? (
                            <Loader2 size={24} className="text-amber-600 animate-spin" />
                          ) : (
                            <Icon size={24} className="text-slate-400" />
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-xs font-semibold text-slate-700">{step.title}</p>
                          <p className="text-[10px] text-slate-400">{formatDate(step.completedAt)}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Step Details */}
              {data.steps[selectedStep] && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800">{data.steps[selectedStep].title}</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Status: <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(data.steps[selectedStep].status)}`}>
                          {data.steps[selectedStep].status}
                        </span>
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        {getVisaStatusMessage(data.steps[selectedStep].status)}
                      </p>
                      {data.steps[selectedStep].stepDetails?.map((detail, idx) => (
                        <p key={idx} className="text-sm text-slate-500 mt-1">
                          • {detail.description}
                        </p>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatDate(data.steps[selectedStep].completedAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Visa Details - Enhanced */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FaPassport size={20} className="text-[#f56e45]" />
                  Visa Details
                </h2>
                <div className={`px-3 py-1 rounded-full ${getStatusColor(data.application.primaryStatus)} text-xs font-semibold flex items-center gap-1`}>
                  {getStatusIcon(data.application.primaryStatus)}
                  {data.application.primaryStatus}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Country</p>
                  <p className="text-sm font-medium text-slate-700 mt-1 flex items-center gap-1">
                    <Globe size={14} className="text-[#f56e45]" /> 
                    {getCountryName(data.visaDetails.country)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Visa Category</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{data.visaDetails.category || "Student Visa"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Intake</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{data.application.intake || "Fall 2026"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Application No.</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{data.application.applicationNumber}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Embassy</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{data.visaDetails.embassy || "German Embassy"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Payment Status</p>
                  <p className={`text-sm font-medium mt-1 flex items-center gap-1 ${
                    data.application.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {data.application.paymentStatus === 'Paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {data.application.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Purpose Section */}
              {data.visaDetails.purpose && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Purpose</p>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#f56e45]/5 to-transparent border border-[#f56e45]/10">
                    <p className="text-sm text-slate-700">{data.visaDetails.purpose}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Status */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FileText size={20} className="text-[#f56e45]" />
                Documents
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.userprofile.documents && Object.entries(data.userprofile.documents).map(([key, doc]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#f56e45]/30 hover:bg-[#f56e45]/5 transition-all group">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-slate-400 group-hover:text-[#f56e45]" />
                      <span className="text-sm text-slate-700">{key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status === 'true' ? ' Verified' : ' Pending'}
                      </span>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded-full hover:bg-slate-200 transition">
                          <ExternalLink size={14} className="text-slate-400 hover:text-[#f56e45]" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education History */}
            {data.userprofile.educationHistory?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <School size={20} className="text-[#f56e45]" />
                  Education History
                </h2>
                
                <div className="space-y-3">
                  {data.userprofile.educationHistory.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#f56e45]/30 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-800">{edu.institutionName}</h4>
                          <p className="text-sm text-slate-600">{edu.degreeName} - {edu.educationLevel}</p>
                          <p className="text-xs text-slate-400">{edu.city}, {edu.state}, {edu.country}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={12} /> 
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Biometrics */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Fingerprint size={20} className="text-[#f56e45]" />
                Biometrics
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(data.biometrics.status)}`}>
                      {getStatusIcon(data.biometrics.status)}
                      {data.biometrics.status}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Completed Date</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{formatDate(data.biometrics.completedDate)}</p>
                </div>
                {data.biometrics.validityPeriod && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Validity Period</p>
                    <p className="text-sm font-medium text-slate-700 mt-1">{data.biometrics.validityPeriod}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Info */}
            {data.financialInfo && (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-[#f56e45]" />
                  Financial Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Payment Status</p>
                    <p className={`text-sm font-medium mt-1 flex items-center gap-1 ${
                      data.financialInfo.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {data.financialInfo.paymentStatus === 'Paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {data.financialInfo.paymentStatus}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Amount</p>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {data.financialInfo.currency} {data.financialInfo.totalamount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Progress Ring */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#f56e45]" />
                Overall Progress
              </h3>
              
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                    <circle 
                      className="text-[#f56e45]" 
                      strokeWidth="8" 
                      strokeDasharray="264" 
                      strokeDashoffset={264 - (264 * progress / 100)} 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="42" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-[#f56e45]/20" 
                      strokeWidth="8" 
                      strokeDasharray="264" 
                      strokeDashoffset={264 - (264 * progress / 100)} 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="42" 
                      cx="50" 
                      cy="50" 
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#f56e45]">{progress}%</span>
                    <span className="text-xs text-slate-400">Complete</span>
                  </div>
                </div>
                
                <div className="mt-4 w-full space-y-2">
                  {data.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-1 px-2 rounded-lg hover:bg-slate-50 transition">
                      <span className="text-slate-600 flex items-center gap-2">
                        {/* {getStepIcon(step.title)({ size: 14, className: "text-slate-400" })} */}
                        {step.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(step.status)}`}>
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-[#f56e45]" />
                Profile
              </h3>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full gradient-bg flex items-center justify-center mb-3 shadow-lg shadow-[#f56e45]/20">
                    {data.user.profileImage ? (
                      <img 
                        src={data.user.profileImage} 
                        alt={data.user.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-white" />
                    )}
                  </div>
                  <div className="absolute bottom-2 right-0 bg-emerald-400 rounded-full p-1 border-2 border-white">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
                
                <h4 className="text-xl font-semibold text-slate-800">{data.user.name}</h4>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <Mail size={14} /> {data.user.email}
                </p>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <Phone size={14} /> {data.user.phone}
                </p>
                
                <div className="flex gap-4 mt-4">
                  <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400">Nationality</p>
                    <p className="text-sm font-medium text-slate-700">{data.user.nationality}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400">Gender</p>
                    <p className="text-sm font-medium text-slate-700">{data.user.gender}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400">Profile</p>
                    <p className="text-sm font-medium text-slate-700">{data.userprofile.profileCompletion}%</p>
                  </div>
                </div>


                {data.userprofile.currentAddress && (
                  <div className="mt-4 w-full p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm text-slate-700">
                      {data.userprofile.currentAddress.addressLine1}
                      {data.userprofile.currentAddress.addressLine2 && `, ${data.userprofile.currentAddress.addressLine2}`}
                      <br />
                      {data.userprofile.currentAddress.city}, {data.userprofile.currentAddress.state} {data.userprofile.currentAddress.postalCode}
                      <br />
                      {getCountryName(data.userprofile.currentAddress.country)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="p-2.5 rounded-full border border-slate-200 hover:border-[#f56e45] hover:bg-[#f56e45]/5 transition-all">
                    <Phone size={18} className="text-slate-600 hover:text-[#f56e45]" />
                  </button>
                  <button className="p-2.5 rounded-full border border-slate-200 hover:border-[#f56e45] hover:bg-[#f56e45]/5 transition-all">
                    <Mail size={18} className="text-slate-600 hover:text-[#f56e45]" />
                  </button>
                  <button className="p-2.5 rounded-full border border-slate-200 hover:border-[#f56e45] hover:bg-[#f56e45]/5 transition-all">
                    <MessageCircle size={18} className="text-slate-600 hover:text-[#f56e45]" />
                  </button>
                  <button className="p-2.5 rounded-full border border-slate-200 hover:border-[#f56e45] hover:bg-[#f56e45]/5 transition-all">
                    <Video size={18} className="text-slate-600 hover:text-[#f56e45]" />
                  </button>
                </div>
              </div>
            </div>


            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Zap size={20} className="text-[#f56e45]" />
                Quick Actions
              </h3>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#f56e45]/5 hover:text-[#f56e45] transition-all flex items-center gap-2 text-sm text-slate-600 group">
                  <Download size={16} className="group-hover:text-[#f56e45]" /> Download Application
                </button>
                <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#f56e45]/5 hover:text-[#f56e45] transition-all flex items-center gap-2 text-sm text-slate-600 group">
                  <Upload size={16} className="group-hover:text-[#f56e45]" /> Upload Documents
                </button>
                <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#f56e45]/5 hover:text-[#f56e45] transition-all flex items-center gap-2 text-sm text-slate-600 group">
                  <Calendar size={16} className="group-hover:text-[#f56e45]" /> Schedule Appointment
                </button>
                <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#f56e45]/5 hover:text-[#f56e45] transition-all flex items-center gap-2 text-sm text-slate-600 group">
                  <MessageCircle size={16} className="group-hover:text-[#f56e45]" /> Chat with Counselor
                </button>
                <button className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#f56e45]/5 hover:text-[#f56e45] transition-all flex items-center gap-2 text-sm text-slate-600 group">
                  <RefreshCw size={16} className="group-hover:text-[#f56e45]" /> Refresh Status
                </button>
              </div>
            </div> */}

            <Rigthsidebar />

            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 p-6 card-hover animate-slide-up">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info size={20} className="text-[#f56e45]" />
                Quick Info
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={16} className="text-[#f56e45]" />
                  <span>Application Created: {formatDate(data.application.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <RefreshCw size={16} className="text-[#f56e45]" />
                  <span>Last Updated: {formatDateTime(data.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Globe size={16} className="text-[#f56e45]" />
                  <span>Country: {getCountryName(data.visaDetails.country)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <BriefcaseIcon size={16} className="text-[#f56e45]" />
                  <span>Visa Category: {data.visaDetails.category || "Student Visa"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}