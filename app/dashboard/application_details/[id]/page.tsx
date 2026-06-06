














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
} from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

type ApplicationStatus =
  | "Pending"
  | "Started"
  | "ReviewbyOoshas"
  | "SubmitToSchool"
  | "AwaitingSchoolResponse"
  | "AdmissionProcessing"
  | "OfferReceived"
  | "Refused"
  | "VisaProcessing"
  | "Withdrawn"
  | "PreArrival"
  | "Arrived"
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
  docType: "document" | "form" | "picture" | "other" | "offer letter";
  required: "required" | "optional";
  description?: string;
  docUrl?: string;
  status: "Pending" | "inreview" | "Approved" | "Rejected";
  rejectReason?: string;
  answer?: string;
  extra?: DocumentExtraField[] | string;
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
}

// ── Status config with premium styling ───────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; border: string; gradient: string }
> = {
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
    bg: "bg-[#f26d44]",
    text: "text-[#f26d44]",
    dot: "bg-[#f26d44]",
    border: "border-[#f26d44]",
    gradient: "from-[#f26d44] to-orange-500",
  },
  AdmissionProcessing: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    dot: "bg-cyan-400",
    border: "border-cyan-200",
    gradient: "from-cyan-500 to-teal-500",
  },
  OfferReceived: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-green-500",
  },
  Refused: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-400",
    border: "border-rose-200",
    gradient: "from-rose-500 to-red-500",
  },
  VisaProcessing: {
    bg: "bg-[#f26d44]",
    text: "text-[#f26d44]",
    dot: "bg-[#f26d44]",
    border: "border-[#f26d44]",
    gradient: "from-[#f26d44] to-purple-500",
  },
  Withdrawn: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
    border: "border-gray-200",
    gradient: "from-gray-500 to-slate-500",
  },
  PreArrival: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-teal-500",
  },
  Arrived: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
    border: "border-green-200",
    gradient: "from-green-500 to-emerald-500",
  },
  Completed: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-400",
    border: "border-teal-200",
    gradient: "from-teal-500 to-cyan-500",
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
};

