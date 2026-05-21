"use client";

import Image from "next/image";
import {
  Bell,
  MessageCircle,
  Search,
  Menu,
  GraduationCap,
  ChevronDown,
  User,
  Globe,
  BookOpen,
  Building2,
  FileText,
  FileLock,
  DollarSign,
  Home,
  Plane,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Upload,
  Phone,
  Shield,
  Award,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  MapPin,
  Briefcase,
  CreditCard,
  Heart,
  Star,
  Users,
  Mail,
  PhoneCall,
  Video,
  MessageSquare,
  FileCheck,
  GraduationCap as GraduationIcon,
} from "lucide-react";
import { useGlobal } from "@/src/statecontext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import DashboardCounsellor from "@/components/dashboard/counsellerDashboard/dashboard";

// Step configuration with icons
const stepIcons = {
  user: User,
  globe: Globe,
  book: BookOpen,
  university: Building2,
  document: FileText,
  visa: FileLock,
  finance: DollarSign,
  home: Home,
  plane: Plane,
};

const statusColors = {
  completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: "text-green-600",
    progress: "bg-green-500",
  },
  current: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: "text-blue-600",
    progress: "bg-blue-500",
  },
  upcoming: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
    icon: "text-gray-400",
    progress: "bg-gray-300",
  },
};

