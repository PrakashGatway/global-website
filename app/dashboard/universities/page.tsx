"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, MapPin, Globe, Users, Star, Building, ChevronDown, Loader2, BookOpen, Calendar, DollarSign, Award, GraduationCap, X, Check, ExternalLink, TrendingUp, Clock, Shield, Sparkles } from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import AmazingSelect, { ModernSelect } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
// import { useSearchParams } from "next/navigation"

interface University {
  _id: string
  name: string
  slug: string
  slogan: string
  uni_type: string
  intakes: string | string[]
  short_description: string
  code: string
  address: string
  country: string
  city: string
  uni_logo: string
  cover_photo: string
  uni_web: string
  uni_rank: string | number
  established_year: number
  on_campus_accommodation: boolean
  off_campus_accommodation: boolean
  status: string
  acceptanceRate: number
  tags: string
  offers: string
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function UniversitiesPage() {
  // State management
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const [countries, setCountries] = useState([])
  const filterButtonRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const search =  "" //useSearchParams().get("country") ||

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isClickInsideSelect = event.target instanceof Element && (
        event.target.closest('[data-radix-select-content]') ||
        event.target.closest('[data-headlessui-state="open"]') ||
        event.target.closest('[role="listbox"]') ||
        event.target.closest('.select-dropdown')
      )

      if (filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node) &&
        !isClickInsideSelect) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filters state
  const [filters, setFilters] = useState({
    country: search || "",
    city: "",
    uni_type: "",
    has_accommodation: "",
    min_acceptance_rate: "",
    max_acceptance_rate: "",
    sort_by: "name",
    sort_order: "asc"
  })

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/countries?limit=300')
      const data = response.data.data
      let formatData = data.map((country: any) => ({ label: country.name, value: country.code }))
      setCountries(formatData)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }, [])

  useEffect(() => {
    fetchCountries()
  }, [fetchCountries])

  // Fetch universities with debounced search
  const fetchUniversities = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '8',
        ...(debouncedSearchQuery && { name: debouncedSearchQuery }),
        ...(filters.country && { country: filters.country }),
        ...(filters.sort_by && { sort_by: filters.sort_by }),
        ...(filters.city && { city: filters.city }),
        ...(filters.uni_type && { type: filters.uni_type })
      })

      const response = await axiosInstance.get(`/universities?${params}`)
      const data = response.data.result

      if (reset) {
        setUniversities(data || [])
      } else {
        setUniversities(prev => [...prev, ...(data || [])])
      }

    //       "page": 1,
    // "totalPages": 2,
      setHasMore(response.data.page < response.data.totalPages || false)
    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [page, debouncedSearchQuery, filters])

  // Initial fetch and reset on filter changes
  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchUniversities(true)
  }, [debouncedSearchQuery, filters])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => prev + 1)
          setLoadingMore(true)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loadingMore, loading])

  // Load more when page changes
  useEffect(() => {
    if (page > 1 && !loading) {
      fetchUniversities(false)
    }
  }, [page, fetchUniversities])

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPage(1)
  }

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.uni_type) count++;
    if (filters.has_accommodation) count++;
    if (filters.min_acceptance_rate) count++;
    if (filters.max_acceptance_rate) count++;
    return count;
  }

  const activeFilterCount = getActiveFilterCount()

  const clearFilters = () => {
    setFilters({
      country: "",
      city: "",
      uni_type: "",
      has_accommodation: "",
      min_acceptance_rate: "",
      max_acceptance_rate: "",
      sort_by: "name",
      sort_order: "asc"
    })
    setSearchQuery("")
    setPage(1)
  }

  const getCardGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case 'public': return 'from-blue-500/10 via-blue-400/5 to-transparent'
      case 'private': return 'from-purple-500/10 via-purple-400/5 to-transparent'
      case 'government': return 'from-emerald-500/10 via-emerald-400/5 to-transparent'
      default: return 'from-gray-500/10 via-gray-400/5 to-transparent'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'public': return <Building className="w-4 h-4" />
      case 'private': return <Shield className="w-4 h-4" />
      default: return <GraduationCap className="w-4 h-4" />
    }
  }

  const formatRank = (rank: string | number) => {
    if (!rank || rank === 'N/A') return 'Unranked'
    return `#${rank}`
  }

  const getAcceptanceRateColor = (rate: number) => {
    if (rate >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (rate >= 40) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-rose-600 bg-rose-50 border-rose-200'
  }

  const getAcceptanceRateLabel = (rate: number) => {
    if (rate >= 70) return 'Open Admission'
    if (rate >= 40) return 'Moderate'
    return 'Selective'
  }

  return (
    <main className="flex-1 overflow-y-auto max-w-7xl mx-auto px-4">
      <div className="space-y-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-6 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Find Your Dream University
            </h1>
            <p className="text-muted-foreground text-sm">
              Explore {universities.length}+ prestigious universities worldwide
            </p>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 z-1" />
            <input
              type="text"
              placeholder="Search universities by name, country, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background/50 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          <div className="relative" ref={filterButtonRef}>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 relative"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full animate-pulse">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        Filters
                      </h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
                      {/* Country Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                          <Globe className="w-4 h-4" />
                          Country
                        </label>
                        <ModernSelect
                          options={countries}
                          value={filters.country}
                          onChange={(value) => handleFilterChange('country', value)}
                          placeholder="Select country"
                          className="py-0"
                        />
                      </div>

                      {/* University Type Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                          <GraduationCap className="w-4 h-4" />
                          University Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'public', label: 'Public', icon: <Building className="w-4 h-4" /> },
                            { value: 'private', label: 'Private', icon: <Shield className="w-4 h-4" /> }
                          ].map((type) => (
                            <button
                              key={type.value}
                              onClick={() => handleFilterChange('uni_type', filters.uni_type === type.value ? '' : type.value)}
                              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${filters.uni_type === type.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50 hover:bg-muted'
                                }`}
                            >
                              {type.icon}
                              <span className="text-sm">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Filters */}
                      {activeFilterCount > 0 && (
                        <div className="pt-2 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {filters.country && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.country}
                                <button onClick={() => handleFilterChange('country', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.uni_type && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.uni_type}
                                <button onClick={() => handleFilterChange('uni_type', '')}>
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 p-4 border-t border-border bg-muted/30">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Count */}
        {!loading && universities.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{universities.length}</span> universities
            </p>
          </motion.div>
        )}

        {/* University Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-br from-muted to-muted/50"></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded"></div>
                        <div className="h-3 w-24 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-16 bg-muted rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-12 bg-muted rounded-lg"></div>
                    <div className="h-12 bg-muted rounded-lg"></div>
                    <div className="h-12 bg-muted rounded-lg"></div>
                  </div>
                  <div className="h-10 bg-muted rounded-lg"></div>
                </div>
              </div>
            ))
          ) : universities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No universities found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for</p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            universities.map((uni, index) => (
              <motion.div
                key={uni._id}
                className={`relative flex flex-col h-full bg-gradient-to-br ${getCardGradient(uni.uni_type)} border rounded-3xl overflow-hidden`}
              >

                {/* Cover Image */}
                <div className="relative h-30 overflow-hidden">
                  {uni.cover_photo ? (
                    <img
                      src={uni.cover_photo}
                      alt={uni.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                  {/* Rank Badge */}
                  {/* <div className="absolute top-3 right-3">
                    <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20">
                      {formatRank(uni.uni_rank)}
                    </div>
                  </div> */}
                </div>

                <div className="p-3 relative flex flex-col flex-1">
                  {/* Logo and Header */}
                  <div className="flex items-start justify-between -mt-12 mb-4 relative">
                    <div className="flex items-center gap-1">
                      {/* <div className="w-32 h-10 rounded-xl bg-white shadow-lg border-2 border-background p-2 transform transition-transform duration-300 group-hover:scale-105"> */}
                      {uni.uni_logo ? (
                        <img
                          src={uni.uni_logo}
                          alt={uni.name}
                          className="w-20 h-auto max-h-10 object-fit bg-white shadow-lg border-2"
                        />
                      ) : (
                        <Building className="w-28 h-28 text-muted-foreground" />
                      )}
                      {/* </div> */}
                      <div>
                        <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">
                          {uni.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {uni.city}, {uni.country}
                          {uni.uni_web && (
                            <a
                              href={uni.uni_web}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all duration-300 group-hover:scale-[1.02]"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  {/* <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${uni.uni_type === 'public' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        uni.uni_type === 'private' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                          'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                      {getTypeIcon(uni.uni_type)}
                      {uni.uni_type}
                    </span>
                  </div> */}
                  <div className="relative flex flex-col flex-1">
                    {/* Slogan */}
                    {uni.slogan && (
                      <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">
                        "{uni.slogan}"
                      </p>
                    )}

                    {/* Description */}
                    <p
                      className="text-foreground/80 text-[13px] mb-2 line-clamp-3"
                      title={uni.short_description || "No description available."}
                    >
                      {uni.short_description || "No description available."}
                    </p>

                    {/* Stats Grid */}
                    {/* <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-muted/30 rounded-lg p-2.5 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Established</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {uni.established_year || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2.5 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Acceptance Rate</p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getAcceptanceRateColor(uni.acceptanceRate)}`}>
                          {uni.acceptanceRate || 'N/A'}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getAcceptanceRateLabel(uni.acceptanceRate)}
                        </span>
                      </div>
                    </div>
                  </div> */}

                    {/* Intakes */}
                    {uni.intakes && uni.intakes.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Intakes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {uni.intakes.slice(0, 3).map((intake, index) => (
                            <span
                              key={index}
                              className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium"
                            >
                              {intake}
                            </span>
                          ))}
                          {uni.intakes.length > 3 && (
                            <span className="text-xs px-2.5 py-1 bg-muted text-muted-foreground rounded-full">
                              +{uni.intakes.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Accommodation */}
                    {(uni.on_campus_accommodation || uni.off_campus_accommodation) && (
                      <div className="flex items-center gap-3 mb-4">
                        {uni.on_campus_accommodation && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <Check className="w-3 h-3" />
                            On Campus
                          </span>
                        )}
                        {uni.off_campus_accommodation && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            <Check className="w-3 h-3" />
                            Off Campus
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {uni.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {uni.tags.split(',').slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-muted/50 rounded-full text-xs text-muted-foreground border border-border/50"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-end gap-2 pt-1 mt-auto h-full justify-end">
                    <Link
                      href={`/dashboard/universities/${uni?.slug}`}
                      className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-center group-hover:scale-[1.02]"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/dashboard/programs?university=${uni._id}`}
                      className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-center group-hover:scale-[1.02]"
                    >
                      Apply
                    </Link>

                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 pointer-events-none ${hoveredCard === uni._id ? 'opacity-100' : ''}`} />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="py-8">
          {loadingMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Loading more universities...</p>
            </motion.div>
          )}
          {!hasMore && universities.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-muted-foreground">You've explored all universities</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Showing {universities.length} universities
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}