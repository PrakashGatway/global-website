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
  FolderOpen,
  Clock3,
  Globe,
  University,
  House,
  Briefcase,
  LandPlot,
  Phone,
  Notebook,
  DollarSign,
  Calendar,
  Building,
  ClipboardList,
  ChevronDown,
  ChevronsRight,
  ChevronRightCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useGlobal } from "@/src/statecontext";
import axiosInstance, { fileBaseurl } from "@/app/axiosInstance";
import { Rigthsidebar } from "@/components/dashboard/application/rightsidebar";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

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
  Textcolor?: string;
}

interface StepTrackerStep {
  name: string;
  status: "completed" | "current" | "upcoming";
  description: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const { profile } = useGlobal();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [university, setUniversities] = useState([])

  const [steps, setSteps] = useState<UIStep[]>([]);
  const [cards, setCards] = useState<UICard[]>([]);
  const [stepTrackerSteps, setStepTrackerSteps] = useState<StepTrackerStep[]>(
    [],
  );

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axiosInstance.get(`/universities?limit=3&withCountry=true`);
        const data = response.data.result;
        setUniversities(data)
      }
      catch (err) {
        toast.error(err)
      }
    }
    fetchUniversities()

  }, [])



  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Animate progress bar on load
  useEffect(() => {
    if (dashboardData) {
      const target = Math.round(
        (stepTrackerSteps.filter((s) => s.status === "completed").length /
          stepTrackerSteps.length) *
        100,
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
        color: "orange-500",
        Textcolor: "orange-500",
        icon: FileText,
        link: "/dashboard/settings#doc",
        trend: `${statistics.documents.verified} verified`,
        subtext: `${statistics.documents.pending} pending review`,
      },
      {
        title: "Universities",
        value: statistics.universitiesApplied.total.toString(),
        color: "orange-500",
        Textcolor: "orange-500",
        icon: GraduationCap,
        link: "/dashboard/universities",
        trend: `${statistics.universitiesApplied.offers} offers`,
        subtext: `${statistics.universitiesApplied.active} active applications`,
      },
      {
        title: "Visa Status",
        value: statistics.visaStatus.currentVisa ? "Active" : "Pending",
        color: "orange-500",
        icon: Clock3,
        Textcolor: "orange-500",
        link: "/dashboard/visa",
        trend: statistics.visaStatus.currentVisa ? "Approved" : "Not started",
        subtext: statistics.visaStatus.currentVisa
          ? "Valid until 2027"
          : "Begin your application",
      },
      {
        title: "Applications",
        value: applications.length.toString(),
        color: "orange-500",
        Textcolor: "orange-500",
        icon: FolderOpen,
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
      },
    );
    setStepTrackerSteps(trackerSteps);
  };

  const journeyIcons = [
    User,
    Globe,
    BookOpen,
    University,
    FileText,
    LandPlot,
    Landmark,
    House,
    Briefcase,
  ];

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
    (s) => s.status === "completed",
  ).length;
  const totalSteps = stepTrackerSteps.length;
  const progressPercent =
    totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const profileSteps = [
    {
      id: 1,
      step: "Step 1 of 9",
      title: "Let's start with your",
      highlight: "Profile",
      description:
        "Let's complete your study abroad journey step by step. You're doing great — keep the momentum going!",
      estimate: "4–6 weeks remaining",
      deadline: "Aug 15, 2025",
      button: "Start Your Profile",
      image: "/profile-dashboard.png",
    },
    {
      id: 2,
      step: "Step 2 of 9",
      title: "Upload your",
      highlight: "Documents",
      description:
        "Upload all required documents to speed up your application process.",
      estimate: "3–5 weeks remaining",
      deadline: "Aug 20, 2025",
      button: "Upload Documents",
      image: "/countries-dashboard.png",
    },
    {
      id: 3,
      step: "Step 3 of 9",
      title: "Shortlist your",
      highlight: "Universities",
      description:
        "Choose universities that match your academic profile and career goals.",
      estimate: "2–4 weeks remaining",
      deadline: "Aug 25, 2025",
      button: "View Universities",
      image: "/courses-dashboard.png",
    },
    {
      id: 4,
      step: "Step 4 of 9",
      title: "Track your",
      highlight: "Applications",
      description:
        "Monitor application status and respond quickly to university updates.",
      estimate: "1–3 weeks remaining",
      deadline: "Sep 01, 2025",
      button: "Track Applications",
      image: "/universities-dashboard.png",
    },
    {
      id: 5,
      step: "Step 5 of 9",
      title: "Receive your",
      highlight: "Offer Letter",
      description:
        "Review your university offer, accept the admission, and proceed with the enrollment process.",
      estimate: "2–3 weeks remaining",
      deadline: "Sep 10, 2025",
      button: "View Offer Letter",
      image: "/offer-dashboard.png",
    },
    {
      id: 6,
      step: "Step 6 of 9",
      title: "Complete your",
      highlight: "Visa Process",
      description:
        "Prepare your visa documents, submit your application, and track your visa approval status.",
      estimate: "2–4 weeks remaining",
      deadline: "Sep 20, 2025",
      button: "Start Visa Process",
      image: "/visa-dashboard.png",
    },
    {
      id: 7,
      step: "Step 7 of 9",
      title: "Manage your",
      highlight: "Forex & Finance",
      description:
        "Arrange education funds, forex services, and complete your financial planning before departure.",
      estimate: "1–2 weeks remaining",
      deadline: "Sep 28, 2025",
      button: "Manage Finance",
      image: "/forex-dashboard.png",
    },
    {
      id: 8,
      step: "Step 8 of 9",
      title: "Book your",
      highlight: "Accommodation",
      description:
        "Find and secure comfortable accommodation near your university before you arrive.",
      estimate: "1 week remaining",
      deadline: "Oct 05, 2025",
      button: "Find Accommodation",
      image: "/accommodation-dashboard.png",
    },
    {
      id: 9,
      step: "Step 9 of 9",
      title: "Prepare for",
      highlight: "Pre-Departure",
      description:
        "Complete your final checklist, attend orientation, and get ready for your study abroad journey.",
      estimate: "Final preparations",
      deadline: "Oct 10, 2025",
      button: "View Checklist",
      image: "/departure-dashboard.png",
    },
  ];

  const universities = [
    {
      id: 1,
      name: "University of Toronto",
      country: "Canada",
      countryCode: "CA",
      image: "/images/university1.jpg",
      qs: "#29 QS",
      tuition: "CA$45,000/yr",
      scholarship: true,
    },
    {
      id: 2,
      name: "University of Edinburgh",
      country: "UK",
      countryCode: "GB",
      image: "/images/university2.jpg",
      qs: "#22 QS",
      tuition: "£28,500/yr",
      scholarship: true,
    },
    {
      id: 3,
      name: "University of Melbourne",
      country: "Australia",
      countryCode: "AU",
      image: "/images/university3.jpg",
      qs: "#33 QS",
      tuition: "AUD$52,000/yr",
      scholarship: false,
    },
    {
      id: 4,
      name: "University of Melbourne",
      country: "Australia",
      countryCode: "AU",
      image: "/images/university3.jpg",
      qs: "#33 QS",
      tuition: "AUD$52,000/yr",
      scholarship: false,
    },
  ];


  const currentStep =
    profileSteps.find((item) => {
      if (dashboardData?.studyAbroadJourney?.currentActiveStep == null) {
        return item.id === dashboardData?.studyAbroadJourney?.nextStep?.id
      }
      else {
        return item.id === dashboardData?.studyAbroadJourney?.currentActiveStep?.id

      }
    });


    const categories = [
  {
    title: "Find Your Course",
    description: "Explore programs that match your goals.",
    icon: BookOpen,
    image:
      "/dashboard1.png",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    link: "dashboard/programs",
  },
  {
    title: "Top Universities",
    description: "Discover top-ranked universities worldwide.",
    icon: Building2,
    image:"/dashboard2.png",
    color: "bg-orange-600",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    link: "dashboard/universities",
  },
  {
    title: "Scholarships",
    description: "Find scholarships and funding opportunities.",
    icon: GraduationCap,
    image:
      "/dashboard3.png",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    link: "dashboard/scholarships",
  },
  {
    title: "Accommodation",
    description: "Find safe & affordable stay options.",
    icon: Home,
    image:
      "/dashboard4.png",
    color: "bg-orange-600",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    link: "dashboard/accommodation",
  },
];

  


  return (
    <div className="min-h-screen p-2 md:p-1">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-2 max-w-[1600px] mx-auto">
        {/* Left Section */}
        <div className="space-y-6">
          {/* Stats Cards - Modern Grid */}
          <div className="grid grid-cols-[1.5fr_0.6fr] gap-2">
            <div>
              <section className="relative overflow-hidden rounded-[20px] border border-[#FFDCCB] bg-white shadow-[0_10px_40px_rgba(255,119,51,0.12)]">
                {/* Background Glow */}
                <div className="absolute inset-0">
                  {/* Left Orange Glow */}
                  <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-[#FF7A30]/20 blur-[120px]" />

                  {/* Top Glow */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-20 h-60 w-96 rounded-full bg-white blur-[100px]" />

                  {/* Right Cream Glow */}
                  <div className="absolute right-0 top-0 h-full w-[45%] bg-gradient-to-l from-white via-white to-transparent" />

                  {/* Bottom Glow */}
                  <div className="absolute bottom-0 left-0 h-48 w-72 rounded-full bg-[#FFE3D6]/50 blur-[100px]" />
                </div>

                <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] items-center px-6 py-6 gap-4">

                  {/* Left */}
                  <div>
                    <span className="text-[#F97316] font-semibold text-sm">
                      {currentStep?.step}
                    </span>

                    <h1 className="mt-2 text-3xl font-bold leading-tight">
                      {currentStep?.title}{" "}
                      <span className="text-[#FF6B2C]">
                        {currentStep?.highlight}
                      </span>
                    </h1>

                    <p className="mt-4 text-sm text-gray-800 max-w-xl">
                      {currentStep?.description}
                    </p>

                    <div className="flex gap-6 mt-4 text-gray-800 items-center">
                      <div className="flex gap-2 items-center">
                        <p className="text-sm font-semibold">Est.</p>
                        <p className="text-sm">{currentStep?.estimate}</p>
                      </div>

                      <div className="flex gap-2 items-center">
                        <p className="text-sm font-semibold">Next deadline</p>
                        <p className="text-sm">{currentStep?.deadline}</p>
                      </div>
                    </div>

                    <Link href={dashboardData?.studyAbroadJourney?.currentActiveStep?.route || "/"}><button
                      className="mt-10 hover:scale-103 transition-transform duration-300 px-18 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-[#FF6B2C] to-[#FF5123] hover:shadow-[0_12px_35px_rgba(255,98,41,0.45)]"
                    >
                      {currentStep?.button} &gt;
                    </button></Link>

                  </div>

                  {/* Right */}
                  <div className="relative flex justify-end items-end h-[280px]">

                    {/* Background Blob */}
                    <div
                      className="
      absolute
      right-2
      bottom-0
      h-[220px]
      w-[220px]
      rounded-t-full
      rounded-b-[80px]
      bg-gradient-to-b
      from-[#FFF3E0]
      to-[#FFFDF9]
    "
                    />



                    {/* Illustration */}
                    <img
                      src={currentStep?.image}
                      alt={currentStep?.highlight}
                      className="relative z-10 w-[380px] h-full object-contain translate-y-3"
                    />

                  </div>

                </div>
              </section>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cards.map((card, idx) => {
                const Icon = card.icon
                return (
                  <div
                    key={idx}

                    className="group relative rounded-2xl border border-[#ECECEC] bg-white p-2 cursor-pointer hover:shadow-md hover:shadow-orange-100 hover:scale-105 transition-all duration-300"
                  >
                    {/* Icon */}
                    <div className="absolute right-2 top-2">
                      <div
                        className={`h-8 w-8 rounded-lg   flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 text-${card.Textcolor}`} />
                      </div>
                    </div>

                    <div className="mt-8">
                      {/* Value */}
                      <h2 className="text-[23px] font-bold leading-none text-[#151515] mt-4">
                        {card.value}
                      </h2>

                      {/* Title */}
                      <h3 className="mt-2 text-[13px] font-semibold text-[#333] leading-5">
                        {card.title}
                      </h3>

                      {/* Sub text */}
                      <p className="mt-1 text-[12px] text-[#8A8A8A]">
                        {card.subtext}
                      </p>
                    </div>

                    {/* Progress */}
                    <button onClick={() => router.push(card.link)} className="text-orange-500 mt-3 text-sm font-semibold hover:text-orange-600 transition">
                      View All
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Study Abroad Journey - Main Component */}
          <div className="overflow-hidden">
            {/* Header */}
            <div className=" py-2 border-b border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Study Abroad Journey
                  </h2>
                </div>

               
              </div>
            </div>

            {/* Horizontal Step Tracker - Desktop */}
            <div className="hidden lg:block py-8 ">
              <div className="relative">
                {/* Background Line */}
                <div className="absolute top-[22px] left-[40px] right-[40px] h-[2px] bg-gray-200 rounded-full" />
                <div
                  className="absolute top-[22px] left-[40px] h-[2px] bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${((stepTrackerSteps.findIndex(
                      (s) => s.status === "current",
                    ) +
                      1) /
                      stepTrackerSteps.length) *
                      100
                      }%`,
                  }}
                />

                <div className="relative flex gap-1 justify-between">
                  {stepTrackerSteps.map((step, idx) => {
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";
                    const isUpcoming = step.status === "upcoming";
                    const Icon = journeyIcons[idx];

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center group cursor-pointer"
                        w-full
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
                relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                transition-all duration-500
                ${isCompleted
                              ? "bg-orange-500 text-white shadow-md"
                              : isCurrent
                                ? "bg-white border-2 border-orange-400 text-orange-500 shadow-[0_0_0_6px_rgba(251,146,60,0.15)]"
                                : "bg-white border-2 border-gray-200 text-gray-600"
                            }
                group-hover:scale-105
              `}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" strokeWidth={3} />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}

                          {/* Pulse animation for current step */}
                          {isCurrent && (
                            <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-20" />
                          )}
                        </div>

                        {/* Step Info */}
                        <div className="mt-3 space-y-1">
                          <h4
                            className={`text-sm font-bold leading-tight ${isCurrent
                              ? "text-gray-900"
                              : isCompleted
                                ? "text-gray-900"
                                : "text-gray-900"
                              }`}
                          >
                            {step.name}
                          </h4>
                       

                          {/* Status Badge */}
                          {isCompleted && (
                            <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                              Completed
                            </span>
                          )}
                          {isCurrent && (
                            <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-orange-500 text-white">
                              Current
                            </span>
                          )}
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
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isCurrent
                        ? "bg-orange-50 border-orange-200"
                        : "bg-gray-50 border-gray-100"
                        }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                          ? "bg-orange-500 text-white"
                          : isCurrent
                            ? "bg-white border-2 border-orange-400 text-orange-500"
                            : "bg-white border-2 border-gray-200 text-gray-400"
                          }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" strokeWidth={3} />
                        ) : (
                          <span className="font-bold text-sm">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-bold text-sm ${isCurrent ? "text-gray-900" : "text-gray-700"
                            }`}
                        >
                          {step.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {step.description}
                        </p>
                      </div>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                          Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500 text-white">
                          Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Journey Steps Detail Cards */}
          <div className="border-t border-gray-100">
  {/* Header */}
  <div className="px-6 py-5 border-b border-gray-100">
    <div className="flex items-center gap-3 mb-1">
   
      <h2 className="text-2xl font-bold text-gray-900">Track your progress from start to finish</h2>
    </div>
  </div>

  {/* Main Content - Two Column Layout */}
  <div className="flex gap-4">
    {/* Left Column - Journey Steps */}
    <div className="flex-1 ">
      {/* Column Headers */}
      <div className="flex items-center px-6 py-3 border-b border-gray-100 bg-gray-50/30">
        <div className="w-10"></div> {/* Spacer for timeline */}
        <div className="flex-1">
          <span className="text-base font-semibold text-gray-700">Step</span>
        </div>
        <div className="w-44 text-right">
          <span className="text-base font-semibold text-gray-700">Progress / Details</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="relative px-6 ">
        {/* Continuous Vertical Timeline Line */}
        <div 
          className="absolute left-[25px] top-10 bottom-0 w-[2px] bg-gray-200 z-0"
          style={{ transform: 'translateX(0)', willChange: 'transform' }}
        />

        <div className="divide-y divide-gray-100">
          {steps.map((item, idx) => {
            const isCompleted = item.status === "completed";
            const isCurrent = item.status === "current";
            const isUpcoming = item.status === "upcoming";

           

            return (
              <div
                key={idx}
                className={`
                  group relative flex items-center gap-4 py-5 px-2 transition-all duration-300 cursor-pointer hover:bg-orange-50
                  ${isCurrent ? "bg-orange-50 -mx-2 px-4 rounded-lg" : ""}
                `}
                onClick={() => {
                  if (!isUpcoming && item.link && item.link !== "#") {
                    router.push(item.link);
                  }
                }}
              >
                {/* Numbered Circle */}
                <div className="relative flex-shrink-0 z-10 ml-[-24px]">
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white
                      ${isCompleted || isCurrent
                        ? "bg-[#f26d44] text-white"
                        : "bg-gray-300 text-white"
                      }
                    `}
                  >
                    {idx + 1}
                  </div>
                </div>

                {/* Status Icon */}
               <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ">
  <span className="text-[22px] leading-none">
    {idx === 0 ? (
      "👤"
    ) : idx === 1 ? (
      "🌍"
    ) : idx === 2 ? (
      "📚"
    ) : idx === 3 ? (
      "🏫"
    ) : idx === 4 ? (
      "📞"
    ) : idx === 5 ? (
      "📄"
    ) : idx === 6 ? (
      "💰"
    ) : idx === 7 ? (
      "🏠"
    ) : (
      "📋"
    )}
  </span>
