"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

// --- Types & Interfaces ---
interface ConsultationFormValues {
  name: string;
  phone: string;
  email: string;
  course: string;
  city: string;
  state: string;
  agree: boolean;
}

const TABS = [
  "College Info",
  "Courses",
  "Fees",
  "Course Info",
  "Rankings",
  "Gallery",
  "Admissions",
  "Placements",
  "Reviews",
  "Acceptance Rate",
  "Scholarships",
  "Campus",
];

const COURSE_HIGHLIGHTS = [
  { icon: "🎓", label: "Degree", value: "MBA" },
  { icon: "⏳", label: "Duration", value: "1 Year (Full-time)" },
  { icon: "💼", label: "Mode", value: "On Campus" },
  { icon: "📍", label: "Location", value: "Birmingham, UK" },
  { icon: "💰", label: "Tuition Fee", value: "£22,500" },
  { icon: "📅", label: "Intake", value: "Sep 2026" },
];

const RANKING_DATA = [
  { label: "World Rank", value: "#444", source: "Shiksha" },
  { label: "UK Rank", value: "#50", source: "Shiksha" },
  { label: "Accreditation", value: "Triple Crown", source: "AACSB, AMBA, EQUIS" },
];

const OVERVIEW_POINTS = [
  "The MBA at Aston Business School is designed for professionals seeking to accelerate their career growth and develop strategic leadership skills.",
  "Ranked among the top business schools in the UK with triple accreditation (AACSB, AMBA, EQUIS).",
  "Strong industry connections with placements at companies like PwC, Deloitte, HSBC, and Jaguar Land Rover.",
  "Flexible study options including full-time, part-time, and executive MBA formats.",
  "Access to a global alumni network of over 40,000 professionals across 150+ countries.",
];


