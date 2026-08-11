"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  MapPin,
  Plane,
  Search,
  Send,
  Wallet,
  Sparkles,
  CalendarDays,
  Users,
  Award,
  CircleDollarSign,
  CheckCircle,
  Eye,
  Share2,
  Heart,
  Download,
  UserCheck,
  HandHelping,
  FileCheck,
  Coins,
  PlaneTakeoff
} from "lucide-react";

import axiosInstance from "@/app/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FAQSection from "../faqPage";
import InnerContent, { BlogContent } from "../dom/DomParser";
import { useKeenSlider } from "keen-slider/react";
import { useScroll, useTransform, motion } from "framer-motion";
import NotFound from "@/app/not-found";
import { ConsultationForm, UniversityFeeCard } from "../Universitypage/WhyChooseSection";
import { useGlobal } from "@/src/statecontext";
import { DynamicLucideIcon } from "../DynamicLucideIcon";
import { CTASection } from "../country";

type CoursePageProps = {
  initialData: any | null;
  countries: any | null;
};

const iconMap: Record<string, any> = {
  GraduationCap,
  Wallet,
  Briefcase,
  Search,
  FileText,
  Send,
  CheckCircle,
  CheckCircle2,
  Plane,
  BookOpen,
  Award,
  Users,
};

function getIcon(icon?: string) {
  return iconMap[icon || ""] || Sparkles;
}

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateReadingTime(data: any) {
  let text = "";

  text += `${data?.title || ""} ${data?.description || ""} `;

  data?.content?.sections?.forEach((section: any) => {
    text += `${section?.data?.title || ""} `;
    text += `${section?.data?.content || ""} `;

    if (Array.isArray(section?.data?.cards)) {
      section.data.cards.forEach((item: any) => {
        text += `${item?.title || ""} ${item?.description || ""} `;
      });
    }

    if (Array.isArray(section?.data?.data)) {
      section.data.data.forEach((item: any) => {
        text += `${item?.title || ""} ${item?.subtitle || ""} ${item?.content || ""
          } `;
      });
    }
  });

  const words = stripHtml(text).split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

export default function CoursePage({ initialData, countries }: CoursePageProps) {
  const data = initialData;
  const { openPopup } = useGlobal();

  if (!data) {
    return (
      <NotFound />
    );
  }
  const sections = useMemo(() => {
    const result: {
      id: string;
      title: string;
    }[] = [
        {
          id: "overview",
          title:
            data?.content?.sections?.find((s: any) => s.type === "intro")?.data
              ?.title || "Overview",
        },
      ];

    data?.content?.sections?.forEach((section: any, index: number) => {
      if (section.type === "intro") return;
      if (section.type === "cta") return;

      result.push({
        id: `${section.type}-${section.id || index}`,
        title: section?.data?.title || section?.name || "Section",
      });
    });

    if (data?.roadmap?.steps?.length) {
      result.push({
        id: "journey",
        title: data.roadmap.title || "Your Journey",
      });
    }

    if (data?.topcourse?.length) {
      result.push({
        id: "top-courses",
        title: "Top Courses",
      });
    }

    if (data?.faqSection?.items?.length) {
      result.push({
        id: "faq",
        title: data.faqSection.title || "Frequently Asked Questions",
      });
    }

    return result;
  }, [data]);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      },
      {
        rootMargin: "-120px 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

      const bar = document.getElementById("course-reading-progress");

      if (bar) {
        bar.style.width = `${progress}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const animation = { duration: 40000, easing: (t) => t };

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: true,

    slides: {
      perView: 4,
      spacing: 20,
    },

    breakpoints: {
      "(max-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },

      "(max-width: 640px)": {
        slides: {
          perView: 1.3,
          spacing: 12,
        },
      },
    },

    created(s) {
      s.moveToIdx(5, true, animation);
    },

    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },

    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });

  return (
    <main className="min-h-screen bg-[#fffaf7] text-[#172033] ">
      {/* Reading progress */}
      <div className="fixed left-0 top-0 z-[1000] h-[3px] w-full bg-transparent">
        <div
          id="course-reading-progress"
          className="h-full bg-orange-400 transition-all duration-100"
          style={{ width: "0%" }}
        />
      </div>
      <section className="relative [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] overflow-visible bg-white">

        {/* ================= BACKGROUND IMAGE ================= */}
        {data.coverImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${data.coverImage})`,
              backgroundRepeat: "no-repeat",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[#071d48]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#071d48] via-[#0b2858]/75 to-transparent" />
        <div className="px-4">
          <div className="relative z-10 mx-auto max-w-7xl py-12
        ">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base lg:text-sm text-white">
                <Link href="/" className="transition hover:text-[#f26e46]">
                  Home
                </Link>

                <span className="text-white/80">›</span>

                <Link href="/course" className="transition hover:text-[#f26e46]">
                  Courses
                </Link>

                <span className="text-white/80">›</span>

                <span className="font-medium text-white">
                  {data.shortName || data.title}
                </span>
              </div>
            </div>
            <div className="grid items-center gap-6 lg:gap-10 lg:grid-cols-[1.25fr_.75fr]">

              {/* ================= LEFT CONTENT ================= */}
              <div className="max-w-4xl">
                <h1 className="max-w-4xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-white">
                  {data.title}
                </h1>

                {/* Course Information */}
                <div className="mt-4 lg:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:flex lg:flex-wrap lg:gap-x-8 lg:gap-y-5">

                  {/* Duration */}
                  {data.duration && (
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg bg-white/10">
                        <Clock3
                          size={15}
                          className="text-white lg:w-[18px] lg:h-[18px]"
                        />
                      </div>

                      <div>
                        <p className="text-[11px] sm:text-sm lg:text-sm text-white/50">
                          Duration
                        </p>

                        <p className="text-sm sm:text-sm lg:text-sm font-semibold text-white">
                          {data.duration}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Intake */}
                  {data.intake && (
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg bg-white/10">
                        <CalendarDays
                          size={15}
                          className="text-white lg:w-[18px] lg:h-[18px]"
                        />
                      </div>

                      <div>
                        <p className="text-[11px] sm:text-sm lg:text-sm text-white/50">
                          Intake
                        </p>

                        <p className="text-sm sm:text-sm lg:text-sm font-semibold text-white">
                          {data.intake}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Course Level */}
                  {data.level && (
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg bg-white/10">
                        <BookOpen
                          size={15}
                          className="text-white lg:w-[18px] lg:h-[18px]"
                        />
                      </div>

                      <div>
                        <p className="text-[11px] sm:text-sm lg:text-sm text-white/50">
                          Course Level
                        </p>

                        <p className="text-sm sm:text-sm lg:text-sm font-semibold text-white">
                          {data.level}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mode */}
                  {data.mode && (
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg bg-white/10">
                        <GraduationCap
                          size={15}
                          className="text-white lg:w-[18px] lg:h-[18px]"
                        />
                      </div>

                      <div>
                        <p className="text-[11px] sm:text-sm lg:text-sm text-white/50">
                          Mode of Study
                        </p>

                        <p className="text-sm sm:text-sm lg:text-sm font-semibold text-white">
                          {data.mode}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Description */}
                {data.description && (
                  <p className="mt-4 lg:mt-6 max-w-2xl text-sm sm:text-base lg:text-base leading-6 sm:leading-7 lg:leading-7 text-white/85">
                    {data.description}
                  </p>
                )}

                {/* Buttons */}
                <div className="mt-4 lg:mt-6 flex flex-wrap gap-3 lg:gap-4">

                  <button
                    type="button"
                    onClick={openPopup}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F36D45] px-4 py-2.5 lg:px-6 lg:py-3.5 text-sm sm:text-sm lg:text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                  >
                    <Send size={16} className="lg:w-[18px] lg:h-[18px]" />
                    Connect with us
                  </button>

                  <Link
                    href={"/login"}

                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/5 px-4 py-2.5 lg:px-6 lg:py-3.5 text-sm sm:text-sm lg:text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    <Heart size={16} className="lg:w-[18px] lg:h-[18px]" />
                    Add to Shortlist
                  </Link>

                </div>
              </div>

              {/* ================= RIGHT SIDE (Desktop Only) ================= */}
              <div className="relative hidden">

                {/* Share / Tour */}
                <div className="absolute right-0 top-0 flex flex-col gap-3">

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-xl transition hover:bg-gray-100"
                  >
                    <Share2 size={17} />
                    Share
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-xl transition hover:bg-gray-100"
                  >
                    <Eye size={17} />
                    360° Tour
                  </button>

                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl py-6 lg:py-8 px-4 lg:px-0 [text-shadow:0_0px_0px_rgba(0,0,0,0.5)] fs">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">

            <section id="overview" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Overview"
                title={
                  data.intro?.title || `Study ${data.shortName || data.title}`
                }
              />
              <InnerContent cleanedHtml={data.intro?.description} />

            </section>


            {data?.content?.sections?.map((section: any, index: number) => {
              const sectionId = `${section.type}-${section.id || index}`;

              const sectionData = section.data;

              if (section.type === "cta") return null;

              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="mt-6 scroll-mt-28"
                >
                  <SectionHeading
                    eyebrow={section.name}
                    title={sectionData?.title || section.name}
                  />

                  {section.type === "intro" && (
                    <>

                      <InnerContent cleanedHtml={sectionData?.content} />
                      {Array.isArray(sectionData?.cards) &&
                        sectionData.cards.length > 0 && (
                          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {sectionData.cards.map((card: any, index: number) => {

                              return (
                                <div
                                  key={index}
                                  className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 lg:p-6
              transition-all duration-500
              hover:-translate-y-2
              hover:border-[#f26e46]/30
              hover:shadow-[0_20px_45px_rgba(21,34,56,0.10)]"
                                >
                                  <div className="relative z-10">
                                    <div className="">
                                      <div className="flex items-center gap-2">

                                        <DynamicLucideIcon
                                          name={card.icon}
                                          className="transition-transform duration-500 h-8 w-8 rounded-full text-[#152238] group-hover:text-[#f26e46] group-hover:scale-110"
                                        />
                                        <h3
                                          className="text-base font-bold leading-6 text-[#152238]
                    transition-colors duration-300
                    group-hover:text-[#f26e46]"
                                        >
                                          {card.title}
                                        </h3>
                                      </div>
                                      <InnerContent cleanedHtml={card.description} />

                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </>
                  )}

                  {section.type === "roadmap" && (
                    <>
                      {sectionData?.steps?.length > 0 && (
                        <div className="relative mt-16 lg:mt-10">
                          <div className="relative">
                            {sectionData.steps?.map((feature: any, index: number) => (
                              <FeatureCard key={index} feature={feature} index={index} />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {section.type === "topProgram" && (
                    <>
                      {sectionData?.subtitle && (
                        <p className="mb-4 lg:mb-6 text-sm sm:text-base lg:text-base leading-6 sm:leading-7 lg:leading-7 text-gray-600">
                          {sectionData.subtitle}
                        </p>
                      )}

                      <div className="grid gap-3 lg:gap-4 md:grid-cols-2">
                        {sectionData?.data?.map(
                          (program: any, programIndex: number) => (
                            <div
                              key={programIndex}
                              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4
        transition-all duration-500
        hover:-translate-y-2
        hover:border-[#f26e46]/30
        hover:shadow-[0_20px_50px_rgba(242,110,70,0.14)]"
                            >
                              {/* Animated background blobs */}
                              <div
                                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full
          bg-[#f26e46]/8 blur-3xl
          transition-all duration-700
          group-hover:scale-125 group-hover:bg-[#f26e46]/55"
                              />

                              <div
                                className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full
          bg-orange-100/50 blur-3xl
          transition-all duration-700
          group-hover:translate-x-8 group-hover:-translate-y-4"
                              />


                              {/* Content */}
                              <div className="relative z-10 flex items-start gap-4">

                                {/* Number / Icon */}
                                <div
                                  className="flex p-2 py-1.5 items-center justify-center rounded-full
            bg-[#fff0eb] text-sm font-bold text-[#f26e46]
            ring-1 ring-[#f26e46]/10
            transition-all duration-500
            group-hover:scale-110
            group-hover:bg-[#f26e46]
            group-hover:text-white
            group-hover:shadow-lg
            group-hover:shadow-[#f26e46]/25"
                                >
                                  {String(programIndex + 1).padStart(2, "0")}
                                </div>

                                {/* Text */}
                                <div className="min-w-0 flex-1">
                                  <h3
                                    className="font-bold text-[#152238] text-sm sm:text-base lg:text-base
              leading-6
              transition-colors duration-300
              group-hover:text-[#f26e46]"
                                  >
                                    {program.title}
                                  </h3>
                                  <div className="mt-1 text-sm">
                                    <InnerContent cleanedHtml={program.subtitle} />
                                  </div>


                                  {/* Bottom indicator */}
                                  <div className="mt-3 flex items-center gap-2">
                                    <span
                                      className="h-1.5 w-1.5 rounded-full bg-[#f26e46]
                transition-all duration-500
                group-hover:w-7"
                                    />

                                    <span
                                      className="text-[10px] font-semibold uppercase tracking-[0.16em]
                text-gray-400
                transition-colors duration-300
                group-hover:text-[#f26e46]"
                                    >
                                      Explore Program
                                    </span>
                                  </div>
                                </div>


                              </div>

                              {/* Moving shine effect */}
                              <div
                                className="pointer-events-none absolute -left-[100%] top-0 h-full w-1/3
          skew-x-[-20deg]
          bg-gradient-to-r from-transparent via-white/70 to-transparent
          transition-all duration-1000
          group-hover:left-[130%]"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </>
                  )}

                  {section.type === "content" && (
                    <>
                      {sectionData?.content && (
                        <InnerContent cleanedHtml={sectionData?.content} />
                      )}
                    </>
                  )}

                  {/* Other Data */}
                  {section.type === "otherdata" && (
                    <div className="relative mt-6">
                      {sectionData?.data?.map(
                        (item: any, itemIndex: number) => {
                          const isLast =
                            itemIndex === sectionData.data.length - 1;

                          return (
                            <div
                              key={itemIndex}
                              className="group relative flex gap-5"
                            >
                              {/* Timeline */}
                              <div className="relative flex w-10 shrink-0 flex-col items-center sm:w-12">

                                {/* Number */}
                                <div
                                  className="
                  relative z-10
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  border border-[#f26e46]/20
                  bg-white
                  text-sm font-bold text-[#f26e46]
                  shadow-[0_4px_15px_rgba(242,110,70,0.10)]
                  transition-all duration-500
                  group-hover:scale-110
                  group-hover:border-[#f26e46]
                  group-hover:bg-[#f26e46]
                  group-hover:text-white
                  group-hover:shadow-[0_8px_25px_rgba(242,110,70,0.25)]
                "
                                >
                                  {String(itemIndex + 1).padStart(2, "0")}
                                </div>

                                {/* Connecting line */}
                                {!isLast && (
                                  <div
                                    className="
                    relative mt-2 w-px flex-1 overflow-hidden
                    bg-gray-200
                  "
                                  >
                                    <div
                                      className="
                      absolute left-0 top-0 h-0 w-full
                      bg-gradient-to-b from-[#f26e46] to-orange-200
                      transition-all duration-700
                      group-hover:h-full
                    "
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div
                                className={`
                relative min-w-0 flex-1
                ${!isLast ? "pb-6" : "pb-2"}
              `}
                              >
                                {/* Background glow */}
                                <div
                                  className="
                  pointer-events-none
                  absolute -left-4 -top-4
                  h-24 w-24 rounded-full
                  bg-[#f26e46]/5
                  opacity-0 blur-3xl
                  transition-all duration-500
                  group-hover:scale-150
                  group-hover:opacity-100
                "
                                />

                                <div className="relative">
                                  {/* Small label */}
                                  <div className="mb-2 flex items-center gap-2">
                                    <span
                                      className="
                      h-px w-5 bg-[#f26e46]
                      transition-all duration-500
                      group-hover:w-10
                    "
                                    />

                                    <span
                                      className="
                      text-[10px] font-bold uppercase
                      tracking-[0.18em]
                      text-[#f26e46]
                    "
                                    >
                                      {String(itemIndex + 1).padStart(2, "0")}
                                    </span>
                                  </div>

                                  {/* Title */}
                                  <h3
                                    className="
                    text-lg font-bold leading-7
                    text-[#152238]
                    transition-all duration-300
                    group-hover:translate-x-1
                    group-hover:text-[#f26e46]
                    sm:text-xl
                  "
                                  >
                                    {item.title}
                                  </h3>

                                  {/* Content */}
                                  {item.content && (
                                    <InnerContent cleanedHtml={item.content} />
                                  )}

                                </div>
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  )}
                </section>
              );
            })}
            {data?.faqSection?.items?.length > 0 && (
              <section id="faq" className="">
                <FAQSection Faqres={data.faqSection.items} />
              </section>
            )}
          </article>
          <div className="flex flex-col !h-full overflow-visible">
            <div className="relative sm:-mt-24 z-2">
              <UniversityFeeCard openPopup={openPopup} tuitionFee={data.tutionFees} applicationFee={data.applicationFees} />
            </div>
            <div className="sticky top-24 space-y-4 z-20 mt-5">

              {/* Consultation Form */}
              <div>
                <ConsultationForm />
              </div>

              {/* Counselling CTA */}
              <div className="overflow-hidden rounded-2xl bg-[#152238] p-6 text-white">
                <h3 className=" text-xl font-bold">Get Free Counselling</h3>

                <p className="mt-2 text-sm leading-6 text-white/65">
                  Speak with our study abroad experts and get personalized
                  guidance.
                </p>

                <button onClick={openPopup} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f26e46] px-4 py-3 text-sm font-bold transition hover:bg-[#e85f38]">
                  Talk to an Expert
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {countries?.length > 0 && (
        <section className="py-8 max-w-7xl mx-auto overflow-hidden px-4">
          <div className="flex items-center gap-3 mb-4 lg:mb-8">
            <div className="w-1 h-6 lg:h-8 bg-orange-500"></div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Related Destinations
            </h2>
          </div>

          <div ref={sliderRef} className="keen-slider flex">
            {countries?.map((item: any) => (
              <div
                key={item._id}
                className="keen-slider__slide bg-white border border-gray-200  overflow-hidden"
              >
                <Link href={`/destination/${item.slug}`} className="block">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.country?.image || item.navbarImage || "/placeholder.jpg"}
                      alt={item.country?.name || item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 lg:p-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 lg:w-8 h-[1px] bg-orange-500"></div>
                      <span className="text-[10px] sm:text-sm lg:text-sm uppercase tracking-widest text-orange-600 font-semibold">
                        Destination
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-900 truncate my-2">
                      {item?.country?.name || "Destination"}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
      <CTASection data={data?.ctaSection} />
    </main>
  );
}

// ================= COMPONENTS =================

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div
      ref={ref}
      className="sticky top-36 flex items-center justify-center"
      style={{
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{ scale, opacity, y }}
        className={`
    group relative w-full max-w-5xl overflow-hidden
    rounded-3xl
    border border-gray-200
    transition-all duration-200
    flex flex-col lg:flex-row items-center
    ${index % 2 === 0
            ? "bg-[#FEFBEA]"
            : "bg-[#FEFBEA]"
          }
    ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}
  `}
      >
        {/* Decorative gradient glow */}
        <div
          className={`
      absolute -top-24 -right-24
      h-64 w-64 rounded-full
      blur-3xl opacity-30
      transition-all duration-700
       group-hover:opacity-50
      ${index % 2 === 0
              ? "bg-orange-300"
              : "bg-rose-300"
            }
    `}
        />

        {/* Huge background step typography */}
        <div
          className="
      pointer-events-none absolute
      -top-0 right-3 md:right-5
      select-none
      text-[80px]
      font-bold
      leading-none
      tracking-tighter
      text-gray-200/90
      transition-all duration-700
      group-hover:text-gray-200/70
      group-hover:translate-x-2
    "
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full p-6 sm:p-8">

          {/* Heading */}
          <p
            className="
        max-w-2xl
        text-2xl
        font-bold
        leading-[1.1]
        tracking-tight
        text-gray-900
        mb-3
        transition-transform duration-500
        group-hover:translate-x-1
      "
          >
            {feature.title}
          </p>

          {/* Description */}
          <InnerContent cleanedHtml={feature.description} />

          {/* Bottom accent */}
          <div className="mt-4 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-orange-400 rounded-full transition-all duration-500 group-hover:w-16" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
              Explore the next step
            </span>
          </div>
        </div>

        {/* Bottom-right decorative circle */}
        <div
          className="
      pointer-events-none absolute
      -bottom-16 -right-16
      h-40 w-40
      rounded-full
      border-[20px]
      border-white/30
      transition-transform duration-700
      group-hover:scale-125
    "
        />

      </motion.div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">

      <h2 className=" flex flex-col text-2xl lg:text-xl">
        <span className="text-[#F46C44] lg:text-4xl">
          {title?.split("||")[0]?.trim()}
        </span>{" "}

        <span className="text-primary font-semibold relative text-xl sm:text-2xl lg:text-4xl">
          {title?.split("||")[1]?.trim()}
        </span>
      </h2>

      {description && (
        <p className="mt-2 lg:mt-3 max-w-3xl text-sm sm:text-sm lg:text-sm leading-6 sm:leading-7 lg:leading-7 text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] sm:text-sm lg:text-sm text-gray-500">{label}</span>

      <span className="max-w-[120px] lg:max-w-[150px] text-right text-[10px] sm:text-sm lg:text-sm font-bold text-[#152238]">
        {value || "-"}
      </span>
    </div>
  );
}