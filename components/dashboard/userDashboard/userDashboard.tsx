// components/dashboard/userDashboard/UserDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FileText,
    Building2,
    FileLock,
    FileCheck,
    CheckCircle,
    TrendingUp,
    AlertCircle,
    ArrowRight,
    Clock,
    Bell,
    X,
    ExternalLink,
    MapPin,
    GraduationCap,
    Plane,
    Home,
    Wallet,
    Shield,
    ChevronRight,
    Sparkles,
    Flag,
    BookOpen,
    Landmark,
    CreditCard,
    Hotel,
    ClipboardCheck,
    PlaneTakeoff,
    Loader2,
    User,
    Check,
} from "lucide-react";
import { useGlobal } from "@/src/statecontext";
import axiosInstance from "@/app/axiosInstance";
import { Rigthsidebar } from "@/components/dashboard/application/rightsidebar";
import Image from "next/image";

// Types
interface DashboardData {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        profileImage: string;
        profileCompletion: number;
        status: string;
        lastLogin: string;
    };
    studyAbroadJourney: {
        steps: JourneyStep[];
        overallProgress: number;
        currentActiveStep: JourneyStep | null;
        nextStep: JourneyStep | null;
        totalSteps: number;
        completedSteps: number;
        criticalStepsPending: number;
    };
    alerts: {
        total: number;
        critical: number;
        warning: number;
        list: Alert[];
        summary: string;
    };
    statistics: {
        documents: {
            total: number;
            pending: number;
            verified: number;
            rejected: number;
        };
        universitiesApplied: {
            total: number;
            active: number;
            offers: number;
            refused: number;
            completed: number;
            byCountry: Record<string, any>;
        };
        visaStatus: {
            total: number;
            active: number;
            currentVisa: any;
        };
        unreadActivities: number;
    };
    applications: Application[];
    recentActivities: Activity[];
    quickActions: QuickAction[];
}

interface JourneyStep {
    id: number;
    label: string;
    description: string;
    route: string;
    icon: string;
    status: string;
    completed: boolean;
    locked: boolean;
    critical: boolean;
    minimumRequirement: string;
    impactOnDelay: string;
    missingData: string[];
    isCurrentStep: boolean;
    progress: number;
}

interface Alert {
    id: string;
    type: string;
    severity: "critical" | "warning" | "info" | "success";
    title: string;
    message: string;
    impact: string;
    step?: {
        id: number;
        label: string;
        route: string;
    };
    action: {
        label: string;
        route: string;
        type: string;
    };
    timestamp: string;
}

