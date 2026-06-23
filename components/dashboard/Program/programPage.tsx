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
  const [isCleared, setIsCleared] = useState(false);

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

  console.log(universities)

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
    setIsCleared(true)
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
    <main className="flex-1 overflow-y-auto  px-4">


      <div className="space-y-4">

        {/* Hero Section */}
            
        <ProgramHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} countries={countries} course={courses}/>

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
            <p className="text-base text-gray-800">
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
            isCleared={isCleared}
            setIsCleared={setIsCleared}
          />

          {/* ================= RIGHT CONTENT: COURSE GRID ================= */}
         <div className="flex-1 w-full">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {loading ? (
      // Compact Skeleton Loading
      Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 bg-gray-100 rounded"></div>
                <div className="h-3 w-20 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 rounded"></div>
              <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-16 bg-gray-100 rounded-lg"></div>
              <div className="h-16 bg-gray-100 rounded-lg"></div>
              <div className="h-16 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="h-9 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      ))
    ) : courses.length === 0 ? (
      <div className="col-span-full text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No programs found</h3>
        <p className="text-gray-500 text-base">Try adjusting your search or filters</p>
        <button
          onClick={clearFilters}
          className="mt-5 px-5 py-2 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/90 transition-colors"
        >
          Clear all filters
        </button>
      </div>
    ) : (
      courses.map((course, index) => {
        const levelStyles = getLevelStyles(course.level);
        return (
          <div
            key={course._id}
            className="fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Compact Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:border-primary hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">
              
              {/* Header */}
              <div className="flex gap-3 mb-3">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {course.university?.uni_logo ? (
                    <img
                      src={course.university?.uni_logo}
                      alt={course.university?.name}
                      className="w-14 h-14 object-contain border border-gray-200 rounded-lg p-1.5 bg-gray-50"
                    />
                  ) : (
                    <div className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-tight mb-0.5">
                    {course.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 truncate mb-1">
                    {course.university?.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-500 truncate">
                      {course.university?.city}, {course.university?.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {course.description && (
                <div className="mb-3">
                  <div className="w-6 h-0.5 bg-primary rounded-full mb-1.5"></div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2" title={course.description}>
                    {course.description}
                  </p>
                </div>
              )}

              {/* Key Details - Compact Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {/* Tuition Fee */}
                <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[11px] font-medium text-gray-500">Tuition</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">
                    {course.tuitionFee || 0 + course.currency}
                  </p>
                  <p className="text-[10px] text-gray-400">/year</p>
                </div>

                {/* Duration */}
                <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[11px] font-medium text-gray-500">Duration</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {course.duration || 'N/A'}
                  </p>
                </div>

                {/* Application Fee */}
                <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[11px] font-medium text-gray-500">App. Fee</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {course.applicationFee || 0 + course.currency}
                  </p>
                </div>
              </div>

              {/* Study Mode & Category - Compact */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {course.studyMode && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium border border-blue-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {course.studyMode}
                  </span>
                )}

                {course.category?.name && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-[11px] font-medium border border-primary/20">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {course.category.name}
                  </span>
                )}
              </div>

              {/* Tags - Compact */}
              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {course.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium border border-gray-200"
                    >
                      <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                  {course.tags.length > 2 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium border border-gray-200">
                      +{course.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Intakes - Compact */}
              {course.university?.intakes && course.university.intakes.length > 0 && (
                <div className="mb-3 p-2 bg-amber-50 rounded-md border border-amber-200">
                  <div className="flex items-center gap-1 mb-1.5">
                    <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[11px] font-semibold text-gray-700">Intakes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {course.university.intakes.slice(0, 2).map((intake, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium"
                      >
                        {intake}
                      </span>
                    ))}
                    {course.university.intakes.length > 2 && (
                      <span className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                        +{course.university.intakes.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons - Compact */}
              <div className="flex items-center gap-2 mt-auto pt-1">
                <a
                  href={`/dashboard/programs/${course.slug}`}
                  className="flex-1 text-center px-3 py-1.5 bg-primary text-white rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary/90"
                >
                  View Details
                </a>

                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-transparent border border-primary/40 text-primary rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary hover:text-white"
                >
                  Apply
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <style jsx>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(15px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              .fade-in-up {
                opacity: 0;
                animation: fadeInUp 0.4s ease forwards;
              }
            `}</style>
          </div>
        );
      })
    )}
  </div>
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
              <p className="mt-3 text-base text-gray-800">Loading more programs...</p>
            </motion.div>
          )}
          {!hasMore && courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >

              <p className="text-gray-800">You've explored all programs</p>
              <p className="text-base text-gray-800/70 mt-1">
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