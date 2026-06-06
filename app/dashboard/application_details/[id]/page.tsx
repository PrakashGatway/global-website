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
} from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import MessagingTab from "@/components/dashboard/application/chatSystem";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import VisaApplicationManager from "@/components/dashboard/application/visaprocessing";

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
  docType: "document" | "form" | "picture" | "other";
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

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
  },
  Started: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
    border: "border-blue-200",
  },
  ReviewbyOoshas: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
    border: "border-purple-200",
  },
  SubmitToSchool: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    dot: "bg-slate-400",
    border: "border-slate-200",
  },
  AwaitingSchoolResponse: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-400",
    border: "border-indigo-200",
  },
  AdmissionProcessing: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    dot: "bg-cyan-400",
    border: "border-cyan-200",
  },
  Refused: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-400",
    border: "border-rose-200",
  },
  Withdrawn: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
    border: "border-gray-200",
  },
  PreArrival: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    border: "border-emerald-200",
  },
  Arrived: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
    border: "border-green-200",
  },
  Completed: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-400",
    border: "border-teal-200",
  },
  inreview: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
    border: "border-blue-200",
  },
  Approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    border: "border-emerald-200",
  },
  Rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-400",
    border: "border-rose-200",
  },
};

const INTAKE_OPTIONS = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025",
  "August 2025",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025",
  "January 2026",
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
];

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Pending",
  "Started",
  "ReviewbyOoshas",
  "SubmitToSchool",
  "AwaitingSchoolResponse",
  "AdmissionProcessing",
  "OfferReceived",
  "Refused",
  "VisaProcessing",
  "Withdrawn",
  "PreArrival",
  "Arrived",
  "Completed",
];

// ── Reusable UI ───────────────────────────────────────────────────────────────

function StatusPill({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "md" | "lg";
}) {
  const cfg = STATUS_CONFIG[status] ?? {
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
    border: "border-slate-200",
  };
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${cfg.bg} ${cfg.text} border ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Failed: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}
    >
      {status}
    </span>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: any;
}) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      {Icon && <Icon size={14} className="text-slate-400 mt-0.5 shrink-0" />}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">
          {label}
        </p>
        <div className="text-sm font-medium text-slate-700 truncate">
          {value}
        </div>
      </div>
    </div>
  );
}

function DocTypeIcon({ type }: { type: AppDocument["docType"] }) {
  const icons = {
    document: FileText,
    form: FileQuestion,
    picture: Image,
    other: File,
  };
  const Icon = icons[type] || File;
  return <Icon size={16} className="text-slate-400" />;
}

// ── Document Requirement Form ─────────────────────────────────────────────────