const INTAKE_OPTIONS = [
  "January 2025", "February 2025", "March 2025", "April 2025", "May 2025",
  "June 2025", "July 2025", "August 2025", "September 2025", "October 2025",
  "November 2025", "December 2025", "January 2026", "February 2026", "March 2026",
  "April 2026", "May 2026", "June 2026",
];

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Pending", "Started", "ReviewbyOoshas", "SubmitToSchool", "AwaitingSchoolResponse",
  "AdmissionProcessing", "OfferReceived", "Refused", "VisaProcessing", "Withdrawn",
  "PreArrival", "Arrived", "Completed",
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

  const [formData, setFormData] = useState({
    primaryStatus: "Pending" as ApplicationStatus,
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
      setStudentData(res.data.data || res.data);
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

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await axiosInstance.put(`/applications/${id}`, {
        primaryStatus: formData.primaryStatus,
        rejectionReason: formData.rejectionReason,
        backups: formData.backups,
        documents: formData.documents,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setSuccess("Saved successfully!");
        setTimeout(() => setSuccess(""), 2000);
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
        await axiosInstance.put(`/applications/${id}`, { primaryStatus: "OfferReceived" }, {
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
      // Find the document to update
      const docIndex = formData.documents.findIndex((doc) => doc._id === docId);

      if (docIndex === -1) {
        setError("Document not found");
        return;
      }

      // Create updated document
      const updatedDoc = {
        ...formData.documents[docIndex],
        status,
        ...(rejectReason !== undefined && { rejectReason }),
      };

      // Update local state first for immediate feedback
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
    { id: "offers", label: "Offers", icon: Trophy, color: "text-amber-600" },
    { id: "documents", label: "Documents", icon: FileText, color: "text-orange-600" },
    { id: "backups", label: "Backups", icon: Layers, color: "text-purple-600" },
    { id: "activity", label: "Activity", icon: Activity, color: "text-orange-600" },
    { id: "comments", label: "Comments", icon: MessageCircle, color: "text-pink-600" },
  ];

  const offerLetters = formData.documents.filter((doc: AppDocument) => doc.docType === "offer letter" && doc.type === "ooshas");

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

  // Stats for overview
  const stats = [
    { label: "Total Documents", value: formData.documents.length, icon: FileText, color: "from-orange-500 to-cyan-500" },
    { label: "Backup Courses", value: application.backups.length, icon: Layers, color: "from-purple-500 to-pink-500" },
    { label: "Activities", value: activityLogs.length, icon: Activity, color: "from-orange-500 to-red-500" },
    { label: "Offers", value: offerLetters.length, icon: Trophy, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-100 shadow-sm">
        <div className="absolute inset-0 " />
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="group flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-all duration-200">
                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-[#f26d44] flex items-center justify-center shadow-lg">
                      <GraduationCap size={18} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-800 capitalize">{application.student?.name}</h1>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                          {application.applicationNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusPill status={application.primaryStatus} size="md" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSave}  
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 
              to-[#f26d44] hover:from-orange-700 hover:to-[#f26d44] text-white text-sm font-semibold transition-all 
              duration-200 shadow-md shadow-orange-200 disabled:opacity-60">
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Premium Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6">
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
                <tab.icon size={16} className={activeTab === tab.id ? tab.color : "text-slate-400 group-hover:text-slate-600"} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 text-rose-700 text-sm mb-6">
              <AlertCircle size={18} /> {error}
              <button onClick={() => setError("")} className="ml-auto p-1 rounded-lg hover:bg-rose-100 transition">×</button>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 text-sm mb-6">
              <CheckCircle size={18} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, idx) => (
                <PremiumCard key={idx} className="p-5" glow>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                      <stat.icon size={22} className="text-white" />
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>

            {/* Student Profile & Application Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Profile Card */}
              <PremiumCard className="lg:col-span-1 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-orange-600 via-[#f26d44] to-orange-600">
                  <div className="absolute -bottom-12 left-6">
                    <div className="w-24 h-24 rounded bg-white shadow-xl flex items-center justify-center border-4 border-white">
                      <span className="text-3xl font-bold text-orange-600">
                        {studentData?.name?.[0]?.toUpperCase() || application.student?.name?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-14 p-6">
                  <h3 className="text-xl font-bold text-slate-800 capitalize">{studentData?.name || application.student?.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-500">{studentData?.email || application.student?.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Nationality</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.nationality || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Passport</p>
                      <p className="text-sm font-medium text-slate-700">{studentData?.passportNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Joined</p>
                      <p className="text-sm font-medium text-slate-700">{formatDate(application.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </PremiumCard>

              {/* Application Details Card */}
              <PremiumCard className="lg:col-span-2">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 rounded-xl bg-orange-100">
                      <GraduationCap size={18} className="text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Application Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Country</span>
                        <span className="text-sm font-medium text-slate-700">{application.country || "—"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">University</span>
                        <span className="text-sm font-medium text-slate-700">{application.course?.university?.name || "—"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Course</span>
                        <span className="text-sm font-medium text-slate-700">{application.course?.name || "—"}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Intake</span>
                        <span className="text-sm font-medium text-slate-700">{application.intake || "—"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Payment Status</span>
                        <PaymentBadge status={application.paymentStatus} />
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Status</span>
                        <select
                          value={formData.primaryStatus}
                          onChange={(e) => setFormData(p => ({ ...p, primaryStatus: e.target.value as ApplicationStatus }))}
                          className="text-sm px-3 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </div>

            {/* Recent Activity Preview */}
            <PremiumCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-orange-100">
                      <History size={18} className="text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
                  </div>
                  <button onClick={() => setActiveTab("activity")} className="text-sm text-orange-600 hover:text-orange-700 font-medium">View all →</button>
                </div>
                <div className="space-y-3">
                  {activityLogs.slice(0, 3).map((log, idx) => (
                    <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition">
                      <div className={`w-2 h-2 rounded-full mt-2 ${STATUS_CONFIG[log.status]?.dot || "bg-slate-400"}`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{log.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(log.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {activityLogs.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">No activity yet</p>
                  )}
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* OFFERS TAB - Premium Design */}
        {activeTab === "offers" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {offerLetters.length > 0 ? (
              offerLetters.map((offer: AppDocument) => (
                <PremiumCard key={offer._id} glow className="overflow-hidden">
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
                              <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${offer.docUrl}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition text-sm font-medium shadow-md">
                                <Eye size={16} /> View Offer
                              </a>
                              <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${offer.docUrl}`} download className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
                                <Download size={16} /> Download
                              </a>
                            </>
                          )}
                          <button onClick={() => { setEditingDocId(offer._id); setShowDocUpload(true); }} className="p-2 rounded-xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition">
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-emerald-600" />
                          <span className="text-xs text-slate-500">Offer Date: {formatDate(offer.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-amber-600" />
                          <span className="text-xs text-amber-700 font-medium">{offer.required === "required" ? "Conditional Offer" : "Unconditional Offer"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill status={offer.status || "Pending"} size="sm" />
                        </div>
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

            <div className="flex justify-end">
              <button onClick={() => setShowRequirementForm1(!showRequirementForm1)}
               className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all 
               duration-200 shadow-md ${showRequirementForm1 ? "bg-orange-100 text-orange-600" : "bg-gradient-to-r from-orange-600 to-orange-600 text-white hover:from-orange-700 hover:to-orange-700"}`}>
                {showRequirementForm1 ? <><X size={18} /> Close</> : <><Plus size={18} /> Send Offer Letter</>}
              </button>
            </div>

            {showRequirementForm1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <OfferLetterForm onAdd={handleAddRequirement1} onCancel={() => setShowRequirementForm1(false)} id={id}/>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Document Requirements</h3>
                <p className="text-sm text-slate-400">Manage all student documents in one place</p>
              </div>
              <button onClick={() => setShowRequirementForm(!showRequirementForm)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${showRequirementForm ? "bg-slate-100 text-slate-600" : "bg-gradient-to-r from-orange-600 to-[#f26d44] text-white shadow-md"}`}>
                {showRequirementForm ? <><X size={16} /> Close</> : <><Plus size={16} /> Create Requirement</>}
              </button>
            </div>

            {showRequirementForm && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <DocumentRequirementForm onAdd={handleAddRequirement} onCancel={() => setShowRequirementForm(false)} />
              </motion.div>
            )}

            {formData.documents.filter((doc: AppDocument) => doc.docType !== "offer letter").length === 0 ? (
              <div className="text-center py-20 bg-white rounded border-2 border-dashed border-slate-200">
                <FolderOpen size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No documents yet</p>
                <p className="text-sm text-slate-400 mt-1">Click "Create Requirement" to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {formData.documents.filter((doc: AppDocument) => doc.docType !== "offer letter").map((doc: AppDocument) => (
                  <DocumentCard key={doc._id} doc={doc} onUpdateStatus={handleUpdateDocStatus} onEdit={(id: string) => { setEditingDocId(id); setShowDocUpload(true); }} />
                ))}
              </div>
            )}
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
                    <div className="p-2 rounded-xl bg-purple-100"><Layers size={18} className="text-purple-600" /></div>
                    <h3 className="text-lg font-semibold text-slate-800">Backup Courses</h3>
                  </div>
                  <button onClick={addBackup} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-[#f26d44] hover:from-orange-700 hover:to-[#f26d44] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-orange-200 disabled:opacity-60">
                    <Plus size={16} /> Add Backup
                  </button>
                </div>
                {formData.backups.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500">No backup courses added</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.backups.map((bk, idx) => (
                      <div key={idx} className="flex flex-wrap items-end gap-3 p-4 bg-slate-50 rounded-xl group">
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
                    <div className="p-2 rounded-xl bg-rose-100"><AlertCircle size={18} className="text-rose-600" /></div>
                    <h3 className="text-lg font-semibold text-slate-800">Rejection Reasons</h3>
                  </div>
                  <button onClick={addRejection} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-[#f26d44] hover:from-orange-700 hover:to-[#f26d44] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-orange-200 disabled:opacity-60">
                    <Plus size={16} /> Add Reason
                  </button>
                </div>
                {formData.rejectionReason.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500">No rejection reasons recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.rejectionReason.map((rr, idx) => (
                      <div key={idx} className="flex flex-wrap items-end gap-3 p-4 bg-rose-50 rounded-xl group">
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
                  <div className="p-2 rounded-xl bg-orange-100"><History size={18} className="text-orange-600" /></div>
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
            <div className="p-2 rounded-xl bg-pink-100"><MessageCircle size={18} className="text-pink-600" /></div>
            <h3 className="text-lg font-semibold text-slate-800">Communication History</h3>
          </div>
          <button onClick={() => setIsCommentModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-[#f26d44] hover:from-orange-700 hover:to-[#f26d44] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-orange-200 disabled:opacity-60">
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
              <div key={item._id || index} className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
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
                  <textarea rows={4} value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type your comment here..." className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none" />
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
                    <button onClick={sendMessage} disabled={isCommentSubmitting || !messageText.trim()} className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-medium px-5 py-2 rounded-xl transition">
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

// ── Timeline Item Component ──────────────────────────────────────────────────
function TimelineItem({ log, isLast }: { log: ActivityLog; isLast: boolean }) {
  const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG["Pending"];
  return (
    <div className="relative pl-6 pb-5 last:pb-0 group">
      {!isLast && <div className="absolute left-[9px] top-5 bottom-0 w-px bg-slate-200 group-hover:bg-orange-200 transition" />}
      <div className={`absolute left-0 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${cfg.bg} ${cfg.border} transition-transform group-hover:scale-110`}>
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      </div>
      <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md hover:border-orange-100 transition-all duration-200 ml-2">
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

// ── Document Card Component ──────────────────────────────────────────────────
function DocumentCard({ doc, onUpdateStatus, onEdit }: any) {
  const [showReason, setShowReason] = useState(false);
  const [rejectReason, setRejectReason] = useState(doc.rejectReason || "");
  const [status, setStatus] = useState(doc.status || "Pending");
  
  const statusConfig: Record<string, any> = {
    Pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock, label: "Pending" },
    inreview: { bg: "bg-orange-100", text: "text-orange-700", icon: Activity, label: "In Review" },
    Approved: { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle, label: "Approved" },
    Rejected: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Rejected" },
  };
  const currentStatus = statusConfig[doc.status] || statusConfig.Pending;
  const StatusIcon = currentStatus.icon;

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "Rejected") setShowReason(true);
    else { setShowReason(false); onUpdateStatus(doc._id, newStatus); setStatus(newStatus); }
  };

  return (
    <PremiumCard className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0"><DocTypeIcon type={doc.docType} /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-semibold text-slate-800">{doc.name}</h4>
                  {doc.docUrl && doc.docType !== "form" && (
                    <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${doc.docUrl}`} target="_blank" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-orange-600 transition">
                      <ExternalLink size={12} /> View
                    </a>
                  )}
                </div>
                {doc.description && <p className="text-xs text-slate-500 mb-2 line-clamp-2">{doc.description}</p>}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${doc.type === "ooshas" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                    {doc.type === "ooshas" ? "Ooshas" : "Student"}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${doc.required === "required" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"}`}>
                    {doc.required === "required" ? "Required" : "Optional"}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className={`text-xs px-3 py-1.5 rounded-lg border focus:outline-none ${currentStatus.bg} ${currentStatus.text} font-medium cursor-pointer`}>
                  <option value="Pending">Pending</option>
                  <option value="inreview">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button onClick={() => onEdit(doc._id)} className="mt-2 w-full text-center text-[10px] px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">Edit</button>
              </div>
            </div>
            {showReason && (
              <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200 animate-in slide-in-from-top-2">
                <label className="text-xs font-semibold text-rose-700 mb-1 block">Rejection Reason</label>
                <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason..." className="w-full px-3 py-2 text-sm rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white mb-2" autoFocus />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowReason(false); setRejectReason(doc.rejectReason || ""); }} className="px-3 py-1 text-xs rounded-lg text-slate-600 hover:bg-rose-100">Cancel</button>
                  <button onClick={() => { if (rejectReason.trim()) { onUpdateStatus(doc._id, "Rejected", rejectReason); setShowReason(false); setStatus("Rejected"); } }} className="px-3 py-1 text-xs rounded-lg bg-rose-600 text-white hover:bg-rose-700">Confirm</button>
                </div>
              </div>
            )}
            {doc.rejectReason && doc.status === "Rejected" && !showReason && (
              <div className="mt-3 flex items-start gap-2 p-2 bg-rose-50 rounded-lg border border-rose-100">
                <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <div><p className="text-xs font-semibold text-rose-700">Rejection Reason</p><p className="text-xs text-rose-600">{doc.rejectReason}</p></div>
              </div>
            )}
            {doc.docType === "form" && doc.answer && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] font-semibold uppercase text-slate-400 mb-2">Form Responses</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(() => { try { const answers = JSON.parse(doc.answer); return Object.entries(answers).map(([key, val]) => (<div key={key} className="text-xs p-1.5 bg-white rounded border border-slate-100"><span className="text-slate-500 font-medium">{key}:</span> <span className="text-slate-700">{String(val)}</span></div>)); } catch { return <span className="text-xs text-slate-400">Invalid data</span>; } })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}

function DocTypeIcon({ type }: { type: string }) {
  const icons: Record<string, any> = { document: FileText, form: FileQuestion, picture: Image, "offer letter": Trophy, other: File };
  const colors: Record<string, string> = { document: "from-orange-500 to-cyan-500", form: "from-purple-500 to-pink-500", picture: "from-pink-500 to-rose-500", "offer letter": "from-emerald-500 to-teal-500", other: "from-slate-500 to-gray-500" };
  const Icon = icons[type] || File;
  const gradient = colors[type] || colors.other;
  return <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}><Icon size={18} className="text-white" /></div>;
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
      // put(`/applications/documents/${id}/${docId}`
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
        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Offer Letter Title" className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white" />
        <select value={form.required} onChange={e => setForm(p => ({ ...p, required: e.target.value as "required" | "optional" }))} className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"><option value="required">Conditional Offer</option><option value="optional">Unconditional Offer</option></select>
      </div>
      <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Additional notes..." className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white mb-4" />
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Upload PDF *</label>
        <input type="file" accept=".pdf" 
        onChange={handleFileUpload}
         disabled={uploading} className="w-full text-sm border border-emerald-200 rounded-xl p-2.5 bg-white" />
         {uploading && <RefreshCw size={16} className="animate-spin mt-2 text-emerald-500" />}
         {form.docUrl && <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1"><Check size={12} /> Uploaded</p>}
        </div>
      <div className="flex justify-end gap-3 pt-3">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
        <button onClick={handleSubmit} className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-600 text-white font-medium shadow-md">Send Offer Letter</button></div>
    </div>
  );
}

// ── Document Requirement Form ─────────────────────────────────────────────────
function DocumentRequirementForm({ onAdd, onCancel }: { onAdd: (doc: Partial<AppDocument>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<AppDocument>>({ type: "user", name: "", description: "", required: "optional", docUrl: "", docType: "document", extra: [{ label: "", type: "text", required: false, validation: "" }] });
  const [uploading, setUploading] = useState(false);

  const handleFieldChange = (idx: number, key: string, val: string | boolean) => { const arr = [...(form.extra as DocumentExtraField[])]; arr[idx] = { ...arr[idx], [key]: val }; setForm(p => ({ ...p, extra: arr })); };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]; if (!file) return; if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
      setUploading(true); try { const fd = new FormData(); fd.append("document", file); 
        const res = await axiosInstance.post("/uploads/documents", fd, { headers: { "Content-Type": "multipart/form-data" } });
         if (res.data.success) setForm(p => ({ ...p, docUrl: res.data.data.url })); } catch { alert("Upload failed"); } 
         finally { setUploading(false); } };

  const handleSubmit = () => { 
    if (!form.name) 
    { alert("Enter document name"); return; }
     const payload = { ...form }; if (payload.type === "ooshas" && payload.docType === "form")
    payload.extra = JSON.stringify(payload.extra); onAdd(payload); 
    };

  return (
    <div className="rounded border border-orange-200 p-6 animate-in slide-in-from-top-2 shadow-lg">
      <div className="flex items-center justify-between mb-5"><h4 className="font-semibold text-slate-800 flex items-center gap-2"><Plus size={18} className="text-orange-600" />Create Requirement</h4><button onClick={onCancel} className="p-1 rounded-lg hover:bg-slate-200"><X size={18} /></button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select value={form.required} onChange={e => setForm(p => ({ ...p, required: e.target.value as "required" | "optional" }))} className="w-full px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"><option value="required">Required</option><option value="optional">Optional</option></select>
        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Document Name" className="w-full px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
      </div>
      <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white mb-4" />
      {form.type === "ooshas" && form.docType !== "form" && (<div className="mb-4"><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} disabled={uploading} className="w-full text-sm" />{uploading && <RefreshCw size={14} className="animate-spin mt-2" />}{form.docUrl && <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1"><Check size={12} /> Uploaded</p>}</div>)}
      {form.docType === "form" && (<div className="mb-4"><label className="block text-sm font-medium text-slate-700 mb-2">Form Fields</label>{(Array.isArray(form.extra) ? form.extra : []).map((field, i) => (<div key={i} className="grid grid-cols-4 gap-2 mb-2 bg-white p-3 rounded-xl border border-orange-200"><input type="text" placeholder="Label" value={field.label} onChange={e => handleFieldChange(i, "label", e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-slate-200" /><select value={field.type} onChange={e => handleFieldChange(i, "type", e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-slate-200"><option value="text">Text</option><option value="email">Email</option><option value="number">Number</option><option value="date">Date</option></select><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.required} onChange={e => handleFieldChange(i, "required", e.target.checked)} />Required</label><button onClick={() => { const arr = (form.extra as DocumentExtraField[]).filter((_, j) => j !== i); setForm(p => ({ ...p, extra: arr })); }} className="text-rose-500"><Trash2 size={16} /></button></div>))}<button onClick={() => setForm(p => ({ ...p, extra: [...(Array.isArray(p.extra) ? p.extra : []), { label: "", type: "text", required: false, validation: "" }] }))} className="text-sm text-orange-600 font-medium">+ Add Field</button></div>)}
      <div className="flex justify-end gap-3 pt-3"><button onClick={onCancel} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button><button onClick={handleSubmit} className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-[#f26d44] text-white font-medium shadow-md">Add Requirement</button></div>
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

  const handleDocSelect = (id: string) => { setSelectedDocId(id); if (id === "") { setDocName(""); setDocType("user"); setDocRequired("optional"); setDocDescription(""); setDocCategory("document"); setExtraFields([]); setAnswers({}); setIsEditing(false); } else { const doc = existingDocs.find((d: any) => d._id === id); if (doc) { setDocName(doc.name); setDocType(doc.type); setDocRequired(doc.required); setDocDescription(doc.description || ""); setDocCategory(doc.docType); setIsEditing(true); let extra = []; if (typeof doc.extra === "string") try { extra = JSON.parse(doc.extra); } catch { extra = []; } else if (Array.isArray(doc.extra)) extra = doc.extra; setExtraFields(extra); const initialAnswers = {}; if (doc.answer) try { Object.assign(initialAnswers, JSON.parse(doc.answer)); } catch { } setAnswers(initialAnswers); } } };

  const handleSubmit = async () => { if (!docName) { setErr("Enter document name"); return; } if (isEditing && selectedDocId) { const updates: any = { name: docName, type: docType, required: docRequired, description: docDescription, docType: docCategory }; if (docCategory === "form") { updates.extra = JSON.stringify(extraFields); if (Object.keys(answers).length) updates.answer = JSON.stringify(answers); } await onUpdateDocument(selectedDocId, updates, file); } else { if (!selectedDocId) { setErr("Select a document"); return; } await onUpload(file, docType, docName, selectedDocId, docCategory === "form" ? answers : undefined, docCategory); } };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white"><h3 className="font-semibold text-slate-800">{isEditing ? "Edit Document" : "Upload Document"}</h3><button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button></div>
        <div className="p-5 space-y-4">
          {err && <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-sm flex items-center gap-2"><AlertCircle size={14} />{err}</div>}
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Select Document *</label><select value={selectedDocId} onChange={e => handleDocSelect(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"><option value="">-- Select a document --</option>{existingDocs.map((doc: any) => <option key={doc._id} value={doc._id}>{doc.name} ({doc.type}) — {doc.status}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Document Name *</label><input type="text" value={docName} onChange={e => setDocName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label><select value={docCategory} onChange={e => setDocCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"><option value="document">Document</option><option value="form">Form</option><option value="picture">Picture</option><option value="offer letter">Offer Letter</option></select></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Response By</label><select value={docType} onChange={e => setDocType(e.target.value as "user" | "ooshas")} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"><option value="user">Student</option><option value="ooshas">Ooshas</option></select></div></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Required</label><select value={docRequired} onChange={e => setDocRequired(e.target.value as "required" | "optional")} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"><option value="required">Required</option><option value="optional">Optional</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea rows={2} value={docDescription} onChange={e => setDocDescription(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" /></div>
          {docCategory === "form" && (<div className="bg-slate-50 p-4 rounded-xl"><div className="flex justify-between mb-2"><h4 className="text-xs font-semibold text-slate-500">Form Fields</h4><button onClick={() => setExtraFields([...extraFields, { label: "", type: "text", required: false, validation: "" }])} className="text-xs text-orange-600">+ Add Field</button></div>{extraFields.map((field, i) => (<div key={i} className="bg-white p-3 rounded-lg border border-slate-200 mb-2"><div className="grid grid-cols-3 gap-2 mb-2"><input type="text" placeholder="Label" value={field.label} onChange={e => { const arr = [...extraFields]; arr[i].label = e.target.value; setExtraFields(arr); }} className="px-2 py-1 text-sm rounded border" /><select value={field.type} onChange={e => { const arr = [...extraFields]; arr[i].type = e.target.value; setExtraFields(arr); }} className="px-2 py-1 text-sm rounded border"><option value="text">Text</option><option value="email">Email</option><option value="number">Number</option><option value="date">Date</option></select><div className="flex items-center justify-between"><label className="flex items-center gap-1"><input type="checkbox" checked={field.required} onChange={e => { const arr = [...extraFields]; arr[i].required = e.target.checked; setExtraFields(arr); }} />Required</label><button onClick={() => setExtraFields(extraFields.filter((_, j) => j !== i))} className="text-rose-500"><Trash2 size={14} /></button></div></div>{isEditing && field.label && (<div><label className="text-xs text-slate-500">Answer</label><input type={field.type} value={answers[field.label] || ""} onChange={e => setAnswers(prev => ({ ...prev, [field.label]: e.target.value }))} className="w-full px-2 py-1 text-sm rounded border" /></div>)}</div>))}</div>)}
          {docCategory !== "form" && (<div><label className="block text-sm font-medium text-slate-700 mb-1">{isEditing ? "Update File (Optional)" : "File *"}</label><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f && f.size > 5 * 1024 * 1024) setErr("Max 5MB"); else { setFile(f || null); setErr(""); } }} className="w-full text-sm" /></div>)}
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-slate-100"><button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button><button onClick={handleSubmit} disabled={uploading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-[#f26d44] text-white font-medium shadow-md disabled:opacity-60">{uploading ? <RefreshCw size={15} className="animate-spin" /> : (isEditing ? <Save size={15} /> : <Upload size={15} />)} {isEditing ? "Save" : "Upload"}</button></div>
      </div>
    </div>
  );
}

// // ── Premium Card Wrapper ─────────────────────────────────────────────────────
// function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
//   return <div className={`bg-white rounded border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 
//     ${className}`}>{children}</div>;
// }





















