






// "use client";

// import axiosInstance from "@/app/axiosInstance";
// import {
//   ChevronLeft,
//   RefreshCw,
//   Save,
//   Upload,
//   Plus,
//   X,
//   Trash2,
//   CheckCircle,
//   AlertCircle,
//   FileText,
//   BookOpen,
//   User,
//   ExternalLink,
//   Edit,
//   MessageCircle,
//   Activity,
//   Timer,
// } from "lucide-react";
// import React, { useEffect, useState, useCallback } from "react";
// import { useRouter, useParams } from "next/navigation";
// import MessagingTab from "@/components/dashboard/application/chatSystem";

// // ── Types ─────────────────────────────────────────────────────────────────────

// type ApplicationStatus =
//   | "Pending" | "Started" | "ReviewbyOoshas" | "SubmitToSchool"
//   | "AwaitingSchoolResponse" | "AdmissionProcessing" | "Refused"
//   | "Withdrawn" | "PreArrival" | "Arrived" | "Completed";

// type PaymentStatus = "Pending" | "Completed" | "Failed";

// interface ActivityLog {
//   _id: string;
//   action: string;
//   description: string;
//   status: string;
//   user: { name: string };
//   userType: "student" | "ooshas" | "admin" | "system";
//   createdAt: string;
//   callDuration?: string;
//   callType?: "incoming" | "outgoing" | "missed";
//   metadata?: Record<string, any>;
// }

// interface Student {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   passportNumber?: string;
//   nationality?: string;
// }

// interface University { _id: string; name: string; code?: string; }
// interface Course { _id: string; name: string; university?: University; }

// interface DocumentExtraField {
//   label: string;
//   type: string;
//   required: boolean;
//   validation: string;
// }

// interface AppDocument {
//   _id?: string;
//   name: string;
//   type: "user" | "ooshas";
//   docType: "document" | "form" | "picture" | "other";
//   required: "required" | "optional";
//   description?: string;
//   docUrl?: string;
//   status: "Pending" | "inreview" | "Approved" | "Rejected";
//   rejectReason?: string;
//   answer?: string;
//   extra?: DocumentExtraField[] | string;
// }

// interface BackupCourse { course: string; intake: string; order: number; }

// interface RejectionReason {
//   course: string;
//   reason: string;
// }

// interface Application {
//   _id: string;
//   applicationNumber: string;
//   student: Student;
//   country?: string;
//   course?: Course;
//   intake?: string;
//   paymentStatus: PaymentStatus;
//   primaryStatus: ApplicationStatus;
//   isWithdrawn: boolean;
//   userNotes?: string;
//   documents: AppDocument[];
//   backups: BackupCourse[];
//   rejectionReason: RejectionReason[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// // ── Status config ─────────────────────────────────────────────────────────────

// const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
//   Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
//   Started: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
//   ReviewbyOoshas: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
//   SubmitToSchool: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400" },
//   AwaitingSchoolResponse: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
//   AdmissionProcessing: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-400" },
//   Refused: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
//   Withdrawn: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" },
//   PreArrival: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
//   Arrived: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400" },
//   Completed: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-400" },
//   inreview: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
//   Approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
//   Rejected: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
// };

// const INTAKE_OPTIONS = [
//   "January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025",
//   "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025",
//   "January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026",
// ];

// // ── Reusable UI ───────────────────────────────────────────────────────────────

// function StatusPill({ status }: { status: string }) {
//   const cfg = STATUS_CONFIG[status] ?? { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {status}
//     </span>
//   );
// }

// function PaymentBadge({ status }: { status: PaymentStatus }) {
//   const map: Record<PaymentStatus, string> = {
//     Pending: "bg-amber-50 text-amber-700",
//     Completed: "bg-emerald-50 text-emerald-700",
//     Failed: "bg-rose-50 text-rose-700",
//   };
//   return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>{status}</span>;
// }

// function InfoCard({ label, value, accent = false }: { label: string; value: React.ReactNode; accent?: boolean }) {
//   return (
//     <div className={`rounded-xl border p-3 ${accent ? "border-violet-100 bg-violet-50/60" : "border-slate-100 bg-slate-50/60"}`}>
//       <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
//       <div className={`text-sm font-semibold ${accent ? "text-violet-700" : "text-slate-700"}`}>{value}</div>
//     </div>
//   );
// }

// // ── Document Requirement Form ─────────────────────────────────────────────────

// function DocumentRequirementForm({
//   onAdd,
//   onCancel,
// }: {
//   onAdd: (doc: Partial<AppDocument>) => void;
//   onCancel: () => void;
// }) {
//   const [form, setForm] = useState<Partial<AppDocument>>({
//     type: "user",
//     name: "",
//     description: "",
//     required: "optional",
//     docUrl: "",
//     docType: "document",
//     extra: [{ label: "", type: "text", required: false, validation: "" }],
//   });
//   const [uploading, setUploading] = useState(false);

//   const handleFieldChange = (idx: number, key: string, val: string | boolean) => {
//     const arr = Array.isArray(form.extra) ? [...(form.extra as DocumentExtraField[])] : [];
//     arr[idx] = { ...arr[idx], [key]: val };
//     setForm((p) => ({ ...p, extra: arr }));
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
//     setUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append("document", file);
//       const res = await axiosInstance.post("/uploads/documents", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (res.data.success) setForm((p) => ({ ...p, docUrl: res.data.data.url }));
//     } catch { alert("Upload failed"); }
//     finally { setUploading(false); }
//   };

//   const handleSubmit = () => {
//     if (!form.name) { alert("Please enter document name"); return; }
//     const payload = { ...form };
//     if (payload.type === "ooshas" && payload.docType === "form")
//       payload.extra = JSON.stringify(payload.extra);
//     onAdd(payload);
//   };

