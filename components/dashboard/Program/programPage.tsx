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

import ProgramHeader from "./programHeader"
import ProgramFilters from "./programFilter"

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

  console.log(filters)

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
    <ProgramHeader searchQuery ={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Search & Filter Bar */}
        {/* <div className="flex flex-col sm:flex-row gap-4">
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

       
        </div> */}

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
       <div className="flex flex-col lg:flex-row gap-6 items-start">
  {/* ================= LEFT SIDEBAR: FILTERS ================= */}
 <ProgramFilters
  filters={filters}
  handleFilterChange={handleFilterChange}
  clearFilters={clearFilters}
  getActiveFilterCount={getActiveFilterCount}
  countries={countries}
  universities={universities}
  categories={categories}
  studyModes={studyModes}
  levels={levels}
  showFilters={showFilters}
  setShowFilters={setShowFilters}
/>

  {/* ================= RIGHT CONTENT: COURSE GRID ================= */}
  <div className="flex-1 w-full">
    <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -8 }}
        className="group relative"
      >
        {/* Main Card Container - Glass morphism effect */}
        <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/80  overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-primary/30">
          
          {/* Premium Gradient Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
          
          {/* Content Wrapper */}
          <div className="p-6">
            
            {/* University & Course Header */}
            <div className="flex gap-4 mb-5">
              {/* Logo Container with Glass Effect */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl" />
                <div className="relative w-20 h-20 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center p-2 transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/20">
                  {course.university?.uni_logo ? (
                    <img
                      src={course.university?.uni_logo}
                      alt={course.university?.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="font-bold text-lg line-clamp-2 text-gray-900 group-hover:text-primary transition-colors duration-300 mb-1">
                  {course.name}
                </h3>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {course.university?.name}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary/70" />
                  <p className="text-xs text-gray-600 truncate">
                    {course.university?.city}, {course.university?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Description with Enhanced Styling */}
            {course.description && (
              <div className="relative mb-5">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 to-primary/10 rounded-full" />
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 pl-3" title={course.description}>
                  {course.description}
                </p>
              </div>
            )}

            {/* Key Details - Modern Card Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {/* Tuition Fee */}
              <div className="bg-gradient-to-br from-blue-50/50 to-transparent rounded-xl p-2.5 border border-blue-100/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <IndianRupeeIcon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-gray-600">Tuition</span>
                </div>
                <p className="font-bold text-primary-dark text-sm">
                  {formatCurrency(course.tuitionFee || 0, course.currency)}
                </p>
                <p className="text-xs text-gray-500">/year</p>
              </div>

              {/* Duration */}
              <div className="bg-gradient-to-br from-purple-50/50 to-transparent rounded-xl p-2.5 border border-purple-100/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-600">Duration</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">
                  {course.duration || 'N/A'}
                </p>
              </div>

              {/* Application Fee */}
              <div className="bg-gradient-to-br from-emerald-50/50 to-transparent rounded-xl p-2.5 border border-emerald-100/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-medium text-gray-600">App. Fee</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">
                  {formatCurrency(course.applicationFee || 0, course.currency)}
                </p>
              </div>
            </div>

            {/* Study Mode & Category Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {course.studyMode && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-blue-600/5 rounded-xl text-xs font-semibold text-blue-700 border border-blue-200/50">
                  <Briefcase className="w-3.5 h-3.5" />
                  {course.studyMode}
                </span>
              )}

              {course.category?.name && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl text-xs font-semibold text-primary border border-primary/20">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.category.name}
                </span>
              )}
            </div>

            {/* Tags with Modern Styling */}
            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {course.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-gray-100/80 rounded-lg text-xs text-gray-700 border border-gray-200 font-medium hover:bg-gray-200/80 transition-colors cursor-default"
                  >
                    <Tag className="w-3 h-3 inline mr-1 text-gray-500" />
                    {tag}
                  </span>
                ))}
                {course.tags.length > 3 && (
                  <span className="px-2.5 py-1 bg-gray-100/80 rounded-lg text-xs text-gray-600 border border-gray-200 font-medium">
                    +{course.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Intakes with Premium Design */}
            {course.university?.intakes && course.university.intakes.length > 0 && (
              <div className="mb-5 p-3 bg-gradient-to-r from-amber-50/40 to-transparent rounded-xl border border-amber-100/50">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Upcoming Intakes
                </p>
                <div className="flex flex-wrap gap-2">
                  {course.university.intakes.slice(0, 3).map((intake, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-amber-600/5 text-amber-700 rounded-full font-medium border border-amber-200/50"
                    >
                      📅 {intake}
                    </span>
                  ))}
                  {course.university.intakes.length > 3 && (
                    <span className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full font-medium border border-gray-200">
                      +{course.university.intakes.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons - Modern Design */}
            <div className="flex items-center gap-3 mt-2">
              <Link
                href={`/dashboard/programs/${course.slug}`}
                className="flex-1 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="relative px-4 py-2.5 bg-primary rounded-xl text-white font-semibold text-sm text-center transition-all duration-300 group-hover/btn:shadow-lg group-hover/btn:scale-[1.02]">
                  View Details
                </div>
              </Link>
              
              <button
                onClick={() => {
                  setSelectedCourse(course)
                  setIsModalOpen(true)
                }}
                className="flex-1 px-4 py-2.5 bg-transparent border-2 border-primary/30 text-primary rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:scale-[1.02]"
              >
                Apply Now →
              </button>
            </div>
          </div>

          {/* Hover Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          {/* Subtle Border Glow on Hover */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none group-hover:shadow-[0_0_0_2px_rgba(37,99,235,0.2)] transition-shadow duration-300" />
        </div>
      </motion.div>
    )
  })
)}
    </motion.div>
  </div>
</div>

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