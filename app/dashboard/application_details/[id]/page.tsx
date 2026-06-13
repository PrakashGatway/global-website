"use client";

import axiosInstance from "@/app/axiosInstance";
import {
  ChevronLeft,
  RefreshCw,
  Save,
  Upload,
  Plus,
  X,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  BookOpen,
  User,
  ExternalLink,
  Edit,
  MessageCircle,
  Activity,
  Timer,
  ChevronDown,
  ChevronRight,
  Clock,
  Check,
  FileQuestion,
  Image,
  File,
  Layers,
  MapPin,
  Shield,
  Phone,
  Mail,
  GraduationCap,
  CreditCard,
  Calendar,
  FolderOpen,
  History,
  Paperclip,
  SendHorizonal,
  Tag,
  Sparkles,
  Award,
  Download,
  Eye,
  TrendingUp,
  Globe,
  Building2,
  Heart,
  Star,
  Zap,
  BarChart3,
  Users,
  Target,
  Trophy,
  Briefcase,
  ArrowRight,
  Info,
} from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Documents from "@/components/couseller/Documents";
// import { CommentsSection } from "@/components/applications/CommentsSection";

// ── Types ─────────────────────────────────────────────────────────────────────

type ApplicationStatus =
  | "Started"
  | "ReviewbyOoshas"
  | "SubmitToSchool"
  | "AwaitingSchoolResponse"
  // | "AdmissionProcessing"
  | "OfferReceived"
  | "Refused"
  | "PayEnrollenmentDeposit"
  | "Completed";

type PaymentStatus = "Pending" | "Completed" | "Failed";

interface ActivityLog {
  _id: string;
  action: string;
  description: string;
  status: string;
  user: { name: string };
  userType: "student" | "ooshas" | "admin" | "system";
  createdAt: string;
  callDuration?: string;
  callType?: "incoming" | "outgoing" | "missed";
  metadata?: Record<string, any>;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  passportNumber?: string;
  nationality?: string;
}

interface University {
  _id: string;
  name: string;
  code?: string;
}
interface Course {
  _id: string;
  name: string;
  university?: University;
}

interface DocumentExtraField {
  label: string;
  type: string;
  required: boolean;
  validation: string;
}

interface AppDocument {
  _id?: string;
  name: string;
  type: "user" | "ooshas";
  docType: "document" | "form" | "picture" | "confirmation letter" | "offer letter";
  required: "required" | "optional";
  description?: string;
  docUrl?: string;
  status: "Pending" | "inreview" | "Approved" | "Rejected";
  rejectReason?: string;
  answer?: string;
  extra?: DocumentExtraField[] | string | Record<string, any>;
  createdAt?: string;
}

interface BackupCourse {
  course: string;
  intake: string;
  order: number;
}

interface RejectionReason {
  course: string;
  reason: string;
}

interface Application {
  _id: string;
  applicationNumber: string;
  student: Student;
  country?: string;
  course?: Course;
  intake?: string;
  paymentStatus: PaymentStatus;
  primaryStatus: ApplicationStatus;
  isWithdrawn: boolean;
  userNotes?: string;
  documents: AppDocument[];
  backups: BackupCourse[];
  rejectionReason: RejectionReason[];
  createdAt?: string;
  updatedAt?: string;
  statusDetails?: string | any[];
}

// ── Status config with premium styling ───────────────────────────────────────
const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; border: string; gradient: string }> = {
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
    gradient: "from-amber-500 to-orange-500",
  },
  Started: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
    border: "border-orange-200",
    gradient: "from-orange-500 to-cyan-500",
  },
  ReviewbyOoshas: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
    border: "border-purple-200",
    gradient: "from-purple-500 to-pink-500",
  },
  SubmitToSchool: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    dot: "bg-slate-400",
    border: "border-slate-200",
    gradient: "from-slate-500 to-gray-500",
  },
  AwaitingSchoolResponse: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-400",
    border: "border-rose-200",
    gradient: "from-rose-500 to-red-500",
  },
  AdmissionProcessing: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    dot: "bg-cyan-400",
    border: "border-cyan-200",
    gradient: "from-cyan-500 to-teal-500",
  },
  VisaProcessing: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-400",
    border: "border-rose-200",
    gradient: "from-rose-500 to-red-500",
  },
  inreview: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
    border: "border-orange-200",
    gradient: "from-orange-500 to-[#f26d44]",
  },
  Approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-green-500",
  },
  Rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-400",
    border: "border-rose-200",
    gradient: "from-rose-500 to-red-500",
  },
  PayEnrollenmentDeposit: { 
    bg: "bg-blue-100", 
    text: "text-blue-700", 
    border: "border-blue-200", 
    gradient: "from-blue-500 to-blue-600", 
    dot: "bg-blue-500" 
  },
  OfferReceived: { 
    bg: "bg-emerald-100", 
    text: "text-emerald-700", 
    border: "border-emerald-200", 
    gradient: "from-emerald-500 to-emerald-600", 
    dot: "bg-emerald-500" 
  },
  Refused: { 
    bg: "bg-rose-100", 
    text: "text-rose-700", 
    border: "border-rose-200", 
    gradient: "from-rose-500 to-rose-600", 
    dot: "bg-rose-500" 
  },
  Completed: { 
    bg: "bg-purple-100", 
    text: "text-purple-700", 
    border: "border-purple-200", 
    gradient: "from-purple-500 to-purple-600", 
    dot: "bg-purple-500" 
  },
};


const INTAKE_OPTIONS = [
  "January 2025", "February 2025", "March 2025", "April 2025", "May 2025",
  "June 2025", "July 2025", "August 2025", "September 2025", "October 2025",
  "November 2025", "December 2025", "January 2026", "February 2026", "March 2026",
  "April 2026", "May 2026", "June 2026",
];

const STATUS_OPTIONS: ApplicationStatus[] = [
   "Started", "ReviewbyOoshas", "SubmitToSchool", "AwaitingSchoolResponse",
   "OfferReceived", "Refused", "PayEnrollenmentDeposit", "Completed"
];

// ── Premium UI Components ────────────────────────────────────────────────────

function GradientBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-px bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded blur opacity-0 group-hover:opacity-100 transition duration-500" />
      <div className="relative bg-white rounded">{children}</div>
    </div>
  );
}

function PremiumCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded border border-slate-100 bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-orange-200/20 transition-all duration-300 ${glow ? "ring-2 ring-orange-500/20" : ""} ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
}

