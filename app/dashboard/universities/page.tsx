"use client"

import { useState, useEffect, useRef, useCallback, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, MapPin, Globe, Users, Star, Building, ChevronDown, Loader2, BookOpen, Calendar, DollarSign, Award, GraduationCap, X, Check, ExternalLink } from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import AmazingSelect, { ModernSelect } from "@/components/ui/select"
import Link from "next/link"

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
    transition: { duration: 0.5 },
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
  // Add these inside your component
  const filterButtonRef = useRef(null);

  // Handle click outside
// Update your click outside handler to ignore clicks inside the select dropdown
useEffect(() => {
  function handleClickOutside(event) {
    // Check if click is inside any select dropdown
    const isClickInsideSelect = event.target.closest('[data-radix-select-content]') || 
                                event.target.closest('[data-headlessui-state="open"]') ||
                                event.target.closest('[role="listbox"]') ||
                                event.target.closest('.select-dropdown');
    
    if (filterButtonRef.current && 
        !filterButtonRef.current.contains(event.target) && 
        !isClickInsideSelect) {
      setShowFilters(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  // Filters state
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    uni_type: "",
    has_accommodation: "",
    min_acceptance_rate: "",
    max_acceptance_rate: "",
    sort_by: "name",
    sort_order: "asc"
  })

  // Extract unique values for filter options
  const [filterOptions, setFilterOptions] = useState({
    countries: [] as string[],
    cities: [] as string[],
    uni_types: [] as string[]
  })

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/countries?limit=300')
      const data = response.data.data
      let formatData = data.map(country => ({ label: country.name, value: country.code }))
      setCountries(formatData)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  })

  useEffect(() => {
    fetchCountries()
  },[])
  // Fetch universities
  const fetchUniversities = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchQuery && { name: searchQuery }),
        ...(filters.country && { country: filters.country }),
        ...(filters.sort_by && { sort_by: filters.sort_by }),
        ...(filters.sort_order && { sort_order: filters.sort_order })
      })

      const response = await axiosInstance.get(`/universities?${params}`)
      const data = response.data.result

      if (reset) {
        setUniversities(data || [])
      } else {
        setUniversities(prev => [...prev, ...(data || [])])
      }

      setHasMore(data.hasMore || false)
    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [page, searchQuery, filters])



  // Initial fetch and reset on filter changes
  useEffect(() => {
    setLoading(true)
    fetchUniversities(true)
  }, [searchQuery, filters])

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
  }, [page])

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPage(1)
  }
  // Add this to your component
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.uni_type) count++;
    if (filters.has_accommodation) count++;
    if (filters.min_acceptance_rate) count++;
    if (filters.max_acceptance_rate) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  // Clear all filters
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

  // Calculate card colors based on university type
  const getCardColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'public': return 'from-blue-500/10 to-blue-600/5 border-blue-200'
      case 'private': return 'from-purple-500/10 to-purple-600/5 border-purple-200'
      case 'government': return 'from-green-500/10 to-green-600/5 border-green-200'
      default: return 'from-gray-500/10 to-gray-600/5 border-gray-200'
    }
  }

  // Format university rank
  const formatRank = (rank: string | number) => {
    if (!rank || rank === 'N/A') return 'Rank: N/A'
    return `#${rank}`
  }

  // Get acceptance rate color
  const getAcceptanceRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600 bg-green-100'
    if (rate >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="sm:p-6 space-y-4">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Find Your Dream University</h1>
              <p className="text-muted-foreground text-dm">
                Explore {universities.length}+ universities worldwide
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="flex gap-4">
          <motion.div
            variants={itemVariants}
            className="relative w-full flex-1"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search universities by name, country, or city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full pl-12 pr-4 py-2.5 border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
          {/* <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4" />
              Sort By
            </label>
            <div className="">
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="name">Name</option>
                <option value="rank">Rank</option>
                <option value="acceptanceRate">Acceptance Rate</option>
                <option value="established_year">Established Year</option>
              </select>
              <button
                onClick={() => handleFilterChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {filters.sort_order === 'asc' ? 'A→Z' : 'Z→A'}
              </button>
            </div>
          </div> */}

          {/* Filter Button with Position Reference */}
          <div className="relative " ref={filterButtonRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors relative"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Drawer - Positioned relative to button */}
            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed inset-0 z-40"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                    style={{
                      transformOrigin: 'top right',
                    }}
                  >
                    <div className="flex items-center justify-between p-4 py-3 border-b border-border">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                      </h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-sm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Drawer Content */}
                    <div className="p-4 space-y-4">
                      {/* Type Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Country
                        </label>
                        {/* <select
                          value={filters.country}
                          onChange={(e) => handleFilterChange('country', e.target.value)}
                          className="w-full text-sm px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">All Countries</option>
                          {countries?.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select> */}
                        <ModernSelect
                          // label="Type"
                          options={countries}
                          value={filters.country}
                          onChange={(value) => setFilters(prev => ({ ...prev, country: value }))}
                          placeholder="Select country"
                          className="py-0"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Type
                        </label>
                        
                        <ModernSelect
                          // label="Type"
                          options={[
                            { value: 'public', label: 'Public University' },
                            { value: 'private', label: 'Private University' },
                            { value: 'ivy', label: 'Ivy League' },
                            { value: 'technical', label: 'Technical Institute' },
                            { value: 'liberal', label: 'Liberal Arts College' },
                          ]}
                          value={filters.uni_type}
                          onChange={(value) => setFilters(prev => ({ ...prev, uni_type: value }))}
                          placeholder="Select type"
                          className="py-0"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Accommodation
                        </label>
                        <ModernSelect
                          // label="Type"
                          options={[
                            { value: 'Any', label: 'Any' },
                            { value: 'on_campus', label: 'On Campus' },
                            { value: 'off_campus', label: 'Off Campus' },
                            { value: 'both', label: 'Both' }
                          ]}
                          value={filters.has_accommodation}
                          onChange={(value) => setFilters(prev => ({ ...prev, has_accommodation: value }))}
                          placeholder="Select type"
                          className="py-0"
                        />
                      </div>

                      {/* Active Filters Display */}
                      {activeFilterCount > 0 && (
                        <div className="pt-2 border-t border-border">
                          <div className="flex flex-wrap gap-1.5">
                            {filters.country && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.country}
                                <button onClick={() => handleFilterChange('country', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.uni_type && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                                Type: {filters.uni_type}
                                <button onClick={() => handleFilterChange('uni_type', '')}>
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.has_accommodation && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                                Mode: {filters.has_accommodation}
                                <button onClick={() => handleFilterChange('has_accommodation', '')}>
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-2 p-4 py-3 border-t border-border bg-muted/20">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>


        {/* University Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6"
          variants={containerVariants}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-muted rounded-xl mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 flex-1 bg-muted rounded"></div>
                  <div className="h-8 flex-1 bg-muted rounded"></div>
                </div>
              </div>
            ))
          ) : universities.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No universities found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            universities.map((uni, index) => (
              <motion.div
                key={uni._id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`group relative bg-gradient-to-br ${getCardColor(uni.uni_type)} border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10`}
              >
                {/* University Card */}
                <div className="p-6">
                  {/* Header with logo and rank */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-30 h-16 rounded-xl bg-white p-2 shadow-lg border">
                        {uni.uni_logo ? (
                          <img
                            src={uni.uni_logo}
                            alt={uni.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building className="w-full h-full text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-base line-clamp-1">{uni.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {uni.city}, {uni.country}
                        </p>
                      </div>
                    </div>
                    {/* <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold border">
                        {formatRank(uni.uni_rank)}
                      </span>
                    </div> */}
                  </div>

                  {/* Slogan */}
                  {uni.slogan && (
                    <p className="text-xs text-muted-foreground italic mb-4 line-clamp-2">
                      "{uni.slogan}"
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-foreground/80 text-sm mb-3 line-clamp-3">
                    {uni.short_description || "No description available."}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium">{uni.uni_type}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Established</p>
                      <p className="font-medium">{uni.established_year || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Acceptance</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAcceptanceRateColor(uni.acceptanceRate)}`}>
                        {uni.acceptanceRate || 'N/A'}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Offers</p>
                      <p className="font-medium">{uni.offers || '0'}</p>
                    </div>
                  </div>
                  {/* {uni?.uni_rank?.map((item, index) => (
                    <div key={index} className="border p-2 mb-2 rounded">
                      <h6>{item.type}</h6>
                      <p>Rank: {item.rank}</p>
                      <p>Year: {item.year}</p>
                    </div>
                  ))} */}

                  {/* Accommodation Info */}
                  <div className="flex items-center gap-4">
                    {uni.on_campus_accommodation && (
                      <span className="inline-flex items-center gap-1 py-2 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        On Campus
                      </span>
                    )}
                    {uni.off_campus_accommodation && (
                      <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                        <Check className="w-4 h-4" />
                        Off Campus
                      </span>
                    )}
                  </div>
                  <span className="block text-sm font-semibold">Intakes</span>
                  <div className="flex gap-2 flex-wrap py-2">

                    {uni.intakes && uni.intakes?.map((intake, index) =>
                      <div key={index} className=" text-xs px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full font-medium">
                        📅 {intake}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {uni.tags && (
                    <div className="flex flex-wrap gap-2 mb-2 mt-2">
                      {uni.tags.split(',').slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-white/50 backdrop-blur-sm rounded-lg text-xs font-medium border"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <Link  href={`/dashboard/universities/${uni?.slug}`} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      View Details
                    </Link>
                    {uni.uni_web && (
                      <a
                        href={uni.uni_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Intakes Badge */}

              </motion.div>
            ))
          )}
        </motion.div>

        {/* Load More / Infinite Scroll */}
        <div ref={observerTarget} className="py-8">
          {loadingMore && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">Loading more universities...</p>
            </div>
          )}
          {!hasMore && universities.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">You've reached the end of the list</p>
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