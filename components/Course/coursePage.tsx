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

  const [activeSection, setActiveSection] = useState("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!data) {
    return (
      <NotFound />
    );
  }

  const readingTime = calculateReadingTime(data);

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

        if (visible.length) {
          setActiveSection(visible[0].target.id);
        }
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (!element) return;

    const offset = 100;

    const top = element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    setActiveSection(id);
  };

  const introSection = data?.content?.sections?.find(
    (section: any) => section.type === "intro",
  );

  const introData = introSection?.data;

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
          perView: 1,
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
      <section className="relative overflow-visible bg-white">

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

        {/* ================= CONTENT ================= */}
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
                {/* <div className="mt-4 lg:mt-6 flex items-center gap-3 lg:gap-4">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-lg">
                  <GraduationCap
                    size={20}
                    className="text-[#152238] lg:w-[25px] lg:h-[25px]"
                  />
                </div>

                <div>
                  <p className="text-base sm:text-lg lg:text-lg font-bold text-white">
                    {data.uniSlug || "University"}
                  </p>

                  <p className="text-sm sm:text-sm lg:text-sm text-white/60">
                    University / Institution
                  </p>
                </div>
              </div> */}

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
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6e1901] px-4 py-2.5 lg:px-6 lg:py-3.5 text-sm sm:text-sm lg:text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                  >
                    <Send size={16} className="lg:w-[18px] lg:h-[18px]" />
                    Connect with us
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/5 px-4 py-2.5 lg:px-6 lg:py-3.5 text-sm sm:text-sm lg:text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    <Heart size={16} className="lg:w-[18px] lg:h-[18px]" />
                    Add to Shortlist
                  </button>

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

      <div className="mx-auto max-w-7xl py-6 lg:py-8 px-4 lg:px-0">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            {/* Mobile TOC */}
            {/* <div className="mb-6 lg:mb-8">
              <div className="">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 lg:px-4 lg:py-2 text-[11px] sm:text-sm lg:text-sm font-semibold ${activeSection === section.id
                        ? "bg-[#f26e46] text-white"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
            </div> */}

            <section id="overview" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Overview"
                title={
                  introData?.title || `Study ${data.shortName || data.title}`
                }
              />

              <InnerContent cleanedHtml={introData?.content} />

              {/* Intro Cards */}
              {Array.isArray(introData?.cards) &&
                introData.cards.length > 0 && (
                  <div className="mt-6 lg:mt-8 grid gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {introData.cards.map((card: any, index: number) => {
                      const Icon = getIcon(card.icon);

                      return (
                        <div
                          key={index}
                          className="group rounded-2xl border border-gray-200 bg-white p-4 lg:p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                        >
                          <div className="flex h-10 w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#f26e46] transition group-hover:bg-[#f26e46] group-hover:text-white">
                            <Icon size={18} className="lg:w-[21px] lg:h-[21px]" />
                          </div>

                          <h3 className="mt-4 lg:mt-5 font-bold text-[#152238] text-sm sm:text-base lg:text-base">
                            {card.title}
                          </h3>

                          <p className="mt-1.5 lg:mt-2 text-sm sm:text-sm lg:text-sm leading-5 sm:leading-6 lg:leading-6 text-gray-500">
                            {card.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
            </section>


            {data?.content?.sections?.map((section: any, index: number) => {
              if (section.type === "intro") {
                return null;
              }

              if (section.type === "cta") {
                return null;
              }

              const sectionId = `${section.type}-${section.id || index}`;

              const sectionData = section.data;

              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="mt-12 lg:mt-16 scroll-mt-28"
                >
                  <SectionHeading
                    eyebrow={section.name}
                    title={sectionData?.title || section.name}
                  />

                  {/* Top Programs */}
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
                              className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-5 transition hover:border-orange-200 hover:shadow-lg"
                            >
                              <div className="flex items-start gap-3 lg:gap-4">
                                <div className="flex h-10 w-10 lg:h-11 lg:w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0eb] text-[#f26e46]">
                                  <GraduationCap size={18} className="lg:w-[21px] lg:h-[21px]" />
                                </div>

                                <div>
                                  <h3 className="font-bold text-[#152238] text-sm sm:text-base lg:text-base">
                                    {program.title}
                                  </h3>

                                  <p className="mt-0.5 lg:mt-1 text-sm sm:text-sm lg:text-sm text-gray-500">
                                    {program.subtitle}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </>
                  )}

                  {/* Other Data */}
                  {section.type === "otherdata" && (
                    <div className="space-y-3 lg:space-y-4">
                      {sectionData?.data?.map(
                        (item: any, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-5"
                          >
                            <div className="flex gap-3 lg:gap-4">
                              <div className="flex h-8 w-8 lg:h-9 lg:w-9 shrink-0 items-center justify-center rounded-full bg-[#f26e46] text-sm sm:text-sm lg:text-sm font-bold text-white">
                                {itemIndex + 1}
                              </div>

                              <div className="min-w-0">
                                <h3 className="font-bold text-[#152238] text-sm sm:text-base lg:text-base">
                                  {item.title}
                                </h3>

                                {item.content && (
                                  <div
                                    className="prose prose-sm mt-1.5 lg:mt-2 max-w-none text-gray-600 prose-p:leading-6 lg:prose-p:leading-7"
                                    dangerouslySetInnerHTML={{
                                      __html: item.content,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Generic section */}
                  {!["topProgram", "otherdata"].includes(section.type) && (
                    <>
                      {sectionData?.content && (
                        <div
                          className="prose prose-gray max-w-none text-sm sm:text-[15px] lg:text-[15px] leading-7 sm:leading-8 lg:leading-8"
                          dangerouslySetInnerHTML={{
                            __html: sectionData.content,
                          }}
                        />
                      )}

                      {Array.isArray(sectionData?.data) && (
                        <div className="mt-4 lg:mt-6 space-y-3 lg:space-y-4">
                          {sectionData.data.map(
                            (item: any, itemIndex: number) => (
                              <div
                                key={itemIndex}
                                className="rounded-xl border border-gray-200 bg-white p-4 lg:p-5"
                              >
                                <h3 className="font-bold text-[#152238] text-sm sm:text-base lg:text-base">
                                  {item.title}
                                </h3>

                                {item.subtitle && (
                                  <p className="mt-0.5 lg:mt-1 text-sm sm:text-sm lg:text-sm text-gray-500">
                                    {item.subtitle}
                                  </p>
                                )}

                                {item.content && (
                                  <div
                                    className="prose prose-sm mt-2 lg:mt-3 max-w-none text-gray-600"
                                    dangerouslySetInnerHTML={{
                                      __html: item.content,
                                    }}
                                  />
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </>
                  )}
                </section>
              );
            })}


            {data?.roadmap?.steps?.length > 0 && (
              <section id="journey" className="mt-16 lg:mt-20 scroll-mt-28">
                <SectionHeading
                  eyebrow="Step by Step"
                  title={data.roadmap.title || "Your Journey"}
                  description={data.roadmap.subtitle}
                />

                <div className="relative mt-16 lg:mt-10">
                  <div className="relative p-0 sm:p-1 lg:p-2">
                    {data.roadmap.steps?.map((feature: any, index: number) => (
                      <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ================= TOP COURSES ================= */}
            {data?.topcourse?.length > 0 && (
              <section id="top-courses" className="mt-16 lg:mt-20 scroll-mt-28">
                <SectionHeading
                  eyebrow="Popular Choices"
                  title="Top Courses"
                  description="Explore some popular programs related to this study destination."
                />

                <div className="mt-6 lg:mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  {data.topcourse.map((course: any, index: number) => (
                    <div
                      key={index}
                      className="grid gap-2 border-b border-gray-100 p-4 lg:p-5 last:border-0 md:grid-cols-[1.5fr_1fr_1fr_.8fr_1fr] md:items-center md:px-5 md:py-4"
                    >
                      <div>
                        <p className="font-bold text-[#152238] text-sm sm:text-base lg:text-base">
                          {course.title}
                        </p>
                      </div>

                      <div className="text-sm sm:text-sm lg:text-sm text-gray-600">
                        {course.university}
                      </div>

                      <div className="flex items-center gap-1 text-sm sm:text-sm lg:text-sm text-gray-600">
                        <MapPin size={12} className="text-[#f26e46] lg:w-[14px] lg:h-[14px]" />
                        {course.location}
                      </div>

                      <div className="text-sm sm:text-sm lg:text-sm text-gray-600">
                        {course.duration}
                      </div>

                      <div className="font-bold text-[#f26e46] text-sm sm:text-base lg:text-base">
                        {course.tuitionFee}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ================= SIMILAR COURSES ================= */}
            {data?.simillarCourses?.length > 0 && (
              <section className="mt-16 lg:mt-20">
                <SectionHeading
                  eyebrow="You May Also Like"
                  title="Similar Courses"
                />

                <div className="mt-6 lg:mt-7 grid gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.simillarCourses.map((course: any, index: number) => (
                    <div
                      key={index}
                      className="group rounded-2xl border border-gray-200 bg-white p-4 lg:p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                    >
                      <div className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-orange-50 text-[#f26e46]">
                        <BookOpen size={17} className="lg:w-[19px] lg:h-[19px]" />
                      </div>

                      <h3 className="mt-4 lg:mt-5 font-bold text-[#152238] text-sm sm:text-base lg:text-base">
                        {course.title}
                      </h3>

                      <p className="mt-1.5 lg:mt-2 text-sm sm:text-sm lg:text-sm leading-5 sm:leading-6 lg:leading-6 text-gray-500">
                        {course.description}
                      </p>

                      <button className="mt-4 lg:mt-5 flex items-center gap-2 text-sm sm:text-sm lg:text-sm font-bold text-[#f26e46]">
                        Explore
                        <ArrowRight
                          size={13}
                          className="transition group-hover:translate-x-1 lg:w-[15px] lg:h-[15px]"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ================= FAQ ================= */}
            {data?.faqSection?.items?.length > 0 && (
              <section id="faq" className="mt-16 lg:mt-20 scroll-mt-28">
                <FAQSection Faqres={data.faqSection.items} />
              </section>
            )}
          </article>

          {/* ================= ASIDE (Desktop Only) ================= */}
          {/* <div className=""> */}
          <div className="flex flex-col !h-full overflow-visible">
            <div className="relative sm:-mt-24 z-2">
              <UniversityFeeCard />
            </div>
            <div className="sticky top-24 space-y-4 z-20 mt-5">

              {/* Consultation Form */}
              <div>
                <ConsultationForm />
              </div>

              {/* Course Summary */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">

                  <h3 className="font-bold text-[#152238]">Course Snapshot</h3>
                </div>

                <div className="space-y-4">
                  <SummaryRow label="Level" value={data.level} />

                  <SummaryRow label="Duration" value={data.duration} />

                  <SummaryRow label="Mode" value={data.mode} />

                  <SummaryRow label="Tuition" value={data.tutionFees} />

                  <SummaryRow
                    label="Application"
                    value={data.applicationFees}
                  />
                </div>
              </div>

              {/* Counselling CTA */}
              <div className="overflow-hidden rounded-2xl bg-[#152238] p-6 text-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f26e46]">
                  <Users size={21} />
                </div>

                <h3 className="mt-5 text-lg font-bold">Get Free Counselling</h3>

                <p className="mt-2 text-sm leading-6 text-white/65">
                  Speak with our study abroad experts and get personalized
                  guidance.
                </p>

                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f26e46] px-4 py-3 text-sm font-bold transition hover:bg-[#e85f38]">
                  Talk to an Expert
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* </div> */}
        </div>
      </div>


      {countries?.length > 0 && (
        <section className="py-8 lg:py-12 max-w-7xl mx-auto overflow-hidden px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-4 lg:mb-6">
            <div className="w-1 h-6 lg:h-8 bg-orange-500"></div>
            <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-800">
              Related Destinations
            </h2>
          </div>

          <div ref={sliderRef} className="keen-slider flex">
            {countries?.map((item: any) => (
              <div
                key={item._id}
                className="keen-slider__slide bg-white border border-gray-300 rounded-lg overflow-hidden mx-2"
              >
                <Link href={`/destination/${item.slug}`} className="block">
                  <div className="h-40 lg:h-48 overflow-hidden">
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

                    <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-900 truncate my-3 lg:my-4">
                      {item?.title || item?.country?.name || "Destination"}
                    </h3>

                    <div className="flex items-center gap-2 text-sm sm:text-sm lg:text-sm text-gray-600">
                      <MapPin size={14} className="text-orange-500 lg:w-[16px] lg:h-[16px]" />
                      <span>{item?.country?.name || "Explore"}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
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

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div
      ref={ref}
      className="sticky top-36 flex items-center justify-center mb-3 sm:mb-4"
      style={{
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{ scale, opacity, y }}
        className={`
    group relative w-full max-w-5xl overflow-hidden
    rounded-3xl
    border border-white/70
    transition-all duration-200
    flex flex-col lg:flex-row items-center
    ${index % 2 === 0
            ? "bg-[#FEFBEA]"
            : "bg-[#FDF4EF]"
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
      text-[90px]
      font-black
      leading-none
      tracking-tighter
      text-gray-900/[0.085]
      transition-all duration-700
      group-hover:text-gray-900/[0.06]
      group-hover:translate-x-2
    "
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Background STEP label */}
        <div
          className="
      pointer-events-none absolute
      top-8 right-8 md:top-12 md:right-14
      text-[10px] md:text-sm
      font-black uppercase
      tracking-[0.35em]
      text-gray-900/[0.12]
    "
        >
          STEP
        </div>

        {/* Content */}
        <div className="relative z-10 w-full p-6 sm:p-8 md:p-10 lg:p-12">

          {/* Heading */}
          <p
            className="
        max-w-2xl
        text-2xl sm:text-3xl md:text-4xl
        font-bold
        leading-[1.1]
        tracking-tight
        text-gray-900
        mb-4 md:mb-6
        transition-transform duration-500
        group-hover:translate-x-1
      "
          >
            {feature.title}
          </p>

          {/* Description */}
          <p
            className="
        max-w-2xl
        text-sm sm:text-base
        lg:text-[17px]
        leading-7
        text-gray-600
      "
          >
            {feature.description}
          </p>

          {/* Bottom accent */}
          <div className="mt-7 md:mt-9 flex items-center gap-3">
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

const FormSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const navigate = useRouter();

  const onSubmit = async (formData) => {
    try {
      const payload = {
        fullName: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        destination: formData.country,
        subject: "Study Abroad Enquiry",
        type: "website-form",
        source: "website",
        city: formData.city,
        description: `State: ${formData.state}`,
      };

      await axiosInstance.post("/contactus", payload);
      toast.success("Form submitted successfully");
      navigate.push("/thank-you");
      reset();
    } catch (error) {
      toast.error("Submit Error");
    }
  };

  return (
    <div className="bg-white border p-4 sm:p-6 lg:p-8 rounded-lg w-full">
      <h2 className="text-orange-500 text-sm sm:text-base lg:text-xl font-semibold mb-4 lg:mb-5 tracking-wide">
        GET IN TOUCH
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-3 lg:space-y-4">
          <div>
            <label className="text-sm sm:text-sm lg:text-sm text-gray-700">Full Name</label>
            <input
              {...register("fullname", { required: "Name is required" })}
              className={`w-full border-b-2 pb-1 bg-transparent text-sm sm:text-sm lg:text-sm focus:outline-none 
                  ${errors.fullname ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
            />
            {errors.fullname && (
              <p className="text-red-500 text-[10px] sm:text-sm lg:text-sm">{errors.fullname.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm sm:text-sm lg:text-sm text-gray-700">Email ID</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.(com|in)$/i,
                  message: "Only .com and .in emails allowed",
                },
              })}
              className={`w-full border-b-2 pb-1 bg-transparent text-sm sm:text-sm lg:text-sm focus:outline-none 
                  ${errors.email ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] sm:text-sm lg:text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm sm:text-sm lg:text-sm text-gray-700">Mobile Number</label>
            <input
              maxLength={10}
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid 10 digit number",
                },
              })}
              className={`w-full border-b-2 pb-1 bg-transparent text-sm sm:text-sm lg:text-sm focus:outline-none 
                  ${errors.phone ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-[10px] sm:text-sm lg:text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <label className="text-sm sm:text-sm lg:text-sm text-gray-700">State</label>
              <input
                {...register("state")}
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 text-sm sm:text-sm lg:text-sm"
              />
            </div>

            <div className="flex-1 w-full sm:w-auto">
              <label className="text-sm sm:text-sm lg:text-sm text-gray-700">City</label>
              <input
                {...register("city")}
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 text-sm sm:text-sm lg:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm sm:text-sm lg:text-sm text-gray-700">Country</label>
            <select
              {...register("country")}
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 text-sm sm:text-sm lg:text-sm"
            >
              <option value="">Country to Study</option>
              {[
                "USA",
                "UK",
                "France",
                "Germany",
                "Italy",
                "Dubai",
                "New Zealand",
                "Australia",
              ].map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  Study In {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4 lg:mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary hover:bg-primary text-white px-4 lg:px-6 py-1.5 lg:py-2 rounded-full text-sm sm:text-sm lg:text-sm"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3 lg:gap-4 rounded-xl border border-orange-100 bg-white p-3 lg:p-4">
      <div className="flex h-8 w-8 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff0eb] text-[#f26e46]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] sm:text-[11px] lg:text-[11px] font-bold uppercase tracking-wide text-gray-400">
          {title}
        </p>

        <p className="mt-0.5 lg:mt-1 truncate text-sm sm:text-sm lg:text-sm font-bold text-[#152238]">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}





const TuitionFeeCard = ({ data = {} }) => {

  const tuitionFees =
    data.tuitionFees || "AUD 48,000";

  const approxInr =
    data.approxInr || "₹25,75,000";

  const applicationFee =
    data.applicationFee || "AUD 100";

  return (
    <div className="w-full min-w-[16rem] lg:min-w-[20rem] rounded-2xl border border-gray-100 bg-white p-4 lg:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">

      {/* ================= FEES ================= */}
      <div className="mb-4 lg:mb-5">

        <span className="mb-0.5 lg:mb-1 block text-[10px] sm:text-sm lg:text-sm font-medium text-gray-400">
          Tuition Fees (Total)
        </span>

        <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-[#091a44]">
          {tuitionFees}
        </h2>

        <span className="mt-0.5 block text-[10px] sm:text-sm lg:text-sm font-medium text-gray-500">
          Approx. {approxInr}
        </span>

      </div>

      {/* ================= APPLICATION FEE ================= */}
      <div className="mb-4 lg:mb-6">

        <span className="inline-flex items-center gap-1 rounded-md border border-[#d2f3e1] bg-[#edfbf4] px-2 py-0.5 lg:px-2.5 lg:py-1 text-[10px] sm:text-sm lg:text-sm font-semibold text-[#1ca360]">
          + Application Fee: {applicationFee}
        </span>

      </div>

      {/* ================= BUTTONS ================= */}
      <div className="mb-4 lg:mb-6 flex flex-col gap-2 lg:gap-3">

        <button
          type="button"
          className="w-full rounded-xl bg-gradient-to-r from-[#7a2beb] to-[#f42875] px-3 lg:px-4 py-2.5 lg:py-3 text-sm sm:text-sm lg:text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
        >
          Enquire Now
        </button>

        <button
          type="button"
          className="w-full rounded-xl border border-[#4834d4] bg-white px-3 lg:px-4 py-2.5 lg:py-3 text-sm sm:text-sm lg:text-sm font-semibold text-[#4834d4] transition-colors hover:bg-indigo-50/30"
        >
          Book Free Consultation
        </button>

      </div>

    </div>
  );
};

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
    <div className="mb-4 lg:mb-6">

      <h2 className="text-lg sm:text-xl lg:text-xl">
        <span className="text-[#F46C44] lg:text-4xl font-light">
          {title?.split("||")[0]?.trim()}
        </span>{" "}

        <br className="block sm:hidden" />
        <span className="text-primary font-bold relative text-xl sm:text-2xl lg:text-4xl">
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