// ── Comments Section Component ───────────────────────────────────────────────
function CommentsSection({ application, profile }: { application: Application | null; profile: any }) {
  const [messageList, setMessageList] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageAttachments, setMessageAttachments] = useState([]);
  const [isAttachmentUploading, setIsAttachmentUploading] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMessages = async () => {
    if (!application?._id) return;
    try {
      const response = await axiosInstance.get(`/communication/applications/${application._id}/messages`);
      setMessageList(response.data?.data?.reverse() || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [application]);

  const handleFileChange = async (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesArray = Array.from(e.target.files);
    setIsAttachmentUploading(true);
    try {
      for (const file of filesArray) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axiosInstance.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data?.success && response.data?.docUrl) {
          setMessageAttachments((prev: any) => [...prev, { name: file.name, url: response.data.docUrl }]);
          toast.success(`${file.name} uploaded!`);
        } else {
          throw new Error("Upload failed");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsAttachmentUploading(false);
      if (fileInputRef.current) (fileInputRef.current as any).value = "";
    }
  };

  const removeUploadedFile = (indexToRemove: number) => {
    setMessageAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !application) return;
    setIsCommentSubmitting(true);
    try {
      await axiosInstance.post(`/communication/applications/${application._id}/messages`, {
        content: messageText.trim(),
        userId: "",
        extra_content: {
          subject: messageSubject || "General Update",
          camsId: application._id,
          recipient: "Ooshas",
          attachments: messageAttachments,
        },
      });
      setMessageText("");
      setMessageSubject("");
      setMessageAttachments([]);
      setIsCommentModalOpen(false);
      await fetchMessages();
      toast.success("Comment saved");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  return (
    <PremiumCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2  bg-pink-100"><MessageCircle size={18} className="text-pink-600" /></div>
            <h3 className="text-lg font-semibold text-slate-800">Communication History</h3>
          </div>
          <button onClick={() => setIsCommentModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5  bg-gradient-to-r from-orange-600 to-[#f26d44] hover:from-orange-700 hover:to-[#f26d44] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-orange-200 disabled:opacity-60">
            + Add Comment
          </button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messageList.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No comments yet</p>
            </div>
          ) : (
            messageList.map((item: any, index: number) => (
              <div key={item._id || index} className="p-4  bg-slate-50 hover:bg-slate-100 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 capitalize">{item.userType || "System"}</span>
                    <span className="text-xs text-slate-400">{item.createdAt?.split("T")[0]}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">{item.extra_content?.subject || "General"}</span>
                </div>
                <p className="text-sm text-slate-600 ml-10">{item.content}</p>
                {item.extra_content?.attachments?.[0]?.name && (
                  <a href={`${process.env.NEXT_PUBLIC_API_URL}${item.extra_content.attachments[0].url}`} target="_blank" className="flex items-center gap-1 text-xs text-orange-600 hover:underline ml-10 mt-2">
                    <Paperclip size={10} /> {item.extra_content.attachments[0].name}
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        <AnimatePresence>
          {isCommentModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setIsCommentModalOpen(false)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-lg rounded shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">New Comment</h3>
                  <button onClick={() => setIsCommentModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">×</button>
                </div>
                <div className="p-5 space-y-4">
                  <select value={messageSubject} onChange={(e) => setMessageSubject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="">Select subject...</option>
                    <option value="Application Update">Application Update</option>
                    <option value="Document Request">Document Request</option>
                    <option value="University Update">University Update</option>
                    <option value="Offer Letter">Offer Letter</option>
                  </select>
                  <textarea rows={4} value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type your comment here..." className="w-full p-3  border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none" />
                  {messageAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {messageAttachments.map((file: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1 bg-slate-100 rounded-full px-3 py-1 text-xs">
                          <Paperclip size={10} /> <span className="max-w-[120px] truncate">{file.name}</span>
                          <button onClick={() => removeUploadedFile(idx)} className="text-slate-400 hover:text-red-500">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full text-slate-500 hover:bg-slate-100" disabled={isAttachmentUploading}>
                      <Paperclip size={18} />
                    </button>
                    <button onClick={sendMessage} disabled={isCommentSubmitting || !messageText.trim()} className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-medium px-5 py-2  transition">
                      {isCommentSubmitting ? "Sending..." : "Send Comment"}
                    </button>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PremiumCard>
  );
}


function StatusPill({ status, size = "sm" }: { status: string; size?: "sm" | "md" | "lg" }) {
  const cfg = STATUS_CONFIG[status] ?? {
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
    border: "border-slate-200",
    gradient: "from-slate-500 to-gray-500",
  };
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${cfg.bg} ${cfg.text} border ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const config = {
    Pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
    Completed: { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle },
    Failed: { bg: "bg-rose-100", text: "text-rose-700", icon: AlertCircle },
  };
  const Icon = config[status].icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config[status].bg} ${config[status].text}`}>
      <Icon size={12} /> {status}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [showRequirementForm1, setShowRequirementForm1] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | undefined>(undefined);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [description, setdescription] = useState(); 
  const [statusDescription, setStatusDescription] = useState("");
  const [showpopup,setShowpopup] = useState<Boolean>();
  const [showpopup1,setShowpopup1] = useState<any>();


  // Add state for status metadata
  const [statusMetadata, setStatusMetadata] = useState<any>(null);

  const [formData, setFormData] = useState({
    primaryStatus: "" as ApplicationStatus,
    documents: [] as any,
    backups: [] as BackupCourse[],
    rejectionReason: [] as RejectionReason[],
  });

  const [courseOptions, setCourseOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setProfile(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const fetchApplication = useCallback(async () => {
    if (!id) return;
    setPageLoading(true);
    try {
      const res = await axiosInstance.get(`/applications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const app: Application = res.data.data || res.data;
      setApplication(app);
      setFormData({
        primaryStatus: app.primaryStatus || "Pending",
        documents: app.documents || [],
        backups: app.backups || [],
        rejectionReason: app.rejectionReason || [],
      });
      if (app.student) {
        fetchStudentData(typeof app.student === "string" ? app.student : app.student._id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load application");
    } finally {
      setPageLoading(false);
    }
  }, [id]);

  const fetchStudentData = async (studentId: string) => {
    try {
      const res = await axiosInstance.get(`/users/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(res.data , "res.data", studentId);
      setStudentData(res.data || res.data);
    } catch (err) {
      console.error("Failed to fetch student data:", err);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get(`/communication/applications/${id}/activities?limit=100`);
      const activities = response.data?.data || [];
      const formattedActivities = activities.map((activity: any) => ({
        ...activity,
        id: activity._id,
        user: activity.user?.name || "System",
        timestamp: activity.createdAt,
      }));
      setActivityLogs(formattedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchApplication();
    fetchActivities();
  }, [fetchApplication]);

  useEffect(() => {
    const fetchCourses = async () => {
      const code = application?.course?.university?.code;
      if (!code) return;
      try {
        const response = await axiosInstance.get(`/courses?code=${code}`);
        const data = response.data?.data || response.data || [];
        if (Array.isArray(data)) {
          setCourseOptions(data.map((c: any) => ({ label: c.name, value: c._id })));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourseOptions([]);
      }
    };
    fetchCourses();
  }, [application?.course?.university?.code]);

  // Fixed handleSave function
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Prepare status details string with all past data
      let statusDetailsString = "";
      
      // Get existing statusDetails from application
      const existingStatusDetails = application?.statusDetails || "";
      
      // Create new status entry if status metadata exists
      if (statusMetadata) {
        const newStatusEntry = {
          status : formData.primaryStatus,
          metadata: statusMetadata || {},
          updatedAt: new Date().toISOString(),
          updatedBy: "Ooshas"
        };
        
        // If there are existing status details, append the new one
        if (existingStatusDetails) {
          try {
            // Try to parse existing status details if it's a JSON array
            let existingArray = [];
            if (typeof existingStatusDetails === "string") {
              try {
                existingArray = JSON.parse(existingStatusDetails);
              } catch {
                // If not JSON, treat as string and create array
                existingArray = [{ rawData: existingStatusDetails, timestamp: application?.updatedAt }];
              }
            } else if (Array.isArray(existingStatusDetails)) {
              existingArray = existingStatusDetails;
            }
            
            existingArray.push(newStatusEntry);
            statusDetailsString = JSON.stringify(existingArray);
          } catch {
            // If parsing fails, create new array with both
            statusDetailsString = JSON.stringify([
              { rawData: existingStatusDetails, timestamp: application?.updatedAt },
              newStatusEntry
            ]);
          }
        } else {
          // No existing data, create new array with single entry
          statusDetailsString = JSON.stringify([newStatusEntry]);
        }
      } else {
        // If no new status metadata, keep existing status details
        statusDetailsString = typeof existingStatusDetails === "string" 
          ? existingStatusDetails 
          : JSON.stringify(existingStatusDetails);
      }

      if(formData.primaryStatus  === "OfferReceived"){
        const response = await axiosInstance.post(`/visa`,{
          "userId": application?.student?._id || "" ,
          "applicationId": application?.applicationNumber || "",
          "country": application?.country || "",
          "course": application?.course?._id || "",
          "extra": statusMetadata  || {}
        })
        console.log(response.data, "response ")
      }
      
      const res = await axiosInstance.put(`/applications/${id}`, {
        primaryStatus: formData.primaryStatus,
        rejectionReason: formData.rejectionReason,
        backups: formData.backups,
        documents: formData.documents,
        description: statusDescription || "",
        statusDetails: statusDetailsString
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      
      
      if (res.data.success) {
        setSuccess("Saved successfully!");
        setTimeout(() => setSuccess(""), 2000);
        
        // Reset status metadata after successful save
        setStatusMetadata(null);
        setStatusDescription("");
        
        // Refresh application data
        await fetchApplication();
        await fetchActivities();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDocUpload = async (file: File | null, docType: string, docName: string, docId?: string, answers?: any, docCategory?: string) => {
    if (!docId) {
      setError("No document selected to upload to.");
      return;
    }
    setUploadingDoc(true);
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      fd.append("docType", docCategory ?? "document");
      fd.append("name", docName);
      if (answers) fd.append("answer", JSON.stringify(answers));
      const res = await axiosInstance.put(`/applications/documents/${id}/${docId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        const docs = [...formData.documents];
        const idx = docs.findIndex((d) => d._id === docId);
        if (idx !== -1) {
          docs[idx] = { ...docs[idx], ...res.data.data };
          setFormData((p) => ({ ...p, documents: docs }));
        }
        setSuccess("Document uploaded successfully");
        setShowDocUpload(false);
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleUpdateDocument = async (docId: string, updates: Partial<AppDocument>, file?: File | null) => {
    setUploadingDoc(true);
    try {
      let res;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        Object.entries(updates).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            fd.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
          }
        });
        res = await axiosInstance.put(`/applications/documents/${id}/${docId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        res = await axiosInstance.put(`/applications/documents/${id}/${docId}`, updates);
      }
      if (res.data.success) {
        const docs = [...formData.documents];
        const idx = docs.findIndex((d) => d._id === docId);
        if (idx !== -1) {
          docs[idx] = { ...docs[idx], ...res.data.data };
          setFormData((p) => ({ ...p, documents: docs }));
        }
        setSuccess("Document updated successfully");
        setShowDocUpload(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update document");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleAddRequirement = async (newDoc: Partial<AppDocument>) => {
    try {
      const allDocs = [...formData.documents, newDoc as AppDocument];
      const res = await axiosInstance.put(`/applications/${id}`, { documents: allDocs }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setFormData((p) => ({ ...p, documents: allDocs }));
        toast.success("Requirement added successfully");
        setShowRequirementForm(false);
      }
    } catch {
      toast.error("Failed to add requirement");
    }
  };

  const handleAddRequirement1 = async (newDoc: Partial<AppDocument>) => {
    try {
      const allDocs = [...formData.documents, newDoc as AppDocument];
      const res = await axiosInstance.put(`/applications/${id}`, { documents: allDocs }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setFormData((p) => ({ ...p, documents: allDocs }));
        toast.success("Offer letter sent successfully!");
        setShowRequirementForm1(false);
        await axiosInstance.put(`/applications/${id}`, { primaryStatus: formData.primaryStatus }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        fetchApplication();
      }
    } catch {
      toast.error("Failed to send offer letter");
    }
  };
  
  const handleUpdateDocStatus = async (
    docId: string,
    status: AppDocument["status"],
    rejectReason?: string,
  ) => {
    try {
      const docIndex = formData.documents.findIndex((doc) => doc._id === docId);

      if (docIndex === -1) {
        setError("Document not found");
        return;
      }

      const updatedDoc = {
        ...formData.documents[docIndex],
        status,
        ...(rejectReason !== undefined && { rejectReason }),
      };

      const updatedDocuments = [...formData.documents];
      updatedDocuments[docIndex] = updatedDoc;
      setFormData((prev) => ({ ...prev, documents: updatedDocuments }));

      const response = await axiosInstance.put(
        `/applications/documents/${id}/${docId}`,
        {
          status,
          rejectReason: rejectReason || updatedDoc.rejectReason,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (response.data.success) {
        const serverUpdatedDoc = response.data.data;
        const finalDocuments = [...updatedDocuments];
        finalDocuments[docIndex] = {
          ...finalDocuments[docIndex],
          ...serverUpdatedDoc,
        };
        setFormData((prev) => ({ ...prev, documents: finalDocuments }));

        setSuccess(`Document ${status} successfully`);
        setTimeout(() => setSuccess(""), 2000);

        await fetchActivities();
      } else {
        setFormData((prev) => ({ ...prev, documents: formData.documents }));
        setError("Failed to update document status");
      }
    } catch (error: any) {
      console.error("Error updating document status:", error);
      setFormData((prev) => ({ ...prev, documents: formData.documents }));
      setError(
        error.response?.data?.message || "Failed to update document status",
      );
    }
  };

  const addBackup = () => {
    setFormData((prev) => ({
      ...prev,
      backups: [...prev.backups, { course: "", intake: "", order: prev.backups.length + 1 }],
    }));
  };

  const updateBackup = (idx: number, field: keyof BackupCourse, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      backups: prev.backups.map((b, i) => i === idx ? { ...b, [field]: value } : b),
    }));
  };

  const removeBackup = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      backups: prev.backups.filter((_, i) => i !== idx),
    }));
  };

  const addRejection = () => {
    setFormData((prev) => ({
      ...prev,
      rejectionReason: [...prev.rejectionReason, { course: "", reason: "" }],
    }));
  };

  const updateRejection = (idx: number, field: keyof RejectionReason, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rejectionReason: prev.rejectionReason.map((r, i) => i === idx ? { ...r, [field]: value } : r),
    }));
  };

  const removeRejection = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      rejectionReason: prev.rejectionReason.filter((_, i) => i !== idx),
    }));
  };

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }) : "—";

  // Premium Tabs
  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp, color: "text-emerald-600" },
    { id: "documents", label: "Documents", icon: FileText, color: "text-orange-600" },
    // { id: "backups", label: "Backups", icon: Layers, color: "text-purple-600" },
    { id: "activity", label: "Activity", icon: Activity, color: "text-orange-600" },
    { id: "comments", label: "Comments", icon: MessageCircle, color: "text-pink-600" },
  ];

  const offerLetters = formData.documents
  // .filter((doc: AppDocument) => doc.docType === "offer letter" && doc.type === "ooshas");
  async function handleOfferStatusChange(id,value){
    try {
      const res = await axiosInstance.put(`/applications/documents/${application?._id}/${id}`, { status: value })
        if (res.data.success) {
          setSuccess("Offer letter status updated!");
          setTimeout(() => setSuccess(""), 2000);
          await fetchApplication();
          await fetchActivities();
        }
    } catch (error) {
      setError("Failed to update offer letter status");
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin border-t-orange-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={20} className="text-orange-500 animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium mb-2">Application not found</p>
          <button onClick={() => router.back()} className="text-sm text-orange-600 hover:underline flex items-center gap-1 mx-auto">
            <ChevronLeft size={14} /> Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Premium Header */}
      <div className="relative overflow-hidden ">
        <div className=" px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="group flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-all duration-200">
                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSave}  
              className="inline-flex items-center gap-2 px-5 py-2.5  bg-gradient-to-r from-orange-600 
              to-[#f26d44] hover:from-orange-700 hover:to-[#f26d44] text-white text-sm font-semibold transition-all 
              duration-200 shadow-md shadow-orange-200 disabled:opacity-60">
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Premium Tab Navigation */}
        <div className=" px-6">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 rounded-t-xl relative ${
                  activeTab === tab.id
                    ? "text-orange-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-4  bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 text-rose-700 text-sm mb-6">
              <AlertCircle size={18} /> {error}
              <button onClick={() => setError("")} className="ml-auto p-1 rounded-lg hover:bg-rose-100 transition">×</button>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-4  bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 text-sm mb-6">
              <CheckCircle size={18} /> {success}
            </motion.div>
          )}
        </AnimatePresence>
            
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Profile Card - Sidebar with ALL student info */}
            <PremiumCard className="lg:col-span-1 overflow-hidden ">
              <div className="relative h-32 bg-gradient-to-r from-orange-600 via-[#f26d44] to-orange-600">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded bg-white shadow-xl flex items-center justify-center border-4 border-white">
                    {studentData?.data?.profileImage ? (
                      <img 
                        src={studentData?.data.profileImage} 
                        alt="Profile"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-orange-600">
                        {studentData?.data?.name?.[0]?.toUpperCase() || application.student?.name?.[0]?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-14 p-6 overflow-auto h-[100vh]">
                <h3 className="text-xl font-bold text-slate-800 capitalize">{studentData?.data?.name || application.student?.name || "--"}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500">{studentData?.data?.email || application.student?.email || "--"}</span>
                </div>
                
                {/* Basic Information */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.data?.phone || "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Gender</p>
                      <p className="text-sm font-medium text-slate-700 capitalize">{studentData?.data?.gender || "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Marital Status</p>
                      <p className="text-sm font-medium text-slate-700 capitalize">{studentData?.data?.maritalStatus || "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Date of Birth</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.data?.dateOfBirth ? formatDate(studentData?.data.dateOfBirth) : "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Nationality</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.data?.nationality || "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">First Language</p>
                      <p className="text-sm font-medium text-slate-700 capitalize">{studentData?.data?.firstLanguage || "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Referral Code</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.data?.referalCode || "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Wallet Balance</p>
                      <p className="text-sm font-medium text-slate-700">${studentData?.data?.wallet || "0"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Joined</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.data?.createdAt ? formatDate(studentData?.data.createdAt) : "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Status</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.data?.status || "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Last Login</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.data?.lastLogin ? formatDate(studentData?.data.lastLogin) : "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Assigned To</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.data?.assignto || "--"}</p>
                    </div>
                  </div>
                </div>

                {/* Passport Details */}
                {studentData?.data?.passportDetail && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Passport Details</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Passport Number</p>
                          <p className="text-sm font-medium text-slate-700">{studentData?.data?.passportNumber || "--"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Passport Expiry</p>
                          <p className="text-sm font-medium text-slate-700">{studentData?.data?.passportExpiry ? formatDate(studentData?.data.passportExpiry) : "--"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Issue Date</p>
                          <p className="text-sm font-medium text-slate-700">{formatDate(studentData?.data.passportDetail.issueDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Expiry Date</p>
                          <p className="text-sm font-medium text-slate-700">{formatDate(studentData?.data.passportDetail.expiryDate)}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-slate-400">Issue Country</p>
                          <p className="text-sm font-medium text-slate-700">{studentData?.data.passportDetail.issueCountry}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Education History */}
                {studentData?.profile?.educationHistory && studentData?.profile.educationHistory.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Education History</h4>
                    <div className="space-y-4">
                      {studentData?.profile.educationHistory.map((edu: any, index: number) => (
                        <div key={index} className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-orange-600 mb-2">{edu.educationLevel || "--"}</p>
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Degree:</span> {edu.degreeName || "--"}
                            </p>
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Institution:</span> {edu.institutionName || "--"}
                            </p>
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Percentage:</span> {edu.percentage ? `${edu.percentage}%` : "--"}
                            </p>
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Duration:</span> {edu.startDate && edu.endDate 
                                ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`
                                : "--"}
                            </p>
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Location:</span> {[edu.city, edu.state, edu.country].filter(Boolean).join(", ") || "--"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {studentData?.profile?.workExperience && studentData?.profile.workExperience.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Work Experience</h4>
                    <div className="space-y-4">
                      {studentData?.profile.workExperience.map((work: any, index: number) => (
                        <div key={index} className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-orange-600 mb-2">{work.designation || "--"}</p>
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Company:</span> {work.companyName || "--"}
                            </p>
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Location:</span> {work.location || "--"}
                            </p>
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Duration:</span> {work.from && work.to 
                                ? `${formatDate(work.from)} - ${formatDate(work.to)}`
                                : "--"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address Information */}
                {(studentData?.profile?.currentAddress || studentData?.profile?.permanentAddress) && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Address Information</h4>
                    
                    {studentData?.profile?.currentAddress && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-slate-600 mb-2">Current Address</p>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500">{studentData?.profile.currentAddress.addressLine1 || "--"}</p>
                            {studentData?.profile.currentAddress.addressLine2 && (
                              <p className="text-xs text-slate-500">{studentData?.profile.currentAddress.addressLine2}</p>
                            )}
                            <p className="text-xs text-slate-500">
                              {[
                                studentData?.profile.currentAddress.city,
                                studentData?.profile.currentAddress.state,
                                studentData?.profile.currentAddress.postalCode
                              ].filter(Boolean).join(", ")}
                            </p>
                            <p className="text-xs text-slate-500">{studentData?.profile.currentAddress.country || "--"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {studentData?.profile?.permanentAddress && (
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-2">Permanent Address</p>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500">{studentData?.profile.permanentAddress.addressLine1 || "--"}</p>
                            {studentData?.profile.permanentAddress.addressLine2 && (
                              <p className="text-xs text-slate-500">{studentData?.profile.permanentAddress.addressLine2}</p>
                            )}
                            <p className="text-xs text-slate-500">
                              {[
                                studentData?.profile.permanentAddress.city,
                                studentData?.profile.permanentAddress.state,
                                studentData?.profile.permanentAddress.postalCode
                              ].filter(Boolean).join(", ")}
                            </p>
                            <p className="text-xs text-slate-500">{studentData?.profile.permanentAddress.country || "--"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </PremiumCard>

            {/* Application Details Card - Main Section (Only Application Info) */}
            <PremiumCard className="lg:col-span-2">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 rounded-xl bg-orange-100">
                    <GraduationCap size={18} className="text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Application Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-3">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Country</span>
                      <span className="text-sm font-medium text-slate-700">{application.country || "--"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500 pr-2">University</span>
                      <span className="text-sm font-medium text-slate-700">{"  "}{application.course?.university?.name || "--"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Course</span>
                      <span className="text-sm font-medium text-slate-700">{application.course?.name || "--"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Intake (Application)</span>
                      <span className="text-sm font-medium text-slate-700">{application.intake || "--"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Student Intake</span>
                      <span className="text-sm font-medium text-slate-700">{studentData?.data?.intake || "--"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Tuition Fee</span>
                      <span className="text-sm font-medium text-slate-700">{studentData?.data?.tuitionfee || "--"}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Application Number</span>
                      <span className="text-sm font-medium text-slate-700">{application.applicationNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Payment Status</span>
                      <PaymentBadge status={application.paymentStatus} />
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Application Status</span>
                      <select
                        value={formData.primaryStatus}
                        onChange={(e) => {
                          setFormData(p => ({ ...p, primaryStatus: e.target.value as ApplicationStatus }));
                          setShowpopup(true);
                        }}
                        className="text-sm px-3 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                    {offerLetters.length > 0 ? (
                        offerLetters.map((offer: AppDocument) => (
                          <PremiumCard key={offer._id}  className="overflow-hidden">
                            <div className="relative">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
                              <div className="p-6 md:p-8">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                      <Trophy size={28} className="text-white" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Sparkles size={14} className="text-emerald-500" />
                                        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Offer Received</span>
                                      </div>
                                      <h2 className="text-2xl font-bold text-slate-800">{offer.name}</h2>
                                      <p className="text-slate-500 text-sm mt-1 max-w-lg">{offer.description || "Congratulations! You've been offered admission to this program."}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {offer.docUrl && (
                                      <>
                                        <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${offer.docUrl}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2  bg-emerald-600 text-white hover:bg-emerald-700 transition text-sm font-medium shadow-md">
                                          <Eye size={16} /> View Offer
                                        </a>
                                        <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${offer.docUrl}`} download className="inline-flex items-center gap-2 px-4 py-2  border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
                                          <Download size={16} /> Download
                                        </a>
                                      </>
                                    )}
                                    {showpopup1 !== offer._id  &&
                                    <button onClick={() => {setShowpopup1(offer._id) }} className="p-2 z-9 text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition">
                                      <Edit size={16} />
                                    </button>}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-emerald-600" />
                                    <span className="text-xs text-slate-500">Offer Expiry: {offer?.extra?.endDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-amber-600" />
                                    <span className="text-xs text-amber-700 font-medium">{offer.required === "required" ? "Conditional Offer" : "Unconditional Offer"}</span>
                                  </div>
                                  {showpopup1 === offer._id ?
                                  
                                    <select className="text-sm px-3 py-1 border border-slate-200 z-9 focus:ring-2 focus:ring-orange-400 bg-white"
                                    value={offer.status || ""}
                                    onChange={(e) => handleOfferStatusChange(offer._id, e.target.value)}
                                    >
                                      <option value="">Select Status</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                    :
                                   (
                                    <div className="flex items-center gap-2">
                                      <StatusPill status={offer.status || "Pending"} size="sm" />
                                    </div>
                                  )
                                }
                                </div>
                              </div>
                            </div>
                          </PremiumCard>
                        ))
                      ) : (
                        <div className="text-center py-20 bg-white rounded border-2 border-dashed border-slate-200">
                          <div className="w-20 h-20 bg-slate-100 rounded flex items-center justify-center mx-auto mb-4">
                            <Trophy size={36} className="text-slate-300" />
                          </div>
                          <p className="text-base font-semibold text-slate-600">No Offers Yet</p>
                          <p className="text-sm text-slate-400 mt-1">Click below to send an admission offer</p>
                        </div>
                      )}
                </div>
              </div>
            </PremiumCard>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Documents application={application} profile={studentData?.profile} studentId={typeof application.student === "string" ? application.student : application.student._id}  onUpdate={fetchApplication}/>
          </motion.div>
        )}

        {/* BACKUPS & REJECTIONS TAB */}
        {activeTab === "backups" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Backup Courses */}
            <PremiumCard>
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2  bg-purple-100"><Layers size={18} className="text-purple-600" /></div>
                    <h3 className="text-lg font-semibold text-slate-800">Backup Courses</h3>
                  </div>
                  <button onClick={addBackup} className="inline-flex items-center gap-2 px-5 py-2.5  bg-gradient-to-r from-orange-600 to-[#f26d44] hover:from-orange-700 hover:to-[#f26d44] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-orange-200 disabled:opacity-60">
                    <Plus size={16} /> Add Backup
                  </button>
                </div>
                {formData.backups.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 ">
                    <p className="text-sm text-slate-500">No backup courses added</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.backups.map((bk, idx) => (
                      <div key={idx} className="flex flex-wrap items-end gap-3 p-4 bg-slate-50  group">
                        <div className="flex-1 min-w-[180px]">
                          <label className="text-xs font-medium text-slate-500">Course</label>
                          <select value={bk.course} onChange={(e) => updateBackup(idx, "course", e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
                            <option value="">Select course</option>
                            {courseOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                          <label className="text-xs font-medium text-slate-500">Intake</label>
                          <select value={bk.intake} onChange={(e) => updateBackup(idx, "intake", e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
                            <option value="">Select intake</option>
                            {INTAKE_OPTIONS.map(intake => <option key={intake} value={intake}>{intake}</option>)}
                          </select>
                        </div>
                        <div className="w-24">
                          <label className="text-xs font-medium text-slate-500">Priority</label>
                          <input type="number" value={bk.order} onChange={(e) => updateBackup(idx, "order", parseInt(e.target.value))} min="1" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white" />
                        </div>
                        <button onClick={() => removeBackup(idx)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PremiumCard>

            {/* Rejection Reasons */}
            <PremiumCard>
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2  bg-rose-100"><AlertCircle size={18} className="text-rose-600" /></div>
                    <h3 className="text-lg font-semibold text-slate-800">Rejection Reasons</h3>
                  </div>
                  <button onClick={addRejection} className="inline-flex items-center gap-2 px-5 py-2.5  bg-gradient-to-r from-orange-600 to-[#f26d44] hover:from-orange-700 hover:to-[#f26d44] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-orange-200 disabled:opacity-60">
                    <Plus size={16} /> Add Reason
                  </button>
                </div>
                {formData.rejectionReason.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 ">
                    <p className="text-sm text-slate-500">No rejection reasons recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.rejectionReason.map((rr, idx) => (
                      <div key={idx} className="flex flex-wrap items-end gap-3 p-4 bg-rose-50  group">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-slate-500">Course</label>
                          <select value={rr.course} onChange={(e) => updateRejection(idx, "course", e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white">
                            <option value="">Select course</option>
                            {courseOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        </div>
                        <div className="flex-[2]">
                          <label className="text-xs font-medium text-slate-500">Reason</label>
                          <input type="text" value={rr.reason} onChange={(e) => updateRejection(idx, "reason", e.target.value)} placeholder="Enter rejection reason..." className="w-full px-3 py-2 text-sm rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white" />
                        </div>
                        <button onClick={() => removeRejection(idx)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PremiumCard>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2  bg-orange-100"><History size={18} className="text-orange-600" /></div>
                  <h3 className="text-lg font-semibold text-slate-800">Activity Timeline</h3>
                </div>
                {activityLogs.length === 0 ? (
                  <div className="text-center py-16">
                    <History size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No activity recorded yet</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-0">
                    <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-200 via-slate-200 to-transparent" />
                    {activityLogs.map((log, idx) => (
                      <TimelineItem key={log._id} log={log} isLast={idx === activityLogs.length - 1} />
                    ))}
                  </div>
                )}
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === "comments" && (
          <CommentsSection application={application} profile={profile} />
        )}
      </div>

      {/* Status Description Popup */}
      {showpopup && (
        <StatusDescriptionPopup 
          status={formData.primaryStatus} 
          onCancel={() => {
            setShowpopup(false);
            // setFormData(p => ({ ...p, primaryStatus: application?.primaryStatus || "Started" }));
          }}

          onAdd={handleAddRequirement1}
          application={application}
          onStatusDataCollect={(status, description, metadata) => {      
            setStatusDescription(description);
            setStatusMetadata(metadata);
            setShowpopup(false);
          }}
        />
      )}

      {/* Document Upload Modal */}
      <DocumentUploadModal
        visible={showDocUpload}
        onClose={() => { setShowDocUpload(false); setEditingDocId(undefined); }}
        onUpload={handleDocUpload}
        onUpdateDocument={handleUpdateDocument}
        uploading={uploadingDoc}
        existingDocs={formData.documents}
        initialDocId={editingDocId}
      />
    </div>
  );
}

// ── Status Description Popup Component ──────────────────────────────────────
interface StatusDescriptionPopupProps {
  onAdd?: (doc: Partial<AppDocument>) => void;
  onCancel: () => void;
  status: string;
  application?: { primaryStatus: string; _id: string };
  onStatusDataCollect: (status: string, description: string, metadata: any) => void;
}

const StatusDescriptionPopup = ({onAdd, onCancel, status, application, onStatusDataCollect }: StatusDescriptionPopupProps) => {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const isOfferReceived = status === 'OfferReceived';
  const isOfferReceived2 = status === 'Completed';

  // OfferReceived specific state
  const [offerLetter, setOfferLetter] = useState({
    title: "",
    required: "required" as "required" | "optional",
    docUrl: "",
    issuedBy: "",
    endDate: "",
    startDate : "",
    visaType: "",
    visaNumber: "",
    passportNumber: "",
    countryOfIssue: "",
    visaIssuedOn: "",
    visaValidUntil: "",
  });

  const [uploadingOffer, setUploadingOffer] = useState(false);

  // Refused specific state
  const [refusalReason, setRefusalReason] = useState({
    reason: "",
    notes: ""
  });
  
  // PayEnrollmentDeposit specific state
  const [depositDetails, setDepositDetails] = useState({
    depositAmount: "",
    paymentDeadline: "",
    currency: "USD",
    offerDeadline: "",
    // program: "",
    // faculty: "",
    // startDate: "",
    // duration: "",
    // tuitionFee: "",
  });

    const [completedDetails, setCompletedDetails] = useState({
    documentType: "",
    casNumber: "",
    offerLetterTitle: "confirmation letter",
    offerLetterDocUrl: "",
    documentIssuedOn: "",
    documentValidUntil: "",
  });


  const [uploadingCompletedOffer, setUploadingCompletedOffer] = useState(false);

  // File upload helper
  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string) => void,
    onError: () => void
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return false;
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axiosInstance.post(`/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        onSuccess(res.data.docUrl);
        toast.success("File uploaded successfully");
        return true;
      }
      throw new Error("Upload failed");
    } catch {
      onError();
      toast.error("Upload failed");
      return false;
    }
  };

  const handleOfferLetterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingOffer(true);
    await handleFileUpload(
      file,
      (url) => setOfferLetter((p) => ({ ...p, docUrl: url })),
      () => {}
    );
    setUploadingOffer(false);
  };

  const handleCompletedOfferUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCompletedOffer(true);
    await handleFileUpload(
      file,
      (url) => setCompletedDetails((p) => ({ ...p, offerLetterDocUrl: url })),
      () => {}
    );
    setUploadingCompletedOffer(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    setCharacterCount(text.length);
  };

  // Build metadata object with all status-specific data
  const buildMetadata = () => {
    const metadata: any = {
      description,
      updatedBy: "ooshas",
      updatedAt: new Date().toISOString(),
    };

    switch (status) {
      case "OfferReceived":
        metadata.offerLetter = {
          title: offerLetter.title,
          required: offerLetter.required,
          docUrl: offerLetter.docUrl,
          issuedBy: offerLetter.issuedBy,
          endDate: offerLetter.endDate,
          startDate: offerLetter.startDate,
          visaType: offerLetter.visaType,
          visaNumber: offerLetter.visaNumber,
          passportNumber: offerLetter.passportNumber,
          countryOfIssue: offerLetter.countryOfIssue,
          visaIssuedOn: offerLetter.visaIssuedOn,
          visaValidUntil: offerLetter.visaValidUntil,
        };
        break;
      case "Refused":
        metadata.refusal = {
          reason: refusalReason.reason,
          notes: refusalReason.notes,
        };
        break;
      case "PayEnrollenmentDeposit":
        metadata.deposit = {
          amount: depositDetails.depositAmount,
          paymentDeadline: depositDetails.paymentDeadline,
          currency: depositDetails.currency,
          offerDeadline: depositDetails.offerDeadline,
          // program: depositDetails.program,
          // faculty: depositDetails.faculty,
          // startDate: depositDetails.startDate,
          // duration: depositDetails.duration,
          // tuitionFee: depositDetails.tuitionFee,
        };
        break;
      case "Completed":
        metadata.completed = {
          documentType: completedDetails.documentType,
          casNumber: completedDetails.casNumber,
          issuedOn: completedDetails.documentIssuedOn,
          validUntil: completedDetails.documentValidUntil,
          offerLetterTitle: completedDetails.offerLetterTitle,
          offerLetterDocUrl: completedDetails.offerLetterDocUrl,
        };
        break;
    }
    return metadata;
  };

  const validateAndSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    // Status-specific validation
    if (status === "OfferReceived") {
      if (!offerLetter.title.trim()) {
        toast.error("Please enter offer letter title");
        return;
      }
      if (!offerLetter.docUrl) {
        toast.error("Please upload the offer letter PDF");
        return;
      }
    }

    if (status === "Refused") {
      if (!refusalReason.reason.trim()) {
        toast.error("Please enter a rejection reason");
        return;
      }
    }

    if (status === "PayEnrollenmentDeposit") {
      const required = [
        "depositAmount",
        "paymentDeadline",
        "offerDeadline",
        // "program",
        // "faculty",
        // "startDate",
        // "duration",
        // "tuitionFee",
      ];
      const missing = required.find((field) => !depositDetails[field as keyof typeof depositDetails]?.trim());
      if (missing) {
        toast.error(`Please fill in ${missing.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return;
      }
    }

    if (status === "Completed") {
      if (!completedDetails.documentType.trim()) {
        toast.error("Please enter document type");
        return;
      }
      if (!completedDetails.casNumber.trim()) {
        toast.error("Please enter CAS number");
        return;
      }
      
    }

    setIsSubmitting(true);
    try {
      const metadata = buildMetadata();
      onStatusDataCollect(status, description, metadata);
      // toast.success(`Status data collected for ${status}`);
      // onCancel();
    } catch (error) {
      toast.error("Failed to collect status data");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusAccent = () => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
    return {
      bg: config.bg,
      text: config.text,
      border: config.border,
      gradient: config.gradient,
      dot: config.dot,
    };
  };

  const accent = getStatusAccent();

  const DateInput = ({ value, onChange, label, required = true }: any) => (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative px-6 pt-6 pb-4 border-b ${accent.border} bg-gray-50`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${accent.bg} flex items-center justify-center rounded-lg shadow-md`}>
                <Activity size={20} className={accent.text} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Update Application Status</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">Changing status to</span>
                  <StatusPill status={status} size="sm" />
                </div>
              </div>
            </div>
            <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Status change indicator */}
          <div className="flex items-center justify-between py-2 px-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-500">←</span>
              </div>
              <div>
                <p className="text-xs text-slate-400">Previous Status</p>
                <p className="text-sm font-medium text-slate-600">{application?.primaryStatus || "Current"}</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-slate-300" />
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${accent.bg} flex items-center justify-center`}>
                <div className={`w-2 h-2 rounded-full ${accent.dot} animate-pulse`} />
              </div>
              <div>
                <p className="text-xs text-slate-400">New Status</p>
                <p className={`text-sm font-semibold ${accent.text}`}>{status}</p>
              </div>
            </div>
          </div>

          {/* OfferReceived Form */}
          {status === "OfferReceived" && (
            <div className="space-y-4 p-4 bg-emerald-50/30 rounded-lg border border-emerald-100">
              <h4 className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                <FileText size={16} /> Offer Letter Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium mb-1">
      Offer Letter Title *
    </label>
    <input
      type="text"
      value={offerLetter.title}
      onChange={(e) => setOfferLetter((p) => ({ ...p, title: e.target.value }))}
      placeholder="Offer Letter Title *"
      className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Offer Type
    </label>
    <select
      value={offerLetter.required}
      onChange={(e) => setOfferLetter((p) => ({ ...p, required: e.target.value as any }))}
      className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
    >
      <option value="required">Conditional Offer</option>
      <option value="optional">Unconditional Offer</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Issued By (University/Institution)
    </label>
    <input
      type="text"
      value={offerLetter.issuedBy}
      onChange={(e) => setOfferLetter((p) => ({ ...p, issuedBy: e.target.value }))}
      placeholder="Issued By (University/Institution)"
      className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      End Date
    </label>
    <input
      type="date"
      value={offerLetter.endDate}
      onChange={(e) => setOfferLetter((p) => ({ ...p, endDate: e.target.value }))}
      className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Start Date
    </label>
    <input
      type="date"
      value={offerLetter.startDate}
      onChange={(e) => setOfferLetter((p) => ({ ...p, startDate: e.target.value }))}
      className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
    />
  </div>
</div>
              
              <select
                value={offerLetter.visaType}
                onChange={(e) =>
                  setOfferLetter((p) => ({
                    ...p,
                    visaType: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select Visa Status</option>
                <option value="true">I Have Visa</option>
                <option value="false">Apply For Visa</option>
              </select>

              {offerLetter.visaType === "true" && (
                <>
                  <input
                    type="text"
                    placeholder="Visa Number"
                    value={offerLetter.visaNumber}
                    onChange={(e) =>
                      setOfferLetter((p) => ({
                        ...p,
                        visaNumber: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />

                  <input
                    type="text"
                    placeholder="Passport Number"
                    value={offerLetter.passportNumber}
                    onChange={(e) =>
                      setOfferLetter((p) => ({
                        ...p,
                        passportNumber: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />

                  <input
                    type="text"
                    placeholder="Country Of Issue"
                    value={offerLetter.countryOfIssue}
                    onChange={(e) =>
                      setOfferLetter((p) => ({
                        ...p,
                        countryOfIssue: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />

                  <DateInput
                    label="Visa Issued On"
                    value={offerLetter.visaIssuedOn}
                    onChange={(val: string) =>
                      setOfferLetter((p) => ({
                        ...p,
                        visaIssuedOn: val,
                      }))
                    }
                  />

                  <DateInput
                    label="Visa Valid Until"
                    value={offerLetter.visaValidUntil}
                    onChange={(val: string) =>
                      setOfferLetter((p) => ({
                        ...p,
                        visaValidUntil: val,
                      }))
                    }
                  />
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Offer Letter PDF *</label>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleOfferLetterUpload} 
                  disabled={uploadingOffer} 
                  className="w-full text-sm border border-emerald-200 rounded-lg p-2 bg-white" 
                />
                {uploadingOffer && <p className="mt-2 text-xs text-emerald-600">Uploading...</p>}
                {offerLetter.docUrl && !uploadingOffer && (
                  <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                    <Check size={12} /> File uploaded successfully
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Refused Form */}
          {status === "Refused" && (
            <div className="space-y-4 p-4 bg-rose-50/30 rounded-lg border border-rose-100">
              <h4 className="text-sm font-semibold text-rose-800">Rejection Details</h4>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Rejection Reason *</label>
                <input
                  value={refusalReason.reason}
                  onChange={(e) => setRefusalReason((p) => ({ ...p, reason: e.target.value }))}
                  placeholder="Enter rejection reason"
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Additional Notes</label>
                <textarea
                  rows={3}
                  value={refusalReason.notes}
                  onChange={(e) => setRefusalReason((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Provide specific reasons or feedback for the student..."
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>
          )}

          {/* PayEnrollmentDeposit Form */}
          {status === "PayEnrollenmentDeposit" && (
            <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-800">Deposit & Enrollment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Deposit Amount *" 
                  value={depositDetails.depositAmount} 
                  onChange={(e) => setDepositDetails((p) => ({ ...p, depositAmount: e.target.value }))} 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <input 
                  value={depositDetails.currency} 
                  onChange={(e) => setDepositDetails((p) => ({ ...p, currency: e.target.value }))} 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                  {/* <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                </select> */}
                <DateInput 
                  label="Payment Deadline" 
                  value={depositDetails.paymentDeadline} 
                  onChange={(val: string) => setDepositDetails((p) => ({ ...p, paymentDeadline: val }))} 
                />
                <DateInput 
                  label="Offer Deadline" 
                  value={depositDetails.offerDeadline} 
                  onChange={(val: string) => setDepositDetails((p) => ({ ...p, offerDeadline: val }))} 
                />
                {/*
                <input 
                  type="text" 
                  placeholder="Program *" 
                  value={depositDetails.program} 
                  onChange={(e) => setDepositDetails((p) => ({ ...p, program: e.target.value }))} 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                 <input 
                  type="text" 
                  placeholder="Faculty *" 
                  value={depositDetails.faculty} 
                  onChange={(e) => setDepositDetails((p) => ({ ...p, faculty: e.target.value }))} 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <DateInput 
                  label="Start Date" 
                  value={depositDetails.startDate} 
                  onChange={(val: string) => setDepositDetails((p) => ({ ...p, startDate: val }))} 
                />
                <input 
                  type="text" 
                  placeholder="Duration (e.g., 3 years)" 
                  value={depositDetails.duration} 
                  onChange={(e) => setDepositDetails((p) => ({ ...p, duration: e.target.value }))} 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <input 
                  type="text" 
                  placeholder="Tuition Fee *" 
                  value={depositDetails.tuitionFee} 
                  onChange={(e) => setDepositDetails((p) => ({ ...p, tuitionFee: e.target.value }))} 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                /> */}
              </div>
            </div>
          )}

        {status === "Completed" && (
          <div className="space-y-4 p-4 bg-purple-50/30 rounded-lg border border-purple-100">
            <h4 className="text-sm font-semibold text-purple-800">
              Completion & CAS Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Document Type *"
                value={completedDetails.documentType}
                onChange={(e) =>
                  setCompletedDetails((p) => ({
                    ...p,
                    documentType: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <input
                type="text"
                placeholder="CAS Number *"
                value={completedDetails.casNumber}
                onChange={(e) =>
                  setCompletedDetails((p) => ({
                    ...p,
                    casNumber: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <DateInput
                label="Issued On"
                value={completedDetails.documentIssuedOn}
                onChange={(val: string) =>
                  setCompletedDetails((p) => ({
                    ...p,
                    documentIssuedOn: val,
                  }))
                }
              />

              <DateInput
                label="Valid Until"
                value={completedDetails.documentValidUntil}
                onChange={(val: string) =>
                  setCompletedDetails((p) => ({
                    ...p,
                    documentValidUntil: val,
                  }))
                }
              />

            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Final Offer Letter (Optional)
              </label> 
              
              <input
                type="text"
                placeholder="Offer Letter Title"
                value={completedDetails.offerLetterTitle}
                onChange={(e) =>
                  setCompletedDetails((p) => ({
                    ...p,
                    offerLetterTitle: e.target.value,
                  }))
                }
                className="w-full mb-2 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <input
                type="file"
                accept=".pdf"
                onChange={handleCompletedOfferUpload}
                disabled={uploadingCompletedOffer}
                className="w-full text-sm border border-purple-200 rounded-lg p-2 bg-white"
              />

              {uploadingCompletedOffer && (
                <p className="mt-2 text-xs text-purple-600">Uploading...</p>
              )}

              {completedDetails.offerLetterDocUrl &&
                !uploadingCompletedOffer && (
                  <p className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                    <Check size={12} /> File uploaded
                  </p>
                )}
            </div>
          </div>
        )}

          {/* Description Section (common) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText size={14} className="text-slate-400" />
                Status Description / Remarks <span className="text-rose-500 text-xs">*</span>
              </label>
              <span className={`text-xs ${characterCount > 500 ? "text-rose-500" : "text-slate-400"}`}>
                {characterCount}/500
              </span>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              maxLength={500}
              placeholder="Provide detailed remarks about this status update..."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                characterCount > 500 
                  ? "border-rose-300 focus:ring-rose-200" 
                  : "border-slate-200 focus:ring-orange-200"
              }`}
            />
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Info size={10} /> This description will be added to the activity log and visible to the student
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 bg-slate-50/50 border-t border-slate-100">
          <button 
            onClick={onCancel} 
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (isOfferReceived && onAdd) {
                // const metadata = buildMetadata();
                onAdd({
                  type: "ooshas",
                  name: offerLetter.title,
                  description: description,
                  required: offerLetter.required as "required" | "optional",
                  docUrl: offerLetter.docUrl,
                  docType: "offer letter",
                  extra : {
                   "endDate" :  offerLetter.endDate,
                   "startDate" :  offerLetter.startDate,
                   "issuedBy" : offerLetter.issuedBy
                  }
                });
                // onStatusDataCollect(status, description, metadata);
                validateAndSubmit();
              }else if (isOfferReceived2 && onAdd) {
                // const metadata = buildMetadata();
                onAdd({
                  type: "ooshas",
                  name: completedDetails.offerLetterTitle,
                  description: description,
                  required:  "required",
                  docUrl: completedDetails.offerLetterDocUrl,
                  docType: "confirmation letter",
                  extra : {
                   "startDate" :  completedDetails.documentIssuedOn,
                   "endDate" :  completedDetails.documentValidUntil,
                   "issuedBy" : completedDetails.casNumber
                  }
                });
                // onStatusDataCollect(status, description, metadata);
                validateAndSubmit();
              } else {
                validateAndSubmit();
              }
            }}
            disabled={isSubmitting || !description.trim()}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-md flex items-center gap-2 ${
              isSubmitting || !description.trim()
                ? "bg-slate-300 cursor-not-allowed shadow-none"
                : `bg-gradient-to-r ${accent.gradient} hover:shadow-lg hover:-translate-y-0.5`
            }`}
          >
            {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
            {isSubmitting ? "Collecting..." : "Collect Status Data"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Timeline Item Component ──────────────────────────────────────────────────
function TimelineItem({ log, isLast }: { log: ActivityLog; isLast: boolean }) {
  const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG["Pending"];
  return (
    <div className="relative pl-6 pb-5 last:pb-0 group">
      {!isLast && <div className="absolute left-[9px] top-5 bottom-0 w-px bg-slate-200 group-hover:bg-orange-200 transition" />}
      <div className={`absolute left-0 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${cfg.bg} ${cfg.border} transition-transform group-hover:scale-110`}>
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      </div>
      <div className="bg-white  border border-slate-100 p-4 hover:shadow-md hover:border-orange-100 transition-all duration-200 ml-2">
        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-slate-800">{log.action.replace(/_/g, " ")}</h4>
            <StatusPill status={log.status} size="sm" />
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} />{new Date(log.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-slate-600 mb-2">{log.description}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><User size={12} />{typeof log.user === "object" ? log.user.name : log.user || "System"}</span>
          {log.callDuration && <><span className="text-slate-300">•</span><span className="flex items-center gap-1"><Timer size={12} />{log.callDuration}</span></>}
        </div>
      </div>
    </div>
  );
}

// ── Offer Letter Form ────────────────────────────────────────────────────────
function OfferLetterForm({ onAdd, onCancel, id }: { onAdd: (doc: Partial<AppDocument>) => void; onCancel: () => void, id:any }) {
  const [form, setForm] = useState<Partial<AppDocument>>({ type: "ooshas", name: "", description: "", required: "required", docUrl: "", docType: "offer letter" });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await axiosInstance.post(`/upload`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) { setForm(p => ({ ...p, docUrl: res.data.docUrl })); toast.success("Uploaded"); }
    } catch { toast.error("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = () => { if (!form.name) { 
    toast.error("Enter title"); return; } 
    if (!form.docUrl) { toast.error("Upload file"); return; } 
    onAdd(form); 
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded border border-emerald-200 p-6 animate-in slide-in-from-top-2 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2"><Trophy size={18} className="text-emerald-600" />Send Offer Letter</h4>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-slate-200"><X size={18} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Offer Letter Title" className="w-full px-4 py-2.5  border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white" />
        <select value={form.required} onChange={e => setForm(p => ({ ...p, required: e.target.value as "required" | "optional" }))} className="w-full px-4 py-2.5  border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"><option value="required">Conditional Offer</option><option value="optional">Unconditional Offer</option></select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Upload PDF *</label>
        <input type="file" accept=".pdf" 
        onChange={handleFileUpload}
         disabled={uploading} className="w-full text-sm border border-emerald-200  p-2.5 bg-white" />
         {uploading && <RefreshCw size={16} className="animate-spin mt-2 text-emerald-500" />}
         {form.docUrl && <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1"><Check size={12} /> Uploaded</p>}
        </div>

      <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Additional notes..." className="w-full px-4 py-2.5  border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white mb-4" />
      
      <div className="flex justify-end gap-3 pt-3">
        <button onClick={onCancel} className="px-4 py-2  border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
        <button onClick={handleSubmit} className="px-5 py-2  bg-gradient-to-r from-orange-600 to-orange-600 text-white font-medium shadow-md">Send Offer Letter</button></div>
    </div>
  );
}

// ── Document Upload Modal ────────────────────────────────────────────────────
function DocumentUploadModal({ visible, onClose, onUpload, onUpdateDocument, uploading, existingDocs = [], initialDocId }: any) {
  const [selectedDocId, setSelectedDocId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<"user" | "ooshas">("user");
  const [docRequired, setDocRequired] = useState<"required" | "optional">("optional");
  const [docDescription, setDocDescription] = useState("");
  const [docCategory, setDocCategory] = useState("document");
  const [extraFields, setExtraFields] = useState<any[]>([]);
  const [answers, setAnswers] = useState({});
  const [err, setErr] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { if (initialDocId && visible) handleDocSelect(initialDocId); }, [initialDocId, visible]);
  useEffect(() => { if (!visible) { setFile(null); setDocName(""); setDocType("user"); setDocRequired("optional"); setDocDescription(""); setSelectedDocId(""); setAnswers({}); setExtraFields([]); setErr(""); setIsEditing(false); setDocCategory("document"); } }, [visible]);

  const handleDocSelect = (id: string) => { 
    setSelectedDocId(id); 
    if (id === "") { 
      setDocName(""); 
      setDocType("user"); 
      setDocRequired("optional"); 
      setDocDescription(""); 
      setDocCategory("document"); 
      setExtraFields([]); 
      setAnswers({}); 
      setIsEditing(false); 
    } else { 
      const doc = existingDocs.find((d: any) => d._id === id); 
      if (doc) { 
        setDocName(doc.name); 
        setDocType(doc.type); 
        setDocRequired(doc.required); 
        setDocDescription(doc.description || ""); 
        setDocCategory(doc.docType); 
        setIsEditing(true); 
        let extra = []; 
        if (typeof doc.extra === "string") {
          try { 
            extra = JSON.parse(doc.extra); 
          } catch { 
            extra = []; 
          }
        } else if (Array.isArray(doc.extra)) {
          extra = doc.extra;
        }
        setExtraFields(extra); 
        const initialAnswers = {}; 
        if (doc.answer) {
          try { 
            Object.assign(initialAnswers, JSON.parse(doc.answer)); 
          } catch { }
        }
        setAnswers(initialAnswers); 
      } 
    } 
  };

  const handleSubmit = async () => { 
    if (!docName) { 
      setErr("Enter document name"); 
      return; 
    } 
    if (isEditing && selectedDocId) { 
      const updates: any = { 
        name: docName, 
        type: docType, 
        required: docRequired, 
        description: docDescription, 
        docType: docCategory 
      }; 
      if (docCategory === "form") { 
        updates.extra = JSON.stringify(extraFields); 
        if (Object.keys(answers).length) updates.answer = JSON.stringify(answers); 
      } 
      await onUpdateDocument(selectedDocId, updates, file); 
    } else { 
      if (!selectedDocId) { 
        setErr("Select a document"); 
        return; 
      } 
      await onUpload(file, docType, docName, selectedDocId, docCategory === "form" ? answers : undefined, docCategory); 
    } 
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white"><h3 className="font-semibold text-slate-800">{isEditing ? "Edit Document" : "Upload Document"}</h3><button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button></div>
        <div className="p-5 space-y-4">
          {err && <div className="p-3  bg-rose-50 text-rose-600 text-sm flex items-center gap-2"><AlertCircle size={14} />{err}</div>}
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Select Document *</label><select value={selectedDocId} onChange={e => handleDocSelect(e.target.value)} className="w-full px-3 py-2  border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"><option value="">-- Select a document --</option>{existingDocs.map((doc: any) => <option key={doc._id} value={doc._id}>{doc.name} ({doc.type}) — {doc.status}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Document Name *</label><input type="text" value={docName} onChange={e => setDocName(e.target.value)} className="w-full px-3 py-2  border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label><select value={docCategory} onChange={e => setDocCategory(e.target.value)} className="w-full px-3 py-2  border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"><option value="document">Document</option><option value="form">Form</option><option value="picture">Picture</option><option value="offer letter">Offer Letter</option></select></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Response By</label><select value={docType} onChange={e => setDocType(e.target.value as "user" | "ooshas")} className="w-full px-3 py-2  border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"><option value="user">Student</option><option value="ooshas">Ooshas</option></select></div></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Required</label><select value={docRequired} onChange={e => setDocRequired(e.target.value as "required" | "optional")} className="w-full px-3 py-2  border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"><option value="required">Required</option><option value="optional">Optional</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea rows={2} value={docDescription} onChange={e => setDocDescription(e.target.value)} className="w-full px-3 py-2  border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" /></div>
          {docCategory === "form" && (<div className="bg-slate-50 p-4 "><div className="flex justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-500">Form Fields</h4><button onClick={() =>
               setExtraFields([...extraFields, { label: "", type: "text", required: false, validation: "" }])}
                className="text-xs text-orange-600">+ Add Field</button></div>{extraFields.map((field, i) => (<div key={i} className="bg-white p-3 rounded-lg border border-slate-200 mb-2"><div className="grid grid-cols-3 gap-2 mb-2"><input type="text" placeholder="Label" value={field.label} onChange={e => { const arr = [...extraFields]; arr[i].label = e.target.value; setExtraFields(arr); }} className="px-2 py-1 text-sm rounded border" /><select value={field.type} onChange={e => { const arr = [...extraFields]; arr[i].type = e.target.value; setExtraFields(arr); }} className="px-2 py-1 text-sm rounded border"><option value="text">Text</option><option value="email">Email</option><option value="number">Number</option><option value="date">Date</option></select><div className="flex items-center justify-between"><label className="flex items-center gap-1"><input type="checkbox" checked={field.required} onChange={e => { const arr = [...extraFields]; arr[i].required = e.target.checked; setExtraFields(arr); }} />Required</label><button onClick={() => setExtraFields(extraFields.filter((_, j) => j !== i))} className="text-rose-500"><Trash2 size={14} /></button></div></div>{isEditing && field.label && (<div><label className="text-xs text-slate-500">Answer</label><input type={field.type} value={answers[field.label] || ""} onChange={e => setAnswers(prev => ({ ...prev, [field.label]: e.target.value }))} className="w-full px-2 py-1 text-sm rounded border" /></div>)}</div>))}</div>)}
          {docCategory !== "form" && (<div><label className="block text-sm font-medium text-slate-700 mb-1">{isEditing ? "Update File (Optional)" : "File *"}</label><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f && f.size > 5 * 1024 * 1024) setErr("Max 5MB"); else { setFile(f || null); setErr(""); } }} className="w-full text-sm" /></div>)}
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-slate-100"><button onClick={onClose} className="px-4 py-2  border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button><button onClick={handleSubmit} disabled={uploading} className="px-5 py-2  bg-gradient-to-r from-orange-600 to-[#f26d44] text-white font-medium shadow-md disabled:opacity-60">{uploading ? <RefreshCw size={15} className="animate-spin" /> : (isEditing ? <Save size={15} /> : <Upload size={15} />)} {isEditing ? "Save" : "Upload"}</button></div>
      </div>
    </div>
  );
}