export default function CoursePage() {
  const [activeTab, setActiveTab] = useState("Course Info");
  const [heroSubmitted, setHeroSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsultationFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: "",
      city: "",
      state: "",
      agree: false,
    },
  });

  const onHeroSubmit = (data: ConsultationFormValues) => {
    console.log("Hero Form Submitted:", data);
    setHeroSubmitted(true);
    setTimeout(() => {
      setHeroSubmitted(false);
      reset();
    }, 3000);
  };

  return (
    <div className="h-full bg-gray-50  text-gray-900">
      {/* ================= HERO BANNER ================= */}
      <div className="relative w-full h-[380px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80"
          alt="Aston University Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* University Logo Card */}
        <div className="absolute top-8 left-8 bg-white rounded-xl p-4 shadow-xl flex items-center gap-3 z-10">
          <div className="w-14 h-14 bg-[#6B21A8] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">Aston University</p>
            <p className="text-xs text-gray-500">Birmingham, UK</p>
          </div>
        </div>

    

        {/* Bottom Title Area */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">MBA</h1>
          <p className="text-lg text-white/90">
            at{" "}
            <a href="#" className="text-blue-300 hover:text-blue-200 underline underline-offset-4 font-medium transition-colors">
              Aston University, Birmingham
            </a>
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-16">
        
        {/* Rating, Ranking & Actions Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
            
            {/* Left Side: Ratings & Tags */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xl font-bold text-gray-900">3.8</span>
                <span className="text-gray-400 text-lg">/5</span>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold ml-1">(27 Reviews)</a>
              </div>

              <div className="hidden sm:block w-px h-8 bg-gray-200" />

              {/* Ranking Badge */}
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Shiksha popularity ranking</span>
                  <svg className="w-3.5 h-3.5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 border-l border-amber-200 pl-3">
                  <span className="text-sm"><span className="font-bold text-gray-900">#444</span><span className="text-gray-500"> in World</span></span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm"><span className="font-bold text-gray-900">#50</span><span className="text-gray-500"> in UK</span></span>
                </div>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold ml-2 flex items-center gap-1 whitespace-nowrap">
                  View details
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>

              <div className="hidden sm:block w-px h-8 bg-gray-200" />

              {/* Tags */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Public University
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                  Aston Business School
                </span>
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <button className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-purple-200 text-purple-700 rounded-full font-semibold text-sm hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Talk to Expert
              </button>
              <button className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Brochure
              </button>
              <button className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-full font-semibold text-sm hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md">
                Rate my chance
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab ? "text-[#6B21A8]" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#6B21A8] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid - NOTE: items-start is CRITICAL for sticky to work */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (Main Content) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">MBA at Aston University</p>
                  <h2 className="text-xl font-bold text-gray-900">Overview</h2>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-5">
                The MBA program at Aston Business School is a transformative experience designed for ambitious professionals looking to advance their careers. With a strong focus on practical learning, strategic thinking, and global business perspectives, this program equips you with the skills needed to lead in today's dynamic business environment.
              </p>
              <ul className="space-y-3">
                {OVERVIEW_POINTS.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Highlights */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Highlights</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {COURSE_HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-transparent hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 group cursor-default">
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1 group-hover:text-[#6B21A8] transition-colors">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

        
          </div>

          {/* RIGHT COLUMN (Sidebar) - STICKY CONTAINER */}
          <div className="lg:col-span-4">
            {/* 
              FIX APPLIED HERE:
              1. 'sticky top-6' instead of top-10 (better spacing with navbar)
              2. Parent grid has 'items-start' so this column stretches naturally
              3. No overflow properties on parents breaking the stack
            */}
            <div className="sticky top-6 space-y-6">
              
              {/* Consultation Form Widget */}
              <div className="relative w-full p-1.5 bg-[#f46c44] rounded-2xl shadow-lg">
                <div className="relative bg-white rounded-xl overflow-hidden">
                  
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/90 px-5 py-3 rounded-tr-xl">
                    <h3 className="text-white text-base font-bold tracking-wide">Book Your Free Consultation</h3>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-center gap-6 py-3 border-b border-gray-100 text-[#0b2545] font-bold text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">📚</span>
                      <span>100+ Courses</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">👨‍🎓</span>
                      <span>10K+ Counseled</span>
                    </div>
                  </div>

                  {heroSubmitted ? (
                    <div className="py-12 px-6 text-center animate-in fade-in zoom-in duration-300">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-green-200">✓</div>
                      <h4 className="mt-5 text-2xl font-bold text-[#0b2545]">Thank You!</h4>
                      <p className="text-sm text-gray-500 mt-2">Our counsellor will contact you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onHeroSubmit)} className="p-5 space-y-3.5">
                      
                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-[#0b2545] block mb-1.5">Full Name <span className="text-red-500">*</span></label>
                          <input
                            {...register("name", { required: true })}
                            placeholder="Enter Full Name*"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ff6b3d]/30 ${errors.name ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-[#ff6b3d]"}`}
                          />
                          {errors.name && <p className="text-[10px] text-red-500 mt-1 font-medium">Required</p>}
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0b2545] block mb-1.5">Mobile No. <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            {...register("phone", { required: true, minLength: 10 })}
                            placeholder="Enter Mobile No.*"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ff6b3d]/30 ${errors.phone ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-[#ff6b3d]"}`}
                          />
                          {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-medium">Valid number required</p>}
                        </div>
                      </div>

                      {/* Email & Degree */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-[#0b2545] block mb-1.5">Email Id <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Enter Email Id*"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ff6b3d]/30 ${errors.email ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-[#ff6b3d]"}`}
                          />
                          {errors.email && <p className="text-[10px] text-red-500 mt-1 font-medium">Required</p>}
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0b2545] block mb-1.5">Degree <span className="text-red-500">*</span></label>
                          <input
                            {...register("course", { required: true })}
                            placeholder="Enter Degree*"
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ff6b3d]/30 ${errors.course ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-[#ff6b3d]"}`}
                          />
                          {errors.course && <p className="text-[10px] text-red-500 mt-1 font-medium">Required</p>}
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="text-xs font-bold text-[#0b2545] block mb-1.5">City <span className="text-red-500">*</span></label>
                        <input
                          {...register("city", { required: true })}
                          placeholder="Enter City*"
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ff6b3d]/30 ${errors.city ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-[#ff6b3d]"}`}
                        />
                        {errors.city && <p className="text-[10px] text-red-500 mt-1 font-medium">Required</p>}
                      </div>

                      {/* State */}
                      <div>
                        <label className="text-xs font-bold text-[#0b2545] block mb-1.5">State <span className="text-red-500">*</span></label>
                        <input
                          {...register("state", { required: true })}
                          placeholder="Enter State*"
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ff6b3d]/30 ${errors.state ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-[#ff6b3d]"}`}
                        />
                        {errors.state && <p className="text-[10px] text-red-500 mt-1 font-medium">Required</p>}
                      </div>

                      {/* Checkbox */}
                      <div className="flex items-start gap-2.5 pt-1">
                        <input 
                          type="checkbox" 
                          id="agree"
                          {...register("agree", { required: true })}
                          className="mt-1 w-4 h-4 accent-[#F46C44] rounded border-gray-300 cursor-pointer" 
                        />
                        <label htmlFor="agree" className="text-xs text-[#0b2545] leading-snug cursor-pointer select-none">
                          I agree to receive information from Ooshas Global.
                        </label>
                      </div>
                      {errors.agree && <p className="text-[10px] text-red-500 -mt-2 font-medium">You must agree to proceed</p>}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-[#F46C44] hover:bg-[#d65a35] active:scale-[0.98] transition-all text-white font-bold py-3 rounded-lg text-lg shadow-md shadow-orange-200 mt-2"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              </div>

         

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}