"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; // or your toast library
import {
  Mail,
  Phone,
  SlidersHorizontal,
  Share2,
  FileText,
  User,
  MapPin,
  Globe,
  Home,
  CreditCard,
  Calendar,
  Clock,
  Key,
  Users,
  Shield,
  GraduationCap,
  Award,
  Star,
  Briefcase,
  BookOpen,
  Flag,
  Wallet,
  CheckCircle,
  X,
  ChevronRight,
} from "lucide-react";
import { useGlobal } from "@/src/statecontext";
import axiosInstance from "@/app/axiosInstance";
import { useRouter } from "next/navigation";

// ─── Types ─────────────────────────────────────────
interface Document {
  url: string;
  status: "pending" | "approved" | "rejected" | string;
  uploadedAt?: string;
}

interface ReferralUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  firstLanguage?: string;
  nationality?: string;
  city?: string;
  state?: string;
  country?: string;
  passportNumber?: string;
  passportExpiry?: string;
  referalCode?: string;
  referalBy?: string;
  assignedTo?: string;
  wallet?: number;
  status: string;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
  hasAcceptedTerms?: boolean;
  profile?: Profile;
}

interface Profile {
  profileCompletion?: number;
  currentAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
  };
  validVisas?: string[];
  educationHistory?: Education[];
  englishProficiencyScore?: EnglishProficiency;
  highestAcademic?: HighestAcademic;
  preferences?: Preferences;
  documents?: Record<string, Document>;
}

interface Education {
  degreeName?: string;
  educationLevel?: string;
  institutionName?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  state?: string;
  country?: string;
  gradingScheme?: string;
}

interface EnglishProficiency {
  englishStatus?: string;
  englishTest?: string;
  reading?: string;
  listening?: string;
  writing?: string;
  speaking?: string;
  overall?: string;
}

interface HighestAcademic {
  highestEducationLevel?: string;
  countryOfEducation?: string;
  gradingScheme?: string;
  graduated?: boolean;
}

interface Preferences {
  preferredCountries?: string[];
  preferredIntake?: string[];
  preferredCourse?: string[];
  budgetRange?: {
    currency?: string;
    min?: number;
    max?: number;
  };
}

interface Application {
  id?: string;
  applicationNumber?: string;
  primaryStatus?: string;
  course?: {
    name?: string;
    university?: { name?: string };
  };
  intake?: string;
  updatedAt?: string;
}

// ─── Props ─────────────────────────────────────────
interface StudentDetailsPageProps {
  user: ReferralUser;
  applications?: Application[];
}

// ─── Status Pill ───────────────────────────────────
function StatusPill({ status }: { status?: string }) {
  const colorMap: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
    approved: "bg-green-100 text-green-700",
    submitted: "bg-blue-100 text-[#fa6a1f]",
    default: "bg-gray-100 text-gray-700",
  };
  const style = colorMap[status?.toLowerCase() || ""] || colorMap.default;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status || "Unknown"}
    </span>
  );
}

// ─── Info Row ──────────────────────────────────────
function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: React.ReactNode;
  icon?: React.ElementType;
}) {
  if (!value || value === "N/A") return null;
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon size={16} className="text-gray-400 mt-0.5 shrink-0" />}
      {!Icon && <div className="w-4 shrink-0" />}
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// ─── Info Section ──────────────────────────────────
function InfoSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50/50">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={18} className="text-[#fa6a3f]" />}
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

// ─── Info Card (for grid layout) ────────────────────
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-xl p-5 hover:shadow-sm transition bg-white">
      <p className="text-gray-500 mb-2 text-sm">{label}</p>
      <p className="font-semibold text-base text-gray-800">{value}</p>
    </div>
  );
}

