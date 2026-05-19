"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, MapPin, BookOpen, Calendar, DollarSign,
  GraduationCap, ChevronDown, Loader2, X, Check, ExternalLink,
  Award, Clock, Tag, Building2, Briefcase, FileText,
  MapPinCheck, Sparkles, Globe, Shield, TrendingUp,
  IndianRupeeIcon
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { ModernSelect } from "@/components/ui/select"
import Link from "next/link"
import { CreateApplicationModal } from "@/components/dashboard/applicationModel"
import { useSearchParams } from 'next/navigation';

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

interface Course {
  _id: string
  name: string
  slug: string
  university: {
    _id: string
    name: string
    slug: string
    city: string
    country: string
    uni_logo: string
    intakes?: string[]
  }
  category: {
    _id: string
    name: string
    slug: string
  }
  subject: {
    _id: string
    name: string
    slug: string
  }
  studyMode: string
  shortName: string
  tuitionFee: number
  currency: string
  level: string
  tags: string[]
  applicationFee: number
  duration: string
  status: string
  description: string
  createdAt: string
}

export default function CoursesPage() {
  // State management
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Filter options state
  const [countries, setCountries] = useState([])
  const [studyModes, setStudyModes] = useState([])
  const [levels, setLevels] = useState([])
  const [categories, setCategories] = useState([])
  const [universities, setUniversities] = useState([])

  const searchParams = useSearchParams();
  const university = searchParams.get('university') || ""

  // Filters state
  const [filters, setFilters] = useState({
    country: "",
    university: university || "",
    category: "",
    studyMode: "",
    level: "",
    minFee: "",
    maxFee: "",
    sort_by: "name",
    sort_order: "asc"
  })

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [countriesRes, uniRes, catRes] = await Promise.all([
        axiosInstance.get('/countries?limit=300'),
        axiosInstance.get('/universities/flat'),
        axiosInstance.get('/courses/categories?limit=100')
      ])
      const countriesData = countriesRes.data.data
      setCountries(countriesData.map((c: any) => ({ label: c.name, value: c.code })))

      const uniData = uniRes.data.data
      setUniversities(uniData.map((u: any) => ({ label: u.name, value: u._id })))

      const catData = catRes.data.data
      setCategories(catData.map((c: any) => ({ label: c.name, value: c._id })))

      setStudyModes([
        { label: "Full Time", value: "Full-time" },
        { label: "Part Time", value: "Part-time" },
        { label: "Online", value: "Online" },
        { label: "Hybrid", value: "Hybrid" }
      ])
      setLevels([
        { label: "Undergraduate", value: "Undergraduate" },
        { label: "Postgraduate", value: "Postgraduate" },
        { label: "PhD", value: "PhD" },
        { label: "Diploma", value: "Diploma" },
        { label: "Certificate", value: "Certificate" }
      ])
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }, [])

  // Fetch courses with debounced search
  const fetchCourses = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({
        page: currentPage.toString(),
        isExtra: 'false',
        limit: '12',
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(filters.country && { 'university.country': filters.country }),
        ...(filters.university && { university: filters.university }),
        ...(filters.category && { category: filters.category }),
        ...(filters.studyMode && { studyMode: filters.studyMode }),
        ...(filters.level && { level: filters.level }),
        ...(filters.sort_by && { sort_by: filters.sort_by }),
        ...(filters.sort_order && { sort_order: filters.sort_order })
      })

      const response = await axiosInstance.get(`/courses?${params}`)
      const data = response.data.result || response.data.data || []

      if (reset) {
        setCourses(data)
      } else {
        setCourses(prev => [...prev, ...data])
      }

      setHasMore(data.length === 12)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [page, debouncedSearchQuery, filters])

  // Initial fetch
  useEffect(() => {
    fetchFilterOptions()
  }, [fetchFilterOptions])

  // Fetch on search/filter changes
  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchCourses(true)
  }, [debouncedSearchQuery, filters])

  // Infinite scroll
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

  useEffect(() => {
    if (page > 1 && !loading) {
      fetchCourses(false)
    }
  }, [page, fetchCourses])

  // Filter handlers
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.country) count++
    if (filters.university) count++
    if (filters.category) count++
    if (filters.studyMode) count++
    if (filters.level) count++
    return count
  }

  const clearFilters = () => {
    setFilters({
      country: "",
      university: "",
      category: "",
      studyMode: "",
      level: "",
      minFee: "",
      maxFee: "",
      sort_by: "name",
      sort_order: "asc"
    })
    setSearchQuery("")
    setPage(1)
  }

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Get level badge color and gradient
  const getLevelStyles = (level: string) => {
    const styles = {
      'undergraduate': {
        gradient: 'from-blue-500/50 via-blue-400/5 to-transparent',
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <GraduationCap className="w-3.5 h-3.5" />
      },
      'postgraduate': {
        gradient: 'from-purple-500/10 via-purple-400/5 to-transparent',
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: <Award className="w-3.5 h-3.5" />
      },
      'phd': {
        gradient: 'from-emerald-500/10 via-emerald-400/5 to-transparent',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <TrendingUp className="w-3.5 h-3.5" />
      },
      'diploma': {
        gradient: 'from-orange-500/10 via-orange-400/5 to-transparent',
        badge: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <FileText className="w-3.5 h-3.5" />
      },
      'certificate': {
        gradient: 'from-teal-500/10 via-teal-400/5 to-transparent',
        badge: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: <Award className="w-3.5 h-3.5" />
      }
    }
    const key = level?.toLowerCase() || 'undergraduate'
    return styles[key as keyof typeof styles] || styles.undergraduate
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
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Find Your Dream Program
            </h1>
            <p className="text-gray-800 text-sm">
              Explore {courses.length}+ programs from top universities worldwide
            </p>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 z-1 -translate-y-1/2 w-5 h-5 text-gray-800" />
            <input
              type="text"
              placeholder="Search programs by name, university, or category..."
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

          {/* Filter Button */}
          <div className="relative" ref={filterButtonRef}>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 relative"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full animate-pulse">
                  {getActiveFilterCount()}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        Filter Programs
                      </h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-5 max-h-[50vh] overflow-y-auto">
                      {/* Country Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-800">
                          <Globe className="w-4 h-4" />
                          Country
                        </label>
                        <ModernSelect
                          options={countries}
                          value={filters.country}
                          onChange={(value) => handleFilterChange('country', value)}
                          placeholder="Select country"
                          className="w-full"
                        />
                      </div>

                      {/* University Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-800">
                          <Building2 className="w-4 h-4" />
                          University
                        </label>
                        <ModernSelect
                          options={universities}
                          value={filters.university}
                          onChange={(value) => handleFilterChange('university', value)}
                          placeholder="Select university"
                          className="w-full"
                        />
                      </div>

                      {/* Category Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-800">
                          <BookOpen className="w-4 h-4" />
                          Category
                        </label>
                        <ModernSelect
                          options={categories}
                          value={filters.category}
                          onChange={(value) => handleFilterChange('category', value)}
                          placeholder="Select category"
                          className="w-full"
                        />
                      </div>

                      {/* Study Mode Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-800">
                          <Briefcase className="w-4 h-4" />
                          Study Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {studyModes.map((mode) => (
                            <button
                              key={mode.value}
                              onClick={() => handleFilterChange('studyMode', filters.studyMode === mode.value ? '' : mode.value)}
                              className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${filters.studyMode === mode.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50 hover:bg-muted'
                                }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Level Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-800">
                          <GraduationCap className="w-4 h-4" />
                          Program Level
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {levels.map((level) => (
                            <button
                              key={level.value}
                              onClick={() => handleFilterChange('level', filters.level === level.value ? '' : level.value)}
                              className={`px-3 py-1.5 rounded-full border text-sm transition-all duration-200 ${filters.level === level.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50 hover:bg-muted'
                                }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Filters Display */}
                      {getActiveFilterCount() > 0 && (
                        <div className="pt-3 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {filters.country && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {countries.find(c => c.value === filters.country)?.label || filters.country}
                                <button onClick={() => handleFilterChange('country', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.studyMode && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.studyMode}
                                <button onClick={() => handleFilterChange('studyMode', '')}>
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.level && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.level}
                                <button onClick={() => handleFilterChange('level', '')}>
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
                        className="px-4 py-2 text-sm text-gray-800 hover:text-foreground transition-colors"
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
        {!loading && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-gray-800">
              Found <span className="font-semibold text-foreground">{courses.length}</span> programs
            </p>
          </motion.div>
        )}

        {/* Courses Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {loading ? (
            // Enhanced Skeleton Loading
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-32 bg-gradient-to-br from-muted to-muted/50"></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-muted rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-muted rounded"></div>
                      <div className="h-3 w-24 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-muted rounded-lg"></div>
                    <div className="h-12 bg-muted rounded-lg"></div>
                  </div>
                  <div className="h-10 bg-muted rounded-lg"></div>
                </div>
              </div>
            ))
          ) : courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-800" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No programs found</h3>
              <p className="text-gray-800">Try adjusting your search or filters to find what you're looking for</p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            courses.map((course, index) => {
              const levelStyles = getLevelStyles(course.level)
              return (
                <motion.div
                  key={course._id}
                  className={`group relative flex flex-col h-full bg-gradient-to-b ${levelStyles.gradient} border rounded-2xl overflow-hidden`}
                >
                  {/* Header Section with Gradient Background */}
                  <div className="p-6 px-4 relative flex flex-col flex-1">
                    {/* University Logo and Name */}

                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-4">
                        {course.university?.uni_logo ? (
                          <img
                            src={course.university?.uni_logo}
                            alt={course.university?.name}
                            className="w-20 h-auto max-h-16 object-fit bg-white shadow-lg border-2"
                          />
                        ) : (
                          <Building2 className="w-full h-full text-gray-800" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors">
                            {course.name}
                          </h3>
                          <p className="text-xs text-gray-800 truncate">
                            {course.university?.name}
                          </p>
                          <p className="text-xs text-gray-800 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{course.university?.city}, {course.university?.country}</span>
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {course.description && (
                        <p className="text-foreground/80 text-sm mb-4 line-clamp-2" title={course.description}>
                          {course.description}
                        </p>
                      )}

                      {/* Key Details Grid */}
                      <div className="space-y-1 mb-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-800">
                            <IndianRupeeIcon className="w-4 h-4" />
                            Tuition Fee
                          </span>
                          <span className="font-medium">
                            {formatCurrency(course.tuitionFee || 0, course.currency)}
                            <span className="text-xs text-gray-800 ml-1">/year</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-800">
                            <Clock className="w-4 h-4" />
                            Duration
                          </span>
                          <span className="font-medium">
                            {course.duration || 'N/A'}
                            {/* <span className="text-xs text-gray-800 ml-1">full time</span> */}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-800">
                            <FileText className="w-4 h-4" />
                            Application Fee
                          </span>
                          <span className="font-medium">
                            {formatCurrency(course.applicationFee || 0, course.currency)}
                            {/* <span className="text-xs text-gray-800 ml-1">one-time</span> */}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {course.studyMode && (
                          <div className="mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-full text-xs font-medium border border-border/50">
                              <Briefcase className="w-3 h-3" />
                              {course.studyMode}
                            </span>
                          </div>
                        )}

                        {/* Category */}
                        {course.category?.name && (
                          <div className="mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 rounded-full text-xs font-medium text-primary">
                              <BookOpen className="w-3 h-3" />
                              {course.category.name}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Study Mode Badge */}


                      {/* Tags */}
                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {course.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-muted/50 rounded-full text-xs text-gray-800 border border-border/50"
                            >
                              <Tag className="w-3 h-3 inline mr-1" />
                              {tag}
                            </span>
                          ))}
                          {course.tags.length > 3 && (
                            <span className="px-2 py-0.5 bg-muted/50 rounded-full text-xs text-gray-800 border border-border/50">
                              +{course.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Intakes */}
                      {course.university?.intakes && course.university.intakes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Intakes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {course.university.intakes.slice(0, 3).map((intake, index) => (
                              <span
                                key={index}
                                className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium"
                              >
                                📅 {intake}
                              </span>
                            ))}
                            {course.university.intakes.length > 3 && (
                              <span className="text-xs px-2.5 py-1 bg-muted text-gray-800 rounded-full">
                                +{course.university.intakes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>


                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-auto">
                      <Link
                        href={`/dashboard/programs/${course.slug}`}
                        className="flex-1 p-2 lg:px-4 lg:py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-center text-sm group-hover:scale-[1.02]"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedCourse(course)
                          setIsModalOpen(true)
                        }}
                        className="flex-1 p-2 lg:px-4 lg:py-2.5 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium text-sm group-hover:scale-[1.02]"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 pointer-events-none ${hoveredCard === course._id ? 'opacity-100' : ''}`} />
                </motion.div>
              )
            })
          )}
        </motion.div>

        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="py-8">
          {loadingMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-3 text-sm text-gray-800">Loading more programs...</p>
            </motion.div>
          )}
          {!hasMore && courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >

              <p className="text-gray-800">You've explored all programs</p>
              <p className="text-sm text-gray-800/70 mt-1">
                Showing {courses.length} programs
              </p>
            </motion.div>
          )}
        </div>

        {/* Application Modal */}
        <CreateApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApplicationCreated={() => {
            // Refresh applications list or show success message
          }}
          program={selectedCourse}
        />
      </div>
    </main>
  )
}