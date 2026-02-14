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
    Building
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

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
const StatCard = ({ icon: Icon, label, value, subValue, color = "primary" }: any) => {
    const colorClasses = {
        primary: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        red: "bg-red-50 text-red-600 border-red-100",
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-gray-900">{value}</span>
                {subValue && <span className="text-xs text-gray-500">{subValue}</span>}
            </div>
        </div>
    )
}

// Tab Button Component
const TabButton = ({ active, onClick, children, icon: Icon }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 whitespace-nowrap flex-shrink-0 text-sm font-medium transition-all relative ${active
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
    >
        {/* <Icon className="w-4 h-4" /> */}
        {children}
        {active && (
            <motion.div
                layoutId="activeCourseTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
    </button>
)

// Requirement Badge Component
const RequirementBadge = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
        <span className="text-sm text-gray-600">{label}:</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
)

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
                    className="flex items-center gap-2 text-sm text-gray-600 mb-6"
                >
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/universities" className="hover:text-blue-600 transition-colors">Universities</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href={`/universities/${course.university?.slug}`} className="hover:text-blue-600 transition-colors">
                        {course.university?.name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{course.name}</span>
                </motion.div>

                {/* Hero Section - University & Course Header */}

                <div className="relative rounded-3xl overflow-hidden h-[300px] bg-gradient-to-br from-primary/20 via-primary/5 to-background">
                    {/* Cover Image */}
                    {course?.university ? (
                        <img
                            src={"https://www.ox.ac.uk/sites/files/oxford/styles/ow_large_feature/s3/field/field_image_main/GAF%20Radcliffe%20Square%20Dawn%20-%20Elizabeth%20Nyikos.jpg?itok=U-0F0aPx"}
                            alt={course?.university.name}
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
                                    {course?.university.uni_logo ? (
                                        <img
                                            src={course?.university.uni_logo}
                                            alt={course?.university.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building className="w-full h-full text-muted-foreground" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">

                                    <h1 className="text-3xl font-bold text-gray-900 py-2">
                                        {course.name}
                                    </h1>
                                    <div className="flex items-center justify-start gap-2">
                                        <Building2 className="w-5 h-5 text-gray-800 " />
                                        <h3 className="text-xl font-semibold mb-2">{course?.university.name}</h3>

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
                                        {/* <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full font-medium border">
                                            Est. {course?.university.established_year}
                                        </span> */}
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
                                            {course.level}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                                            {getStudyModeIcon(course.studyMode)}
                                            {course.studyMode}
                                        </span>
                                        {course.tags?.includes('popular') && (
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                                                <Trophy className="w-3 h-3" />
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-lg border hover:bg-white transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Quick Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                >
                    <StatCard
                        icon={DollarSign}
                        label="Tuition Fee"
                        value={formatCurrency(course.tuitionFee, course.currency)}
                        subValue="per year"
                        color="primary"
                    />
                    <StatCard
                        icon={Clock}
                        label="Duration"
                        value={course.duration}
                        subValue={course.studyMode}
                        color="green"
                    />
                    <StatCard
                        icon={GraduationCap}
                        label="Level"
                        value={course.level}
                        subValue={course.shortName || 'Degree'}
                        color="purple"
                    />
                    <StatCard
                        icon={Wallet}
                        label="Application Fee"
                        value={formatCurrency(course.applicationFee, course.currency)}
                        subValue="non-refundable"
                        color="amber"
                    />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                <div className="flex bg-background border-b border-border mb-8 overflow-x-auto no-scrollbar scrollbar-hide ">
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
                                    <TabButton
                                        active={activeTab === "requirements"}
                                        onClick={() => setActiveTab("requirements")}
                                        icon={Award}
                                    >
                                        Requirements
                                    </TabButton>
                                    <TabButton
                                        active={activeTab === "documents"}
                                        onClick={() => setActiveTab("documents")}
                                        icon={FileText}
                                    >
                                        Documents
                                    </TabButton>
                                  
                                </div>
                            </div>
                            {/* Tab Content */}
                            <div className="p-2">
                                {/* Overview Tab */}
                                {/* {activeTab === "overview" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-blue-600" />
                                                Course Description
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {course.description || "No description available."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-blue-600" />
                                                    Subject Details
                                                </h4>
                                                <p className="text-lg font-bold text-gray-900 mb-1">{course.subject?.name}</p>
                                                <p className="text-sm text-gray-600">{course.subject?.description || 'No description available'}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-purple-600" />
                                                    Category
                                                </h4>
                                                <p className="text-lg font-bold text-gray-900 mb-1">{course.category?.name}</p>
                                                <p className="text-sm text-gray-600">{course.category?.description || 'No description available'}</p>
                                            </div>
                                        </div>

                                        {course.tags && course.tags.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-gray-600" />
                                                    Course Tags
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {course.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )} */}

                                {/* Requirements Tab */}
                                {activeTab === "requirements" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-2"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            Entry Requirements
                                        </h3>
                                        {course.requirements && Object.keys(course.requirements).length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Object.entries(course.requirements).map(([key, value], index) => (
                                                    <RequirementBadge key={index} label={key} value={value} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 bg-gray-50 rounded-lg p-5 border border-gray-200">
                                                No specific requirements listed for this course.
                                            </p>
                                        )}
                                    </motion.div>
                                )}

                                {/* Documents Tab */}
                                {activeTab === "documents" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-2"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            Required Documents
                                        </h3>
                                        {course.docsRequired && course.docsRequired.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {course.docsRequired.map((doc, index) => (
                                                    <DocumentItem key={index} doc={doc} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 bg-gray-50 rounded-lg p-5 border border-gray-200">
                                                No document requirements listed for this course.
                                            </p>
                                        )}
                                    </motion.div>
                                )}

                                {/* Dynamic Extra Content Sections */}
                                {course.extra_content?.sections?.map((section) => (
                                    activeTab === section.section_key && (
                                        <motion.div
                                            key={section._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="space-y-2"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                {section.heading}
                                            </h3>
                                            <div
                                                className="text-muted-foreground text-gray-800 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                            />
                                        </motion.div>
                                    )
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Sidebar (1/3 width) */}
                    <div className="space-y-2">
                        {/* University Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl border border-gray-200 text-gray-800 p-6 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <h3 className="font-semibold text-gray-900">About the University</h3>
                            </div>

                            <div className="space-y-4">
                                {course.university?.slogan && (
                                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 italic text-gray-700 text-sm">
                                        "{course.university.slogan}"
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Location</p>
                                            <p className="text-sm">
                                                {course.university?.city}, {course.university?.country}
                                            </p>
                                            {course.university?.address && (
                                                <p className="text-sm mt-0.5">{course.university.address}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Established</p>
                                            <p className="text-sm font-medium text-gray-80 mt-1">{course.university?.established_year || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Acceptance Rate</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-900 mt-1">{course.university?.acceptanceRate || 'N/A'}%</span>
                                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                    Competitive
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {course.university?.intakes && course.university.intakes.length > 0 && (
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Intakes</p>
                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {course.university.intakes.map((intake, i) => (
                                                        <span key={i} className="text-xs bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                                                            {intake}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <Link
                                        href={`/universities/${course.university?.slug}`}
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-white text-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all text-sm font-medium flex items-center justify-center gap-2 border border-gray-200"
                                    >
                                        View University Profile
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* University Rankings Card */}
                        {course.university?.uni_rank && course.university.uni_rank.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    
                                    <h3 className="font-semibold text-gray-900">University Rankings</h3>
                                </div>
                                <div className="space-y-3">
                                    {course.university.uni_rank.map((rank, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-2">
                                                {/* <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> */}
                                                <span className="text-sm font-medium text-gray-700">{rank.type}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-gray-900">#{rank.rank}</span>
                                                <span className="text-xs text-gray-500 ml-1">{rank.year}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Accommodation Card */}
                        {(course.university?.on_campus_accommodation || course.university?.off_campus_accommodation) && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="font-semibold text-gray-900">Accommodation</h3>
                                </div>
                                <div className="space-y-3">
                                    {course.university?.on_campus_accommodation && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                            <div className="p-1 bg-white rounded-full">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">On-campus accommodation available</span>
                                        </div>
                                    )}
                                    {course.university?.off_campus_accommodation && (
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="p-1 bg-white rounded-full">
                                                <Check className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Off-campus accommodation available</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Application CTA Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                            className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 text-white shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold">Ready to Apply?</h3>
                            </div>
                            <p className="text-sm text-blue-100 mb-5 leading-relaxed">
                                Start your application process today and take the first step towards your future at {course.university?.name}.
                            </p>
                            <button className="w-full px-4 py-3 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2 shadow-lg">
                                Apply Now
                                <ExternalLink className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-blue-200 mt-4 text-center flex items-center justify-center gap-1">
                                <Wallet className="w-3 h-3" />
                                Application fee: {formatCurrency(course.applicationFee, course.currency)}
                            </p>
                        </motion.div>

                        {/* Social Media Links */}
                        {/* {course.university?.social_links && Object.values(course.university.social_links).some(Boolean) && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Globe className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Connect With Us</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(course.university.social_links).map(([platform, url]) => (
                                        <SocialIcon key={platform} platform={platform} url={url} />
                                    ))}
                                </div>
                            </motion.div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    )
}