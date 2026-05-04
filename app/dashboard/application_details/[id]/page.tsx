


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
  File,
  Edit,
  MessageCircle,
  Activity,
  Timer,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import MessagingTab from "@/components/dashboard/application/chatSystem";

// ── Types ─────────────────────────────────────────────────────────────────────

type ApplicationStatus =
  | "Pending" | "Started" | "ReviewbyOoshas" | "SubmitToSchool"
  | "AwaitingSchoolResponse" | "AdmissionProcessing" | "Refused"
  | "Withdrawn" | "PreArrival" | "Arrived" | "Completed";

type PaymentStatus = "Pending" | "Completed" | "Failed";



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

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  passportNumber?: string;
  nationality?: string;
}

interface University { _id: string; name: string; }
interface Course { _id: string; name: string; university?: University; }

interface DocumentExtraField {
  label: string; type: string; required: boolean; validation: string;
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

interface BackupCourse { course: string; intake: string; order: number; }

interface RejectionReason {
  course: string; reason: string;
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
  adminNotes?: string;
  documents: AppDocument[];
  backups: BackupCourse[];
  rejectionReason: RejectionReason[];
  createdAt?: string;
  updatedAt?: string;
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  Started: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  ReviewbyOoshas: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  SubmitToSchool: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400" },
  AwaitingSchoolResponse: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  AdmissionProcessing: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-400" },
  Refused: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
  Withdrawn: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" },
  PreArrival: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  Arrived: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400" },
  Completed: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-400" },
  inreview: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
};

const REJECTION_STATUSES = ["Pending", "inreview", "Approved", "Rejected"];
const INTAKE_OPTIONS = [
  "January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025",
  "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025",
  "January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026"
];

// ── Reusable UI ───────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Completed: "bg-emerald-50 text-emerald-700",
    Failed: "bg-rose-50 text-rose-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>{status}</span>;
}