//   return (
//     <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
//       <h4 className="font-semibold text-slate-800 mb-3 text-sm">Create Document Requirement</h4>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
//         <div>
//           <label className="block text-xs font-medium text-slate-600 mb-1">Document Type *</label>
//           <select
//             value={form.docType}
//             onChange={(e) => setForm((p) => ({ ...p, docType: e.target.value as AppDocument["docType"] }))}
//             className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
//           >
//             <option value="document">Document (PDF / DOC)</option>
//             <option value="form">Question Form</option>
//             <option value="picture">Picture</option>
//             <option value="other">Other</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs font-medium text-slate-600 mb-1">Required Status *</label>
//           <select
//             value={form.required}
//             onChange={(e) => setForm((p) => ({ ...p, required: e.target.value as "required" | "optional" }))}
//             className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
//           >
//             <option value="required">Required</option>
//             <option value="optional">Optional</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs font-medium text-slate-600 mb-1">Document Name *</label>
//           <input
//             type="text"
//             value={form.name}
//             onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
//             placeholder="e.g., Passport Copy"
//             className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
//           />
//         </div>
//       </div>
//       <div className="mb-3">
//         <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
//         <textarea
//           rows={2}
//           value={form.description}
//           onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
//           placeholder="Additional instructions…"
//           className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
//         />
//       </div>
//       {form.type === "ooshas" && form.docType !== "form" && (
//         <div className="mb-3">
//           <label className="block text-xs font-medium text-slate-600 mb-1">Upload Document *</label>
//           <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} disabled={uploading} className="w-full text-sm" />
//           {uploading && <RefreshCw size={14} className="animate-spin mt-2 text-slate-400" />}
//           {form.docUrl && <p className="mt-1 text-xs text-emerald-600">✓ Uploaded</p>}
//         </div>
//       )}
//       {form.docType === "form" && (
//         <div className="mb-3">
//           <label className="block text-xs font-medium text-slate-600 mb-2">Form Fields *</label>
//           {(Array.isArray(form.extra) ? form.extra : []).map((field, i) => (
//             <div key={i} className="grid grid-cols-4 gap-2 mb-2 bg-white p-2 rounded-lg border border-slate-200">
//               <input type="text" placeholder="Label" value={field.label}
//                 onChange={(e) => handleFieldChange(i, "label", e.target.value)}
//                 className="px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none" />
//               <select value={field.type} onChange={(e) => handleFieldChange(i, "type", e.target.value)}
//                 className="px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none">
//                 <option value="text">Text</option>
//                 <option value="email">Email</option>
//                 <option value="number">Number</option>
//                 <option value="date">Date</option>
//               </select>
//               <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
//                 <input type="checkbox" checked={field.required}
//                   onChange={(e) => handleFieldChange(i, "required", e.target.checked)} />
//                 Required
//               </label>
//               <button onClick={() => {
//                 const arr = (form.extra as DocumentExtraField[]).filter((_, j) => j !== i);
//                 setForm((p) => ({ ...p, extra: arr }));
//               }} className="text-rose-400 hover:text-rose-600 flex justify-center items-center">
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           ))}
//           <button onClick={() => setForm((p) => ({
//             ...p,
//             extra: [...(Array.isArray(p.extra) ? p.extra : []), { label: "", type: "text", required: false, validation: "" }],
//           }))} className="text-xs text-violet-600 hover:text-violet-800 font-medium">
//             + Add Field
//           </button>
//         </div>
//       )}
//       <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
//         <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm">
//           Cancel
//         </button>
//         <button onClick={handleSubmit} className="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 text-sm font-medium">
//           Add Requirement
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── Document Upload Modal ─────────────────────────────────────────────────────

// function DocumentUploadModal({
//   visible,
//   onClose,
//   onUpload,
//   onUpdateDocument,
//   uploading,
//   existingDocs = [],
//   initialDocId,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   onUpload: (
//     file: File | null,
//     docType: string,
//     docName: string,
//     docId?: string,
//     answers?: any,
//     docCategory?: string,
//   ) => Promise<void>;
//   onUpdateDocument: (docId: string, updates: Partial<AppDocument>, file?: File | null) => Promise<void>;
//   uploading: boolean;
//   existingDocs?: AppDocument[];
//   initialDocId?: string;
// }) {
//   const [selectedDocId, setSelectedDocId] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState<"user" | "ooshas">("user");
//   const [docRequired, setDocRequired] = useState<"required" | "optional">("optional");
//   const [docDescription, setDocDescription] = useState("");
//   const [docCategory, setDocCategory] = useState<AppDocument["docType"]>("document");
//   const [extraFields, setExtraFields] = useState<DocumentExtraField[]>([]);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [err, setErr] = useState("");
//   const [isEditing, setIsEditing] = useState(false);

//   // Pre-select document when initialDocId is provided
//   useEffect(() => {
//     if (initialDocId && visible) {
//       handleDocSelect(initialDocId);
//     }
//   }, [initialDocId, visible]);

//   // Reset when modal closes
//   useEffect(() => {
//     if (!visible) {
//       setFile(null);
//       setDocName("");
//       setDocType("user");
//       setDocRequired("optional");
//       setDocDescription("");
//       setSelectedDocId("");
//       setAnswers({});
//       setExtraFields([]);
//       setErr("");
//       setIsEditing(false);
//       setDocCategory("document");
//     }
//   }, [visible]);

//   const handleDocSelect = (id: string) => {
//     setSelectedDocId(id);
//     if (id === "") {
//       setDocName("");
//       setDocType("user");
//       setDocRequired("optional");
//       setDocDescription("");
//       setDocCategory("document");
//       setExtraFields([]);
//       setAnswers({});
//       setIsEditing(false);
//     } else {
//       const doc = existingDocs.find((d) => d._id === id);
//       if (doc) {
//         setDocName(doc.name);
//         setDocType(doc.type);
//         setDocRequired(doc.required);
//         setDocDescription(doc.description || "");
//         setDocCategory(doc.docType);
//         setIsEditing(true);

//         let extra: DocumentExtraField[] = [];
//         if (typeof doc.extra === "string") {
//           try { extra = JSON.parse(doc.extra); } catch { extra = []; }
//         } else if (Array.isArray(doc.extra)) {
//           extra = doc.extra;
//         }
//         setExtraFields(extra);

//         const initialAnswers: Record<string, string> = {};
//         if (doc.answer) {
//           try {
//             const parsed = JSON.parse(doc.answer);
//             Object.assign(initialAnswers, parsed);
//           } catch { /* ignore */ }
//         }
//         setAnswers(initialAnswers);
//       }
//     }
//   };

//   const handleFieldChange = (idx: number, key: string, val: string | boolean) => {
//     const arr = [...extraFields];
//     arr[idx] = { ...arr[idx], [key]: val };
//     setExtraFields(arr);
//   };

//   const handleAddField = () => {
//     setExtraFields([...extraFields, { label: "", type: "text", required: false, validation: "" }]);
//   };

//   const handleRemoveField = (idx: number) => {
//     setExtraFields(extraFields.filter((_, i) => i !== idx));
//   };

//   const handleSubmit = async () => {
//     if (!docName) { setErr("Please enter document name"); return; }

//     // Validate required form fields
//     if (docCategory === "form") {
//       for (const field of extraFields) {
//         if (field.required && !answers[field.label]) {
//           setErr(`${field.label} is required`);
//           return;
//         }
//       }
//     }

//     if (isEditing && selectedDocId) {
//       // Update existing document metadata
//       const updates: Partial<AppDocument> = {
//         name: docName,
//         type: docType,
//         required: docRequired,
//         description: docDescription,
//         docType: docCategory,
//       };

//       if (docCategory === "form") {
//         updates.extra = JSON.stringify(extraFields);
//         if (Object.keys(answers).length > 0) {
//           updates.answer = JSON.stringify(answers);
//         }
//       }

//       await onUpdateDocument(selectedDocId, updates, file);
//     } else {
//       // Upload file to an existing document slot
//       if (!selectedDocId) {
//         setErr("Please select a document to upload to.");
//         return;
//       }
//       await onUpload(
//         file,
//         docType,
//         docName,
//         selectedDocId,
//         docCategory === "form" ? answers : undefined,
//         docCategory,
//       );
//     }
//   };

//   if (!visible) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
//       onClick={onClose}
//     >
//       <div
//         className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
//           <h3 className="font-semibold text-slate-800">
//             {isEditing ? "Edit Document" : "Upload Document"}
//           </h3>
//           <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
//         </div>

//         <div className="p-5 space-y-4">
//           {err && (
//             <div className="p-2 rounded-lg bg-rose-50 text-rose-600 text-sm flex items-center gap-2">
//               <AlertCircle size={14} />{err}
//             </div>
//           )}

