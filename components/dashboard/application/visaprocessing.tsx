import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  RefreshCw,
  Check,
  Save,
  Edit,
  Eye,
  Calendar,
  DollarSign,
  Fingerprint,
  FileText,
  CreditCard,
  Globe,
  Flag,
  Building,
  BookOpen,
  User,
  Hash,
  Clock,
  AlertCircle,
  Upload,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Download,
  Banknote,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";

// ============================================
// TYPES BASED ON MONGOOSE SCHEMA
// ============================================

type StepStatus = "Pending" | "Completed";
type DocumentStatus = "Pending" | "Approved" | "Rejected";
type BiometricsStatus = "Pending" | "Approved" | "Rejected";
type PaymentStatus = "Pending" | "Approved" | "Rejected";

interface StepDetails {
  description?: string;
  [key: string]: any;
}

interface Step {
  title: string;
  status: StepStatus;
  completedAt?: Date | null;
  stepDetails?: StepDetails | StepDetails[];
  _id?: string;
}

interface Document {
  name: string;
  status: DocumentStatus;
  data?: any;
  _id?: string;
}

interface Biometrics {
  status: BiometricsStatus;
  completedDate?: Date | null;
  validityPeriod?: string;
  otherinfo?: Record<string, any>;
}

interface FinancialInfo {
  method?: string;
  accountNumber?: string;
  totalamount?: number;
  currency?: string;
  paymentStatus: PaymentStatus;
  otherinfo?: Record<string, any>;
}

interface VisaDetails {
  category?: string;
  country: string;
  embassy?: string;
  purpose?: string;
  intake?: string;
}

interface VisaApplication {
  _id?: string;
  userId: string;
  application: string;
  visaDetails?: VisaDetails;
  steps: Step[];
  documents: Document[];
  biometrics: Biometrics;
  financialInfo: FinancialInfo;
  createdAt?: string;
  updatedAt?: string;
}

