"use client";

import Image from "next/image";
import {
  Bell,
  MessageCircle,
  Search,
  Menu,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { useGlobal } from "@/src/statecontext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

// const steps = [
//   "Profile",
//   "Country",
//   "Course",
//   "University",
//   "Offer Letter",
//   "Visa",
//   "Finance",
//   "Accommodation",
//   "Pre-Departure",
// ];


// const isCompleted = step.status === "completed";
// const isCurrent = step.status === "current";
// const isUpcoming = step.status === "upcoming";

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
                  statusColor: "green",
                  icon: "user",
                  progress: "100%",
                  progressLabel: "",
                  action: "View Details",
                  actionType: "secondary",
                  link : "/dashboard/settings"
                },
                {
                  step: 2,
                  title: "Country Shortlisting",
                  desc: "Shortlist the best countries based on your profile and preferences",
                  status: "current",
                  statusColor: "green",
                  icon: "globe",
                  progress: "3",
                  progressLabel: "Countries\nShortlisted",
                  action: "View Countries",
                  actionType: "secondary",
                  link : "/dashboard/countrys"
                },
                {
                  step: 3,
                  title: "Course Shortlisting",
                  desc: "Shortlist courses that match your career goals and profile",
                  status: "upcoming",
                  statusColor: "green",
                  icon: "book",
                  progress: "4",
                  progressLabel: "Courses\nShortlisted",
                  action: "View Courses",
                  actionType: "secondary",
                  link : "/dashboard/countrys"
                },
                {
                  step: 4,
                  title: "University Shortlisting & Applications",
                  desc: "Select universities and submit your applications",
                  status: "upcoming",
                  statusColor: "blue",
                  icon: "university",
                  progress: "3 / 6",
                  progressLabel: "Applications\nSubmitted",
                  action: "View Applications",
                  actionType: "secondary",
                  link : "/dashboard/universities"
                },
                {
                  step: 5,
                  title: "Offer Letter",
                  desc: "Receive offer letter from universities",
                  status: "upcoming",
                  statusColor: "orange",
                  icon: "document",
                  progress: "0 / 6",
                  progressLabel: "Offers\nReceived",
                  action: "View Offers",
                  actionType: "secondary",
                },
                {
                  step: 6,
                  title: "Visa Process",
                  desc: "Complete your visa application and documentation",
                  status: "upcoming",
                  statusColor: "orange",
                  icon: "visa",
                  progress: "0%",
                  progressLabel: "Completed",
                  action: "Start Visa Process",
                  actionType: "primary",
                },
                {
                  step: 7,
                  title: "Forex & Finance",
                  desc: "Manage your education loan, payments and forex requirements",
                  status: "upcoming",
                  statusColor: "orange",
                  icon: "finance",
                  progress: "0%",
                  progressLabel: "Completed",
                  action: "Manage Finance",
                  actionType: "secondary",
                },
                {
                  step: 8,
                  title: "Accommodation",
                  desc: "Book your stay and accommodation near your university",
                  status: "upcoming",
                  statusColor: "pink",
                  icon: "home",
                  progress: "Not Booked",
                  progressLabel: "",
                  action: "Explore Options",
                  actionType: "secondary",
                },
                {
                  step: 9,
                  title: "Pre-Departure",
                  desc: "Prepare for your departure and follow essential checklists",
                  status: "upcoming",
                  statusColor: "orange",
                  icon: "plane",
                  progress: "0%",
                  progressLabel: "Completed",
                  action: "View Checklist",
                  actionType: "secondary",
                },
              ]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get<any>(
          "/universities?page=1&limit=8&intake=true",
        );

        console.log(response.data.result, "data");
        setUniversities(response.data.result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []); // Empty dependency array ensures this runs once

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex1, setCurrentIndex1] = useState(0);

  console.log("loading", allProfile);

  useEffect(() => {
    if (universities.length <= 4) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= universities.length - 4 ? 0 : prevIndex + 1,
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [universities.length]);

  useEffect(() => {
    if (steps.length <= 2) return;

    const timer = setInterval(() => {
      setCurrentIndex1((prevIndex) =>
        prevIndex >= steps.length - 2 ? 0 : prevIndex + 1,
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [steps.length]);

  


useEffect(() => {
  if (!allProfile?.profile) return;

  const profile = allProfile.profile;

  setSteps(prev => {
  const newSteps = [
    {
      step: 1,
      title: "Profile Completion",
      desc: "Complete your basic profile and academic information",

      status:
        profile.profileCompletion >= 100
          ? "completed"
            : "current",

      statusColor:
        profile.profileCompletion >= 100
          ? "green"
          : profile.profileCompletion > 0
            ? "blue"
            : "gray",

      icon: "user",

      progress: `${profile.profileCompletion || 0}%`,

      progressLabel: `${
        profile.profileCompletion || 0
      }% Profile Completed`,

      action:
        profile.profileCompletion >= 100
          ? "Completed"
          : "Continue Profile",

      actionType:
        profile.profileCompletion >= 100
          ? "success"
          : "secondary",
      link : '/dashboard/settings'
    },

    // {
    //   step: 2,
    //   title: "Documents",
    //   desc: "Upload required study abroad documents",

    //   status: Object.keys(profile?.documents || {}).length >= 7 ? "completed"
    //       : "in-progress",

    //   statusColor:
    //     Object.keys(profile?.documents || {}).length > 0
    //       ? "blue"
    //       : "gray",

    //   icon: "document",

    //   progress: `${
    //     Object.keys(profile?.documents || {}).length
    //   } Uploaded`,

    //   progressLabel: "",

    //   action: "Manage Documents",

    //   actionType: "secondary",
    //   link : "/dashboard/settings#doc"
    // },

    {
      step: 6,
      title: "Visa Process",
      desc: "Complete your visa application and documentation",

      status:
        profile?.validVisas?.length > 0
          ? "completed"
          : "pending",

      statusColor:
        profile?.validVisas?.length > 0
          ? "green"
          : "gray",

      icon: "passport",

      progress: `${
        profile?.validVisas?.length || 0
      } Visa Added`,

      progressLabel: "",

      action:
        profile?.validVisas?.length > 0
          ? "View Visa"
          : "Add Visa",

      actionType: "secondary",
      link : "/dashboard/countrys"
    },
  ];

  const newStepIds = newSteps.map(s => s.step);

  return [...newSteps,
    ...prev.filter(item => !newStepIds.includes(item.step))
    
  ];
});


}, [allProfile]);


  return (
    <div className="min-h-screen bg-[#fff] flex flex-col md:flex-row">
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Cards */}
        <div className="flex flex-wrap gap-5 ">
          {[
            {
              title: "Universities Applied",
              value: "4",
              color: "bg-blue-600",
              link: "/dashboard/universities",
            },
            {
              title: "Documents Pending",
              value: "3",
              color: "bg-green-500",
              link: "/dashboard/settings",
            },
            {
              title: "Visa Status",
              value: "--",
              color: "bg-orange-500",
              link: "/dashboard/countrys",
            },
            {
              title: "Accommodation",
              value: "--",
              color: "bg-purple-500",
              link: "/dashboard/settings",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border p-2 flex items-center gap-4 cursor-pointer"
              onClick={() => navigate.push(card?.link)}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center text-white`}
              >
                <GraduationCap />
              </div>

              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="text-lg font-semibold">{card.value || "--"}</h2>
                <p className="text-sm text-blue-500">View all</p>
              </div>
            </div>
          ))}
        </div>

        {/* Journey - Modern Version */}
        <div className="w-full  mt-10 py-6 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-sm">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">
                    Roadmap
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  My Study Abroad Journey
                </h2>
                <p className="text-gray-500 text-base mt-2 max-w-lg">
                  Track your progress from initial research to landing at your
                  dream university
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  {allProfile?.profileCompletion}% Complete
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Container */}
          <div className="max-w-6xl mx-auto relative">
            {/* Navigation Arrows (Mobile) */}
            <button
              onClick={() => setCurrentIndex1(Math.max(0, currentIndex1 - 1))}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${currentIndex1 === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() =>
                setCurrentIndex1(Math.min(steps.length - 1, currentIndex1 + 1))
              }
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${currentIndex1 >= steps.length - 4 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Steps Track */}
            <div className="overflow-hidden px-12">
              <div
                className="flex items-start transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex1 * 200}px)`,
                }}
              >
                {steps.map((step, index) => {
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";
                  const isUpcoming = step.status === "upcoming";

                  return (
                    <div
                      key={index}
                      className="flex items-start flex-shrink-0 group"
                    >
                      {/* Step Node */}
                      <div className="flex flex-col items-center w-[180px]">
                        {/* Icon Circle */}
                        <div className="relative">
                          {/* Glow effect for current step */}
                          {isCurrent && (
                            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
                          )}

                          <div
                            className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? "border-green-500 bg-green-50 text-green-600 shadow-lg shadow-green-100"
                                : isCurrent
                                  ? "border-green-500 bg-white text-green-600 shadow-lg shadow-green-100 ring-4 ring-green-50"
                                  : "border-gray-200 bg-white text-gray-400 group-hover:border-gray-300"
                            }`}
                          >
                            {isCompleted ? (
                              <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <span className="text-lg font-bold">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div
                            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center
                               justify-center text-[10px] font-bold ${
                                 isCompleted
                                   ? "bg-green-500 text-white"
                                   : isCurrent
                                     ? "bg-blue-500 text-white"
                                     : "bg-gray-200 text-gray-500"
                               }`}
                          >
                            {isCompleted ? "✓" : isCurrent ? "!" : "○"}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4 text-center">
                          <h3
                            className={`text-sm font-bold mb-1 ${
                              isCompleted
                                ? "text-gray-900"
                                : isCurrent
                                  ? "text-green-700"
                                  : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p
                            className={`text-xs ${
                              isCompleted
                                ? "text-green-600 font-medium"
                                : isCurrent
                                  ? "text-blue-600 font-medium"
                                  : "text-gray-400"
                            }`}
                          >
                            {isCompleted
                              ? "Completed"
                              : isCurrent
                                ? "In Progress"
                                : "Upcoming"}
                          </p>
                        </div>
                      </div>

                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className="w-20 h-16 flex items-center justify-center mt-2">
                          <div className="relative w-full h-[3px] bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out ${
                                isCompleted ? "bg-green-500 w-full" : "w-0"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Journey Overview - Exact Match to Design */}
        <div className="bg-white rounded-2xl border border-gray-200 mt-8 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Journey Overview
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-0">
              {steps.map((item, i, arr) => {
                const isCompleted = item.status === "completed";
                const isInProgress = item.status === "upcoming";
                const isLast = i === arr.length - 1;

                // Status badge styles
                const statusStyles = {
                  green: "bg-green-50 text-green-700 border-green-200",
                  blue: "bg-blue-50 text-blue-700 border-blue-200",
                  orange: "bg-orange-50 text-orange-700 border-orange-200",
                  pink: "bg-pink-50 text-pink-600 border-pink-200",
                };

                // Step circle colors
                const stepColors = {
                  green: "bg-green-500",
                  blue: "bg-blue-600",
                  orange: "bg-orange-500",
                  pink: "bg-pink-500",
                };

                return (
                  <div key={i} className="relative flex gap-4 group">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className="absolute left-5 top-10 w-[2px] h-[calc(100%+16px)] bg-gray-200" />
                    )}

                    {/* Left: Step Number + Icon */}
                    <div className="flex-shrink-0 flex flex-col items-center z-10">
                      <div
                        className={`w-10 h-10 rounded-full ${stepColors[item.statusColor]} mt-5
              text-white flex items-center justify-center font-bold text-sm shadow-sm`}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          item.step
                        )}
                      </div>
                    </div>

                    {/* Middle: Content Card */}
                    <div className="flex-1 pb-6">
                      <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 bg-white">
                        <div className="flex items-start justify-between gap-4">
                          {/* Title Section */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900 text-base">
                                {item.title}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[item.statusColor]}`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>

                          {/* Progress Stats */}
                          <div className="flex-shrink-0 text-right min-w-[100px]">
                            <div
                              className={`text-lg font-bold ${item.statusColor === "pink" ? "text-pink-500" : "text-gray-900"}`}
                            >
                              {item.progress}
                            </div>
                            {item.progressLabel && (
                              <div className="text-xs text-gray-500 mt-0.5 whitespace-pre-line leading-tight">
                                {item.progressLabel}
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="flex-shrink-0">
                            <button
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                item.actionType === "primary"
                                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              }`}
                            >
                              {item.action}
                            </button>
                          </div>

                          {/* Chevron */}
                          <button className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
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
      </main>

      <aside className="w-[320px] p-6 space-y-6">
        {/* Counselor */}
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Your Counselor</h3>
            <span className="text-green-500 text-sm">● Online</span>
          </div>

          <div className="flex items-center gap-4 mt-5">
            {profile?.assignto?.profileImage ? (
              <Image
                src={profile?.assignto?.profileImage || ""}
                alt="counselor"
                width={70}
                height={70}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="rounded-full bg-gray-200 text-gray-600 font-semibold flex items-center justify-center h-[50px] w-[50px] text-2xl">
                {profile?.assignto?.name?.split("")[0]}
              </div>
            )}

            <div>
              <h4 className="font-semibold">{profile?.assignto?.name}</h4>
              <p className="text-sm text-gray-500">Study Abroad Expert</p>
            </div>
          </div>

          <button className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl font-semibold">
            Chat Now
          </button>
        </div>

        {/* Deadlines */}
        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-bold text-lg mb-4"> Deadlines</h3>

          <div className="h-[340px] overflow-auto  bg-white relative">
            <div
              className="flex flex-col gap-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${currentIndex * 88}px)` }} // 88px = Card height + Gap
            >
              {universities.map((item, i) => (
                <div
                  key={i}
                  className="h-[72px] flex-none bg-gray-50 p-3 rounded-lg border flex flex-col justify-center"
                >
                  <div className="flex gap-2">
                    <img src={item?.uni_logo} alt="logo" className="h-8 w-8" />{" "}
                    <p className="font-medium truncate">{item?.name}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {item?.intakes.join(", ") || "--"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>

          <div className="space-y-3">
            {[
              "Upload Documents",
              "Book Counseling Call",
              "Check Visa Requirements",
              "Explore Scholarships",
            ].map((action, i) => (
              <button
                key={i}
                className="w-full bg-gray-100 hover:bg-gray-200 transition px-4 py-3 rounded-xl text-left font-medium"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
