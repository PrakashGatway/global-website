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
    Search, Loader2
} from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/app/axiosInstance"
import { ModernSelect } from "@/components/ui/select"

// Types
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
    level: string // undergraduate, postgraduate, diploma, certificate
    duration: string
    durationUnit: string // years, months, semesters
    studyMode: string // full-time, part-time, online, blended
    tuitionFee: {
        amount: number
        currency: string
        period: string // per year, per semester, total
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
}

interface ExtraContent {
    sections: Array<{
        section_key: string
        heading: string
        content: string
        order: number
    }>
}

// Stats Card Component
const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
                <span className={`text-sm flex items-center gap-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {trend > 0 ? <TrendingUp className="w-4 h-4" /> : trend < 0 ? <TrendingDown className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
    </div>
)

// Tab Button Component
const TabButton = ({ active, onClick, children }: any) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 whitespace-nowrap flex-shrink-0 text-sm font-medium transition-all relative ${active
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
    >
        {children}

        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
    </button>
)


// Course Card Component
const CourseCard = ({ course, university }: { course: Course; university: University }) => {
    const getLevelColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'undergraduate':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'postgraduate':
                return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'diploma':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'certificate':
                return 'bg-orange-100 text-orange-700 border-orange-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getStudyModeIcon = (mode: string) => {
        switch (mode?.toLowerCase()) {
            case 'full-time':
                return <Clock className="w-4 h-4" />
            case 'part-time':
                return <Clock className="w-4 h-4" />
            case 'online':
                return <Globe className="w-4 h-4" />
            case 'blended':
                return <Building className="w-4 h-4" />
            default:
                return <BookOpen className="w-4 h-4" />
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {course.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
                                {course.level}
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs">
                                {getStudyModeIcon(course.studyMode)}
                                {course.studyMode}
                            </span>
                            {course.scholarshipsAvailable && (
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                                    Scholarship
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                            {course.tuitionFee.currency} {course.tuitionFee.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{course.tuitionFee.period}</p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.shortDescription || course.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Duration</span>
                        <p className="text-sm font-medium">{course.duration} {course.durationUnit}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Intakes</span>
                        <div className="flex flex-wrap gap-1">
                            {course.intakes?.slice(0, 2).map((intake, i) => (
                                <span key={i} className="text-xs bg-white px-2 py-1 rounded-full border">
                                    {intake}
                                </span>
                            ))}
                            {course.intakes?.length > 2 && (
                                <span className="text-xs bg-white px-2 py-1 rounded-full border">
                                    +{course.intakes.length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Language</span>
                        <p className="text-sm font-medium">{course.language}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Campus</span>
                        <p className="text-sm font-medium">{course.campus || university.city}</p>
                    </div>
                </div>

                {/* Requirements Preview */}
                {course.requirements && course.requirements.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium mb-2">Key Requirements:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                            {course.requirements.slice(0, 2).map((req, i) => (
                                <li key={i} className="line-clamp-1">{req}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Link
                        href={`/universities/${university.slug}/courses/${course.slug}`}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium text-center"
                    >
                        View Course Details
                    </Link>
                    <button className="ml-2 p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                        <Bookmark className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// Main University Detail Page Component
export default function UniversityDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    // State Management
    const [university, setUniversity] = useState<University | null>(null)
    const [extraContent, setExtraContent] = useState<ExtraContent | null>(null)
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingCourses, setLoadingCourses] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")
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
                // Fetch university details
                const uniResponse = await axiosInstance.get(`/universities/${slug}`)
                const uniData = uniResponse.data.result
                console.log(uniData)
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
                limit: '6',
                universityId: university._id,
                ...(courseFilters.level && { level: courseFilters.level }),
                ...(courseFilters.studyMode && { studyMode: courseFilters.studyMode }),
                ...(courseFilters.intake && { intake: courseFilters.intake }),
                ...(courseFilters.minFee && { minFee: courseFilters.minFee }),
                ...(courseFilters.maxFee && { maxFee: courseFilters.maxFee }),
                ...(courseFilters.search && { search: courseFilters.search })
            })

            const response = await axiosInstance.get(`/courses?${params}`)
            const data = response.data.result

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
        console.log(key)
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
                <div className="text-center">
                    <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">University Not Found</h2>
                    <p className="text-muted-foreground mb-6">The university you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => router.push('/universities')}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Browse Universities
                    </button>
                </div>
            </div>
        )
    }

    return (
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20 relative">
            {/* Back Navigation */}
            <div className="rounded-3xl absolute top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="px-4 py-3">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden h-[300px] bg-gradient-to-br from-primary/20 via-primary/5 to-background">
                {/* Cover Image */}
                {university ? (
                    <img
                        src={"https://www.ox.ac.uk/sites/files/oxford/styles/ow_large_feature/s3/field/field_image_main/GAF%20Radcliffe%20Square%20Dawn%20-%20Elizabeth%20Nyikos.jpg?itok=U-0F0aPx"}
                        alt={university.name}
                        className="absolute rounded-3xl inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 pattern-grid" />
                )}
                <div className="absolute rounded-3xl inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                {/* University Info Overlay */}
                <div className="absolute rounded-3xl bottom-0 left-0 right-0 p-6">
                    <div className="container mx-auto">
                        <div className="flex items-end gap-6">
                            {/* Logo */}
                            <div className="w-32 h-32 rounded-2xl bg-white p-4 shadow-2xl border border-white/50">
                                {university.uni_logo ? (
                                    <img
                                        src={university.uni_logo}
                                        alt={university.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <Building className="w-full h-full text-muted-foreground" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 uppercase !text-xs">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full font-medium border">
                                        {university.uni_type}
                                    </span>
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full font-medium border">
                                        Est. {university.established_year}
                                    </span>
                                    {university.uni_rank && university.uni_rank.length > 0 && (
                                        <span className="px-3 py-1 bg-amber-100/90 backdrop-blur-sm text-amber-700 rounded-full font-medium border border-amber-200">
                                            <Award className="w-4 h-4 inline mr-1" />
                                            {university.uni_rank[0].rank} - {university.uni_rank[0].type}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-xl md:text-3xl font-semibold mb-2">{university.name}</h1>
                                {university.slogan && (
                                    <p className="text-lg text-muted-foreground italic">"{university.slogan}"</p>
                                )}
                                <div className="flex items-center gap-4 mt-4">
                                    <span className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        {university.city}, {university.country}
                                    </span>
                                    {university.uni_web && (
                                        <a
                                            href={university.uni_web}
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
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-lg border hover:bg-white transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSaved(!saved)}
                                    className={`p-3 rounded-lg border backdrop-blur-sm transition-colors ${saved
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-white/90 hover:bg-white border'
                                        }`}
                                >
                                    <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                                </button>
                                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="border-b bg-background/80 backdrop-blur-sm sticky top-[57px] z-20">
                <div className="container mx-auto px-6 py-4">
                    <div className="grid grid-cols-5 gap-4">
                        <StatCard icon={Users} label="Total Students" value={university.totalStudents?.toLocaleString() || '1000+'} />
                        <StatCard icon={Globe} label="International" value={university.internationalStudents?.toLocaleString() || '1000+'} />
                        <StatCard icon={GraduationCap} label="Acceptance Rate" value={`${university.acceptanceRate || 'N/A'}%`} />
                        <StatCard icon={School} label="Rank" value={`#${university?.uni_rank?.[0]?.rank} (${university?.uni_rank?.[0]?.type})`} />
                        <StatCard icon={Building} label="Offers" value={university.offers + "+" || 'N/A'} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-8">
                    <div className="w-[70%]">
                        <div className="flex  border-b border-border mb-8 overflow-x-auto no-scrollbar scrollbar-hide ">
                            {university?.extra_content?.sections.map((section, index) => (
                                <TabButton key={index} active={activeTab === section.section_key} onClick={() => setActiveTab(section?.section_key)}>
                                    {section.heading}
                                </TabButton>
                            ))}
                            <TabButton active={activeTab === "courses"} onClick={() => setActiveTab("courses")}>
                                Courses ({courses.length})
                            </TabButton>
                            <TabButton active={activeTab === "fees"} onClick={() => setActiveTab("fees")}>
                                Fees & Scholarships
                            </TabButton>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-8">
                            {activeTab && getSectionContent(activeTab) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    {/* Description */}
                                    <div className="prose max-w-none">
                                        <h2 className="text-xl font-bold mb-4 capitalize">{activeTab} - {university.name}</h2>
                                        <div
                                            className="text-muted-foreground text-gray-800 leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: getSectionContent(activeTab)
                                            }}
                                        />
                                    </div>

                                    {/* Quick Facts */}
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <h3 className="text-lg font-bold mb-4">Quick Facts</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Established</p>
                                                <p className="font-medium">{university.established_year}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">University Type</p>
                                                <p className="font-medium uppercase">{university.uni_type}</p>
                                            </div>
                                         
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Campus</p>
                                                <p className="font-medium">{university.campusSize || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Intakes</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {university.intakes?.map((intake, i) => (
                                                        <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                                                            {intake}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Accommodation</p>
                                                <div className="flex gap-2">
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
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    {university.facilities && university.facilities.length > 0 && (
                                        <div className="bg-card border border-border rounded-2xl p-6">
                                            <h3 className="text-lg font-bold mb-4">Campus Facilities</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {university.facilities.map((facility, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm">{facility}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rankings */}
                                    {university.uni_rank && university.uni_rank.length > 0 && (
                                        <div className="bg-card border border-border rounded-2xl p-6">
                                            <h3 className="text-lg font-bold mb-4">Rankings & Achievements</h3>
                                            <div className="space-y-3">
                                                {university.uni_rank.map((rank, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{rank.type}</p>
                                                            <p className="text-sm text-muted-foreground">Year: {rank.year}</p>
                                                        </div>
                                                        <span className="text-xl font-bold text-primary">#{rank.rank}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Courses Tab */}
                            {activeTab === "courses" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Course Filters */}
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold">Filter Courses</h3>
                                            {(courseFilters.level || courseFilters.studyMode || courseFilters.intake) && (
                                                <button
                                                    onClick={() => setCourseFilters({
                                                        level: "",
                                                        studyMode: "",
                                                        intake: "",
                                                        minFee: "",
                                                        maxFee: "",
                                                        search: ""
                                                    })}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    Clear Filters
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <ModernSelect
                                                options={filterOptions.levels.map(level => ({ label: level, value: level }))}
                                                value={courseFilters.level}
                                                onChange={(value) => setCourseFilters(prev => ({ ...prev, level: value }))}
                                                placeholder="All Levels"
                                            />
                                            <ModernSelect
                                                options={filterOptions.studyModes.map(mode => ({ label: mode, value: mode }))}
                                                value={courseFilters.studyMode}
                                                onChange={(value) => setCourseFilters(prev => ({ ...prev, studyMode: value }))}
                                                placeholder="All Study Modes"
                                            />
                                            <ModernSelect
                                                options={filterOptions.intakes.map(intake => ({ label: intake, value: intake }))}
                                                value={courseFilters.intake}
                                                onChange={(value) => setCourseFilters(prev => ({ ...prev, intake: value }))}
                                                placeholder="All Intakes"
                                            />
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    placeholder="Search courses..."
                                                    value={courseFilters.search}
                                                    onChange={(e) => setCourseFilters(prev => ({ ...prev, search: e.target.value }))}
                                                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course List */}
                                    <div className="space-y-4">
                                        {courses.length === 0 && !loadingCourses ? (
                                            <div className="text-center py-12 bg-card border border-border rounded-xl">
                                                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-bold mb-2">No Courses Found</h3>
                                                <p className="text-muted-foreground">
                                                    No courses match your current filters.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {courses.map((course) => (
                                                    <CourseCard key={course._id} course={course} university={university} />
                                                ))}
                                            </div>
                                        )}

                                        {/* Load More */}
                                        {hasMoreCourses && (
                                            <div className="text-center py-8">
                                                <button
                                                    onClick={() => setCoursePage(prev => prev + 1)}
                                                    disabled={loadingCourses}
                                                    className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                                                >
                                                    {loadingCourses ? (
                                                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                                    ) : (
                                                        'Load More Courses'
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Fees & Scholarships Tab */}
                            {activeTab === "fees" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: getSectionContent('fees') }}
                                    />

                                    {/* Average Tuition */}
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <h3 className="text-lg font-bold mb-4">Estimated Tuition Fees</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Undergraduate</p>
                                                <p className="text-2xl font-bold text-primary">$15,000 - $35,000</p>
                                                <p className="text-xs text-muted-foreground mt-1">per year</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Postgraduate</p>
                                                <p className="text-2xl font-bold text-primary">$20,000 - $45,000</p>
                                                <p className="text-xs text-muted-foreground mt-1">per year</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scholarships */}
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-amber-100 rounded-lg">
                                                <Award className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <h3 className="text-lg font-bold">Scholarships & Financial Aid</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-muted/30 rounded-lg">
                                                <h4 className="font-semibold mb-2">Merit-based Scholarships</h4>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Awarded to outstanding students based on academic excellence.
                                                </p>
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                                    Up to 50% tuition fee waiver
                                                </span>
                                            </div>
                                            <div className="p-4 bg-muted/30 rounded-lg">
                                                <h4 className="font-semibold mb-2">Need-based Financial Aid</h4>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Available for students demonstrating financial need.
                                                </p>
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                                    Varies based on need
                                                </span>
                                            </div>
                                            <div className="p-4 bg-muted/30 rounded-lg">
                                                <h4 className="font-semibold mb-2">International Student Scholarships</h4>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Specifically designed for international students.
                                                </p>
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                                    Up to 30% tuition fee waiver
                                                </span>
                                            </div>
                                        </div>
                                        <button className="mt-6 w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                                            Apply for Scholarships
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="w-[30%] space-y-6">
                        {/* Contact Information */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                {university.contactEmail && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Email</p>
                                            <a href={`mailto:${university.contactEmail}`} className="text-sm hover:text-primary transition-colors">
                                                {university.contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {university.contactPhone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Phone</p>
                                            <p className="text-sm">{university.contactPhone}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Address</p>
                                        <p className="text-sm">{university.address || `${university.city}, ${university.country}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Dates */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Important Dates
                            </h3>
                            <div className="space-y-3">
                                {university.intakes?.map((intake, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <span className="text-sm font-medium">{intake} Intake</span>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            Apply Now
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Download Brochure */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
                            <h3 className="font-bold mb-2">University Brochure</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Download detailed information about programs, fees, and campus life.
                            </p>
                            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Download PDF
                            </button>
                        </div>

                        {/* Social Media */}
                        {university.socialMedia && Object.keys(university.socialMedia).length > 0 && (
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="font-bold mb-4">Connect With Us</h3>
                                <div className="flex gap-2">
                                    {Object.entries(university.socialMedia).map(([platform, url]) => (
                                        <a
                                            key={platform}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 p-3 border border-border rounded-lg hover:bg-muted transition-colors text-center"
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