</div>

                {/* Title & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className={`font-semibold text-base ${
                      isCompleted ? "text-gray-800" : isCurrent ? "text-gray-900" : "text-gray-800"
                    }`}>
                      {item.title}
                    </h3>

                    {/* Critical Badge */}
                    {item.critical && !isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[#f26d44] border border-rose-200 whitespace-nowrap">
                        <AlertCircle className="w-2.5 h-2.5" />
                        Action Required
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {item.desc && (
                    <p className="text-base text-gray-500 mt-0.5">{item.desc}</p>
                  )}

                  {/* Progress Bar */}
                  {isCurrent && item.progress !== "Not Booked" && item.progress.includes("%") && (
                    <div className="mt-2 w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-orange-400 to-orange-500"
                        style={{ width: item.progress }}
                      />
                    </div>
                  )}
                </div>

                {/* Progress / Details Text */}
                <div className="flex-shrink-0 w-32 text-right">
                  {isCompleted ? (
                    <span className="text-base font-semibold text-[#f26d44]">Completed</span>
                  ) : isCurrent ? (
                    <span className="text-base font-semibold text-[#f26d44]">In Progress</span>
                  ) : (
                    <span className="text-base text-gray-400">Upcoming</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Right Column - Progress Summary */}
    <div className="w-80 p-6 bg-orange-100/30 h-full">
      <h3 className="text-lg font-bold text-[#f26d44] mb-6">Progress Summary</h3>

      {/* Semi-Circular Progress Gauge */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-48 h-24 overflow-hidden mb-2">
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            {/* Background arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              values=""
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#f14e1d"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset={125.6 - (125.6 * dashboardData?.studyAbroadJourney?.overallProgress) / 100}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            <span className="text-4xl font-bold text-[#f26d44]">{dashboardData?.studyAbroadJourney?.overallProgress}%</span>
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">Overall Progress</p>
        <p className="text-xs text-gray-500">{dashboardData?.studyAbroadJourney?.completedSteps} of {dashboardData?.studyAbroadJourney?.totalSteps} Steps Completed</p>
      </div>

      {/* Stats Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#f26d44] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-gray-900">{dashboardData?.studyAbroadJourney?.completedSteps}</span>
            <span className="text-gray-500 ml-1">({Math.round((dashboardData?.studyAbroadJourney?.completedSteps / dashboardData?.studyAbroadJourney?.totalSteps) * 100)}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-[#f26d44] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#f26d44]"></div>
            </div>
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-gray-900">{dashboardData?.studyAbroadJourney?.currentActiveStep ? 1 : 0}</span>
            <span className="text-gray-500 ml-1">({dashboardData?.studyAbroadJourney?.currentActiveStep?.progress}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-sm text-gray-700">Upcoming</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-gray-900">{dashboardData?.studyAbroadJourney?.totalSteps - dashboardData?.studyAbroadJourney?.completedSteps}</span>
            <span className="text-gray-500 ml-1">({Math.round(((dashboardData?.studyAbroadJourney?.totalSteps - dashboardData?.studyAbroadJourney?.completedSteps) / dashboardData?.studyAbroadJourney?.totalSteps) * 100)}%)</span>
          </div>
        </div>
      </div>

      {/* Next Step */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Next Step</h4>
        <div className="bg-orange-200/20 border border-orange-100 rounded-lg p-4 flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-200/40 flex items-center justify-center">
            <Phone className="w-6 h-6 text-[#f26d44]" strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="text-sm font-bold text-gray-900 mb-0.5">Offer Letter</h5>
            <p className="text-xs text-gray-600">Receive offer letter from universities</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
          </div>

         

           <section className=" bg-gray-50">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(255,119,51,0.12)] hover:shadow-xl transition-all duration-300 border-t-6 border-t-[#FF6B2C] border border-[#FFDCCB]"
            >
              {/* Icon Section */}
              <div className="px-4 py-2">
                <div
                  className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 ">
                  {category.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {category.description}
                </p>

                <a
                  href={category.link}
                  className={`inline-flex items-center gap-2 ${category.textColor} font-semibold text-sm group-hover:gap-3 transition-all duration-300`}
                >
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Image Section */}
              <div className="relative h-27 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover rounded-2xl  transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Rigthsidebar userData={dashboardData} />
        </div>
      </div>
    </div>
  );
}
