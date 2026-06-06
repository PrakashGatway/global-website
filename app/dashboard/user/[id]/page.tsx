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
    Target,
    Hash,
    CalendarDays, ChevronLeft
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import ProfileTabs from "@/components/couseller/ProfileSteps";

import ProfileFormContainer from "@/components/couseller/ProfileSteps";
import ApplicationCreate from "@/components/couseller/ApplicaionCreate";
import Documents from "@/components/couseller/Documents";

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
    const [countriesList, setCountriesList] = useState<Country[]>([]);
    const [aps, setaps] = useState<Boolean>();
    const [program, setprogram] = useState<Boolean>();

    // Fetch student data
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const [userRes, applicationsRes, countriesRes] = await Promise.all([
                    axiosInstance.get(`/users/${studentId}`),
                    axiosInstance.get(`/applications?studentid=${studentId}`),
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
        <div className="flex items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-gray-500">
                {icon}
            </div>

            <div className="flex items-center gap-2  min-w-0">
                <p className="text-sm text-gray-500">{label} : </p>
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
                            <div className="relative p-4 px-6 border-b-2">
                                <button
                                    onClick={() => router.back()}
                                    className="p-1.5 hover:bg-gray-100 absolute top-0 left-0 bg-white rounded-br-xl shadow-sm hover:shadow-md transition-all"
                                >
                                    <ArrowLeft size={16} className="text-gray-800" />
                                </button>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="p-2 px-4 mt-1 rounded-full bg-gray-800 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                                        {user?.name?.[0]?.toUpperCase() ?? "?"}
                                    </div>
                                    <div className="flex-1 font-medium">
                                        <h2 className="text-gray-900 font-medium text-lg leading-tight">
                                            {user?.name}
                                        </h2>
                                        <p className="flex items-center gap-2 mb-0.5 text-gray-800 text-[14px]">
                                            <Mail size={16} className="text-gray-700" /> {user?.email || "Student"}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-800 text-[13px]">
                                            <PhoneCall size={16} className="text-gray-700" /> {user?.phone || "Student"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-[1px] p-4 py-2 overflow-y-auto hide-scrollbar" style={{ maxHeight: "calc(100vh - 200px)" }}>
                                <h3 className="font-medium text-gray-800">Basic Information</h3>
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

                                {profile?.preferences && (
                                    <div className="bg-white pt-2 ">
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
                                                            <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs">
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
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
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
                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <ProfileTabs
                                        studentId={studentId}
                                        user={user}
                                        profile={profile}
                                        countriesList={countriesList}
                                        onUpdate={() => {
                                            axiosInstance.get(`/users/${studentId}`).then(res => {
                                                setUser(res.data.data || res.data);
                                                setProfile(res.data.data?.profile || res.data?.profile);
                                            });
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
                                    <ApplicationCreate applicationData={applications} />
                                </motion.div>
                            )}

                            {/* Documents Tab */}
                            {activeTab === "documents" && (
                                <Documents
                                    profile={profile}
                                    user={user}
                                    studentId={studentId}
                                    onUpdate={() => {
                                        axiosInstance.get(`/users/${studentId}`).then(res => {
                                            setUser(res.data.data || res.data);
                                            setProfile(res.data.data?.profile || res.data?.profile);
                                        });
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}