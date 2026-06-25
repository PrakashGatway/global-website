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
import { Rigthsidebar } from "@/components/dashboard/application/rightsidebar";



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
      title: "Documents Uploaded",
      value: "3",
      color: "from-green-500 to-green-600",
      icon: FileText,
      link: "/dashboard/settings#doc",
      trend: "View all",
    },
    {
      title: "Universities Applied",
      value: "4",
      color: "from-blue-500 to-blue-600",
      icon: Building2,
      link: "/dashboard/universities",
      trend: "View all",
    },

    {
      title: "Visa Status",
      value: "Pending",
      color: "from-orange-500 to-orange-600",
      icon: FileLock,
      link: "/dashboard/visa",
      trend: "View Details",
    },
    {
      title: "Applications",
      value: "4",
      color: "from-purple-500 to-purple-600",
      icon: FileCheck,
      link: "/dashboard/applications",
      trend: "View all",
    },
  ]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<any>(
          "/universities?page=1&limit=6&intake=true",
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
          status:
            profileCompletion >= 100
              ? "completed"
              : profileCompletion > 0
                ? "current"
                : "upcoming",
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
          status:
            profileData.otherDetails?.countries_shortlist?.length > 0
              ? "completed"
              : profileData.otherDetails?.countries_shortlist?.length < 0
                ? "current"
                : "upcoming",
          icon: "globe",
          progress:
            profileData.otherDetails?.countries_shortlist?.length || "0",
          progressLabel: "Countries Shortlisted",
          action: "View Countries",
          link: "/dashboard/countries",
        },
        {
          step: 3,
          title: "Course Shortlisting",
          desc: "Shortlist courses that match your career goals",
          status:
            profileData.otherDetails?.categorie_shortlist?.length > 0
              ? "current"
              : "upcoming",
          icon: "globe",
          progress:
            profileData.otherDetails?.categorie_shortlist?.length || "0",
          progressLabel: "Course Shortlisted",
          action: "View Course",
          link: "/dashboard/countries",
        },
        {
          step: 6,
          title: "Visa Process",
          desc: "Complete your visa application and documentation",
          status:
            profileData?.validVisas?.length > 0 ? "completed" : "upcoming",
          icon: "visa",
          progress: `${profileData?.validVisas?.length || 0} Visa Added`,
          progressLabel: "",
          action:
            profileData?.validVisas?.length > 0 ? "View Visa" : "Add Visa",
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



  // Step tracker data for the compact view
  const stepTrackerSteps = [
    { name: "Profile Completed", status: "current" },
    { name: "Country Shortlisted", status: "upcoming" },
    { name: "Course Shortlisted", status: "upcoming" },
    { name: "University Applications", status: "upcoming" },
    { name: "Offer Letter", status: "upcoming" },
    { name: "Visa Process", status: "upcoming" },
    { name: "Forex & Finance", status: "upcoming" },
    { name: "Accommodation", status: "upcoming" },
    { name: "Pre-Departure", status: "upcoming" },
  ];

  console.log(allProfile);

  return (
    <div className="min-h-screen bg-white">
      {allProfile == null ? (
        <div>Loading ...</div>
      ) : (
        <>
          {allProfile?.data?.role === "counsellor" ? (
            <DashboardCounsellor />
          ) : (
            <>
              {" "}
              <div className=" grid grid-cols-[70%_30%] gap-4">
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
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-2">
                    {/* Documents Uploaded */}
                    <div className="group bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-transparent">
                      <div className="grid grid-cols-[35%_65%]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs font-medium text-gray-500">
                            Documents Uploaded
                          </h3>
                          <p className="text-lg font-bold text-gray-900 mb-2">
                            0
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Universities Applied */}
                    <div
                      onClick={() => navigate.push("/dashboard/universities")}
                      className="group bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-transparent"
                    >
                      <div className="grid grid-cols-[35%_65%]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs font-medium text-gray-500">
                            Universities Applied
                          </h3>
                          <p className="text-lg font-bold text-gray-900 mb-2">
                            0
                          </p>
                          <p className="text-xs text-orange-500 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            View all
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Visa Status */}
                    <div
                      onClick={() => navigate.push("/dashboard/visa")}
                      className="group bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-transparent"
                    >
                      <div className="grid grid-cols-[35%_65%]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                            <FileLock className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs font-medium text-gray-500">
                            Visa Status
                          </h3>
                          <p className="text-lg font-bold text-gray-900 mb-2">
                            Pending
                          </p>
                          <p className="text-xs text-orange-500 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            View Details
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Applications */}
                    <div
                      onClick={() => navigate.push("/dashboard/applications")}
                      className="group bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-transparent"
                    >
                      <div className="grid grid-cols-[35%_65%]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                            <FileCheck className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs font-medium text-gray-500">
                            Applications
                          </h3>
                          <p className="text-lg font-bold text-gray-900 mb-2">
                            0
                          </p>
                          <p className="text-xs text-orange-500 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            View all
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step Tracker - Compact Horizontal View */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-6 pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-[24px] font-bold text-[#111827]">
                            My Study Abroad Journey
                          </h2>
                          <p className="text-sm text-[#6B7280] mt-1">
                            Track your progress from start to finish
                          </p>
                        </div>

                        <div className="bg-[#F3F4F6] rounded-xl px-3 py-2 flex items-center gap-3">
                          <span className="text-xs font-semibold text-[#374151]">
                            Overall Progress
                          </span>

                          <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {Math.round(
                              (stepTrackerSteps.filter(
                                (s) => s.status === "completed",
                              ).length /
                                stepTrackerSteps.length) *
                              100,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Desktop */}
                      <div className="hidden lg:block">
                        <div className="relative">
                          {/* Background Line */}
                          <div className="absolute top-6 left-0 right-0 h-[2px] bg-[#DCE3F1]" />

                          {/* Active Line */}
                          <div
                            className="absolute top-6 left-0 h-[2px] bg-orange-500"
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

                          <div className="relative flex justify-between">
                            {stepTrackerSteps.map((step, idx) => {
                              const isCompleted = step.status === "completed";
                              const isCurrent = step.status === "current";

                              return (
                                <div
                                  key={idx}
                                  className="flex flex-col items-center text-center max-w-[110px]"
                                >
                                  {/* Circle */}
                                  <div
                                    className={`
                    relative z-10
                    w-12 h-12 rounded-full bg-white
                    flex items-center justify-center
                    transition-all duration-300
                    ${isCompleted
                                        ? "border-2 border-orange-500"
                                        : isCurrent
                                          ? "border-[3px] border-primary shadow-[0_0_0_6px_rgba(37,99,235,0.10)]"
                                          : "border-2 border-[#D1D5DB]"
                                      }
                  `}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle
                                        size={20}
                                        className="text-orange-500"
                                      />
                                    ) : (
                                      <span
                                        className={`font-semibold text-sm ${isCurrent
                                            ? "text-primary"
                                            : "text-[#9CA3AF]"
                                          }`}
                                      >
                                        {idx + 1}
                                      </span>
                                    )}
                                  </div>

                                  {/* Step Name */}
                                  <h4
                                    className={`mt-4 text-xs font-semibold leading-tight ${isCurrent
                                        ? "text-primary"
                                        : isCompleted
                                          ? "text-[#111827]"
                                          : "text-[#6B7280]"
                                      }`}
                                  >
                                    {step.name}
                                  </h4>

                                  {/* Status */}
                                  <p
                                    className={`text-xs mt-1 ${isCurrent
                                        ? "text-primary font-medium"
                                        : isCompleted
                                          ? "text-[#374151]"
                                          : "text-[#9CA3AF]"
                                      }`}
                                  >
                                    {isCompleted
                                      ? "Completed"
                                      : isCurrent
                                        ? "In Progress"
                                        : "Upcoming"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="grid grid-cols-2 gap-4 lg:hidden">
                        {stepTrackerSteps.map((step, idx) => {
                          const isCompleted = step.status === "completed";
                          const isCurrent = step.status === "current";

                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100"
                            >
                              <div
                                className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isCompleted
                                    ? "bg-green-500 text-white"
                                    : isCurrent
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 text-gray-500"
                                  }
              `}
                              >
                                {isCompleted ? (
                                  <CheckCircle size={16} />
                                ) : (
                                  idx + 1
                                )}
                              </div>

                              <div>
                                <p className="font-medium text-sm">
                                  {step.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {isCompleted
                                    ? "Completed"
                                    : isCurrent
                                      ? "In Progress"
                                      : "Upcoming"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      {/* Journey Roadmap - Detailed view */}
                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                          <h2 className="text-lg font-bold text-[#1E293B]">
                            Journey Overview
                          </h2>
                        </div>

                        <div className="relative">
                          {/* Vertical Line */}
                          <div className="absolute left-[37px] top-8 bottom-8 w-[2px] bg-gray-200"></div>

                          {steps.map((item, idx) => {
                            const isCompleted = item.status === "completed";
                            const isCurrent = item.status === "current";

                            const circleColors = [
                              "bg-orange-500",
                              "bg-green-500",
                              "bg-green-500",
                              "bg-blue-600",
                              "bg-violet-500",
                              "bg-red-500",
                              "bg-cyan-500",
                              "bg-pink-500",
                              "bg-purple-500",
                            ];

                            return (
                              <div
                                key={idx}
                                className="relative flex items-center px-6 py-5  last:border-b-0"
                              >
                                {/* Step Number */}
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold
  ${item.status === "completed"
                                      ? "bg-green-500"
                                      : item.status === "current"
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                    }`}
                                >
                                  {item.step}
                                </div>

                                {/* Small Status Icon */}
                                <div className="ml-6">
                                  <div
                                    className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${isCompleted
                                        ? "bg-orange-50"
                                        : isCurrent
                                          ? "bg-blue-50"
                                          : "bg-gray-50"
                                      }
              `}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-4 h-4 text-orange-500" />
                                    ) : (
                                      <span
                                        className={`text-sm font-bold ${isCurrent
                                            ? "text-blue-600"
                                            : "text-gray-400"
                                          }`}
                                      >
                                        {item.step}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-[#1E293B] text-[15px]">
                                      {item.title}
                                    </h3>

                                    <span
                                      className={`
                  px-2 py-[2px] rounded text-[10px] font-medium
                  ${isCompleted
                                          ? "bg-green-100 text-green-600"
                                          : isCurrent
                                            ? "bg-orange-100 text-orange-600"
                                            : "bg-red-100 text-red-600"
                                        }
                `}
                                    >
                                      {isCompleted
                                        ? "Completed"
                                        : isCurrent
                                          ? "In Progress"
                                          : "Pending"}
                                    </span>
                                  </div>

                                  <p className="text-xs text-gray-500 mt-1">
                                    {item.desc}
                                  </p>
                                </div>

                                {/* Progress */}
                                <div className="w-[140px]">
                                  <div
                                    className={`font-bold text-[18px]
              ${item.progress === "Not Booked"
                                        ? "text-red-500"
                                        : "text-[#111827]"
                                      }`}
                                  >
                                    {item.progress}
                                  </div>

                                  {item.progressLabel && (
                                    <div className="text-xs text-gray-500">
                                      {item.progressLabel}
                                    </div>
                                  )}
                                </div>

                                {/* Button */}
                                <div className="w-[180px] flex justify-center">
                                  <button
                                    onClick={() => navigate.push(item.link)}
                                    className="px-5 py-2 bg-orange-50 text-orange-500 rounded-md text-xs font-medium hover:bg-indigo-100"
                                  >
                                    {item.action}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Rigthsidebar />
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
              `}</style>
            </>
          )}
        </>
      )}
    </div>
  );
}
