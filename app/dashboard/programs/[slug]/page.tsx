"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import {
    Building2, MapPin, Globe, Calendar, DollarSign,
    GraduationCap, Clock, BookOpen, Tag, Award,
    FileText, Check, X, ExternalLink, ChevronRight,
    Download, Share2, Bookmark, Users, Briefcase,
    Layers, Sparkles, ArrowLeft, Heart, Shield,
    Trophy, Wallet, Languages, Home, Mail, Phone,
    Instagram, Twitter, Linkedin, Youtube, Facebook,
    Loader2, TrendingUp, Star, CircleDot,
    Building,
    IndianRupeeIcon,
    TrendingDown,
    MinusCircle,
    Building2Icon,
    Clock3,
    ArrowRight,
    Info,
    ClipboardList,
    CalendarDays
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { CreateApplicationModal } from "@/components/dashboard/applicationModel"
import CourseDetailScholarships from "@/components/dashboard/scholarship"
import Image from "next/image"

// Types based on your actual payload
interface Course {
    _id: string
    name: string
    slug: string
    shortName: string
    university: {
        _id: string
        name: string
        slug: string
        slogan: string
        uni_type: string
        address: string
        country: string
        city: string
        uni_logo: string
        cover_photo: string
        uni_web: string
        uni_rank: Array<{ type: string; rank: string; year: string }>
        established_year: number
        on_campus_accommodation: boolean
        off_campus_accommodation: boolean
        acceptanceRate: number
        intakes: string[]
        offers: string
        tags: string
        social_links?: {
            facebook?: string
            twitter?: string
            instagram?: string
            linkedin?: string
            youtube?: string
        }
        financials?: {
            cost_of_living?: string
            ug_fees?: string
            pg_fees?: string
            other_fees?: string
        }
    }
    category: {
        _id: string
        name: string
        slug: string
        description?: string
    }
    subject: {
        _id: string
        name: string
        slug: string
        description?: string
        icon?: string
    }
    studyMode: string
    tuitionFee: number
    currency: string
    level: string
    tags: string[]
    applicationFee: number
    duration: string
    status: string
    description: string
    requirements: {
        [key: string]: string
    }
    docsRequired: Array<{
        [key: string]: string
    }>
    extra_content: {
        _id: string
        sections: Array<{
            section_key: string
            heading: string
            content: string
            order: number
            _id: string
        }>
        isPublished: boolean
        status: string
    }
    seoData: {
        metaTitle: string
        metaDescription: string
        keywords: string
        canonicalUrl: string
    }
    createdAt: string
    updatedAt: string
}