interface Application {
    id: string;
    applicationNumber: string;
    country: string;
    course: {
        id: string;
        name: string;
        university: string;
    } | null;
    intake: string;
    primaryStatus: string;
    paymentStatus: string;
    isVisa: boolean;
    hasIssues: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Activity {
    id: string;
    type: string;
    action?: string;
    description?: string;
    content?: string;
    application: {
        id: string;
        applicationNumber: string;
    } | null;
    isRead: boolean;
    createdAt: string;
    userType: string;
}

interface QuickAction {
    label: string;
    route: string;
    priority: string;
    type: string;
    alertId?: string;
    reason?: string;
}

// Icon mapping for journey steps - UPDATED TO MATCH API RESPONSE ICONS
const stepIcons: Record<string, any> = {
    // Exact keys from your API response
    user: User,
    flag: Flag,
    book: BookOpen,
    "file-text": FileText,
    award: CheckCircle,
    passport: Shield,
    "dollar-sign": Wallet,
    home: Hotel,
    plane: Plane,

    // Fallback / previous keys
    profile: User,
    country: Flag,
    course: BookOpen,
    university: Landmark,
    application: FileText,
    offer: CheckCircle,
    visa: Shield,
    finance: Wallet,
    forex: CreditCard,
    accommodation: Hotel,
    "pre-departure": PlaneTakeoff,
    departure: Plane,
    default: Sparkles,
};

// UI Step interface
interface UIStep {
    step: number;
    title: string;
    desc: string;
    status: "completed" | "current" | "upcoming";
    icon: any;
    progress: string;
    progressLabel: string;
    action: string;
    link: string;
    critical: boolean;
    color: string;
}

interface UICard {
    title: string;
    value: string;
    color: string;
    icon: any;
    link: string;
    trend?: string;
    subtext?: string;
}

interface StepTrackerStep {
    name: string;
    status: "completed" | "current" | "upcoming";
    description: string;
}

export default function UserDashboard() {
    const router = useRouter();
    const { profile } = useGlobal();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [animatedProgress, setAnimatedProgress] = useState(0);

    const [steps, setSteps] = useState<UIStep[]>([]);
    const [cards, setCards] = useState<UICard[]>([]);
    const [stepTrackerSteps, setStepTrackerSteps] = useState<StepTrackerStep[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Animate progress bar on load
    useEffect(() => {
        if (dashboardData) {
            const target = Math.round(
                (stepTrackerSteps.filter((s) => s.status === "completed").length /
                    stepTrackerSteps.length) *
                100
            );
            let current = 0;
            const timer = setInterval(() => {
                if (current >= target) {
                    clearInterval(timer);
                    setAnimatedProgress(target);
                } else {
                    current += 1;
                    setAnimatedProgress(current);
                }
            }, 20);
            return () => clearInterval(timer);
        }
    }, [dashboardData, stepTrackerSteps]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get("/dashboard/user");
            if (response.data.success) {
                const data: DashboardData = response.data.data;
                setDashboardData(data);
                transformDataToUI(data);
            }
        } catch (err: any) {
            console.error("Error fetching dashboard:", err);
            setError(err.response?.data?.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const getStepIcon = (iconName: string) => {
        return stepIcons[iconName?.toLowerCase()] || stepIcons.default;
    };

    const getStepColor = (status: string, isCritical: boolean) => {
        if (status === "completed") return "emerald";
        if (status === "current") return isCritical ? "rose" : "orange";
        return "slate";
    };

    const transformDataToUI = (data: DashboardData) => {
        const { statistics, studyAbroadJourney, applications } = data;

        // Transform cards with better icons and info
        const uiCards: UICard[] = [
            {
                title: "Documents",
                value: statistics.documents.total.toString(),
                color: "from-emerald-500 to-teal-600",
                icon: "./shapes/1.webp",
                link: "/dashboard/settings#doc",
                trend: `${statistics.documents.verified} verified`,
                subtext: `${statistics.documents.pending} pending review`,
            },
            {
                title: "Universities",
                value: statistics.universitiesApplied.total.toString(),
                color: "from-orange-500 to-indigo-600",
                icon: "./shapes/2.webp",
                link: "/dashboard/universities",
                trend: `${statistics.universitiesApplied.offers} offers`,
                subtext: `${statistics.universitiesApplied.active} active applications`,
            },
            {
                title: "Visa Status",
                value: statistics.visaStatus.currentVisa ? "Active" : "Pending",
                color: "from-orange-500 to-amber-600",
                icon: "./shapes/3.webp",
                link: "/dashboard/visa",
                trend: statistics.visaStatus.currentVisa ? "Approved" : "Not started",
                subtext: statistics.visaStatus.currentVisa
                    ? "Valid until 2027"
                    : "Begin your application",
            },
            {
                title: "Applications",
                value: applications.length.toString(),
                color: "from-violet-500 to-purple-600",
                icon: "./shapes/4.webp",
                link: "/dashboard/application",
                trend: "View all",
                subtext: `${applications.filter((a) => !a.hasIssues).length} on track`,
            },
        ];
        setCards(uiCards);

        // Transform journey steps with icons and colors
        const uiSteps: UIStep[] = studyAbroadJourney.steps.map((step) => {
            let status: "completed" | "current" | "upcoming" = "upcoming";
            if (step.completed) status = "completed";
            else if (step.isCurrentStep) status = "current";

            const StepIcon = getStepIcon(step.icon);
            const color = getStepColor(status, step.critical);

            let progress = `${step.progress}%`;
            let progressLabel = step.completed
                ? "Completed"
                : step.isCurrentStep
                    ? "In Progress"
                    : "Upcoming";
            let action = step.completed
                ? "Review"
                : step.isCurrentStep
                    ? "Continue"
                    : "Start";

            // Custom progress based on step type
            if (step.label.toLowerCase().includes("profile")) {
                progress = `${data.user.profileCompletion}%`;
                progressLabel = `${data.user.profileCompletion}% Completed`;
            } else if (step.label.toLowerCase().includes("country")) {
                // progress = `${step.progress}%`;
                progressLabel = "Countries Shortlisted";
                action = "View Countries";
            } else if (step.label.toLowerCase().includes("course")) {
                // progress = `${step.progress}%`;
                progressLabel = "Courses Shortlisted";
                action = "View Courses";
            } else if (
                step.label.toLowerCase().includes("university") ||
                step.label.toLowerCase().includes("application")
            ) {
                // FIXED: Use actual applications length instead of journey steps
                progress = `${applications.length}`;
                progressLabel = "Applications Submitted";
                action = "View Applications";
            } else if (step.label.toLowerCase().includes("offer")) {
                progress = `${statistics.universitiesApplied.offers} / ${statistics.universitiesApplied.total}`;
                progressLabel = "Offers Received";
                action = "View Offers";
            } else if (step.label.toLowerCase().includes("visa")) {
                // FIXED: Use actual step progress from API instead of hardcoding 100%
                progress = `${step.progress}%`;
                progressLabel = "Visa Progress";
                action = statistics.visaStatus.currentVisa
                    ? "View Visa"
                    : "Start Process";
            } else if (
                step.label.toLowerCase().includes("finance") ||
                step.label.toLowerCase().includes("forex")
            ) {
                progress = "0%";
                progressLabel = "Finance Setup";
                action = "Manage Finance";
            } else if (
                step.label.toLowerCase().includes("accommodation") ||
                step.label.toLowerCase().includes("home")
            ) {
                progress = "Not Booked";
                progressLabel = "";
                action = "Explore Options";
            } else if (
                step.label.toLowerCase().includes("pre-departure") ||
                step.label.toLowerCase().includes("departure")
            ) {
                progress = "0%";
                progressLabel = "Ready";
                action = "View Checklist";
            }

            return {
                step: step.id,
                title: step.label,
                desc: step.description,
                status,
                icon: StepIcon,
                progress,
                progressLabel,
                action,
                // FIXED: Fallback to "#" if route is missing in API (e.g., Forex & Finance)
                link: step.route || "#",
                critical: step.critical,
                color,
            };
        });
        setSteps(uiSteps);

        // Transform step tracker steps
        const trackerSteps: StepTrackerStep[] = studyAbroadJourney.steps.map(
            (step) => {
                let status: "completed" | "current" | "upcoming" = "upcoming";
                if (step.completed) status = "completed";
                else if (step.isCurrentStep) status = "current";
                return {
                    name: step.label,
                    status,
                    description: step.description,
                };
            }
        );
        setStepTrackerSteps(trackerSteps);
    };

    if (loading) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-orange-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Unable to Load Dashboard
                    </h3>
                    <p className="text-red-500 mb-6 text-sm">
                        {error || "Failed to load dashboard data"}
                    </p>
                    <button
                        onClick={fetchDashboardData}
                        className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium shadow-lg shadow-orange-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const completedCount = stepTrackerSteps.filter(
        (s) => s.status === "completed"
    ).length;
    const totalSteps = stepTrackerSteps.length;
    const progressPercent =
        totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return (
        <div className="min-h-screen p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 max-w-[1600px] mx-auto">
                {/* Left Section */}
                <div className="space-y-6">
                    {/* Stats Cards - Modern Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {cards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => router.push(card.link)}
                                    className="group relative bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    {/* Background gradient accent */}
                                    <div
                                        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`}
                                    />
                                    <Image
                                        src={card.icon}
                                        alt={card.title}
                                        width={40}
                                        height={40}
                                        className="absolute -right-6 bottom-0 w-32 z-0"
                                    />

                                    <div className="flex items-start justify-end">
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                                    </div>

                                    <div className="relative z-1">
                                        <h3 className="text-base font-medium text-gray-700 mb-1">
                                            {card.title}
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                            {card.value}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                {card.trend}
                                            </span>
                                        </div>
                                        {card.subtext && (
                                            <p className="text-xs font-medium text-gray-600 mt-2">{card.subtext}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Study Abroad Journey - Main Component */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        My Study Abroad Journey
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Track your progress from application to departure
                                    </p>
                                </div>

                                <div className="w-12 h-12 relative">
                                    <svg className="w-12 h-12 transform -rotate-90">
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            className="text-gray-200"
                                        />
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 20}`}
                                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - animatedProgress / 100)
                                                }`}
                                            className="text-orange-600 transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-orange-600">
                                        {completedCount}/{totalSteps}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Step Tracker - Desktop */}
                        <div className="hidden lg:block py-8 px-2">
                            <div className="relative">
                                {/* Background Line */}
                                <div className="absolute top-[20px] left-10 right-10 h-1 bg-gray-100 rounded-full" />
                                <div
                                    className="absolute top-[20px] left-10 h-1 bg-gradient-to-r from-emerald-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${((stepTrackerSteps.findIndex(
                                            (s) => s.status === "current"
                                        ) +
                                            1) /
                                            stepTrackerSteps.length) *
                                            100
                                            }%`,
                                    }}
                                />

