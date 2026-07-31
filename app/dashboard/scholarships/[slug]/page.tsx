"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    GraduationCap,
    MapPin,
    Calendar,
    Award,
    DollarSign,
    Clock,
    BookOpen,
    Users,
    Globe,
    Mail,
    Phone,
    ExternalLink,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertCircle,
    Share2,
    Bookmark,
    Download,
    Building2,
    IndianRupeeIcon,
    TrendingUp,
    TrendingDown,
    MinusCircle,
    FileText,
    Check,
    X,
    Sparkles,
    Heart,
    Shield,
    Trophy,
    Wallet,
    Languages,
    Home,
    ArrowLeft,
    Tag,
    Layers,
    Briefcase,
    Star,
    CircleDot,
    Building2Icon,
    ChevronDown
} from "lucide-react";

import axiosInstance from "@/app/axiosInstance";
import { CreateApplicationModal } from "@/components/dashboard/applicationModel";
import Loading from "../../notifications/loading";
import { Reveal } from "@/components/scholarshipPage";
import InnerContent from "@/components/dom/DomParser";
import { DynamicLucideIcon } from "@/components/DynamicLucideIcon";

interface Scholarship {
    _id: string;
    title: string;
    description: string;
    slug: string;
    subjects: Array<{
        _id: string;
        name: string;
        slug: string;
    }>;
    level: string[];
    fundingType: string;
    studyMode: string;
    deliveryMode: string;
    amount: string;
    valueDetails: Record<string, any>;
    eligibilityCriteria: Record<string, any>;
    benefits: Record<string, any>;
    exclusionCriteria: Record<string, any>;
    selectionBasis: string;
    deadline: string;
    intake: string;
    howToApply: Record<string, any>;
    metaData: Record<string, any>;
    country: {
        _id: string;
        name: string;
        flag?: string;
        code?: string;
    };
    university: {
        _id: string;
        name: string;
        logo?: string;
        cover_photo?: string;
        address?: string;
        website?: string;
        email?: string;
        phone?: string;
        slogan?: string;
        established_year?: number;
        acceptanceRate?: number;
        uni_rank?: Array<{ type: string; rank: string; year: string }>;
        intakes?: string[];
        on_campus_accommodation?: boolean;
        off_campus_accommodation?: boolean;
    };
}

