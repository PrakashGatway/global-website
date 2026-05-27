"use client";

import { useEffect, useState } from "react";
import { useGlobal } from "@/src/statecontext";
import {
  Award,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  FileLock,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

export const Rigthsidebar = () => {
  const router = useRouter();
  const { profile } = useGlobal();

  const [universities, setUniversities] = useState<any[]>([]);
  const [loading ,setLoading] = useState<boolean>();


  const [upcomingDeadlines] = useState([
    {
      title: "Application Deadline",
      date: "May 30, 2026",
      color: "text-red-600",
    },
    {
      title: "Document Submission",
      date: "June 15, 2026",
      color: "text-orange-600",
    },
    {
      title: "Visa Appointment",
      date: "July 10, 2026",
      color: "text-blue-600",
    },
  ]);

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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">
            Your Counselor
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-600 font-medium">
              Online
            </span>
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
            <h4 className="font-semibold text-gray-900">
              {profile?.assignto?.name || "Sarah Johnson"}
            </h4>

            <p className="text-sm text-gray-500">
              Senior Study Abroad Expert
            </p>

            <p className="text-xs text-green-600 mt-1">
              ⭐ 4.9 (128 reviews)
            </p>
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

          <button className="text-xs text-[#F26D44] hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {upcomingDeadlines.map((deadline, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />

                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {deadline.title}
                  </p>

                  <p className={`text-xs ${deadline.color}`}>
                    {deadline.date}
                  </p>
                </div>
              </div>

              <button className="text-xs text-gray-400 hover:text-[#F26D44]">
                Remind me
              </button>
            </div>
          ))}
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
                onClick={() => router.push(action.link)}
                className="group flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div
                  className={`p-2.5 rounded-xl ${action.color} transition-all group-hover:scale-110`}
                >
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
  );
};