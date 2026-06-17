"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
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
    const [searchQuery, setSearchQuery] = useState("")

    const [totalPages, setTotalPages] = useState(1)
    const [totalCountries, setTotalCountries] = useState(0)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [featuredFilter, setFeaturedFilter] = useState<string>("")
    const [showFilters, setShowFilters] = useState(false)

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [openDrawer, setOpenDrawer] = useState(false)
    const [currentCountry, setCurrentCountry] = useState(null)
    const [page, setPage] = useState(1)
    const [currentPage, setCurrentPage] = useState()

    const [loading, setLoading] = useState(false) // Start with false, not true
    const [initialLoad, setInitialLoad] = useState(true) // Track initial load





    const [hasMore, setHasMore] = useState(true)

    const observerTarget = useRef(null)

    const handleCompare = (country) => {
        setCurrentCountry(country)
        setOpenDrawer(true)
    }


    const [preferences, setPreferences] = useState({
        fieldOfStudy: "MS in Data Science",
        intake: "June 2026",
        budget: "150000",
        preferredLocation: "Europe, North America, Australia",
        postStudyWork: "Important",
        stayBack: "Long Term (2+ years)",
    });

    const limit = 30
    const { allProfile, updateProfile } = useGlobal()



    const [shortlistedCountries,
        setShortlistedCountries] =
        useState(
            allProfile?.profile?.otherDetails?.countries_shortlist || []
        );

    useEffect(() => {
        setShortlistedCountries(allProfile?.profile?.otherDetails?.countries_shortlist || [])
    }, [allProfile])





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

            const res = await axiosInstance.patch(
                "/auth/edit-doc",
                {
                    countries_shortlist:
                        country?.code,
                }
            );

            if (res.data?.success) {
                updateProfile()
            }


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


    const fetchCountries = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(searchQuery && { search: searchQuery }),
                ...(statusFilter && { status: statusFilter }),
                ...(featuredFilter && { isFeatured: featuredFilter })
            })

            const response = await axiosInstance.get(`/countries?${params}&populateExtra=true`)
            const data: CountriesResponse = response.data

            console.log('Page:', page, 'Data length:', data.data.length, 'Total:', data.total, 'Pages:', data.pages)

            setCountries((prev) => {
                if (page === 1) {
                    // First page - replace all data
                    return data.data
                } else {
                    // Subsequent pages - append new data
                    const merged = [...prev, ...data.data]
                    // Remove duplicates just in case
                    const uniqueCountries = merged.filter(
                        (item, index, self) =>
                            index === self.findIndex((t) => t._id === item._id)
                    )
                    return uniqueCountries
                }
            })

            setTotalPages(data.pages)
            setTotalCountries(data.total)

            // Check if we have more pages to load
            const morePages = page < data.pages
            setHasMore(morePages)

            console.log('Has more:', morePages, 'Current page:', page, 'Total pages:', data.pages)

        } catch (error) {
            console.error('Error fetching countries:', error)
            toast.error('Failed to fetch countries')
            setHasMore(false)
        } finally {
            setLoading(false)
            setInitialLoad(false)
        }
    }

    // Load first page when component mounts or filters change
    useEffect(() => {
        setPage(1)
        setCountries([])
        setHasMore(true)
        setInitialLoad(true)
        // Fetch will be triggered by the page change effect below
    }, [searchQuery, statusFilter, featuredFilter])

    // Fetch when page changes
    useEffect(() => {
        if (page === 1 && !initialLoad) {
            // If resetting to page 1, don't fetch twice on initial load
            fetchCountries()
        } else if (page > 1) {
            fetchCountries()
        } else if (initialLoad) {
            fetchCountries()
        }
    }, [page])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                console.log('Observer triggered:', entry.isIntersecting, 'hasMore:', hasMore, 'loading:', loading)

                if (entry.isIntersecting && hasMore && !loading) {
                    console.log('Loading next page...')
                    setPage((prev) => prev + 1)
                }
            },
            {
                root: null,
                rootMargin: "200px",
                threshold: 0
            }
        )

        const currentTarget = observerTarget.current

        if (currentTarget) {
            observer.observe(currentTarget)
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget)
            }
            observer.disconnect()
        }
    }, [hasMore, loading])

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



    const navigation = (slug) => {
        router.push(`/dashboard/countries/${slug}`)
    }

    return (
        <main className="flex-1 min-h-screen bg-white">
            <div className=" mx-auto px-4 py-6">
                {/* Header Section */}


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
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                Status: {statusFilter}
                                <button onClick={() => setStatusFilter("")} className="ml-1 hover:text-orange-900">
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


                </div>

                {shortlistedCountries.length > 0 && (
                    <div className="fixed bottom-5 right-5 z-50 bg-white rounded-xl shadow-2xl border p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold">
                                    Country Shortlist
                                </p>
                                <p className="text-xs text-gray-500">
                                    {shortlistedCountries.length}/3 countries selected
                                </p>
                            </div>
                            <Link href={"/dashboard/programs"}>

                                <button

                                    className={`px-6 py-2 rounded-lg font-medium ${shortlistedCountries.length > 0
                                        ? "bg-[#2563EB] text-white"
                                        : "bg-gray-300 text-gray-500 cursor-pointer"
                                        }`}
                                >
                                    Continue
                                </button>
                            </Link>
                        </div>
                    </div>
                )}



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
                        <table className="w-full min-w-[1100px] border-collapse">
                            <thead className="bg-[#F8FAFC]">
                                <tr>
                                    <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wider text-[#475467] border-r border-[#E8ECF4]">
                                        Country
                                    </th>
                                    <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wider text-[#475467] border-r border-[#E8ECF4]">
                                        Top Courses
                                    </th>
                                    <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wider text-[#475467] border-r border-[#E8ECF4]">
                                        Avg. Tuition Fee
                                    </th>
                                    <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wider text-[#475467] border-r border-[#E8ECF4]">
                                        PSW
                                    </th>
                                    <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wider text-[#475467] border-r border-[#E8ECF4]">
                                        Key Highlights
                                    </th>
                                    <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-wider text-[#475467]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {countries?.map((item, index) => {
                                    const extra = item?.extra_content;
                                    return (
                                        <tr
                                            key={item._id || index}
                                            className="
    border-b border-[#E8ECF4]
    cursor-pointer
    transition-all duration-300 ease-out
    hover:-translate-y-1
    hover:scale-[1.0]
    hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]
    hover:bg-orange-50
  "
                                            style={{
                                                transformStyle: "preserve-3d",
                                            }}
                                        >
                                            {/* Country */}
                                            <td className="px-6 py-5 align-top border-r border-[#E8ECF4]">
                                                <div className="flex gap-4">
                                                    <img
                                                        src={item?.flg}
                                                        alt={item?.name}
                                                        className="h-14 w-20 rounded-lg object-cover border-2 border-[#EEF2F7] shadow-sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-[14px] font-semibold text-[#1F2A5A]">
                                                            {item?.name}
                                                        </h3>
                                                        <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B7280]">
                                                            <span className="text-yellow-500">⭐</span>
                                                            <span className="font-medium">{extra?.rating || "4.5"}</span>
                                                            <span className="text-[#98A2B3]">•</span>
                                                            <span className="text-[#98A2B3]">Top rated</span>
                                                        </div>
                                                        <span className="mt-2 inline-flex rounded-full bg-[#DCFCE7] px-3 py-1 text-[10px] font-semibold text-[#15803D] border border-[#BBF7D0]">
                                                            High Match
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Courses */}
                                            <td className="px-6 py-5 align-top border-r border-[#E8ECF4]">
                                                <ul className="space-y-1.5 text-[13px] text-[#475467]">
                                                    {extra?.topcourse?.slice(0, 3)?.map((course, idx) => (
                                                        <li key={idx} className="flex items-start gap-1.5">
                                                            <span className="text-[#2563EB] text-[8px] mt-1.5">●</span>
                                                            <span className="line-clamp-1">{course}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>

                                            {/* Tuition */}
                                            <td className="px-6 py-5 align-top border-r border-[#E8ECF4]">
                                                <div className="flex flex-col">
                                                    <span className="text-[15px] font-semibold text-[#1F2A5A]">
                                                        {extra?.tuitionfee || "N/A"}
                                                    </span>
                                                    <span className="text-[10px] text-[#98A2B3]">per year</span>
                                                </div>
                                            </td>

                                            {/* PSW */}
                                            <td className="px-6 py-5 align-top border-r border-[#E8ECF4]">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-semibold text-[#1F2A5A]">
                                                        {extra?.psw || "N/A"}
                                                    </span>
                                                    <span className="text-[10px] text-[#98A2B3]">post-study work</span>
                                                </div>
                                            </td>

                                            {/* Highlights */}
                                            <td className="px-6 py-5 align-top border-r border-[#E8ECF4]">
                                                <ul className="space-y-1.5">
                                                    {extra?.keyHightlights?.map((highlight, idx) => (
                                                        <li key={idx} className="flex items-center gap-2 text-[12px] text-[#475467]">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                                            <span className="line-clamp-1">{highlight}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>

                                            {/* Action */}
                                            <td className="px-3 py-5 align-top">
                                                <div className="flex flex-col gap-3">
                                                    {/* SHORTLIST */}
                                                    <label className="flex items-center gap-2 text-[12px] font-medium text-[#2563EB] cursor-pointer hover:text-[#1D4ED8] transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            disabled={shortlistedCountries.length === 3 && !shortlistedCountries.includes(item.code)}
                                                            checked={shortlistedCountries.includes(item?.code)}
                                                            onChange={() => handleShortlist(item)}
                                                            className="h-4 w-4 rounded border-2 border-[#D1D5DB] text-orange-600 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer transition-all"
                                                        />
                                                        <span>Shortlist</span>
                                                    </label>

                                                    {/* BUTTONS */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigation(item?.code);
                                                            }}
                                                            className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-medium text-[#475467] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] transition-all duration-200"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCompare(item);
                                                            }}
                                                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-[12px] font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                                        >
                                                            Compare
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <CompareDrawer
                        open={openDrawer}
                        setOpen={setOpenDrawer}
                        countries={countries}
                        currentCountry={currentCountry}
                    />

                    {/* Mobile Cards */}
                    <div className="flex flex-col gap-4 p-4 lg:hidden">
                        {countries?.map((item, index) => {
                            const extra = item?.extra_content;
                            return (
                                <div
                                    key={item._id || index}
                                    className="rounded-2xl border border-[#EEF2F7] bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#2563EB]"
                                    onClick={() => navigation(item.code)}
                                >
                                    {/* Top */}
                                    <div className="flex gap-4">
                                        <img
                                            src={item?.flg}
                                            alt={item?.name}
                                            className="h-14 w-20 rounded-lg object-cover border-2 border-[#EEF2F7] shadow-sm"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="text-[15px] font-semibold text-[#1F2A5A]">
                                                        {item?.name}
                                                    </h3>
                                                    <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B7280]">
                                                        <span className="text-yellow-500">⭐</span>
                                                        <span className="font-medium">{extra?.rating || "4.5"}</span>
                                                    </div>
                                                </div>
                                                <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-[10px] font-semibold text-[#15803D] border border-[#BBF7D0] whitespace-nowrap">
                                                    High Match
                                                </span>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-[14px] font-semibold text-[#1F2A5A]">
                                                    {extra?.tuitionfee || "N/A"}
                                                </span>
                                                <span className="text-[10px] text-[#98A2B3] ml-1">per year</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Courses */}
                                    <div className="mt-4">
                                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                                            Top Courses
                                        </h4>
                                        <ul className="mt-2 space-y-1 text-[12px] text-[#475467]">
                                            {extra?.topcourse?.slice(0, 3)?.map((course, idx) => (
                                                <li key={idx} className="flex items-start gap-1.5">
                                                    <span className="text-[#2563EB] text-[8px] mt-1">●</span>
                                                    <span>{course}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Highlights */}
                                    <div className="mt-4">
                                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                                            Key Highlights
                                        </h4>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {extra?.keyHightlights?.slice(0, 3)?.map((highlight, idx) => (
                                                <span key={idx} className="rounded-full bg-[#F0FDF4] px-3 py-1 text-[10px] font-medium text-[#15803D] border border-[#DCFCE7]">
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                                                PSW
                                            </p>
                                            <p className="text-[13px] font-semibold text-[#1F2A5A] mt-0.5">
                                                {extra?.psw || "N/A"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-1.5 text-[12px] font-medium text-[#2563EB] cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={shortlistedCountries.includes(item?.code)}
                                                    onChange={() => handleShortlist(item)}
                                                    className="h-4 w-4 rounded border-2 border-[#D1D5DB] text-orange-600 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
                                                />
                                                <span>Shortlist</span>
                                            </label>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCompare(item);
                                                }}
                                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 text-white text-[12px] font-medium shadow-md"
                                            >
                                                Compare
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Loading & End State */}
                    <div ref={observerTarget} className="h-20 flex justify-center items-center border-t border-[#E8ECF4]">
                        {loading && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 rounded-full border-4 border-[#F26D44] border-t-transparent animate-spin" />
                                <p className="text-sm text-[#98A2B3]">Loading more countries...</p>
                            </div>
                        )}
                        {!hasMore && countries.length > 0 && (
                            <div className="flex flex-col items-center gap-1">
                                <div className="h-8 w-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#98A2B3]">
                                    ✓
                                </div>
                                <p className="text-sm text-[#98A2B3]">All {totalCountries} countries loaded</p>
                            </div>
                        )}
                    </div>
                </div>









            </div>

        </main>
    )
}