                                <div className="relative flex justify-between">
                                    {stepTrackerSteps.map((step, idx) => {
                                        const isCompleted = step.status === "completed";
                                        const isCurrent = step.status === "current";
                                        const isUpcoming = step.status === "upcoming";

                                        return (
                                            <div
                                                key={idx}
                                                className="flex flex-col items-center text-center group cursor-pointer"
                                                style={{ maxWidth: "140px" }}
                                                onClick={() => {
                                                    if (!isUpcoming) {
                                                        const route = steps[idx]?.link;
                                                        if (route && route !== "#") router.push(route);
                                                    }
                                                }}
                                            >
                                                {/* Step Circle */}
                                                <div
                                                    className={`
                            relative z-10 w-11 h-11 rounded-full flex items-center justify-center
                            transition-all duration-500 border-2
                            ${isCompleted
                                                            ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                                                            : isCurrent
                                                                ? "bg-white border-orange-500 text-orange-600 shadow-lg shadow-orange-200 scale-110"
                                                                : "bg-white border-gray-200 text-gray-300"
                                                        }
                            ${isCurrent
                                                            ? "ring-4 ring-orange-50"
                                                            : ""
                                                        }
                            group-hover:scale-105
                          `}
                                                >
                                                    {isCompleted ? (
                                                        <Check className="w-5 h-5" />
                                                    ) : (
                                                        <span className="font-bold text-sm">{idx + 1}</span>
                                                    )}

                                                    {/* Pulse animation for current step */}
                                                    {isCurrent && (
                                                        <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-20" />
                                                    )}
                                                </div>

                                                {/* Step Info */}
                                                <div className="mt-3 space-y-1">
                                                    <h4
                                                        className={`text-xs font-bold px-2 max-w-[100px] leading-tight ${isCurrent
                                                            ? "text-orange-700"
                                                            : isCompleted
                                                                ? "text-gray-900"
                                                                : "text-gray-400"
                                                            }`}
                                                    >
                                                        {step.name}
                                                    </h4>
                                                    <p
                                                        className={`text-[10px] font-medium ${isCurrent
                                                            ? "text-orange-500"
                                                            : isCompleted
                                                                ? "text-emerald-600"
                                                                : "text-gray-300"
                                                            }`}
                                                    >
                                                        {isCompleted
                                                            ? "Done"
                                                            : isCurrent
                                                                ? "In Progress"
                                                                : "Locked"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Step Tracker */}
                        <div className="lg:hidden px-4 py-6">
                            <div className="space-y-2">
                                {stepTrackerSteps.map((step, idx) => {
                                    const isCompleted = step.status === "completed";
                                    const isCurrent = step.status === "current";
                                    const isUpcoming = step.status === "upcoming";

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                if (!isUpcoming) {
                                                    const route = steps[idx]?.link;
                                                    if (route && route !== "#") router.push(route);
                                                }
                                            }}
                                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${isCurrent
                                                ? "bg-orange-50 border-orange-200"
                                                : "bg-gray-50 border-gray-100"
                                                }`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                                    ? "bg-emerald-500 text-white"
                                                    : isCurrent
                                                        ? "bg-orange-600 text-white"
                                                        : "bg-gray-200 text-gray-400"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <Check className="w-5 h-5" />
                                                ) : (
                                                    <span className="font-bold text-sm">{idx + 1}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`font-semibold text-sm ${isCurrent ? "text-orange-900" : "text-gray-700"
                                                        }`}
                                                >
                                                    {step.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {step.description}
                                                </p>
                                            </div>
                                            <ChevronRight
                                                className={`w-4 h-4 flex-shrink-0 ${isCurrent ? "text-orange-400" : "text-gray-300"
                                                    }`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Journey Steps Detail Cards */}
                        <div className="border-t border-gray-100">
                            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5" />
                                    Journey Details
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {steps.map((item, idx) => {
                                    const isCompleted = item.status === "completed";
                                    const isCurrent = item.status === "current";
                                    const isUpcoming = item.status === "upcoming";

                                    return (
                                        <div
                                            key={idx}
                                            className={`
                        group relative flex items-center gap-5 px-6 py-5 
                        hover:bg-gray-50/80 transition-all duration-300
                        ${isCurrent ? "bg-orange-50/30" : ""}
                      `}
                                        >
                                            {/* Left accent border for current step */}
                                            {isCurrent && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-800 rounded-r-full" />
                                            )}

                                            {isCurrent && item.progress !== "Not Booked" && (
                                                <div className="absolute z-1 top-0 right-0 left-0 bottom-0 flex items-center gap-3">
                                                    <div
                                                        className={`h-full w-full transition-all duration-1000 ${item.critical
                                                            ? "bg-gradient-to-r from-rose-100/50 to-rose-100/50"
                                                            : "bg-gradient-to-r from-orange-100/50 to-orange-100/50"
                                                            }`}
                                                        style={{
                                                            width: item.progress.includes("%")
                                                                ? item.progress
                                                                : "60%",
                                                        }}
                                                    />
                                                    {/* <span className="text-xs font-semibold text-gray-600">
                                                            {item.progress}
                                                        </span> */}
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 relative z-1 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                                    <h3
                                                        className={`font-semibold text-[15px] ${isCurrent
                                                            ? "text-orange-900"
                                                            : isCompleted
                                                                ? "text-gray-900"
                                                                : "text-gray-500"
                                                            }`}
                                                    >
                                                        {item.title}
                                                    </h3>
                                                    <span
                                                        className={`
                              inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                              ${isCompleted
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                : isCurrent
                                                                    ? item.critical
                                                                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                                                                        : "bg-orange-50 text-orange-700 border border-orange-200"
                                                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                                                            }
                            `}
                                                    >
                                                        {isCompleted ? (
                                                            <>
                                                                <Check className="w-3 h-3" />
                                                                Completed
                                                            </>
                                                        ) : isCurrent ? (
                                                            <>
                                                                <Clock className="w-3 h-3" />
                                                                {item.critical ? "Critical" : "In Progress"}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="w-3 h-3" />
                                                                Pending
                                                            </>
                                                        )}
                                                    </span>

                                                    {/* Critical Badge */}
                                                    {item.critical && !isCompleted && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 border border-rose-200">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Action Required
                                                        </span>
                                                    )}
                                                </div>

                                                <p
                                                    className={`text-sm ${isUpcoming ? "text-gray-400" : "text-gray-500"
                                                        }`}
                                                >
                                                    {item.desc}
                                                </p>

                                                {/* Progress Bar for current step */}

                                            </div>

                                            {/* Progress Info */}
                                            <div className="hidden md:flex flex-col items-end gap-1 min-w-[120px]">
                                                {(!item.progressLabel.includes("Countr") && !item.progressLabel.includes("Course")) && <span
                                                    className={`text-lg font-bold ${item.progress === "Not Booked"
                                                        ? "text-rose-500"
                                                        : isCompleted
                                                            ? "text-emerald-600"
                                                            : "text-gray-900"
                                                        }`}
                                                >
                                                    {item?.progress}
                                                </span>}
                                                {item.progressLabel && (
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {item.progressLabel}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex-shrink-0">
                                                <button
                                                    onClick={() => {
                                                        if (item.link && item.link !== "#") {
                                                            router.push(item.link);
                                                        }
                                                    }}
                                                    disabled={isUpcoming || !item.link || item.link === "#"}
                                                    className={`
                            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                            transition-all duration-300
                            ${isCompleted
                                                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                                            : isCurrent
                                                                ? item.critical
                                                                    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200"
                                                                    : "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200"
                                                                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                                        }
                            group-hover:scale-105 active:scale-95
                          `}
                                                >
                                                    {item.action}
                                                    {!isUpcoming && item.link && item.link !== "#" && (
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <Rigthsidebar />
                </div>
            </div>
        </div>
    );
}