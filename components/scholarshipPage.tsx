"use client";

import axiosInstance from "@/app/axiosInstance";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FAQSection from "./faqPage";
import WhyChooseItaly from "./scholarship/cardSection";

/* ─── Scroll Animation Hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface ScholarshipPageProps {
  initialScholarship: any;
  initialContentTabs: any[];
  initialSimilar: any[];
  faqres: any[];
  error?: string | null;
  slug: string;
}

export default function ScholarshipPage({
  initialScholarship,
  initialContentTabs,
  initialSimilar,
  faqres,
  error: initialError,
  slug,
}: ScholarshipPageProps) {

  console.log(
    initialScholarship,
    initialContentTabs,
    initialSimilar,
    "Data coming from the server"
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroScale, setHeroScale] = useState(1.05);

  const [scholarship] = useState(initialScholarship);
  const [similar] = useState(initialSimilar);
  const [loading] = useState(false);
  const [error] = useState(initialError || "");

  const [contentTabs] = useState<
    { id: string; label: string; content?: string }[]
  >(
    initialContentTabs?.length
      ? initialContentTabs
      : [{ id: "overview", label: "Overview" }]
  );

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await axiosInstance.post("/contactus", {
        subject: "Contact Form",
        type: "Website",
        fullName: data.name,
        email: data.email,
        phone: data.mobile,
        destination: data.destination,
        description: "Scholarship inquiry",
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("Message sent successfully ✅");
        reset();
      } else {
        toast.error("Failed to send message ❌");
      }
    } catch (error) {
      toast.error("Failed to send message ❌");
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const s = Math.max(1, 1.05 - window.scrollY * 0.0002);
      setHeroScale(s);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (tabId: string) => {
    setActiveTab(tabId);
    const ref = sectionRefs.current[tabId];
    if (ref) {
      const offset = 120; // Offset for sticky header
      const elementPosition = ref.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getSectionContent = (key: string) => {
    if (!scholarship?.extra_content?.sections) return null;
    const section = scholarship.extra_content.sections.find((s: any) => s.section_key === key);
    return section?.content || null;
  };

  const allSimilar = similar
    .filter((item: any) => item.slug !== slug)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h2 className="text-2xl font-semibold text-gray-800">Scholarship Not Found</h2>
          <p className="text-gray-600 mt-2">{error || "The scholarship you're looking for doesn't exist."}</p>
          <Link href="/scholarships" className="mt-4 inline-block text-orange-500 hover:underline">
            Browse all scholarships →
          </Link>
        </div>
      </div>
    );
  }

  // Get tags from scholarship data
  const getTags = () => {
    const tags = [];
    if (scholarship.fundingType) tags.push(scholarship.fundingType);
    if (scholarship.level && scholarship.level.length > 0) {
      tags.push(scholarship.level[0]);
    }
    if (scholarship.country?.name) tags.push(scholarship.country.name);
    return tags.slice(0, 3);
  };

  // Get key facts
  const getKeyFacts = () => {
    return [
      { label: "Amount", value: scholarship.amount || "N/A" },
      { label: "Delivery Mode", value: scholarship.deliveryMode || "N/A" },
      { label: "Funding Type", value: scholarship.fundingType || "N/A" },
      { label: "Intake", value: scholarship.intake || "N/A" },
      { label: "Study Mode", value: scholarship.studyMode || "N/A" },
      { label: "Deadline", value: scholarship.deadline || "N/A" },
    ];
  };

  return (
    <main className="bg-[#FAFAF9] text-neutral-900 antialiased">
      {/* ───── HERO ───── */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${scholarship.heroImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop'})`,
            transform: `scale(${heroScale})`,
            transition: "transform 0.1s linear",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl px-4 mx-auto h-full flex flex-col justify-end pb-10">
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-3">
              {getTags().map((tag, i) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    background: i === 0 ? "rgba(234,88,12,0.9)" : "rgba(255,255,255,0.12)",
                    borderColor: i === 0 ? "transparent" : "rgba(255,255,255,0.2)",
                    color: "#fff",
                    backdropFilter: i > 0 ? "blur(8px)" : "none",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.15] max-w-4xl">
              {scholarship?.title}
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-white text-sm md:text-base mt-2 font-light line-clamp-2">
              {scholarship?.shortDescription}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───── KEY FACTS STRIP ───── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto ">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
            {getKeyFacts().map((fact, index) => (
              <div
                key={fact.label}
                className={`py-4 px-3 text-center ${index < 5 ? 'border-r' : ''}`}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                  {fact.label}
                </p>
                <p className="font-medium text-sm">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── MAIN TWO-COLUMN ───── */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto ">
          <div className="flex flex-col lg:flex-row gap-6">

            <div className="flex-1 min-w-0">

              {/* <WhyChooseItaly /> */}

              {/* ─── ALL SECTIONS ─── */}
              <div className="space-y-0">

                {/* Dynamic Section Tabs */}
                {contentTabs.map((tab) => {


                  const content = getSectionContent(tab.id);
                  if (!content) return null;

                  return (
                    <div
                      key={tab.id}
                      ref={(el) => { sectionRefs.current[tab.id] = el; }}
                      className=""
                    >
                      <h2 className="text-2xl font-semibold mb-3 text-[#1C2E5A]">{tab.label}</h2>
                      <div
                        // className="prose prose-sm max-w-none text-neutral-600" 

                        className="prose max-w-none !text-lg text-slate-700 
             prose-headings:text-slate-900
             [&_ul]:list-disc 
             [&_ol]:list-decimal 
             [&_ul]:pl-5 
             [&_ol]:pl-5 
             [&_li]:my-2
             [&_p]:my-4
             [&_*]:text-lg
             "
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT SIDEBAR ─── */}
            <div className="lg:w-[340px] flex-shrink-0">
              <div className="lg:sticky lg:top-22 space-y-4">
                {/* CTA Card */}
                <div className="relative w-full max-w-md p-[3px] bg-[#f46c44] sm:ml-auto">
                  <div className="relative bg-white shadow-2xl overflow-hidden h-full">

                    {/* Top Header */}
                    <div className="absolute rounded-br-3xl top-0 left-0 bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-4 py-2 z-10">
                      <h3 className="text-white text-sm font-medium">
                        Book Your Free Consultation
                      </h3>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 flex items-center justify-center gap-8 py-2 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📚</span>
                        <span>100 + Courses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👨‍🎓</span>
                        <span>10K + Counseled</span>
                      </div>
                    </div>

                    {/* Conditional Rendering for Success State (from your first snippet) */}
                    {false ? (
                      <div className="py-10 px-6 text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto">
                          ✓
                        </div>
                        <h4 className="mt-4 text-2xl font-bold text-[#0b2545]">
                          Thank You!
                        </h4>
                        <p className="text-sm text-gray-500 mt-2">
                          Our counsellor will contact you shortly.
                        </p>
                      </div>
                    ) : (
                      /* Form with React Hook Form logic and SVG inputs (from your second snippet) */
                      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">

                        {/* Name + Mobile Row */}
                        <div className="grid grid-cols-1 gap-3">
                          {/* Name */}
                          <div className="space-y-1.5">
                            <label htmlFor="name" className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <input
                                id="name"
                                {...register("name", { required: "Name is required" })}
                                placeholder="Enter your name"
                                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                              />
                            </div>
                            {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message as string}</p>}
                          </div>

                          {/* Mobile */}
                          <div className="space-y-1.5">
                            <label htmlFor="mobile" className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                              Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <input
                                id="mobile"
                                {...register("mobile", {
                                  required: "Mobile number required",
                                  pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10 digit number" },
                                })}
                                placeholder="10-digit mobile"
                                type="tel"
                                inputMode="numeric"
                                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                              />
                            </div>
                            {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile.message as string}</p>}
                          </div>
                        </div>

                        {/* Email + Destination Row */}
                        <div className="grid grid-cols-1 gap-3">
                          {/* Email */}
                          <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <input
                                id="email"
                                {...register("email", {
                                  required: "Email required",
                                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                                })}
                                placeholder="your@email.com"
                                type="email"
                                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                              />
                            </div>
                            {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message as string}</p>}
                          </div>

                          {/* Destination */}
                          <div className="space-y-1.5">
                            <label htmlFor="destination" className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                              Destination <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <select
                                id="destination"
                                {...register("destination", { required: "Select destination" })}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] transition-all duration-200 appearance-none cursor-pointer text-gray-700 hover:border-gray-300"
                              >
                                <option value="" disabled className="text-gray-400">Select country</option>
                                {["USA", "UK", "France", "Germany", "Italy", "Dubai", "New Zealand", "Australia"].map((c) => (
                                  <option key={c} value={c.toLowerCase()}>
                                    Study In {c}
                                  </option>
                                ))}
                              </select>
                              {/* Custom Dropdown Arrow */}
                              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            {errors.destination && <p className="text-[11px] text-red-500 font-medium">{errors.destination.message as string}</p>}
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center gap-2.5 pt-1">
                          <input
                            type="checkbox"
                            id="agree"
                            {...register("agree", { required: "You must accept terms" })}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F46C44] focus:ring-[#ff6b3d]/30 cursor-pointer transition"
                          />
                          <label htmlFor="agree" className="text-[12px] text-[#0b2545] leading-tight cursor-pointer">
                            I agree to the <a href="/terms-condition" className="text-[#F46C44] font-medium hover:underline">terms & privacy policy</a>
                          </label>
                        </div>
                        {errors.agree && <p className="text-[11px] text-red-500 font-medium -mt-2">{errors.agree.message as string}</p>}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full mt-2 bg-[#F46C44] hover:bg-[#bf341f] transition-all text-white font-bold py-2.5 rounded-md text-xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2 text-base">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Similar Scholarships */}
                {allSimilar.length > 0 && (
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                        Similar Scholarships
                      </h4>
                      <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold uppercase">
                        {allSimilar.length} Available
                      </span>
                    </div>

                    <div className="space-y-4">
                      {allSimilar.map((item: any) => (
                        <Link
                          key={item._id}
                          href={`/scholarship/${item.slug}`}
                          className="group flex gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:border-orange-300 hover:shadow-md transition-all"
                        >
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&auto=format&fit=crop&q=80"}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <span className="inline-block text-[10px] font-semibold text-orange-600 uppercase tracking-wider">
                              Scholarship
                            </span>
                            <h5 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
                              {item.title}
                            </h5>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {item.fundingType || "N/A"}
                              </span>
                              <span className="text-xs font-medium text-orange-600 group-hover:translate-x-1 transition-transform">
                                View →
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection Faqres={faqres} />
    </main>
  );
}