//           {/* Select existing document */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Select Document *
//             </label>
//             <select
//               value={selectedDocId}
//               onChange={(e) => handleDocSelect(e.target.value)}
//               className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
//             >
//               <option value="">-- Select a document --</option>
//               {existingDocs.map((doc) => (
//                 <option key={doc._id} value={doc._id}>
//                   {doc.name} ({doc.type}) — {doc.status}
//                 </option>
//               ))}
//             </select>
//             {isEditing && (
//               <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
//                 <Edit size={12} /> Editing selected document metadata
//               </p>
//             )}
//           </div>

//           {/* Document Name */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Document Name *</label>
//             <input
//               type="text"
//               value={docName}
//               onChange={(e) => setDocName(e.target.value)}
//               placeholder="e.g., Passport Copy"
//               className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
//             />
//           </div>

//           {/* Type and Category */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">Document Category</label>
//               <select
//                 value={docCategory}
//                 onChange={(e) => setDocCategory(e.target.value as AppDocument["docType"])}
//                 className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
//               >
//                 <option value="document">Document</option>
//                 <option value="form">Question Form</option>
//                 <option value="picture">Picture</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">Response By</label>
//               <select
//                 value={docType}
//                 onChange={(e) => setDocType(e.target.value as "user" | "ooshas")}
//                 className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
//               >
//                 <option value="user">Student</option>
//                 <option value="ooshas">Ooshas</option>
//               </select>
//             </div>
//           </div>

//           {/* Required Status */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Required Status</label>
//             <select
//               value={docRequired}
//               onChange={(e) => setDocRequired(e.target.value as "required" | "optional")}
//               className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
//             >
//               <option value="required">Required</option>
//               <option value="optional">Optional</option>
//             </select>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
//             <textarea
//               rows={2}
//               value={docDescription}
//               onChange={(e) => setDocDescription(e.target.value)}
//               placeholder="Additional instructions or notes about this document..."
//               className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
//             />
//           </div>

//           {/* Form Fields editor */}
//           {docCategory === "form" && (
//             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
//               <div className="flex items-center justify-between">
//                 <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Form Fields</h4>
//                 <button
//                   type="button"
//                   onClick={handleAddField}
//                   className="text-xs text-violet-600 hover:text-violet-800 font-medium flex items-center gap-1"
//                 >
//                   <Plus size={12} /> Add Field
//                 </button>
//               </div>

