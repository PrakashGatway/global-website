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
  School,
} from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

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


  const [showImage, setShowImage] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowImage(true);
  }, 1800); // 1.8 sec

  return () => clearTimeout(timer);
}, []);

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
    title: "Let's complete your",
    highlight: "Profile",
    description:
      "Delays in profile completion will affect all subsequent steps including university shortlisting and applications",
    estimate: "4–6 weeks remaining",
    deadline: "Aug 15, 2025",
    button: "Start Your Profile",
    image: "/profile-dashboard.png",
    route: "/dashboard/settings",
  },
  {
    id: 2,
    step: "Step 2 of 9",
    title: "Choose your preferred",
    highlight: "Countries",
    description:
      "Without country selection, you cannot proceed with course selection and university applications",
    estimate: "3–5 weeks remaining",
    deadline: "Aug 20, 2025",
    button: "Select Countries",
    image: "/countries-dashboard.png",
    route: "/dashboard/countries",
  },
  {
    id: 3,
    step: "Step 3 of 9",
    title: "Select your desired",
    highlight: "Courses",
    description:
      "Course selection is mandatory before submitting university applications",
    estimate: "2–4 weeks remaining",
    deadline: "Aug 25, 2025",
    button: "Select Courses",
    image: "/courses-dashboard.png",
    route: "/dashboard/settings",
  },
  {
    id: 4,
    step: "Step 4 of 9",
    title: "Apply and shortlist",
    highlight: "Universities",
    description:
      "Without applications, you cannot receive offer letters or proceed with visa processing",
    estimate: "1–3 weeks remaining",
    deadline: "Sep 01, 2025",
    button: "View Applications",
    image: "/universities-dashboard.png",
    route: "/dashboard/application",
  },
  {
    id: 5,
    step: "Step 5 of 9",
    title: "Receive your university",
    highlight: "Offer Letter",
    description:
      "Offer letter is required for visa application and enrollment deposit payment",
    estimate: "2–3 weeks remaining",
    deadline: "Sep 10, 2025",
    button: "View Offer Letter",
    image: "/offer-dashboard.png",
    route: "/dashboard/application",
  },
  {
    id: 6,
    step: "Step 6 of 9",
    title: "Complete your student",
    highlight: "Visa Process",
    description:
      "Visa is mandatory for international travel and study. Delays can affect your intake enrollment",
    estimate: "2–4 weeks remaining",
    deadline: "Sep 20, 2025",
    button: "Start Visa Process",
    image: "/visa-dashboard.png",
    route: "/dashboard/visa",
  },
  {
    id: 7,
    step: "Step 7 of 9",
    title: "Arrange your",
    highlight: "Forex & Finance",
    description:
      "Financial arrangements are important for tuition fee payment and living expenses abroad",
    estimate: "1–2 weeks remaining",
    deadline: "Sep 28, 2025",
    button: "Manage Finance",
    image: "/forex-dashboard.png",
    route: "/dashboard/forex-finance",
  },
  {
    id: 8,
    step: "Step 8 of 9",
    title: "Secure your",
    highlight: "Accommodation",
    description:
      "Delaying accommodation booking may result in limited options or higher costs",
    estimate: "1 week remaining",
    deadline: "Oct 05, 2025",
    button: "Find Accommodation",
    image: "/accommodation-dashboard.png",
    route: "/dashboard/accommodation",
  },
  {
    id: 9,
    step: "Step 9 of 9",
    title: "Get ready for your",
    highlight: "Pre-Departure",
    description:
      "Pre-departure preparation ensures smooth transition to your study destination",
    estimate: "Final preparations",
    deadline: "Oct 10, 2025",
    button: "View Checklist",
    image: "/departure-dashboard.png",
    route: "/dashboard/pre-departure",
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
      image: "/dashboard2.png",
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


  const icons = [
    User,
    Globe,
    BookOpen,
    School,
    Phone,
    FileText,
    Wallet,
    House,
    ClipboardList,
  ];

  const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Creates the wave effect between hero and cards
      delayChildren: 0.1
    }
  }
};