// Default empty application template
const defaultApplication: VisaApplication = {
  userId: "",
  application: "",
  visaDetails: {
    category: "",
    country: "",
    embassy: "",
    purpose: "",
    intake: "",
  },
  steps: [],
  documents: [],
  biometrics: {
    status: "Pending",
    completedDate: null,
    validityPeriod: "",
    otherinfo: {},
  },
  financialInfo: {
    paymentStatus: "Pending",
    method: "",
    accountNumber: "",
    totalamount: 0,
    currency: "USD",
    otherinfo: {},
  },
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function VisaApplicationManager({
  data,
  applicaion,
}: {
  data?: VisaApplication;
  applicaion?: any;
}) {
  

  const [formData, setFormData] = useState<VisaApplication>(() => {
    if (data) {
      return {
        ...defaultApplication,
        ...data,
        _id: data._id || undefined,
        userId: data.userId?._id || data.userId || defaultApplication.userId,
        application: data.application?._id || data.application || defaultApplication.application,
        visaDetails: {
          ...defaultApplication.visaDetails,
          ...data.visaDetails,
        },
        steps: Array.isArray(data.steps) ? data.steps : [],
        documents: Array.isArray(data.documents) ? data.documents : [],
        biometrics: {
          ...defaultApplication.biometrics,
          ...data.biometrics,
        },
        financialInfo: {
          ...defaultApplication.financialInfo,
          ...data.financialInfo,
        },
      };
    }
    return defaultApplication;
  });

  const [activeSection, setActiveSection] = useState<string>("visa");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["visa", "steps", "documents", "biometrics", "financial"]),
  );
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [showAddStep, setShowAddStep] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [newStep, setNewStep] = useState<Partial<any>>({
    title: "",
    description: "",
    date : "",
    status: "Pending",
  });
  
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    name: "",
    status: "Pending",
    data: {},
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const [saveMessage, setSaveMessage] = useState("");

  //console.log(applicaion?.student?._id, "applicaion");

  // Update state when props change (for external data updates after mount)
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        _id: data._id || prev._id,
        userId: data.userId?._id || applicaion?.student?._id || prev.userId,
        application: data?.applicaion?._id || data?.applicaion || applicaion?._id || prev.application,
        visaDetails: {
          ...prev.visaDetails,
          ...data.visaDetails,
          country: applicaion?.country || data.visaDetails?.country || prev.visaDetails?.country,
          intake: applicaion?.intake || data.visaDetails?.intake || prev.visaDetails?.intake,
        },
        steps: Array.isArray(data.steps) ? data.steps : (prev.steps || []),
        documents: Array.isArray(data.documents) ? data.documents : (prev.documents || []),
        biometrics: data.biometrics || prev.biometrics || defaultApplication.biometrics,
        financialInfo: data.financialInfo || prev.financialInfo || defaultApplication.financialInfo,
      }));
    } else if (applicaion) {
      setFormData((prev) => ({
        ...prev,
        userId: applicaion?.student?._id || prev.userId || "123456789",
        application: applicaion._id || prev.application,
        visaDetails: {
          ...prev.visaDetails,
          country: applicaion.country || prev.visaDetails?.country,
          intake: applicaion.intake || prev.visaDetails?.intake,
        },
        steps: prev.steps || [],
        documents: prev.documents || [],
        biometrics: prev.biometrics || defaultApplication.biometrics,
        financialInfo: prev.financialInfo || defaultApplication.financialInfo,
      }));
    }
  }, [data, applicaion]);

  useEffect(() => {
    if (saveStatus === "saved" || saveStatus === "error") {
      const timer = setTimeout(() => {
        setSaveStatus("idle");
        setSaveMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // ============================================
  // SECTION TOGGLES
  // ============================================

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // ============================================
  // VISA DETAILS HANDLERS
  // ============================================

  const handleVisaChange = (field: keyof VisaDetails, value: string) => {
    setFormData((prev) => ({
      ...prev,
      visaDetails: { ...prev.visaDetails, [field]: value },
    }));
  };

  // ============================================
  // STEPS HANDLERS
  // ============================================

  const handleStepStatusChange = (index: number, status: StepStatus) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index
          ? {
              ...step,
              status,
              completedAt:
                status === "Completed" ? new Date() : step.completedAt,
            }
          : step,
      ),
    }));
  };

  const handleStepTitleChange = (index: number, title: string) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, title } : step,
      ),
    }));
  };

  const handleStepDescriptionChange = (index: number, description: string) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => {
        if (i === index) {
          const currentStepDetails = step.stepDetails;
          let updatedStepDetails;
          
          if (Array.isArray(currentStepDetails)) {
            if (currentStepDetails.length > 0) {
              updatedStepDetails = [
                { ...currentStepDetails[0], description },
                ...currentStepDetails.slice(1)
              ];
            } else {
              updatedStepDetails = [{ description }];
            }
          } else if (currentStepDetails && typeof currentStepDetails === 'object') {
            updatedStepDetails = { ...currentStepDetails, description };
          } else {
            updatedStepDetails = { description };
          }
          
          return { ...step, stepDetails: updatedStepDetails };
        }
        return step;
      }),
    }));
  };

  const handleAddStep = () => {
    if (newStep.title?.trim()) {
      setFormData((prev) => ({
        ...prev,
        steps: [
          ...prev.steps,
          {
            title: newStep.title!,
            status: newStep.status as StepStatus,
            stepDetails: newStep.description ? [{ description: newStep.description }] : [],
            completedAt: newStep.status === "Completed" ? new Date() : null,
          },
        ],
      }));
      setNewStep({ title: "", description: "", status: "Pending" });
      setShowAddStep(false);
    }
  };

  const handleRemoveStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  // ============================================
  // DOCUMENTS HANDLERS
  // ============================================

  const handleDocumentStatusChange = (
    index: number,
    status: DocumentStatus,
  ) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, status } : doc,
      ),
    }));
  };

  const handleDocumentNameChange = (index: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, name } : doc,
      ),
    }));
  };

  const handleDocumentDataChange = (index: number, data: any) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, data: { ...doc.data, ...data } } : doc,
      ),
    }));
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading((prev) => ({ ...prev, [index]: true }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUrl = URL.createObjectURL(file);
      
      handleDocumentDataChange(index, {
        documentUrl: mockUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
      });
      setSaveMessage(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error("Upload failed:", error);
      setSaveMessage("Upload failed. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleAddDocument = () => {
    if (newDocument.name?.trim()) {
      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            name: newDocument.name!,
            status: newDocument.status as DocumentStatus,
            data: newDocument.data || {},
          },
        ],
      }));
      setNewDocument({ name: "", status: "Pending", data: {} });
      setShowAddDocument(false);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // ============================================
  // BIOMETRICS HANDLERS
  // ============================================

  const handleBiometricsChange = (field: keyof Biometrics, value: any) => {
    setFormData((prev) => ({
      ...prev,
      biometrics: { ...prev.biometrics, [field]: value },
    }));
  };

  const handleBiometricsOtherInfoChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      biometrics: {
        ...prev.biometrics,
        otherinfo: { ...prev.biometrics.otherinfo, [key]: value },
      },
    }));
  };

  // ============================================
  // FINANCIAL INFO HANDLERS
  // ============================================

  const handleFinancialChange = (field: keyof FinancialInfo, value: any) => {
    setFormData((prev) => ({
      ...prev,
      financialInfo: { ...prev.financialInfo, [field]: value },
    }));
  };

  const handleFinancialOtherInfoChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      financialInfo: {
        ...prev.financialInfo,
        otherinfo: { ...prev.financialInfo.otherinfo, [key]: value },
      },
    }));
  };

  // ============================================
  // SUBMIT HANDLER
  // ============================================

  const handleSubmit = async () => {
    setSaveStatus("saving");
    setSaveMessage("Saving changes...");

    try {
      const payload: Partial<VisaApplication> = {
        visaDetails: formData.visaDetails,
        steps: formData.steps,
        documents: formData.documents,
        biometrics: formData.biometrics,
        financialInfo: formData.financialInfo,
      };

      let response;
      
      if (formData._id) {
        response = await axiosInstance.patch(`/visa/${formData._id}`, {
          ...payload,
          userId: formData.userId,
          application: formData.application,
        });
      } else {
        response = await axiosInstance.post("/visa", {
          ...payload,
          userId: formData.userId,
          application: formData.application,
        });
      }

      if (response.data) {
        setFormData((prev) => ({
          ...prev,
          ...response.data,
          _id: response.data._id || prev._id,
        }));
      }
      
      setSaveStatus("saved");
      setSaveMessage("Changes saved successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      setSaveStatus("error");
      setSaveMessage("Failed to save changes. Please try again.");
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const getStepDescription = (step: Step): string => {
    if (!step.stepDetails) return "";
    
    if (Array.isArray(step.stepDetails) && step.stepDetails.length > 0) {
      return step.stepDetails[0]?.description || "";
    }
    
    if (typeof step.stepDetails === 'object' && step.stepDetails.description) {
      return step.stepDetails.description;
    }
    
    return "";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "rejected":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle size={14} />;
      case "completed":
        return <CheckCircle size={14} />;
      case "pending":
        return <ClockIcon size={14} />;
      case "rejected":
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* Save Status Toast */}
      {saveMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all ${
            saveStatus === "saved"
              ? "bg-emerald-500 text-white"
              : saveStatus === "error"
              ? "bg-rose-500 text-white"
              : "bg-slate-800 text-white"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="space-y-4">
        {/* ==================== SECTION 1: VISA DETAILS ==================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
          <button
            onClick={() => toggleSection("visa")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-100 text-violet-600 group-hover:scale-105 transition">
                <Globe size={18} />
              </div>
              <h2 className="font-semibold text-slate-800 text-lg">
                Visa Details
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                Required
              </span>
            </div>
            {expandedSections.has("visa") ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>

          {expandedSections.has("visa") && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <Briefcase size={12} className="inline mr-1" /> Category *
                  </label>
                  <input 
                    value={formData.visaDetails?.category || ""}
                    placeholder="Student Visa"
                    onChange={(e) => handleVisaChange('category', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <Building size={12} className="inline mr-1" /> Embassy
                  </label>
                  <input
                    type="text"
                    value={formData.visaDetails?.embassy || ""}
                    onChange={(e) =>
                      handleVisaChange("embassy", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                    placeholder="e.g., Canadian Embassy Delhi"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <GraduationCap size={12} className="inline mr-1" /> Purpose
                  </label>
                  <textarea
                    rows={2}
                    value={formData.visaDetails?.purpose || ""}
                    onChange={(e) =>
                      handleVisaChange("purpose", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm resize-none"
                    placeholder="e.g., Higher Education at University of Toronto - Bachelor of Computer Science"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================== SECTION 2: STEPS ==================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
          <button
            onClick={() => toggleSection("steps")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600 group-hover:scale-105 transition">
                <Clock size={18} />
              </div>
              <h2 className="font-semibold text-slate-800 text-lg">
                Visa Processing Steps
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {formData.steps.length} steps
              </span>
            </div>
            {expandedSections.has("steps") ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>

          {expandedSections.has("steps") && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100">
              <div className="space-y-3">
                {/* FALLBACK: use ||[] just in case, though initializer already ensures an array */}
                {(formData.steps || []).map((step, idx) => (
                  <div
                    key={step._id || idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) =>
                              handleStepTitleChange(idx, e.target.value)
                            }
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                            placeholder="Step title"
                          />
                          <select
                            value={step.status}
                            onChange={(e) =>
                              handleStepStatusChange(
                                idx,
                                e.target.value as StepStatus,
                              )
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(step.status)} bg-white cursor-pointer`}
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="Completed">✓ Completed</option>
                          </select>
                          {step.completedAt && (
                            <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                              <Calendar size={12} />
                              {new Date(step.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveStep(idx)}
                          className="p-2 rounded-lg hover:bg-rose-100 text-rose-400 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Description
                        </label>
                        <textarea
                          value={getStepDescription(step)}
                          onChange={(e) =>
                            handleStepDescriptionChange(idx, e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm resize-none"
                          placeholder="Step description (e.g., Submit application online with all required documents)"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {showAddStep ? (
                  <div className="mt-3 p-4 rounded-xl bg-violet-50 border border-violet-200">
                    <input
                      type="text"
                      value={newStep.title}
                      onChange={(e) =>
                        setNewStep({ ...newStep, title: e.target.value })
                      }
                      placeholder="Step title (e.g., Interview)"
                      className="w-full px-3 py-2 rounded-lg border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm mb-3"
                    />

                    <textarea
                      value={newStep.description}
                      onChange={(e) =>
                        setNewStep({ ...newStep, description: e.target.value })
                      }
                      placeholder="Step description (e.g., Schedule and attend visa interview at embassy)"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm mb-3 resize-none"
                    />
                    
                     <input
                      type="date"
                      value={newStep.date}
                      onChange={(e) =>
                        setNewStep({ ...newStep, date: e.target.value })
                      }
                      placeholder="Step title (e.g., Interview)"
                      className="w-full px-3 py-2 rounded-lg border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm mb-3"
                    />

                    <select
                      value={newStep.status}
                      onChange={(e) =>
                        setNewStep({
                          ...newStep,
                          status: e.target.value as StepStatus,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm mb-3"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddStep}
                        className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 transition"
                      >
                        Add Step
                      </button>
                      <button
                        onClick={() => setShowAddStep(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddStep(true)}
                    className="mt-3 flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >
                    <Plus size={16} /> Add Step
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==================== SECTION 3: DOCUMENTS ==================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
          <button
            onClick={() => toggleSection("documents")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 group-hover:scale-105 transition">
                <FileText size={18} />
              </div>
              <h2 className="font-semibold text-slate-800 text-lg">
                Documents
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {formData.documents.length} documents
              </span>
            </div>
            {expandedSections.has("documents") ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>

          {expandedSections.has("documents") && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100">
              <div className="space-y-3">
                {(formData.documents || []).map((doc, idx) => (
                  <div
                    key={doc._id || idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={doc.name}
                        onChange={(e) =>
                          handleDocumentNameChange(idx, e.target.value)
                        }
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                        placeholder="Document name"
                      />
                      <select
                        value={doc.status}
                        onChange={(e) =>
                          handleDocumentStatusChange(
                            idx,
                            e.target.value as DocumentStatus,
                          )
                        }
                        className={`px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(doc.status)} bg-white cursor-pointer`}
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Approved">✓ Approved</option>
                        <option value="Rejected">✗ Rejected</option>
                      </select>
                      <button
                        onClick={() => handleRemoveDocument(idx)}
                        className="p-2 rounded-lg hover:bg-rose-100 text-rose-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-2">
                      <label className="block text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <Upload size={12} /> Upload File (PDF/Image, max 5MB)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleFileUpload(idx, e.target.files[0])
                        }
                        disabled={uploading[idx]}
                        className="w-full text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
                      />
                      {uploading[idx] && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <RefreshCw size={12} className="animate-spin" />{" "}
                          Uploading...
                        </div>
                      )}
                      {doc.data?.documentUrl && !uploading[idx] && (
                        <div className="mt-2 flex items-center gap-2">
                          <Check size={14} className="text-emerald-500" />
                          <a
                            href={doc.data.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-violet-600 hover:underline flex items-center gap-1"
                          >
                            <Download size={12} />{" "}
                            {doc.data.fileName || "View Document"}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {showAddDocument ? (
                  <div className="mt-3 p-4 rounded-xl bg-violet-50 border border-violet-200">
                    <input
                      type="text"
                      value={newDocument.name}
                      onChange={(e) =>
                        setNewDocument({ ...newDocument, name: e.target.value })
                      }
                      placeholder="Document name (e.g., IELTS Certificate)"
                      className="w-full px-3 py-2 rounded-lg border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm mb-3"
                    />
                    <select
                      value={newDocument.status}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          status: e.target.value as DocumentStatus,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm mb-3"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddDocument}
                        className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 transition"
                      >
                        Add Document
                      </button>
                      <button
                        onClick={() => setShowAddDocument(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddDocument(true)}
                    className="mt-3 flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >
                    <Plus size={16} /> Add Document
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==================== SECTION 4: BIOMETRICS ==================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
          <button
            onClick={() => toggleSection("biometrics")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600 group-hover:scale-105 transition">
                <Fingerprint size={18} />
              </div>
              <h2 className="font-semibold text-slate-800 text-lg">
                Biometrics Information
              </h2>
            </div>
            {expandedSections.has("biometrics") ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>

          {expandedSections.has("biometrics") && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={formData.biometrics.status}
                    onChange={(e) =>
                      handleBiometricsChange(
                        "status",
                        e.target.value as BiometricsStatus,
                      )
                    }
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm ${getStatusColor(formData.biometrics.status)}`}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Approved">✓ Approved</option>
                    <option value="Rejected">✗ Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <Calendar size={12} className="inline mr-1" /> Completed
                    Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.biometrics.completedDate
                        ? new Date(formData.biometrics.completedDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleBiometricsChange(
                        "completedDate",
                        e.target.value ? new Date(e.target.value) : null,
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Validity Period
                  </label>
                  <input
                    type="text"
                    value={formData.biometrics.validityPeriod || ""}
                    onChange={(e) =>
                      handleBiometricsChange("validityPeriod", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                    placeholder="e.g., 10 Years"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <MapPin size={12} className="inline mr-1" /> Biometrics
                    Center
                  </label>
                  <input
                    type="text"
                    value={formData.biometrics.otherinfo?.center || ""}
                    onChange={(e) =>
                      handleBiometricsOtherInfoChange("center", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                    placeholder="e.g., Delhi VAC"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <Calendar size={12} className="inline mr-1" /> Appointment
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.biometrics.otherinfo?.appointmentDate || ""}
                    onChange={(e) =>
                      handleBiometricsOtherInfoChange(
                        "appointmentDate",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <Clock size={12} className="inline mr-1" /> Appointment Time
                  </label>
                  <input
                    type="time"
                    value={formData.biometrics.otherinfo?.appointmentTime || ""}
                    onChange={(e) =>
                      handleBiometricsOtherInfoChange(
                        "appointmentTime",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================== SECTION 5: FINANCIAL INFO ==================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
          <button
            onClick={() => toggleSection("financial")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-600 group-hover:scale-105 transition">
                <DollarSign size={18} />
              </div>
              <h2 className="font-semibold text-slate-800 text-lg">
                Financial Information
              </h2>
            </div>
            {expandedSections.has("financial") ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
          </button>

          {expandedSections.has("financial") && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <CreditCard size={12} className="inline mr-1" /> Payment
                    Status
                  </label>
                  <select
                    value={formData.financialInfo.paymentStatus}
                    onChange={(e) =>
                      handleFinancialChange(
                        "paymentStatus",
                        e.target.value as PaymentStatus,
                      )
                    }
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm ${getStatusColor(formData.financialInfo.paymentStatus)}`}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Approved">✓ Approved</option>
                    <option value="Rejected">✗ Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <Banknote size={12} className="inline mr-1" /> Payment
                    Method
                  </label>
                  <select
                    value={formData.financialInfo.method || ""}
                    onChange={(e) =>
                      handleFinancialChange("method", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                  >
                    <option value="">Select Method</option>
                    <option value="Bank Transfer">🏦 Bank Transfer</option>
                    <option value="Credit Card">💳 Credit Card</option>
                    <option value="Debit Card">💳 Debit Card</option>
                    <option value="PayPal">📱 PayPal</option>
                    <option value="Cash">💵 Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Total Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      {formData.financialInfo.currency || "USD"}
                    </span>
                    <input
                      type="number"
                      value={formData.financialInfo.totalamount || 0}
                      onChange={(e) =>
                        handleFinancialChange(
                          "totalamount",
                          parseFloat(e.target.value),
                        )
                      }
                      className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Currency
                  </label>
                  <select
                    value={formData.financialInfo.currency || ""}
                    onChange={(e) =>
                      handleFinancialChange("currency", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.financialInfo.accountNumber || ""}
                    onChange={(e) =>
                      handleFinancialChange("accountNumber", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={
                      formData.financialInfo.otherinfo?.transactionId || ""
                    }
                    onChange={(e) =>
                      handleFinancialOtherInfoChange(
                        "transactionId",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                    placeholder="TXN123456"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.financialInfo.otherinfo?.bankName || ""}
                    onChange={(e) =>
                      handleFinancialOtherInfoChange("bankName", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-sm"
                    placeholder="e.g., TD Bank"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Save Button */}
      <div className="fixed bottom-8 right-8 hidden md:block">
        <button
          onClick={handleSubmit}
          disabled={saveStatus === "saving"}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium shadow-lg hover:bg-violet-700 transition disabled:opacity-50"
        >
          {saveStatus === "saving" ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={handleSubmit}
          disabled={saveStatus === "saving"}
          className="p-4 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 transition disabled:opacity-50"
        >
          {saveStatus === "saving" ? (
            <RefreshCw size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
        </button>
      </div>
    </div>
  );
}