//               {extraFields.map((field, i) => (
//                 <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
//                   <div className="grid grid-cols-3 gap-2">
//                     <input
//                       type="text"
//                       placeholder="Label"
//                       value={field.label}
//                       onChange={(e) => handleFieldChange(i, "label", e.target.value)}
//                       className="px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
//                     />
//                     <select
//                       value={field.type}
//                       onChange={(e) => handleFieldChange(i, "type", e.target.value)}
//                       className="px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
//                     >
//                       <option value="text">Text</option>
//                       <option value="email">Email</option>
//                       <option value="number">Number</option>
//                       <option value="date">Date</option>
//                     </select>
//                     <div className="flex items-center justify-between gap-2">
//                       <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={field.required}
//                           onChange={(e) => handleFieldChange(i, "required", e.target.checked)}
//                         />
//                         Required
//                       </label>
//                       <button onClick={() => handleRemoveField(i)} className="text-rose-400 hover:text-rose-600">
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Answer input when editing an existing form doc */}
//                   {isEditing && field.label && (
//                     <div className="mt-2 pt-2 border-t border-slate-100">
//                       <label className="block text-xs font-medium text-slate-500 mb-1">Current Answer</label>
//                       <input
//                         type={field.type}
//                         value={answers[field.label] || ""}
//                         onChange={(e) => setAnswers((prev) => ({ ...prev, [field.label]: e.target.value }))}
//                         className="w-full px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
//                         placeholder={`Answer for ${field.label}`}
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {extraFields.length === 0 && (
//                 <p className="text-xs text-slate-400 text-center py-2">No form fields defined. Add fields above.</p>
//               )}
//             </div>
//           )}

//           {/* File upload — only shown when category is not form */}
//           {docCategory !== "form" && (
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 {isEditing ? "Update File (Optional)" : "File *"}
//               </label>
//               <input
//                 type="file"
//                 accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                 onChange={(e) => {
//                   const f = e.target.files?.[0];
//                   if (f && f.size > 5 * 1024 * 1024) { setErr("Max 5MB"); return; }
//                   if (f) { setFile(f); setErr(""); }
//                 }}
//                 className="w-full text-sm border border-slate-200 rounded-lg p-2"
//               />
//               <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DOC — max 5MB</p>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={uploading}
//             className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60"
//           >
//             {uploading
//               ? <RefreshCw size={15} className="animate-spin" />
//               : isEditing
//                 ? <Save size={15} />
//                 : <Upload size={15} />
//             }
//             {isEditing ? "Save Changes" : "Upload"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// const STATUS_OPTIONS: ApplicationStatus[] = [
//   "Pending", "Started", "ReviewbyOoshas", "SubmitToSchool", "AwaitingSchoolResponse",
//   "AdmissionProcessing", "Refused", "Withdrawn", "PreArrival", "Arrived", "Completed",
// ];


// export default function ApplicationDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.id as string;

//   const [application, setApplication] = useState<Application | null>(null);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [activeTab, setActiveTab] = useState("documents");
//   const [showDocUpload, setShowDocUpload] = useState(false);
//   const [showRequirementForm, setShowRequirementForm] = useState(false);
//   const [uploadingDoc, setUploadingDoc] = useState(false);
//   const [editingDocId, setEditingDocId] = useState<string | undefined>(undefined);
//   const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
//   const [studentData, setStudentData] = useState<any | null>(null);

//   const [formData, setFormData] = useState({
//     primaryStatus: "Pending" as ApplicationStatus,
//     documents: [] as AppDocument[],
//     backups: [] as BackupCourse[],
//     rejectionReason: [] as RejectionReason[],
//   });

//   const [courseOptions, setCourseOptions] = useState<{ label: string; value: string }[]>([]);

//   const fetchApplication = useCallback(async () => {
//     if (!id) return;
//     setPageLoading(true);
//     try {
//       const res = await axiosInstance.get(`/applications/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       const app: Application = res.data.data || res.data;
//       setApplication(app);
//       setFormData({
//         primaryStatus: app.primaryStatus || "Pending",
//         documents: app.documents || [],
//         backups: app.backups || [],
//         rejectionReason: app.rejectionReason || [],
//       });

//       if (app.student) {
//         fetchStudentData(typeof app.student === 'string' ? app.student : app.student._id);
//       }

//     } catch (err) {
//       console.error(err);
//       setError("Failed to load application");
//     } finally {
//       setPageLoading(false);
//     }
//   }, [id]);


//   const fetchStudentData = async (studentId: string) => {
//     try {
//       const res = await axiosInstance.get(`/users/${studentId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setStudentData(res.data.data || res.data);
//     } catch (err) {
//       console.error("Failed to fetch student data:", err);
//     }
//   };


//   const fetchActivities = async () => {
//     try {
//       const response = await axiosInstance.get(`/communication/applications/${id}/activities?limit=100`);
//       const activities = response.data?.data || [];
//       const formattedActivities = activities.map((activity: any) => ({
//         ...activity,
//         id: activity._id,
//         user: activity.user?.name || "System",
//         timestamp: activity.createdAt,
//       }));
//       setActivityLogs(formattedActivities);
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//     }
//   };

//   useEffect(() => {
//     fetchApplication();
//     fetchActivities();
//   }, [fetchApplication]);


//   useEffect(() => {
//     const fetchCourses = async () => {
//       const code = application?.course?.university?.code;
//       if (!code) return;
//       try {
//         const response = await axiosInstance.get(`/courses?code=${code}`);
//         const data = response.data?.data || response.data || [];
//         if (Array.isArray(data)) {
//           setCourseOptions(data.map((c: any) => ({ label: c.name, value: c._id })));
//         }
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         setCourseOptions([]);
//       }
//     };
//     fetchCourses();
//   }, [application?.course?.university?.code]);


//   const handleSave = async () => {
//     setSaving(true);
//     setError("");
//     try {
//       const res = await axiosInstance.put(
//         `/applications/${id}`,
//         {
//           primaryStatus: formData.primaryStatus,
//           rejectionReason: formData.rejectionReason,
//           backups: formData.backups,
//           documents: formData.documents,
//         },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
//       );
//       if (res.data.success) {
//         setSuccess("Saved successfully!");
//         setTimeout(() => setSuccess(""), 1500);
//       }
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to save");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDocUpload = async (
//     file: File | null,
//     docType: string,
//     docName: string,
//     docId?: string,
//     answers?: any,
//     docCategory?: string,
//   ) => {
//     if (!docId) {
//       setError("No document selected to upload to.");
//       return;
//     }

//     setUploadingDoc(true);
//     try {
//       const fd = new FormData();
//       if (file) fd.append("file", file);
//       // Backend checks req.body.docType to decide whether to set docUrl
//       fd.append("docType", docCategory ?? "document");
//       fd.append("name", docName);
//       if (answers) fd.append("answer", JSON.stringify(answers));

//       const res = await axiosInstance.put(
//         `/applications/documents/${id}/${docId}`,
//         fd,
//         { headers: { "Content-Type": "multipart/form-data" } },
//       );

//       if (res.data.success) {
//         const docs = [...formData.documents];
//         const idx = docs.findIndex((d) => d._id === docId);
//         if (idx !== -1) {
//           docs[idx] = { ...docs[idx], ...res.data.data };
//           setFormData((p) => ({ ...p, documents: docs }));
//         }
//         setSuccess("Document uploaded successfully");
//         setShowDocUpload(false);
//       }
//     } catch {
//       setError("Upload failed");
//     } finally {
//       setUploadingDoc(false);
//     }
//   };


//   const handleUpdateDocument = async (docId: string, updates: Partial<AppDocument>, file?: File | null) => {
//     setUploadingDoc(true);
//     try {
//       let res;
//       if (file) {
//         const fd = new FormData();
//         fd.append("file", file);
//         Object.entries(updates).forEach(([key, val]) => {
//           if (val !== undefined && val !== null) {
//             fd.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
//           }
//         });

//         res = await axiosInstance.put(
//           `/applications/documents/${id}/${docId}`,
//           fd,
//           { headers: { "Content-Type": "multipart/form-data" } },
//         );
//       } else {
//         res = await axiosInstance.put(
//           `/applications/documents/${id}/${docId}`,
//           updates
//         );
//       }

//       if (res.data.success) {
//         const docs = [...formData.documents];
//         const idx = docs.findIndex((d) => d._id === docId);
//         if (idx !== -1) {
//           docs[idx] = { ...docs[idx], ...res.data.data };
//           setFormData((p) => ({ ...p, documents: docs }));
//         }
//         setSuccess("Document updated successfully");
//         setShowDocUpload(false);
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to update document");
//       console.error(err);
//     } finally {
//       setUploadingDoc(false);
//     }
//   };

//   const handleAddRequirement = async (newDoc: Partial<AppDocument>) => {
//     try {
//       const allDocs = [...formData.documents, newDoc as AppDocument];
//       const res = await axiosInstance.put(
//         `/applications/${id}`,
//         { documents: allDocs },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
//       );
//       if (res.data.success) {
//         setFormData((p) => ({ ...p, documents: allDocs }));
//         setSuccess("Requirement added");
//         setShowRequirementForm(false);
//       }
//     } catch {
//       setError("Failed to add requirement");
//     }
//   };

//   const handleUpdateDocStatus = async (
//     idx: number,
//     status: AppDocument["status"],
//     rejectReason?: string,
//   ) => {
//     try {
//       const docs = [...formData.documents];
//       docs[idx] = { ...docs[idx], status, rejectReason };
//       const res = await axiosInstance.put(
//         `/applications/${id}`,
//         { documents: docs },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
//       );
//       if (res.data.success) {
//         setFormData((p) => ({ ...p, documents: docs }));
//         setSuccess("Status updated");
//       }
//     } catch {
//       setError("Failed to update status");
//     }
//   };

//   const addBackup = () => {
//     setFormData((prev) => ({
//       ...prev,
//       backups: [...prev.backups, { course: "", intake: "", order: prev.backups.length + 1 }],
//     }));
//   };

//   const updateBackup = (idx: number, field: keyof BackupCourse, value: string | number) => {
//     setFormData((prev) => ({
//       ...prev,
//       backups: prev.backups.map((b, i) => (i === idx ? { ...b, [field]: value } : b)),
//     }));
//   };

//   const removeBackup = (idx: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       backups: prev.backups.filter((_, i) => i !== idx),
//     }));
//   };


//   const addRejection = () => {
//     setFormData((prev) => ({
//       ...prev,
//       rejectionReason: [...prev.rejectionReason, { course: "", reason: "" }],
//     }));
//   };

//   const updateRejection = (idx: number, field: keyof RejectionReason, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       rejectionReason: prev.rejectionReason.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
//     }));
//   };

//   const removeRejection = (idx: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       rejectionReason: prev.rejectionReason.filter((_, i) => i !== idx),
//     }));
//   };


//   const formatDate = (d?: string) =>
//     d
//       ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
//       : "—";

//   const sectionCls = "bg-white rounded-2xl border border-slate-200 shadow-sm p-5";
//   const labelCls = "block text-xs font-medium text-slate-500 mb-1";
//   const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400";


//   if (pageLoading) {
//     return (
//       <div className="h-auto overflow-auto bg-slate-50 flex items-center justify-center min-h-[400px]">
//         <div className="flex flex-col items-center gap-3">
//           <RefreshCw size={28} className="animate-spin text-violet-500" />
//           <p className="text-sm text-slate-400">Loading application…</p>
//         </div>
//       </div>
//     );
//   }

//   if (!application) {
//     return (
//       <div className="h-auto overflow-auto bg-slate-50 flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <p className="text-slate-600 font-medium mb-2">Application not found</p>
//           <button
//             onClick={() => router.back()}
//             className="text-sm text-violet-600 hover:underline flex items-center gap-1 mx-auto"
//           >
//             <ChevronLeft size={14} /> Go back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     // { id: "info", label: "Course", icon: User },
//     { id: "documents", label: "Documents", icon: FileText },
//     { id: "backups", label: "Backups & Rejections", icon: BookOpen },
//     { id: "message", label: "Messages", icon: MessageCircle },
//     { id: "activity", label: "Activity", icon: Activity },
//   ];


//   return (
//     <div className="h-auto overflow-auto bg-slate-50 pb-8">
//       {/* Top bar */}
//       <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
//         <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition font-medium"
//           >
//             <ChevronLeft size={16} /> Back
//           </button>
//           <div className="h-4 w-px bg-slate-200" />
//           <div className="flex items-center gap-2 flex-1 min-w-0">
//             <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md shrink-0">
//               {application.applicationNumber}
//             </span>
//             <span className="text-sm font-semibold text-slate-800 truncate capitalize">
//               {application.student?.name}
//             </span>
//             <StatusPill status={application.primaryStatus} />
//           </div>
//           <div className="flex items-center gap-2 shrink-0">
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition disabled:opacity-60"
//             >
//               {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6 space-y-5 flex gap-2">
//         {/* Alerts */}
//         {error && (
//           <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
//             <AlertCircle size={16} /> {error}
//             <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
//           </div>
//         )}
//         {success && (
//           <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
//             <CheckCircle size={16} /> {success}
//           </div>
//         )}

//         {/* Application Settings */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//           <h2 className="text-sm font-semibold text-slate-700 mb-4">Application Settings</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-500 mb-1.5">Application Status</label>
//               <select
//                 value={formData.primaryStatus}
//                 onChange={(e) =>
//                   setFormData((p) => ({ ...p, primaryStatus: e.target.value as ApplicationStatus }))
//                 }
//                 className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
//               >
//                 {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* {activeTab === "info" && ( */}
//           <div>
//             <h3 className="text-sm font-semibold text-slate-700 mb-3">Student Info</h3>
//             <div className="grid grid-cols-2  gap-3">
//               <InfoCard label="Name" value={studentData?.name || "N/A"} />
//               <InfoCard label="Email" value={studentData?.email || "N/A"} />
//               <InfoCard label="Phone" value={studentData?.phone || "N/A"} />
//               {studentData?.passportNumber && (
//                 <InfoCard label="Passport No." value={studentData.passportNumber} />
//               )}
//               {studentData?.nationality && (
//                 <InfoCard label="Nationality" value={studentData.nationality} />
//               )}
//             </div>
//             <div className="mt-4 pt-4 border-t border-slate-100">
//               <h3 className="text-sm font-semibold text-slate-700 mb-4">Course Information</h3>
//               <div className="grid grid-cols-2  gap-3">
//                 <InfoCard label="Country" value={application.country || "N/A"} />
//                 <InfoCard label="University" value={application.course?.university?.name || "N/A"} />
//                 <InfoCard label="Course" value={application.course?.name || "N/A"} />
//                 <InfoCard label="Intake" value={application.intake || "N/A"} />
//                 <InfoCard label="Payment" value={<PaymentBadge status={application.paymentStatus} />} />
//                 <InfoCard label="Created" value={formatDate(application.createdAt)} />
//               </div>
//             </div>
//           </div>
//           {/* )} */}

//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="flex gap-0 border-b border-slate-200 px-5 pt-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px mr-1 rounded-t-lg ${activeTab === tab.id
//                   ? "border-violet-600 text-violet-700 bg-violet-50/60"
//                   : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
//                   }`}
//               >
//                 <tab.icon size={15} />
//                 {tab.label}
//                 {tab.id === "documents" && formData.documents.length > 0 && (
//                   <span className="ml-0.5 text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-semibold">
//                     {formData.documents.length}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           <div className="p-5">


//             {/* ── DOCUMENTS TAB ── */}
//             {activeTab === "documents" && (
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-semibold text-slate-700">Documents</h3>
//                   <div className="flex gap-2">
//                     {/* <button
//                       onClick={() => {
//                         setEditingDocId(undefined);
//                         setShowDocUpload(true);
//                       }}
//                       className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition"
//                     >
//                       <Upload size={13} /> Upload / Edit
//                     </button> */}
//                     <button
//                       onClick={() => setShowRequirementForm(!showRequirementForm)}
//                       className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
//                     >
//                       <Plus size={13} /> Create Requirement
//                     </button>
//                   </div>
//                 </div>

//                 {showRequirementForm && (
//                   <DocumentRequirementForm
//                     onAdd={handleAddRequirement}
//                     onCancel={() => setShowRequirementForm(false)}
//                   />
//                 )}

//                 {formData.documents.length === 0 ? (
//                   <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
//                     <FileText size={24} className="mx-auto mb-2 text-slate-300" />
//                     <p className="text-sm">No documents yet</p>
//                     <p className="text-xs mt-1">Click "Create Requirement" to add required documents</p>
//                   </div>
//                 ) : (
//                   <div className="rounded-xl border border-slate-200 overflow-hidden">
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-50 border-b border-slate-200">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">By</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Required</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Reject Reason</th>
//                           <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-50">
//                         {formData.documents.map((doc, idx) => (
//                           <tr key={doc._id ?? idx} className="hover:bg-slate-50/60 transition-colors">
//                             <td className="px-4 py-3 font-medium text-slate-800">
//                               <div className="flex items-center gap-1.5">
//                                 {doc.name}
//                                 {doc.docUrl && doc.docType !== "form" && (
//                                   <a
//                                     href={`http://localhost:5000${doc.docUrl}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-slate-400 hover:text-violet-600 transition"
//                                   >
//                                     <ExternalLink size={12} />
//                                   </a>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-4 py-3">
//                               <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doc.type === "ooshas"
//                                 ? "bg-purple-50 text-purple-700"
//                                 : "bg-slate-100 text-slate-700"
//                                 }`}>
//                                 {doc.type === "ooshas" ? "Ooshas" : "User"}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3">
//                               <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doc.required === "required"
//                                 ? "bg-rose-50 text-rose-700"
//                                 : "bg-slate-100 text-slate-600"
//                                 }`}>
//                                 {doc.required}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3">
//                               <StatusPill status={doc.status} />
//                             </td>
//                             <td className="px-4 py-3 text-rose-600 text-xs max-w-[130px] truncate">
//                               {doc.rejectReason || "—"}
//                             </td>
//                             <td className="px-4 py-3">
//                               <div className="flex items-center justify-center gap-2">
//                                 {/* Edit button — pre-selects this doc in the modal */}
//                                 <button
//                                   onClick={() => {
//                                     setEditingDocId(doc._id);
//                                     setShowDocUpload(true);
//                                   }}
//                                   className="p-1 rounded-lg text-blue-500 hover:bg-blue-50 transition"
//                                   title="Edit document"
//                                 >
//                                   <Edit size={14} />
//                                 </button>
//                                 {/* Inline status changer */}
//                                 <select
//                                   value={doc.status}
//                                   onChange={(e) => {
//                                     const s = e.target.value as AppDocument["status"];
//                                     if (s === "Rejected") {
//                                       const r = prompt("Rejection reason:");
//                                       if (r) handleUpdateDocStatus(idx, s, r);
//                                     } else {
//                                       handleUpdateDocStatus(idx, s);
//                                     }
//                                   }}
//                                   className="px-2 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none"
//                                 >
//                                   <option value="Pending">Pending</option>
//                                   <option value="inreview">In Review</option>
//                                   <option value="Approved">Approved</option>
//                                   <option value="Rejected">Rejected</option>
//                                 </select>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── BACKUPS & REJECTIONS TAB ── */}
//             {activeTab === "backups" && (
//               <div className="space-y-6">
//                 {/* Rejection Reasons */}
//                 <div className={sectionCls}>
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
//                       <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">1</span>
//                       Rejection Reasons
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={addRejection}
//                       className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition border border-rose-200"
//                     >
//                       <Plus size={14} /> Add Reason
//                     </button>
//                   </div>
//                   {formData.rejectionReason.length === 0 ? (
//                     <p className="text-xs text-slate-400 text-center py-4">
//                       No rejection reasons added. Click "Add Reason" to add one.
//                     </p>
//                   ) : (
//                     <div className="space-y-3">
//                       {formData.rejectionReason.map((rr, idx) => (
//                         <div
//                           key={idx}
//                           className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative"
//                         >
//                           <button
//                             type="button"
//                             onClick={() => removeRejection(idx)}
//                             className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition"
//                           >
//                             <X size={14} />
//                           </button>
//                           <div>
//                             <label className={labelCls}>Course</label>
//                             <select
//                               className={inputCls}
//                               value={rr.course}
//                               onChange={(e) => updateRejection(idx, "course", e.target.value)}
//                             >
//                               <option value="">Select course</option>
//                               {courseOptions.map((opt) => (
//                                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//                               ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className={labelCls}>Reason</label>
//                             <input
//                               type="text"
//                               className={inputCls}
//                               placeholder="e.g. Insufficient documents"
//                               value={rr.reason}
//                               onChange={(e) => updateRejection(idx, "reason", e.target.value)}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Backup Courses */}
//                 <div className={sectionCls}>
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
//                       <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
//                       Backup Courses
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={addBackup}
//                       className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition border border-blue-200"
//                     >
//                       <Plus size={14} /> Add Backup
//                     </button>
//                   </div>
//                   {formData.backups.length === 0 ? (
//                     <p className="text-xs text-slate-400 text-center py-4">
//                       No backup courses added. Click "Add Backup" to add one.
//                     </p>
//                   ) : (
//                     <div className="space-y-3">
//                       {formData.backups.map((bk, idx) => (
//                         <div
//                           key={idx}
//                           className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative"
//                         >
//                           <button
//                             type="button"
//                             onClick={() => removeBackup(idx)}
//                             className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition"
//                           >
//                             <X size={14} />
//                           </button>
//                           <div>
//                             <label className={labelCls}>Course</label>
//                             <select
//                               className={inputCls}
//                               value={bk.course || ""}
//                               onChange={(e) => updateBackup(idx, "course", e.target.value)}
//                             >
//                               <option value="">Select course</option>
//                               {courseOptions.map((opt) => (
//                                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//                               ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className={labelCls}>Intake</label>
//                             <select
//                               className={inputCls}
//                               value={bk.intake}
//                               onChange={(e) => updateBackup(idx, "intake", e.target.value)}
//                             >
//                               <option value="">Select intake</option>
//                               {INTAKE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
//                             </select>
//                           </div>
//                           <div>
//                             <label className={labelCls}>Order</label>
//                             <input
//                               type="number"
//                               min={1}
//                               className={inputCls}
//                               value={bk.order}
//                               onChange={(e) => updateBackup(idx, "order", Number(e.target.value))}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ── MESSAGES TAB ── */}
//             {activeTab === "message" && (
//               <div>
//                 <h3 className="text-sm font-semibold text-slate-700 mb-4">Messages</h3>
//                 <MessagingTab applicationId={application._id} />
//               </div>
//             )}

//             {/* ── ACTIVITY TAB ── */}
//             {activeTab === "activity" && (
//               <div className="bg-white rounded-xl border border-gray-200 max-w-3xl mx-auto overflow-hidden">
//                 <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
//                   {activityLogs.length === 0 ? (
//                     <div className="text-center py-16">
//                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Activity className="w-6 h-6 text-gray-400" />
//                       </div>
//                       <p className="text-gray-500">No activity records found</p>
//                     </div>
//                   ) : (
//                     activityLogs.map((log) => (
//                       <div key={log._id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
//                         <div className="flex items-start gap-4">
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
//                               <div className="flex items-center gap-2 flex-wrap">
//                                 <h4 className="font-semibold text-gray-900">
//                                   {log.action.replace(/_/g, " ").toUpperCase()}
//                                 </h4>
//                                 {log.status && <StatusPill status={log.status} />}
//                               </div>
//                               <span className="text-xs text-gray-500 whitespace-nowrap">
//                                 {formatDate(log.createdAt)}
//                               </span>
//                             </div>
//                             <p className="text-sm text-gray-600 mb-2">{log.description}</p>
//                             <div className="flex items-center gap-3 text-xs">
//                               <span className="text-gray-500 flex uppercase items-center gap-1">
//                                 By: {typeof log.user === "object" ? log.user.name : log.user || "System"}
//                               </span>
//                               {log.callDuration && (
//                                 <>
//                                   <span className="text-gray-300">•</span>
//                                   <span className="text-gray-500 flex items-center gap-1">
//                                     <Timer className="w-3 h-3" />
//                                     Duration: {log.callDuration}
//                                   </span>
//                                 </>
//                               )}
//                               {log.callType && (
//                                 <>
//                                   <span className="text-gray-300">•</span>
//                                   <span className={`flex items-center gap-1 ${log.callType === "missed"
//                                     ? "text-red-600"
//                                     : log.callType === "incoming"
//                                       ? "text-green-600"
//                                       : "text-blue-600"
//                                     }`}>
//                                     {log.callType === "missed"
//                                       ? "Missed Call"
//                                       : log.callType === "incoming"
//                                         ? "Incoming Call"
//                                         : "Outgoing Call"}
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Document Upload / Edit Modal */}
//       <DocumentUploadModal
//         visible={showDocUpload}
//         onClose={() => {
//           setShowDocUpload(false);
//           setEditingDocId(undefined);
//         }}
//         onUpload={handleDocUpload}
//         onUpdateDocument={handleUpdateDocument}
//         uploading={uploadingDoc}
//         existingDocs={formData.documents}
//         initialDocId={editingDocId}
//       />
//     </div>
//   );
// }


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

interface University { _id: string; name: string; code?: string; }
interface Course { _id: string; name: string; university?: University; }

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

interface BackupCourse { course: string; intake: string; order: number; }

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

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", border: "border-amber-200" },
  Started: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", border: "border-blue-200" },
  ReviewbyOoshas: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400", border: "border-purple-200" },
  SubmitToSchool: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400", border: "border-slate-200" },
  AwaitingSchoolResponse: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400", border: "border-indigo-200" },
  AdmissionProcessing: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-400", border: "border-cyan-200" },
  Refused: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400", border: "border-rose-200" },
  Withdrawn: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400", border: "border-gray-200" },
  PreArrival: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", border: "border-emerald-200" },
  Arrived: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400", border: "border-green-200" },
  Completed: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-400", border: "border-teal-200" },
  inreview: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", border: "border-blue-200" },
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", border: "border-emerald-200" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400", border: "border-rose-200" },
};

