"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Building, MapPin, Globe, Users, Star, Calendar,
    ChevronLeft, ExternalLink, BookOpen, GraduationCap,
    DollarSign, Award, Check, X, Clock, Home, Mail,
    Phone, Share2, Bookmark, Download, School,
    TrendingUp, TrendingDown, MinusCircle, Filter,
    Search, Loader2,
    ChevronRight,
    MapPinCheck,
    FileText,
    Building2,
    Tag,
    IndianRupee,
    Calendar1,
    Info
} from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/app/axiosInstance"
import { ModernSelect } from "@/components/ui/select"
import Image from "next/image"
import CourseCard from "@/components/dashboard/Program/CourseCard"


interface University {
    _id: string
    name: string
    slug: string
    slogan: string
    uni_type: string
    intakes: string[]
    short_description: string
    long_description: string
    code: string
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
    status: string
    acceptanceRate: number
    tags: string
    offers: string
    totalStudents: number
    internationalStudents: number
    facultyCount: number
    campusSize: string
    accreditation: string[]
    facilities: string[]
    contactEmail: string
    contactPhone: string
    socialMedia: {
        facebook?: string
        twitter?: string
        instagram?: string
        linkedin?: string
        youtube?: string
    }
    applicationDeadlines: Array<{
        intake: string
        deadline: string
    }>
}

interface Course {
    _id: string
    name: string
    slug: string
    code: string
    level: string
    duration: string
    durationUnit: string
    studyMode: string
    tuitionFee: {
        amount: number
        currency: string
        period: string
    }
    internationalFee?: {
        amount: number
        currency: string
        period: string
    }
    description: string
    shortDescription: string
    requirements: string[]
    careerOpportunities: string[]
    intakes: string[]
    language: string
    campus: string
    department: string
    faculty: string
    accreditation: string[]
    ranking: string
    applicationDeadline: string
    scholarshipsAvailable: boolean
    scholarshipInfo?: string
    curriculum: Array<{
        year: number
        subjects: string[]
    }>
    extra: {
        [key: string]: any
    }
    isPublished: boolean
    status: string
    universityId: string
    university?: {
        name: string
        uni_logo: string
        city: string
        country: string
        intakes: string[]
    }
}

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <div className="bg-[#f3f4f6] hover:bg-[#e5e7eb] hover:outline hover:outline-2 hover:outline-[#F26D44] p-3 md:p-4 transition-all">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 md:p-2 bg-white/50 rounded-lg">
                <Icon className="w-6 h-6 md:w-10 md:h-10 text-black" strokeWidth={1.1} />
            </div>
            <span className="flex flex-col gap-0.5 text-xs md:text-sm font-medium text-gray-800">
                {label}
                <span className="text-sm md:text-xl font-bold truncate">{value}</span>
            </span>
        </div>
    </div>
)

const TabButton = ({ active, onClick, children }: any) => (
    <button
        onClick={onClick}
        className={`px-3 md:px-4 py-2 md:py-3 whitespace-nowrap flex-shrink-0 text-sm md:text-base font-medium transition-all relative ${active
            ? 'text-gray-900'
            : 'text-muted-foreground hover:text-foreground'
            }`}
    >
        {children}

        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F26D44]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
    </button>
)

// Course Card Component - Responsive

