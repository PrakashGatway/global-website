"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Mail,
    Phone,
    User,
    MapPin,
    Calendar,
    Clock,
    Flag,
    CheckCircle,
    X,
    ChevronRight,
    FileText,
    SlidersHorizontal,
    Share2,
    Edit2,
    Save,
    Languages,
    Heart,
    Loader2,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    GraduationCap,
    CreditCard,
    Home,
    Smartphone,
    FileCheck,
    Briefcase,
    Globe,
    User2,
    PhoneCall,
    DollarSign,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import ProfileFormContainer from "@/components/couseller/ProfileSteps";

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
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
    };
    permanentAddress?: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        country?: string;
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
    _id?: string;
    applicationNumber?: string;
    primaryStatus?: string;
    course?: {
        name?: string;
        university?: { name?: string };
    };
    intake?: string;
    updatedAt?: string;
}

interface Country {
    _id?: string;
    code: string;
    name: string;
    dialCode?: string;
    flag?: string;
}

// ─── Main Page Component ───────────────────────────

export default function StudentProfilePage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<ReferralUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [activeTab, setActiveTab] = useState<"profile" | "applications" | "documents">("profile");
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [countriesList, setCountriesList] = useState<Country[]>([]);

    // Edit states for different sections
    const [personalInfo, setPersonalInfo] = useState<any>({});
    const [mailingAddress, setMailingAddress] = useState<any>({});
    const [passportInfo, setPassportInfo] = useState<any>({});

    // Fetch student data
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const [userRes, applicationsRes, countriesRes] = await Promise.all([
                    axiosInstance.get(`/users/${studentId}`),
                    axiosInstance.get(`/applications?userId=${studentId}`),
                    axiosInstance.get("/countries?limit=250"),
                ]);

                setUser(userRes.data.data || userRes.data);
                setProfile(userRes.data.data?.profile || userRes.data?.profile);
                setApplications(applicationsRes.data.data || applicationsRes.data || []);
                setCountriesList(countriesRes.data.data || []);
            } catch (error) {
                console.error("Error fetching student data:", error);
                toast.error("Failed to load student data");
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not provided";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleEditToggle = (section: string) => {
        if (editingSection === section) {
            setEditingSection(null);
        } else {
            setEditingSection(section);
            switch (section) {
                case "personal":
                    setPersonalInfo({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        dateOfBirth: user?.dateOfBirth || "",
                        gender: user?.gender || "",
                        maritalStatus: user?.maritalStatus || "",
                        firstLanguage: user?.firstLanguage || "",
                        nationality: user?.nationality || "",
                    });
                    break;
                case "mailing":
                    setMailingAddress({
                        addressLine1: profile?.currentAddress?.addressLine1 || "",
                        addressLine2: profile?.currentAddress?.addressLine2 || "",
                        city: profile?.currentAddress?.city || user?.city || "",
                        state: profile?.currentAddress?.state || user?.state || "",
                        country: profile?.currentAddress?.country || user?.country || "",
                        postalCode: profile?.currentAddress?.postalCode || "",
                    });
                    break;
                case "passport":
                    setPassportInfo({
                        passportNumber: user?.passportNumber || "",
                        passportExpiry: user?.passportExpiry || "",
                    });
                    break;
            }
        }
    };

    // Handle save
    const handleSave = async (section: string) => {
        setSaving(true);
        try {
            let updatePayload: any = {};

            switch (section) {
                case "personal":
                    updatePayload = {
                        name: personalInfo.name,
                        phone: personalInfo.phone,
                        dateOfBirth: personalInfo.dateOfBirth,
                        gender: personalInfo.gender,
                        maritalStatus: personalInfo.maritalStatus,
                        firstLanguage: personalInfo.firstLanguage,
                        nationality: personalInfo.nationality,
                    };
                    break;
                case "mailing":
                    updatePayload = {
                        "profile.currentAddress": mailingAddress,
                        city: mailingAddress.city,
                        state: mailingAddress.state,
                        country: mailingAddress.country,
                    };
                    break;
                case "passport":
                    updatePayload = {
                        passportNumber: passportInfo.passportNumber,
                        passportExpiry: passportInfo.passportExpiry,
                    };
                    break;
            }

            await axiosInstance.patch(`/users/${studentId}`, updatePayload);
            toast.success("Information updated successfully");
            setEditingSection(null);

            // Refresh data
            const userRes = await axiosInstance.get(`/users/${studentId}`);
            setUser(userRes.data.data || userRes.data);
            setProfile(userRes.data.data?.profile || userRes.data?.profile);
        } catch (error) {
            console.error("Error updating:", error);
            toast.error("Failed to update information");
        } finally {
            setSaving(false);
        }
    };

    // Calculate profile completion
    const calculateCompletion = useCallback(() => {
        if (!user && !profile) return 0;
        let completed = 0;
        let total = 7;

        if (user?.name && user?.email && user?.phone) completed++;
        if (user?.dateOfBirth && user?.gender && user?.nationality) completed++;
        if (profile?.currentAddress?.addressLine1 && profile?.currentAddress?.city) completed++;
        if (user?.passportNumber && user?.passportExpiry) completed++;
        if (profile?.educationHistory && profile.educationHistory.length > 0) completed++;
        if (profile?.englishProficiencyScore?.overall) completed++;
        if (profile?.preferences?.preferredCountries && profile.preferences.preferredCountries.length > 0) completed++;

        return Math.round((completed / total) * 100);
    }, [user, profile]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#F26D44]" />
                    <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Student not found</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 transition-all font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const InfoRow = ({ icon, label, value }: any) => (
        <div className="flex items-start gap-2">
            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-gray-500">
                {icon}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-800 break-words">
                    {value || "N/A"}
                </p>
            </div>
        </div>
    );

    const displayValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === "" ||
            value === "null"
        ) {
            return "N/A";
        }
        return value;
    };

    const completionPercentage = calculateCompletion();

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="lg:w-80 space-y-3">
                        <div className="bg-white border-2 border-gray-200 overflow-hidden sticky top-3">
                            <div className="relative bg-[#F26D44]/90 p-4">
                                <button
                                    onClick={() => router.back()}
                                    className="p-2 px-2.5 hover:bg-gray-100 absolute top-0 left-0 bg-white rounded-br-2xl shadow-sm hover:shadow-md transition-all"
                                >
                                    <ArrowLeft size={20} className="text-gray-600" />
                                </button>
                                <div className="flex items-start justify-start gap-3 mt-6">
                                    <div className="p-2 px-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {user?.name?.[0]?.toUpperCase() ?? "?"}
                                    </div>
                                    <div className="flex-1 font-medium">
                                        <h2 className="text-white font-semibold mb-1 text-lg leading-tight">
                                            {user?.name}
                                        </h2>
                                        <p className="flex items-center gap-2 mb-0.5 text-white/80 text-sm">
                                            <Mail size={16} className="text-white" /> {user?.email || "Student"}
                                        </p>
                                        <p className="flex items-center gap-2 text-white/80 text-sm">
                                            <PhoneCall size={16} className="text-white" /> {user?.phone || "Student"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 p-4 overflow-y-auto hide-scrollbar" style={{ maxHeight: "calc(100vh - 200px)" }}>
                                <InfoRow
                                    icon={<Mail size={20} />}
                                    label="Email"
                                    value={displayValue(user?.email)}
                                />
                                <InfoRow
                                    icon={<Smartphone size={20} />}
                                    label="Phone"
                                    value={displayValue(user?.phone)}
                                />
                                <InfoRow
                                    icon={<Calendar size={20} />}
                                    label="Date of Birth"
                                    value={
                                        user?.dateOfBirth
                                            ? formatDate(user.dateOfBirth)
                                            : "N/A"
                                    }
                                />

                                <InfoRow
                                    icon={<User size={20} />}
                                    label="Gender"
                                    value={displayValue(user?.gender)}
                                />

                                <InfoRow
                                    icon={<Flag size={20} />}
                                    label="Nationality"
                                    value={displayValue(user?.nationality)}
                                />

                                <InfoRow
                                    icon={<Globe size={20} />}
                                    label="First Language"
                                    value={displayValue(user?.firstLanguage)}
                                />

                                <InfoRow
                                    icon={<Heart size={20} />}
                                    label="Marital Status"
                                    value={displayValue(user?.maritalStatus)}
                                />

                                <InfoRow
                                    icon={<CreditCard size={20} />}
                                    label="Passport Number"
                                    value={displayValue(user?.passportNumber)}
                                />

                                <InfoRow
                                    icon={<Calendar size={20} />}
                                    label="Passport Expiry"
                                    value={
                                        user?.passportExpiry
                                            ? formatDate(user.passportExpiry)
                                            : "N/A"
                                    }
                                />

                                <InfoRow
                                    icon={<Calendar size={20} />}
                                    label="Joined"
                                    value={
                                        user?.createdAt
                                            ? formatDate(user.createdAt)
                                            : "N/A"
                                    }
                                />

                            </div>
                        </div>

                        {/* Preferences Card */}
                        {profile?.preferences && (
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <SlidersHorizontal size={18} className="text-[#F26D44]" />
                                    <h3 className="font-semibold text-gray-800">Student Preferences</h3>
                                </div>
                                <div className="space-y-3">
                                    {profile.preferences.preferredCountries && profile.preferences.preferredCountries.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preferred Countries</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {profile.preferences.preferredCountries.map((country, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                                                        {country}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {profile.preferences.preferredIntake && profile.preferences.preferredIntake.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preferred Intake</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {profile.preferences.preferredIntake.map((intake, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">
                                                        {intake}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {profile.preferences.preferredCourse && profile.preferences.preferredCourse.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preferred Courses</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {profile.preferences.preferredCourse.slice(0, 2).map((course, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">
                                                        {course}
                                                    </span>
                                                ))}
                                                {profile.preferences.preferredCourse.length > 2 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                        +{profile.preferences.preferredCourse.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {profile.preferences.budgetRange && (profile.preferences.budgetRange.min || profile.preferences.budgetRange.max) && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Budget Range</p>
                                            <p className="text-sm text-gray-700">
                                                {profile.preferences.budgetRange.currency || "USD"} {profile.preferences.budgetRange.min?.toLocaleString() || "0"} - {profile.preferences.budgetRange.max?.toLocaleString() || "Unlimited"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        {/* Tab Navigation */}
                        <div className="bg-white p-1 border-2 border-gray-200">
                            <div className="flex items-center justify-start gap-2 overflow-x-auto hide-scrollbar">
                                {[
                                    { id: "profile", title: "Profile", icon: User },
                                    { id: "applications", title: "Applications", icon: FileText },
                                    { id: "documents", title: "Documents", icon: FileCheck },
                                ].map((tab, index) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center justify-center gap-2 px-4 py-2.5 cursor-pointer transition-all ${activeTab === tab.id
                                            ? "bg-[#F26D44] text-white shadow"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span className="text-sm border-2 p-1 border-gray-200 rounded-full w-6 h-6 flex items-center justify-center font-medium">{index + 1}</span>
                                        <span className="text-sm font-medium">{tab.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <AnimatePresence mode="wait">
                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ProfileFormContainer
                                        userId={studentId}
                                        onComplete={() => {
                                            null
                                            // Refresh 
                                        }}
                                    />
                                </motion.div>
                            )}

                            {/* Applications Tab */}
                            {activeTab === "applications" && (
                                <motion.div
                                    key="applications"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-[#F26D44]" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
                                                    <p className="text-xs text-gray-500">Total {applications.length} applications</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/dashboard/application_details/${studentId}`)}
                                                className="px-5 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md"
                                            >
                                                <FileText size={16} />
                                                Add New
                                            </button>
                                        </div>

                                        {applications.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FileText size={32} className="text-gray-400" />
                                                </div>
                                                <h3 className="text-base font-semibold text-gray-900 mb-1">No Applications Yet</h3>
                                                <p className="text-sm text-gray-500 mb-4">Create your first application to get started</p>
                                                <button
                                                    onClick={() => router.push(`/dashboard/application_details/${studentId}`)}
                                                    className="px-5 py-2 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl text-sm font-medium"
                                                >
                                                    Create Application
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {applications.map((app, idx) => (
                                                    <motion.div
                                                        key={app._id || idx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        onClick={() => router.push(`/dashboard/application_details/${app._id}`)}
                                                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                    <h3 className="font-semibold text-gray-900 group-hover:text-[#F26D44] transition">
                                                                        {app.applicationNumber || `Application #${idx + 1}`}
                                                                    </h3>
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.primaryStatus === "approved" ? "bg-green-100 text-green-700" :
                                                                        app.primaryStatus === "pending" ? "bg-amber-100 text-amber-700" :
                                                                            "bg-gray-100 text-gray-700"
                                                                        }`}>
                                                                        {app.primaryStatus || "Pending"}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-700 mt-1">{app.course?.name || "Course not specified"}</p>
                                                                <p className="text-xs text-gray-500">{app.course?.university?.name || "University not specified"}</p>
                                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar size={12} />
                                                                        {app.intake || "Intake not set"}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock size={12} />
                                                                        Updated {formatDate(app.updatedAt)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <ChevronRight size={18} className="text-gray-400 group-hover:text-[#F26D44] transition self-center" />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Documents Tab */}
                            {activeTab === "documents" && (
                                <motion.div
                                    key="documents"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                                <FileCheck className="w-5 h-5 text-[#F26D44]" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                                                <p className="text-xs text-gray-500">Student uploaded documents</p>
                                            </div>
                                        </div>

                                        {/* Stats Cards */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                            <div className="bg-blue-50 rounded-xl p-3 text-center">
                                                <FileText className="w-5 h-5 text-[#F26D44] mx-auto mb-1" />
                                                <p className="text-xl font-bold text-[#F26D44]">
                                                    {Object.keys(profile?.documents || {}).length}
                                                </p>
                                                <p className="text-xs text-gray-600">Total</p>
                                            </div>
                                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                                <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                                <p className="text-xl font-bold text-green-600">
                                                    {Object.values(profile?.documents || {}).filter((d: any) => d.status === "approved").length}
                                                </p>
                                                <p className="text-xs text-gray-600">Approved</p>
                                            </div>
                                            <div className="bg-amber-50 rounded-xl p-3 text-center">
                                                <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                                                <p className="text-xl font-bold text-amber-600">
                                                    {Object.values(profile?.documents || {}).filter((d: any) => d.status === "pending").length}
                                                </p>
                                                <p className="text-xs text-gray-600">Pending</p>
                                            </div>
                                            <div className="bg-red-50 rounded-xl p-3 text-center">
                                                <X className="w-5 h-5 text-red-600 mx-auto mb-1" />
                                                <p className="text-xl font-bold text-red-600">
                                                    {Object.values(profile?.documents || {}).filter((d: any) => d.status === "rejected").length}
                                                </p>
                                                <p className="text-xs text-gray-600">Rejected</p>
                                            </div>
                                        </div>

                                        {/* Documents List */}
                                        <div className="space-y-3">
                                            {Object.entries(profile?.documents || {}).length === 0 ? (
                                                <div className="text-center py-8">
                                                    <FileText size={40} className="text-gray-300 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">No documents uploaded yet</p>
                                                </div>
                                            ) : (
                                                Object.entries(profile?.documents || {}).map(([docName, doc]: [string, any]) => (
                                                    <div key={docName} className="bg-gray-50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                                <FileText size={18} className="text-[#F26D44]" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-sm text-gray-800">{docName.replace(/_/g, " ")}</h4>
                                                                <p className="text-xs text-gray-400">{formatDate(doc.uploadedAt)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doc.status === "approved" ? "bg-green-100 text-green-700" :
                                                                doc.status === "pending" ? "bg-amber-100 text-amber-700" :
                                                                    "bg-red-100 text-red-700"
                                                                }`}>
                                                                {doc.status || "Pending"}
                                                            </span>
                                                            {doc.url && (
                                                                <button
                                                                    onClick={() => window.open(doc.url, "_blank")}
                                                                    className="px-3 py-1.5 bg-white text-[#F26D44] rounded-lg hover:bg-gray-100 transition text-xs font-medium border border-gray-200"
                                                                >
                                                                    View
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}