const popInVariants = {
  hidden: {},
  visible: {
    scale: [1, 1.12, 1],
    x: [25, 12, 0], // keeps the zoom visually coming from the right
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


const buttonVariants = {
  animate: {
    rotate: [0, -3, 3, -3, 3, -2, 2, 0],
    x: [0, -2, 2, -2, 2, -1, 1, 0],
    transition: {
      duration: 1,          // Longer shake
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
};

const shineVariants = {
  animate: {
    x: ["-250%", "500%"],   // Travel completely across
    transition: {
      duration: 1,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
};



  return (
  <div className="min-h-screen p-2 md:p-4 lg:py-6 lg:px-0">
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 lg:gap-6 max-w-[1600px] mx-auto">
    
    {/* LEFT SECTION */}
    <div className="space-y-6 lg:space-y-8">
      
      {/* Stats Cards - Modern Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.6fr] gap-4 lg:gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT SIDE: Hero Card */}
        <motion.div >
          <section className=" relative z-44 overflow-visible rounded-[20px] border border-[#FFDCCB] bg-white shadow-[0_10px_40px_rgba(255,119,51,0.12)]">
            {/* Background Glow Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
              <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-[#FF7A30]/20 blur-[120px]" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-20 h-60 w-96 rounded-full bg-white blur-[100px]" />
              <div className="absolute right-0 top-0 h-full w-[45%] bg-gradient-to-l from-white via-white to-transparent" />
              <div className="absolute bottom-0 left-0 h-48 w-72 rounded-full bg-[#FFE3D6]/50 blur-[100px]" />
            </div>

            {/* Mobile: Stack | Desktop: Side-by-side */}
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_0.8fr] items-center px-4 sm:px-4 py-6 gap-6 lg:gap-4">
              
              {/* Left Content */}
              <div className="order-2 lg:order-1">
                <span className="text-[#F97316] font-semibold text-sm">
                  {currentStep?.step}
                </span>

                <h1 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight">
                  {currentStep?.title}{" "}
                  <span className="text-[#FF6B2C]">
                    {currentStep?.highlight}
                  </span>
                </h1>

                <p className="mt-3 lg:mt-4 text-sm text-gray-800 max-w-xl">
                  {currentStep?.description}
                </p>

                <div className="flex flex-wrap gap-4 lg:gap-6 mt-4 text-gray-800 items-center">
                  <div className="flex gap-2 items-center">
                    <p className="text-sm font-semibold">Est.</p>
                    <p className="text-sm">{currentStep?.estimate}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-sm font-semibold">Next deadline</p>
                    <p className="text-sm">{currentStep?.deadline}</p>
                  </div>
                </div>

                <Link href={currentStep?.route || "/"}>
                  <motion.button
                    variants={buttonVariants}
                    animate="animate"
                    style={{ boxShadow: "0 0 40px rgba(255,107,44,.7)" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden mt-6 lg:mt-10 w-full sm:w-auto px-6 sm:px-18 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B2C] to-[#FF5123] text-white font-semibold shadow-lg"
                  >
                    {/* Moving Shine */}
                    <motion.div
                      variants={shineVariants}
                      animate="animate"
                      className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-transparent via-white/90 to-transparent -skew-x-12 blur-[2px]"
                    />
                    <span className="relative z-10">
                      {currentStep?.button} &gt;
                    </span>
                  </motion.button>
                </Link>
              </div>

              {/* Right Image Area - Moves below text on mobile */}
              <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end items-center lg:items-end h-[200px] sm:h-[280px]">
                <div className="absolute right-2 bottom-0 h-[180px] sm:h-[220px] w-[180px] sm:w-[220px] rounded-t-full rounded-b-[80px] bg-gradient-to-b from-[#FFF3E0] to-[#FFFDF9]" />
                <img
                  src={currentStep?.image}
                  alt={currentStep?.highlight}
                  className="relative z-10 w-[280px] sm:w-[380px] h-full object-contain translate-y-3"
                />
              </div>
            </div>
          </section>
        </motion.div>

        {/* RIGHT SIDE: Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
              
                style={{ boxShadow: "0 10px 25px -5px rgba(255, 119, 51, 0.15)" }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-2xl border border-[#FFDCCB] bg-white p-2 cursor-pointer"
              >
                <div className="absolute right-2 top-2">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                    <Icon className={`w-5 h-5 text-${card.Textcolor}`} />
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-[23px] font-bold leading-none text-[#151515] mt-4">
                    {card.value}
                  </h2>
                  <h3 className="mt-2 text-[13px] font-semibold text-[#333] leading-5">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#8A8A8A]">
                    {card.subtext}
                  </p>
                </div>

                <button 
                  onClick={() => router.push(card.link)} 
                  className="text-orange-500 mt-3 text-sm font-semibold hover:text-orange-600 transition-colors"
                >
                  View All
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Study Abroad Journey */}
      <div className="overflow-hidden lg:block hidden">
        <div className="py-2 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Your Study Abroad Journey
          </h2>
        </div>

        {/* Horizontal Step Tracker - Desktop Only */}
        <div className="hidden lg:block py-8">
          <div className="relative">
            <div className="absolute top-[22px] left-[40px] right-[40px] h-[2px] bg-gray-200 rounded-full" />
            <div
              className="absolute top-[22px] left-[40px] h-[2px] bg-orange-500 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${((stepTrackerSteps.findIndex((s) => s.status === "current") + 1) / stepTrackerSteps.length) * 100}%`,
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
                    onClick={() => {
                      if (!isUpcoming) {
                        const route = steps[idx]?.link;
                        if (route && route !== "#") router.push(route);
                      }
                    }}
                  >
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? "bg-orange-500 text-white shadow-md" : isCurrent ? "bg-white border-2 border-orange-400 text-orange-500 shadow-[0_0_0_6px_rgba(251,146,60,0.15)]" : "bg-white border-2 border-gray-200 text-gray-600"} group-hover:scale-105`}>
                      {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : <Icon className="w-5 h-5" />}
                      {isCurrent && <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-20" />}
                    </div>
                    <div className="mt-3 space-y-1">
                      <h4 className={`text-sm font-bold leading-tight ${isCurrent || isCompleted ? "text-gray-900" : "text-gray-900"}`}>{step.name}</h4>
                      {isCompleted && <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-orange-50 text-orange-600 border border-orange-100">Completed</span>}
                      {isCurrent && <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-orange-500 text-white">Current</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Step Tracker */}
        <div className="lg:hidden px-2 sm:px-4 py-6">
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
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isCurrent ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-100"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-orange-500 text-white" : isCurrent ? "bg-white border-2 border-orange-400 text-orange-500" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                    {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : <span className="font-bold text-sm">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${isCurrent ? "text-gray-900" : "text-gray-700"}`}>{step.name}</p>
                    <p className="text-sm text-gray-500 truncate">{step.description}</p>
                  </div>
                  {isCompleted && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-100">Completed</span>}
                  {isCurrent && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500 text-white">Current</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Journey Steps Detail Cards */}
        <div className="">
          <div className="px-4 sm:px-0 py-5 border-b border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Track your progress from start to finish</h2>
          </div>

          {/* Main Content - Two Column Layout (Stacks on Mobile/Tablet) */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            
            {/* Left Column - Journey Steps */}
            <div className="flex-1 border border-gray-300">
              {/* Column Headers - Hidden on Mobile */}
              <div className="hidden sm:flex items-center px-6 py-3 border-b border-gray-100 bg-gray-50/30 text-black">
                <div className="w-10"></div>
                <div className="flex-1 lg:ml-16"><span className="text-base font-semibold ">Step</span></div>
                <div className="w-44 text-right"><span className="text-base font-semibold">Progress / Details</span></div>
              </div>

              <div className="relative px-2 sm:px-6">
                <div className="absolute left-[25px] sm:left-[33px] top-10 bottom-0 w-[2px] bg-gray-200 z-0" />
                <div className="divide-y divide-gray-100">
                  {steps.map((item, idx) => {
                    const isCompleted = item.status === "completed";
                    const isCurrent = item.status === "current";
                    const isUpcoming = item.status === "upcoming";
                    return (
                      <div
                        key={idx}
                        className={`group relative flex items-center gap-3 sm:gap-4 py-5 px-4 transition-all duration-300 cursor-pointer  ${isCurrent ? "bg-orange-50 shadow-lg  rounded-lg" : ""}`}
                        onClick={() => { if (!isUpcoming && item.link && item.link !== "#") router.push(item.link); }}
                      >
                        <div className="relative flex-shrink-0 z-10 ml-[-24px] sm:ml-[-24px]">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white ${isCompleted || isCurrent ? "bg-[#f26d44] text-white" : "bg-gray-300 text-white"}`}>
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                          {(() => { const Icon = icons[idx] || ClipboardList; return <Icon className="w-5 h-5 text-[#FF6B2C]" />; })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className={`font-semibold text-base ${isCompleted ? "text-gray-800" : isCurrent ? "text-gray-900" : "text-gray-800"}`}>{item.title}</h3>
                            {item.critical && !isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[#f26d44] border border-rose-200 whitespace-nowrap">
                                <AlertCircle className="w-2.5 h-2.5" /> Action Required
                              </span>
                            )}
                          </div>
                          {item.desc && <p className="text-sm sm:text-base text-gray-500 mt-0.5">{item.desc}</p>}
                          {isCurrent && item.progress !== "Not Booked" && item.progress.includes("%") && (
                            <div className="mt-2 w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-orange-400 to-orange-500" style={{ width: item.progress }} />
                            </div>
                          )}
                        </div>
                        <div className="hidden sm:flex flex-shrink-0 w-32 text-right">
                          {isCompleted ? <span className="text-base font-semibold text-[#f26d44]">Completed</span> : isCurrent ? <span className="text-base font-semibold text-[#f26d44]">In Progress</span> : <span className="text-base text-gray-400">Upcoming</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Progress Summary (Full Width on Mobile) */}
            <div className="w-full lg:w-80 lg:h-full p-4 sm:p-6 bg-orange-100/30 rounded-2xl lg:rounded-none">
              <h3 className="text-lg font-bold text-[#f26d44] mb-6">Progress Summary</h3>
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-48 h-24 overflow-hidden mb-2">
                  <svg className="w-48 h-48" viewBox="0 0 100 100">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f14e1d" strokeWidth="8" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * dashboardData?.studyAbroadJourney?.overallProgress) / 100} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                  </svg>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                    <span className="text-4xl font-bold text-[#f26d44]">{dashboardData?.studyAbroadJourney?.overallProgress}%</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Overall Progress</p>
                <p className="text-xs text-gray-500">{dashboardData?.studyAbroadJourney?.completedSteps} of {dashboardData?.studyAbroadJourney?.totalSteps} Steps Completed</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#f26d44] flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                    <span className="text-sm text-gray-700">Completed</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{dashboardData?.studyAbroadJourney?.completedSteps}</span>
                    <span className="text-gray-500 ml-1">({Math.round((dashboardData?.studyAbroadJourney?.completedSteps / dashboardData?.studyAbroadJourney?.totalSteps) * 100)}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-[#f26d44] flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-[#f26d44]"></div></div>
                    <span className="text-sm text-gray-700">In Progress</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{dashboardData?.studyAbroadJourney?.currentActiveStep ? 1 : 0}</span>
                    <span className="text-gray-500 ml-1">({dashboardData?.studyAbroadJourney?.currentActiveStep?.progress}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-gray-300"></div></div>
                    <span className="text-sm text-gray-700">Upcoming</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{dashboardData?.studyAbroadJourney?.totalSteps - dashboardData?.studyAbroadJourney?.completedSteps}</span>
                    <span className="text-gray-500 ml-1">({Math.round(((dashboardData?.studyAbroadJourney?.totalSteps - dashboardData?.studyAbroadJourney?.completedSteps) / dashboardData?.studyAbroadJourney?.totalSteps) * 100)}%)</span>
                  </div>
                </div>
              </div>

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

      {/* Categories Section */}
      <section className="bg-white py-8 lg:py-14 -mx-2 sm:-mx-4 lg:mx-0 px-2 sm:px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {categories.map((category, index) => (
            <div key={index} className="group bg-white border-t-4 border-orange-500 border-orange-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative w-full sm:w-32 h-40 sm:h-32 shrink-0 overflow-hidden rounded-xl">
                <Image src={category.image} alt={category.title} fill className="object-cover transition-transform duration-500 " />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-11 h-11 rounded-xl ${category.color} flex items-center justify-center shadow-md shrink-0`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{category.title}</h3>
                    <div className="w-10 h-1 rounded-full bg-orange-500 mt-1" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-6 line-clamp-3">{category.description}</p>
                <a href={category.link} className={`inline-flex items-center gap-2 mt-4 text-sm font-semibold ${category.textColor} group-hover:gap-3 transition-all`}>
                  Explore <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>

    {/* RIGHT SIDEBAR - Hidden on Mobile, Sticky on Desktop */}
    <div className="hidden lg:block lg:sticky lg:top-6 h-fit">
      <Rigthsidebar userData={dashboardData} />
    </div>
  </div>
</div>
  );
}


