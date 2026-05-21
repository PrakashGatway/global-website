"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe, Search, Filter, ChevronRight, Star, Users,
    University, Calendar, MapPin, Heart, Loader2,
    Grid3x3, List, ChevronLeft, X, DollarSign,
    TrendingUp, BookOpen, Award, Shield, Compass, Pencil
} from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/app/axiosInstance"
import { useGlobal } from "@/src/statecontext"
import toast from "react-hot-toast"


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
    createdAt: string
    updatedAt: string
}

interface CountriesResponse {
    success: boolean
    total: number
    page: number
    pages: number
    limit: number
    data: Country[]
}

// Country Card Component
const CountryCard = ({ country, index }: { country: Country; index: number }) => {
    const router = useRouter()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            onClick={() => router.push(`/dashboard/countries/${country.code}?tab=visa`)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
        >
            {/* Flag/Image Section */}
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-gray-400 to-gray-50">
                {country.image ? (
                    <img
                        src={country.image}
                        alt={country.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {country.flg ? (
                            <img
                                src={country.flg}
                                alt={`Flag of ${country.name}`}
                                className="w-20 h-20 object-contain"
                            />
                        ) : (
                            <Globe className="w-16 h-16 text-gray-400" />
                        )}
                    </div>
                )}

                {/* Featured Badge */}
                {country.isFeatured === "Yes" && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium shadow-lg ${country.status === 'Active'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                        }`}>
                        {country.status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#F26D44] transition-colors">
                            {country.name}
                        </h3>
                        <p className="text-sm text-gray-500">Code: {country.code}</p>
                    </div>
                    {country.currency && (
                        <div className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                            {country.currency}
                        </div>
                    )}
                </div>

                {/* Stats */}
                {/* <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                            <University className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Universities</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {country.universities || 'Coming Soon'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-50 rounded-lg">
                            <Users className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Students</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {country.students?.toLocaleString() || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* View Details Button */}
                <button className="w-full mt-4 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-[#F26D44]
                 hover:text-white transition-all duration-200 text-sm font-medium">
                    Explore Country
                </button>
            </div>
        </motion.div>
    )
}

// Skeleton Loader Component
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
        <div className="h-36 bg-gray-200" />
        <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                </div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl" />
        </div>
    </div>
)

// View Toggle Button
const ViewToggle = ({ view, setView }: { view: 'grid' | 'list'; setView: (view: 'grid' | 'list') => void }) => (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
        <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all duration-200 ${view === 'grid'
                ? 'bg-white text-[#F26D44] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            <Grid3x3 className="w-5 h-5" />
        </button>
        <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all duration-200 ${view === 'list'
                ? 'bg-white text-[#F26D44] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            <List className="w-5 h-5" />
        </button>
    </div>
)

// List View Card
const ListViewCard = ({ country }: { country: Country }) => {
    const router = useRouter()

    return (
        <motion.div
            whileHover={{ x: 4 }}
            onClick={() => router.push(`/dashboard/countrys/${country.code}`)}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
        >
            <div className="flex items-center gap-4">
                {/* Flag */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {country.flg ? (
                        <img src={country.flg} alt={country.name} className="w-12 h-12 object-contain" />
                    ) : (
                        <Globe className="w-8 h-8 text-gray-400" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{country.name}</h3>
                        <span className="text-xs text-gray-500">({country.code})</span>
                        {country.isFeatured === "Yes" && (
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        {country.currency && (
                            <span className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                {country.currency}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <University className="w-3.5 h-3.5" />
                            {country.universities || 0} Universities
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {country.students?.toLocaleString() || 0} Students
                        </span>
                    </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#F26D44] transition-colors" />
            </div>
        </motion.div>
    )
}

export default function CountriesPage() {
    const router = useRouter()

    // State Management
    const [countries, setCountries] = useState<Country[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCountries, setTotalCountries] = useState(0)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [featuredFilter, setFeaturedFilter] = useState<string>("")
    const [showFilters, setShowFilters] = useState(false)

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [preferences, setPreferences] = useState({
        fieldOfStudy: "MS in Data Science",
        intake: "June 2026",
        budget: "150000",
        preferredLocation: "Europe, North America, Australia",
        postStudyWork: "Important",
        stayBack: "Long Term (2+ years)",
    });

    const limit = 12
    const { allProfile } = useGlobal()

   console.log(allProfile)

   const [shortlistedCountries,
    setShortlistedCountries] =
    useState(
        allProfile?.profile?.otherDetails?.countries_shortlist || []
    );

        useEffect(() => {
            setShortlistedCountries(allProfile?.profile?.otherDetails?.countries_shortlist || [])
        },[allProfile])

console.log(shortlistedCountries)



    const handleShortlist = async (
        country
    ) => {

        // already exists ?
        const alreadySelected =
            shortlistedCountries.includes(
                country?.code
            );

        let updatedCountries = [];

        // REMOVE
        if (alreadySelected) {

            updatedCountries =
                shortlistedCountries.filter(
                    (item) =>
                        item !== country?.code
                );

        }

        // ADD
        else {

            updatedCountries = [
                ...shortlistedCountries,
                country?.code,
            ];

        }

        // frontend update
        setShortlistedCountries(
            updatedCountries
        );

        try {

            await axiosInstance.patch(
                "/auth/edit-doc",
                {
                    countries_shortlist:
                        country?.code,
                }
            );

            // toast condition
            if (alreadySelected) {

                toast.success(
                    "Removed from shortlist"
                );

            } else {

                toast.success(
                    "Shortlisted Successfully"
                );

            }

        } catch (error) {

            console.log(error);

        }

    };

    // Fetch Countries
    const fetchCountries = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                ...(searchQuery && { search: searchQuery }),
                ...(statusFilter && { status: statusFilter }),
                ...(featuredFilter && { isFeatured: featuredFilter })
            })

            const response = await axiosInstance.get(`/countries?${params}&populateExtra=true`)
            const data: CountriesResponse = response.data

            setCountries(data.data)
            setTotalPages(data.pages)
            setTotalCountries(data.total)
        } catch (error) {
            console.error('Error fetching countries:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCountries()
    }, [currentPage, searchQuery, statusFilter, featuredFilter])

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1)
            } else {
                fetchCountries()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const clearFilters = () => {
        setSearchQuery("")
        setStatusFilter("")
        setFeaturedFilter("")
        setCurrentPage(1)
    }

    const hasActiveFilters = searchQuery || statusFilter || featuredFilter

    return (
        <main className="flex-1 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="mb-8">
                    {/* Breadcrumb */}
                    {/* <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Link href="/dashboard" className="hover:text-[#F26D44] transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">Countries</span>
                    </div> */}

                    {/* Title */}
                    <div className="w-full rounded-2xl border border-[#E9ECF5] bg-white p-4 sm:p-6 shadow-sm">

                        {/* Header */}
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-[15px] sm:text-[18px] font-semibold text-[#1E2A5A]">
                                Your Preferences
                            </h2>

                            <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 text-[12px] sm:text-[14px] font-medium text-[#4F46E5] hover:opacity-80 transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                                    />
                                </svg>
                                Edit Preferences
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 21h8M12 17v4M7 4h10l1 10H6L7 4z"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Field of Study
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827] leading-snug">
                                         {allProfile?.profile?.otherDetails?.categorie_shortlist?.join(', ') || ""}
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Intake
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827]">
                                        {allProfile?.data?.intake}
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DDF5E8] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#16A34A]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.4 15A7.97 7.97 0 0020 12a8 8 0 10-8 8"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Budget (Tuition Fee)
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827] leading-snug">
                                        Up to {allProfile?.data?.tuitionfee} / year
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Preferred Location
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827] leading-snug">
                                         {allProfile?.profile?.otherDetails?.countries_shortlist?.join(', ') || ""}
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Post Study Work
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827]">
                                        Important
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17 20h5V4H2v16h5"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Stay Back Period
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827] leading-snug">
                                        Long Term (2+ years)
                                    </h3>
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                                <Globe className="w-8 h-8 text-[#F26D44]" />
                                Visa Guide
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Explore countries and check the visa information
                            </p>
                        </div>

                        <div className="flex items-center gap-3"> */}
                    {/* <ViewToggle view={viewMode} setView={setViewMode} /> */}
                    {/* <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-xl transition-all duration-200 flex gap-2 items-center ${showFilters || hasActiveFilters
                                        ? 'bg-[#F26D44] text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Filter className="w-5 h-5" /> Filter
                            </button>
                        </div>
                    </div> */}
                </div>

                {/* Search and Filters */}
                <div className="space-y-4 mb-8">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by country name or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Panel */}
                    {(showFilters || hasActiveFilters) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                        >
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                                    >
                                        <option value="">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
                                    <select
                                        value={featuredFilter}
                                        onChange={(e) => setFeaturedFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                                    >
                                        <option value="">All Countries</option>
                                        <option value="Yes">Featured Only</option>
                                        <option value="No">Non-Featured</option>
                                    </select>
                                </div>

                                {hasActiveFilters && (
                                    <div className="flex items-end">
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-sm text-[#F26D44] hover:bg-[#F26D44]/10 rounded-lg transition-colors"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Active Filters Tags */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F26D44]/10 text-[#F26D44] rounded-full text-sm">
                                Search: {searchQuery}
                                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-[#F26D44]/70">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {statusFilter && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                Status: {statusFilter}
                                <button onClick={() => setStatusFilter("")} className="ml-1 hover:text-blue-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {featuredFilter && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                                {featuredFilter === "Yes" ? "Featured Only" : "Non-Featured"}
                                <button onClick={() => setFeaturedFilter("")} className="ml-1 hover:text-amber-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">
                        Showing {countries.length} of {totalCountries} countries
                    </p>
                    {viewMode === 'grid' && (
                        <p className="text-sm text-gray-400">Click on any country to explore details</p>
                    )}
                </div>

                {/* Countries Grid/List */}
                {/* {loading ? (
                    <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-3"
                    }>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : countries.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl">
                        <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No countries found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery 
                                ? `No results found for "${searchQuery}"` 
                                : "No countries match your filters"}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2.5 bg-[#F26D44] text-white rounded-xl hover:bg-[#F26D44]/90 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {countries.map((country, index) => (
                            <CountryCard key={country._id} country={country} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {countries.map((country) => (
                            <ListViewCard key={country._id} country={country} />
                        ))}
                    </div>
                )} */}

                <div className="w-full rounded-2xl border border-[#E8ECF4] bg-white shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col gap-3 border-b border-[#EEF2F7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                        <div>
                            <h2 className="text-[15px] sm:text-[18px] font-semibold text-[#1F2A5A]">
                                Shortlist & Compare Countries
                            </h2>

                            <p className="mt-1 text-[11px] sm:text-[13px] text-[#7B8199]">
                                Explore and compare countries based on your preferences and key factors.
                            </p>
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full min-w-[1100px]">

                            <thead className="bg-[#F8FAFC] border-b border-[#EEF2F7]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#667085]">
                                        Country
                                    </th>

                                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#667085]">
                                        Top Courses
                                    </th>

                                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#667085]">
                                        Avg. Tuition Fee
                                    </th>

                                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#667085]">
                                        PSW
                                    </th>

                                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#667085]">
                                        Key Highlights
                                    </th>

                                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#667085]">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {countries?.map((item, index) => {

                                    const extra =
                                        item?.extra_content;

                                    return (

                                        <tr
                                            key={item._id || index}
                                            className="border-b border-[#F1F5F9] hover:bg-[#FAFBFD] transition"
                                        >

                                            {/* Country */}
                                            <td className="px-6 py-5 align-top">

                                                <div className="flex gap-4">

                                                    <img
                                                        src={item?.flg}
                                                        alt={item?.name}
                                                        className="h-12 w-16 rounded-md object-cover border"
                                                    />

                                                    <div>

                                                        <h3 className="text-[14px] font-semibold text-[#1F2937]">
                                                            {item?.name}
                                                        </h3>

                                                        <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B7280]">
                                                            ⭐ {extra?.rating || "4.5"}
                                                        </div>

                                                        <span className="mt-3 inline-flex rounded-md bg-[#DCFCE7] px-2 py-1 text-[11px] font-medium text-[#15803D]">
                                                            High Match
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* Courses */}
                                            <td className="px-6 py-5 align-top">

                                                <ul className="space-y-2 text-[13px] text-[#475467]">

                                                    {extra?.topcourse
                                                        ?.slice(0, 3)
                                                        ?.map((course, idx) => (

                                                            <li key={idx}>
                                                                • {course}
                                                            </li>

                                                        ))}

                                                </ul>

                                            </td>

                                            {/* Tuition */}
                                            <td className="px-6 py-5 align-top">

                                                <div className="text-[13px] font-semibold text-[#344054]">
                                                    {extra?.tuitionfee || "N/A"}
                                                </div>

                                            </td>

                                            {/* PSW */}
                                            <td className="px-6 py-5 align-top">

                                                <div className="text-[13px] font-semibold text-[#344054]">
                                                    {extra?.psw || "N/A"}
                                                </div>

                                            </td>

                                            {/* Highlights */}
                                            <td className="px-6 py-5 align-top">

                                                <ul className="space-y-2">

                                                    {extra?.keyHightlights?.map(
                                                        (highlight, idx) => (

                                                            <li
                                                                key={idx}
                                                                className="flex items-center gap-2 text-[13px] text-[#475467]"
                                                            >

                                                                <span className="h-2 w-2 rounded-full bg-green-500"></span>

                                                                {highlight}

                                                            </li>

                                                        )
                                                    )}

                                                </ul>

                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-5 align-top">

                                                <div className="flex flex-col gap-3">

                                                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#2563EB]">

                                                        <input
                                                            type="checkbox"

                                                            checked={shortlistedCountries.includes(
                                                                item?.code
                                                            )}

                                                            onChange={() =>
                                                                handleShortlist(item)
                                                            }

                                                            className="h-4 w-4 rounded"
                                                        />

                                                        Shortlist

                                                    </label>
                                                    <button className="text-[12px] font-medium text-[#2563EB]">
                                                        Compare
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                    {/* Mobile Cards */}
                    <div className="flex flex-col gap-4 p-4 lg:hidden">

                        {countries?.map((item, index) => {

                            const extra = item?.extra_content;

                            return (

                                <div
                                    key={item._id || index}
                                    className="rounded-2xl border border-[#EEF2F7] bg-white p-4 shadow-sm transition hover:shadow-md"
                                >

                                    {/* Top */}
                                    <div className="flex gap-3">

                                        <img
                                            src={item?.flg}
                                            alt={item?.name}
                                            className="h-12 w-16 rounded-md border object-cover"
                                        />

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-2">

                                                <div>

                                                    <h3 className="text-[14px] font-semibold text-[#111827]">
                                                        {item?.name}
                                                    </h3>

                                                    <p className="mt-1 text-[12px] text-[#6B7280]">
                                                        ⭐ {extra?.rating || "4.5"}
                                                    </p>

                                                </div>

                                                <span className="rounded-md bg-[#DCFCE7] px-2 py-1 text-[10px] font-medium text-[#15803D]">
                                                    High Match
                                                </span>

                                            </div>

                                            {/* Tuition Fee */}
                                            <div className="mt-3 text-[13px] font-semibold text-[#344054]">
                                                {extra?.tuitionfee || "N/A"}
                                            </div>

                                        </div>

                                    </div>

                                    {/* Courses */}
                                    <div className="mt-4">

                                        <h4 className="text-[12px] font-semibold text-[#667085]">
                                            Top Courses
                                        </h4>

                                        <ul className="mt-2 space-y-1 text-[12px] text-[#475467]">

                                            {extra?.topcourse
                                                ?.slice(0, 3)
                                                ?.map((course, idx) => (

                                                    <li key={idx}>
                                                        • {course}
                                                    </li>

                                                ))}

                                        </ul>

                                    </div>

                                    {/* Highlights */}
                                    <div className="mt-4">

                                        <h4 className="text-[12px] font-semibold text-[#667085]">
                                            Key Highlights
                                        </h4>

                                        <div className="mt-2 flex flex-wrap gap-2">

                                            {extra?.keyHightlights
                                                ?.slice(0, 3)
                                                ?.map((highlight, idx) => (

                                                    <span
                                                        key={idx}
                                                        className="rounded-full bg-[#F0FDF4] px-2 py-1 text-[10px] font-medium text-[#15803D]"
                                                    >
                                                        {highlight}
                                                    </span>

                                                ))}

                                        </div>

                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 flex items-center justify-between border-t pt-4">

                                        <div>

                                            <p className="text-[11px] text-[#98A2B3]">
                                                PSW
                                            </p>

                                            <p className="text-[13px] font-semibold text-[#344054]">
                                                {extra?.psw || "N/A"}
                                            </p>

                                        </div>

                                        <div className="flex items-center gap-4">

                                            <label className="flex items-center gap-2 text-[12px] font-medium text-[#2563EB]">

                                                <input
                                                    type="checkbox"

                                                    checked={shortlistedCountries.includes(
                                                        item?.code
                                                    )}

                                                    onChange={() =>
                                                        handleShortlist(item)
                                                    }

                                                    className="h-4 w-4 rounded"
                                                />


                                                Shortlist

                                            </label>

                                            <button className="text-[12px] font-medium text-[#2563EB]">
                                                Compare
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>
                </div>


                <AnimatePresence>
                    {isEditOpen && (
                        <>
                            {/* Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setIsEditOpen(false)}
                                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 26,
                                }}
                                className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-[#EEF2F7] px-5 py-4 sm:px-7">
                                    <div>
                                        <h2 className="text-[18px] font-semibold text-[#111827] sm:text-[22px]">
                                            Edit Preferences
                                        </h2>

                                        <p className="mt-1 text-[12px] text-[#6B7280] sm:text-[14px]">
                                            Update your study preferences for better recommendations
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsEditOpen(false)}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] transition hover:bg-[#E5E7EB]"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                        {/* Field of Study */}
                                        <div>
                                            <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                                                Field of Study
                                            </label>

                                            <input
                                                type="text"
                                                value={preferences.fieldOfStudy}
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        fieldOfStudy: e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full rounded-2xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 text-[14px] font-medium outline-none transition focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#EEF2FF]"
                                                placeholder="Enter field of study"
                                            />
                                        </div>

                                        {/* Intake */}
                                        <div>
                                            <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                                                Intake
                                            </label>

                                            <select
                                                value={preferences.intake}
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        intake: e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full rounded-2xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 text-[14px] font-medium outline-none transition focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#EEF2FF]"
                                            >
                                                <option>January 2026</option>
                                                <option>June 2026</option>
                                                <option>Fall 2026</option>
                                            </select>
                                        </div>

                                        {/* Budget */}
                                        <div>
                                            <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                                                Budget
                                            </label>

                                            <input
                                                type="number"
                                                value={preferences.budget}
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        budget: e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full rounded-2xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 text-[14px] font-medium outline-none transition focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#EEF2FF]"
                                                placeholder="Enter budget"
                                            />
                                        </div>

                                        {/* Post Study Work */}
                                        <div>
                                            <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                                                Post Study Work
                                            </label>

                                            <select
                                                value={preferences.postStudyWork}
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        postStudyWork: e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full rounded-2xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 text-[14px] font-medium outline-none transition focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#EEF2FF]"
                                            >
                                                <option>Important</option>
                                                <option>Very Important</option>
                                                <option>Not Important</option>
                                            </select>
                                        </div>

                                        {/* Preferred Location */}
                                        <div className="sm:col-span-2">
                                            <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                                                Preferred Location
                                            </label>

                                            <textarea
                                                rows={3}
                                                value={preferences.preferredLocation}
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        preferredLocation: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 py-3 text-[14px] font-medium outline-none transition focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#EEF2FF]"
                                                placeholder="Enter preferred location"
                                            />
                                        </div>

                                        {/* Stay Back */}
                                        <div className="sm:col-span-2">
                                            <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                                                Stay Back Period
                                            </label>

                                            <select
                                                value={preferences.stayBack}
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        stayBack: e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full rounded-2xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 text-[14px] font-medium outline-none transition focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#EEF2FF]"
                                            >
                                                <option>1 Year</option>
                                                <option>2 Years</option>
                                                <option>Long Term (2+ years)</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex flex-col-reverse gap-3 border-t border-[#EEF2F7] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
                                    <button
                                        onClick={() => setIsEditOpen(false)}
                                        className="h-11 rounded-2xl border border-[#E5E7EB] px-5 text-[14px] font-medium text-[#374151] transition hover:bg-[#F9FAFB]"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => {
                                            console.log("Saved Preferences:", preferences);
                                            setIsEditOpen(false);
                                        }}
                                        className="h-11 rounded-2xl bg-[#4F46E5] px-6 text-[14px] font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4338CA]"
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>



                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = currentPage - 2 + i
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-lg transition-all duration-200 ${currentPage === pageNum
                                            ? 'bg-[#F26D44] text-white'
                                            : 'border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </main>
    )
}