// Stats Card Component
const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
    small = false,
    last = false,
}: any) => (
    <div
        className={`
      relative flex items-center gap-4
      bg-white
      px-6 py-6
      h-full
      transition-all duration-300
      hover:bg-orange-50
      ${!last ? "lg:border-r border-[#F3E7DF]" : ""}
    `}
    >
        {/* Icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-50 shadow-sm">
            <Icon
                className="w-7 h-7 text-[#F26D44]"
                strokeWidth={1.8}
            />
        </div>

        {/* Content */}
        <div className="flex flex-col min-w-0">
            <span className="text-sm text-black font-medium">
                {label}
            </span>

            <span
                className={` text-[#1F2340] leading-snug ${small ? "text-sm lg:text-lg" : "lg:text-2xl text-sm"
                    }`}
            >
                {value}
            </span>

            {trend !== undefined && (
                <span
                    className={`mt-1 flex items-center gap-1 text-sm ${trend > 0
                        ? "text-green-600"
                        : trend < 0
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                >
                    {trend > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : trend < 0 ? (
                        <TrendingDown className="w-4 h-4" />
                    ) : (
                        <MinusCircle className="w-4 h-4" />
                    )}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
    </div>
);

// Tab Button Component
const TabButton = ({ active, onClick, children }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 whitespace-nowrap flex-shrink-0 text-base font-medium transition-all relative ${active
            ? 'text-gray-900'
            : 'text-muted-foreground hover:text-foreground'
            }`}
    >
        {children}

        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-xl bg-[#F26D44]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
    </button>
)

// Requirement Badge Component
interface RequirementBadgeProps {
    exam: string;
    overall: string | number;
    band: string | number;
}

const RequirementBadge = ({
    exam,
    overall,
    band,
}: RequirementBadgeProps) => {
    const getExamConfig = (exam: string) => {
        switch (exam.toLowerCase()) {
            case "pte academic":
                return {
                    icon: "P",
                    color: "bg-blue-600",
                };
            case "toefl ibt":
                return {
                    icon: "T",
                    color: "bg-blue-700",
                };
            case "ielts":
                return {
                    icon: "I",
                    color: "bg-red-600",
                };
            default:
                return {
                    icon: exam.charAt(0),
                    color: "bg-gray-600",
                };
        }
    };

    const config = getExamConfig(exam);

    return (
        <div className="grid grid-cols-[240px_1fr_1.2fr_80px] items-center rounded-xl border border-gray-100 bg-[#FBFCFD] px-5 py-5 hover:border-orange-200 transition-all">

            {/* Exam */}
            <div className="flex items-center gap-3">
                <div
                    className={`w-9 h-9 rounded-full ${config.color} flex items-center justify-center text-white text-sm font-semibold`}
                >
                    {config.icon}
                </div>

                <span className="font-semibold text-[#1F2340]">
                    {exam}
                </span>
            </div>

            {/* Overall */}
            <div className="border-l border-gray-200 pl-6">
                <p className="text-sm text-gray-500">Overall</p>
                <p className="font-bold text-[#1F2340] text-lg">
                    {overall}
                </p>
            </div>

            {/* No Band */}
            <div className="border-l border-gray-200 pl-6">
                <p className="text-sm text-gray-500">
                    No Bands Less Than
                </p>
            </div>

            {/* Score */}
            <div className="border-l border-gray-200 pl-6">
                <p className="font-bold text-[#1F2340] text-lg">
                    {band}
                </p>
            </div>
        </div>
    );
};

// Document Item Component
const DocumentItem = ({ doc }: { doc: { [key: string]: string } }) => {
    const [key, value] = Object.entries(doc)[0]
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="p-1.5 bg-green-100 rounded-lg">
                <FileText className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{key}</p>
                <p className="text-xs text-gray-500 mt-0.5">{value}</p>
            </div>
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
        </div>
    )
}

// Social Icon Component
const SocialIcon = ({ platform, url }: { platform: string; url?: string }) => {
    if (!url) return null

    const icons = {
        facebook: Facebook,
        twitter: Twitter,
        instagram: Instagram,
        linkedin: Linkedin,
        youtube: Youtube
    }

    const Icon = icons[platform as keyof typeof icons] || Globe

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
            <Icon className="w-4 h-4 text-gray-600" />
        </a>
    )
}

// Main Component
export default function CourseDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState()
    const [isSaved, setIsSaved] = useState(false)
    const [relatedCourses, setRelatedCourses] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)

    const programDetails = [
        { label: "Duration", value: course?.duration },
        { label: "Campus", value: course?.metaInfo?.campus },
        { label: "Intakes", value: course?.metaInfo?.Intakes },
        { label: "Application Deadline", value: course?.metaInfo?.deadline },
        {
            label: "Application Fee",
            value: `${course?.currency} ${course?.applicationFee ?? 0}`,
        },
        {
            label: "Yearly Tuition Fee",
            value: `${course?.currency} ${course?.tuitionFee?.toLocaleString() ?? 0}`,
        },
        {
            label: "Average Scholarship",
            value: `${course?.currency} ${course?.metaInfo?.scholarship ?? 0}`,
        },
        {
            label: "Initial Deposit",
            value: `${course?.currency} ${course?.metaInfo?.initialDeposit ?? 0}`,
        },
    ];

    const fieldLabels = {
        AverageScholarship: "Average Scholarship",
        AverageScholarshipRemarks: "Scholarship Remarks",
        EnglishMarks12Score: "English Marks (12th)",
        EntryRequirement: "Entry Requirement",
        Intakes: "Available Intakes",
        IntakesClosed: "Closed Intakes",
        InternshipAvailable: "Internship Available",
        IsMOIWaiver: "MOI Waiver",
        IsStemCourse: "STEM Course",
        Remarks: "Remarks",
        ScholarshipAvailable: "Scholarship Available",
        UpcomingIntakeDeadLines: "Upcoming Intake Deadlines",
        WithoutEnglishProficiency: "Without English Proficiency",
        WithoutMaths: "Without Maths",
        applicationFeeWaiver: "Application Fee Waiver",
        backlog: "Backlogs",
        campus: "Campus",
        deadline: "Deadline",
        highlight: "Highlights",
        initialDeposit: "Initial Deposit",
        intakeDeadline: "Intake Deadline",
    };

    const excludedKeys = ["deadline", "intakeDeadline", "UpcomingIntakeDeadLines"];

    const metaInfoData = Object.entries(course?.metaInfo || {})
        .filter(([key, value]) => {
            return (
                !excludedKeys.includes(key) &&
                key !== "AverageScholarshipRemarks" && // Don't render separately
                value !== null &&
                value !== undefined &&
                value !== "" &&
                value !== 0 &&
                value !== "0"
            );
        })
        .map(([key, value]) => ({
            label: fieldLabels[key] || key,
            value: typeof value === "boolean" ? (value ? "Yes" : "No") : value,
            remarks:
                key === "AverageScholarship"
                    ? course?.metaInfo?.AverageScholarshipRemarks
                    : null,
        }));

    const isValidValue = (value) => {
  if (value === null || value === undefined || value === "") return false;

  return Number(value) !== 0 || isNaN(Number(value));
};

    useEffect(() => {
        fetchCourseDetails()
    }, [params.slug])

    const fetchCourseDetails = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/courses/${params.slug}`)
            const data = response.data.data
            setActiveTab(data.extra_content?.sections[0].section_key)
            setCourse(data)
        } catch (error) {
            console.error('Error fetching course details:', error)
        } finally {
            setLoading(false)
        }
    }

    // Get extra content section
    const getSectionContent = (key: string) => {
        return course?.extra_content?.sections?.find(section => section.section_key === key)?.content || ''
    }



    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-6">
                        {/* Breadcrumb skeleton */}
                        <div className="h-5 bg-gray-200 rounded w-64"></div>

                        {/* Hero skeleton */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats skeleton */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                                    <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                        <X className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Course Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        The course you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse All Courses
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb Navigation */}
               <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2 text-sm text-gray-600 mb-4 overflow-x-auto whitespace-nowrap no-scrollbar scrollbar-hide"
>
    <Link href="/dashboard" className="hover:text-blue-600 transition-colors flex-shrink-0">Home</Link>
    <ChevronRight className="w-4 h-4 flex-shrink-0" />
    <Link href="/dashboard/universities" className="hover:text-blue-600 transition-colors flex-shrink-0">Universities</Link>
    <ChevronRight className="w-4 h-4 flex-shrink-0" />
    <Link href={`/dashboard/universities/${course.university?.slug}`} className="hover:text-blue-600 transition-colors flex-shrink-0">
        {course.university?.name}
    </Link>
    <ChevronRight className="w-4 h-4 flex-shrink-0" />
    <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] flex-shrink-0">{course.name}</span>
</motion.div>

          

                <div className="w-full rounded-3xl bg-gradient-to-r from-[#FFF7F3] via-white to-[#FFF7F3] border border-[#F5E6DE] shadow-sm overflow-hidden mb-4">
                    <div className="grid lg:grid-cols-[100px_1fr_420px] items-center gap-8 p-8">

                        {/* Logo */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 lg:w-[110px] lg:h-[110px] rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                                <Image
                                    src={course?.university.uni_logo || "/images/newlogo3.png"}
                                    alt={course?.university.name}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/images/newlogo3.png";
                                    }}
                                    width={70}
                                    height={70}
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <h2 className="text-lg lg:text-2xl font-bold text-[#1B2143] leading-tight">

                                {course.name}
                            </h2>

                            <div className="mt-4 space-y-3">

                                <div className="flex items-center gap-2 text-gray-700">
                                    <Building2 size={18} className="text-gray-500" />
                                    <span className="font-semibold lg:text-lg">
                                        {course?.university.name}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-8 text-gray-600">

                                    <div className="flex items-center gap-2">
                                        <MapPin size={17} />
                                        {course?.university.city}, {course?.university.country}
                                    </div>

                                    {course?.university.uni_web && <div className="flex items-center gap-2">
                                        <Globe size={17} />
                                        <a
                                            href={course?.university.uni_web}
                                            className="hover:text-orange-500 transition"
                                        >
                                            Official Website
                                        </a>
                                    </div>}

                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">

                                    <span className="px-4 py-2 rounded-full bg-[#FFF2EB] text-[#D96A34] font-medium">
                                        {course.level}
                                    </span>

                                    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 flex items-center gap-2 font-medium">
                                        <Clock3 size={16} />
                                        {course.studyMode}
                                    </span>

                                </div>

                            </div>
                        </div>

                        {/* Right */}
                        <div className="relative lg:flex  items-center justify-center">

                            {/* Decorative Circle */}
                            <div className="absolute "></div>

                            {/* Image */}
                           <div className="lg:block hidden">
                             <Image
                                src="/hero-program.png"
                                alt="Graduation"
                                width={240}
                                height={220}
                                className="relative z-10 "
                            />
                           </div>

                            <button onClick={() => { setSelectedCourse(course); setIsModalOpen(true) }} className="lg:mt-35  bg-gradient-to-r from-[#FF6A2B] to-[#FF4F17] text-white rounded-xl px-4 py-2 flex items-center gap-3 font-semibold shadow-lg hover:scale-105 duration-300">
                                Apply Now
                                <ArrowRight size={10} />
                            </button>

                        </div>

                    </div>
                </div>
                {/* Quick Stats Grid */}
               <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="max-w-7xl mx-auto mb-8"
>
    <div className="bg-white rounded-3xl border border-[#F3E7DF] shadow-[0_8px_30px_rgba(242,109,68,0.08)] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-[#F3E7DF]">
            <StatCard
                icon={IndianRupeeIcon}
                label="Tuition Fee"
                value={`${course.tuitionFee} ${course.currency}`}
                subValue="Per Year"
            />

            <StatCard
                icon={Clock}
                label="Duration"
                value={course.duration}
                subValue={course.studyMode}
            />

            <StatCard
                icon={GraduationCap}
                label="Level"
                value={course.level}
                subValue={course.shortName || "Degree"}
                small
            />

            <StatCard
                icon={Wallet}
                label="Application Fee"
                value={`${course.applicationFee} ${course.currency}`}
                subValue="Non-refundable"
            />

            <StatCard
                icon={TrendingUp}
                label="Acceptance Rate"
                value={`${course.university?.acceptanceRate ?? 0}%`}
                subValue="Percentage"
                last
            />
        </div>
    </div>
</motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto gap-4">
  {/* Left Column - Main Content (2/3 width) */}
  <div className="lg:col-span-2 space-y-6">
    {/* Tabs Navigation */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className=""
    >
      <div className="">
        <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar scrollbar-hide">
          {course.extra_content?.sections?.map((section) => (
            <TabButton
              key={section._id}
              active={activeTab === section.section_key}
              onClick={() => setActiveTab(section.section_key)}
              icon={Layers}
            >
              {section.heading}
            </TabButton>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-2 sm:p-4">
        {/* Dynamic Extra Content Sections */}
        {course.extra_content?.sections?.map((section) => {
          const hasEnglishRequirements =
            isValidValue(course?.requirements?.PteScore) ||
            isValidValue(course?.requirements?.PteNoSectionLessThan) ||
            isValidValue(course?.requirements?.ToeflScore) ||
            isValidValue(course?.requirements?.ToeflNoSectionLessThan) ||
            isValidValue(course?.requirements?.Ielts) ||
            isValidValue(course?.requirements?.IeltsNoBandLessThan) ||
            isValidValue(course?.requirements?.DETScore);

          const hasStandardizedTests =
            isValidValue(course?.requirements?.GreScore) ||
            isValidValue(course?.requirements?.GmatScore) ||
            isValidValue(course?.requirements?.ActScore) ||
            isValidValue(course?.requirements?.SatScore);

          const hasEntryRequirements =
            isValidValue(course?.metaInfo?.EntryRequirement) ||
            isValidValue(course?.requirements?.EntryRequirementTwelfth) ||
            isValidValue(course?.requirements?.EntryRequirementUG) ||
            isValidValue(course?.requirements?.WorkExp);

            const hasApplicationInfo =
  Number(course?.metaInfo?.initialDeposit) > 0 ||
  (course?.metaInfo?.intakeDeadline &&
    course.metaInfo.intakeDeadline.trim() !== "") ||
  (course?.metaInfo?.backlog &&
    Number(course.metaInfo.backlog) > 0);

          return (
            activeTab === section.section_key && (
              <motion.div
                key={section._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <h3 className="text-muted-foreground text-gray-800 leading-relaxed">
                  {course.description}
                </h3>
                <div
                  className="text-muted-foreground text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />

                {/* ✅ Responsive 2-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  {/* ============ LEFT COLUMN ============ */}
                  <div className="flex flex-col">
                    <div className="mt-4">
                      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-gray-100 px-4 sm:px-6 py-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <Info className="h-5 w-5 text-orange-600" />
                          </div>
                          <h2 className="text-lg font-semibold text-[#1D2340]">
                            Program Details
                          </h2>
                        </div>

                        {/* Details */}
                        <div className="px-4 sm:px-6 py-2">
                          {metaInfoData.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] items-start py-2 gap-1 sm:gap-0"
                              >
                                <div className="flex items-center gap-2">
                                  <p className="text-[15px] text-gray-500">{item.label}</p>

                                  {item.remarks && (
                                    <div className="relative group">
                                      <Info
                                        size={16}
                                        className="text-orange-500 cursor-pointer flex-shrink-0"
                                      />
                                      <div
                                        className="
                                          absolute left-6 top-1/2 -translate-y-1/2
                                          hidden group-hover:block
                                          z-50
                                          w-60 sm:w-72
                                          rounded-lg
                                          bg-[#1D2340]
                                          text-white
                                          text-xs
                                          p-3
                                          shadow-xl
                                          whitespace-normal
                                        "
                                      >
                                        {item.remarks}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <p className="text-[15px] font-semibold text-[#1D2340] break-words">
                                  {item.value}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Entry Requirements */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm mt-4">
                      <div className="flex items-center gap-3 border-b border-gray-100 px-4 sm:px-6 py-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1D2340]">
                          Entry Requirements
                        </h3>
                      </div>

                      {hasEntryRequirements ? (
                        <div className="divide-y divide-gray-100">
                          {isValidValue(course?.metaInfo?.EntryRequirement) && (
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-2 sm:gap-6 px-4 sm:px-6 py-4">
                              <p className="text-gray-600">General Requirement</p>
                              <p className="font-semibold text-[#1D2340]">
                                {course.metaInfo.EntryRequirement}
                              </p>
                            </div>
                          )}

                          {isValidValue(course?.requirements?.EntryRequirementTwelfth) && (
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-2 sm:gap-6 px-4 sm:px-6 py-4">
                              <p className="text-gray-600">12th Requirement</p>
                              <p className="font-semibold text-[#1D2340]">
                                {course.requirements.EntryRequirementTwelfth}
                              </p>
                            </div>
                          )}

                          {isValidValue(course?.requirements?.EntryRequirementUG) && (
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-2 sm:gap-6 px-4 sm:px-6 py-4">
                              <p className="text-gray-600">UG Requirement</p>
                              <p className="font-semibold text-[#1D2340]">
                                {course.requirements.EntryRequirementUG}
                              </p>
                            </div>
                          )}

                          {isValidValue(course?.requirements?.WorkExp) && (
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-2 sm:gap-6 px-4 sm:px-6 py-4">
                              <p className="text-gray-600">Work Experience</p>
                              <p className="font-semibold text-[#1D2340]">
                                {course.requirements.WorkExp}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-10">
                          <p className="text-gray-500 font-medium">
                            No Entry Requirements Available
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Application Information */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-6">
                      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-[#1D2340]">
                            Application Information
                          </h3>
                        </div>
                      </div>

                    {hasApplicationInfo ?  ( <div className="divide-y divide-gray-100">
                        {/* Initial Deposit */}
                        {Number(course?.metaInfo?.initialDeposit) > 0 && <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-5 hover:bg-orange-50 transition-all gap-2 sm:gap-0">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-[#1D2340]">Initial Deposit</h4>
                              <p className="text-sm text-gray-500">Amount payable before admission</p>
                            </div>
                          </div>
                          <span className="font-semibold text-[#1D2340]">
                            {course?.metaInfo?.initialDeposit} {course?.currency}
                          </span>
                        </div>}

                        {/* Intake Deadline */}
                      {course?.metaInfo?.intakeDeadline &&  <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-5 hover:bg-orange-50 transition-all gap-2 sm:gap-0">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <CalendarDays className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-[#1D2340]">Intake Deadline</h4>
                              <p className="text-sm text-gray-500">Last date to apply</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-semibold text-[#1D2340]">
                              {course?.metaInfo?.intakeDeadline?.split(":")[0] || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {course?.metaInfo?.intakeDeadline?.split(":")[1]}
                            </p>
                          </div>
                        </div>}

                        {/* Backlog */}
                      {course?.metaInfo?.backlog &&  <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-5 hover:bg-orange-50 transition-all gap-2 sm:gap-0">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <ClipboardList className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-[#1D2340]">Maximum Backlogs</h4>
                              <p className="text-sm text-gray-500">Allowed academic backlogs</p>
                            </div>
                          </div>
                          <span className="font-semibold text-[#1D2340]">
                            {course?.metaInfo?.backlog || "N/A"}
                          </span>
                        </div>}
                      </div>) : (
                          <div className="flex items-center justify-center py-10">
      <p className="text-gray-500 font-medium">
        No Application Information Available
      </p>
    </div>
                      )}
                    </div>

                    {/* University Rankings */}
                    {course.university?.uni_rank?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-6"
                      >
                        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-[#1D2340]">
                            University Rankings
                          </h3>
                        </div>

                        <div className="divide-y divide-gray-100">
                          {course.university.uni_rank.map((rank, index) => (
                            <div
                              key={index}
                              className="flex flex-row sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-5 hover:bg-orange-50 transition-all duration-200 gap-2 sm:gap-0"
                            >
                              <div>
                                <h4 className="font-medium text-[#1D2340]">{rank.type}</h4>
                                <p className="text-sm text-gray-500">University Ranking</p>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="text-xl font-bold text-[#1D2340]">#{rank.rank}</p>
                                <span className="inline-flex mt-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                  {rank.year}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Accommodation */}
                    {(course.university?.on_campus_accommodation ||
                      course.university?.off_campus_accommodation) && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-6"
                      >
                        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-[#1D2340]">
                            Accommodation
                          </h3>
                        </div>

                        <div className="divide-y divide-gray-100">
                          {course.university?.on_campus_accommodation && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-5 bg-green-50 transition-all gap-3 sm:gap-0">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                  <Home className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-[#1D2340]">On-Campus Accommodation</h4>
                                  <p className="text-sm text-gray-500">University-managed housing available</p>
                                </div>
                              </div>
                              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                <Check className="w-4 h-4" />
                                Available
                              </span>
                            </div>
                          )}

                          {course.university?.off_campus_accommodation && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-5 bg-blue-50 transition-all gap-3 sm:gap-0">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-[#1D2340]">Off-Campus Accommodation</h4>
                                  <p className="text-sm text-gray-500">Private accommodation options available</p>
                                </div>
                              </div>
                              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                <Check className="w-4 h-4" />
                                Available
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* ============ RIGHT COLUMN ============ */}
                  <div className="flex flex-col gap-4">
                    {course?.requirements ? (
                      <>
                        {/* English Proficiency */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-4">
                          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-orange-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-[#1D2340]">
                                English Proficiency Test Requirements
                              </h3>
                            </div>
                          </div>

                          {hasEnglishRequirements ? (
                            <div className="divide-y divide-gray-100">
                              {(isValidValue(course?.requirements?.PteScore) ||
                                isValidValue(course?.requirements?.PteNoSectionLessThan)) && (
                                <div className="px-4 sm:px-6 py-2">
                                  {isValidValue(course?.requirements?.PteScore) && (
                                    <div className="flex justify-between">
                                      <p className="text-gray-600">PTE Overall</p>
                                      <p className="font-semibold">{course.requirements.PteScore}</p>
                                    </div>
                                  )}
                                  {isValidValue(course?.requirements?.PteNoSectionLessThan) && (
                                    <div className="flex justify-between">
                                      <p className="text-gray-600">PTE No Bands Less Than</p>
                                      <p className="font-semibold">
                                        {course.requirements.PteNoSectionLessThan}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {(isValidValue(course?.requirements?.ToeflScore) ||
                                isValidValue(course?.requirements?.ToeflNoSectionLessThan)) && (
                                <div className="px-4 sm:px-6 py-2">
                                  {isValidValue(course?.requirements?.ToeflScore) && (
                                    <div className="flex justify-between">
                                      <p className="text-gray-600">TOEFL Overall</p>
                                      <p className="font-semibold">{course.requirements.ToeflScore}</p>
                                    </div>
                                  )}
                                  {isValidValue(course?.requirements?.ToeflNoSectionLessThan) && (
                                    <div className="flex justify-between">
                                      <p className="text-gray-600">TOEFL No Bands Less Than</p>
                                      <p className="font-semibold">
                                        {course.requirements.ToeflNoSectionLessThan}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {(isValidValue(course?.requirements?.Ielts) ||
                                isValidValue(course?.requirements?.IeltsNoBandLessThan)) && (
                                <div className="px-4 sm:px-6 py-2">
                                  {isValidValue(course?.requirements?.Ielts) && (
                                    <div className="flex justify-between">
                                      <p className="text-gray-600">IELTS Overall</p>
                                      <p className="font-semibold">{course.requirements.Ielts}</p>
                                    </div>
                                  )}
                                  {isValidValue(course?.requirements?.IeltsNoBandLessThan) && (
                                    <div className="flex justify-between">
                                      <p className="text-gray-600">IELTS No Bands Less Than</p>
                                      <p className="font-semibold">
                                        {course.requirements.IeltsNoBandLessThan}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {isValidValue(course?.requirements?.DETScore) && (
                                <div className="px-4 sm:px-6 py-2">
                                  <div className="flex justify-between">
                                    <p className="text-gray-600">DET Score</p>
                                    <p className="font-semibold">{course.requirements.DETScore}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-10">
                              <p className="text-gray-500 text-base font-medium">
                                No English Proficiency Test Requirements
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Standardized Tests */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-orange-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-[#1D2340]">
                                Standardized Test Requirements
                              </h3>
                            </div>
                          </div>

                          {hasStandardizedTests ? (
                            <div className="divide-y divide-gray-100">
                              {isValidValue(course?.requirements?.GreScore) && (
                                <div className="px-4 sm:px-6 py-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] py-2 gap-1 sm:gap-0">
                                    <p className="text-gray-600">GRE Score</p>
                                    <p className="font-semibold text-[#1D2340]">
                                      {course.requirements.GreScore}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {isValidValue(course?.requirements?.GmatScore) && (
                                <div className="px-4 sm:px-6 py-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] py-2 gap-1 sm:gap-0">
                                    <p className="text-gray-600">GMAT Score</p>
                                    <p className="font-semibold text-[#1D2340]">
                                      {course.requirements.GmatScore}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {isValidValue(course?.requirements?.ActScore) && (
                                <div className="px-4 sm:px-6 py-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] py-2 gap-1 sm:gap-0">
                                    <p className="text-gray-600">ACT Score</p>
                                    <p className="font-semibold text-[#1D2340]">
                                      {course.requirements.ActScore}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {isValidValue(course?.requirements?.SatScore) && (
                                <div className="px-4 sm:px-6 py-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] py-2 gap-1 sm:gap-0">
                                    <p className="text-gray-600">SAT Score</p>
                                    <p className="font-semibold text-[#1D2340]">
                                      {course.requirements.SatScore}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-10">
                              <p className="text-gray-500 text-base font-medium">
                                No Standardized Test Requirements
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : null}

                    {/* Required Documents */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-[#1D2340]">
                            Required Documents
                          </h3>
                        </div>
                        <span className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-semibold border border-orange-200">
                          {course?.docsRequired?.length || 0} Documents
                        </span>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {course?.docsRequired?.map((doc: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-orange-50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-[#1D2340]">{doc}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  Required for application review
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              Required
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* About the University */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden py-3"
                    >
                      <div className="flex items-center gap-3 px-4 sm:px-6 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <Building2Icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1D2340]">
                          About the University
                        </h3>
                      </div>

                      <div className="p-2 sm:p-4">
                        {course.university?.slogan && (
                          <div className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 my-2">
                            <p className="italic text-gray-700">
                              "{course.university.slogan}"
                            </p>
                          </div>
                        )}

                        <div className="divide-y divide-gray-100">
                          {course.university?.address && (
                            <div className="flex flex-row sm:flex-row justify-between items-start py-4 border-b border-gray-100 gap-2 sm:gap-0">
                              <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-orange-600" />
                                <span className="font-medium text-gray-700">Location</span>
                              </div>
                              <p className="font-semibold text-[#1D2340] leading-7">
                                {course.university?.address}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between py-4 gap-2 sm:gap-0">
                            <div className="flex items-center gap-3">
                              <Building2Icon className="w-5 h-5 text-orange-600" />
                              <span className="font-medium text-gray-700">Established</span>
                            </div>
                            <span className="font-semibold text-[#1D2340]">
                              {course.university?.established_year || "N/A"}
                            </span>
                          </div>

                          <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between py-4 gap-2 sm:gap-0">
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-orange-600" />
                              <span className="font-medium text-gray-700">Acceptance Rate</span>
                            </div>
                            <span className="font-semibold text-[#1D2340]">
                              {course.university?.acceptanceRate
                                ? `${course.university.acceptanceRate}%`
                                : "N/A"}
                            </span>
                          </div>

                          {course.university?.uni_web && (
                            <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between py-4 gap-2 sm:gap-0">
                              <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-orange-600" />
                                <span className="font-medium text-gray-700">Website</span>
                              </div>
                              <a
                                href={course.university.uni_web}
                                target="_blank"
                                className="font-semibold text-orange-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>

                        {course.university?.intakes?.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-semibold text-[#1D2340] mb-3">
                              Available Intakes
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {course.university.intakes.map((intake, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-orange-50 border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700"
                                >
                                  {intake}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <Link
                          href={`/dashboard/universities/${course.university?.slug}`}
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F26D44] py-3 font-medium text-white transition hover:bg-[#e45d33]"
                        >
                          View University Profile
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          );
        })}

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="relative overflow-hidden mt-12 bg-gradient-to-r from-[#F26D44]/10 via-pink-200 to-orange-100 text-gray-800"
        >
          <div className="px-4 sm:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-10 h-10 opacity-90" strokeWidth={1.3} />
                <h3 className="text-2xl font-semibold">Ready to Apply?</h3>
              </div>
              <p className="text-lg leading-relaxed">
                Take the next step toward your academic journey at{" "}
                <span className="font-semibold">{course.university?.name}</span>.
                Begin your application today and secure your place.
              </p>
              <p className="text-sm mt-4">
                Application Fee:{" "}
                <span className="font-semibold">
                  {course.applicationFee + course.currency}
                </span>
              </p>
            </div>

            <div className="relative z-50 w-full md:w-auto">
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setIsModalOpen(true);
                }}
                className="w-full md:w-auto px-8 py-2.5 cursor-pointer bg-white text-gray-700 rounded-xl hover:bg-orange-100 transition-all font-semibold flex items-center justify-center gap-2"
              >
                Apply
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </motion.div>
  </div>
</div>
            </div>
            <CreateApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApplicationCreated={() => { }}
                program={selectedCourse}

            />
        </div>


    )
}