"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe, Search, Filter, ChevronRight, Star, Users,
    University, Heart, Loader2, X, DollarSign,
    TrendingUpIcon, CheckCircle2, ChevronLeft, ChevronDown,
    ArrowUpDown,
    Bookmark,
    ChartNoAxesColumnIncreasing,
    Scale
} from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/app/axiosInstance"
import { useGlobal } from "@/src/statecontext"
import toast from "react-hot-toast"
import CompareDrawer from "@/components/dashboard/countries/compareDrawer"

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
    extra_content?: {
        rating?: string
        topcourse?: string[]
        tuitionfee?: string
        psw?: string
        keyHightlights?: string[]
    }
}

interface CountriesResponse {
    success: boolean
    total: number
    page: number
    pages: number
    limit: number
    data: Country[]
}

export default function CountriesPage() {
    const router = useRouter()

    // State Management
    const [countries, setCountries] = useState<Country[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [totalPages, setTotalPages] = useState(1)
    const [totalCountries, setTotalCountries] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(30)
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [featuredFilter, setFeaturedFilter] = useState<string>("")
    const [showFilters, setShowFilters] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [currentCountry, setCurrentCountry] = useState(null)

    const { allProfile, updateProfile } = useGlobal()

    const [shortlistedCountries, setShortlistedCountries] = useState(
        allProfile?.profile?.preferences?.preferredCountries || []
    )

    useEffect(() => {
        setShortlistedCountries(allProfile?.profile?.preferences?.preferredCountries || [])
    }, [allProfile])

    const handleCompare = (country) => {
        setCurrentCountry(country)
        setOpenDrawer(true)
    }

    const handleShortlist = async (country) => {
        const alreadySelected = shortlistedCountries.includes(country?.name)
        let updatedCountries = []

        if (alreadySelected) {
            updatedCountries = shortlistedCountries.filter((item) => item !== country?.name)
        } else {
            updatedCountries = [...shortlistedCountries, country?.name]
        }

        setShortlistedCountries(updatedCountries)

        try {
            const res = await axiosInstance.patch("/auth/edit-doc", {
                countries_shortlist: country?.name,
            })

            if (res.data?.success) {
                updateProfile()
            }

            if (alreadySelected) {
                toast.success("Removed from shortlist")
            } else {
                toast.success("Shortlisted Successfully")
            }
        } catch (error) {
            console.log(error)
        }
    }

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
            toast.error('Failed to fetch countries')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCountries()
    }, [currentPage, limit, searchQuery, statusFilter, featuredFilter])

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setSearchQuery("")
        setStatusFilter("")
        setFeaturedFilter("")
        setCurrentPage(1)
    }

    const hasActiveFilters = searchQuery || statusFilter || featuredFilter

    const navigation = (slug) => {
        router.push(`/dashboard/countries/${slug}`)
    }

    // Calculate stats
    const shortlistedCount = shortlistedCountries.length
    const comparedCount = 0

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }
        return pages
    }

    return (
        <main className="flex-1 min-h-screen bg-[#F8FAFC]">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px]">
                
                {/* Header Section with Stats */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1F2A5A]">
                                Shortlist & Compare Countries
                            </h1>
                            <p className="mt-1 text-sm text-[#7B8199]">
                                Explore and compare countries based on your preferences and key factors.
                            </p>
                        </div>
                        
                     
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                        <input
                            type="text"
                            placeholder="Search by country name or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#E8ECF4] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm shadow-orange-500"
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

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
  {/* Left Section */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    {/* Filters Toggle */}
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm font-medium text-[#F26D44] bg-white border border-[#E8ECF4] rounded-lg hover:bg-orange-50 transition-colors"
    >
      <Filter className="w-4 h-4" />
      Filters
      <ChevronRight
        className={`w-4 h-4 transition-transform ${
          showFilters ? "rotate-90" : ""
        }`}
      />
    </button>

    {/* Showing Count */}
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-[#7B8199]">
      <span>Showing</span>
      <span className="font-semibold text-[#1F2A5A]">
        {countries.length}
      </span>
      <span>of</span>
      <span className="font-semibold text-[#1F2A5A]">
        {totalCountries}
      </span>
      <span>countries</span>
    </div>
  </div>

  {/* Stats Cards */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
    {/* Total Countries */}
    <div className="bg-white rounded-xl p-3 sm:px-6 px-3 border border-[#E8ECF4] shadow-sm shadow-orange-500">
      <div className="flex items-center justify-center gap-2">
        <Globe className="w-6 h-6 text-orange-500 flex-shrink-0" />
        <div>
          <p className="text-lg font-bold text-[#1F2A5A]">
            {totalCountries}
          </p>
          <p className="text-xs text-gray-700 font-bold whitespace-nowrap">
            Total Countries
          </p>
        </div>
      </div>
    </div>

    {/* Shortlisted */}
    <div className="bg-white rounded-xl p-3 sm:px-6 px-3 border border-[#E8ECF4] shadow-sm shadow-orange-500">
      <div className="flex items-center justify-center gap-2">
        <Bookmark className="w-6 h-6 text-orange-500 flex-shrink-0" />
        <div>
          <p className="text-lg font-bold text-[#1F2A5A]">
            {shortlistedCount}
          </p>
          <p className="text-xs text-gray-700 font-bold whitespace-nowrap">
            Shortlisted
          </p>
        </div>
      </div>
    </div>

    {/* Compared */}
    <div className="bg-white rounded-xl p-3 sm:px-6 px-3 border border-[#E8ECF4] shadow-sm shadow-orange-500">
      <div className="flex items-center justify-center gap-2">
        <ChartNoAxesColumnIncreasing className="w-6 h-6 text-orange-500 flex-shrink-0" />
        <div>
          <p className="text-lg font-bold text-[#1F2A5A]">
            {comparedCount}
          </p>
          <p className="text-xs text-gray-700 font-bold whitespace-nowrap">
            Compared
          </p>
        </div>
      </div>
    </div>

    {/* To Compare */}
    <div className="bg-white rounded-xl p-3 sm:px-6 px-3 border border-[#E8ECF4] shadow-sm shadow-orange-500">
      <div className="flex items-center justify-center gap-2">
        <Scale className="w-6 h-6 text-orange-500 flex-shrink-0" />
        <div>
          <p className="text-lg font-bold text-[#1F2A5A]">
            {Math.max(0, 3 - shortlistedCount)}
          </p>
          <p className="text-xs text-gray-700 font-bold whitespace-nowrap">
            To Compare
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

                  

                    {/* Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-[#E8ECF4] overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-medium text-[#1F2A5A] mb-2">Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-[#E8ECF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                                        >
                                            <option value="">All Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-medium text-[#1F2A5A] mb-2">Featured</label>
                                        <select
                                            value={featuredFilter}
                                            onChange={(e) => setFeaturedFilter(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-[#E8ECF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
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
                                                className="px-4 py-2.5 text-sm font-medium text-[#F26D44] hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200"
                                            >
                                                Clear All Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Filters Tags */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                                    Search: {searchQuery}
                                    <button onClick={() => setSearchQuery("")} className="hover:text-orange-900">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}
                            {statusFilter && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                    Status: {statusFilter}
                                    <button onClick={() => setStatusFilter("")} className="hover:text-blue-900">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}
                            {featuredFilter && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                                    {featuredFilter === "Yes" ? "Featured Only" : "Non-Featured"}
                                    <button onClick={() => setFeaturedFilter("")} className="hover:text-amber-900">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Table Container */}
                <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-sm overflow-hidden">
                    
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white border-r border-orange-400">
                                        <div className="flex items-center gap-2">
                                            Country
                                            <ArrowUpDown className="w-3.5 h-3.5" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white border-r border-orange-400">
                                        <div className="flex items-center gap-2">
                                            Top Courses
                                            <ArrowUpDown className="w-3.5 h-3.5" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white border-r border-orange-400">
                                        <div className="flex items-center gap-2">
                                            Avg. Tuition Fee
                                            <span className="text-[10px] font-normal">(Per Year)</span>
                                            <ArrowUpDown className="w-3.5 h-3.5" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white border-r border-orange-400">
                                        <div className="flex items-center gap-2">
                                            PSW
                                            <ArrowUpDown className="w-3.5 h-3.5" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white border-r border-orange-400">
                                        <div className="flex items-center gap-2">
                                            Key Highlights
                                            <ArrowUpDown className="w-3.5 h-3.5" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                                        <div className="flex items-center gap-2">
                                            Actions
                                            <ArrowUpDown className="w-3.5 h-3.5" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8ECF4]">
                                  {/* Loading State */}
                 
                                { loading ?(
    <tr>
      <td colSpan={6} className="py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
          <p className="text-sm text-[#7B8199]">
            Loading countries...
          </p>
        </div>
      </td>
    </tr>
  ) : (countries.map((item, index) => {
                                    const extra = item?.extra_content
                                    return (
                                        <tr
                                            key={item._id || index}
                                            className={`group hover:bg-orange-100/50 transition-all duration-300 ${index%2 !==0 
            ? "bg-orange-50/60 border-l-4 border-l-orange-500" 
            : "bg-white"} `}
                                         
                                        >
                                            {/* Country Column */}
                                            <td className="px-6 py-5 border-r border-[#E8ECF4]">
                                                <div className="flex items-start gap-4">
                                                    <div className="relative">
                                                        <img
                                                            src={item?.flg}
                                                            alt={item?.name}
                                                            className="h-12 w-16 rounded-lg object-cover border-2 border-[#EEF2F7] shadow-sm"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-extrabold text-[#1F2A5A] group-hover:text-orange-600 transition-colors">
                                                            {item?.name}
                                                        </h3>
                                                        <div className="mt-1 flex items-center gap-1">
                                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                            <span className="text-xs font-semibold text-[#1F2A5A]">
                                                                {extra?.rating || "4.5"}
                                                            </span>
                                                            <span className="text-xs text-[#98A2B3]">•</span>
                                                            <span className="text-xs text-[#6B7280]">Top rated</span>
                                                        </div>
                                                        <span className="mt-2 inline-flex items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10px] font-bold text-[#15803D] border border-[#BBF7D0]">
                                                            High Match
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Top Courses Column */}
                                            <td className="px-6 py-5 border-r border-[#E8ECF4]">
                                                <ul className="space-y-1.5">
                                                    {extra?.topcourse?.slice(0, 3)?.map((course, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm font-medium text-[#1F2A5A]">
                                                            <span className="text-orange-500 mt-1">●</span>
                                                            <span className="line-clamp-1">{course}</span>
                                                        </li>
                                                    ))}
                                                    {(extra?.topcourse?.length || 0) > 3 && (
                                                        <li className="text-xs text-orange-600 font-medium cursor-pointer hover:underline">
                                                            + {(extra?.topcourse?.length || 0) - 3} More
                                                        </li>
                                                    )}
                                                </ul>
                                            </td>

                                            {/* Tuition Fee Column */}
                                            <td className="px-6 py-5 border-r border-[#E8ECF4]">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-bold text-[#1F2A5A]">
                                                        {extra?.tuitionfee || "USD 30,000 - 60,000"}
                                                    </span>
                                                    <span className="text-xs text-[#98A2B3]">per year</span>
                                                </div>
                                            </td>

                                            {/* PSW Column */}
                                            <td className="px-6 py-5 border-r border-[#E8ECF4]">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#1F2A5A]">
                                                        {extra?.psw || "3 Years (OPT)"}
                                                    </span>
                                                    <span className="text-xs text-[#98A2B3]">post-study work</span>
                                                </div>
                                            </td>

                                            {/* Key Highlights Column */}
                                            <td className="px-6 py-5 border-r border-[#E8ECF4]">
                                                <ul className="space-y-1.5">
                                                    {extra?.keyHightlights?.slice(0, 3)?.map((highlight, idx) => (
                                                        <li key={idx} className="flex items-center text-sm gap-2 font-medium text-[#1F2A5A]">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                            <span className="line-clamp-1">{highlight}</span>
                                                        </li>
                                                    ))}
                                                    {(extra?.keyHightlights?.length || 0) > 3 && (
                                                        <li className="text-xs text-orange-600 font-medium cursor-pointer hover:underline">
                                                            + {(extra?.keyHightlights?.length || 0) - 3} More
                                                        </li>
                                                    )}
                                                </ul>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-3">
                                                    {/* Shortlist Checkbox */}
                                                    <label className="flex items-center gap-2 cursor-pointer group/checkbox">
                                                        <input
                                                            type="checkbox"
                                                            disabled={shortlistedCountries.length === 3 && !shortlistedCountries.includes(item.name)}
                                                            checked={shortlistedCountries.includes(item?.name)}
                                                            onChange={(e) => {
                                                                e.stopPropagation()
                                                                handleShortlist(item)
                                                            }}
                                                            className="w-4 h-4 rounded accent-orange-500 border-2 border-[#D1D5DB] text-orange-600 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                        />
                                                        <span className="text-xs font-bold text-[#1F2A5A] group-hover/checkbox:text-orange-600 transition-colors">
                                                            Shortlist
                                                        </span>
                                                    </label>

                                                    {/* Buttons */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                navigation(item?.code)
                                                            }}
                                                            className="px-4 py-2 rounded-lg border border-orange-500 text-xs font-semibold text-[#475467] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] transition-all duration-200"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleCompare(item)
                                                            }}
                                                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                                                        >
                                                            Compare
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden divide-y divide-[#E8ECF4]">
                        {countries.map((item, index) => {
                            const extra = item?.extra_content
                            return (
                                <div
                                    key={item._id || index}
                                    className="p-4 hover:bg-orange-50/50 transition-colors cursor-pointer"
                                  
                                >
                                    {/* Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <img
                                            src={item?.flg}
                                            alt={item?.name}
                                            className="h-12 w-16 rounded-lg object-cover border-2 border-[#EEF2F7]"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#1F2A5A]">
                                                        {item?.name}
                                                    </h3>
                                                    <div className="mt-1 flex items-center gap-1">
                                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-xs font-semibold">{extra?.rating || "4.5"}</span>
                                                    </div>
                                                </div>
                                                <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-2 py-1 text-[10px] font-bold text-[#15803D] border border-[#BBF7D0] whitespace-nowrap">
                                                    High Match
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tuition & PSW */}
                                    <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-[#F1F5F9]">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#98A2B3] mb-1">
                                                Tuition Fee
                                            </p>
                                            <p className="text-sm font-bold text-[#1F2A5A]">
                                                {extra?.tuitionfee || "USD 30k-60k"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#98A2B3] mb-1">
                                                PSW
                                            </p>
                                            <p className="text-sm font-bold text-[#1F2A5A]">
                                                {extra?.psw || "3 Years"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Top Courses */}
                                    <div className="mb-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#98A2B3] mb-2">
                                            Top Courses
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {extra?.topcourse?.slice(0, 3)?.map((course, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-[10px] font-medium border border-orange-100">
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={shortlistedCountries.includes(item?.name)}
                                                onChange={(e) => {
                                                    e.stopPropagation()
                                                    handleShortlist(item)
                                                }}
                                                className="w-4 h-4 rounded border-2 border-[#D1D5DB] text-orange-600 focus:ring-orange-500"
                                            />
                                            <span className="text-xs font-medium text-[#2563EB]">Shortlist</span>
                                        </label>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleCompare(item)
                                            }}
                                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-semibold shadow-md"
                                        >
                                            Compare
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Pagination Section */}
                    <div className="border-t border-[#E8ECF4] px-6 py-4 bg-[#F8FAFC]">
                        <div className="flex flex-col sm:flex-row items-center justify-start gap-16">
                            {/* Showing Text */}
                            <div className="text-sm text-[#7B8199]">
                                Showing <span className="font-semibold text-[#1F2A5A]">{countries.length}</span> of <span className="font-semibold text-[#1F2A5A]">{totalCountries}</span> countries
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-[#E8ECF4] bg-white text-[#7B8199] hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {getPageNumbers().map((pageNum, idx) => (
                                        pageNum === '...' ? (
                                            <span key={idx} className="px-3 py-2 text-[#7B8199]">...</span>
                                        ) : (
                                            <button
                                                key={idx}
                                                onClick={() => handlePageChange(pageNum as number)}
                                                className={`min-w-[36px] px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                    currentPage === pageNum
                                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                                        : 'bg-white border border-[#E8ECF4] text-[#7B8199] hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    ))}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-[#E8ECF4] bg-white text-[#7B8199] hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                {/* Items Per Page */}
                                <div className="ml-4 flex items-center gap-2">
                                    <select
                                        value={limit}
                                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                                        className="px-3 py-2 bg-white border border-[#E8ECF4] rounded-lg text-sm font-medium text-[#7B8199] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    >
                                        <option value={10}>10 per page</option>
                                        <option value={20}>20 per page</option>
                                        <option value={30}>30 per page</option>
                                        <option value={50}>50 per page</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                  

                    {!loading && countries.length === 0 && (
                        <div className="p-12 text-center">
                            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-[#1F2A5A] mb-2">No countries found</h3>
                            <p className="text-sm text-[#7B8199] mb-4">
                                {searchQuery ? `No results for "${searchQuery}"` : "No countries match your filters"}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Floating Shortlist Button */}
                {shortlistedCountries.length > 0 && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl border border-[#E8ECF4] p-4 max-w-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
                                        <p className="text-sm font-bold text-[#1F2A5A]">
                                            Country Shortlist
                                        </p>
                                    </div>
                                    <p className="text-xs text-[#7B8199]">
                                        {shortlistedCountries.length}/3 countries selected
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {shortlistedCountries.slice(0, 3).map((country, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-medium">
                                                {country}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Link href="/dashboard/programs">
                                    <button
                                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                            shortlistedCountries.length > 0
                                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        Continue
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <CompareDrawer
                    open={openDrawer}
                    setOpen={setOpenDrawer}
                    countries={countries}
                    currentCountry={currentCountry}
                />
            </div>
        </main>
    )
}