function DocumentRequirementForm({
  onAdd,
  onCancel,
}: {
  onAdd: (doc: Partial<AppDocument>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<AppDocument>>({
    type: "user",
    name: "",
    description: "",
    required: "optional",
    docUrl: "",
    docType: "document",
    extra: [{ label: "", type: "text", required: false, validation: "" }],
  });
  const [uploading, setUploading] = useState(false);

  const handleFieldChange = (
    idx: number,
    key: string,
    val: string | boolean,
  ) => {
    const arr = Array.isArray(form.extra)
      ? [...(form.extra as DocumentExtraField[])]
      : [];
    arr[idx] = { ...arr[idx], [key]: val };
    setForm((p) => ({ ...p, extra: arr }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Max 5MB");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("document", file);
      const res = await axiosInstance.post("/uploads/documents", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success)
        setForm((p) => ({ ...p, docUrl: res.data.data.url }));
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name) {
      alert("Please enter document name");
      return;
    }
    const payload = { ...form };
    if (payload.type === "ooshas" && payload.docType === "form")
      payload.extra = JSON.stringify(payload.extra);
    onAdd(payload);
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-6 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <Plus size={16} className="text-violet-500" />
          Create Document Requirement
        </h4>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 transition"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Document Type *
          </label>
          <select
            value={form.docType}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                docType: e.target.value as AppDocument["docType"],
              }))
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          >
            <option value="document">Document (PDF / DOC)</option>
            <option value="form">Question Form</option>
            <option value="picture">Picture</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Required Status *
          </label>
          <select
            value={form.required}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                required: e.target.value as "required" | "optional",
              }))
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          >
            <option value="required">Required</option>
            <option value="optional">Optional</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Document Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g., Passport Copy"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Description
        </label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Additional instructions…"
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
        />
      </div>

      {form.type === "ooshas" && form.docType !== "form" && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Upload Document *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={uploading}
            className="w-full text-sm"
          />
          {uploading && (
            <RefreshCw size={14} className="animate-spin mt-2 text-slate-400" />
          )}
          {form.docUrl && (
            <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
              <Check size={12} /> Uploaded
            </p>
          )}
        </div>
      )}

      {form.docType === "form" && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Form Fields *
          </label>
          {(Array.isArray(form.extra) ? form.extra : []).map((field, i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-2 mb-2 bg-white p-2 rounded-lg border border-slate-200"
            >
              <input
                type="text"
                placeholder="Label"
                value={field.label}
                onChange={(e) => handleFieldChange(i, "label", e.target.value)}
                className="px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none"
              />
              <select
                value={field.type}
                onChange={(e) => handleFieldChange(i, "type", e.target.value)}
                className="px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    handleFieldChange(i, "required", e.target.checked)
                  }
                />
                Required
              </label>
              <button
                onClick={() => {
                  const arr = (form.extra as DocumentExtraField[]).filter(
                    (_, j) => j !== i,
                  );
                  setForm((p) => ({ ...p, extra: arr }));
                }}
                className="text-rose-400 hover:text-rose-600 flex justify-center items-center"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setForm((p) => ({
                ...p,
                extra: [
                  ...(Array.isArray(p.extra) ? p.extra : []),
                  { label: "", type: "text", required: false, validation: "" },
                ],
              }))
            }
            className="text-xs text-[#fa6a1f] hover:text-violet-800 font-medium"
          >
            + Add Field
          </button>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1.5 rounded-lg bg-[#fa6a1f] text-white hover:bg-[#fa6a1f] text-sm font-medium"
        >
          Add Requirement
        </button>
      </div>
    </div>
  );
}

// ── Document Upload / Edit Modal ──────────────────────────────────────────────

function DocumentUploadModal({
  visible,
  onClose,
  onUpload,
  onUpdateDocument,
  uploading,
  existingDocs = [],
  initialDocId,
}: {
  visible: boolean;
  onClose: () => void;
  onUpload: (
    file: File | null,
    docType: string,
    docName: string,
    docId?: string,
    answers?: any,
    docCategory?: string,
  ) => Promise<void>;
  onUpdateDocument: (
    docId: string,
    updates: Partial<AppDocument>,
    file?: File | null,
  ) => Promise<void>;
  uploading: boolean;
  existingDocs?: AppDocument[];
  initialDocId?: string;
}) {
  const [selectedDocId, setSelectedDocId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<"user" | "ooshas">("user");
  const [docRequired, setDocRequired] = useState<"required" | "optional">(
    "optional",
  );
  const [docDescription, setDocDescription] = useState("");
  const [docCategory, setDocCategory] =
    useState<AppDocument["docType"]>("document");
  const [extraFields, setExtraFields] = useState<DocumentExtraField[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialDocId && visible) {
      handleDocSelect(initialDocId);
    }
  }, [initialDocId, visible]);

  useEffect(() => {
    if (!visible) {
      setFile(null);
      setDocName("");
      setDocType("user");
      setDocRequired("optional");
      setDocDescription("");
      setSelectedDocId("");
      setAnswers({});
      setExtraFields([]);
      setErr("");
      setIsEditing(false);
      setDocCategory("document");
    }
  }, [visible]);

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
      const doc = existingDocs.find((d) => d._id === id);
      if (doc) {
        setDocName(doc.name);
        setDocType(doc.type);
        setDocRequired(doc.required);
        setDocDescription(doc.description || "");
        setDocCategory(doc.docType);
        setIsEditing(true);

        let extra: DocumentExtraField[] = [];
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

        const initialAnswers: Record<string, string> = {};
        if (doc.answer) {
          try {
            const parsed = JSON.parse(doc.answer);
            Object.assign(initialAnswers, parsed);
          } catch {
            /* ignore */
          }
        }
        setAnswers(initialAnswers);
      }
    }
  };

  const handleFieldChange = (
    idx: number,
    key: string,
    val: string | boolean,
  ) => {
    const arr = [...extraFields];
    arr[idx] = { ...arr[idx], [key]: val };
    setExtraFields(arr);
  };

  const handleAddField = () => {
    setExtraFields([
      ...extraFields,
      { label: "", type: "text", required: false, validation: "" },
    ]);
  };

  const handleRemoveField = (idx: number) => {
    setExtraFields(extraFields.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!docName) {
      setErr("Please enter document name");
      return;
    }

    if (docCategory === "form") {
      for (const field of extraFields) {
        if (field.required && !answers[field.label]) {
          setErr(`${field.label} is required`);
          return;
        }
      }
    }

    if (isEditing && selectedDocId) {
      const updates: Partial<AppDocument> = {
        name: docName,
        type: docType,
        required: docRequired,
        description: docDescription,
        docType: docCategory,
      };

      if (docCategory === "form") {
        updates.extra = JSON.stringify(extraFields);
        if (Object.keys(answers).length > 0) {
          updates.answer = JSON.stringify(answers);
        }
      }

      await onUpdateDocument(selectedDocId, updates, file);
    } else {
      if (!selectedDocId) {
        setErr("Please select a document to upload to.");
        return;
      }
      await onUpload(
        file,
        docType,
        docName,
        selectedDocId,
        docCategory === "form" ? answers : undefined,
        docCategory,
      );
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-semibold text-slate-800">
            {isEditing ? "Edit Document" : "Upload Document"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {err && (
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 text-sm flex items-center gap-2">
              <AlertCircle size={14} />
              {err}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Document *
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => handleDocSelect(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">-- Select a document --</option>
              {existingDocs.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.type}) — {doc.status}
                </option>
              ))}
            </select>
            {isEditing && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <Edit size={12} /> Editing selected document metadata
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Document Name *
            </label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g., Passport Copy"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Document Category
              </label>
              <select
                value={docCategory}
                onChange={(e) =>
                  setDocCategory(e.target.value as AppDocument["docType"])
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="document">Document</option>
                <option value="form">Question Form</option>
                <option value="picture">Picture</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Response By
              </label>
              <select
                value={docType}
                onChange={(e) =>
                  setDocType(e.target.value as "user" | "ooshas")
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="user">Student</option>
                <option value="ooshas">Ooshas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Required Status
            </label>
            <select
              value={docRequired}
              onChange={(e) =>
                setDocRequired(e.target.value as "required" | "optional")
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="required">Required</option>
              <option value="optional">Optional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={docDescription}
              onChange={(e) => setDocDescription(e.target.value)}
              placeholder="Additional instructions or notes about this document..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>

          {docCategory === "form" && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Form Fields
                </h4>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="text-xs text-[#fa6a1f] hover:text-violet-800 font-medium flex items-center gap-1"
                >
                  <Plus size={12} /> Add Field
                </button>
              </div>

              {extraFields.map((field, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-lg border border-slate-200 space-y-2"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(i, "label", e.target.value)
                      }
                      className="px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleFieldChange(i, "type", e.target.value)
                      }
                      className="px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                    </select>
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            handleFieldChange(i, "required", e.target.checked)
                          }
                        />
                        Required
                      </label>
                      <button
                        onClick={() => handleRemoveField(i)}
                        className="text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {isEditing && field.label && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Current Answer
                      </label>
                      <input
                        type={field.type}
                        value={answers[field.label] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [field.label]: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                        placeholder={`Answer for ${field.label}`}
                      />
                    </div>
                  )}
                </div>
              ))}

              {extraFields.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">
                  No form fields defined. Add fields above.
                </p>
              )}
            </div>
          )}

          {docCategory !== "form" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isEditing ? "Update File (Optional)" : "File *"}
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size > 5 * 1024 * 1024) {
                    setErr("Max 5MB");
                    return;
                  }
                  if (f) {
                    setFile(f);
                    setErr("");
                  }
                }}
                className="w-full text-sm border border-slate-200 rounded-lg p-2"
              />
              <p className="text-xs text-slate-400 mt-1">
                PDF, JPG, PNG, DOC — max 5MB
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-[#fa6a1f] hover:bg-[#fa6a1f] text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60"
          >
            {uploading ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : isEditing ? (
              <Save size={15} />
            ) : (
              <Upload size={15} />
            )}
            {isEditing ? "Save Changes" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inline Document Editor ─────────────────────────────────────────────────────

function InlineDocEditor({
  doc,
  index,
  onUpdateStatus,
  onEdit,
}: {
  doc: AppDocument;
  index: number;
  onUpdateStatus: (
    idx: number,
    status: AppDocument["status"],
    rejectReason?: string,
  ) => void;
  onEdit: (docId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [localStatus, setLocalStatus] = useState(doc.status);
  const [rejectReason, setRejectReason] = useState(doc.rejectReason || "");

  useEffect(() => {
    setLocalStatus(doc.status);
    setRejectReason(doc.rejectReason || "");
  }, [doc.status, doc.rejectReason]);

  const handleStatusChange = (status: AppDocument["status"]) => {
    setLocalStatus(status);
    if (status === "Rejected") {
      setExpanded(true);
    } else {
      onUpdateStatus(index, status);
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    onUpdateStatus(index, "Rejected", rejectReason);
    setExpanded(false);
  };

  return (
    <div className="group">
      <div className="flex items-center gap-2">
        <select
          value={localStatus}
          onChange={(e) =>
            handleStatusChange(e.target.value as AppDocument["status"])
          }
          className={`px-2 py-1 text-xs rounded-lg border focus:outline-none transition-colors ${
            localStatus === "Approved"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : localStatus === "Rejected"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : localStatus === "inreview"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700"
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="inreview">In Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={() => doc._id && onEdit(doc._id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-[#fa6a1f] hover:bg-violet-50 transition-all"
          title="Edit document"
        >
          <Edit size={14} />
        </button>
      </div>

      {expanded && localStatus === "Rejected" && (
        <div className="mt-2 p-2 bg-rose-50 rounded-lg border border-rose-200 animate-in slide-in-from-top-1">
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full px-2 py-1 text-xs rounded border border-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-400 mb-2"
            autoFocus
          />
          <div className="flex gap-1 justify-end">
            <button
              onClick={() => {
                setExpanded(false);
                setLocalStatus(doc.status);
                setRejectReason(doc.rejectReason || "");
              }}
              className="px-2 py-0.5 text-xs rounded text-slate-500 hover:bg-rose-100"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              className="px-2 py-0.5 text-xs rounded bg-rose-600 text-white hover:bg-rose-700"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Timeline Activity Item ────────────────────────────────────────────────────

function TimelineItem({ log, isLast }: { log: ActivityLog; isLast: boolean }) {
  const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG["Pending"];

  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-0 w-px bg-slate-200" />
      )}

      <div
        className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${cfg.bg} ${cfg.border}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-slate-800">
              {log.action.replace(/_/g, " ")}
            </h4>
            {log.status && <StatusPill status={log.status} size="sm" />}
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Clock size={12} />
            {new Date(log.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-3">{log.description}</p>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User size={12} />
            {typeof log.user === "object"
              ? log.user.name
              : log.user || "System"}
          </span>

          {log.callDuration && (
            <>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Timer size={12} />
                {log.callDuration}
              </span>
            </>
          )}

          {log.callType && (
            <>
              <span className="text-slate-300">•</span>
              <span
                className={`flex items-center gap-1 font-medium ${
                  log.callType === "missed"
                    ? "text-rose-600"
                    : log.callType === "incoming"
                      ? "text-emerald-600"
                      : "text-blue-600"
                }`}
              >
                {log.callType === "missed"
                  ? "Missed Call"
                  : log.callType === "incoming"
                    ? "Incoming Call"
                    : "Outgoing Call"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ app, docs }: { app: Application; docs: AppDocument[] }) {
  const totalDocs = docs.length;
  const approvedDocs = docs.filter((d) => d.status === "Approved").length;
  const pendingDocs = docs.filter((d) => d.status === "Pending").length;
  const rejectedDocs = docs.filter((d) => d.status === "Rejected").length;
  const completionRate =
    totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

  const stats = [
    {
      icon: FileText,
      label: "Docs",
      value: totalDocs,
      sub: `${approvedDocs} approved`,
      color: "violet",
    },
    { icon: Clock, label: "Pending", value: pendingDocs, color: "amber" },

    { icon: AlertCircle, label: "Rejected", value: rejectedDocs, color: "red" },
    {
      icon: Layers,
      label: "Backups",
      value: app.backups.length,
      color: "blue",
    },
  ];

  const colorMap = {
    violet: "bg-violet-50 text-[#fa6a1f]",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl ${colorMap[stat.color as keyof typeof colorMap]}`}
              >
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 leading-none">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                {stat.sub && (
                  <p className="text-[10px] text-slate-400">{stat.sub}</p>
                )}
              </div>
            </div>
          ))}

          {/* Progress Ring */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="relative">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionRate / 100)}`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[#fa6a1f]">
                  {completionRate}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Completion</p>
              <p className="text-[10px] text-slate-400">
                {approvedDocs}/{totalDocs} docs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compact progress bar at bottom */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>
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
  const [activeTab, setActiveTab] = useState("message");
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | undefined>(
    undefined,
  );
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const [formData, setFormData] = useState({
    primaryStatus: "Pending" as ApplicationStatus,
    documents: [] as any,
    backups: [] as BackupCourse[],
    rejectionReason: [] as RejectionReason[],
  });

  const [courseOptions, setCourseOptions] = useState<
    { label: string; value: string }[]
  >([]);

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
        fetchStudentData(
          typeof app.student === "string" ? app.student : app.student._id,
        );
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
      const response = await axiosInstance.get(
        `/communication/applications/${id}/activities?limit=100`,
      );
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
          setCourseOptions(
            data.map((c: any) => ({ label: c.name, value: c._id })),
          );
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
      const res = await axiosInstance.put(
        `/applications/${id}`,
        {
          primaryStatus: formData.primaryStatus,
          rejectionReason: formData.rejectionReason,
          backups: formData.backups,
          documents: formData.documents,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
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

  const handleDocUpload = async (
    file: File | null,
    docType: string,
    docName: string,
    docId?: string,
    answers?: any,
    docCategory?: string,
  ) => {
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

      const res = await axiosInstance.put(
        `/applications/documents/${id}/${docId}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

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

  const handleUpdateDocument = async (
    docId: string,
    updates: Partial<AppDocument>,
    file?: File | null,
  ) => {
    setUploadingDoc(true);
    try {
      let res;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        Object.entries(updates).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            fd.append(
              key,
              typeof val === "object" ? JSON.stringify(val) : String(val),
            );
          }
        });

        res = await axiosInstance.put(
          `/applications/documents/${id}/${docId}`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      } else {
        res = await axiosInstance.put(
          `/applications/documents/${id}/${docId}`,
          updates,
        );
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
      console.error(err);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleAddRequirement = async (newDoc: Partial<AppDocument>) => {
    try {
      const allDocs = [...formData.documents, newDoc as AppDocument];
      const res = await axiosInstance.put(
        `/applications/${id}`,
        { documents: allDocs },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res.data.success) {
        setFormData((p) => ({ ...p, documents: allDocs }));
        setSuccess("Requirement added");
        setShowRequirementForm(false);
      }
    } catch {
      setError("Failed to add requirement");
    }
  };

  const handleUpdateDocStatus = async (
  docId: string,
  status: AppDocument["status"],
  rejectReason?: string,
) => {
  try {
    // Find the document to update
    const docIndex = formData.documents.findIndex(doc => doc._id === docId);
    
    if (docIndex === -1) {
      setError("Document not found");
      return;
    }

    // Create updated document
    const updatedDoc = {
      ...formData.documents[docIndex],
      status,
      ...(rejectReason !== undefined && { rejectReason })
    };

    // Update local state first for immediate feedback
    const updatedDocuments = [...formData.documents];
    updatedDocuments[docIndex] = updatedDoc;
    setFormData(prev => ({ ...prev, documents: updatedDocuments }));

    const response = await axiosInstance.put(
      `/applications/documents/${id}/${docId}`,
      {
        status,
        rejectReason: rejectReason || updatedDoc.rejectReason
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );

    if (response.data.success) {
      const serverUpdatedDoc = response.data.data;
      const finalDocuments = [...updatedDocuments];
      finalDocuments[docIndex] = { ...finalDocuments[docIndex], ...serverUpdatedDoc };
      setFormData(prev => ({ ...prev, documents: finalDocuments }));
      
      setSuccess(`Document ${status} successfully`);
      setTimeout(() => setSuccess(""), 2000);
      
      await fetchActivities();
    } else {
      setFormData(prev => ({ ...prev, documents: formData.documents }));
      setError("Failed to update document status");
    }
  } catch (error: any) {
    console.error("Error updating document status:", error);
    setFormData(prev => ({ ...prev, documents: formData.documents }));
    setError(error.response?.data?.message || "Failed to update document status");
  }
};

  // const handleUpdateDocStatus = async (
  //   idx: number,
  //   status: AppDocument["status"],
  //   rejectReason?: string,
  // ) => {
  //   try {
  //     const docs = [...formData.documents];
  //     docs[idx] = { ...docs[idx], status, rejectReason };
  //     setFormData((p) => ({ ...p, documents: docs }));
  //   } catch {
  //     setError("Failed to update status");
  //   }
  // };

  const addBackup = () => {
    setFormData((prev) => ({
      ...prev,
      backups: [
        ...prev.backups,
        { course: "", intake: "", order: prev.backups.length + 1 },
      ],
    }));
  };

  const updateBackup = (
    idx: number,
    field: keyof BackupCourse,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      backups: prev.backups.map((b, i) =>
        i === idx ? { ...b, [field]: value } : b,
      ),
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

  const updateRejection = (
    idx: number,
    field: keyof RejectionReason,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      rejectionReason: prev.rejectionReason.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r,
      ),
    }));
  };

  const removeRejection = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      rejectionReason: prev.rejectionReason.filter((_, i) => i !== idx),
    }));
  };

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageAttachments, setMessageAttachments] = useState([]);
  const [isAttachmentUploading, setIsAttachmentUploading] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);

    setIsAttachmentUploading(true);

    try {
      for (const file of filesArray) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.success && response.data?.docUrl) {
          let fileUrl = response.data.docUrl;

          // Validation
          if (
            fileUrl.includes("nofile") ||
            fileUrl === "/uploads/docs/nofile" ||
            (!fileUrl.startsWith("/uploads/") && !fileUrl.startsWith("http"))
          ) {
            throw new Error("Server returned an invalid file URL.");
          }

          // Save uploaded file
          // setMessageAttachments((prev) => [
          //   ...prev,
          //   {
          //     name: file.name,
          //     url: fileUrl,
          //   },
          // ]);

          toast.success(`${file.name} uploaded successfully!`);
        } else {
          throw new Error(response.data?.message || "Upload failed");
        }
      }
    } catch (error) {
      console.error("File upload error:", error);

      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsAttachmentUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeUploadedFile = (indexToRemove) => {
    setMessageAttachments((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const markMessagesAsRead = async () => {
    try {
      await axiosInstance.put(
        `/communication/applications/${application._id}/messages/read`,
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(
        `/communication/applications/${application._id}/messages`,
      );

      setMessageList(response.data?.data?.reverse() || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const [Visainfo, setVisainfo] = useState([]);

  const fetchVisa = async () => {
    try {
      const response = await axiosInstance.get(`/visa/${application._id}`);

      console.log(response.data?.data, "Data ");
      setVisainfo(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchVisa();
  }, [application]);

  // console.log(application);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    setIsCommentSubmitting(true);

    try {
      await axiosInstance.post(
        `/communication/applications/${application._id}/messages`,
        {
          content: messageText.trim(),

          userId:
            messageSubject === "Document Uploaded"
              ? profile.role === "counsellor"
                ? application?.student._id
                : selectedRecipient
              : "",

          extra_content: {
            subject: messageSubject || "General Update",
            camsId: application._id,
            recipient: "Ooshas",
            attachments: messageAttachments,
          },
        },
      );

      // Reset form
      setMessageText("");
      setMessageSubject("");
      setMessageAttachments([]);

      setIsCommentModalOpen(false);

      // await markMessagesAsRead();

      await fetchMessages();

      fetchActivities();

      toast.success("Comment saved");
    } catch (error) {
      console.error("Error sending message:", error);

      toast.error("Failed to send message");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const sectionCls =
    "bg-white rounded-2xl border border-slate-200 shadow-sm p-5";
  const labelCls = "block text-xs font-medium text-slate-500 mb-1";
  const inputCls =
    "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400";

  if (pageLoading) {
    return (
      <div className="h-auto overflow-auto bg-slate-50 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={28} className="animate-spin text-violet-500" />
          <p className="text-sm text-slate-400">Loading application…</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="h-auto overflow-auto bg-slate-50 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-slate-600 font-medium mb-2">
            Application not found
          </p>
          <button
            onClick={() => router.back()}
            className="text-sm text-[#fa6a1f] hover:underline flex items-center gap-1 mx-auto"
          >
            <ChevronLeft size={14} /> Go back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "message", label: "Comments ", icon: MessageCircle },
    { id: "backups", label: "Backups", icon: BookOpen },
    { id: "document", label: "Documents", icon: FileText },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <div className="h-auto overflow-auto bg-white pb-8">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition font-medium"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md shrink-0">
              {application.applicationNumber}
            </span>
            <span className="text-sm font-semibold text-slate-800 truncate capitalize">
              {application.student?.name}
            </span>
            <StatusPill status={application.primaryStatus} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fa6a1f] hover:bg-[#fa6a1f] text-white text-sm font-semibold transition disabled:opacity-60 shadow-sm"
            >
              {saving ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-4 animate-in slide-in-from-top-2">
            <AlertCircle size={16} /> {error}
            <button
              onClick={() => setError("")}
              className="ml-auto hover:bg-rose-100 p-1 rounded"
            >
              <X size={14} />
            </button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-4 animate-in slide-in-from-top-2">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {/* Stats Overview */}
        {/* <div className="mb-6">
          <StatsBar app={application} docs={formData.documents} />
        </div> */}

        <div className="flex gap-6 items-start">
          {/* Left Sidebar: Application Info */}
          <div
            className={`shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-80"}`}
          >
            <div className="sticky top-20">
              {/* Main Sidebar Card */}
              <div
                className={`bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "hover:shadow-xl" : "hover:shadow-xl"}`}
              >
                {/* Collapsible Header with Gradient */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={`group relative w-full flex items-center transition-all duration-300 ${
                    sidebarCollapsed
                      ? "justify-center p-4 hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50"
                      : "justify-between p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white"
                  } border-b border-slate-100`}
                >
                  {!sidebarCollapsed ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500">
                          <FileText size={12} className="text-white" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Application Overview
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className="text-slate-400 group-hover:text-violet-500 transition-all duration-300 group-hover:scale-110"
                      />
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 shadow-md group-hover:scale-110 transition-transform duration-300">
                          <FileText size={16} className="text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-slate-400 group-hover:text-violet-500 transition-all duration-300 absolute right-3"
                      />
                    </>
                  )}
                </button>

                {!sidebarCollapsed && (
                  <div className="p-5 space-y-5">
                    {/* Animated Status Section */}
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <div className="w-1 h-3 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
                          Current Status
                        </label>
                        <StatusPill status={formData.primaryStatus} size="sm" />
                      </div>
                      <select
                        value={formData.primaryStatus}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            primaryStatus: e.target.value as ApplicationStatus,
                          }))
                        }
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 hover:bg-white transition-all cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="py-2">
                            {s}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1.5">
                        Changing status will update the application progress
                      </p>
                    </div>

                    {/* Student Information Section */}
                    <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300 delay-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-violet-100">
                          <User size={12} className="text-[#fa6a1f]" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Student Details
                        </h4>
                      </div>

                      <div className="space-y-3 bg-slate-50/50 rounded-xl p-3">
                        <InfoItem
                          label="Full Name"
                          value={
                            studentData?.name ||
                            application.student?.name ||
                            "N/A"
                          }
                          icon={User}
                        />
                        <InfoItem
                          label="Email Address"
                          value={
                            studentData?.email ||
                            application.student?.email ||
                            "N/A"
                          }
                          icon={Mail}
                        />
                        <InfoItem
                          label="Phone Number"
                          value={studentData?.phone || "N/A"}
                          icon={Phone}
                        />
                        {studentData?.passportNumber && (
                          <InfoItem
                            label="Passport Number"
                            value={studentData.passportNumber}
                            icon={Shield}
                          />
                        )}
                        {studentData?.nationality && (
                          <InfoItem
                            label="Nationality"
                            value={studentData.nationality}
                            icon={MapPin}
                          />
                        )}
                      </div>
                    </div>

                    {/* Academic Information Section */}
                    <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300 delay-200">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-100">
                          <GraduationCap
                            size={12}
                            className="text-emerald-600"
                          />
                        </div>
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Academic Details
                        </h4>
                      </div>

                      <div className="space-y-3 bg-slate-50/50 rounded-xl p-3">
                        <InfoItem
                          label="Country"
                          value={application.country || "N/A"}
                          icon={MapPin}
                        />
                        <InfoItem
                          label="University"
                          value={application.course?.university?.name || "N/A"}
                          icon={GraduationCap}
                        />
                        <InfoItem
                          label="Course"
                          value={application.course?.name || "N/A"}
                          icon={BookOpen}
                        />
                        <InfoItem
                          label="Intake"
                          value={application.intake || "N/A"}
                          icon={Calendar}
                        />
                        <div className="flex items-center justify-between pt-1">
                          <InfoItem
                            label="Payment Status"
                            value={
                              <PaymentBadge
                                status={application.paymentStatus}
                              />
                            }
                            icon={CreditCard}
                          />
                          <InfoItem
                            label="Created"
                            value={formatDate(application.createdAt)}
                            icon={Clock}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Mini Cards */}
                    <div className="grid grid-cols-2 gap-2 pt-2 animate-in fade-in slide-in-from-left-2 duration-300 delay-300">
                      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-2 text-center">
                        <p className="text-[10px] text-slate-500">Documents</p>
                        <p className="text-lg font-bold text-[#fa6a1f]">
                          {formData.documents.length}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-2 text-center">
                        <p className="text-[10px] text-slate-500">Backups</p>
                        <p className="text-lg font-bold text-blue-600">
                          {application.backups.length}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional: Mini Profile when collapsed */}
              {sidebarCollapsed && (
                <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-3 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                      {studentData?.name?.[0]?.toUpperCase() ||
                        application.student?.name?.[0]?.toUpperCase() ||
                        "?"}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-[9px] text-slate-400 text-center truncate max-w-[50px]">
                      {studentData?.name?.split(" ")[0] ||
                        application.student?.name?.split(" ")[0]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex gap-0 border-b border-slate-200 px-5 pt-4 sticky top-0 bg-white z-20 rounded-t-2xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px mr-1 
                      rounded-t-lg ${
                        activeTab === tab.id
                          ? "border-[#fa6a1f] text-[#fa6a1f] bg-violet-50/60"
                          : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }
                      `}
                  >
                    <tab.icon size={15} />
                    {tab.label}
                    {/* {tab.id === "documents" && formData.documents.length > 0 && (
                      <span className="ml-0.5 text-xs bg-violet-100 text-[#fa6a1f] px-1.5 py-0.5 rounded-full font-semibold">
                        {formData.documents.length}
                      </span>
                    )} */}
                    {tab.id === "backups" &&
                      formData.backups.length +
                        formData.rejectionReason.length >
                        0 && (
                        <span className="ml-0.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                          {formData.backups.length +
                            formData.rejectionReason.length}
                        </span>
                      )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* DOCUMENTS TAB */}
                {activeTab === "document" && (
                  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500">
                            <FileText size={14} className="text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800">
                            Document Requirements
                          </h3>
                        </div>
                        <p className="text-sm text-slate-400 ml-8">
                          Manage student Documents requirements in one place
                        </p>
                      </div>

                      
                      <button
                          onClick={() => setShowRequirementForm(!showRequirementForm)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm ${
                            showRequirementForm
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                              : "bg-gradient-to-r from-[#fa6a1f] to-indigo-600 text-white hover:from-[#fa6a1f] hover:to-indigo-700 shadow-violet-200"
                          }`}
                        >
                          {showRequirementForm ? (
                            <>
                              <X size={16} />
                              Close Form
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              Create Requirement
                            </>
                          )}
                        </button> 
                       
                    </div>

                    {showRequirementForm && (
                      <div className="mb-6 animate-in slide-in-from-top-3 duration-300">
                        <DocumentRequirementForm
                          onAdd={handleAddRequirement}
                          onCancel={() => setShowRequirementForm(false)}
                        />
                      </div>
                    )}

                    {formData.documents.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FolderOpen size={40} className="text-slate-300" />
          </div>
          <p className="text-base font-semibold text-slate-600">No data yet</p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Create Requirement" to add requirement for this application
          </p>
        </div>
      ) : (
       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {formData.documents.map((doc, idx) => (
            <DocumentCard
              key={doc._id ?? idx}
              doc={doc}
              onUpdateStatus={handleUpdateDocStatus}
              onEdit={(id) => {
                setEditingDocId(id);
                setShowDocUpload(true);
              }}
            />
          ))}
        </div>
      )}

                    {/* <VisaApplicationManager data={Visainfo} applicaion={application} />  */}
                  </div>
                )}

                {/* BACKUPS & REJECTIONS TAB */}
                {activeTab === "backups" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                    {/* Rejection Reasons Section */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-red-500 to-rose-500">
                              <AlertCircle size={14} className="text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              Rejection Reasons
                            </h3>
                          </div>
                          <p className="text-sm text-slate-400 ml-8">
                            Track and manage application rejections
                          </p>
                        </div>
                        <button
                          onClick={addRejection}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-medium hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm"
                        >
                          <Plus size={16} />
                          Add Rejection Reason
                        </button>
                      </div>

                      {formData.rejectionReason.length === 0 ? (
                        <div className="text-center py-16 bg-gradient-to-br from-red-50/30 to-rose-50/30 rounded-2xl border-2 border-dashed border-red-200">
                          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} className="text-red-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-600">
                            No rejection reasons recorded
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Click "Add Rejection Reason" to get started
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {formData.rejectionReason.map((rr, idx) => (
                            <div
                              key={idx}
                              className="group relative bg-white rounded-xl border border-red-100 hover:border-red-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-rose-500/5 rounded-full blur-2xl" />
                              <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                        <div className="w-1 h-3 rounded-full bg-red-500" />
                                        Course
                                      </label>
                                      <select
                                        value={rr.course}
                                        required
                                        onChange={(e) =>
                                          updateRejection(
                                            idx,
                                            "course",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                      >
                                        <option value="">Select course</option>
                                        {courseOptions.map((opt) => (
                                          <option
                                            key={opt.value}
                                            value={opt.value}
                                          >
                                            {opt.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                        <div className="w-1 h-3 rounded-full bg-red-500" />
                                        Rejection Reason
                                      </label>
                                      <input
                                        type="text"
                                        value={rr.reason}
                                        required
                                        onChange={(e) =>
                                          updateRejection(
                                            idx,
                                            "reason",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="e.g., Insufficient documents, Low grades, Missing requirements..."
                                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeRejection(idx)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-10"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Backup Courses Section */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                              <Layers size={14} className="text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              Backup Courses
                            </h3>
                          </div>
                          <p className="text-sm text-slate-400 ml-8">
                            Alternative course preferences for this application
                          </p>
                        </div>
                        <button
                          onClick={addBackup}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-sm"
                        >
                          <Plus size={16} />
                          Add Backup Course
                        </button>
                      </div>

                      {formData.backups.length === 0 ? (
                        <div className="text-center py-16 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 rounded-2xl border-2 border-dashed border-blue-200">
                          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Layers size={32} className="text-blue-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-600">
                            No backup courses added
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Click "Add Backup Course" to add alternatives
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {formData.backups.map((bk, idx) => (
                            <div
                              key={idx}
                              className="group relative bg-white rounded-xl border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl" />
                              <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                        <div className="w-1 h-3 rounded-full bg-blue-500" />
                                        Course
                                      </label>
                                      <select
                                        value={bk.course}
                                        required
                                        onChange={(e) =>
                                          updateBackup(
                                            idx,
                                            "course",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                      >
                                        <option value="">Select course</option>
                                        {courseOptions.map((opt) => (
                                          <option
                                            key={opt.value}
                                            value={opt.value}
                                          >
                                            {opt.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                        <div className="w-1 h-3 rounded-full bg-blue-500" />
                                        Intake
                                      </label>
                                      <select
                                        value={bk.intake}
                                        required
                                        onChange={(e) =>
                                          updateBackup(
                                            idx,
                                            "intake",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                      >
                                        <option value="">Select intake</option>
                                        {INTAKE_OPTIONS.map((intake) => (
                                          <option key={intake} value={intake}>
                                            {intake}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                        <div className="w-1 h-3 rounded-full bg-blue-500" />
                                        Priority Order
                                      </label>
                                      <input
                                        type="number"
                                        value={bk.order}
                                        onChange={(e) =>
                                          updateBackup(
                                            idx,
                                            "order",
                                            parseInt(e.target.value, 10),
                                          )
                                        }
                                        min="1"
                                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeBackup(idx)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-10"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* MESSAGING TAB */}
                {activeTab === "message" && (
                  <div className="bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Ticket Communication History
                        </h3>
                        <p>
                          Track all agent updates, internal discussions, and
                          resolution milestones.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsCommentModalOpen(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
                      >
                        Add Comments
                      </button>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 bg-gray-100 px-8 py-4 text-sm font-semibold text-gray-700 border-b">
                      <div className="col-span-3">Details</div>
                      <div className="col-span-4">Comment</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-2">Commented By</div>
                    </div>

                    {/* Messages */}
                    <div className="max-h-[650px] overflow-y-auto divide-y divide-gray-200">
                      {messageList?.map((item, index): any => (
                        <motion.div
                          key={index+1}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="grid grid-cols-12 gap-4 px-8 py-6 hover:bg-gray-50 transition-colors"
                        >
                          {/* Details */}
                          <div className="col-span-3">
                            <div className="text-sm text-gray-700 leading-6">
                              <p className="font-medium">
                                {item?.createdAt.split("T")[0]}
                              </p>

                              <div className="mt-4">
                                <p className="font-semibold text-gray-800">
                                  Subject:
                                </p>

                                <p className="font-semibold text-gray-900 mt-2">
                                  {item?.extra_content?.subject}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Comment */}
                          <div className="col-span-5">
                            <div className="space-y-3">
                              <div className="text-gray-700 leading-7 text-[15px]">
                                {item?.content}
                              </div>

                              {item?.extra_content?.attachments?.[0]?.name && (
                                <a
                                  href={`https://api.ooshasglobal.com${item.extra_content?.attachments?.[0]?.url}`}
                                  target="_blank"
                                  className="flex items-center gap-2"
                                >
                                  <Paperclip className="w-4 h-4 text-slate-400" />

                                  {item.extra_content?.attachments?.[0]?.name}
                                </a>
                              )}
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
                                  {item.primaryStatus ||
                                    "Application Processed"}
                                </p>
                              </div>

                              <div>
                                <p className="font-bold text-gray-800">
                                  Message Status:
                                </p>

                                <p className="text-gray-700">
                                  {item?.isRead ? "true" : "false"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* User */}

                          <div className="col-span-1 flex flex-col items-center justify-between">
                            <span className="text-gray-700 font-medium">
                              {item.userType}
                            </span>

                            {item.userType !== "ooshas" && !item?.isRead && (
                              <button
                                onClick={() => {
                                  setIsCommentModalOpen(true);
                                  setMessageSubject(
                                    item?.extra_content?.subject,
                                  );
                                  markMessagesAsRead();
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1 px-2 rounded-md transition-colors"
                              >
                                reply <SendHorizonal className="h-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Modal */}
                    <AnimatePresence>
                      {isCommentModalOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 flex items-end justify-end p-6"
                        >
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
                          >
                            {/* Header */}
                            <div className="bg-white border-b border-slate-100 px-5 py-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-base font-bold text-slate-800">
                                    New Message
                                  </h3>

                                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                    <span>To</span>

                                    <span className="font-medium text-slate-700">
                                      Ooshas
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => setIsCommentModalOpen(false)}
                                  className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 space-y-5">
                              {/* Subject */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm">
                                  <label className="font-medium text-slate-600 w-16">
                                    Subject
                                  </label>

                                  <select
                                    value={messageSubject}
                                    onChange={(e) =>
                                      setMessageSubject(e.target.value)
                                    }
                                    className="flex-1 bg-transparent border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none focus:border-orange-500"
                                  >
                                    <option value="">
                                      Select a subject...
                                    </option>

                                    <option value="Application Processed">
                                      Application Processed
                                    </option>

                                    <option value="Document Uploaded">
                                      Document Uploaded
                                    </option>

                                    <option value="Document Request">
                                      Document Request
                                    </option>

                                    <option value="University Update">
                                      University Update
                                    </option>
                                  </select>
                                </div>
                              </div>

                              {/* Message */}
                              <div className="space-y-1.5">
                                <textarea
                                  rows={5}
                                  value={messageText}
                                  onChange={(e) =>
                                    setMessageText(e.target.value)
                                  }
                                  placeholder="Type your comment details here..."
                                  className="w-full p-3 outline-none resize-none text-sm text-slate-700 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-100 focus:border-orange-500 focus:bg-white transition-all"
                                />
                              </div>

                              {/* Attachments */}
                              {messageAttachments.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    {messageAttachments.map((file, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1 text-xs text-slate-600"
                                      >
                                        <svg
                                          className="w-3 h-3 text-slate-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                          />
                                        </svg>

                                        <span className="max-w-[120px] truncate">
                                          {file.name}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeUploadedFile(index)
                                          }
                                          className="text-slate-400 hover:text-rose-500 ml-1"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex items-center justify-end gap-2 pt-2">
                                {/* Upload */}
                                <button
                                  type="button"
                                  disabled={
                                    messageSubject !== "Document Uploaded" ||
                                    isAttachmentUploading ||
                                    isCommentSubmitting
                                  }
                                  onClick={() => fileInputRef.current.click()}
                                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                    />
                                  </svg>
                                </button>

                                {/* Send */}
                                <button
                                  type="button"
                                  onClick={sendMessage}
                                  disabled={
                                    isCommentSubmitting ||
                                    isAttachmentUploading ||
                                    !messageText.trim()
                                  }
                                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium px-5 py-2 rounded-full text-sm transition-all"
                                >
                                  {isCommentSubmitting ? "Sending..." : "Send"}
                                </button>
                              </div>
                            </div>

                            {/* Hidden File Input */}
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              multiple
                              disabled={
                                isAttachmentUploading || isCommentSubmitting
                              }
                              className="hidden"
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ACTIVITY TAB */}
                {activeTab === "activity" && (
                  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                          <History size={14} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Activity Timeline
                        </h3>
                      </div>
                      <p className="text-sm text-slate-400 ml-8">
                        Complete history of all application interactions
                      </p>
                    </div>

                    {activityLogs.length === 0 ? (
                      <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                          <History size={40} className="text-slate-300" />
                        </div>
                        <p className="text-base font-semibold text-slate-600">
                          No activity recorded yet
                        </p>
                        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                          Activities like status changes, document reviews, and
                          messages will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Timeline Vertical Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-violet-200 via-slate-200 to-transparent" />

                        {/* Timeline Items */}
                        <div className="space-y-0">
                          {activityLogs.map((log, idx) => (
                            <TimelineItem
                              key={log._id}
                              log={log}
                              isLast={idx === activityLogs.length - 1}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        visible={showDocUpload}
        onClose={() => {
          setShowDocUpload(false);
          setEditingDocId(undefined);
        }}
        onUpload={handleDocUpload}
        onUpdateDocument={handleUpdateDocument}
        uploading={uploadingDoc}
        existingDocs={formData.documents}
        initialDocId={editingDocId}
      />
    </div>
  );
}

function DocumentCard({ doc, onUpdateStatus, onEdit }: any) {
  const [showReason, setShowReason] = useState(false);
  const [rejectReason, setRejectReason] = useState(doc.rejectReason || "");
  const [status,setstatus] = useState(doc.status || "")
  const statusConfig = {
    Pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: Clock,
      label: "Pending",
    },
    inreview: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: Activity,
      label: "In Review",
    },
    Approved: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: CheckCircle,
      label: "Approved",
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: AlertCircle,
      label: "Rejected",
    },
  };
  const currentStatus = statusConfig[doc.status] || statusConfig.Pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 hover:border-violet-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Status Bar */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${currentStatus.bg.replace("bg-", "bg-gradient-to-b from-")}`}
      />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <DocumentTypeIcon type={doc.docType} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-semibold text-slate-800">{doc.name}</h4>
                  {doc.docUrl && doc.docType !== "form" && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${doc.docUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#fa6a1f] transition"
                    >
                      <ExternalLink size={12} />
                      View
                    </a>
                  )}
                </div>
                {doc.description && (
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                    {doc.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      doc.type === "ooshas"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {doc.type === "ooshas" ? "Ooshas" : "Student"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      doc.required === "required"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {doc.required === "required" ? "Required" : "Optional"}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {doc.docType}
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="shrink-0">
                <div className="relative">

                  {/* <select
                    value={status}
                    onChange={(e) => {
                      console.log(e.target.value, doc);
                      if (e.target.value === "Rejected") {
                        setShowReason(true);
                      } else {
                        setShowReason(false);
                        onUpdateStatus(doc._id, e.target.value);
                        setstatus(e.target.value);
                      }
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer pr-7 ${currentStatus.bg} ${currentStatus.text} border-${currentStatus.text.split("-")[1]}-200 font-medium`}
                  >
                    {['Pending', 'inreview', 'Approved', 'Rejected'].map(ele => (
                      <option value={ele} >{ele}</option>
                    ))}
                  </select> */}
                  <select
  value={status}
  onChange={(e) => {
    const newStatus = e.target.value as AppDocument["status"];
    if (newStatus === "Rejected") {
      setShowReason(true);
    } else {
      setShowReason(false);
      onUpdateStatus(doc._id, newStatus);
      setstatus(newStatus);
    }
  }}
  className={`text-xs px-3 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer pr-7 ${currentStatus.bg} ${currentStatus.text} border-${currentStatus.text.split("-")[1]}-200 font-medium`}
>
  <option value="Pending">Pending</option>
  <option value="inreview">In Review</option>
  <option value="Approved">Approved</option>
  <option value="Rejected">Rejected</option>
</select>

                  <StatusIcon
                    size={12}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${currentStatus.text}`}
                  />
                </div>
                <button
                  onClick={() => onEdit(doc._id)}
                  className="mt-4 w-full text-center text-[10px] px-3 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer pr-7"
                >
                  Edit details
                </button>
              </div>
            </div>

            {/* Rejection Reason Input */}
            {showReason && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200 animate-in slide-in-from-top-2 duration-200">
                <label className="text-xs font-semibold text-red-700 mb-1 block">
                  Rejection Reason
                </label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white mb-2"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setShowReason(false);
                      setRejectReason(doc.rejectReason || "");
                    }}
                    className="px-3 py-1 text-xs rounded-lg text-slate-600 hover:bg-red-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (rejectReason.trim()) {
                        onUpdateStatus(doc._id, "Rejected", rejectReason);
                        setShowReason(false);
                      }
                    }}
                    className="px-3 py-1 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}

            {/* Display Existing Rejection Reason */}
            {doc.rejectReason && doc.status === "Rejected" && !showReason && (
              <div className="mt-3 flex items-start gap-2 p-2 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle
                  size={14}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-red-700">
                    Rejection Reason
                  </p>
                  <p className="text-xs text-red-600">{doc.rejectReason}</p>
                </div>
              </div>
            )}

            {/* Form Responses Preview */}
            {doc.docType === "form" && doc.answer && (
              <div className="mt-3 p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Form Responses
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(() => {
                    try {
                      const answers = JSON.parse(doc.answer);
                      return Object.entries(answers).map(([key, val]) => (
                        <div
                          key={key}
                          className="text-xs p-1.5 bg-white rounded border border-slate-100"
                        >
                          <span className="text-slate-500 font-medium">
                            {key}:
                          </span>{" "}
                          <span className="text-slate-700">{String(val)}</span>
                        </div>
                      ));
                    } catch {
                      return (
                        <span className="text-xs text-slate-400">
                          Invalid response data
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentTypeIcon({ type }: { type: AppDocument["docType"] }) {
  const icons = {
    document: FileText,
    form: FileQuestion,
    picture: Image,
    other: File,
  };

  const colors = {
    document: "bg-blue-50 text-blue-600",
    form: "bg-purple-50 text-purple-600",
    picture: "bg-pink-50 text-pink-600",
    other: "bg-slate-50 text-slate-600",
  };

  const Icon = icons[type] || File;
  const colorClass = colors[type] || colors.other;

  return (
    <div
      className={`p-2 rounded-xl ${colorClass} transition-all duration-200 group-hover:scale-110`}
    >
      <Icon size={16} />
    </div>
  );
}
