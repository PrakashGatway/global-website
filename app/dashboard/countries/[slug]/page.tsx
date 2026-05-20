"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    MapPin, Globe, Users, Star, Calendar,
    ChevronLeft, ExternalLink, BookOpen, GraduationCap,
    DollarSign, Award, Check, X, Clock, Mail,
    Phone, Share2, Bookmark, Download, School,
    TrendingUp, TrendingDown, MinusCircle,
    Search, Loader2, ChevronRight, Flag, Landmark,
    University, Briefcase, Heart, Shield, Compass,
    FileText, Building2, CreditCard,
    FileCheck, CalendarDays, Clock as ClockIcon,
    AlertCircle, CheckCircle, Plane, Home, Bed,
    Utensils, Wifi, Bus, Coffee
} from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/app/axiosInstance"

// Interfaces - FIXED: extra_content is an object, not an array
interface VisaDetails {
    type: {
        source_country_iso: string
        destination_country_iso: string
        visa_type: string
        title: string
        description: string
        last_updated: string
        entry_classification: {
            type: string
            is_interview_mandatory: boolean
            visa_category: string
        }
        validity_rules: {
            passport_validity_months_required: number
            blank_pages_required: number
            visa_validity_days: number
            max_stay_duration_days: number
            multiple_entry_allowed: boolean
        }
        fees: Array<{
            name: string
            amount: number
            currency: string
        }>
        required_documents: {
            mandatory: string[]
            supporting: string[]
            financial_proof: {
                bank_statement_months: number
                min_liquid_balance: number
            }
        }
        process_steps: Array<{
            step: number
            title: string
            description: string
        }>
        medical_insurance_required: boolean
        aps_certificate_required: boolean
        average_processing_time_days: number
        other: {
            language_requirement: string
            part_time_work_allowed: boolean
            post_study_work_option: string
        }
        status: string
    }
}

interface FAQ {
    question: string
    answer: string
    _id: string
}

interface Section {
    section_key: string
    heading: string
    content: string
    order: number
    _id: string
}

interface ExtraContent {
    _id: string
    sections: Section[]
    faq: FAQ[]
    visa_details: VisaDetails
    status: string
    rating?: string
    tuitionfee?: string
    psw?: string
    keyHightlights?: string[]
    createdAt: string
    updatedAt: string
}

interface Country {
    _id: string
    name: string
    code: string
    currency: string
    status: string
    universities: number
    isFeatured: string
    students: number
    image: string
    flg: string
    extra_content: ExtraContent  // FIXED: object, not array
    createdAt: string
    updatedAt: string
}