// Stats Card Component
const StatCard = ({ icon: Icon, label, value, subValue, trend, color = "primary" }: any) => (
    <div className="bg-[#f3f4f6] rounded-2xl hover:bg-[#e5e7eb] hover:outline hover:outline-2 hover:outline-[#F26D44] p-4 pl-1 transition-all">
        <div className="flex items-center gap-1 mb-2">
            <div className="p-2">
                <Icon className="w-11 h-11 text-black" strokeWidth={1.1} />
            </div>
            <span className="flex flex-col gap-1 text-sm text-gray-800">
                {label}
                <span className="font-bold line-wrapping w-full text-xl">{value}</span>
                {subValue && <span className="text-xs text-gray-500">{subValue}</span>}
                {trend && (
                    <span className={`text-sm flex items-center gap-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                        {trend > 0 ? <TrendingUp className="w-4 h-4" /> : trend < 0 ? <TrendingDown className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </span>
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
);

// Benefit Item Component
const BenefitItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
        <div className="p-1.5 bg-green-100 rounded-lg">
            <Icon className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{value}</p>
        </div>
    </div>
);

// Requirement Item Component
const RequirementItem = ({ label, value, isExclusion = false }: any) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
        <div className={`p-1.5 ${isExclusion ? 'bg-red-100' : 'bg-blue-100'} rounded-lg`}>
            {isExclusion ? (
                <XCircle className="w-4 h-4 text-red-600" />
            ) : (
                <CheckCircle className="w-4 h-4 text-blue-600" />
            )}
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="text-xs text-gray-500 mt-0.5">{String(value)}</p>
        </div>
    </div>
);

// Document Item Component
const DocumentItem = ({ doc }: { doc: { [key: string]: string } }) => {
    const [key, value] = Object.entries(doc)[0];
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
    );
};

export default function ScholarshipDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [scholarship, setScholarship] = useState<Scholarship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [similarScholarships, setSimilarScholarships] = useState<Scholarship[]>([]);

    useEffect(() => {
        if (slug) {
            fetchScholarshipDetails();
        }
    }, [slug]);

    const fetchScholarshipDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/scholarships/slug/${slug}`);
            const data = response.data;

            if (data.success) {
                setScholarship(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to load scholarship details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const formatCurrency = (amount: string) => {
        if (!amount) return 'Varies';
        return amount;
    };

    const getLevelColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'undergraduate':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'postgraduate':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'phd':
            case 'doctorate':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'diploma':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'certificate':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStudyModeIcon = (mode: string) => {
        switch (mode?.toLowerCase()) {
            case 'full-time':
                return <Clock className="w-4 h-4" />;
            case 'part-time':
                return <Briefcase className="w-4 h-4" />;
            case 'online':
                return <Globe className="w-4 h-4" />;
            default:
                return <BookOpen className="w-4 h-4" />;
        }
    };

    const isDeadlineApproaching = () => {
        if (!scholarship?.deadline) return false;
        const deadlineDate = new Date(scholarship.deadline);
        const today = new Date();
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
    };

    const isDeadlinePassed = () => {
        if (!scholarship?.deadline) return false;
        return new Date(scholarship.deadline) < new Date();
    };

    if(loading) {
        return <Loading />;
    }

  

    if (error || !scholarship) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                        <X className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Scholarship Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        {error || "The scholarship you're looking for doesn't exist or has been removed."}
                    </p>
                    <Link
                        href="/scholarships"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#F26D44] text-white rounded-xl hover:bg-[#F26D44]/90 transition-colors shadow-lg shadow-[#F26D44]/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse All Scholarships
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "eligibility", label: "Eligibility" },
        { id: "benefits", label: "Benefits & Value" },
        { id: "how-to-apply", label: "How to Apply" },
        { id: "university", label: "University Info" },
    ];

    return (
        <div className="min-h-screen">
            <div className="container mx-auto sm:px-4 py-4">
                {/* Breadcrumb Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-gray-600 mb-4"
                >
                    <Link href="/dashboard" className="hover:text-[#F26D44] transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/scholarships" className="hover:text-[#F26D44] transition-colors">Scholarships</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{scholarship.title}</span>
                </motion.div>

                {/* Hero Section - University & Scholarship Header */}
                <div className="relative overflow-hidden h-[300px] mb-4">
                    {/* Cover Image */}
                    <img
                        src={scholarship.university?.cover_photo || "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1786&q=80"}
                        alt={scholarship.university?.name || "University"}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* University & Scholarship Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="container mx-auto">
                            <div className="flex items-end gap-6">
                                {/* Logo */}
                                <div className="w-24 h-24 rounded-3xl bg-white p-2 shadow-2xl border border-white/50">
                                    {scholarship.university?.uni_logo ? (
                                        <img
                                            src={scholarship.university.uni_logo}
                                            alt={scholarship.university.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 className="w-full h-full text-gray-400" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h1 className="text-xl font-bold text-gray-100 py-2">
                                        {scholarship.title}
                                    </h1>
                                    <div className="flex items-center justify-start gap-2">
                                        <Building2 className="w-5 h-5 text-gray-100" />
                                        <h3 className="text-base text-gray-100 font-semibold mb-1">{scholarship.university?.name}</h3>
                                    </div>

                                    {/* <div className="flex items-center gap-4 my-2 flex-wrap">
                                        <span className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            {scholarship.country?.name}
                                        </span>
                                        {scholarship.university?.website && (
                                            <a
                                                href={scholarship.university.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm hover:text-[#F26D44] transition-colors"
                                            >
                                                <Globe className="w-4 h-4" />
                                                University Website
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                        {scholarship.deadline && (
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                                                ${isDeadlinePassed() ? 'bg-red-100 text-red-700 border-red-200' :
                                                    isDeadlineApproaching() ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                        'bg-green-100 text-green-700 border-green-200'}`}>
                                                <Calendar className="w-3 h-3" />
                                                Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                                {isDeadlineApproaching() && !isDeadlinePassed() && ' (Approaching)'}
                                                {isDeadlinePassed() && ' (Closed)'}
                                            </span>
                                        )}
                                    </div> */}

                                    <div className="flex items-center gap-3 flex-wrap mt-2">
                                        {scholarship.level?.map((lvl, index) => (
                                            <span key={index} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getLevelColor(lvl)}`}>
                                                {lvl}
                                            </span>
                                        ))}
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                                            {getStudyModeIcon(scholarship.studyMode)}
                                            {scholarship.studyMode || "Full-time"}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                                            <Tag className="w-3 h-3" />
                                            {scholarship.fundingType || "Merit-based"}
                                        </span>
                                        {scholarship.subjects?.length > 0 && (
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                                                <BookOpen className="w-3 h-3" />
                                                {scholarship.subjects[0]?.name}
                                                {scholarship.subjects.length > 1 && ` +${scholarship.subjects.length - 1}`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                        className="p-3 bg-white/90 backdrop-blur-sm rounded-lg border hover:bg-white transition-colors"
                                    >
                                        <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-6 py-2.5 bg-[#F26D44] text-white rounded-lg hover:bg-[#F26D44]/90 transition-colors font-medium"
                                        disabled={isDeadlinePassed()}
                                    >
                                        {isDeadlinePassed() ? 'Applications Closed' : 'Apply Now'}
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
                >
                    <StatCard
                        icon={IndianRupeeIcon}
                        label="Award Amount"
                        value={formatCurrency(scholarship.amount)}
                        subValue="total value"
                    />
                    <StatCard
                        icon={Award}
                        label="Selection Basis"
                        value={scholarship.selectionBasis || "Merit-based"}
                        subValue="criteria"
                    />
                    <StatCard
                        icon={Clock}
                        label="Duration"
                        value={scholarship.deliveryMode || "On-campus"}
                        subValue={scholarship.studyMode || "Full-time"}
                    />
                    <StatCard
                        icon={Calendar}
                        label="Intake"
                        value={scholarship.intake || "Multiple"}
                        subValue="available"
                    />
                    <StatCard
                        icon={Users}
                        label="Acceptance Rate"
                        value={scholarship.university?.acceptanceRate ? `${scholarship.university.acceptanceRate}%` : 'Competitive'}
                        subValue="university-wide"
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
                        >
                          

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
                                                             const isOpen = false
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
                        </motion.div>

                        {/* Bottom CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="relative overflow-hidden rounded-2xl mt-8 bg-gradient-to-r from-[#F26D44]/10 via-pink-200 to-indigo-100 text-gray-800"
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

                                    <p className="text-lg leading-relaxed">
                                        Take the next step toward funding your education at{" "}
                                        <span className="font-semibold">
                                            {scholarship.university?.name}
                                        </span>.
                                        Begin your scholarship application today.
                                    </p>

                                    <p className="text-sm mt-4">
                                        Award Amount:{" "}
                                        <span className="font-semibold">
                                            {formatCurrency(scholarship.amount)}
                                        </span>
                                    </p>
                                </div>

                                {/* Right Action */}
                                {/* <div className="relative z-50 w-full md:w-auto">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full md:w-auto px-8 py-2.5 cursor-pointer bg-white text-gray-700 rounded-xl hover:bg-indigo-100 transition-all font-semibold flex items-center justify-center gap-2"
                                        disabled={isDeadlinePassed()}
                                    >
                                        Apply Now
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div> */}
                            </div>

                            {/* Decorative Blur Circle */}
                            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                        </motion.div>
                    </div>

                    {/* Right Column - Sidebar (1/3 width) */}
                    <div className="space-y-6 p-2 top-0 sticky h-fit">
                        {/* Key Information Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className=" border-1 bg-white text-gray-800 p-6 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <h3 className="font-semibold text-gray-900">Key Information</h3>
                            </div>

                            <div className="space-y-4 grid grid-cols-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Award Amount</p>
                                        <p className="text-xl font-bold text-[#F26D44] mt-1">{formatCurrency(scholarship.amount)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Award className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Selection Basis</p>
                                        <p className="font-medium text-gray-900 mt-1">{scholarship.selectionBasis || "Merit-based"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Deadline</p>
                                        <p className={`font-medium mt-1 ${isDeadlinePassed() ? 'text-red-600' : isDeadlineApproaching() ? 'text-amber-600' : 'text-green-600'}`}>
                                            {scholarship.deadline
                                                ? new Date(scholarship.deadline).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : "Rolling"
                                            }
                                        </p>
                                        {isDeadlineApproaching() && !isDeadlinePassed() && (
                                            <span className="text-xs text-amber-600 mt-1 block">Approaching soon</span>
                                        )}
                                        {isDeadlinePassed() && (
                                            <span className="text-xs text-red-600 mt-1 block">Applications closed</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Study Mode</p>
                                        <p className="font-medium text-gray-900 mt-1">{scholarship.studyMode || "Full-time"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <BookOpen className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Delivery Mode</p>
                                        <p className="font-medium text-gray-900 mt-1">{scholarship.deliveryMode || "On-campus"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Users className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Intake</p>
                                        <p className="font-medium text-gray-900 mt-1">{scholarship.intake || "Multiple"}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* University Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white border-1 p-6 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="font-semibold text-gray-900">About the University</h3>
                            </div>

                            <div className="space-y-4">
                                {scholarship.university?.slogan && (
                                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 italic text-gray-700 text-sm">
                                        "{scholarship.university.slogan}"
                                    </div>
                                )}

                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Location</p>
                                        <p className="text-sm text-gray-900">{scholarship.country?.name}</p>
                                        {scholarship.university?.address && (
                                            <p className="text-xs text-gray-500 mt-1">{scholarship.university.address}</p>
                                        )}
                                    </div>
                                </div>

                                {scholarship.university?.established_year && (
                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Established</p>
                                            <p className="text-sm text-gray-900">{scholarship.university.established_year}</p>
                                        </div>
                                    </div>
                                )}

                                {scholarship.university?.acceptanceRate && (
                                    <div className="flex items-start gap-2">
                                        <Users className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Acceptance Rate</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-900">{scholarship.university.acceptanceRate}%</span>
                                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                    Competitive
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-200">
                                    <Link
                                        href={`/universities/${scholarship.university?._id}`}
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-white text-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all text-sm font-medium flex items-center justify-center gap-2 border border-gray-200"
                                    >
                                        View University Profile
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Similar Scholarships */}
                        {similarScholarships.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white border border-gray-200 p-6 transition-all"
                            >
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    Similar Scholarships
                                </h3>
                                <div className="space-y-3">
                                    {similarScholarships.map((scholar) => (
                                        <Link
                                            key={scholar._id}
                                            href={`/scholarships/${scholar.slug}`}
                                            className="block p-3 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
                                        >
                                            <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">{scholar.title}</h4>
                                            <p className="text-xs text-gray-600 mb-1">{scholar.university?.name}</p>
                                            <p className="text-xs font-semibold text-[#F26D44]">{formatCurrency(scholar.amount)}</p>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            <CreateApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApplicationCreated={() => {
                    // Handle successful application creation
                }}
                scholarship={scholarship}
            />
        </div>
    );
}