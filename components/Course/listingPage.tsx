"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  BookOpen,
  Wallet,
  ArrowRight,
  GraduationCap,
  Building2,
  Tag,
  Sparkles,
} from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  uniSlug: string;
  tutionFees: string;
  applicationFees: string;
  shortName: string;
  tags: string[];
  status: string;
  level: string;
  duration: string;
  mode: string;
  topcourse: Array<{
    title: string;
    university: string;
    location: string;
    duration: string;
    tuitionFee: string;
  }>;
}

interface ListingPageProps {
  initialCourses?: Course[];
  totalPages?: number;
  currentPage?: number;
}

// Brand tokens — primary color is #f06b43 (warm coral-orange).
const BRAND = "#f06b43";
const BRAND_DARK = "#c8532f";
const BRAND_GRADIENT = "from-[#f06b43] to-[#c8532f]";

const levelBadge: Record<string, string> = {
  Bachelor: "bg-blue-50 text-blue-600 ring-blue-100",
  Master: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100",
  PhD: "bg-rose-50 text-rose-600 ring-rose-100",
  Diploma: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  Certificate: "bg-amber-50 text-amber-600 ring-amber-100",
};

const modeBadge: Record<string, string> = {
  "Full Time": "bg-emerald-50 text-emerald-600",
  "Part Time": "bg-amber-50 text-amber-600",
  Online: "bg-cyan-50 text-cyan-600",
  Hybrid: "bg-indigo-50 text-indigo-600",
};