// ─── Document Card ─────────────────────────────────
function DocumentCard({
  document,
  documentName,
  onApprove,
  onReject,
  onPreview,
  isUpdating,
}: {
  document: Document;
  documentName: string;
  onApprove: () => void;
  onReject: () => void;
  onPreview: (url: string) => void;
  isUpdating: boolean;
}) {
  const statusColors: Record<string, string> = {
    approved: "bg-green-50 border-green-200",
    rejected: "bg-red-50 border-red-200",
    pending: "bg-amber-50 border-amber-200",
    true: "bg-green-50 border-green-200",
    false: "bg-red-50 border-red-200",
  };

  const statusBadge: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
    true: "bg-green-100 text-green-700",
    false: "bg-red-100 text-red-700",
  };

  const status = document?.status || "pending";
  const cardStyle = statusColors[status] || "bg-gray-50 border-gray-200";
  const badgeStyle = statusBadge[status] || "bg-gray-100 text-gray-700";

  return (
    <div className={`border rounded-xl p-4 ${cardStyle}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-[#fa6a3f]" />
          <div>
            <p className="font-medium text-gray-800 text-sm">{documentName}</p>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${badgeStyle}`}
            >
              {document.status || "Pending"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {document.url && (
            <button
              onClick={() => onPreview(document.url)}
              className="px-3 py-1.5 text-sm bg-blue-50 text-[#fa6a3f] rounded-lg hover:bg-blue-100 transition"
            >
              Preview
            </button>
          )}
          <button
            onClick={onApprove}
            disabled={isUpdating}
            className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition disabled:opacity-50"
          >
            {isUpdating ? "..." : "Approve"}
          </button>
          <button
            onClick={onReject}
            disabled={isUpdating}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
          >
            {isUpdating ? "..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Document Preview Modal ────────────────────────
function DocumentPreviewModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
    //console.log(url)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-800 text-sm">Document Preview</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 
            hover:bg-gray-200 text-gray-500 transition"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 h-[70vh]">
          <iframe
            src={url}
            className="w-full h-full rounded-lg border"
            title="Document Preview"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Application Card ──────────────────────────────
function ApplicationCard({ app, index }: { app: Application; index: number }) {
  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
   const router = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={ () => router.push(`/dashboard/application_details/${app?._id}`)}
      className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all border border-gray-100 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-800 text-sm">
              {app.applicationNumber || `Application #${index + 1}`}
            </h4>
            {app.primaryStatus && <StatusPill status={app.primaryStatus} />}
          </div>
          {app.course?.name && (
            <p className="text-sm text-gray-700 font-medium">
              {app.course.name}
            </p>
          )}
          {app.course?.university?.name && (
            <p className="text-xs text-gray-500 mt-0.5">
              {app.course.university.name}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
        {app.intake && (
          <p className="text-xs">
            <span className="text-gray-500">Intake:</span> {app.intake}
          </p>
        )}
        {app.updatedAt && (
          <p className="text-xs">
            <span className="text-gray-500">Updated:</span>{" "}
            {formatDate(app.updatedAt)}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════
export default function StudentDetailsPage({
  user,
  applications = [],
}: StudentDetailsPageProps) {
  const { allProfile, update, setupdate } = useGlobal();
  const [profile, setProfile] = useState<any | undefined>(
    user?.profile || allProfile?.profile,
  );
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [updatingDocs, setUpdatingDocs] = useState<Record<string, boolean>>({});

  // Get documents from profile
  const documents = profile?.documents || {};

  // Sync profile when update changes
  useEffect(() => {
    setProfile(user?.profile || allProfile?.profile);
  }, [update, allProfile, user?.profile]);

  // Format helpers
  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "N/A";
    return `₹${amount.toLocaleString()}`;
  };

  // Document statistics
  const totalDocuments = Object.keys(documents).length;
  const approvedDocs = Object.values(documents).filter(
    (doc) => doc.status === "approved" || doc.status === "true",
  ).length;
  const pendingDocs = Object.values(documents).filter(
    (doc) => doc.status === "pending",
  ).length;
  const rejectedDocs = Object.values(documents).filter(
    (doc) => doc.status === "rejected" || doc.status === "false",
  ).length;

  // Handle document status update
  const handleDocumentStatus = async (
    documentName: string,
    status: boolean,
  ) => {
    setUpdatingDocs((prev) => ({ ...prev, [documentName]: true }));

    try {
      const updatedDocuments = {
        ...documents,
        [documentName]: {
          ...documents[documentName],
          status: status ? "approved" : "rejected",
        },
      };

      const response = await axiosInstance.patch("/auth/edit-doc", {
        userId: user._id,
        documents: updatedDocuments,
      });

      if (response.data.success) {
        setupdate(!update);
        toast.success(
          `${documentName} ${status ? "approved" : "rejected"} successfully`,
        );
      }
    } catch (error: any) {
      console.error(`Error updating ${documentName}:`, error);
      toast.error(
        error.response?.data?.message || "Failed to update document status",
      );
    } finally {
      setUpdatingDocs((prev) => ({ ...prev, [documentName]: false }));
    }
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
  };

  const [msg, setmsg] = useState(true);

  // Steps configuration
  const steps = [
    { id: 1, title: "Profile" },
    { id: 2, title: "Applications" },
    { id: 3, title: "Documents" },
  ];

  return (
    <div className="min-h-screen text-sm">
      {/* Breadcrumb */}
      {/* <div className="mb-5 text-sm text-gray-500 flex items-center gap-1">
        <span>Students</span>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-700">{user?.name || "Student Details"}</span>
      </div> */}

      {/* ================= HEADER ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-14 gap-4">
        <div className="xl:col-span-3 bg-white rounded-2xl border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {user?.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusPill status={user?.status} />
                <span className="text-xs text-gray-400">
                  {user?.role || "Student"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 mb-2 text-sm">
            <Mail size={16} className="text-gray-400" />
            <span>{user?.email}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Phone size={16} className="text-gray-400" />
            <span>{user?.phone || "N/A"}</span>
          </div>

          {/* Profile Completion */}
          {/* {profile?.profileCompletion && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Profile Completion</span>
                <span>{profile.profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#fa6a3f] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profile.profileCompletion}%` }}
                />
              </div>
            </div>
          )} */}
        </div>

        {/* Preferences */}
        <div className="xl:col-span-2 bg-white rounded-2xl border p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition cursor-pointer">
          <SlidersHorizontal size={28} className="text-[#fa6a3f] mb-3" />
          <p className="text-base text-center font-medium text-gray-700">
            Student Preferences
          </p>
          {profile?.preferences?.preferredCountries && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              {profile.preferences.preferredCountries.slice(0, 2).join(", ")}
              {profile.preferences.preferredCountries.length > 2 && "..."}
            </p>
          )}
        </div>

        {/* Platform Link */}

        <div className="group relative inline-block xl:col-span-2 bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition cursor-pointer">
          <div
            onClick={() => {
              navigator.clipboard.writeText("https://ooshasglobal.com/login");
              setmsg(false);
            }}
            className="flex flex-col items-center justify-center "
          >
            <Share2 size={28} className="text-[#fa6a3f] mb-3" />
            <p className="text-base text-center font-medium text-gray-700">
              Student Platform Link
            </p>
            <p className="text-xs text-gray-500 mt-1">Share login access</p>
          </div>

          {/* The Tooltip */}
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {msg ? "Click to copy" : "copyed!"}
          </span>
        </div>

        {/* Stepper */}
        <div className="xl:col-span-7 bg-white rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between h-full px-6 py-6 overflow-x-auto">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index !== steps.length - 1 ? "flex-1 min-w-[120px]" : ""
                }`}
              >
                <div
                  onClick={() => setActiveStep(step.id)}
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      activeStep >= step.id
                        ? "bg-[#fa6a3f] text-white border-[#fa6a3f]"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {step.id === 1 && <User size={18} />}
                    {step.id === 2 && <FileText size={18} />}
                    {step.id === 3 && <CreditCard size={18} />}
                  </div>
                  <span className="mt-3 text-xs font-medium whitespace-nowrap">
                    {step.title}
                  </span>
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-4 mb-8 max-w-[120px] ${
                      activeStep > step.id ? "bg-[#fa6a3f]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MAIN SECTION ================= */}
      <div className="mt-6 bg-white rounded-2xl border overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          {/* ═══════ STEP 1: PROFILE ═══════ */}
          {activeStep === 1 && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <User className="text-[#fa6a3f]" size={20} />
                  <h2 className="text-lg font-semibold text-[#fa6a3f]">
                    Personal Information
                  </h2>
                </div>
                <button className="bg-[#fa6a3f] text-white px-5 py-2 rounded-xl hover:bg-[#fa6a1f] transition text-sm font-medium">
                  Edit Profile
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Quick Info Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <InfoCard
                    label="Date Of Birth"
                    value={formatDate(user?.dateOfBirth)}
                  />
                  <InfoCard label="Gender" value={user?.gender || "N/A"} />
                  <InfoCard
                    label="Marital Status"
                    value={user?.maritalStatus || "N/A"}
                  />
                  <InfoCard
                    label="Nationality"
                    value={user?.nationality || "N/A"}
                  />
                  <InfoCard
                    label="Passport Number"
                    value={user?.passportNumber || "N/A"}
                  />
                  <InfoCard label="City" value={user?.city || "N/A"} />
                </div>

                {/* Detailed Sections */}
                <div className="grid lg:grid-cols-2 gap-4 mt-4">
                  {/* Basic Information */}
                  <InfoSection title="Basic Information" icon={User}>
                    <InfoRow label="Full Name" value={user?.name} icon={User} />
                    <InfoRow label="Email" value={user?.email} icon={Mail} />
                    <InfoRow label="Phone" value={user?.phone} icon={Phone} />
                    <InfoRow label="Gender" value={user?.gender} icon={Users} />
                    <InfoRow
                      label="Marital Status"
                      value={user?.maritalStatus}
                    />
                    <InfoRow
                      label="Date of Birth"
                      value={formatDate(user?.dateOfBirth)}
                      icon={Calendar}
                    />
                    <InfoRow
                      label="First Language"
                      value={user?.firstLanguage}
                    />
                    <InfoRow
                      label="Nationality"
                      value={user?.nationality}
                      icon={Flag}
                    />
                  </InfoSection>

                  {/* Address Information */}
                  <InfoSection title="Address Information" icon={MapPin}>
                    <InfoRow label="City" value={user?.city} icon={MapPin} />
                    <InfoRow label="State" value={user?.state} />
                    <InfoRow
                      label="Country"
                      value={user?.country}
                      icon={Globe}
                    />
                    {profile?.currentAddress && (
                      <>
                        <InfoRow
                          label="Address Line 1"
                          value={profile.currentAddress.addressLine1}
                          icon={Home}
                        />
                        <InfoRow
                          label="Address Line 2"
                          value={profile.currentAddress.addressLine2}
                        />
                        <InfoRow
                          label="Postal Code"
                          value={profile.currentAddress.postalCode}
                        />
                      </>
                    )}
                  </InfoSection>

                  {/* Passport Information */}
                  <InfoSection title="Passport Information" icon={CreditCard}>
                    <InfoRow
                      label="Passport Number"
                      value={user?.passportNumber}
                    />
                    <InfoRow
                      label="Passport Expiry"
                      value={formatDate(user?.passportExpiry)}
                      icon={Calendar}
                    />
                    {profile?.validVisas && profile.validVisas.length > 0 && (
                      <InfoRow
                        label="Valid Visas"
                        value={profile.validVisas.join(", ")}
                      />
                    )}
                  </InfoSection>

                  {/* Account Information */}
                  <InfoSection title="Account Information" icon={Shield}>
                    <InfoRow
                      label="Referral Code"
                      value={user?.referalCode}
                      icon={Key}
                    />
                    <InfoRow
                      label="Referred By"
                      value={user?.referalBy}
                      icon={Users}
                    />
                    <InfoRow label="Assigned To" value={user?.assignedTo} />
                    <InfoRow
                      label="Wallet Balance"
                      value={formatCurrency(user?.wallet)}
                      icon={Wallet}
                    />
                    <InfoRow
                      label="Status"
                      value={<StatusPill status={user?.status} />}
                    />
                    <InfoRow
                      label="Member Since"
                      value={formatDate(user?.createdAt)}
                      icon={Clock}
                    />
                    <InfoRow
                      label="Last Login"
                      value={formatDate(user?.lastLogin)}
                      icon={Clock}
                    />
                    <InfoRow
                      label="Terms Accepted"
                      value={user?.hasAcceptedTerms ? "Yes" : "No"}
                    />
                  </InfoSection>

                  {/* Education History */}
                  {profile?.educationHistory &&
                    profile.educationHistory.length > 0 && (
                      <InfoSection
                        title="Education History"
                        icon={GraduationCap}
                      >
                        {profile.educationHistory.map((edu, idx) => (
                          <div
                            key={idx}
                            className="mb-3 last:mb-0 p-3 bg-white rounded-lg border"
                          >
                            <p className="font-semibold text-gray-800 text-sm">
                              {edu.degreeName || edu.educationLevel}
                            </p>
                            <p className="text-sm text-gray-600">
                              {edu.institutionName}
                            </p>
                            <div className="text-xs text-gray-500 mt-1">
                              {edu.startDate &&
                                edu.endDate &&
                                `${formatDate(edu.startDate)} - ${formatDate(
                                  edu.endDate,
                                )}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {edu.city &&
                                `${edu.city}, ${edu.state}, ${edu.country}`}
                            </div>
                            {edu.gradingScheme && (
                              <div className="text-xs text-gray-500">
                                Grading: {edu.gradingScheme}
                              </div>
                            )}
                          </div>
                        ))}
                      </InfoSection>
                    )}

                  {/* English Proficiency */}
                  {profile?.englishProficiencyScore && (
                    <InfoSection title="English Proficiency" icon={Award}>
                      <InfoRow
                        label="English Status"
                        value={profile.englishProficiencyScore.englishStatus}
                      />
                      <InfoRow
                        label="Test Type"
                        value={profile.englishProficiencyScore.englishTest}
                      />
                      {profile.englishProficiencyScore.reading && (
                        <div className="grid grid-cols-2 gap-2 ml-7 mt-2">
                          <InfoRow
                            label="Reading"
                            value={profile.englishProficiencyScore.reading}
                          />
                          <InfoRow
                            label="Listening"
                            value={profile.englishProficiencyScore.listening}
                          />
                          <InfoRow
                            label="Writing"
                            value={profile.englishProficiencyScore.writing}
                          />
                          <InfoRow
                            label="Speaking"
                            value={profile.englishProficiencyScore.speaking}
                          />
                          <InfoRow
                            label="Overall"
                            value={profile.englishProficiencyScore.overall}
                          />
                        </div>
                      )}
                    </InfoSection>
                  )}

                  {/* Highest Academic */}
                  {profile?.highestAcademic && (
                    <InfoSection
                      title="Highest Academic Qualification"
                      icon={Star}
                    >
                      <InfoRow
                        label="Education Level"
                        value={profile.highestAcademic.highestEducationLevel}
                      />
                      <InfoRow
                        label="Country of Education"
                        value={profile.highestAcademic.countryOfEducation}
                        icon={Flag}
                      />
                      <InfoRow
                        label="Grading Scheme"
                        value={profile.highestAcademic.gradingScheme}
                      />
                      <InfoRow
                        label="Graduated"
                        value={profile.highestAcademic.graduated ? "Yes" : "No"}
                      />
                    </InfoSection>
                  )}

                  {/* Study Preferences */}
                  {profile?.preferences && (
                    <InfoSection title="Study Preferences" icon={Briefcase}>
                      {profile.preferences.preferredCountries &&
                        profile.preferences.preferredCountries.length > 0 && (
                          <InfoRow
                            label="Preferred Countries"
                            value={profile.preferences.preferredCountries.join(
                              ", ",
                            )}
                            icon={Globe}
                          />
                        )}
                      {profile.preferences.preferredIntake &&
                        profile.preferences.preferredIntake.length > 0 && (
                          <InfoRow
                            label="Preferred Intake"
                            value={profile.preferences.preferredIntake.join(
                              ", ",
                            )}
                            icon={Calendar}
                          />
                        )}
                      {profile.preferences.preferredCourse &&
                        profile.preferences.preferredCourse.length > 0 && (
                          <InfoRow
                            label="Preferred Course"
                            value={profile.preferences.preferredCourse.join(
                              ", ",
                            )}
                            icon={BookOpen}
                          />
                        )}
                      {profile.preferences.budgetRange && (
                        <InfoRow
                          label="Budget Range"
                          value={`${profile.preferences.budgetRange.currency || "₹"} ${
                            profile.preferences.budgetRange.min?.toLocaleString() ||
                            0
                          } - ${
                            profile.preferences.budgetRange.max?.toLocaleString() ||
                            0
                          }`}
                          icon={Wallet}
                        />
                      )}
                    </InfoSection>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 2: APPLICATIONS ═══════ */}
          {activeStep === 2 && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#fa6a3f]" size={20} />
                  <h2 className="text-lg font-semibold text-[#fa6a3f]">
                    Applications ({applications.length})
                  </h2>
                </div>
                <button onClick={() => {router.push('/dashboard/application_details')}} className="bg-[#fa6a3f] text-white px-5 py-2 rounded-xl hover:bg-[#fa6a1f] transition text-sm font-medium">
                  Add Application
                </button>
              </div>

              <div className="p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-300 text-6xl mb-4">📄</div>
                    <p className="text-gray-500 font-medium">
                      No applications found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Applications will appear here once submitted
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {applications.map((app, index) => (
                      <ApplicationCard
                        key={app.id || index}
                        app={app}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 3: DOCUMENTS ═══════ */}
          {activeStep === 3 && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-[#fa6a3f]" size={20} />
                  <h2 className="text-lg font-semibold text-[#fa6a3f]">
                    Documents ({totalDocuments})
                  </h2>
                </div>
                <button className="bg-[#fa6a3f] text-white px-5 py-2 rounded-xl hover:bg-[#fa6a1f] transition text-sm font-medium">
                  Upload Document
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Document Statistics */}
                {totalDocuments > 0 && (
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                      <FileText className="w-6 h-6 text-[#fa6a3f] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#fa6a3f]">
                        {totalDocuments}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">Total</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">
                        {approvedDocs}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        Approved
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                      <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-amber-600">
                        {pendingDocs}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        Pending
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                      <X className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">
                        {rejectedDocs}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        Rejected
                      </p>
                    </div>
                  </div>
                )}

                {/* Documents List */}
                {totalDocuments === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-300 text-6xl mb-4">📄</div>
                    <p className="text-gray-500 font-medium">
                      No documents uploaded
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Documents will appear here once uploaded by student
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(documents).map(([docName, doc]) => (
                      <DocumentCard
                        key={docName}
                        document={doc}
                        documentName={docName}
                        onApprove={() => handleDocumentStatus(docName, true)}
                        onReject={() => handleDocumentStatus(docName, false)}
                        onPreview={handlePreview}
                        isUpdating={updatingDocs[docName] || false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <DocumentPreviewModal
            url={previewUrl}
            onClose={() => setPreviewUrl(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}