function InfoCard({ label, value, accent = false }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? "border-violet-100 bg-violet-50/60" : "border-slate-100 bg-slate-50/60"}`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <div className={`text-sm font-semibold ${accent ? "text-violet-700" : "text-slate-700"}`}>{value}</div>
    </div>
  );
}

// ── Document Requirement Form ─────────────────────────────────────────────────

function DocumentRequirementForm({
  onAdd, onCancel,
}: {
  onAdd: (doc: Partial<AppDocument>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<AppDocument>>({
    type: "user", name: "", description: "", required: "optional",
    docUrl: "", docType: "document",
    extra: [{ label: "", type: "text", required: false, validation: "" }],
  });
  const [uploading, setUploading] = useState(false);

  const handleFieldChange = (idx: number, key: string, val: string | boolean) => {
    const arr = Array.isArray(form.extra) ? [...(form.extra as DocumentExtraField[])] : [];
    arr[idx] = { ...arr[idx], [key]: val };
    setForm((p) => ({ ...p, extra: arr }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("document", file);
      const res = await axiosInstance.post("/uploads/documents", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) setForm((p) => ({ ...p, docUrl: res.data.data.url }));
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = () => {
    if (!form.name) { alert("Please enter document name"); return; }
    const payload = { ...form };
    if (payload.type === "ooshas" && payload.docType === "form")
      payload.extra = JSON.stringify(payload.extra);
    onAdd(payload);
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
      <h4 className="font-semibold text-slate-800 mb-3 text-sm">Create Document Requirement</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Document Type *</label>
          <select
            value={form.docType}
            onChange={(e) => setForm((p) => ({ ...p, docType: e.target.value as AppDocument["docType"] }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          >
            <option value="document">Document (PDF / DOC)</option>
            <option value="form">Question Form</option>
            <option value="picture">Picture</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Required Status *</label>
          <select
            value={form.required}
            onChange={(e) => setForm((p) => ({ ...p, required: e.target.value as "required" | "optional" }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          >
            <option value="required">Required</option>
            <option value="optional">Optional</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Document Name *</label>
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
        <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Additional instructions…"
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
        />
      </div>
      {form.type === "ooshas" && form.docType !== "form" && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-600 mb-1">Upload Document *</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} disabled={uploading} className="w-full text-sm" />
          {uploading && <RefreshCw size={14} className="animate-spin mt-2 text-slate-400" />}
          {form.docUrl && <p className="mt-1 text-xs text-emerald-600">✓ Uploaded</p>}
        </div>
      )}
      {form.docType === "form" && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-600 mb-2">Form Fields *</label>
          {(Array.isArray(form.extra) ? form.extra : []).map((field, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2 bg-white p-2 rounded-lg border border-slate-200">
              <input type="text" placeholder="Label" value={field.label}
                onChange={(e) => handleFieldChange(i, "label", e.target.value)}
                className="px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none" />
              <select value={field.type} onChange={(e) => handleFieldChange(i, "type", e.target.value)}
                className="px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none">
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" checked={field.required}
                  onChange={(e) => handleFieldChange(i, "required", e.target.checked)} />
                Required
              </label>
              <button onClick={() => {
                const arr = (form.extra as DocumentExtraField[]).filter((_, j) => j !== i);
                setForm((p) => ({ ...p, extra: arr }));
              }} className="text-rose-400 hover:text-rose-600 flex justify-center items-center">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button onClick={() => setForm((p) => ({
            ...p,
            extra: [...(Array.isArray(p.extra) ? p.extra : []), { label: "", type: "text", required: false, validation: "" }],
          }))} className="text-xs text-violet-600 hover:text-violet-800 font-medium">
            + Add Field
          </button>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm">
          Cancel
        </button>
        <button onClick={handleSubmit} className="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 text-sm font-medium">
          Add Requirement
        </button>
      </div>
    </div>
  );
}

// ── Enhanced Document Upload Modal with Field Updates ─────────────────────────

function DocumentUploadModal({
  visible, onClose, onUpload, onUpdateDocument, uploading, existingDocs = [],
}: {
  visible: boolean; onClose: () => void;
  onUpload: (file: File | null, docType: string, docName: string, docId?: string, answers?: any) => Promise<void>;
  onUpdateDocument: (docId: string, updates: Partial<AppDocument>) => Promise<void>;
  uploading: boolean;
  existingDocs?: AppDocument[];
}) {
  const [selectedDocId, setSelectedDocId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<"user" | "ooshas">("user");
  const [docRequired, setDocRequired] = useState<"required" | "optional">("optional");
  const [docDescription, setDocDescription] = useState("");
  const [docCategory, setDocCategory] = useState<AppDocument["docType"]>("document");
  const [extraFields, setExtraFields] = useState<DocumentExtraField[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleDocSelect = (id: string) => {
    setSelectedDocId(id);
    if (id === "") {
      // Reset form for new document
      setDocName("");
      setDocType("user");
      setDocRequired("optional");
      setDocDescription("");
      setDocCategory("document");
      setExtraFields([]);
      setAnswers({});
      setIsEditing(false);
    } else {
      const doc = existingDocs.find(d => d._id === id);
      if (doc) {
        setDocName(doc.name);
        setDocType(doc.type);
        setDocRequired(doc.required);
        setDocDescription(doc.description || "");
        setDocCategory(doc.docType);
        setIsEditing(true);

        let extra: DocumentExtraField[] = [];
        if (typeof doc.extra === "string") {
          try { extra = JSON.parse(doc.extra); } catch { extra = []; }
        } else if (Array.isArray(doc.extra)) {
          extra = doc.extra;
        }
        setExtraFields(extra);

        const initialAnswers: Record<string, string> = {};
        if (doc.answer) {
          try {
            const parsed = JSON.parse(doc.answer);
            Object.assign(initialAnswers, parsed);
          } catch { /* ignore */ }
        }
        setAnswers(initialAnswers);
      }
    }
  };

  const handleFieldChange = (idx: number, key: string, val: string | boolean) => {
    const arr = [...extraFields];
    arr[idx] = { ...arr[idx], [key]: val };
    setExtraFields(arr);
  };

  const handleAddField = () => {
    setExtraFields([...extraFields, { label: "", type: "text", required: false, validation: "" }]);
  };

  const handleRemoveField = (idx: number) => {
    setExtraFields(extraFields.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!docName) { setErr("Please enter document name"); return; }

    // Validate form fields if it's a form
    if (docCategory === "form") {
      for (const field of extraFields) {
        if (field.required && !answers[field.label]) {
          setErr(`${field.label} is required`);
          return;
        }
      }
    }

    if (isEditing && selectedDocId) {
      // Update existing document metadata
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

      await onUpdateDocument(selectedDocId, updates);
    } else {
      // Upload new document
      await onUpload(file, docType, docName, undefined, docCategory === "form" ? answers : undefined);
    }

    // Reset form
    setFile(null); setDocName(""); setDocType("user"); setDocRequired("optional");
    setDocDescription(""); setSelectedDocId(""); setAnswers({});
    setExtraFields([]); setErr(""); setIsEditing(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-semibold text-slate-800">
            {isEditing ? "Edit Document" : "Upload Document"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          {err && <div className="p-2 rounded-lg bg-rose-50 text-rose-600 text-sm flex items-center gap-2"><AlertCircle size={14} />{err}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Existing Document (Optional)</label>
            <select
              value={selectedDocId}
              onChange={(e) => handleDocSelect(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">-- New Document --</option>
              {existingDocs.map((doc) => (
                <option key={doc._id} value={doc._id}>{doc.name} ({doc.type}) - {doc.status}</option>
              ))}
            </select>
            {isEditing && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <Edit size={12} /> Editing selected document metadata
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Name *</label>
            <input type="text" value={docName} onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g., Passport Copy" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
              <select value={docCategory} onChange={(e) => setDocCategory(e.target.value as AppDocument["docType"])}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="document">Document</option>
                <option value="form">Question Form</option>
                <option value="picture">Picture</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Response By</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value as "user" | "ooshas")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="user">Student</option>
                <option value="ooshas">Ooshas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Required Status</label>
            <select value={docRequired} onChange={(e) => setDocRequired(e.target.value as "required" | "optional")}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400">
              <option value="required">Required</option>
              <option value="optional">Optional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
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
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Form Fields</h4>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="text-xs text-violet-600 hover:text-violet-800 font-medium flex items-center gap-1"
                >
                  <Plus size={12} /> Add Field
                </button>
              </div>

              {extraFields.map((field, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={field.label}
                      onChange={(e) => handleFieldChange(i, "label", e.target.value)}
                      className="px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => handleFieldChange(i, "type", e.target.value)}
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
                          onChange={(e) => handleFieldChange(i, "required", e.target.checked)}
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

                  {/* Show answer input if editing and this is a form with existing answers */}
                  {isEditing && field.label && answers[field.label] !== undefined && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Current Answer</label>
                      <input
                        type={field.type}
                        value={answers[field.label] || ""}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [field.label]: e.target.value }))}
                        className="w-full px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                        placeholder={`Answer for ${field.label}`}
                      />
                    </div>
                  )}
                </div>
              ))}

              {isEditing && docCategory === "form" && extraFields.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">No form fields defined. Add fields above.</p>
              )}
            </div>
          )}

          {!isEditing && docCategory !== "form" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                File {docCategory === "form" ? "(Optional)" : "*"}
              </label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size > 5 * 1024 * 1024) { setErr("Max 5MB"); return; }
                  if (f) { setFile(f); setErr(""); }
                }}
                className="w-full text-sm border border-slate-200 rounded-lg p-2" />
              <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DOC — max 5MB</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={uploading}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium flex items-center gap-2">
            {uploading ? <RefreshCw size={15} className="animate-spin" /> : isEditing ? <Save size={15} /> : <Upload size={15} />}
            {isEditing ? "Save Changes" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Pending", "Started", "ReviewbyOoshas", "SubmitToSchool", "AwaitingSchoolResponse",
  "AdmissionProcessing", "Refused", "Withdrawn", "PreArrival", "Arrived", "Completed",
];

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])

  const [formData, setFormData] = useState({
    primaryStatus: "Pending" as ApplicationStatus,
    adminNotes: "",
    documents: [] as AppDocument[],
    backups: [] as BackupCourse[],
    rejectionReason: [] as RejectionReason[],
  });

  console.log(application?.course)

  const [courseOptions, setCourseOptions] = useState<{ label: string; value: string }[]>([]);

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
        adminNotes: app.adminNotes || "",
        documents: app.documents || [],
        backups: app.backups || [],
        rejectionReason: app.rejectionReason || [],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load application");
    } finally {
      setPageLoading(false);
    }
  }, [id]);

  
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get(`/communication/applications/${id}/activities?limit=100`)
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
  

  useEffect(() => { fetchApplication(); fetchActivities() }, [fetchApplication]);

  useEffect(() => {
    const fetchCourses = async () => {
      const code = application?.course?.university?.code;
      if (!code) return;

      try {
        const response = await axiosInstance.get(`/courses?code=${code}`);
        const data = response.data?.data || response.data || [];

        if (Array.isArray(data)) {
          const mapped = data.map((c: any) => ({
            label: c.name,
            value: c._id
          }));
          setCourseOptions(mapped);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourseOptions([]);
      }
    };

    fetchCourses();
  }, [application?.course?.university?.code, id]);

  console.log(application)
  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const res = await axiosInstance.put(
        `/applications/${id}`,
        {
          primaryStatus: formData.primaryStatus, adminNotes: formData.adminNotes,
          rejectionReason: formData.rejectionReason, backups: formData.backups,
          documents: formData.documents
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        setSuccess("Saved successfully!");
        setTimeout(() => { setSuccess(""); }, 1500);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDocUpload = async (file: File | null, docType: string, docName: string, docId?: string, answers?: any) => {
    setUploadingDoc(true);
    try {
      const fd = new FormData();
      if (file) fd.append("document", file);
      fd.append("docType", docType);
      fd.append("name", docName);
      if (answers) fd.append("answer", JSON.stringify(answers));

      let res;
      if (docId) {
        res = await axiosInstance.put(`/applications/${id}/documents/${docId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosInstance.post(`/applications/${id}/documents`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        if (docId) {
          const docs = [...formData.documents];
          const idx = docs.findIndex(d => d._id === docId);
          if (idx !== -1) {
            docs[idx] = res.data.data;
            setFormData(p => ({ ...p, documents: docs }));
          }
        } else {
          setFormData((p) => ({ ...p, documents: [...p.documents, res.data.data] }));
        }
        setSuccess("Document uploaded"); setShowDocUpload(false);
      }
    } catch { setError("Upload failed"); }
    finally { setUploadingDoc(false); }
  };

  const handleUpdateDocument = async (docId: string, updates: Partial<AppDocument>) => {
    setUploadingDoc(true);
    try {
      const res = await axiosInstance.put(
        `/applications/${id}/documents/${docId}`,
        updates,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) {
        const docs = [...formData.documents];
        const idx = docs.findIndex(d => d._id === docId);
        if (idx !== -1) {
          docs[idx] = { ...docs[idx], ...updates };
          setFormData(p => ({ ...p, documents: docs }));
        }
        setSuccess("Document updated successfully");
        setShowDocUpload(false);
      }
    } catch (err) {
      setError("Failed to update document");
      console.error(err);
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
        setSuccess("Requirement added"); setShowRequirementForm(false);
      }
    } catch { setError("Failed to add requirement"); }
  };

  const handleUpdateDocStatus = async (idx: number, status: AppDocument["status"], rejectReason?: string) => {
    try {
      const docs = [...formData.documents];
      docs[idx] = { ...docs[idx], status, rejectReason };

      const res = await axiosInstance.put(
        `/applications/${id}`, { documents: docs },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        setFormData((p) => ({ ...p, documents: docs }));
        setSuccess("Status updated");
      }
    } catch { setError("Failed to update status"); }
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  // ── Backup & Rejection Handlers ──────────────────────────────────────────────

  const addBackup = () => {
    setFormData(prev => ({
      ...prev,
      backups: [...prev.backups, { course: "", intake: "", order: prev.backups.length + 1 }]
    }));
  };

  const updateBackup = (idx: number, field: keyof BackupCourse, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      backups: prev.backups.map((b, i) => i === idx ? { ...b, [field]: value } : b)
    }));
  };

  const removeBackup = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      backups: prev.backups.filter((_, i) => i !== idx)
    }));
  };

  const addRejection = () => {
    setFormData(prev => ({
      ...prev,
      rejectionReason: [...prev.rejectionReason, { course: "", reason: "" }]
    }));
  };

  const updateRejection = (idx: number, field: keyof RejectionReason, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      rejectionReason: prev.rejectionReason.map((r, i) => i === idx ? { ...r, [field]: value } : r)
    }));
  };

  const removeRejection = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      rejectionReason: prev.rejectionReason.filter((_, i) => i !== idx)
    }));
  };

  const sectionCls = "bg-white rounded-2xl border border-slate-200 shadow-sm p-5";
  const labelCls = "block text-xs font-medium text-slate-500 mb-1";
  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400";

  // ── Loading skeleton ────────────────────────────────────────────────────────
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
          <p className="text-slate-600 font-medium mb-2">Application not found</p>
          <button onClick={() => router.back()} className="text-sm text-violet-600 hover:underline flex items-center gap-1 mx-auto">
            <ChevronLeft size={14} /> Go back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "info", label: "Course", icon: User },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "backups", label: "Backups & Rejections", icon: BookOpen },
    { id: "message", label: "Messages ", icon: MessageCircle },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <div className="h-auto overflow-auto bg-slate-50 pb-8" >
      {/* Top bar */}
      < div className="bg-white border-b border-slate-200 sticky top-0 z-20" >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition disabled:opacity-60"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Save Changes
            </button>
          </div>
        </div>
      </div >

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            <AlertCircle size={16} /> {error}
            <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {/* Status + Notes card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Application Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Application Status</label>
              <select
                value={formData.primaryStatus}
                onChange={(e) => setFormData((p) => ({ ...p, primaryStatus: e.target.value as ApplicationStatus }))}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Admin Notes</label>
              <textarea
                rows={2}
                value={formData.adminNotes}
                onChange={(e) => setFormData((p) => ({ ...p, adminNotes: e.target.value }))}
                placeholder="Internal notes visible only to admins…"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex gap-0 border-b border-slate-200 px-5 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px mr-1 rounded-t-lg ${activeTab === tab.id
                  ? "border-violet-600 text-violet-700 bg-violet-50/60"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
              >
                <tab.icon size={15} />
                {tab.label}
                {tab.id === "documents" && formData.documents.length > 0 && (
                  <span className="ml-0.5 text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-semibold">
                    {formData.documents.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* ── INFO TAB ── */}
            {activeTab === "info" && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Course Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <InfoCard label="Country" value={application.country || "N/A"} />
                  <InfoCard label="University" value={application.course?.university?.name || "N/A"} />
                  <InfoCard label="Course" value={application.course?.name || "N/A"} />
                  <InfoCard label="Intake" value={application.intake || "N/A"} />
                  <InfoCard label="Payment" value={<PaymentBadge status={application.paymentStatus} />} />
                  <InfoCard label="Created" value={formatDate(application.createdAt)} />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Student Info</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <InfoCard label="Name" value={application.student?.name || "N/A"} />
                    <InfoCard label="Email" value={application.student?.email || "N/A"} />
                    <InfoCard label="Phone" value={application.student?.phone || "N/A"} />
                    {application.student?.passportNumber && (
                      <InfoCard label="Passport No." value={application.student.passportNumber} />
                    )}
                    {application.student?.nationality && (
                      <InfoCard label="Nationality" value={application.student.nationality} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── DOCUMENTS TAB ── */}
            {activeTab === "documents" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">Documents</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDocUpload(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition"
                    >
                      <Upload size={13} /> Upload / Edit
                    </button>
                    <button
                      onClick={() => setShowRequirementForm(!showRequirementForm)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
                    >
                      <Plus size={13} /> Create Requirement
                    </button>
                  </div>
                </div>

                {showRequirementForm && (
                  <DocumentRequirementForm
                    onAdd={handleAddRequirement}
                    onCancel={() => setShowRequirementForm(false)}
                  />
                )}

                {formData.documents.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                    <FileText size={24} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No documents yet</p>
                    <p className="text-xs mt-1">Click "Create Requirement" to add required documents</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">By</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Required</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Reject Reason</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {formData.documents.map((doc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-800">
                              <div className="flex items-center gap-1.5">
                                {doc.name}
                                {doc.docUrl && doc.docType !== "form" && (
                                  <a href={`http://localhost:5000${doc.docUrl}`} target="_blank" rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-violet-600 transition">
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doc.type === "ooshas" ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-700"
                                }`}>
                                {doc.type === "ooshas" ? "Ooshas" : "User"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doc.required === "required" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"
                                }`}>
                                {doc.required}
                              </span>
                            </td>
                            <td className="px-4 py-3"><StatusPill status={doc.status} /></td>
                            <td className="px-4 py-3 text-rose-600 text-xs max-w-[130px] truncate">{doc.rejectReason || "—"}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setShowDocUpload(true);
                                    // This is handled via the modal's document selection
                                  }}
                                  className="p-1 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                                  title="Edit document"
                                >
                                  <Edit size={14} />
                                </button>
                                <select
                                  value={doc.status}
                                  onChange={(e) => {
                                    const s = e.target.value as AppDocument["status"];
                                    if (s === "Rejected") {
                                      const r = prompt("Rejection reason:");
                                      if (r) handleUpdateDocStatus(idx, s, r);
                                    } else handleUpdateDocStatus(idx, s);
                                  }}
                                  className="px-2 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="inreview">In Review</option>
                                  <option value="Approved">Approved</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── BACKUPS & REJECTIONS TAB ── */}
            {activeTab === "backups" && (
              <div className="space-y-6">
                {/* Rejection Reasons Section */}
                <div className={sectionCls}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">1</span>
                      Rejection Reasons
                    </h3>
                    <button
                      type="button"
                      onClick={addRejection}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition border border-rose-200"
                    >
                      <Plus size={14} /> Add Reason
                    </button>
                  </div>

                  {formData.rejectionReason.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No rejection reasons added. Click "Add Reason" to add one.</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.rejectionReason.map((rr, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative">
                          <button
                            type="button"
                            onClick={() => removeRejection(idx)}
                            className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition"
                          >
                            <X size={14} />
                          </button>
                          <div>
                            <label className={labelCls}>Course</label>
                            <select
                              className={inputCls}
                              value={rr.course}
                              onChange={(e) => updateRejection(idx, "course", e.target.value)}
                            >
                              <option value="">Select course</option>
                              {courseOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Reason</label>
                            <input type="text" className={inputCls} placeholder="e.g. Insufficient documents" value={rr.reason} onChange={(e) => updateRejection(idx, "reason", e.target.value)} />
                          </div>
                          {/* <div>
                            <label className={labelCls}>Order</label>
                            <input type="number" min={1} className={inputCls} value={rr.order} onChange={(e) => updateRejection(idx, "order", Number(e.target.value))} />
                          </div>
                          <div>
                            <label className={labelCls}>Status</label>
                            <select className={inputCls} value={rr.status} onChange={(e) => updateRejection(idx, "status", e.target.value as RejectionReason["status"])}>
                              {REJECTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div> */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Backup Courses Section */}
                <div className={sectionCls}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                      Backup Courses
                    </h3>
                    <button
                      type="button"
                      onClick={addBackup}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition border border-blue-200"
                    >
                      <Plus size={14} /> Add Backup
                    </button>
                  </div>

                  {formData.backups.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No backup courses added. Click "Add Backup" to add one.</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.backups.map((bk, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative">
                          <button
                            type="button"
                            onClick={() => removeBackup(idx)}
                            className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition"
                          >
                            <X size={14} />
                          </button>
                          <div>
                            <label className={labelCls}>Course</label>
                            <select
                              className={inputCls}
                              value={bk.course || ""}
                              onChange={(e) => updateBackup(idx, "course", e.target.value)}
                            >
                              <option value="">Select course</option>
                              {courseOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Intake</label>
                            <select className={inputCls} value={bk.intake} onChange={(e) => updateBackup(idx, "intake", e.target.value)}>
                              <option value="">Select intake</option>
                              {INTAKE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Order</label>
                            <input type="number" min={1} className={inputCls} value={bk.order} onChange={(e) => updateBackup(idx, "order", Number(e.target.value))} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── INFO TAB ── */}
            {activeTab === "message" && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Course Information</h3>
                <MessagingTab applicationId={application._id} />
              </div>
            )}
            
        {activeTab === 'activity' && (
          <div
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
                  <div
                    key={log._id}
                    className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">


                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{log.action.replace(/_/g, ' ').toUpperCase()}</h4>
                            {log.status && (
                              <StatusPill status={log.status} />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(log.createdAt)}
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
                  </div>
                ))
              )}
            </div>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Enhanced Document Upload Modal */}
      <DocumentUploadModal
        visible={showDocUpload}
        onClose={() => setShowDocUpload(false)}
        onUpload={handleDocUpload}
        onUpdateDocument={handleUpdateDocument}
        uploading={uploadingDoc}
        existingDocs={formData.documents}
      />
    </div >
  );
}