export default function CourseListingPage({
  initialCourses = [],
  totalPages = 1,
  currentPage = 1,
}: ListingPageProps) {
  const [courses] = useState<Course[]>(initialCourses);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(currentPage);

  const levels = ["All", "Bachelor", "Master", "PhD", "Diploma", "Certificate"];
  const modes = ["All", "Full Time", "Part Time", "Online", "Hybrid"];
  const durations = ["All", "1 Year", "2 Years", "3 Years", "4 Years"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.uniSlug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.shortName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    const matchesMode = selectedMode === "All" || course.mode === selectedMode;
    const matchesDuration = selectedDuration === "All" || course.duration === selectedDuration;

    return matchesSearch && matchesLevel && matchesMode && matchesDuration;
  });

  const itemsPerPage = 9;
  const paginatedCourses = filteredCourses.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalFilteredPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));

  const hasActiveFilters =
    selectedLevel !== "All" || selectedMode !== "All" || selectedDuration !== "All" || !!searchTerm;

  const clearFilters = () => {
    setSelectedLevel("All");
    setSelectedMode("All");
    setSelectedDuration("All");
    setSearchTerm("");
    setPage(1);
  };

  const getInitials = (slug: string) =>
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

  const formatUniversityName = (slug: string) =>
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HERO ================= */}
      <section className="relative w-full overflow-hidden bg-[#FBF1E8]">
        {/* faint dot grid texture, brand-colored */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(${BRAND}33 1px, transparent 1px)`,
            backgroundSize: "18px 18px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#f06b43]/10 blur-2xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left — copy + search */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1"
              style={{ color: BRAND_DARK, borderColor: BRAND, boxShadow: `inset 0 0 0 1px ${BRAND}33` }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: BRAND }} /> {courses.length}+ programs worldwide
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Explore Our{" "}
              <span className="relative inline-block">
                Courses
                <svg
                  viewBox="0 0 200 16"
                  className="absolute -bottom-1 left-0 h-3 w-full"
                  preserveAspectRatio="none"
                >
                  <path d="M2 10 Q 100 -2 198 10" stroke={BRAND} strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-500">
              Find the perfect program for your academic and career goals — search {courses.length}+ courses from
              universities around the world.
            </p>

            {/* Search */}
            <div className="mt-7 max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5">
                <Search className="ml-2.5 h-4.5 w-4.5 flex-shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses, universities..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
                <button
                  className="flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: BRAND }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* quick facts */}
            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-slate-500">
              {[
                { label: "Universities", value: new Set(courses.map((c) => c.uniSlug)).size },
                { label: "Countries", value: 15 },
                { label: "Avg. rating", value: "4.8/5" },
              ].map((f) => (
                <span key={f.label} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
                  <span className="font-semibold text-slate-800">{f.value}</span> {f.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — signature stacked course-card illustration */}
          <div className="relative hidden h-72 items-center justify-center lg:flex">
            <div className="absolute h-56 w-44 -rotate-6 rounded-2xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-100" />
            <div
              className="absolute h-56 w-44 rotate-3 rounded-2xl shadow-xl ring-1 ring-black/5"
              style={{ backgroundColor: BRAND }}
            />
            <div className="absolute z-10 h-56 w-44 -rotate-1 rounded-2xl bg-white p-4 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-100">
              <div className="h-16 w-full rounded-lg" style={{ backgroundColor: `${BRAND}22` }} />
              <div className="mt-3 h-2.5 w-4/5 rounded-full bg-slate-100" />
              <div className="mt-2 h-2.5 w-3/5 rounded-full bg-slate-100" />
              <div className="mt-4 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" style={{ color: BRAND }} />
                <div className="h-2 w-16 rounded-full bg-slate-100" />
              </div>
              <div
                className="mt-4 flex h-8 items-center justify-center rounded-lg text-[11px] font-semibold text-white"
                style={{ backgroundColor: BRAND }}
              >
                View Program
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <div className="relative z-10 mx-auto -mt-7 max-w-7xl px-4 sm:px-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>

            <div className={`flex flex-wrap items-center gap-3 ${filtersOpen ? "flex" : "hidden"} sm:flex`}>
              <span className="hidden items-center gap-1.5 text-sm font-semibold text-slate-700 sm:flex">
                <SlidersHorizontal className="h-4 w-4 text-fuchsia-600" /> Filters:
              </span>

              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-fuchsia-400"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <select
                value={selectedMode}
                onChange={(e) => {
                  setSelectedMode(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-fuchsia-400"
              >
                {modes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={selectedDuration}
                onChange={(e) => {
                  setSelectedDuration(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-fuchsia-400"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-fuchsia-600 hover:bg-fuchsia-50"
                >
                  <X className="h-3.5 w-3.5" /> Clear All
                </button>
              )}
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filteredCourses.length}</span> courses
          </p>
        </div>
      </div>

      {/* ================= COURSE GRID ================= */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="h-44 bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                </div>
              </div>
            ))
          ) : paginatedCourses.length > 0 ? (
            paginatedCourses.map((course) => (
              <Link
                key={course._id}
                href={`/course/${course.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Cover */}
                <div className="relative h-44 overflow-hidden">
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  {/* Fallback gradient (also shown if image 404s) */}
                  <div
                    className={`${
                      course.coverImage ? "hidden" : ""
                    } flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-900 via-fuchsia-800 to-pink-700`}
                  >
                    <GraduationCap className="h-10 w-10 text-white/50" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
                      levelBadge[course.level] ?? "bg-slate-50 text-slate-600 ring-slate-100"
                    }`}
                  >
                    {course.level}
                  </span>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur-sm">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${BRAND_GRADIENT} text-[10px] font-bold text-white`}>
                      {getInitials(course.uniSlug)}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {formatUniversityName(course.uniSlug)}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-fuchsia-600">
                    {course.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {course.shortName || course.description?.substring(0, 100)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-fuchsia-500" /> {course.duration}
                    </span>
                    <span className="h-3.5 w-px bg-slate-200" />
                    <span className="flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5 text-fuchsia-500" /> {course.tutionFees}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        modeBadge[course.mode] ?? "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {course.mode}
                    </span>
                  </div>

                  {course.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {course.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 rounded-md bg-fuchsia-50 px-2 py-0.5 text-[11px] font-medium text-fuchsia-600"
                        >
                          <Tag className="h-3 w-3" /> {tag}
                        </span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                          +{course.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-400">View program details</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fuchsia-50 text-fuchsia-600 transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fuchsia-50">
                <Search className="h-7 w-7 text-fuchsia-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">No courses found</h3>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
              <button
                onClick={clearFilters}
                className={`mt-5 rounded-lg bg-gradient-to-r ${BRAND_GRADIENT} px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* ================= PAGINATION ================= */}
        {filteredCourses.length > itemsPerPage && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, filteredCourses.length)} of{" "}
              {filteredCourses.length} courses
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalFilteredPages) }, (_, i) => {
                let pageNum: number;
                if (totalFilteredPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalFilteredPages - 2) pageNum = totalFilteredPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      page === pageNum
                        ? `bg-gradient-to-r ${BRAND_GRADIENT} text-white shadow-sm`
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalFilteredPages, p + 1))}
                disabled={page === totalFilteredPages}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= STATS ================= */}
      <section className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-8 lg:grid-cols-4">
          {[
            { icon: BookOpen, value: `${courses.length}+`, label: "Total Courses" },
            { icon: Building2, value: `${new Set(courses.map((c) => c.uniSlug)).size}+`, label: "Universities" },
            {
              icon: Tag,
              value: `${new Set(courses.flatMap((c) => c.tags || [])).size}+`,
              label: "Specializations",
            },
            { icon: Sparkles, value: "100%", label: "Satisfaction Rate" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label}>
              <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${BRAND_GRADIENT} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
              <div className="mt-1 text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