export default function DashboardPage() {
  const { profile, allProfile } = useGlobal();
  const navigate = useRouter();

  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [steps, setSteps] = useState([
    {
      step: 1,
      title: "Profile Completion",
      desc: "Complete your basic profile and academic information",
      status: "completed",
      icon: "user",
      progress: "100%",
      progressLabel: "Profile Completed",
      action: "View Details",
      link: "/dashboard/settings",
    },
    {
      step: 2,
      title: "Country Shortlisting",
      desc: "Shortlist the best countries based on your profile",
      status: "current",
      icon: "globe",
      progress: "3",
      progressLabel: "Countries Shortlisted",
      action: "View Countries",
      link: "/dashboard/countries",
    },
    {
      step: 3,
      title: "Course Shortlisting",
      desc: "Shortlist courses that match your career goals",
      status: "upcoming",
      icon: "book",
      progress: "4",
      progressLabel: "Courses Shortlisted",
      action: "View Courses",
      link: "/dashboard/courses",
    },
    {
      step: 4,
      title: "University Applications",
      desc: "Select universities and submit your applications",
      status: "upcoming",
      icon: "university",
      progress: "3 / 6",
      progressLabel: "Applications Submitted",
      action: "View Applications",
      link: "/dashboard/universities",
    },
    {
      step: 5,
      title: "Offer Letter",
      desc: "Receive offer letter from universities",
      status: "upcoming",
      icon: "document",
      progress: "0 / 6",
      progressLabel: "Offers Received",
      action: "View Offers",
      link: "/dashboard/offers",
    },
    {
      step: 6,
      title: "Visa Process",
      desc: "Complete your visa application and documentation",
      status: "upcoming",
      icon: "visa",
      progress: "0%",
      progressLabel: "Visa Progress",
      action: "Start Process",
      link: "/dashboard/visa",
    },
    {
      step: 7,
      title: "Forex & Finance",
      desc: "Manage your education loan and payments",
      status: "upcoming",
      icon: "finance",
      progress: "0%",
      progressLabel: "Finance Setup",
      action: "Manage Finance",
      link: "/dashboard/finance",
    },
    {
      step: 8,
      title: "Accommodation",
      desc: "Book your stay near your university",
      status: "upcoming",
      icon: "home",
      progress: "Not Booked",
      progressLabel: "",
      action: "Explore Options",
      link: "/dashboard/accommodation",
    },
    {
      step: 9,
      title: "Pre-Departure",
      desc: "Prepare for your departure checklists",
      status: "upcoming",
      icon: "plane",
      progress: "0%",
      progressLabel: "Ready",
      action: "View Checklist",
      link: "/dashboard/predeparture",
    },
  ]);

  const [cards, setCards] = useState([
    {
      title: "Universities Applied",
      value: "4",
      color: "from-blue-500 to-blue-600",
      icon: Building2,
      link: "/dashboard/universities",
      trend: "+2 this month",
    },
    {
      title: "Documents Uploaded",
      value: "3",
      color: "from-green-500 to-green-600",
      icon: FileText,
      link: "/dashboard/settings#doc",
      trend: "80% complete",
    },
    {
      title: "Visa Status",
      value: "Pending",
      color: "from-orange-500 to-orange-600",
      icon: FileLock,
      link: "/dashboard/visa",
      trend: "Awaiting submission",
    },
    {
      title: "Applications",
      value: "4",
      color: "from-purple-500 to-purple-600",
      icon: FileCheck,
      link: "/dashboard/applications",
      trend: "2 in progress",
    },
  ]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<any>(
          "/universities?page=1&limit=6&intake=true"
        );
        setUniversities(response.data.result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!allProfile?.profile) return;

    const profileData = allProfile.profile;
    
    setCards((prev) => {
      const updatedCards = [
        {
          title: "Documents Uploaded",
          value: Object.keys(profileData?.documents || {}).length.toString(),
          color: "from-green-500 to-green-600",
          icon: FileText,
          link: "/dashboard/settings#doc",
          trend: `${Object.keys(profileData?.documents || {}).length}/10 uploaded`,
        },
      ];
      const newStepIds = updatedCards.map((s) => s.title);
      return [
        ...updatedCards,
        ...prev.filter((item) => !newStepIds.includes(item.title)),
      ];
    });

    setSteps((prev) => {
      const profileCompletion = profileData.profileCompletion || 0;
      const newSteps = [
        {
          step: 1,
          title: "Profile Completion",
          desc: "Complete your basic profile and academic information",
          status: profileCompletion >= 100 ? "completed" : profileCompletion > 0 ? "current" : "upcoming",
          icon: "user",
          progress: `${profileCompletion}%`,
          progressLabel: `${profileCompletion}% Completed`,
          action: profileCompletion >= 100 ? "Completed" : "Continue",
          link: "/dashboard/settings",
        },
        {
          step: 2,
          title: "Country Shortlisting",
          desc: "Shortlist the best countries based on your profile",
          status: profileData.otherDetails?.countries_shortlist?.length > 0 ? "current" : "upcoming",
          icon: "globe",
          progress: profileData.otherDetails?.countries_shortlist?.length || "0",
          progressLabel: "Countries Shortlisted",
          action: "View Countries",
          link: "/dashboard/countries",
        },
        {
          step: 3,
          title: "Course Shortlisting",
          desc: "Shortlist courses that match your career goals",
          status: profileData.otherDetails?.categorie_shortlist?.length > 0 ? "current" : "upcoming",
          icon: "globe",
          progress: profileData.otherDetails?.categorie_shortlist?.length || "0",
          progressLabel: "Course Shortlisted",
          action: "View Course",
          link: "/dashboard/countries",
        },
        {
          step: 6,
          title: "Visa Process",
          desc: "Complete your visa application and documentation",
          status: profileData?.validVisas?.length > 0 ? "completed" : "upcoming",
          icon: "visa",
          progress: `${profileData?.validVisas?.length || 0} Visa Added`,
          progressLabel: "",
          action: profileData?.validVisas?.length > 0 ? "View Visa" : "Add Visa",
          link: "/dashboard/visa",
        },
      ];

      const newStepIds = newSteps.map((s) => s.step);
      return [
        ...newSteps,
        ...prev.filter((item) => !newStepIds.includes(item.step)),
      ];
    });
  }, [allProfile]);

  const quickActions = [
    { title: "Upload Documents", icon: Upload, color: "bg-blue-50 text-blue-600", link: "/dashboard/settings#doc" },
    { title: "Book Counseling", icon: PhoneCall, color: "bg-purple-50 text-purple-600", link: "/dashboard/counseling" },
    { title: "Check Visa", icon: FileLock, color: "bg-orange-50 text-orange-600", link: "/dashboard/visa" },
    { title: "Scholarships", icon: Award, color: "bg-green-50 text-green-600", link: "/dashboard/scholarships" },
  ];

  const upcomingDeadlines = [
    { title: "Application Deadline", date: "May 30, 2026", color: "text-red-600" },
    { title: "Document Submission", date: "June 15, 2026", color: "text-orange-600" },
    { title: "Visa Appointment", date: "July 10, 2026", color: "text-blue-600" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", icon: CheckCircle };
      case "current":
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", icon: AlertCircle };
      default:
        return { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200", icon: Circle };
    }
  };

  const getProgressWidth = (progress: string) => {
   if (progress && typeof progress.match === 'function') {
  const match = progress.match(/\d+/);
  if (match) {
    const num = parseInt(match[0]);
    if (!isNaN(num) && num <= 100) return num;
  }
}

    return 0;
  };

  // Step tracker data for the compact view
  const stepTrackerSteps = [
    { name: "Profile Completed", status: "completed" },
    { name: "Country Shortlisted", status: "completed" },
    { name: "Course Shortlisted", status: "completed" },
    { name: "University Applications", status: "current" },
    { name: "Offer Letter", status: "upcoming" },
    { name: "Visa Process", status: "upcoming" },
    { name: "Forex & Finance", status: "upcoming" },
    { name: "Accommodation", status: "upcoming" },
    { name: "Pre-Departure", status: "upcoming" },
  ];

  console.log(allProfile)

  return (
    <div className="min-h-screen bg-white">
      {allProfile?.data?.role === "counsellor" ? (
        
        <DashboardCounsellor/>

      ):(
        <> <div className="p-4">
        {/* Welcome Section */}
        {/* <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {profile?.name?.split(" ")[0] || "Student"}! 👋
              </h1>
              <p className="text-gray-500 mt-1">
                Track your study abroad journey and stay on top of deadlines
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  {allProfile?.profileCompletion || 0}% Complete
                </span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => navigate.push(card?.link)}
                className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-transparent"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#F26D44] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
                {card.trend && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {card.trend}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Tracker - Compact Horizontal View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#F26D44]" />
              <h2 className="text-lg font-bold text-gray-900">Your Journey Progress</h2>
            </div>
          </div>
          
          <div className="p-6">
            {/* Desktop View - Horizontal Steps */}
            <div className="hidden md:block">
              <div className="flex items-start justify-between">
                {stepTrackerSteps.map((step, idx) => {
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";
                  
                  return (
                    <div key={idx} className="flex-1 relative">
                      {/* Connector Line */}
                      {idx < stepTrackerSteps.length - 1 && (
                        <div className="absolute top-5 left-1/2 w-full h-[2px] -z-10">
                          <div className={`h-full ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center text-center">
                        {/* Step Circle */}
                        <div className="relative mb-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? "bg-green-500 shadow-lg shadow-green-200"
                                : isCurrent
                                ? "bg-blue-500 shadow-lg shadow-blue-200 ring-4 ring-blue-100"
                                : "bg-gray-300"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-white text-sm font-bold">{idx + 1}</span>
                            )}
                          </div>
                          {/* Status Badge */}
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : isCurrent
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-500"
                            }`}
                          >
                            {isCompleted ? "✓" : isCurrent ? "!" : "○"}
                          </div>
                        </div>
                        
                        {/* Step Name */}
                        <p
                          className={`text-xs font-medium max-w-[100px] ${
                            isCompleted
                              ? "text-green-700"
                              : isCurrent
                              ? "text-blue-700 font-semibold"
                              : "text-gray-400"
                          }`}
                        >
                          {step.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile View - Grid Layout */}
            <div className="md:hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stepTrackerSteps.map((step, idx) => {
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";
                  
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? "bg-green-500"
                            : isCurrent
                            ? "bg-blue-500 ring-2 ring-blue-200"
                            : "bg-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          isCompleted
                            ? "text-green-700"
                            : isCurrent
                            ? "text-blue-700 font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs text-gray-600">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <span className="text-xs text-gray-600">Upcoming</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">
                    {stepTrackerSteps.filter(s => s.status === "completed").length}
                  </span>
                  <span className="text-gray-500">/</span>
                  <span className="text-gray-500">{stepTrackerSteps.length}</span>
                  <span className="text-gray-500 ml-1">Steps Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Journey Timeline (Full width on desktop) */}
          <div className="lg:col-span-2">
            {/* Journey Roadmap - Detailed view */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F26D44]" />
                  <h2 className="text-xl font-bold text-gray-900">Detailed Journey Timeline</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Track your progress from start to your dream university
                </p>
              </div>

              <div className="p-6">
                {/* Vertical Timeline */}
                <div className="relative">
                  <div className="absolute left-5 top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#F26D44] via-gray-200 to-gray-100 rounded-full" />
                  
                  <div className="space-y-6">
                    {steps.map((item, idx) => {
                      const StatusIcon = getStatusStyle(item.status).icon;
                      const isCompleted = item.status === "completed";
                      const isCurrent = item.status === "current";
                      const progressPercent = getProgressWidth(item.progress);
                      
                      return (
                        <div key={idx} className="relative flex gap-4 group">
                          <div className="relative z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCompleted
                                  ? "bg-green-500 shadow-lg shadow-green-200"
                                  : isCurrent
                                  ? "bg-blue-500 shadow-lg shadow-blue-200 ring-4 ring-blue-100"
                                  : "bg-gray-300"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                              ) : (
                                <span className="text-white text-sm font-bold">{item.step}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 pb-4">
                            <div
                              className={`rounded-xl p-4 transition-all duration-300 ${
                                isCurrent
                                  ? "bg-blue-50/50 border border-blue-200"
                                  : isCompleted
                                  ? "bg-green-50/30 border border-green-100"
                                  : "bg-gray-50 border border-gray-100"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                      {item.title}
                                    </h3>
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        isCompleted
                                          ? "bg-green-100 text-green-700"
                                          : isCurrent
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-gray-100 text-gray-500"
                                      }`}
                                    >
                                      {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                                  
                                  {progressPercent > 0 && (
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                                      <div
                                        className={`h-1.5 rounded-full transition-all duration-500 ${
                                          isCompleted
                                            ? "bg-green-500"
                                            : isCurrent
                                            ? "bg-blue-500"
                                            : "bg-gray-400"
                                        }`}
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Target className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-600">{item.progress}</span>
                                      {item.progressLabel && (
                                        <span className="text-gray-400 text-xs ml-1">
                                          {item.progressLabel}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => navigate.push(item?.link)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    isCompleted || isCurrent
                                      ? "bg-[#F26D44] text-white hover:bg-[#F26D44]/90 shadow-sm"
                                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                  }`}
                                  disabled={!isCompleted && !isCurrent}
                                >
                                  {item.action}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Counselor Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">Your Counselor</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {profile?.assignto?.profileImage ? (
                  <Image
                    src={profile?.assignto?.profileImage}
                    alt="counselor"
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="rounded-full bg-gradient-to-br from-[#F26D44] to-[#F26D44]/80 text-white font-semibold flex items-center justify-center h-16 w-16 text-2xl shadow-md">
                    {profile?.assignto?.name?.charAt(0) || "C"}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{profile?.assignto?.name || "Sarah Johnson"}</h4>
                  <p className="text-sm text-gray-500">Senior Study Abroad Expert</p>
                  <p className="text-xs text-green-600 mt-1">⭐ 4.9 (128 reviews)</p>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button className="flex-1 bg-[#F26D44] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[#F26D44]/90 transition-all flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat Now
                </button>
                <button className="flex-1 bg-white text-gray-700 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" />
                  Meet
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F26D44]" />
                  Upcoming Deadlines
                </h3>
                <button className="text-xs text-[#F26D44] hover:underline">View All</button>
              </div>

              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{deadline.title}</p>
                        <p className={`text-xs ${deadline.color}`}>{deadline.date}</p>
                      </div>
                    </div>
                    <button className="text-xs text-gray-400 hover:text-[#F26D44]">Remind me</button>
                  </div>
                ))}
              </div>
            </div>

            {/* University Deadlines Scroller */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F26D44]" />
                University Deadlines
              </h3>

              <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar">
                {universities.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">Loading deadlines...</p>
                ) : (
                  universities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                      onClick={() => navigate.push(`/dashboard/universities/${item.slug}`)}
                    >
                      {item?.uni_logo ? (
                        <img src={item.uni_logo} alt={item.name} className="h-10 w-10 rounded-lg object-contain bg-white p-1" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{item?.name}</p>
                        <p className="text-xs text-gray-500">
                          Intake: {item?.intakes?.join(", ") || "Fall 2026"}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F26D44]" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, i) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => navigate.push(action.link)}
                      className="group flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <div className={`p-2.5 rounded-xl ${action.color} transition-all group-hover:scale-110`}>
                        <ActionIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">
                        {action.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style></>
      )}
     

     
    </div>
  );
}