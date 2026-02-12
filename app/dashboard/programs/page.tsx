"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Filter, MapPin, BookOpen, Calendar, DollarSign, 
  GraduationCap, ChevronDown, Loader2, X, Check, ExternalLink,
  Award, Clock, Tag, Building2, Briefcase, FileText
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { ModernSelect } from "@/components/ui/select"
import Link from "next/link"

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
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

  // Filter options state
  const [countries, setCountries] = useState([])
  const [studyModes, setStudyModes] = useState([])
  const [levels, setLevels] = useState([])
  const [categories, setCategories] = useState([])
  const [universities, setUniversities] = useState([])

  // Filters state
  const [filters, setFilters] = useState({
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

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      // Fetch countries
      const countriesRes = await axiosInstance.get('/countries?limit=300')
      const countriesData = countriesRes.data.data
      setCountries(countriesData.map(c => ({ label: c.name, value: c.code })))

      // Fetch universities for filter
      const uniRes = await axiosInstance.get('/universities?limit=100')
      const uniData = uniRes.data.result
      setUniversities(uniData.map(u => ({ label: u.name, value: u._id })))

      // Fetch categories
      const catRes = await axiosInstance.get('/course-categories?limit=50')
      const catData = catRes.data.data
      setCategories(catData.map(c => ({ label: c.name, value: c._id })))

      // Extract unique study modes and levels from courses later
      // For now, set static options
      setStudyModes([
        { label: "Full Time", value: "Full Time" },
        { label: "Part Time", value: "Part Time" },
        { label: "Online", value: "Online" },
        { label: "Distance Learning", value: "Distance Learning" }
      ])

      setLevels([
        { label: "Bachelor", value: "Bachelor" },
        { label: "Master", value: "Master" },
        { label: "PhD", value: "PhD" },
        { label: "Diploma", value: "Diploma" },
        { label: "Certificate", value: "Certificate" }
      ])
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }, [])

  // Fetch courses
  const fetchCourses = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        populate: 'university,category,subject',
        ...(searchQuery && { name: searchQuery }),
        ...(filters.country && { 'university.country': filters.country }),
        ...(filters.university && { university: filters.university }),
        ...(filters.category && { category: filters.category }),
        ...(filters.studyMode && { studyMode: filters.studyMode }),
        ...(filters.level && { level: filters.level }),
        ...(filters.minFee && { minFee: filters.minFee }),
        ...(filters.maxFee && { maxFee: filters.maxFee }),
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
  }, [page, searchQuery, filters])

  // Initial fetch
  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchCourses(true)
  }, [searchQuery, filters])

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
  }, [page])

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
    if (filters.minFee) count++
    if (filters.maxFee) count++
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

  // Get level badge color
  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'bachelor': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'master': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'phd': return 'bg-green-100 text-green-700 border-green-200'
      case 'diploma': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'certificate': return 'bg-teal-100 text-teal-700 border-teal-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // Get study mode icon
  const getStudyModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'full time': return <Clock className="w-3 h-3" />
      case 'part time': return <Briefcase className="w-3 h-3" />
      case 'online': return <Globe className="w-3 h-3" />
      default: return <BookOpen className="w-3 h-3" />
    }
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50/50">
      <div className="p-4 sm:p-6 space-y-6">

        {/* Search & Filter Bar */}
        <div className="flex gap-3">
          <motion.div
            variants={itemVariants}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by name, university, or subject..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </motion.div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 shadow-sm text-sm"
            >
              <option value="name">Name</option>
              <option value="tuitionFee">Tuition Fee</option>
              <option value="createdAt">Latest</option>
            </select>
            <button
              onClick={() => handleFilterChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              {filters.sort_order === 'asc' ? 'A→Z' : 'Z→A'}
            </button>
          </div>

          {/* Filter Button */}
          <div className="relative" ref={filterButtonRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {/* Filters Drawer */}
            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed  inset-0 z-40 bg-black/30"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h2 className="font-semibold flex items-center gap-2 text-gray-900">
                        <Filter className="w-4 h-4" />
                        Filter Courses
                      </h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto">
                      {/* Country Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
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
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Study Mode
                        </label>
                        <ModernSelect
                          options={studyModes}
                          value={filters.studyMode}
                          onChange={(value) => handleFilterChange('studyMode', value)}
                          placeholder="Select study mode"
                          className="w-full"
                        />
                      </div>

                      {/* Level Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Level
                        </label>
                        <ModernSelect
                          options={levels}
                          value={filters.level}
                          onChange={(value) => handleFilterChange('level', value)}
                          placeholder="Select level"
                          className="w-full"
                        />
                      </div>

                      {/* Tuition Fee Range */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Tuition Fee Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.minFee}
                            onChange={(e) => handleFilterChange('minFee', e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxFee}
                            onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Active Filters Display */}
                      {getActiveFilterCount() > 0 && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {filters.country && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                                {countries.find(c => c.value === filters.country)?.label || filters.country}
                                <button onClick={() => handleFilterChange('country', '')} className="hover:bg-blue-100 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.studyMode && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                                {filters.studyMode}
                                <button onClick={() => handleFilterChange('studyMode', '')} className="hover:bg-blue-100 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.level && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                                {filters.level}
                                <button onClick={() => handleFilterChange('level', '')} className="hover:bg-blue-100 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

        {/* Courses Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {loading ? (
            // Skeleton loading
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))
          ) : courses.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <Search className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            courses.map((course, index) => (
              <motion.div
                key={course._id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -4 }}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/courses/${course.slug}`} className="block h-full">
                  <div className="p-6">
                    {/* Header with University Logo */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 p-2 border border-gray-100 flex-shrink-0">
                        {course.university?.uni_logo ? (
                          <img
                            src={course.university.uni_logo}
                            alt={course.university?.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-full h-full text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{course.university?.name}</span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {course.university?.city}, {course.university?.country}
                        </p>
                      </div>
                    </div>

                    {/* Level & Study Mode Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
                        <GraduationCap className="w-3 h-3" />
                        {course.level}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                        {getStudyModeIcon(course.studyMode)}
                        {course.studyMode}
                      </span>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          Tuition Fee
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(course.tuitionFee || 0, course.currency)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Duration
                        </p>
                        <p className="font-medium text-gray-900">{course.duration || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          Application Fee
                        </p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(course.applicationFee || 0, course.currency)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          Subject
                        </p>
                        <p className="font-medium text-gray-900 truncate">
                          {course.subject?.name || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {course.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs border border-gray-200"
                          >
                            <Tag className="w-3 h-3 inline mr-1" />
                            {tag}
                          </span>
                        ))}
                        {course.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs border border-gray-200">
                            +{course.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Short Description */}
                    {course.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {course.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {course.category?.name && (
                          <>Category: <span className="font-medium text-gray-700">{course.category.name}</span></>
                        )}
                      </span>
                      <Link href={`/dashboard/programs/${course.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        View Details
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="py-8">
          {loadingMore && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="mt-2 text-sm text-gray-600">Loading more courses...</p>
            </div>
          )}
          {!hasMore && courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-900 font-medium">You've reached the end!</p>
              <p className="text-sm text-gray-600 mt-1">
                Showing {courses.length} courses
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}