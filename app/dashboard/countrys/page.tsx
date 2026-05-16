"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Globe, Search, Filter, ChevronRight, Star, Users,
    University, Calendar, MapPin, Heart, Loader2,
    Grid3x3, List, ChevronLeft, X, DollarSign,
    TrendingUp, BookOpen, Award, Shield, Compass
} from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/app/axiosInstance"

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
            onClick={() => router.push(`/dashboard/countrys/${country.code}?tab=visa`)}
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
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium shadow-lg ${
                        country.status === 'Active' 
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
            className={`p-2 rounded-lg transition-all duration-200 ${
                view === 'grid' 
                    ? 'bg-white text-[#F26D44] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            <Grid3x3 className="w-5 h-5" />
        </button>
        <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all duration-200 ${
                view === 'list' 
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

    const limit = 12

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
            
            const response = await axiosInstance.get(`/countries?${params}`)
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                                <Globe className="w-8 h-8 text-[#F26D44]" />
                                Visa Guide
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Explore countries and check the visa information
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* <ViewToggle view={viewMode} setView={setViewMode} /> */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-xl transition-all duration-200 flex gap-2 items-center ${
                                    showFilters || hasActiveFilters
                                        ? 'bg-[#F26D44] text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Filter className="w-5 h-5" /> Filter
                            </button>
                        </div>
                    </div>
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
                {loading ? (
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
                )}

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
                                        className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                                            currentPage === pageNum
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

                {/* Quick Stats Footer */}
                {!loading && countries.length > 0 && (
                    <div className="mt-12 p-6 bg-gradient-to-r from-[#F26D44]/10 to-[#F26D44]/5 rounded-2xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <Globe className="w-8 h-8 text-[#F26D44] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{totalCountries}</p>
                                <p className="text-sm text-gray-600">Countries</p>
                            </div>
                            <div>
                                <University className="w-8 h-8 text-[#F26D44] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">
                                    {countries.reduce((acc, c) => acc + (c.universities || 0), 0).toLocaleString()}+
                                </p>
                                <p className="text-sm text-gray-600">Universities</p>
                            </div>
                            <div>
                                <Users className="w-8 h-8 text-[#F26D44] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">50K+</p>
                                <p className="text-sm text-gray-600">International Students</p>
                            </div>
                            <div>
                                <Award className="w-8 h-8 text-[#F26D44] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">Top Ranked</p>
                                <p className="text-sm text-gray-600">Universities</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}