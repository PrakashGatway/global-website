"use client";

import axiosInstance from "@/app/axiosInstance";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FAQSection from "./faqPage";
import WhyChooseItaly from "./scholarship/cardSection";
import { DynamicLucideIcon } from "./DynamicLucideIcon";
import { ChevronDown } from "lucide-react";
import InnerContent from "./dom/DomParser";

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

export function Reveal({
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
  const [heroScale, setHeroScale] = useState(1.05);

  const [scholarship] = useState(initialScholarship);
  const [similar] = useState(initialSimilar);
  const [loading] = useState(false);
  const [error] = useState(initialError || "");
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

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
    <main className="bg-[#FAFAF9] [text-shadow:0_0px_0px_rgba(0,0,0,0.9)] text-neutral-900 antialiased">
      {/* ───── HERO ───── */}
      <section className="relative h-70 md:h-90 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${scholarship?.cover_photo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop'})`,
            transform: `scale(${heroScale})`,
            transition: "transform 0.1s linear",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        <div className="relative z-10 max-w-7xl px-4 mx-auto h-full flex flex-col justify-end pb-8">
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

          <Reveal delay={100}>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.15] max-w-4xl [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
              {scholarship?.title}
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <div className="text-white text-sm font-medium md:text-base mt-2 font-light line-clamp-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]"
            dangerouslySetInnerHTML={{__html: scholarship?.shortDescription}}
            />
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
                <p className="font-medium text-sm">{fact?.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── MAIN TWO-COLUMN ───── */}
      <section className="py-10">
        <div className="max-w-7xl px-4 mx-auto ">
          <div className="flex flex-col lg:flex-row gap-6">

            <div className="flex-1 min-w-0">
              {/* ─── ALL SECTIONS ─── */}
              <div className="space-y-6">
                {scholarship?.extra_content?.sections?.map((section: any, index: number) => {

                  switch (section.section_type) {
                    case "overview":
                      return (
                        <div
                          key={section._id}
                          className="border p-4 md:p-6 rounded-2xl"
                        >
                          <Reveal delay={index * 10}>
                            <h2 className="text-2xl font-semibold mb-4 text-[#1C2E5A]">
                              {section?.data?.title || section?.heading || section?.section_key}
                            </h2>
                            <InnerContent cleanedHtml={section?.data?.content || section?.content} />
                          </Reveal>
                        </div>
                      );

                    case "whyChoose":
                      return (
                        <div
                          key={section._id}
                          className="border p-4 md:p-6 rounded-2xl"
                        >
                          <Reveal delay={index * 10}>
                            <h2 className="text-2xl font-semibold mb-4 text-[#1C2E5A]">
                              {section?.data?.title || section?.heading || section?.section_key}
                            </h2>
                            <InnerContent cleanedHtml={section?.data?.subtitle || section?.content} />

                            <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-3">
                              {section?.data?.cards?.map((card: any) => <div>
                                <div className="group relative h-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(249,115,22,0.18)]">
                                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-100 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-70" />

                                  {/* <div className="relative mb-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                      <DynamicLucideIcon
                                        name={card.icon}
                                        className="h-8 w-8"
                                      />
                                    </div>
                                  </div> */}
                                  <h3 className="mb-2 text-lg font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-orange-600">
                                    {card.title}
                                  </h3>
                                  <div className="relative z-1">
                                    <InnerContent cleanedHtml={card?.subtitle || ""} />

                                  </div>

                                  {/* Bottom Decoration */}
                                  <div className="absolute bottom-0 -z-0 right-0 h-60 w-60 translate-x-38 translate-y-38 rounded-full bg-gradient-to-br from-orange-100 to-transparent transition-all duration-500 group-hover:translate-x-26 group-hover:translate-y-26" />
                                </div>
                              </div>)}
                            </div>

                          </Reveal>
                        </div>
                      );

                    case "documents":
                      return (
                        <div
                          key={section._id}
                          className=""
                        >
                          <div className="mt-6 overflow-hidden rounded-lg bg-white">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#F36D45] to-[#F36D45] px-6 py-4">
                              <h2 className="text-xl font-semibold text-white">
                                {section?.data?.title || "Documents Required"}
                              </h2>
                            </div>

                            {/* Documents */}
                            <div className="relative p-6">
                              <div className="mb-4">
                                <InnerContent cleanedHtml={section?.data?.description} />
                              </div>

                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {section?.data?.documents?.map((card: any, idx: number) => {
                                  const isOpen = openIndex === idx;
                                  if (!card.description) return (
                                    <div key={idx} className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300">
                                      <div
                                        className="flex w-full items-center justify-between p-3 transition-all duration-300"
                                      >
                                        <div className="flex items-start gap-3">
                                          <DynamicLucideIcon
                                            name={card.icon || "File"}
                                            className="h-5 w-5 mt-1 text-[#F36D45]"
                                          />

                                          <div className="font-medium text-[#1C2E5A]">
                                            <InnerContent cleanedHtml={card.title} />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )


                                  return (
                                    <div
                                      key={idx}
                                      className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300"
                                    >
                                      {/* Header */}
                                      <button
                                        onClick={() => toggleAccordion(idx)}
                                        className="flex w-full items-center justify-between p-3 text-left transition-all duration-300 hover:bg-orange-50"
                                      >
                                        <div className="flex items-center gap-3">
                                          <DynamicLucideIcon
                                            name={card.icon || "File"}
                                            className="h-5 w-5 text-[#F36D45]"
                                          />

                                          <div className="font-medium text-[#1C2E5A]">
                                            <InnerContent cleanedHtml={card.title} />
                                          </div>
                                        </div>

                                        <ChevronDown
                                          className={`h-5 w-5 text-[#F36D45] transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                      </button>

                                      {/* Content */}
                                      <div
                                        className={`grid transition-all duration-500 ease-in-out ${isOpen
                                          ? "grid-rows-[1fr] opacity-100"
                                          : "grid-rows-[0fr] opacity-0"
                                          }`}
                                      >
                                        <div className="overflow-hidden">
                                          <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                                            <InnerContent
                                              cleanedHtml={
                                                card.description ||
                                                "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>"
                                              }
                                            />
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
                      );

                    case "StepsSection":
                      return (
                        <div
                          key={section._id}
                          className="border p-4 md:p-6 rounded-2xl"
                        >
                          <Reveal delay={index * 10}>
                            <h2 className="text-2xl font-semibold mb-4 text-[#1C2E5A]">
                              {section?.data?.title || section?.heading || section?.section_key}
                            </h2>
                            <InnerContent cleanedHtml={section?.data?.subtitle || section?.content} />

                            <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-3">
                              {section?.data?.cards?.map((card: any) => <div>
                                <div className="group relative h-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(249,115,22,0.18)]">
                                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-100 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-70" />

                                  {/* <div className="relative mb-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                      <DynamicLucideIcon
                                        name={card.icon}
                                        className="h-8 w-8"
                                      />
                                    </div>
                                  </div> */}
                                  <h3 className="mb-2 text-lg font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-orange-600">
                                    {card.title}
                                  </h3>
                                  <div className="relative z-1">

                                    <InnerContent cleanedHtml={card?.subtitle || ""} />
                                  </div>


                                  {/* Bottom Decoration */}
                                  <div className="absolute bottom-0 -z-0 right-0 h-60 w-60 translate-x-38 translate-y-38 rounded-full bg-gradient-to-br from-orange-100 to-transparent transition-all duration-500 group-hover:translate-x-26 group-hover:translate-y-26" />
                                </div>
                              </div>)}
                            </div>

                          </Reveal>
                        </div>
                      );

                    case "content":
                      return (
                        <div
                          key={section._id}
                          className="border p-4 md:p-6 rounded-2xl"
                        >
                          <Reveal delay={index * 10}>
                            <h2 className="text-2xl font-semibold mb-4 text-[#1C2E5A]">
                              {section?.data?.title || section?.heading || section?.section_key}
                            </h2>
                            <InnerContent cleanedHtml={section?.data?.content || section?.content} />

                          </Reveal>
                        </div>
                      );

                    // default:
                    //   return (
                    //     <ContentSection
                    //       key={section._id}
                    //       section={section}
                    //       index={index}
                    //     />
                    //   );
                  }
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
                      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                        <div className="grid grid-cols-1 gap-3">
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

                        <div className="grid grid-cols-1 gap-3">
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
                              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            {errors.destination && <p className="text-[11px] text-red-500 font-medium">{errors.destination.message as string}</p>}
                          </div>
                        </div>

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
                  <div className="bg-white border border-neutral-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[12px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                        Similar Scholarships
                      </h4>
                      <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[12px] font-bold uppercase">
                        {allSimilar.length} Available
                      </span>
                    </div>

                    <div className="space-y-3">
                      {allSimilar.map((item: any) => (
                        <Link
                          key={item._id}
                          href={`/scholarships/${item.slug}`}
                          className="group flex border border-gray-200 bg-white hover:border-orange-300 hover:shadow-md transition-all"
                        >
                          <img
                            src={item.cover_photo || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&auto=format&fit=crop&q=80"}
                            alt={item.title}
                            className="w-26 h-26 object-cover flex-shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between px-2 py-2 bg-gray-50">

                            <h5 className="text-[15px] font-semibold text-gray-900 mt-1 line-clamp-2">
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
      <section className="relative bg-[#ee6a43] overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-0">

          {/* Text */}
          <div className="text-white relative z-10">
            <span className="text-xl !leading-snug mb-4 sm:text-3xl md:text-4xl font-semibold leading-tight"> {scholarship?.extra_content?.cta?.title || " Turn Your Dream of Studying Abroad into Reality"} </span>

            <br />
            <br />
            
            <span
              className="mt-4 text-sm sm:text-base lg:text-lg max-w-xl text-white/90"

            > {scholarship?.extra_content?.cta?.description || "From choosing the right country and university to securing scholarships, preparing your application, and obtaining your student visa, Ooshas Global provides personalized, end-to-end guidance at every stage of your study abroad journey."}</span>
            <div className="mt-4">
              <a href="/contact">
                <button className="bg-secondary hover:bg-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
                  Contact US
                </button>
              </a>
            </div>
          </div>

          {/* Decorative circle — only on lg */}
          <div className="hidden lg:flex relative h-[325px] items-center justify-center">
            <img
              src="/images/circle stand.png"
              alt=""
              className="absolute z-10 w-[90px] bottom-0"
              style={{ right: "calc(50% - 45px)" }}
            />
            <img
              src="/images/circle.png"
              alt=""
              className="w-80 xl:w-96 animate-spin [animation-duration:60s]"
            />
          </div>
        </div>

        <img
          src="/images/country-building-img.png"
          alt=""
          className="absolute bottom-0 right-0 w-2/3 sm:w-1/2 object-contain pointer-events-none"
        />
        <div className="absolute bottom-0 left-0 w-full sm:w-1/2 h-2 sm:h-3 bg-yellow-400" />
      </section>

      <FAQSection Faqres={faqres} />
    </main>
  );
}