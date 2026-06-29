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
            <span className="text-sm text-gray-500 font-medium">
                {label}
            </span>

            <span
                className={`font-bold text-[#1F2340] leading-snug ${small ? "text-lg" : "text-2xl"
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

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const getLevelColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'undergraduate':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'postgraduate':
                return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'diploma':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'certificate':
                return 'bg-amber-100 text-amber-700 border-amber-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getStudyModeIcon = (mode: string) => {
        switch (mode?.toLowerCase()) {
            case 'full-time':
                return <Clock className="w-4 h-4" />
            case 'part-time':
                return <Briefcase className="w-4 h-4" />
            case 'online':
                return <Globe className="w-4 h-4" />
            default:
                return <BookOpen className="w-4 h-4" />
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
                    className="flex items-center gap-2 text-sm text-gray-600 mb-4"
                >
                    <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/dashboard/universities" className="hover:text-blue-600 transition-colors">Universities</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href={`/dashboard/universities/${course.university?.slug}`} className="hover:text-blue-600 transition-colors">
                        {course.university?.name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{course.name}</span>
                </motion.div>

                {/* Hero Section - University & Course Header */}

                {/* <div className="relative overflow-hidden h-[300px] mb-4">
                 
                    {course?.university ? (
                        <img
                            src={course?.university?.cover_photo || "https://www.ox.ac.uk/sites/files/oxford/styles/ow_large_feature/s3/field/field_image_main/GAF%20Radcliffe%20Square%20Dawn%20-%20Elizabeth%20Nyikos.jpg?itok=U-0F0aPx"}
                            alt={course?.university.name}
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr31PbmRHkijGWNIrYGMG0jgevvfpZLVVkh1e42JkPVeQppX6XCfiCF_E&s=10";
                            }}
                            className="absolute  inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 pattern-grid" />
                    )}
                    <div className="absolute  inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                 
                    <div className="absolute  bottom-0 left-0 right-0 p-6">
                        <div className="container mx-auto">
                            <div className="flex items-end gap-6">
                           
                                <div className="w-32 h-32  bg-white p-4 shadow-2xl border border-white/50">
                                    {course?.university.uni_logo ? (
                                        <img
                                            src={course?.university.uni_logo || "/images/newlogo3.png"}
                                            alt={course?.university.name}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/images/newlogo3.png";
                                            }}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building className="w-full h-full text-muted-foreground" />
                                    )}
                                </div>

                                <div className="flex-1">

                                    <h1 className="text-2xl font-bold text-gray-900 py-2">
                                        {course.name}
                                    </h1>
                                    <div className="flex items-center justify-start gap-2">
                                        <Building2 className="w-5 h-5 text-gray-800 " />
                                        <h3 className="text-lg font-semibold mb-1">{course?.university.name}</h3>

                                    </div>

                                    <div className="flex items-center gap-4 my-2">
                                        <span className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            {course?.university.city}, {course?.university.country}
                                        </span>
                                        {course?.university.uni_web && (
                                            <a
                                                href={course?.university.uni_web}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                                            >
                                                <Globe className="w-4 h-4" />
                                                Official Website
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                     
                                        <span className={`px-3 py-1.5 text-xs font-medium border ${getLevelColor(course.level)}`}>
                                            {course.level}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-xs font-medium text-gray-700">
                                            {getStudyModeIcon(course.studyMode)}
                                            {course.studyMode}
                                        </span>
                                        {course.tags?.includes('popular') && (
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs font-medium border border-amber-200">
                                                <Trophy className="w-3 h-3" />
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                   
                                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="w-full rounded-3xl bg-gradient-to-r from-[#FFF7F3] via-white to-[#FFF7F3] border border-[#F5E6DE] shadow-sm overflow-hidden mb-4">
                    <div className="grid lg:grid-cols-[100px_1fr_420px] items-center gap-8 p-8">

                        {/* Logo */}
                        <div className="flex justify-center">
                            <div className="w-[110px] h-[110px] rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
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
                            <h2 className="text-2xl font-bold text-[#1B2143] leading-tight">

                                {course.name}
                            </h2>

                            <div className="mt-4 space-y-3">

                                <div className="flex items-center gap-2 text-gray-700">
                                    <Building2 size={18} className="text-gray-500" />
                                    <span className="font-semibold text-lg">
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
                        <div className="relative flex  items-center justify-center">

                            {/* Decorative Circle */}
                            <div className="absolute "></div>

                            {/* Image */}
                            <Image
                                src="/hero-program.png"
                                alt="Graduation"
                                width={240}
                                height={220}
                                className="relative z-10"
                            />

                            <button className="mt-35  bg-gradient-to-r from-[#FF6A2B] to-[#FF4F17] text-white rounded-xl px-4 py-2 flex items-center gap-3 font-semibold shadow-lg hover:scale-105 duration-300">
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
                        <div className="grid grid-cols-2 lg:grid-cols-5">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto  gap-6">
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
                                <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar scrollbar-hide ">
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
                            <div className="p-2">
                                {/* Dynamic Extra Content Sections */}
                                {course.extra_content?.sections?.map((section) => (
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

                                            <div className="grid grid-cols-2 gap-4 items-start">

                                                <div className="flex flex-col">

                                                    <div className=" mt-4">
                                                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                                                            {/* Header */}
                                                            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                                                                    <Info className="h-5 w-5 text-orange-600" />
                                                                </div>

                                                                <h2 className="text-lg font-semibold text-[#1D2340]">
                                                                    Program Details
                                                                </h2>
                                                            </div>

                                                            {/* Details */}
                                                            <div className="px-6 py-2">
                                                                {programDetails.map((item, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="grid grid-cols-[330px_1fr] items-start py-2"
                                                                    >
                                                                        <p className="text-[15px] text-gray-500">
                                                                            {item.label}
                                                                        </p>

                                                                        <p className="text-[15px] font-semibold text-[#1D2340] break-words">
                                                                            {item.value || "N/A"}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-4">
                                                        {/* Header */}
                                                        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">

                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center py-2">
                                                                    <GraduationCap className="w-5 h-5 text-orange-600" />
                                                                </div>

                                                                <h3 className="text-lg font-semibold text-[#1D2340]">
                                                                    Entry Requirements
                                                                </h3>
                                                            </div>
                                                        </div>

                                                        <div className="px-6 py-2">
                                                            <span>{course?.metaInfo?.EntryRequirement}</span>
                                                        </div>



                                                    </div>

                                                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-6">
                                                        {/* Header */}
                                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                                    <ClipboardList className="w-5 h-5 text-orange-600" />
                                                                </div>

                                                                <h3 className="text-lg font-semibold text-[#1D2340]">
                                                                    Application Information
                                                                </h3>
                                                            </div>
                                                        </div>

                                                        {/* Body */}
                                                        <div className="divide-y divide-gray-100">

                                                            {/* Initial Deposit */}
                                                            <div className="flex items-center justify-between px-6 py-5 hover:bg-orange-50 transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                                                        <Wallet className="w-5 h-5 text-orange-600" />
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="font-medium text-[#1D2340]">
                                                                            Initial Deposit
                                                                        </h4>

                                                                        <p className="text-sm text-gray-500">
                                                                            Amount payable before admission
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <span className="font-semibold text-[#1D2340]">
                                                                    {course?.currency} {course?.metaInfo?.initialDeposit || 0}
                                                                </span>
                                                            </div>

                                                            {/* Intake Deadline */}
                                                            <div className="flex items-center justify-between px-6 py-5 hover:bg-orange-50 transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                                                        <CalendarDays className="w-5 h-5 text-orange-600" />
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="font-medium text-[#1D2340]">
                                                                            Intake Deadline
                                                                        </h4>

                                                                        <p className="text-sm text-gray-500">
                                                                            Last date to apply
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right">
                                                                    <p className="font-semibold text-[#1D2340]">
                                                                        {course?.metaInfo?.intakeDeadline?.split(":")[0] || "N/A"}
                                                                    </p>

                                                                    <p className="text-sm text-gray-500">
                                                                        {course?.metaInfo?.intakeDeadline?.split(":")[1]}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Backlog */}
                                                            <div className="flex items-center justify-between px-6 py-5 hover:bg-orange-50 transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                                                        <ClipboardList className="w-5 h-5 text-orange-600" />
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="font-medium text-[#1D2340]">
                                                                            Maximum Backlogs
                                                                        </h4>

                                                                        <p className="text-sm text-gray-500">
                                                                            Allowed academic backlogs
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <span className="font-semibold text-[#1D2340]">
                                                                    {course?.metaInfo?.backlog || "N/A"}
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    {course.university?.uni_rank?.length > 0 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.25 }}
                                                            className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-6"
                                                        >
                                                            {/* Header */}
                                                            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                                    <Trophy className="w-5 h-5 text-orange-600" />
                                                                </div>

                                                                <h3 className="text-lg font-semibold text-[#1D2340]">
                                                                    University Rankings
                                                                </h3>
                                                            </div>

                                                            {/* Body */}
                                                            <div className="divide-y divide-gray-100">
                                                                {course.university.uni_rank.map((rank, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="flex items-center justify-between px-6 py-5 hover:bg-orange-50 transition-all duration-200"
                                                                    >
                                                                        <div>
                                                                            <h4 className="font-medium text-[#1D2340]">
                                                                                {rank.type}
                                                                            </h4>

                                                                            <p className="text-sm text-gray-500">
                                                                                University Ranking
                                                                            </p>
                                                                        </div>

                                                                        <div className="text-right">
                                                                            <p className="text-xl font-bold text-[#1D2340]">
                                                                                #{rank.rank}
                                                                            </p>

                                                                            <span className="inline-flex mt-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                                                                {rank.year}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {(course.university?.on_campus_accommodation ||
                                                        course.university?.off_campus_accommodation) && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.3 }}
                                                                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-6"
                                                            >
                                                                {/* Header */}
                                                                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                                                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                                        <Building2 className="w-5 h-5 text-orange-600" />
                                                                    </div>

                                                                    <h3 className="text-lg font-semibold text-[#1D2340]">
                                                                        Accommodation
                                                                    </h3>
                                                                </div>

                                                                {/* Body */}
                                                                <div className="divide-y divide-gray-100">

                                                                    {course.university?.on_campus_accommodation && (
                                                                        <div className="flex items-center justify-between px-6 py-5 bg-green-50 transition-all">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                                                    <Home className="w-5 h-5 text-green-600" />
                                                                                </div>

                                                                                <div>
                                                                                    <h4 className="font-medium text-[#1D2340]">
                                                                                        On-Campus Accommodation
                                                                                    </h4>

                                                                                    <p className="text-sm text-gray-500">
                                                                                        University-managed housing available
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                                                                <Check className="w-4 h-4" />
                                                                                Available
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {course.university?.off_campus_accommodation && (
                                                                    <div>
                                                                         <div className="flex items-center justify-between px-6 py-5 bg-blue-50 transition-all">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                                                </div>

                                                                                <div>
                                                                                    <h4 className="font-medium text-[#1D2340]">
                                                                                        Off-Campus Accommodation
                                                                                    </h4>

                                                                                    <p className="text-sm text-gray-500">
                                                                                        Private accommodation options available
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                                                                <Check className="w-4 h-4" />
                                                                                Available
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    )}

                                                                </div>
                                                            </motion.div>
                                                        )}

                                                </div>

                                                <div className="flex flex-col gap-4">
                                                    {course?.requirements ? (
                                                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mt-4">
                                                            {/* Header */}
                                                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                                        <GraduationCap className="w-5 h-5 text-orange-600" />
                                                                    </div>

                                                                    <h3 className="text-lg font-semibold text-[#1D2340]">
                                                                        English Proficiency Test Requirements
                                                                    </h3>
                                                                </div>

                                                                <button className="px-4 py-2 text-sm font-medium border border-[#F26D44] text-[#F26D44] rounded-lg hover:bg-orange-50 transition">
                                                                    View Details
                                                                </button>
                                                            </div>

                                                            {/* Body */}
                                                            <div className="divide-y divide-gray-100">
                                                                {[
                                                                    {
                                                                        exam: "PTE",
                                                                        overall: course.requirements.PteScore,
                                                                        band: course.requirements.PteNoSectionLessThan,
                                                                    },
                                                                    {
                                                                        exam: "TOEFL iBT",
                                                                        overall: course.requirements.ToeflScore,
                                                                        band: course.requirements.ToeflNoSectionLessThan,
                                                                    },
                                                                    {
                                                                        exam: "IELTS",
                                                                        overall: course.requirements.Ielts,
                                                                        band: course.requirements.IeltsNoSectionLessThan,
                                                                    },
                                                                ].map((item, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="grid grid-cols-2 items-center px-6  py-4 text-sm"
                                                                    >
                                                                        <div className="grid grid-cols-2">
                                                                            {/* Overall */}
                                                                            <div className="text-gray-600">
                                                                                {item.exam} Overall
                                                                            </div>

                                                                            <div className="font-semibold text-[#1D2340]">
                                                                                {item.overall}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-[3fr_1fr]">
                                                                            {/* Band */}
                                                                            <div className="text-gray-600">
                                                                                {item.exam} No Bands Less Than
                                                                            </div>

                                                                            <div className="font-semibold text-[#1D2340]">
                                                                                {item.band}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-gray-600">
                                                            No English proficiency requirements available.
                                                        </p>
                                                    )}



                                                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                                        {/* Header */}
                                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
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

                                                        {/* Body */}
                                                        <div className="divide-y divide-gray-100">
                                                            {course?.docsRequired?.map((doc: string, index: number) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center justify-between px-6 py-4 hover:bg-orange-50 transition-all duration-200"
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                                                            <FileText className="w-5 h-5 text-orange-600" />
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="font-medium text-[#1D2340]">
                                                                                {doc}
                                                                            </h4>

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


                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                                                    >
                                                        {/* Header */}
                                                        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                                <Building2Icon className="w-5 h-5 text-orange-600" />
                                                            </div>

                                                            <h3 className="text-lg font-semibold text-[#1D2340]">
                                                                About the University
                                                            </h3>
                                                        </div>

                                                        {/* Body */}
                                                        <div className="p-6">

                                                            {/* Slogan */}
                                                            {course.university?.slogan && (
                                                                <div className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 mb-6">
                                                                    <p className="italic text-gray-700">
                                                                        "{course.university.slogan}"
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Information */}
                                                            <div className="divide-y divide-gray-100">

                                                                {course.university?.address && (
                                                                    <div className="grid grid-cols-[220px_1fr] items-start py-4 border-b border-gray-100">

                                                                        <div className="flex items-center gap-3">
                                                                            <MapPin className="w-5 h-5 text-orange-600" />

                                                                            <span className="font-medium text-gray-700">
                                                                                Location
                                                                            </span>
                                                                        </div>

                                                                        <p className="font-semibold text-[#1D2340] leading-7">
                                                                            {course.university?.address}
                                                                        </p>

                                                                    </div>
                                                                )}

                                                                <div className="flex items-center justify-between py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <Building2Icon className="w-5 h-5 text-orange-600" />
                                                                        <span className="font-medium text-gray-700">
                                                                            Established
                                                                        </span>
                                                                    </div>

                                                                    <span className="font-semibold text-[#1D2340]">
                                                                        {course.university?.established_year || "N/A"}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center justify-between py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <Users className="w-5 h-5 text-orange-600" />
                                                                        <span className="font-medium text-gray-700">
                                                                            Acceptance Rate
                                                                        </span>
                                                                    </div>

                                                                    <span className="font-semibold text-[#1D2340]">
                                                                        {course.university?.acceptanceRate
                                                                            ? `${course.university.acceptanceRate}%`
                                                                            : "N/A"}
                                                                    </span>
                                                                </div>

                                                                {course.university?.uni_web && (
                                                                    <div className="flex items-center justify-between py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <Globe className="w-5 h-5 text-orange-600" />
                                                                            <span className="font-medium text-gray-700">
                                                                                Website
                                                                            </span>
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

                                                            {/* Intakes */}
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

                                                            {/* Button */}
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









                                            {course?.metaInfo?.Remarks && (
                                                <div className="bg-gray-50 border border-gray-200 p-4">
                                                    <p className="text-lg font-medium text-gray-500 uppercase tracking-wider mb-2">
                                                        Remark
                                                    </p>
                                                    <p className="text-sm text-gray-800 leading-relaxed">
                                                        {course.metaInfo.Remarks}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                ))}
                                <CourseDetailScholarships
                                    countryId={course?.university?.country} // Pass the country ID from your course data
                                    universityId={course.university._id} // Optional: filter by university
                                    subjectId={null} // Optional: filter by subject
                                    limit={5} // Number of scholarships per page
                                    showFilters={true} // Show/hide filter panel
                                    title="Scholarships for this Course" // Custom title
                                />



                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="relative overflow-hidden  mt-12 bg-gradient-to-r from-[#F26D44]/10 via-pink-200 to-orange-100 text-gray-800"
                                >
                                    <div className="px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">

                                        {/* Left Content */}
                                        <div className="max-w-2xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <GraduationCap className="w-10 h-10 opacity-90" strokeWidth={1.3} />
                                                <h3 className="text-2xl font-semibold">
                                                    Ready to Apply?
                                                </h3>
                                            </div>

                                            <p className=" text-lg leading-relaxed">
                                                Take the next step toward your academic journey at{" "}
                                                <span className="font-semibold">
                                                    {course.university?.name}
                                                </span>.
                                                Begin your application today and secure your place.
                                            </p>

                                            <p className="text-sm mt-4">
                                                Application Fee:{" "}
                                                <span className="font-semibold">
                                                    {course.applicationFee + course.currency}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Right Action */}
                                        <div className="relative z-50 w-full md:w-auto">
                                            <button
                                                onClick={() => { setIsModalOpen(true) }}
                                                className="w-full md:w-auto px-8 py-2.5 cursor-pointer bg-white text-gray-700 rounded-xl hover:bg-orange-100 transition-all font-semibold flex items-center justify-center gap-2"
                                            >
                                                Apply
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Decorative Blur Circle */}
                                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                                </motion.div>

                            </div>
                        </motion.div>
                    </div>


                </div>
            </div>
        </div>
    )
}