interface University {
    _id: string
    name: string
    slug: string
    city: string
    country: string
    uni_logo: string
    uni_type: string
    established_year: number
    totalStudents: number
    acceptanceRate: number
    uni_rank: Array<{ type: string; rank: string; year: string }>
}

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <div className="bg-white rounded-2xl hover:shadow-lg hover:outline hover:outline-2 hover:outline-[#F26D44] p-5 transition-all duration-200 border border-gray-100">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#F26D44]/10 to-[#F26D44]/5 rounded-xl">
                <Icon className="w-6 h-6 text-[#F26D44]" strokeWidth={1.5} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {trend && (
                    <span className={`text-xs flex items-center gap-1 mt-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                        {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <MinusCircle className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    </div>
)

const TabButton = ({ active, onClick, children }: any) => (
    <button
        onClick={onClick}
        className={`px-5 py-3 whitespace-nowrap flex-shrink-0 text-base font-medium transition-all relative rounded-t-xl ${
            active 
                ? 'text-[#F26D44] bg-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F26D44] rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
    </button>
)

// University Card Component
const UniversityCard = ({ university }: { university: University }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100"
        >
            <div className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 p-2 border flex items-center justify-center flex-shrink-0">
                        {university.uni_logo ? (
                            <img
                                src={university.uni_logo}
                                alt={university.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#F26D44] transition-colors line-clamp-2 text-sm">
                            {university.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {university.city}, {university.country}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="flex items-center gap-1 text-gray-600">
                        <School className="w-3.5 h-3.5" />
                        <span>{university.uni_type || 'University'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Est. {university.established_year}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-3.5 h-3.5" />
                        <span>{university.totalStudents?.toLocaleString() || 'N/A'} students</span>
                    </div>
                    {university.acceptanceRate && (
                        <div className="flex items-center gap-1 text-gray-600">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>{university.acceptanceRate}% acceptance</span>
                        </div>
                    )}
                </div>

                <Link
                    href={`/dashboard/universities/${university.slug}`}
                    className="block w-full text-center text-sm py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-[#F26D44] hover:text-white transition-all duration-200 font-medium mt-2"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    )
}

// Other Country Card Component for Sidebar
const OtherCountryCard = ({ country, isActive }: { country: Country, isActive: boolean }) => {
    const router = useRouter()
    return (
        <motion.div
            whileHover={{ x: 4 }}
            onClick={() => router.push(`/dashboard/countries/${country.code}`)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                isActive 
                    ? 'bg-[#F26D44]/10 border border-[#F26D44]/20' 
                    : 'hover:bg-gray-50 border border-transparent'
            }`}
        >
            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                {country.flg ? (
                    <img src={country.flg} alt={country.name} className="w-6 h-6 object-contain" />
                ) : (
                    <Flag className="w-5 h-5 text-gray-400" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{country.name}</p>
                <p className="text-xs text-gray-500">{country.code} • {country.currency || 'N/A'}</p>
            </div>
            {country.isFeatured === "Yes" && (
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
            )}
        </motion.div>
    )
}

// Visa Requirements Component
const VisaRequirements = ({ visaDetails }: { visaDetails: VisaDetails }) => {
    const visa = visaDetails?.type
    if (!visa) return null

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{visa.title}</h2>
                </div>
                <p className="text-gray-600">{visa.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        Updated: {new Date(visa.last_updated).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        visa.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                        {visa.status}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#F26D44]" />
                    Entry Requirements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Visa Type</p>
                        <p className="font-medium text-gray-900">{visa.entry_classification.visa_category}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Interview Required</p>
                        <p className={`font-medium ${visa.entry_classification.is_interview_mandatory ? 'text-red-600' : 'text-green-600'}`}>
                            {visa.entry_classification.is_interview_mandatory ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#F26D44]" />
                    Validity & Stay Rules
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Passport Validity Required</p>
                        <p className="font-medium">{visa.validity_rules.passport_validity_months_required} months</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Blank Pages Required</p>
                        <p className="font-medium">{visa.validity_rules.blank_pages_required}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Visa Validity</p>
                        <p className="font-medium">{visa.validity_rules.visa_validity_days} days</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Max Stay Duration</p>
                        <p className="font-medium">{visa.validity_rules.max_stay_duration_days} days</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500">Multiple Entry Allowed</p>
                        <p className={`font-medium ${visa.validity_rules.multiple_entry_allowed ? 'text-green-600' : 'text-red-600'}`}>
                            {visa.validity_rules.multiple_entry_allowed ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#F26D44]" />
                    Visa Fees
                </h3>
                <div className="space-y-2">
                    {visa.fees.map((fee, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-600">{fee.name}</span>
                            <span className="font-semibold text-gray-900">{fee.amount} {fee.currency}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#F26D44]" />
                    Required Documents
                </h3>
                
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Mandatory Documents</p>
                    <div className="flex flex-wrap gap-2">
                        {(visa.required_documents?.mandatory || []).map((doc, index) => (
                            <span key={index} className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs">
                                {doc}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Supporting Documents</p>
                    <div className="flex flex-wrap gap-2">
                        {(visa.required_documents?.supporting || []).map((doc, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                                {doc}
                            </span>
                        ))}
                    </div>
                </div>

                {visa.required_documents.financial_proof && (
                    <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-amber-800 mb-1">Financial Proof Required</p>
                        <p className="text-sm text-amber-700">
                            Minimum {visa.required_documents.financial_proof.min_liquid_balance} {visa.fees[0]?.currency || 'USD'} 
                            for last {visa.required_documents.financial_proof.bank_statement_months} months
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#F26D44]" />
                    Application Process
                </h3>
                <div className="space-y-3">
                    {visa.process_steps.map((step) => (
                        <div key={step.step} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#F26D44]/10 text-[#F26D44] flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                {step.step}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{step.title}</p>
                                <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-gray-500">Processing Time</p>
                        <p className="font-medium">{visa.average_processing_time_days} days</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Medical Insurance Required</p>
                        <p className={`font-medium ${visa.medical_insurance_required ? 'text-green-600' : 'text-gray-600'}`}>
                            {visa.medical_insurance_required ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Part-time Work Allowed</p>
                        <p className={`font-medium ${visa.other?.part_time_work_allowed ? 'text-green-600' : 'text-gray-600'}`}>
                            {visa.other?.part_time_work_allowed ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Post-Study Work Option</p>
                        <p className="font-medium">{visa.other?.post_study_work_option || 'N/A'}</p>
                    </div>
                    {visa.other?.language_requirement && (
                        <div className="col-span-2">
                            <p className="text-gray-500">Language Requirement</p>
                            <p className="font-medium">{visa.other.language_requirement}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Main Country Detail Page Component
export default function CountryDetailPage() {
    const params = useParams()
    const router = useRouter()
    const countryCode = params.slug as string

    const [country, setCountry] = useState<Country | null>(null)
    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingUniversities, setLoadingUniversities] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")
    const [saved, setSaved] = useState(false)
    const [otherCountries, setOtherCountries] = useState<Country[]>([])
    const [loadingOtherCountries, setLoadingOtherCountries] = useState(false)

    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        } else if (country?.extra_content?.sections?.[0]?.section_key) {
            // FIXED: extra_content is object, not array
            setActiveTab(country.extra_content.sections[0].section_key);
        }
    }, [searchParams, country]);

    // Fetch current country details
    useEffect(() => {
        const fetchCountryDetails = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get(`/countries?code=${countryCode}&populateExtra=true`)
                const countryData = response.data.data?.[0]
                console.log("Country Data:", countryData) // Debug log
                setCountry(countryData)
                
                // FIXED: extra_content is object, access directly
                if (countryData?.extra_content?.sections?.[0]?.section_key) {
                    setActiveTab(countryData.extra_content.sections[0].section_key)
                }
            } catch (error) {
                console.error('Error fetching country details:', error)
            } finally {
                setLoading(false)
            }
        }

        if (countryCode) {
            fetchCountryDetails()
        }
    }, [countryCode])

    // Fetch related universities
    useEffect(() => {
        const fetchUniversities = async () => {
            if (!country) return
            try {
                setLoadingUniversities(true)
                const response = await axiosInstance.get(`/universities?country=${country.code}&limit=6`)
                setUniversities(response.data.result || response.data.data || [])
            } catch (error) {
                console.error('Error fetching universities:', error)
            } finally {
                setLoadingUniversities(false)
            }
        }
        fetchUniversities()
    }, [country])

    // Fetch other countries for sidebar
    useEffect(() => {
        const fetchOtherCountries = async () => {
            try {
                setLoadingOtherCountries(true)
                const response = await axiosInstance.get(`/countries?limit=10&sort=-isFeatured`)
                const countries = response.data.data || []
                // Filter out current country
                const filtered = countries.filter((c: Country) => c.code !== countryCode)
                setOtherCountries(filtered.slice(0, 5))
            } catch (error) {
                console.error('Error fetching other countries:', error)
            } finally {
                setLoadingOtherCountries(false)
            }
        }
        fetchOtherCountries()
    }, [countryCode])

    // FIXED: Access sections directly from extra_content object
    const getSectionContent = (key: string) => {
        return country?.extra_content?.sections?.find(
            section => section.section_key === key
        )?.content || ''
    }

    const getFAQ = () => {
        return country?.extra_content?.faq || []
    }

    const getVisaDetails = () => {
        return country?.extra_content?.visa_details
    }

    const sections = country?.extra_content?.sections || []
    const hasFAQ = getFAQ().length > 0
    const hasVisa = !!getVisaDetails()?.type
    const hasUniversities = universities.length > 0

    // Debug log to check sections
    console.log("Sections:", sections)
    console.log("Country extra_content:", country?.extra_content)

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#F26D44] mx-auto mb-4" />
                    <p className="text-gray-600">Loading country details...</p>
                </div>
            </div>
        )
    }

    if (!country) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Country Not Found</h2>
                    <p className="text-gray-600 mb-6">The country you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => router.push('/dashboard/countries')}
                        className="px-6 py-3 bg-[#F26D44] text-white rounded-lg hover:bg-[#F26D44]/90 transition-colors"
                    >
                        Browse All Countries
                    </button>
                </div>
            </div>
        )
    }

    return (
        <main className="flex-1 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Back Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-gray-600 mb-6"
                >
                    <Link href="/dashboard" className="hover:text-[#F26D44] transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/dashboard/countries" className="hover:text-[#F26D44] transition-colors">Countries</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium">{country.name}</span>
                </motion.div>

                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden mb-8 min-h-[320px]">
                    {country.image ? (
                        <>
                            <img
                                src={country.image}
                                alt={country.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F26D44]/30 to-[#F26D44]/10" />
                    )}
                    
                    <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center w-full gap-6 mt-30 justify-between">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-28 h-28 rounded-2xl bg-white shadow-xl overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                                {country.flg ? (
                                    <img
                                        src={country.flg}
                                        alt={`Flag of ${country.name}`}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <Flag className="w-16 h-16 text-gray-400" />
                                )}
                            </div>

                            <div className="flex-1 text-white">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                        Code: {country.code}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                        Status: {country.status}
                                    </span>
                                    {country.isFeatured === "Yes" && (
                                        <span className="px-3 py-1 bg-amber-500/90 text-white rounded-full text-sm font-medium flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-current" />
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold mb-3">{country.name}</h1>
                                {country.currency && (
                                    <p className="text-lg text-white/90 flex items-center gap-2">
                                        Currency: {country.currency}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSaved(!saved)}
                                className={`p-3 rounded-xl backdrop-blur-sm transition-all duration-200 ${
                                    saved
                                        ? 'bg-[#F26D44] text-white'
                                        : 'bg-white/20 hover:bg-white/30 text-white'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                                onClick={() => router.push(`/dashboard/universities?country=${country.code}`)}
                                className="px-6 py-3 bg-[#F26D44] hover:bg-[#F26D44]/90 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                            >
                                Explore Universities
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Main Content */}
                    <div className="flex-1">
                        {/* Tabs - Only show if there are sections */}
                        {(sections.length > 0 || hasVisa || hasFAQ || hasUniversities) && (
                            <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-x-auto">
                                <div className="flex border-b border-gray-200 px-4">
                                    {sections.map((section, index) => (
                                        <TabButton 
                                            key={section._id || index} 
                                            active={activeTab === section.section_key} 
                                            onClick={() => setActiveTab(section.section_key)}
                                        >
                                            {section.heading}
                                        </TabButton>
                                    ))}
                                    {hasVisa && (
                                        <TabButton 
                                            active={activeTab === "visa"} 
                                            onClick={() => setActiveTab("visa")}
                                        >
                                            Visa Requirements
                                        </TabButton>
                                    )}
                                    {hasFAQ && (
                                        <TabButton 
                                            active={activeTab === "faq"} 
                                            onClick={() => setActiveTab("faq")}
                                        >
                                            FAQ ({getFAQ().length})
                                        </TabButton>
                                    )}
                                    {hasUniversities && (
                                        <TabButton 
                                            active={activeTab === "universities"} 
                                            onClick={() => setActiveTab("universities")}
                                        >
                                            Universities ({universities.length})
                                        </TabButton>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                            <AnimatePresence mode="wait">
                                {/* Sections Content */}
                                {activeTab !== "visa" && activeTab !== "faq" && activeTab !== "universities" && (
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="prose max-w-none"
                                    >
                                        <div 
                                            className="text-gray-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: getSectionContent(activeTab)
                                            }}
                                        />
                                    </motion.div>
                                )}

                                {/* Visa Content */}
                                {activeTab === "visa" && hasVisa && (
                                    <motion.div
                                        key="visa"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <VisaRequirements visaDetails={getVisaDetails()!} />
                                    </motion.div>
                                )}

                                {/* FAQ Content */}
                                {activeTab === "faq" && hasFAQ && (
                                    <motion.div
                                        key="faq"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                                        {getFAQ().map((faq, index) => (
                                            <div key={faq._id || index} className="border-b border-gray-200 pb-4 last:border-0">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-start gap-2">
                                                    <span className="text-[#F26D44] text-xl">Q.</span>
                                                    {faq.question}
                                                </h3>
                                                <p className="text-gray-600 flex items-start gap-2 ml-6">
                                                    <span className="text-green-600 text-xl">A.</span>
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Universities Content */}
                                {activeTab === "universities" && (
                                    <motion.div
                                        key="universities"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900">Universities in {country.name}</h2>
                                            <Link 
                                                href={`/dashboard/universities?country=${country.code}`}
                                                className="text-[#F26D44] hover:underline text-sm font-medium"
                                            >
                                                View All →
                                            </Link>
                                        </div>
                                        
                                        {loadingUniversities ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="w-8 h-8 animate-spin text-[#F26D44]" />
                                            </div>
                                        ) : universities.length === 0 ? (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                                <University className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-500">No universities found for this country.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {universities.map((uni) => (
                                                    <UniversityCard key={uni._id} university={uni} />
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:w-80 space-y-6">
                        {/* Quick Facts Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                <Compass className="w-5 h-5 text-[#F26D44]" />
                                Quick Facts
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Country Code</span>
                                    <span className="font-medium text-gray-900">{country.code}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Currency</span>
                                    <span className="font-medium text-gray-900">{country.currency || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Total Universities</span>
                                    <span className="font-medium text-gray-900">{country.universities || universities.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Total Students</span>
                                    <span className="font-medium text-gray-900">{country.students?.toLocaleString() || 'N/A'}</span>
                                </div>
                                {/* <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        country.status === 'Active' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {country.status}
                                    </span>
                                </div> */}
                            </div>
                        </div>

                        {/* Key Highlights Card - Shows data from extra_content */}
                        {/* {country.extra_content?.keyHightlights && country.extra_content.keyHightlights.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-[#F26D44]" />
                                    Key Highlights
                                </h3>
                                <div className="space-y-2">
                                    {country.extra_content.keyHightlights.map((highlight, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}

                        {/* Tuition & PSW Info Card */}
                        {(country.extra_content?.tuitionfee || country.extra_content?.psw) && (
                            <div className="bg-gradient-to-br from-[#F26D44]/10 to-[#F26D44]/5 rounded-2xl p-6 border border-[#F26D44]/20">
                                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-[#F26D44]" />
                                    Fee & Work Info
                                </h3>
                                {country.extra_content?.tuitionfee && (
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 mb-1">Tuition Fee (approx.)</p>
                                        <p className="font-semibold text-gray-900">{country.extra_content.tuitionfee}</p>
                                    </div>
                                )}
                                {country.extra_content?.psw && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Post-Study Work Visa</p>
                                        <p className="font-semibold text-gray-900">{country.extra_content.psw}</p>
                                    </div>
                                )}
                                {country.extra_content?.rating && (
                                    <div className="mt-3 pt-3 border-t border-[#F26D44]/20 flex items-center gap-2">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="font-medium text-gray-900">{country.extra_content.rating}</span>
                                        <span className="text-xs text-gray-500">/ 5 rating</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Other Countries Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-[#F26D44]" />
                                    Other Countries
                                </h3>
                                <Link 
                                    href="/dashboard/countries"
                                    className="text-xs text-[#F26D44] hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            
                            {loadingOtherCountries ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#F26D44]" />
                                </div>
                            ) : otherCountries.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-6">No other countries available.</p>
                            ) : (
                                <div className="space-y-2">
                                    {otherCountries.map((otherCountry) => (
                                        <OtherCountryCard 
                                            key={otherCountry._id} 
                                            country={otherCountry} 
                                            isActive={otherCountry.code === country.code}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Why Study Here Card */}
                        <div className="bg-gradient-to-br from-[#F26D44]/10 to-[#F26D44]/5 rounded-2xl p-6 border border-[#F26D44]/20">
                            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#F26D44]" />
                                Why Study in {country.name}?
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Explore world-class education opportunities, diverse culture, and excellent career prospects in {country.name}.
                            </p>
                            <button 
                                onClick={() => router.push(`/dashboard/universities?country=${country.code}`)}
                                className="w-full px-4 py-2.5 bg-[#F26D44] text-white rounded-xl hover:bg-[#F26D44]/90 transition-colors text-sm font-medium"
                            >
                                View Universities
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}