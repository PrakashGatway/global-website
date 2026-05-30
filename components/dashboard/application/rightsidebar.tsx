"use client";

import { useEffect, useState } from "react";
import { useGlobal } from "@/src/statecontext";
import {
  Award,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  FileLock,
  FileText,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  PhoneCall,
  Sparkles,
  Upload,
  Video,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

export const Rigthsidebar = () => {
  const router = useRouter();
  const { profile } = useGlobal();

  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>();


  const [upcomingDeadlines] = useState([
    {
      title: "Application Deadline",
      date: "May 30, 2026",
      color: "text-red-600",
      daysLeft: "2 Days Left",
    },
    {
      title: "Document Submission",
      date: "June 15, 2026",
      color: "text-orange-600",
      daysLeft: "2 Days Left",
    },
    {
      title: "Visa Appointment",
      date: "July 10, 2026",
      color: "text-blue-600",
      daysLeft: "2 Days Left",
    },
  ]);

  const recentActivities = [
  {
    title: "SOP Document Approved",
    time: "2 hours ago",
    type: "success",
  },
  {
    title: "Applied to TU Munich",
    time: "1 day ago",
    type: "university",
  },
  {
    title: "IELTS Score Uploaded",
    time: "2 days ago",
    type: "document",
  },
  {
    title: "LOR Document Uploaded",
    time: "3 days ago",
    type: "upload",
  },
  {
    title: "Fee Payment Initiated",
    time: "3 days ago",
    type: "payment",
  },
];

const getActivityIcon = (type) => {
  switch (type) {
    case "success":
      return {
        icon: Check,
        bg: "bg-green-500",
        color: "text-white",
      };

    case "university":
      return {
        icon: Building2,
        bg: "bg-blue-50",
        color: "text-blue-600",
      };

    case "document":
      return {
        icon: FileText,
        bg: "bg-purple-50",
        color: "text-purple-600",
      };

    case "upload":
      return {
        icon: Upload,
        bg: "bg-orange-50",
        color: "text-orange-600",
      };

    case "payment":
      return {
        icon: Wallet,
        bg: "bg-green-50",
        color: "text-green-600",
      };

    default:
      return {
        icon: FileText,
        bg: "bg-gray-50",
        color: "text-gray-600",
      };
  }
};

  const quickActions = [
    {
      title: "Upload Documents",
      icon: Upload,
      color: "bg-blue-50 text-blue-600",
      link: "/dashboard/settings#doc",
    },
    {
      title: "Book Counseling",
      icon: PhoneCall,
      color: "bg-purple-50 text-purple-600",
      link: "/dashboard/counseling",
    },
    {
      title: "Check Visa",
      icon: FileLock,
      color: "bg-orange-50 text-orange-600",
      link: "/dashboard/visa",
    },
    {
      title: "Scholarships",
      icon: Award,
      color: "bg-green-50 text-green-600",
      link: "/dashboard/scholarships",
    },
  ];


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

  return (
    <div className="space-y-6">
      {/* Counselor Card */}
     <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm w-full">
  {/* Header */}
  <div className="flex items-center justify-between mb-5">
    <h3 className="text-lg font-bold text-[#1E293B]">
      Your Counselor
    </h3>

    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
      <span className="text-xs font-medium text-orange-600">
        Online
      </span>
    </div>
  </div>

  {/* Profile */}
 <div className="flex items-center gap-4">
  {/* Image */}
  {profile?.assignto?.profileImage ? (
    <Image
      src={profile.assignto.profileImage}
      alt="Counselor"
      width={70}
      height={70}
      className="rounded-full object-cover border border-gray-200 flex-shrink-0"
    />
  ) : (
    <div className="h-[70px] w-[70px] rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700 flex-shrink-0">
      {profile?.assignto?.name?.charAt(0) || "P"}
    </div>
  )}

  {/* Content */}
  <div>
    <h4 className="text-[16px] font-semibold text-[#1E293B]">
      {profile?.assignto?.name || "Priya Mehta"}
    </h4>

    <p className="text-xs text-gray-500 mt-0.5">
      Study Abroad Expert
    </p>

    
  </div>
</div>

  {/* Action Icons */}
  <div className="grid grid-cols-4 gap-3 mt-1">
    <button className="h-11 w-11 mx-auto rounded-full bg-[#F7F8FC] hover:bg-[#EEF2FF] flex items-center justify-center transition">
      <MessageCircle className="w-5 h-5 text-orange-500" />
    </button>

    <button className="h-11 w-11 mx-auto rounded-full bg-[#F7F8FC] hover:bg-[#EEF2FF] flex items-center justify-center transition">
      <Mail className="w-5 h-5 text-orange-500" />
    </button>

    <button className="h-11 w-11 mx-auto rounded-full bg-[#F7F8FC] hover:bg-[#EEF2FF] flex items-center justify-center transition">
      <Phone className="w-5 h-5 text-orange-500" />
    </button>

    <button className="h-11 w-11 mx-auto rounded-full bg-[#F7F8FC] hover:bg-[#EEF2FF] flex items-center justify-center transition">
      <CalendarDays className="w-5 h-5 text-orange-500" />
    </button>
  </div>

  {/* Chat Button */}
  <button className="w-full mt-6 h-11 rounded-lg bg-secondary/80 hover:bg-primary text-white font-medium text-sm transition">
    Chat Now
  </button>
</div>

      {/* Upcoming Deadlines */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
  {/* Header */}
  <div className="flex items-center justify-between px-5 py-4">
    <h3 className="text-[18px] font-bold text-[#1E293B]">
      Upcoming Deadlines
    </h3>

    <button className="text-[13px] font-medium text-orange-500 hover:underline">
      View all
    </button>
  </div>

  {/* List */}
  <div className="px-5 pb-5">
    <div className="space-y-5">
      {upcomingDeadlines.map((deadline, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-3"
        >
          {/* Left */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon Box */}
            <div
              className={`
                h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${
                  i === 0
                    ? "bg-red-50"
                    : i === 1
                    ? "bg-green-50"
                    : i === 2
                    ? "bg-blue-50"
                    : "bg-orange-50"
                }
              `}
            >
              <Calendar
                className={`
                  h-4 w-4
                  ${
                    i === 0
                      ? "text-red-500"
                      : i === 1
                      ? "text-green-500"
                      : i === 2
                      ? "text-blue-500"
                      : "text-orange-500"
                  }
                `}
              />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-[#1E293B] truncate">
                {deadline.title}
              </h4>

              <p className="text-xs text-[#64748B] mt-1">
                {deadline.date}
              </p>
            </div>
          </div>

          {/* Days Left */}
          <div
            className={`
              text-sm font-semibold whitespace-nowrap
              ${
                i === 0
                  ? "text-red-500"
                  : i === 1
                  ? "text-orange-500"
                  : i === 2
                  ? "text-blue-500"
                  : "text-green-500"
              }
            `}
          >
            {deadline.daysLeft}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* University Deadlines */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#F26D44]" />
          University Deadlines
        </h3>

        <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="h-10 w-10 rounded-lg bg-gray-200" />

                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-2 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : universities.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No university deadlines found
            </p>
          ) : (
            universities.map((item, i) => (
              <div
                key={i}
                onClick={() =>
                  router.push(`/dashboard/universities/${item?.slug}`)
                }
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              >
                {item?.uni_logo ? (
                  <img
                    src={item?.uni_logo}
                    alt={item?.name}
                    className="h-10 w-10 rounded-lg object-contain bg-white p-1"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {item?.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    Intake:{" "}
                    {item?.intakes?.length > 0
                      ? item?.intakes?.join(", ")
                      : "Fall 2026"}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
  {/* Header */}
  <div className="flex items-center justify-between px-5 py-4">
    <h3 className="text-[18px] font-bold text-[#1E293B]">
      Recent Activity
    </h3>

    <button className="text-[13px] font-medium text-orange-500 hover:underline">
      View all
    </button>
  </div>

  {/* Activities */}
  <div className="px-5 pb-5">
    <div className="space-y-5">
      {recentActivities.map((activity, index) => {
        const {
          icon: Icon,
          bg,
          color,
        } = getActivityIcon(activity.type);

        return (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            {/* Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}
            >
              <Icon
                size={16}
                className={color}
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-[#1E293B] leading-tight">
                {activity.title}
              </h4>

              <p className="text-xs text-[#64748B] mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

      {/* Quick Actions */}
     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
  {/* Header */}
  <h3 className="text-lg font-bold text-[#1E293B] mb-4">
    Quick Actions
  </h3>

  {/* Actions */}
  <div className="space-y-3">
    {quickActions.map((action, i) => {
      const ActionIcon = action.icon;

      const rowColors = [
        "bg-purple-50",
        "bg-green-50",
        "bg-blue-50",
        "bg-pink-50",
      ];

      const iconColors = [
        "text-purple-600",
        "text-green-600",
        "text-blue-600",
        "text-pink-600",
      ];

      const arrowColors = [
        "text-purple-500",
        "text-green-500",
        "text-blue-500",
        "text-pink-500",
      ];

      return (
        <button
          key={i}
          onClick={() => router.push(action.link)}
          className={`
            w-full
            flex
            items-center
            justify-between
            px-4
            py-3
            rounded-xl
            transition-all
            duration-200
            hover:shadow-sm
            hover:scale-[1.01]
            ${rowColors[i]}
          `}
        >
          {/* Left Side */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
              <ActionIcon
                className={`w-4 h-4 ${iconColors[i]}`}
              />
            </div>

            <span className="text-sm font-medium text-[#1E293B]">
              {action.title}
            </span>
          </div>

          {/* Arrow */}
          <div
            className={`text-lg font-bold ${arrowColors[i]}`}
          >
            →
          </div>
        </button>
      );
    })}
  </div>
</div>
    </div>
  );
};