const INTAKE_OPTIONS = [
  "January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025",
  "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025",
  "January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026",
];

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Pending", "Started", "ReviewbyOoshas", "SubmitToSchool", "AwaitingSchoolResponse",
  "AdmissionProcessing", "Refused", "Withdrawn", "PreArrival", "Arrived", "Completed",
];

// ── Reusable UI ───────────────────────────────────────────────────────────────

function StatusPill({ status, size = "sm" }: { status: string; size?: "sm" | "md" | "lg" }) {
  const cfg = STATUS_CONFIG[status] ?? { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400", border: "border-slate-200" };
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
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
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>{status}</span>;
}

function InfoItem({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: any }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      {Icon && <Icon size={14} className="text-slate-400 mt-0.5 shrink-0" />}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">{label}</p>
        <div className="text-sm font-medium text-slate-700 truncate">{value}</div>
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
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-6 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <Plus size={16} className="text-violet-500" />
          Create Document Requirement
        </h4>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 transition">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
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
          {form.docUrl && <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1"><Check size={12} /> Uploaded</p>}
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

      <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
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
  onUpdateDocument: (docId: string, updates: Partial<AppDocument>, file?: File | null) => Promise<void>;
  uploading: boolean;
  existingDocs?: AppDocument[];
  initialDocId?: string;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
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
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {err && (
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 text-sm flex items-center gap-2">
              <AlertCircle size={14} />{err}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Name *</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Category</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value as AppDocument["docType"])}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="document">Document</option>
                <option value="form">Question Form</option>
                <option value="picture">Picture</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Response By</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as "user" | "ooshas")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="user">Student</option>
                <option value="ooshas">Ooshas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Required Status</label>
            <select
              value={docRequired}
              onChange={(e) => setDocRequired(e.target.value as "required" | "optional")}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
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
                      <button onClick={() => handleRemoveField(i)} className="text-rose-400 hover:text-rose-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {isEditing && field.label && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Current Answer</label>
                      <input
                        type={field.type}
                        value={answers[field.label] || ""}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [field.label]: e.target.value }))}
                        className="w-full px-2 py-1 text-sm rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                        placeholder={`Answer for ${field.label}`}
                      />
                    </div>
                  )}
                </div>
              ))}

              {extraFields.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">No form fields defined. Add fields above.</p>
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
                  if (f && f.size > 5 * 1024 * 1024) { setErr("Max 5MB"); return; }
                  if (f) { setFile(f); setErr(""); }
                }}
                className="w-full text-sm border border-slate-200 rounded-lg p-2"
              />
              <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DOC — max 5MB</p>
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
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60"
          >
            {uploading
              ? <RefreshCw size={15} className="animate-spin" />
              : isEditing
                ? <Save size={15} />
                : <Upload size={15} />
            }
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
  onUpdateStatus: (idx: number, status: AppDocument["status"], rejectReason?: string) => void;
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
          onChange={(e) => handleStatusChange(e.target.value as AppDocument["status"])}
          className={`px-2 py-1 text-xs rounded-lg border focus:outline-none transition-colors ${localStatus === "Approved" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
            localStatus === "Rejected" ? "border-rose-200 bg-rose-50 text-rose-700" :
              localStatus === "inreview" ? "border-blue-200 bg-blue-50 text-blue-700" :
                "border-slate-200 bg-white text-slate-700"
            }`}
        >
          <option value="Pending">Pending</option>
          <option value="inreview">In Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={() => doc._id && onEdit(doc._id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
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
      {!isLast && <div className="absolute left-[9px] top-6 bottom-0 w-px bg-slate-200" />}

      <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${cfg.bg} ${cfg.border}`}>
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
              day: "2-digit", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit"
            })}
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-3">{log.description}</p>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User size={12} />
            {typeof log.user === "object" ? log.user.name : log.user || "System"}
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
              <span className={`flex items-center gap-1 font-medium ${log.callType === "missed" ? "text-rose-600" :
                log.callType === "incoming" ? "text-emerald-600" : "text-blue-600"
                }`}>
                {log.callType === "missed" ? "Missed Call" : log.callType === "incoming" ? "Incoming Call" : "Outgoing Call"}
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
  const approvedDocs = docs.filter(d => d.status === "Approved").length;
  const pendingDocs = docs.filter(d => d.status === "Pending").length;
  const rejectedDocs = docs.filter(d => d.status === "Rejected").length;

  const stats = [
    { label: "Documents", value: totalDocs, sub: `${approvedDocs} approved`, color: "text-violet-600" },
    { label: "Pending", value: pendingDocs, color: "text-amber-600" },
    { label: "Rejected", value: rejectedDocs, color: "text-rose-600" },
    { label: "Backups", value: app.backups.length, color: "text-blue-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3">
          <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-xs text-slate-500 leading-tight">
            <div className="font-medium text-slate-700">{stat.label}</div>
            {stat.sub && <div>{stat.sub}</div>}
          </div>
        </div>
      ))}
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
  const [activeTab, setActiveTab] = useState("documents");
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | undefined>(undefined);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    primaryStatus: "Pending" as ApplicationStatus,
    documents: [] as AppDocument[],
    backups: [] as BackupCourse[],
    rejectionReason: [] as RejectionReason[],
  });

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
        documents: app.documents || [],
        backups: app.backups || [],
        rejectionReason: app.rejectionReason || [],
      });

      if (app.student) {
        fetchStudentData(typeof app.student === 'string' ? app.student : app.student._id);
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
      const res = await axiosInstance.put(
        `/applications/${id}`,
        {
          primaryStatus: formData.primaryStatus,
          rejectionReason: formData.rejectionReason,
          backups: formData.backups,
          documents: formData.documents,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
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

        res = await axiosInstance.put(
          `/applications/documents/${id}/${docId}`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      } else {
        res = await axiosInstance.put(
          `/applications/documents/${id}/${docId}`,
          updates
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
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
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
    idx: number,
    status: AppDocument["status"],
    rejectReason?: string,
  ) => {
    try {
      const docs = [...formData.documents];
      docs[idx] = { ...docs[idx], status, rejectReason };
      const res = await axiosInstance.put(
        `/applications/${id}`,
        { documents: docs },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      );
      if (res.data.success) {
        setFormData((p) => ({ ...p, documents: docs }));
        setSuccess("Status updated");
      }
    } catch {
      setError("Failed to update status");
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
      backups: prev.backups.map((b, i) => (i === idx ? { ...b, [field]: value } : b)),
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
      rejectionReason: prev.rejectionReason.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
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
      ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "—";

  const sectionCls = "bg-white rounded-2xl border border-slate-200 shadow-sm p-5";
  const labelCls = "block text-xs font-medium text-slate-500 mb-1";
  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400";

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
          <button
            onClick={() => router.back()}
            className="text-sm text-violet-600 hover:underline flex items-center gap-1 mx-auto"
          >
            <ChevronLeft size={14} /> Go back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "documents", label: "Documents", icon: FileText },
    { id: "backups", label: "Backups", icon: BookOpen },
    { id: "message", label: "Messages", icon: MessageCircle },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <div className="h-auto overflow-auto bg-slate-50 pb-8">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition disabled:opacity-60 shadow-sm"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
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
            <button onClick={() => setError("")} className="ml-auto hover:bg-rose-100 p-1 rounded"><X size={14} /></button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-4 animate-in slide-in-from-top-2">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-6">
          <StatsBar app={application} docs={formData.documents} />
        </div>

        <div className="flex gap-6 items-start">
          {/* Left Sidebar: Application Info */}
          <div className={`shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-12" : "w-72"}`}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-20">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-100"
              >
                {!sidebarCollapsed && <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Application Info</span>}
                {sidebarCollapsed ? <ChevronRight size={16} className="text-slate-400 mx-auto" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {!sidebarCollapsed && (
                <div className="p-4 space-y-1">
                  {/* Status Control */}
                  <div className="mb-4">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Status</label>
                    <select
                      value={formData.primaryStatus}
                      onChange={(e) => setFormData((p) => ({ ...p, primaryStatus: e.target.value as ApplicationStatus }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <InfoItem label="Student" value={studentData?.name || application.student?.name || "N/A"} icon={User} />
                    <InfoItem label="Email" value={studentData?.email || application.student?.email || "N/A"} />
                    <InfoItem label="Phone" value={studentData?.phone || "N/A"} />
                    {studentData?.passportNumber && (
                      <InfoItem label="Passport" value={studentData.passportNumber} />
                    )}
                    {studentData?.nationality && (
                      <InfoItem label="Nationality" value={studentData.nationality} />
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <InfoItem label="Country" value={application.country || "N/A"} />
                    <InfoItem label="University" value={application.course?.university?.name || "N/A"} />
                    <InfoItem label="Course" value={application.course?.name || "N/A"} />
                    <InfoItem label="Intake" value={application.intake || "N/A"} />
                    <InfoItem label="Payment" value={<PaymentBadge status={application.paymentStatus} />} />
                    <InfoItem label="Created" value={formatDate(application.createdAt)} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex gap-0 border-b border-slate-200 px-5 pt-4 sticky top-14 bg-white z-20 rounded-t-2xl">
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
                    {tab.id === "backups" && (formData.backups.length + formData.rejectionReason.length) > 0 && (
                      <span className="ml-0.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                        {formData.backups.length + formData.rejectionReason.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {/* DOCUMENTS TAB */}
                {activeTab === "documents" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-700">Document Requirements</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Manage and review student documents</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowRequirementForm(!showRequirementForm)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
                        >
                          <Plus size={13} /> {showRequirementForm ? "Close" : "Create Requirement"}
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
                      <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <FileText size={32} className="mx-auto mb-3 text-slate-300" />
                        <p className="text-sm font-medium">No documents yet</p>
                        <p className="text-xs mt-1 max-w-xs mx-auto">Click "Create Requirement" to add required documents for this application</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.documents.map((doc, idx) => (
                          <div
                            key={doc._id ?? idx}
                            className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-violet-200 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <DocTypeIcon type={doc.docType} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-sm text-slate-800">{doc.name}</h4>
                                      {doc.docUrl && doc.docType !== "form" && (
                                        <a
                                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${doc.docUrl}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-slate-400 hover:text-violet-600 transition"
                                          title="View document"
                                        >
                                          <ExternalLink size={12} />
                                        </a>
                                      )}
                                    </div>
                                    {doc.description && (
                                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{doc.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${doc.type === "ooshas" ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-600"
                                        }`}>
                                        {doc.type === "ooshas" ? "Ooshas" : "Student"}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${doc.required === "required" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-500"
                                        }`}>
                                        {doc.required}
                                      </span>
                                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                        {doc.docType}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    <InlineDocEditor
                                      doc={doc}
                                      index={idx}
                                      onUpdateStatus={handleUpdateDocStatus}
                                      onEdit={(id) => {
                                        setEditingDocId(id);
                                        setShowDocUpload(true);
                                      }}
                                    />
                                  </div>
                                </div>

                                {doc.rejectReason && doc.status === "Rejected" && (
                                  <div className="mt-3 p-2 bg-rose-50 rounded-lg border border-rose-100 text-xs text-rose-700 flex items-start gap-1.5">
                                    <AlertCircle size={12} className="mt-0.5 shrink-0" />
                                    <span><span className="font-semibold">Rejection reason:</span> {doc.rejectReason}</span>
                                  </div>
                                )}

                                {/* Form answers preview */}
                                {doc.docType === "form" && doc.answer && (
                                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Form Responses</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {(() => {
                                        try {
                                          const answers = JSON.parse(doc.answer);
                                          return Object.entries(answers).map(([key, val]) => (
                                            <div key={key} className="text-xs">
                                              <span className="text-slate-500">{key}:</span>{' '}
                                              <span className="font-medium text-slate-700">{String(val)}</span>
                                            </div>
                                          ));
                                        } catch {
                                          return <span className="text-xs text-slate-400">Invalid response data</span>;
                                        }
                                      })()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* BACKUPS & REJECTIONS TAB */}
                {activeTab === "backups" && (
                  <div className="space-y-6">
                    {/* Rejection Reasons */}
                    <div className={sectionCls}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">!</span>
                            Rejection Reasons
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">Track why applications were rejected</p>
                        </div>
                        <button
                          type="button"
                          onClick={addRejection}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition border border-rose-200"
                        >
                          <Plus size={14} /> Add Reason
                        </button>
                      </div>

                      {formData.rejectionReason.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                          <AlertCircle size={20} className="mx-auto mb-2 text-slate-300" />
                          <p className="text-xs">No rejection reasons recorded</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formData.rejectionReason.map((rr, idx) => (
                            <div
                              key={idx}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative group hover:border-rose-200 transition-colors"
                            >
                              <button
                                type="button"
                                onClick={() => removeRejection(idx)}
                                className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
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
                                  {courseOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className={labelCls}>Reason</label>
                                <input
                                  type="text"
                                  className={inputCls}
                                  placeholder="e.g. Insufficient documents"
                                  value={rr.reason}
                                  onChange={(e) => updateRejection(idx, "reason", e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Backup Courses */}
                    <div className={sectionCls}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                            Backup Courses
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">Alternative course preferences</p>
                        </div>
                        <button
                          type="button"
                          onClick={addBackup}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition border border-blue-200"
                        >
                          <Plus size={14} /> Add Backup
                        </button>
                      </div>

                      {formData.backups.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                          <BookOpen size={20} className="mx-auto mb-2 text-slate-300" />
                          <p className="text-xs">No backup courses added</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formData.backups.map((bk, idx) => (
                            <div
                              key={idx}
                              className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative group hover:border-blue-200 transition-colors"
                            >
                              <button
                                type="button"
                                onClick={() => removeBackup(idx)}
                                className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                              >
                                <X size={14} />
                              </button>
                              <div>
                                <label className={labelCls}>Course</label>
                                <select
                                  className={inputCls}
                                  value={bk.course}
                                  onChange={(e) => updateBackup(idx, "course", e.target.value)}
                                >
                                  <option value="">Select course</option>
                                  {courseOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className={labelCls}>Intake</label>
                                <select
                                  className={inputCls}
                                  value={bk.intake}
                                  onChange={(e) => updateBackup(idx, "intake", e.target.value)}
                                >
                                  <option value="">Select intake</option>
                                  {INTAKE_OPTIONS.map((intake) => (
                                    <option key={intake} value={intake}>{intake}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className={labelCls}>Priority Order</label>
                                <input
                                  type="number"
                                  className={inputCls}
                                  value={bk.order}
                                  onChange={(e) => updateBackup(idx, "order", parseInt(e.target.value, 10))}
                                  min="1"
                                />
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
                  <div className="h-[calc(100vh-280px)] min-h-[500px]">
                    <MessagingTab applicationId={id} studentId={application.student?._id} />
                  </div>
                )}

                {/* ACTIVITY TAB */}
                {activeTab === "activity" && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-700">Activity Timeline</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Complete history of application interactions</p>
                    </div>

                    {activityLogs.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Activity size={32} className="mx-auto mb-3 text-slate-300" />
                        <p className="text-sm font-medium">No activity recorded yet</p>
                        <p className="text-xs mt-1 max-w-xs mx-auto">Activities like status changes, document reviews, and messages will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {activityLogs.map((log, idx) => (
                          <TimelineItem key={log._id} log={log} isLast={idx === activityLogs.length - 1} />
                        ))}
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