// Main University Detail Page Component
export default function UniversityDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    // State Management
    const [university, setUniversity] = useState<University | null>(null)
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingCourses, setLoadingCourses] = useState(false)
    const [activeTab, setActiveTab] = useState()
    const [saved, setSaved] = useState(false)

    // Course Filters State
    const [courseFilters, setCourseFilters] = useState({
        level: "",
        studyMode: "",
        intake: "",
        minFee: "",
        maxFee: "",
        search: ""
    })
    const [coursePage, setCoursePage] = useState(1)
    const [hasMoreCourses, setHasMoreCourses] = useState(true)

    useEffect(() => {
        const fetchUniversityDetails = async () => {
            try {
                setLoading(true)
                const uniResponse = await axiosInstance.get(`/universities/${slug}`)
                const uniData = uniResponse.data.result
                setActiveTab(uniData.extra_content?.sections[0].section_key)

                setUniversity(uniData)
            } catch (error) {
                console.error('Error fetching university details:', error)
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            fetchUniversityDetails()
        }
    }, [slug])

    // Fetch Courses
    const fetchCourses = async (reset = false) => {
        if (!university) return

        try {
            setLoadingCourses(true)
            const currentPage = reset ? 1 : coursePage

            const params = new URLSearchParams({
                page: currentPage.toString(),
                isExtra: 'false',
                limit: '10',
                university: university._id,
                ...(courseFilters.level && { level: courseFilters.level }),
                ...(courseFilters.studyMode && { studyMode: courseFilters.studyMode }),
                ...(courseFilters.intake && { intake: courseFilters.intake }),
                ...(courseFilters.minFee && { minFee: courseFilters.minFee }),
                ...(courseFilters.maxFee && { maxFee: courseFilters.maxFee }),
                ...(courseFilters.search && { search: courseFilters.search })
            })

            const response = await axiosInstance.get(`/courses?${params}`)
            const data = response.data.data

            if (reset) {
                setCourses(data || [])
            } else {
                setCourses(prev => [...prev, ...(data || [])])
            }

            setHasMoreCourses(data.hasMore || false)
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setLoadingCourses(false)
        }
    }

    // Initial courses fetch when university loads
    useEffect(() => {
        if (university) {
            fetchCourses(true)
        }
    }, [university, courseFilters])

    useEffect(() => {
        if (coursePage > 1 && !loadingCourses) {
            fetchCourses(false)
        }
    }, [coursePage])

    const getSectionContent = (key: string) => {
        return university?.extra_content?.sections?.find(section => section.section_key === key)?.content || ''
    }

    // Filter options for courses
    const filterOptions = {
        levels: [...new Set(courses.map(c => c.level))],
        studyModes: [...new Set(courses.map(c => c.studyMode))],
        intakes: [...new Set(courses.flatMap(c => c.intakes || []))]
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading university details...</p>
                </div>
            </div>
        )
    }

    if (!university) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="text-center px-4">
                    <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl md:text-2xl font-bold mb-2">University Not Found</h2>
                    <p className="text-muted-foreground mb-6">The university you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => router.push('/dashboard/universities')}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Browse Universities
                    </button>
                </div>
            </div>
        )
    }

    return (
        <main className="flex-1 overflow-y-auto max-w-7xl mx-auto sm:px-3 md:px-4 relative">
            {/* Back Navigation - Responsive */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600 mb-3 overflow-x-auto no-scrollbar"
            >
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors whitespace-nowrap">Home</Link>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <Link href="/dashboard/universities" className="hover:text-blue-600 transition-colors whitespace-nowrap">Universities</Link>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span className="text-gray-900 font-medium truncate max-w-[150px] md:max-w-[200px]">{university.name}</span>
            </motion.div>

            {/* Cover Image Section - Responsive */}
            <div className="relative overflow-hidden h-[200px] md:h-[260px]">
                {university ? (
                    <Image
                        src={
                            university.cover_photo ||
                            "https://images.pexels.com/photos/6058867/pexels-photo-6058867.jpeg"
                        }
                        alt={university.name}
                        width={100}
                        height={100}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.pexels.com/photos/6058867/pexels-photo-6058867.jpeg";
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 pattern-grid" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Header Content - Stacks on Mobile */}
                <div className="absolute bottom-0 left-0 right-0 px-3 md:px-6 py-2 md:py-1">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-3 md:gap-6">
                            {/* Logo - Smaller on Mobile */}
                            <div className="w-20 h-20 md:w-32 md:h-28 p-1 bg-white rounded-lg shadow-lg">
                                {university.uni_logo ? (
                                    <Image
                                        src={university.uni_logo}
                                        alt={university.name}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://ooshasglobal.com/images/newlogo3.png";
                                        }}
                                    />
                                ) : (
                                    <Building className="w-full h-full text-muted-foreground" />
                                )}
                            </div>

                            {/* Info - Full Width on Mobile */}
                            <div className="flex-1 w-full md:pb-3">
                                {/* Badges - Wrap on Mobile */}
                                <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2">
                                    <span className="px-2 md:px-3 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] md:text-xs font-medium border">
                                        {university.uni_type}
                                    </span>
                                    <span className="px-2 md:px-3 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] md:text-xs font-medium border">
                                        Est. {university.established_year}
                                    </span>
                                    {university.uni_rank && university.uni_rank.length > 0 && (
                                        <span className="px-2 md:px-3 py-0.5 bg-amber-100/90 backdrop-blur-sm text-amber-700 rounded-full text-[10px] md:text-xs font-medium border border-amber-200">
                                            <Award className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                                            {university.uni_rank[0].rank} - {university.uni_rank[0].type}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-lg md:text-2xl text-white font-semibold mb-1 line-clamp-2">{university.name}</h1>
                                {university.slogan && (
                                    <p className="text-xs md:text-sm text-white italic mb-1 line-clamp-2">"{university.slogan}"</p>
                                )}

                                {/* Location and Website - Stack on Mobile */}
                                <div className="flex flex-col md:flex-row text-white items-start md:items-center gap-2 md:gap-4">
                                    <span className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                                        <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                        <span className="truncate">{university.city}, {university.country}</span>
                                    </span>
                                    {university.uni_web && (
                                        <a
                                            href={university.uni_web}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 md:gap-2 text-xs md:text-sm hover:text-primary transition-colors"
                                        >
                                            <Globe className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                            <span className="truncate">Official Website</span>
                                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Actions - Full Width Button on Mobile */}
                            <div className="w-full md:w-auto">
                                <button
                                    onClick={() => router.push(`/dashboard/programs?university=${university._id}`)}
                                    className="w-full md:w-auto px-4 py-2.5 bg-[#F26D44] hover:bg-[#F26D44]/90 text-white rounded-lg transition-colors font-medium text-sm"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar - Responsive Grid */}
            <div className="py-3 md:py-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
                    <StatCard icon={Users} label="Total Students" value={university.totalStudents?.toLocaleString() || '1000+'} />
                    <StatCard icon={Globe} label="International" value={university.internationalStudents?.toLocaleString() || '1000+'} />
                    <StatCard icon={GraduationCap} label="Acceptance Rate" value={`${university.acceptanceRate || 'N/A'}%`} />
                    <StatCard icon={School} label="Rank" value={`#${university?.uni_rank?.[0]?.rank?.split('-')[0] || 'N/A'} (${university?.uni_rank?.[0]?.type?.split(' ')[0] || 'N/A'})`} />
                    <StatCard icon={Building} label="Offers" value={!university.offers || university.offers == 0 ? "100 +" : university.offers} />
                </div>
            </div>

            {/* Main Content - Stacks on Mobile */}
            <div className="py-2 md:py-4">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Content - Full Width on Mobile */}
                    <div className="w-full lg:w-[70%]">
                        {/* Tabs - Horizontal Scroll on Mobile */}
                        <div className="flex border-b border-border mb-4 overflow-x-auto no-scrollbar scrollbar-hide">
                            {university?.extra_content?.sections?.map((section, index) => (
                                <TabButton key={index} active={activeTab === section.section_key} onClick={() => setActiveTab(section?.section_key)}>
                                    <div dangerouslySetInnerHTML={{ __html: section.heading }} />
                                </TabButton>
                            ))}
                            <TabButton active={activeTab === "courses"} onClick={() => setActiveTab("courses")}>
                                Courses ({courses.length})
                            </TabButton>
                        </div>

                        <div className="space-y-4">
                            {activeTab && getSectionContent(activeTab) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Description */}
                                    <div className="prose max-w-none">
                                        <div
                                            className="text-gray-800 leading-[1.8] mb-4 text-sm md:text-base"
                                            dangerouslySetInnerHTML={{
                                                __html: university.short_description
                                            }}
                                        />
                                        <div
                                            className="text-gray-800 leading-[1.8] text-sm md:text-base"
                                            dangerouslySetInnerHTML={{
                                                __html: getSectionContent(activeTab)
                                            }}
                                        />
                                    </div>

                                    {/* Quick Facts - Responsive Grid */}
                                    <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                                        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">Quick Facts</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-700">
                                            <div>
                                                <p className="text-xs md:text-sm text-muted-foreground mb-1">Established</p>
                                                <p className="font-medium text-sm md:text-base">{university.established_year}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs md:text-sm text-muted-foreground mb-1">University Type</p>
                                                <p className="font-medium uppercase text-sm md:text-base">{university.uni_type}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs md:text-sm text-muted-foreground mb-1">Intakes</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {university.intakes?.map((intake, i) => (
                                                        <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                                                            {intake}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs md:text-sm text-muted-foreground mb-1">Accommodation</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {university.on_campus_accommodation && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                            On Campus
                                                        </span>
                                                    )}
                                                    {university.off_campus_accommodation && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                            Off Campus
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="sm:col-span-2 lg:col-span-3">
                                                <p className="text-xs md:text-sm text-muted-foreground mb-1">Campus</p>
                                                <p className="font-medium text-sm md:text-base">{university.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facilities - Responsive Grid */}
                                    {university.facilities && university.facilities.length > 0 && (
                                        <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                                            <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">Campus Facilities</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                                                {university.facilities.map((facility, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                        <span className="text-xs md:text-sm">{facility}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Courses Section */}
                            {(activeTab === "courses" || activeTab) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4 md:space-y-6"
                                >
                                    <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Available Courses</h2>

                                    <div className="space-y-4">
                                        {courses.length === 0 && !loadingCourses ? (
                                            <div className="text-center py-8 md:py-12 bg-[#F3F4F6] border-2 border-border rounded-lg">
                                                <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-base md:text-lg font-bold mb-2">No Courses Found</h3>
                                                <p className="text-sm md:text-base text-muted-foreground">
                                                    No courses match your current filters.
                                                </p>
                                            </div>
                                        ) : (
                                            // Course Grid - Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
                                                {courses.map((course, index) => {

                                                    const metaInfo = course?.metaInfo || {};

                                                    const intakeDeadline = metaInfo?.intakeDeadline || "";

                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);

                                                    const intakeData = intakeDeadline
                                                        ? intakeDeadline.split(",").map((item) => {
                                                            const [month, date] = item.split(":");

                                                            const [day, monthNo, year] = date.split("-");

                                                            const deadline = new Date(
                                                                Number(year),
                                                                Number(monthNo) - 1,
                                                                Number(day)
                                                            );

                                                            return {
                                                                month,
                                                                deadline,
                                                                deadlineText: date,
                                                                isClosed: deadline < today,
                                                            };
                                                        })
                                                        : [];

                                                    const openIntakes = intakeData.filter((item) => !item.isClosed);
                                                    const closedIntakes = intakeData.filter((item) => item.isClosed);

                                                    const monthOrder = {
                                                        Jan: 0,
                                                        Feb: 1,
                                                        Mar: 2,
                                                        Apr: 3,
                                                        May: 4,
                                                        Jun: 5,
                                                        Jul: 6,
                                                        Aug: 7,
                                                        Sep: 8,
                                                        Oct: 9,
                                                        Nov: 10,
                                                        Dec: 11,
                                                    };

                                                    const currentMonth = new Date().getMonth();

                                                    const upcomingIntakes =
                                                        course?.metaInfo?.Intakes?.split(",")
                                                            .map((item) => item.trim())
                                                            .filter((month) => monthOrder[month] >= currentMonth) || [];


                                                    const fallbackIntakes =
                                                        metaInfo?.Intakes?.split(",").map((item) => item.trim()) || [];

                                                    const fallbackClosed = metaInfo?.IntakesClosed
                                                        ? metaInfo.IntakesClosed.split(",").map((item) => {
                                                            const [month, year, open, closed, remark] = item.split(":::");
                                                            return {
                                                                month: month.trim(),
                                                                remark: remark || "Deadline passed.",
                                                            };
                                                        })
                                                        : [];

                                                    const fallbackClosedMonths = fallbackClosed?.map((item) => item.month);

                                                    const fallbackOpenMonths = fallbackIntakes.filter(
                                                        (month) => !fallbackClosedMonths?.includes(month)
                                                    );

                                                    const deadlineMap =
                                                        metaInfo?.deadline && metaInfo.deadline !== "ASAP"
                                                            ? Object.fromEntries(
                                                                metaInfo?.deadline?.split(",")?.map((item) => {
                                                                    const [month, deadline] = item.split(":");
                                                                    return [month?.trim(), deadline?.trim()];
                                                                })
                                                            )
                                                            : {};

                                                    const isAsap = metaInfo?.deadline;

                                                    return (
                                                        <div
                                                            key={course._id}
                                                            className="fade-in-up"
                                                            style={{ animationDelay: `${index * 0.05}s` }}
                                                        >
                                                            {/* Compact Card */}
                                                            <div className={`  rounded-lg p-4 transition-all duration-200  hover:shadow-md hover:scale-101 h-full flex flex-col border border-gray-200 bg-white `}>

                                                                {/* Header */}
                                                                <div className="flex gap-3 mb-3 relative">
                                                                    {/* Logo */}
                                                                    <div className="flex-shrink-0">
                                                                        {course.university?.uni_logo ? (
                                                                            <img
                                                                                src={course.university?.uni_logo || "/images/newlogo3.png"}
                                                                                alt={course.university?.name}
                                                                                onError={(e) => {
                                                                                    e.currentTarget.src =
                                                                                        "/images/newlogo3.png";
                                                                                }}
                                                                                className="w-18 h-18 object-contain border border-gray-200 rounded-lg p-1.5 bg-gray-50"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                                                                                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Course Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="font-semibold text-orange-500 line-clamp-1 text-base leading-tight mb-0.5">
                                                                            {course.name}
                                                                        </h3>
                                                                        <p className="text-base font-medium text-gray-600 truncate mb-1">
                                                                            {course.university?.name}
                                                                        </p>
                                                                        <div className="flex items-center gap-1">
                                                                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            </svg>
                                                                            <span className="text-base text-gray-500 truncate">
                                                                                {course.university?.city}, {course.university?.country}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* {profile.role === "counsellor" ? (<div className="absolute top-1 -right-1">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedProgram.some(
                                                                                (item) => item._id === course._id
                                                                            )}
                                                                            onChange={() => handleCompareSelect(course)}
                                                                            className="w-5 h-5 accent-primary cursor-pointer"
                                                                        />
                                                                    </div>) : null} */}
                                                                </div>

                                                                {/* Description */}
                                                                {/* {course.description && (
                                                                         <div className="mb-3">
                                                                           <div className="w-6 h-0.5 bg-primary rounded-full mb-1.5"></div>
                                                                           <p className="text-base text-gray-600 leading-relaxed line-clamp-2" title={course.description}>
                                                                             {course.description}
                                                                           </p>
                                                                         </div>
                                                                       )} */}

                                                                {/* Key Details - Compact Grid */}
                                                                <div className="grid grid-cols-3 gap-2 mb-3">
                                                                    {/* Tuition Fee */}
                                                                    <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                                                                        <div className="flex items-center gap-1 mb-0.5">
                                                                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            <span className="text-[11px] font-medium text-gray-500">Yearly Tuition</span>
                                                                        </div>
                                                                        <p className="font-bold text-gray-900 text-base">
                                                                            {course.tuitionFee || 0 + course.currency} {course?.currency}
                                                                        </p>
                                                                    </div>

                                                                    {/* Duration */}
                                                                    <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                                                                        <div className="flex items-center gap-1 mb-0.5">
                                                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            <span className="text-[11px] font-medium text-gray-500">Duration</span>
                                                                        </div>
                                                                        <p className="font-semibold text-gray-800 text-base">
                                                                            {course.duration || 'N/A'}
                                                                        </p>
                                                                    </div>

                                                                    {/* Application Fee */}
                                                                    <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                                                                        <div className="flex items-center gap-1 mb-0.5">
                                                                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            <span className="text-[11px] font-medium text-gray-500">App. Fee</span>
                                                                        </div>
                                                                        <p className="font-semibold text-gray-800 text-base">
                                                                            {course.applicationFee || 0 + course.currency}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {metaInfo?.AverageScholarship && <div className="flex gap-4 items-center">
                                                                    <div><h4 className="text-sm font-bold text-gray-700 mb-2">
                                                                        Average Scholarship
                                                                    </h4></div>

                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-sm font-semibold text-black">
                                                                            {metaInfo?.AverageScholarship || "N/A"} {" "}{course?.currency}
                                                                        </span>

                                                                        {metaInfo?.AverageScholarshipRemarks && (
                                                                            <div className="relative group">
                                                                                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

                                                                                <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden w-64 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-sm leading-5 text-white shadow-lg group-hover:block">
                                                                                    {metaInfo.AverageScholarshipRemarks}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>}

                                                                {metaInfo?.initialDeposit && <div className="flex gap-4 items-center">
                                                                    <div><h4 className="text-sm font-bold text-gray-700 mb-2">
                                                                        Initial Deposit
                                                                    </h4></div>

                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-sm font-semibold text-black">
                                                                            {metaInfo?.initialDeposit || "N/A"} {" "}{course?.currency}
                                                                        </span>

                                                                        {metaInfo?.initialDeposit && (
                                                                            <div className="relative group">
                                                                                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

                                                                                <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden w-64 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-sm leading-5 text-white shadow-lg group-hover:block">
                                                                                    {metaInfo.initialDeposit}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>}

                                                                {/* Tags - Compact */}


                                                                {/* Intakes - Compact */}
                                                                <div className="mb-3 space-y-2">
                                                                    {/* Open Intakes */}
                                                                    {openIntakes.length > 0 && (
                                                                        <div className="flex items-start gap-3">
                                                                            <span className="min-w-[60px] rounded-full bg-green-100 px-2 py-1 text-center text-sm font-semibold text-green-700">
                                                                                Open
                                                                            </span>

                                                                            <div className="flex flex-wrap gap-2">
                                                                                {openIntakes.map((item) => (
                                                                                    <div key={item.month} className="group relative">
                                                                                        <span className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                                                                                            <Calendar1 className="h-4 w-4" />
                                                                                            {item.month}

                                                                                            <Info className="h-3 w-3 text-gray-500" />
                                                                                        </span>

                                                                                        <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                                                                                            Deadline: {item.deadlineText}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Closed Intakes */}
                                                                    {closedIntakes.length > 0 && (
                                                                        <div className="flex items-start gap-3">
                                                                            <span className="min-w-[60px] rounded-full bg-red-100 px-2 py-1 text-center text-sm font-semibold text-red-700">
                                                                                Closed
                                                                            </span>

                                                                            <div className="flex flex-wrap gap-2">
                                                                                {closedIntakes.map((item) => (
                                                                                    <div key={item.month} className="group relative">
                                                                                        <span className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                                                                                            <Calendar1 className="h-4 w-4" />
                                                                                            {item.month}

                                                                                            <Info className="h-3 w-3 text-gray-500" />
                                                                                        </span>

                                                                                        <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                                                                                            Deadline passed. It will come again soon.
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Fallback */}
                                                                    {/* Fallback */}
                                                                    {openIntakes.length === 0 &&
                                                                        closedIntakes.length === 0 &&
                                                                        fallbackIntakes.length > 0 && (
                                                                            <div className="space-y-2">

                                                                                {/* Open */}
                                                                                {fallbackOpenMonths.length > 0 && (
                                                                                    <div className="flex items-start gap-3">
                                                                                        <span className="min-w-[60px] rounded-full bg-green-100 px-2 py-1 text-center text-sm font-semibold text-green-700">
                                                                                            Open
                                                                                        </span>

                                                                                        <div className="flex flex-wrap gap-2">
                                                                                            {fallbackOpenMonths.map((month) => (
                                                                                                <div key={month} className="group relative">
                                                                                                    <span className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                                                                                                        <Calendar1 className="h-4 w-4" />
                                                                                                        {month}

                                                                                                        <Info className="h-3 w-3 text-gray-500 cursor-pointer" />
                                                                                                    </span>

                                                                                                    <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                                                                                                        {isAsap
                                                                                                            ? "Deadline: ASAP"
                                                                                                            : `Deadline: ${deadlineMap[month] || "ASAP"}`}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                {/* Closed */}
                                                                                {fallbackClosed.length > 0 && (
                                                                                    <div className="flex items-start gap-3">
                                                                                        <span className="min-w-[60px] rounded-full bg-red-100 px-2 py-1 text-center text-sm font-semibold text-red-700">
                                                                                            Closed
                                                                                        </span>

                                                                                        <div className="flex flex-wrap gap-2">
                                                                                            {fallbackClosed.map((item) => (
                                                                                                <div key={item.month} className="group relative">
                                                                                                    <span className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                                                                                                        <Calendar1 className="h-4 w-4" />
                                                                                                        {item.month}
                                                                                                        <Info className="h-3 w-3 text-gray-500" />
                                                                                                    </span>

                                                                                                    <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                                                                                                        {item.remark}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                </div>


                                                                {/* Action Buttons - Compact */}
                                                                <div className="flex items-center gap-2 mt-auto pt-4">
                                                                    <Link
                                                                        href={`/dashboard/programs/${course.slug}`}
                                                                        className="flex-1 text-center px-3 py-1.5 bg-white border border-orange-500 text-orange-500 rounded-md text-base font-medium transition-all duration-200 "
                                                                    >
                                                                        View Details
                                                                    </Link>

                                                                    <button
                                                                        // onClick={() => {
                                                                        //     // setSelectedCourse(course);
                                                                        //     setIsModalOpen(true);
                                                                        // }}
                                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#f26d44] border border-primary/40 text-white rounded-md text-base font-medium transition-all duration-200 "
                                                                    >
                                                                        Apply
                                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <style jsx>{`
                                                             @keyframes fadeInUp {
                                                               from {
                                                                 opacity: 0;
                                                                 transform: translateY(15px);
                                                               }
                                                               to {
                                                                 opacity: 1;
                                                                 transform: translateY(0);
                                                               }
                                                             }
                                                             
                                                             .fade-in-up {
                                                               opacity: 0;
                                                               animation: fadeInUp 0.4s ease forwards;
                                                             }
                                                           `}</style>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Load More */}
                                        {hasMoreCourses && (
                                            <div className="text-center py-6 md:py-8">
                                                <button
                                                    onClick={() => setCoursePage(prev => prev + 1)}
                                                    disabled={loadingCourses}
                                                    className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 w-full sm:w-auto"
                                                >
                                                    {loadingCourses ? (
                                                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                                    ) : (
                                                        'Load More'
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Full Width on Mobile, Stacks Below */}
                    <div className="w-full lg:w-[30%] space-y-3 md:space-y-4">
                        {/* Contact Information */}
                        <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                            <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">
                                Contact Information
                            </h3>
                            <div className="space-y-3">
                                {university.contactEmail && (
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground mb-1">Email</p>
                                            <a href={`mailto:${university.contactEmail}`} className="text-xs md:text-sm hover:text-primary transition-colors break-all">
                                                {university.contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {university.uni_contact && (
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs md:text-sm text-muted-foreground mb-1">Phone</p>
                                            <p className="text-xs md:text-sm">{university.uni_contact}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-2 md:gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs md:text-sm text-muted-foreground mb-1">Address</p>
                                        <p className="text-xs md:text-sm">{university.address || `${university.city}, ${university.country}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rankings */}
                        {university.uni_rank && university.uni_rank.length > 0 && (
                            <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                                <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">Rankings & Achievements</h3>
                                <div className="grid grid-cols-1 gap-2 md:gap-3">
                                    {university.uni_rank.map((rank, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-muted/30 rounded-lg">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-xs md:text-sm truncate">{rank.type}</p>
                                                <p className="text-xs text-muted-foreground">Year: {rank.year}</p>
                                            </div>
                                            <span className="text-lg md:text-xl font-bold text-primary ml-2 flex-shrink-0">#{rank.rank}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Important Dates */}
                        <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                            <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">
                                Important Dates
                            </h3>
                            <div className="space-y-2 md:space-y-3">
                                {university.intakes?.map((intake, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-muted/30 rounded-lg">
                                        <span className="text-xs md:text-sm font-medium">{intake} Intake</span>
                                        <span className="text-xs bg-primary/50 text-white px-2 py-1 rounded-full">
                                            Apply Now
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Download Brochure */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 md:p-6">
                            <h3 className="font-bold mb-2 text-sm md:text-base">University Brochure</h3>
                            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                                Download detailed information about programs, fees, and campus life.
                            </p>
                            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs md:text-sm font-medium flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Download PDF
                            </button>
                        </div>

                        {/* Social Media */}
                        {university.socialMedia && Object.keys(university.socialMedia).length > 0 && (
                            <div className="bg-card border border-border rounded-lg p-3 md:p-4">
                                <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Connect With Us</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(university.socialMedia).map(([platform, url]) => (
                                        <a
                                            key={platform}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 min-w-[80px] p-2 md:p-3 border border-border rounded-lg hover:bg-muted transition-colors text-center"
                                        >
                                            <span className="text-xs capitalize">{platform}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}