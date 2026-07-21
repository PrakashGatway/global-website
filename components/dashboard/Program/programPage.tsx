"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, MapPin, Loader2, X, Check, ExternalLink,
  Award, Clock, Tag, Building2, Briefcase, FileText,
  MapPinCheck, Sparkles, Globe, Shield, TrendingUp,
  IndianRupeeIcon,
  Calendar1,
  Info,
  Trash2,
  Save,
  UserX
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { ModernSelect } from "@/components/ui/select"
import Link from "next/link"
import { CreateApplicationModal } from "@/components/dashboard/applicationModel"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ProgramHeader from "./programHeader"
import ProgramFilters from "./programFilter"
import toast from "react-hot-toast"
import { useGlobal } from "@/src/statecontext"
import { downloadExcel, downloadPDF } from "./CourseCard"
import NewApplicationModal from "../application/add_application"


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

interface Application {
  _id: string;
  applicationNumber: string;
  student: Student;
  country?: string;
  course?: Course;
  intake?: string;
  paymentStatus: PaymentStatus;
  primaryStatus: ApplicationStatus;
  isWithdrawn: boolean;
  createdAt?: string;
  updatedAt?: string;
}


interface ApiResponse {
  success: boolean;
  data: Application[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  results: number;
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isCleared, setIsCleared] = useState(false);
  const [total , setTotal] = useState(10000);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Filter options state
  const [countries, setCountries] = useState([])
  const [studyModes, setStudyModes] = useState([])
  const [levels, setLevels] = useState([]) as any;
  const [categories, setCategories] = useState([])
  const [universities, setUniversities] = useState([])
  const [selectedProgram, setselectedProgram] = useState([])
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showCompare, setshowCompare] = useState(false)
  const [showApplicationDetail,setshowApplicationDetail] = useState(false)  

  const searchParams = useSearchParams();
  const university = searchParams.get('university') || ""

  const { profile, allProfile } = useGlobal()
  const [preferenceApplied, setPreferenceApplied] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: debouncedSearchQuery,
    intake:[],
    year:"",
    nationlity:"",
    country: "",
    state:"",
    duration:"",
    requirement:[],
    university: university || "",
    category: "",
    studyMode: "",
    level: [],
    minFee: "",
    maxFee: "",
    sort_by: "name",
    sort_order: "asc"
  }) as any

  const initialized = useRef(false);
  const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
      if (initialized.current) return;
  
      initialized.current = true;
  
      if (university) {
        setFilters((prev) => ({
          ...prev,
          university: university
        }));
  
        const params = new URLSearchParams(searchParams.toString());
        params.delete("university");
  
        router.replace(
          params.toString() ? `${pathname}?${params}` : pathname,
          { scroll: false }
        );
      }
    }, [university]);

  const applyPreference = () => {
  const preferredCountries =
    allProfile?.profile?.preferences?.preferredCountries || [];

  const countryCodes = countries
    .filter((c) => preferredCountries.includes(c.label))
    .map((c) => c.value);

  const preferredCategory = allProfile?.profile?.preferences?.preferredCourse || [];

  const preferCatCodes = categories
    .filter((c) => preferredCategory.includes(c.label))
    .map((c) => c.value);

  setFilters((prev) => ({
    ...prev,
    country: countryCodes[0],
   level: allProfile?.profile?.preferences?.level
  ? [allProfile.profile.preferences.level]
  : [],
    category: preferCatCodes[0]
  }));
  setPreferenceApplied(true);
};

const removePreference = () => {
  setFilters((prev) => ({
    ...prev,
    country: [],
    level: [],
    category: [],
  }));
  setPreferenceApplied(false);
};

  const fetchFilterOptions = useCallback(async () => {
    try {
      const [countriesRes, uniRes, catRes] = await Promise.all([
        axiosInstance.get('/countries?limit=300'),
        axiosInstance.get('/universities/flat?limit=1000'),
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
        {
          label: "High School (11th-12th)",
          value: "High School (11th-12th)",
        },
        {
          label: "UG Diploma/ Certificate/ Associate Degree",
          value: "UG Diploma/ Certificate/ Associate Degree",
        },
        {
          label: "Undergraduate",
          value: "Undergraduate",
        },
        {
          label: "PG Diploma /Certificate",
          value: "PG Diploma /Certificate",
        },
        {
          label: "Postgraduate",
          value: "Postgraduate",
        },
        {
          label: "UG+PG (Accelerated) Degree",
          value: "UG+PG (Accelerated) Degree",
        },
        {
          label: "PhD",
          value: "PhD",
        },
        {
          label: "Short-term/Summer Programs",
          value: "Short-term/Summer Programs",
        },
        {
          label: "Pathway Programs (UG)",
          value: "Pathway Programs (UG)",
        },
        {
          label: "Pathway Programs (PG)",
          value: "Pathway Programs (PG)",
        },
        {
          label: "Semester Study Abroad",
          value: "Semester Study Abroad",
        },
        {
          label: "Twinning Programmes (UG)",
          value: "Twinning Programmes (UG)",
        },
        {
          label: "Twinning Programmes (PG)",
          value: "Twinning Programmes (PG)",
        },
        {
          label: "English Language Program",
          value: "English Language program (ESL,IEP,ELP)",
        },
        {
          label: "Online Programmes / Distance Learning",
          value: "Online Programmes / Distance Learning",
        },
        {
          label: "Hybrid",
          value: "Hybrid",
        },
        {
          label: "Grades Below 10th",
          value: "Grades Below 10th",
        }
      ]);
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }, [])

  const fetchCourses = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      
      // Build params with ALL filters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        isExtra: 'false',
        iswithCountry: 'true',
        limit: '12',
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(filters.country && { country: filters.country }),
        ...(filters.intake && { intake: filters.intake }),
        ...(filters.year && { year: filters.year }),
        ...(filters.nationality && { nationality: filters.nationality }),
        ...(filters.state && { state: filters.state }),
        ...(filters.duration && { duration: filters.duration }),
        ...(filters.backlogs && { backlogs: filters.backlogs }),
        ...(filters.ugScore && { ugScore: filters.ugScore }),
        ...(filters.twelfthScore && { twelfthScore: filters.twelfthScore }),
        ...(filters.englishScores && { englishScores: filters.englishScores }),
        ...(filters.otherExam && { otherExam: filters.otherExam }),
        ...(filters.otherExamScore && { otherExamScore: filters.otherExamScore }),
        ...(filters.englishExam && { englishExam: filters.englishExam }),
        ...(filters.workExperience && { workExperience: filters.workExperience }),
        ...(filters.requirement && { requirement: filters.requirement }),
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
      const data = response.data.data || []
      setTotal(response.data.total || 100000)

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
  }, [page, filters])

  // Initial fetch
  useEffect(() => {
    fetchFilterOptions()
  }, [fetchFilterOptions])


  const initialLoaded = useRef(false);

useEffect(() => {
    if (!loading && courses.length > 0) {
        initialLoaded.current = true;
    }
}, [loading, courses]);

  // Fetch on search/filter changes
  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchCourses(true)
  }, [filters])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (initialLoaded.current && entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => prev + 1)
          setLoadingMore(true)
        }
      },
      { threshold: 1 }
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
    setIsCleared(true)
  }

  const handleCompareSelect = (course) => {
    setselectedProgram((prev) => {
      const exists = prev.some((item) => item._id === course._id);

      if (exists) {
        return prev.filter((item) => item._id !== course._id);
      }

      if (prev.length >= 3) {
        toast.error("You can only select 3 programs");
        return prev;
      }

      return [...prev, course];
    });
  };


 const highlights = [
  { id: 1, label: "Faster Offer TAT" },
  { id: 2, label: "Scholarship Available" },
  { id: 3, label: "High Offer Acceptance Rate" },
  { id: 4, label: "English Proficiency Exam Waiver" },
  { id: 5, label: "Affordable University" },
  { id: 6, label: "Co-op & Built-in Internships" },
  { id: 7, label: "High Job Demand" },
  { id: 8, label: "No Tuition Deposit (US)" },
  { id: 9, label: "Major City" },
  { id: 10, label: "Eligible Non Collateral Loan" },
  { id: 11, label: "GS approval with KC (Aus)" },
  { id: 12, label: "Regional University (Aus)" },
  { id: 13, label: "Higher Backlog Acceptance" },
  { id: 14, label: "Low Tuition Deposit" },
  { id: 15, label: "No Interview Required" },
  { id: 16, label: "MBA Programs" },
  { id: 17, label: "Russel Group Universities (UK)" },
  { id: 18, label: "MOI Acceptable" },
  { id: 19, label: "Uni has own English Test" },
];



  return (
    <main className="flex-1 relative bg-orange-100/20">
      <div className="space-y-4">
        {/* Hero Section */}
        <ProgramHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          countries={countries} 
          course={courses} 
          levels={levels} 
          categories={categories} 
          filters={filters}
          setFilters={setFilters}
        />

        {/* Results Count and Preference Buttons */}
        {!loading && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <p className="text-base text-gray-800">
              Found <span className="font-semibold text-foreground">{total && total} + </span> programs
            </p>
            <div className="flex gap-2">
  {!preferenceApplied ? (
    <button
      onClick={applyPreference}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white"
    >
      Apply Preference
    </button>
  ) : (
    <button
      onClick={removePreference}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600"
    >
      Remove Preference
    </button>
  )}
</div>
          </motion.div>

        )}

        {selectedProgram.length > 0 && (
          <div className="fixed bottom-0 left-100 z-100 bg-primary border w-210 p-4 shadow-lg flex items-center justify-between">
            <span className="font-medium text-white">
              {selectedProgram.length} Program(s) Selected
            </span>

            <div className="flex gap-3 text-white">
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-2 border rounded"
              >
                Compare
              </button>

              <button
                onClick={() => setShowDownloadModal(true)}
                className="px-4 py-2 border rounded"
              >
                Download
              </button>

              <button onClick={() => setselectedProgram([])} className="px-4 py-2 border rounded">
                Clear
              </button>
            </div>
          </div>
        )}

       <AnimatePresence>
  {showDownloadModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen"
      onClick={() => setShowDownloadModal(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 22,
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-xl font-bold">
            Download Selected Programs
          </h2>

          <button
            onClick={() => setShowDownloadModal(false)}
            className="text-3xl hover:text-orange-500 transition"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[420px] overflow-y-auto">
          {selectedProgram.map((program, index) => (
            <div
              key={program._id}
              className="flex items-center justify-between px-8 py-6 border-b"
            >
              <div>
                <h3 className="text-lg font-semibold text-orange-600">
                  {index + 1}. {program.name}
                </h3>

                <div className="mt-3 flex gap-8 text-gray-600 text-base">
                  <span>🏫 {program.university.name}</span>
                  <span>📍 {program.university.country}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  setselectedProgram((prev) =>
                    prev.filter((item) => item._id !== program._id)
                  )
                }
                className="text-orange-500 font-medium hover:text-orange-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => setselectedProgram([])}
            className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Clear All
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => downloadPDF(selectedProgram)}
              className="bg-orange-500 px-6 py-3 rounded-xl text-white hover:scale-105 transition"
            >
              Download as PDF
            </button>

            <button
              onClick={() => downloadExcel(selectedProgram)}
              className="bg-orange-500 px-6 py-3 rounded-xl text-white hover:scale-105 transition"
            >
              Download as Excel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

       <AnimatePresence>
  {showCompareModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 min-h-screen"
      onClick={() => setShowCompareModal(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 22,
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-3xl font-bold">
            Please select up to 5 programs to compare
          </h2>

          <button
            onClick={() => setShowCompareModal(false)}
            className="text-3xl hover:text-orange-500 transition"
          >
            ×
          </button>
        </div>

        {/* Program List */}
        <div className="max-h-[420px] overflow-y-auto rounded-xl border border-orange-100 bg-white">
          {selectedProgram.map((program, index) => (
            <div
              key={program._id}
              className="flex items-center justify-between px-4 py-3 border-b border-orange-100 last:border-b-0 hover:bg-orange-50 transition"
            >
              <div className="flex-1">
                <h3 className="text-base font-semibold text-orange-600">
                  {index + 1}. {program.name}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    🏫 {program.university?.name}
                  </span>

                  <span className="flex items-center gap-1">
                    📍 {program.university?.country}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setselectedProgram((prev) =>
                    prev.filter((x) => x._id !== program._id)
                  )
                }
                className="ml-4 rounded-md border border-orange-300 px-3 py-1 text-sm font-medium text-orange-600 transition hover:bg-orange-500 hover:text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6">
          <button
            onClick={() => {
              setshowCompare(true);
              setShowCompareModal(false);
            }}
            className="w-full rounded-xl bg-orange-500 py-4 text-lg font-semibold text-white transition hover:bg-orange-600 hover:scale-[1.02] active:scale-95"
          >
            Compare
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <AnimatePresence>
  {showCompare && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 min-h-screen"
      onClick={() => setshowCompare(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 22,
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Program Comparison
          </h2>

          <button
            onClick={() => setshowCompare(false)}
            className="p-2 rounded-full hover:bg-orange-100 hover:text-orange-500 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[calc(90vh-90px)]">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 w-1/4">
                  Program Name:
                </td>
                {selectedProgram.map((program, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-center border-l border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-orange-500">
                      {program.name}
                    </h3>
                  </td>
                ))}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                  University Details:
                </td>
                {selectedProgram.map((program, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-center border-l border-gray-200"
                  >
                    {program.university?.uni_logo ? (
                      <img
                        src={program.university.uni_logo}
                        alt={program.university.name}
                        className="h-12 mx-auto mb-2 object-contain"
                      />
                    ) : (
                      <div className="h-12 flex items-center justify-center mb-2">
                        <Building2 className="w-10 h-10 text-gray-300" />
                      </div>
                    )}

                    <p className="font-semibold text-gray-800">
                      {program.university?.name}
                    </p>
                  </td>
                ))}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                  Country:
                </td>
                {selectedProgram.map((program, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-center border-l border-gray-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>
                        {program.university?.city},{" "}
                        {program.university?.country}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                  Program Level:
                </td>
                {selectedProgram.map((program, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-center border-l border-gray-200"
                  >
                    {program.level}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                  Duration:
                </td>
                {selectedProgram.map((program, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-center border-l border-gray-200"
                  >
                    {program.duration}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                  Application Fee:
                </td>
                {selectedProgram.map((program, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-center border-l border-gray-200"
                  >
                    {program.applicationFee ? (
                      <span>
                        {program.currency} {program.applicationFee}
                      </span>
                    ) : (
                      <span className="font-semibold text-green-600">
                        No Application Fee
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                  Program Tuition Fees:
                </td>
                {selectedProgram.map((program, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-center border-l border-gray-200"
                  >
                    <span className="font-semibold text-orange-500">
                      {program.currency}{" "}
                      {program.tuitionFee?.toLocaleString()}
                    </span>
                  </td>
                ))}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
                  Study Mode:
                </td>
                {selectedProgram.map((program, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-center border-l border-gray-200"
                  >
                    {program.studyMode}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


        <div className="flex flex-col lg:flex-row gap-4 items-start ">
          {/* LEFT SIDEBAR: FILTERS */}
          <div className="relative z-9 sticky top-4 self-start">
            <ProgramFilters
            total={total}
              filters={filters}
              setFilters={setFilters}
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
          </div>
          
          {/* RIGHT CONTENT: COURSE GRID */}
          <div className="flex-1 w-full ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-28 bg-gray-100 rounded"></div>
                          <div className="h-6 w-20 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 w-full bg-gray-100 rounded"></div>
                        <div className="h-6 w-6/4 bg-gray-100 rounded"></div>
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
                  const metaInfo = course?.metaInfo || {};
                  const intakeDeadline = metaInfo?.intakeDeadline || "";
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const ids =
  course?.metaInfo?.highlight
    ?.split(",")
    .map((id) => Number(id.trim())) || [];

const selectedHighlights = highlights.filter((item) =>
  ids.includes(item.id)
);

                  const intakeData = intakeDeadline
                    ? intakeDeadline.split(",").map((item) => {
                      const [month, date] = item.split(":");
                      const [day, monthNo, year] = date.split("-");
                      const deadline = new Date(
                        Number(year),
                        Number(monthNo) - 1,
                        Number(day)
                      );

                      return {
                        month,
                        deadline,
                        deadlineText: date,
                        isClosed: deadline < today,
                      };
                    })
                    : [];

                  const openIntakes = intakeData.filter((item) => !item.isClosed);
                  const closedIntakes = intakeData.filter((item) => item.isClosed);

                  const monthOrder = {
                    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
                  };

                  const currentMonth = new Date().getMonth();

                  const fallbackIntakes =
                    metaInfo?.Intakes?.split(",").map((item) => item.trim()) || [];

                  const fallbackClosed = metaInfo?.IntakesClosed
                    ? metaInfo.IntakesClosed.split(",").map((item) => {
                      const [month, year, open, closed, remark] = item.split(":::");
                      return {
                        month: month.trim(),
                        remark: remark || "Deadline passed.",
                      };
                    })
                    : [];

                  const fallbackClosedMonths = fallbackClosed?.map((item) => item.month);
                  const fallbackOpenMonths = fallbackIntakes.filter(
                    (month) => !fallbackClosedMonths?.includes(month)
                  );

                  const deadlineMap =
                    metaInfo?.deadline && metaInfo.deadline !== "ASAP"
                      ? Object.fromEntries(
                        metaInfo?.deadline?.split(",")?.map((item) => {
                          const [month, deadline] = item.split(":");
                          return [month?.trim(), deadline?.trim()];
                        })
                      )
                      : {};

                  const isAsap = metaInfo?.deadline;

                  return (
                <div key={course._id} className="fade-in-up h-full flex flex-col  rounded-lg hover:scale-103 transition-transform duration-200 px-4">
  <div
    className={`relative w-full p-5 transition-all duration-200 hover:shadow-md hover:shadow-orange-500/20 h-full flex flex-col border border-orange-500 rounded-xl ${
      selectedProgram.some((item) => item._id === course._id)
        ? "border-orange-500 bg-[#fefaf8]"
        : "border-gray-200 bg-white"
    }`}
  >
    {/* Checkbox for Counsellor */}
    {profile.role === "counsellor" && (
      <div className="absolute top-4 right-4 z-10">
        <input
          type="checkbox"
          checked={selectedProgram.some((item) => item._id === course._id)}
          onChange={() => handleCompareSelect(course)}
          className="w-5 h-5 accent-orange-500 cursor-pointer"
        />
      </div>
    )}

    {/* Top Section: Logo & Content (Desktop: Row, Mobile: Column) */}
    <div className="flex flex-col md:flex-row gap-5 items-start mb-4">
    

      {/* Middle Section: Content & Stats */}
      <div className="flex gap-14 min-w-0 w-full">
        {/* Header Info */}
          {/* Left Section: Logo & Country */}
      <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto min-w-[80px]">
        <div className="w-16 h-16  relative">
          {course.university?.uni_logo ? (
            <img
              src={course.country?.flg || "/images/newlogo3.png"}
              alt={course.university?.name}
              onError={(e) => {
                e.currentTarget.src = "/images/newlogo3.png";
              }}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
        </div>
        <span className="text-sm text-gray-500 font-medium text-center hidden md:block">
          {course?.country?.name}
        </span>
      </div>


  <div>
          <div className="">
          <h3 className="font-bold text-gray-900 text-xl mb-1 line-clamp-2">
            {course.name}
          </h3>
          <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {course.university?.name}
          </p>
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{course.university?.city}, {course.university?.country}</span>
          </div>

          {/* Tags / Highlights */}
          <div className="flex flex-wrap gap-2 ">
            {selectedHighlights.map((item) => (
              <div
                key={item.id}
                className="px-3 py-1 border border-orange-200 bg-orange-50 rounded-full text-orange-700 text-sm font-medium"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

      
  </div>



      </div>

     
    </div>
     <div>
          {/* Stats Row */}
        <div className="bg-orange-50/50 rounded-lg border border-orange-100 p-3 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-orange-200/50 gap-4">
            {/* Tuition Fee */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💰</span>
            <div className="flex flex-col px-2 first:pl-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base text-gray-500 font-medium">Tuition Fee</span>
              </div>
              <p className="font-bold text-orange-600 text-base">
                {course.tuitionFee || 0} {course?.currency}
              </p>
            </div>
                

</div>
            {/* Duration */}
            <div className = "flex items-center justify-center gap-3">
                <span className="text-2xl">⏳</span>

            <div className="flex flex-col px-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base text-gray-500 font-medium">Duration</span>
              </div>
              <p className="font-bold text-orange-600 text-base">
                {course.duration || 'N/A'}
              </p>
            </div>
            </div>

            {/* Average Scholarship */}
            <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🎓</span>

            <div className="flex flex-col px-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base text-gray-500 font-medium">Avg. Scholarship</span>
              </div>
              <p className="font-bold text-emerald-600 text-base">
                {metaInfo?.AverageScholarship ? `${metaInfo.AverageScholarship} ${course?.currency}` : "N/A"}
              </p>
            </div>
            </div>

            {/* Initial Deposit */}
            <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📄</span>

            <div className="flex flex-col px-2 last:pr-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base text-gray-500 font-medium">Initial Deposit</span>
              </div>
              <p className="font-bold text-gray-700 text-base">
                {metaInfo?.initialDeposit ? `${metaInfo.initialDeposit} ${course?.currency}` : "0 MYR"}
              </p>
            </div>
            </div>
          </div>
        </div>

    
      </div>

      <div className= "flex items-center gap-4 justify-between">


            {/* Intakes Section */}
        <div className="space-y-2">
          {openIntakes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Open
              </span>
              {openIntakes.map((item) => (
                <div key={item.month} className="group relative">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-green-50 border border-green-100 text-sm font-medium text-green-700">
                    {item.month}
                    <Info className="h-3 w-3 text-gray-400" />
                  </span>
                  <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                    Deadline: {item.deadlineText}
                  </div>
                </div>
              ))}
            </div>
          )}

          {closedIntakes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Closed
              </span>
              {closedIntakes.map((item) => (
                <div key={item.month} className="group relative">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-50 border border-red-100 text-sm font-medium text-red-700">
                    {item.month}
                    <Info className="h-3 w-3 text-gray-400" />
                  </span>
                  <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                    Deadline passed.
                  </div>
                </div>
              ))}
            </div>
          )}

          {openIntakes.length === 0 && closedIntakes.length === 0 && fallbackIntakes.length > 0 && (
            <div className="space-y-2">
              {fallbackOpenMonths.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">Open</span>
                  {fallbackOpenMonths.map((month) => (
                    <div key={month} className="group relative">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-green-50 border border-green-100 text-sm font-medium text-green-700">
                        {month} <Info className="h-3 w-3 text-gray-400 cursor-pointer" />
                      </span>
                      <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                        {isAsap ? "Deadline: ASAP" : `Deadline: ${deadlineMap[month] || "ASAP"}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {fallbackClosed.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">Closed</span>
                  {fallbackClosed.map((item) => (
                    <div key={item.month} className="group relative">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-50 border border-red-100 text-sm font-medium text-red-700">
                        {item.month} <Info className="h-3 w-3 text-gray-400" />
                      </span>
                      <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
                        {item.remark}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

          {/* Bottom Section: Action Buttons (Pushed to bottom with mt-auto) */}
    <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col md:flex-row gap-2 w-80">
      <Link
        href={`/dashboard/programs/${course.slug}`}
        className="flex-1 text-center px-4 py-3 bg-white border border-orange-500 text-orange-500 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors"
      >
        View Details
      </Link>
      <button
        onClick={() => {
          setSelectedCourse(course);
          profile.role === "user" ? setIsModalOpen(true) : setshowApplicationDetail(true);
        }}
        className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-[#f26d44] hover:bg-[#e05a33] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
      >
        Apply Now
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>

      </div>

  
  </div>

  <style jsx>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
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
          </div>
        </div>

        {showApplicationDetail && (
          <NewApplicationModal isOpen={showApplicationDetail} onClose={() => setshowApplicationDetail(false)} onSuccess={() => null} selectedCourse= {selectedCourse} />
        )}

        <CreateApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApplicationCreated={() => {}}
          program={selectedCourse}
        />
      </div>
    </main>
  )
}



// "use client"

// import { useState, useEffect, useRef, useCallback, useMemo } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Search, Filter, MapPin, BookOpen, Calendar, DollarSign,
//   GraduationCap, ChevronDown, Loader2, X, Check, ExternalLink,
//   Award, Clock, Tag, Building2, Briefcase, FileText,
//   MapPinCheck, Sparkles, Globe, Shield, TrendingUp,
//   IndianRupeeIcon,
//   Calendar1,
//   Info,
//   Trash2
// } from "lucide-react"
// import axiosInstance from "@/app/axiosInstance"
// import { ModernSelect } from "@/components/ui/select"
// import Link from "next/link"
// import { CreateApplicationModal } from "@/components/dashboard/applicationModel"
// import { useSearchParams } from 'next/navigation';

// import ProgramHeader from "./programHeader"
// import ProgramFilters from "./programFilter"
// import toast from "react-hot-toast"
// import { useGlobal } from "@/src/statecontext"
// import { downloadExcel, downloadPDF } from "./CourseCard"


// // Debounce hook
// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value)

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value)
//     }, delay)

//     return () => {
//       clearTimeout(handler)
//     }
//   }, [value, delay])

//   return debouncedValue
// }

// interface Course {
//   _id: string
//   name: string
//   slug: string
//   university: {
//     _id: string
//     name: string
//     slug: string
//     city: string
//     country: string
//     uni_logo: string
//     intakes?: string[]
//   }
//   category: {
//     _id: string
//     name: string
//     slug: string
//   }
//   subject: {
//     _id: string
//     name: string
//     slug: string
//   }
//   studyMode: string
//   shortName: string
//   tuitionFee: number
//   currency: string
//   level: string
//   tags: string[]
//   applicationFee: number
//   duration: string
//   status: string
//   description: string
//   createdAt: string
// }

// export default function CoursesPage() {
//   // State management
//   const [courses, setCourses] = useState<Course[]>([])
//   const [loading, setLoading] = useState(true)
//   const [loadingMore, setLoadingMore] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [page, setPage] = useState(1)
//   const [hasMore, setHasMore] = useState(true)
//   const [showFilters, setShowFilters] = useState(false)
//   const observerTarget = useRef<HTMLDivElement>(null)
//   const filterButtonRef = useRef(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedCourse, setSelectedCourse] = useState(null)
//   const [hoveredCard, setHoveredCard] = useState<string | null>(null)
//   const [isCleared, setIsCleared] = useState(false);

//   // Debounced search query
//   const debouncedSearchQuery = useDebounce(searchQuery, 500)

//   // Filter options state
//   const [countries, setCountries] = useState([])
//   const [studyModes, setStudyModes] = useState([])
//   const [levels, setLevels] = useState([])
//   const [categories, setCategories] = useState([])
//   const [universities, setUniversities] = useState([])
//   const [selectedProgram, setselectedProgram] = useState([])
//   const [showDownloadModal, setShowDownloadModal] = useState(false);
//   const [showCompareModal, setShowCompareModal] = useState(false);
//   const [showCompare,setshowCompare] = useState(false)

//   const searchParams = useSearchParams();
//   const university = searchParams.get('university') || ""

//   const { profile } = useGlobal()
//   // Filters state
//   const [filters, setFilters] = useState({
//     country: "",
//     university: university || "",
//     category: "",
//     studyMode: "",
//     level: "",
//     minFee: "",
//     maxFee: "",
//     sort_by: "name",
//     sort_order: "asc"
//   })
//   // Fetch filter options
//   const fetchFilterOptions = useCallback(async () => {
//     try {
//       const [countriesRes, uniRes, catRes] = await Promise.all([
//         axiosInstance.get('/countries?limit=300'),
//         axiosInstance.get('/universities/flat'),
//         axiosInstance.get('/courses/categories?limit=100')
//       ])
//       const countriesData = countriesRes.data.data
//       setCountries(countriesData.map((c: any) => ({ label: c.name, value: c.code })))

//       const uniData = uniRes.data.data
//       setUniversities(uniData.map((u: any) => ({ label: u.name, value: u._id })))

//       const catData = catRes.data.data
//       setCategories(catData.map((c: any) => ({ label: c.name, value: c._id })))

//       setStudyModes([
//         { label: "Full Time", value: "Full-time" },
//         { label: "Part Time", value: "Part-time" },
//         { label: "Online", value: "Online" },
//         { label: "Hybrid", value: "Hybrid" }
//       ])
//       setLevels([
//         {
//           label: "High School (11th - 12th)",
//           value: "High School (11th - 12th)",
//         },
//         {
//           label: "UG Diploma/ Certificate/ Associate Degree",
//           value: "UG Diploma/ Certificate/ Associate Degree",
//         },
//         {
//           label: "UG",
//           value: "UG",
//         },
//         {
//           label: "PG Diploma/Certificate",
//           value: "PG Diploma/Certificate",
//         },
//         {
//           label: "PG",
//           value: "PG",
//         },
//         {
//           label: "UG+PG (Accelerated) Degree",
//           value: "UG+PG (Accelerated) Degree",
//         },
//         {
//           label: "PhD",
//           value: "PhD",
//         },
//         {
//           label: "Short-term/Summer Programs",
//           value: "Short-term/Summer Programs",
//         },
//         {
//           label: "Pathway Programs (UG)",
//           value: "Pathway Programs (UG)",
//         },
//         {
//           label: "Pathway Programs (PG)",
//           value: "Pathway Programs (PG)",
//         },
//         {
//           label: "Semester Study Abroad",
//           value: "Semester Study Abroad",
//         },
//         {
//           label: "Twinning Programmes (UG)",
//           value: "Twinning Programmes (UG)",
//         },
//         {
//           label: "Twinning Programmes (PG)",
//           value: "Twinning Programmes (PG)",
//         },
//         {
//           label: "English Language Program",
//           value: "English Language Program",
//         },
//         {
//           label: "Online Programmes / Distance Learning",
//           value: "Online Programmes / Distance Learning",
//         },
//         {
//           label: "Hybrid",
//           value: "Hybrid",
//         },
//         {
//           label: "Grades Below 10th",
//           value: "Grades Below 10th",
//         },
//       ]);
//     } catch (error) {
//       console.error('Error fetching filter options:', error)
//     }
//   }, [])




//   // Fetch courses with debounced search
//   const fetchCourses = useCallback(async (reset = false) => {
//     try {
//       const currentPage = reset ? 1 : page
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         isExtra: 'false',
//         limit: '12',
//         ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
//         ...(filters.country && { 'country': filters.country }),
//         ...(filters.university && { university: filters.university }),
//         ...(filters.category && { category: filters.category }),
//         ...(filters.studyMode && { studyMode: filters.studyMode }),
//         ...(filters.level && { level: filters.level }),
//         ...(filters.sort_by && { sort_by: filters.sort_by }),
//         ...(filters.sort_order && { sort_order: filters.sort_order })
//       })

//       const response = await axiosInstance.get(`/courses?${params}`)
//       const data = response.data.result || response.data.data || []

//       if (reset) {
//         setCourses(data)
//       } else {
//         setCourses(prev => [...prev, ...data])
//       }

//       setHasMore(data.length === 12)
//     } catch (error) {
//       console.error('Error fetching courses:', error)
//     } finally {
//       setLoading(false)
//       setLoadingMore(false)
//     }
//   }, [page, debouncedSearchQuery, filters])

//   // Initial fetch
//   useEffect(() => {
//     fetchFilterOptions()
//   }, [fetchFilterOptions])

//   // Fetch on search/filter changes
//   useEffect(() => {
//     setLoading(true)
//     setPage(1)
//     fetchCourses(true)
//   }, [debouncedSearchQuery, filters])

//   // Infinite scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       entries => {
//         if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
//           setPage(prev => prev + 1)
//           setLoadingMore(true)
//         }
//       },
//       { threshold: 1.0 }
//     )

//     if (observerTarget.current) {
//       observer.observe(observerTarget.current)
//     }

//     return () => {
//       if (observerTarget.current) {
//         observer.unobserve(observerTarget.current)
//       }
//     }
//   }, [hasMore, loadingMore, loading])

//   useEffect(() => {
//     if (page > 1 && !loading) {
//       fetchCourses(false)
//     }
//   }, [page, fetchCourses])

//   // Filter handlers
//   const handleFilterChange = (key: keyof typeof filters, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }))
//     setPage(1)
//   }

//   const getActiveFilterCount = () => {
//     let count = 0
//     if (filters.country) count++
//     if (filters.university) count++
//     if (filters.category) count++
//     if (filters.studyMode) count++
//     if (filters.level) count++
//     return count
//   }

//   const clearFilters = () => {
//     setFilters({
//       country: "",
//       university: "",
//       category: "",
//       studyMode: "",
//       level: "",
//       minFee: "",
//       maxFee: "",
//       sort_by: "name",
//       sort_order: "asc"
//     })
//     setSearchQuery("")
//     setPage(1)
//     setIsCleared(true)
//   }



//   const handleCompareSelect = (course) => {
//     setselectedProgram((prev) => {
//       const exists = prev.some((item) => item._id === course._id);

//       if (exists) {
//         return prev.filter((item) => item._id !== course._id);
//       }

//       if (prev.length >= 3) {
//         toast.error("You can compare only 3 programs.");
//         return prev;
//       }

//       return [...prev, course];
//     });
//   };

  


//   return (
//     <main className="flex-1    relative">



//       <div className="space-y-4">

//         {/* Hero Section */}

//         <ProgramHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} countries={countries} course={courses} levels={levels} categories={categories} />


//         {/* Results Count */}
//         {!loading && courses.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="flex items-center justify-between"
//           >
//             <p className="text-base text-gray-800">
//               Found <span className="font-semibold text-foreground">{courses.length}</span> programs
//             </p>
//           </motion.div>
//         )}

//         {selectedProgram.length > 0 && (
//           <div className="fixed bottom-0 left-100 z-50 bg-primary border w-210 p-4 shadow-lg flex items-center justify-between">
//             <span className="font-medium text-white">
//               {selectedProgram.length} Program(s) Selected
//             </span>

//             <div className="flex gap-3 text-white">
//               <button
//                 onClick={() => setShowCompareModal(true)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Compare
//               </button>

//               <button
//                 onClick={() => setShowDownloadModal(true)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Download
//               </button>

//               <button onClick={() => setselectedProgram([])} className="px-4 py-2 border rounded">
//                 Clear
//               </button>
//             </div>
//           </div>
//         )}


//         {showDownloadModal && (
//           <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center">

//             <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

//               {/* Header */}

//               <div className="flex items-center justify-between border-b px-8 py-6">

//                 <h2 className="text-xl font-bold">
//                   Download Selected Programs
//                 </h2>

//                 <button
//                   onClick={() => setShowDownloadModal(false)}
//                   className="text-3xl"
//                 >
//                   ×
//                 </button>

//               </div>

//               {/* Program List */}

//               <div className="max-h-[420px] overflow-y-auto">

//                 {selectedProgram.map((program, index) => (
//                   <div
//                     key={program._id}
//                     className="flex items-center justify-between px-8 py-6 border-b"
//                   >

//                     <div>

//                       <h3 className="text-lg font-semibold text-orange-600">

//                         {index + 1}. {program.name}

//                       </h3>

//                       <div className="mt-3 flex gap-8 text-gray-600 text-base">

//                         <span>

//                           🏫 {program.university.name}

//                         </span>

//                         <span>

//                           📍 {program.university.country}

//                         </span>

//                       </div>

//                     </div>

//                     <button
//                       onClick={() => {
//                         setselectedProgram(prev => prev.filter(item => item._id !== program._id))
//                       }}
//                       className="text-orange-500 font-medium"
//                     >

//                       Remove

//                     </button>

//                   </div>
//                 ))}

//               </div>

//               {/* Footer */}

//               <div className="flex items-center justify-between p-6">

//                 <button
//                   onClick={() => setselectedProgram([])}
//                   className="border text-base px-6 py-3 rounded-xl"
//                 >
//                   Clear All
//                 </button>

//                 <div className="flex gap-4">

//                   <button
//                     onClick={()=> downloadPDF(selectedProgram)}
//                     className="bg-primary text-base px-6 py-3 rounded-xl text-white"
//                   >
//                     Download as PDF
//                   </button>

//                   <button
//                     onClick={() => downloadExcel(selectedProgram)}
//                     className="bg-primary text-base px-6 py-3 rounded-xl text-white"
//                   >
//                     Download as Excel
//                   </button>

//                 </div>

//               </div>

//             </div>

//           </div>
//         )}


//         {showCompareModal && (
//           <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center">

//             <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">

//               {/* Header */}

//               <div className="flex items-center justify-between border-b px-8 py-6">

//                 <h2 className="text-3xl font-bold">
//                   Please select up to 5 programs to compare
//                 </h2>

//                 <button
//                   onClick={() => setShowCompareModal(false)}
//                   className="text-3xl"
//                 >
//                   ×
//                 </button>

//               </div>

//               {/* Programs */}

//               <div className="max-h-[420px] overflow-y-auto">

//                 {selectedProgram.map((program, index) => (

//                   <div
//                     key={program._id}
//                     className="flex items-center justify-between px-8 py-6 border-b"
//                   >

//                     <div>

//                       <h3 className="text-xl font-semibold text-primary">

//                         {index + 1}. {program.name}

//                       </h3>

//                       <div className="flex gap-8 mt-3 text-gray-600">

//                         <span>
//                           🏫 {program.university?.name}
//                         </span>

//                         <span>
//                           📍 {program.university?.country}
//                         </span>

//                       </div>

//                     </div>

//                     <button
//                       onClick={() =>
//                         setselectedProgram((prev) =>
//                           prev.filter((x) => x._id !== program._id)
//                         )
//                       }
//                       className="text-red-500 font-medium"
//                     >
//                       Remove
//                     </button>

//                   </div>

//                 ))}

//               </div>

//               {/* Footer */}

//               <div className="p-6">

//                 <button
//                   onClick={()=>setshowCompare(true)}
//                   className="w-full rounded-xl bg-primary py-4 text-lg font-semibold text-white"
//                 >
//                   Compare
//                 </button>

//               </div>

//             </div>

//           </div>
//         )}


//         {showCompare && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//     <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
//       {/* Header */}
//       <div className="flex justify-between items-center p-6 border-b border-gray-200">
//         <h2 className="text-2xl font-bold text-gray-800">Program Comparison</h2>
//         <button
//           onClick={() => setShowCompare(false)}
//           className="text-gray-400 hover:text-gray-600 transition-colors"
//         >
//           <X className="w-6 h-6" />
//         </button>
//       </div>

//       {/* Comparison Table */}
//       <div className="overflow-auto max-h-[calc(90vh-80px)]">
//         <table className="w-full">
//           <tbody>
//             {/* Program Name */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 w-1/4">
//                 Program Name:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   <h3 className="text-lg font-semibold text-primary">
//                     {program.name}
//                   </h3>
//                 </td>
//               ))}
//             </tr>

//             {/* University Details */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 University Details:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.university?.uni_logo ? (
//                     <img
//                       src={program.university.uni_logo}
//                       alt={program.university.name}
//                       className="h-12 mx-auto mb-2 object-contain"
//                     />
//                   ) : (
//                     <div className="h-12 flex items-center justify-center mb-2">
//                       <Building2 className="w-10 h-10 text-gray-300" />
//                     </div>
//                   )}
//                   <p className="font-semibold text-gray-800">{program.university?.name}</p>
//                 </td>
//               ))}
//             </tr>

//             {/* Website URL */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Website URL:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.slug ? (
//                     <a
//                       href={`https://www.example.com/${program.slug}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline text-sm break-all"
//                     >
//                       View Program Details
//                     </a>
//                   ) : (
//                     <span className="text-gray-400">-</span>
//                   )}
//                 </td>
//               ))}
//             </tr>

//             {/* Country */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Country:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   <div className="flex items-center justify-center gap-2">
//                     <MapPin className="w-4 h-4 text-primary" />
//                     <span>{program.university?.city}, {program.university?.country}</span>
//                   </div>
//                 </td>
//               ))}
//             </tr>

//             {/* Program Level */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Program Level:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.level}
//                 </td>
//               ))}
//             </tr>

//             {/* Duration */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Duration:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.duration}
//                 </td>
//               ))}
//             </tr>

//             {/* Intakes */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Intakes:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.metaInfo?.Intakes || program.university?.intakes?.join(', ') || 'N/A'}
//                 </td>
//               ))}
//             </tr>

//             {/* Standardized Requirements */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 align-top">
//                 Standardized Requirements:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 border-l border-gray-200 align-top">
//                   <div className="text-left space-y-3">
//                     {/* IELTS */}
//                     {(program.requirements?.Ielts || program.requirements?.IeltsNoBandLessThan) && (
//                       <div>
//                         <p className="text-sm font-semibold text-gray-700">• IELTS</p>
//                         <div className="ml-4 text-sm text-gray-600">
//                           {program.requirements.IeltsNoBandLessThan && (
//                             <p>No band less than {program.requirements.IeltsNoBandLessThan}</p>
//                           )}
//                           {program.requirements.Ielts && (
//                             <p>Overall – {program.requirements.Ielts}</p>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* PTE */}
//                     {(program.requirements?.PteScore || program.requirements?.PteNoSectionLessThan) && (
//                       <div>
//                         <p className="text-sm font-semibold text-gray-700">• PTE</p>
//                         <div className="ml-4 text-sm text-gray-600">
//                           {program.requirements.PteNoSectionLessThan && (
//                             <p>No section less than {program.requirements.PteNoSectionLessThan}</p>
//                           )}
//                           {program.requirements.PteScore && (
//                             <p>Overall – {program.requirements.PteScore}</p>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* TOEFL */}
//                     {(program.requirements?.ToeflScore || program.requirements?.ToeflNoSectionLessThan) && (
//                       <div>
//                         <p className="text-sm font-semibold text-gray-700">• TOEFL iBT</p>
//                         <div className="ml-4 text-sm text-gray-600">
//                           {program.requirements.ToeflNoSectionLessThan && (
//                             <p>No section less than {program.requirements.ToeflNoSectionLessThan}</p>
//                           )}
//                           {program.requirements.ToeflScore && (
//                             <p>Overall – {program.requirements.ToeflScore}</p>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* DET */}
//                     {program.requirements?.DETScore && (
//                       <div>
//                         <p className="text-sm font-semibold text-gray-700">• DET</p>
//                         <div className="ml-4 text-sm text-gray-600">
//                           <p>Overall – {program.requirements.DETScore}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </td>
//               ))}
//             </tr>

//             {/* Application Deadline */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Application Deadline:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.metaInfo?.intakeDeadline || program.metaInfo?.deadline || '-'}
//                 </td>
//               ))}
//             </tr>

//             {/* Application Fee */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Application Fee:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.applicationFee ? (
//                     <span>{program.currency} {program.applicationFee}</span>
//                   ) : (
//                     <span className="text-green-600 font-semibold">No Application Fee</span>
//                   )}
//                 </td>
//               ))}
//             </tr>

//             {/* Program Tuition Fees */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Program Tuition Fees:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   <span className="font-semibold text-primary">
//                     {program.currency} {program.tuitionFee?.toLocaleString()}
//                   </span>
//                 </td>
//               ))}
//             </tr>

//             {/* Study Mode */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Study Mode:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.studyMode}
//                 </td>
//               ))}
//             </tr>

//             {/* Category */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Category:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.category?.name || '-'}
//                 </td>
//               ))}
//             </tr>

//             {/* Campus */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Campus:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.metaInfo?.campus || '-'}
//                 </td>
//               ))}
//             </tr>

//             {/* Scholarship */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Scholarship:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.metaInfo?.ScholarshipAvailable ? (
//                     <span className="text-green-600 font-semibold">✓ Available</span>
//                   ) : (
//                     <span className="text-gray-400">Not Available</span>
//                   )}
//                 </td>
//               ))}
//             </tr>

//             {/* STEM Course */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 STEM Course:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.metaInfo?.IsStemCourse ? (
//                     <span className="text-green-600 font-semibold">✓ Yes</span>
//                   ) : (
//                     <span className="text-gray-400">No</span>
//                   )}
//                 </td>
//               ))}
//             </tr>

//             {/* Backlog Allowed */}
//             <tr className="border-b border-gray-200">
//               <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">
//                 Backlog Allowed:
//               </td>
//               {selectedProgram.map((program, index) => (
//                 <td key={index} className="px-6 py-4 text-center border-l border-gray-200">
//                   {program.metaInfo?.backlog || '0'}
//                 </td>
//               ))}
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* Footer Actions */}
//       <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
//         <button
//           onClick={() => setShowCompare(false)}
//           className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
//         >
//           Close
//         </button>
//         <button
//           onClick={() => {
//             downloadPDF(selectedProgram);
//             setShowCompare(false);
//           }}
//           className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
//         >
//           <FileDown className="w-4 h-4" />
//           Download PDF
//         </button>
//         <button
//           onClick={() => {
//             downloadExcel(selectedProgram);
//             setShowCompare(false);
//           }}
//           className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//         >
//           <FileSpreadsheet className="w-4 h-4" />
//           Download Excel
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//         {/* Courses Grid */}
//         <div className="flex flex-col lg:flex-row gap-4 items-start">
//           {/* ================= LEFT SIDEBAR: FILTERS ================= */}
//           <div className="sticky -top-260 self-start">
//             <ProgramFilters
//               filters={filters}
//               handleFilterChange={handleFilterChange}
//               clearFilters={clearFilters}
//               getActiveFilterCount={getActiveFilterCount}
//               countries={countries}
//               universities={universities}
//               categories={categories}
//               studyModes={studyModes}
//               levels={levels}
//               showFilters={showFilters}
//               setShowFilters={setShowFilters}
//               isCleared={isCleared}
//               setIsCleared={setIsCleared}
//             />
//           </div>
//           {/* ================= RIGHT CONTENT: COURSE GRID ================= */}
//           <div className="flex-1 w-full">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
//               {loading ? (
//                 // Compact Skeleton Loading
//                 Array.from({ length: 6 }).map((_, i) => (
//                   <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
//                     <div className="p-4 space-y-3">
//                       <div className="flex items-start gap-3">
//                         <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
//                         <div className="flex-1 space-y-2">
//                           <div className="h-4 w-28 bg-gray-100 rounded"></div>
//                           <div className="h-6 w-20 bg-gray-100 rounded"></div>
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="h-6 w-full bg-gray-100 rounded"></div>
//                         <div className="h-6 w-6/4 bg-gray-100 rounded"></div>
//                       </div>
//                       <div className="grid grid-cols-3 gap-2">
//                         <div className="h-16 bg-gray-100 rounded-lg"></div>
//                         <div className="h-16 bg-gray-100 rounded-lg"></div>
//                         <div className="h-16 bg-gray-100 rounded-lg"></div>
//                       </div>
//                       <div className="h-9 bg-gray-100 rounded-lg"></div>
//                     </div>
//                   </div>
//                 ))
//               ) : courses.length === 0 ? (
//                 <div className="col-span-full text-center py-12">
//                   <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
//                     <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">No programs found</h3>
//                   <p className="text-gray-500 text-base">Try adjusting your search or filters</p>
//                   <button
//                     onClick={clearFilters}
//                     className="mt-5 px-5 py-2 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/90 transition-colors"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               ) : (
//                 courses.map((course, index) => {

//                   const metaInfo = course?.metaInfo || {};

//                   const intakeDeadline = metaInfo?.intakeDeadline || "";

//                   const today = new Date();
//                   today.setHours(0, 0, 0, 0);

//                   const intakeData = intakeDeadline
//                     ? intakeDeadline.split(",").map((item) => {
//                       const [month, date] = item.split(":");

//                       const [day, monthNo, year] = date.split("-");

//                       const deadline = new Date(
//                         Number(year),
//                         Number(monthNo) - 1,
//                         Number(day)
//                       );

//                       return {
//                         month,
//                         deadline,
//                         deadlineText: date,
//                         isClosed: deadline < today,
//                       };
//                     })
//                     : [];

//                   const openIntakes = intakeData.filter((item) => !item.isClosed);
//                   const closedIntakes = intakeData.filter((item) => item.isClosed);

//                   const monthOrder = {
//                     Jan: 0,
//                     Feb: 1,
//                     Mar: 2,
//                     Apr: 3,
//                     May: 4,
//                     Jun: 5,
//                     Jul: 6,
//                     Aug: 7,
//                     Sep: 8,
//                     Oct: 9,
//                     Nov: 10,
//                     Dec: 11,
//                   };

//                   const currentMonth = new Date().getMonth();

//                   const upcomingIntakes =
//                     course?.metaInfo?.Intakes?.split(",")
//                       .map((item) => item.trim())
//                       .filter((month) => monthOrder[month] >= currentMonth) || [];


//                   const fallbackIntakes =
//                     metaInfo?.Intakes?.split(",").map((item) => item.trim()) || [];

//                   const fallbackClosed = metaInfo?.IntakesClosed
//                     ? metaInfo.IntakesClosed.split(",").map((item) => {
//                       const [month, year, open, closed, remark] = item.split(":::");
//                       return {
//                         month: month.trim(),
//                         remark: remark || "Deadline passed.",
//                       };
//                     })
//                     : [];

//                   const fallbackClosedMonths = fallbackClosed?.map((item) => item.month);

//                   const fallbackOpenMonths = fallbackIntakes.filter(
//                     (month) => !fallbackClosedMonths?.includes(month)
//                   );

//                   const deadlineMap =
//                     metaInfo?.deadline && metaInfo.deadline !== "ASAP"
//                       ? Object.fromEntries(
//                         metaInfo?.deadline?.split(",")?.map((item) => {
//                           const [month, deadline] = item.split(":");
//                           return [month?.trim(), deadline?.trim()];
//                         })
//                       )
//                       : {};

//                   const isAsap = metaInfo?.deadline;

//                   return (
//                     <div
//                       key={course._id}
//                       className="fade-in-up"
//                       style={{ animationDelay: `${index * 0.05}s` }}
//                     >
//                       {/* Compact Card */}
//                       <div className={`  rounded-lg p-4 transition-all duration-200  hover:shadow-md hover:scale-101 h-full flex flex-col ${selectedProgram.some((item) => item._id === course._id) ? "border border-orange-500 bg-[#fefaf8]" : "border border-gray-200 bg-white"} `}>

//                         {/* Header */}
//                         <div className="flex gap-3 mb-3 relative">
//                           {/* Logo */}
//                           <div className="flex-shrink-0">
//                             {course.university?.uni_logo ? (
//                               <img
//                                 src={course.university?.uni_logo || "/images/newlogo3.png"}
//                                 alt={course.university?.name}
//                                 onError={(e) => {
//                                   e.currentTarget.src =
//                                     "/images/newlogo3.png";
//                                 }}
//                                 className="w-18 h-18 object-contain border border-gray-200 rounded-lg p-1.5 bg-gray-50"
//                               />
//                             ) : (
//                               <div className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
//                                 <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                                 </svg>
//                               </div>
//                             )}
//                           </div>

//                           {/* Course Info */}
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-semibold text-orange-500 line-clamp-1 text-base leading-tight mb-0.5">
//                               {course.name}
//                             </h3>
//                             <p className="text-base font-medium text-gray-600 truncate mb-1">
//                               {course.university?.name}
//                             </p>
//                             <div className="flex items-center gap-1">
//                               <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                               </svg>
//                               <span className="text-base text-gray-500 truncate">
//                                 {course.university?.city}, {course.university?.country}
//                               </span>
//                             </div>
//                           </div>

//                           {profile.role === "counsellor" ? (<div className="absolute top-1 -right-1">
//                             <input
//                               type="checkbox"
//                               checked={selectedProgram.some(
//                                 (item) => item._id === course._id
//                               )}
//                               onChange={() => handleCompareSelect(course)}
//                               className="w-5 h-5 accent-primary cursor-pointer"
//                             />
//                           </div>) : null}
//                         </div>

//                         {/* Description */}
//                         {/* {course.description && (
//                           <div className="mb-3">
//                             <div className="w-6 h-0.5 bg-primary rounded-full mb-1.5"></div>
//                             <p className="text-base text-gray-600 leading-relaxed line-clamp-2" title={course.description}>
//                               {course.description}
//                             </p>
//                           </div>
//                         )} */}

//                         {/* Key Details - Compact Grid */}
//                         <div className="grid grid-cols-3 gap-2 mb-3">
//                           {/* Tuition Fee */}
//                           <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
//                             <div className="flex items-center gap-1 mb-0.5">
//                               <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                               </svg>
//                               <span className="text-[11px] font-medium text-gray-500">Yearly Tuition</span>
//                             </div>
//                             <p className="font-bold text-gray-900 text-base">
//                               {course.tuitionFee || 0 + course.currency} {course?.currency}
//                             </p>
//                           </div>

//                           {/* Duration */}
//                           <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
//                             <div className="flex items-center gap-1 mb-0.5">
//                               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                               </svg>
//                               <span className="text-[11px] font-medium text-gray-500">Duration</span>
//                             </div>
//                             <p className="font-semibold text-gray-800 text-base">
//                               {course.duration || 'N/A'}
//                             </p>
//                           </div>

//                           {/* Application Fee */}
//                           <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
//                             <div className="flex items-center gap-1 mb-0.5">
//                               <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                               </svg>
//                               <span className="text-[11px] font-medium text-gray-500">App. Fee</span>
//                             </div>
//                             <p className="font-semibold text-gray-800 text-base">
//                               {course.applicationFee || 0 + course.currency}
//                             </p>
//                           </div>
//                         </div>

//                         {metaInfo?.AverageScholarship && <div className="flex gap-4 items-center">
//                           <div><h4 className="text-sm font-bold text-gray-700 mb-2">
//                             Average Scholarship
//                           </h4></div>

//                           <div className="flex items-center gap-2 mb-2">
//                             <span className="text-sm font-semibold text-black">
//                               {metaInfo?.AverageScholarship || "N/A"} {" "}{course?.currency}
//                             </span>

//                             {metaInfo?.AverageScholarshipRemarks && (
//                               <div className="relative group">
//                                 <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

//                                 <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden w-64 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-sm leading-5 text-white shadow-lg group-hover:block">
//                                   {metaInfo.AverageScholarshipRemarks}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>}

//                         {metaInfo?.initialDeposit && <div className="flex gap-4 items-center">
//                           <div><h4 className="text-sm font-bold text-gray-700 mb-2">
//                             Initial Deposit
//                           </h4></div>

//                           <div className="flex items-center gap-2 mb-2">
//                             <span className="text-sm font-semibold text-black">
//                               {metaInfo?.initialDeposit || "N/A"} {" "}{course?.currency}
//                             </span>

//                             {metaInfo?.initialDeposit && (
//                               <div className="relative group">
//                                 <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

//                                 <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden w-64 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-sm leading-5 text-white shadow-lg group-hover:block">
//                                   {metaInfo.initialDeposit}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>}

//                         {/* Tags - Compact */}


//                         {/* Intakes - Compact */}
//                         <div className="mb-3 space-y-2">
//                           {/* Open Intakes */}
//                           {openIntakes.length > 0 && (
//                             <div className="flex items-start gap-3">
//                               <span className="min-w-[60px] rounded-full bg-green-100 px-2 py-1 text-center text-sm font-semibold text-green-700">
//                                 Open
//                               </span>

//                               <div className="flex flex-wrap gap-2">
//                                 {openIntakes.map((item) => (
//                                   <div key={item.month} className="group relative">
//                                     <span className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
//                                       <Calendar1 className="h-4 w-4" />
//                                       {item.month}

//                                       <Info className="h-3 w-3 text-gray-500" />
//                                     </span>

//                                     <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
//                                       Deadline: {item.deadlineText}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                           {/* Closed Intakes */}
//                           {closedIntakes.length > 0 && (
//                             <div className="flex items-start gap-3">
//                               <span className="min-w-[60px] rounded-full bg-red-100 px-2 py-1 text-center text-sm font-semibold text-red-700">
//                                 Closed
//                               </span>

//                               <div className="flex flex-wrap gap-2">
//                                 {closedIntakes.map((item) => (
//                                   <div key={item.month} className="group relative">
//                                     <span className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
//                                       <Calendar1 className="h-4 w-4" />
//                                       {item.month}

//                                       <Info className="h-3 w-3 text-gray-500" />
//                                     </span>

//                                     <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
//                                       Deadline passed. It will come again soon.
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                           {/* Fallback */}
//                           {/* Fallback */}
//                           {openIntakes.length === 0 &&
//                             closedIntakes.length === 0 &&
//                             fallbackIntakes.length > 0 && (
//                               <div className="space-y-2">

//                                 {/* Open */}
//                                 {fallbackOpenMonths.length > 0 && (
//                                   <div className="flex items-start gap-3">
//                                     <span className="min-w-[60px] rounded-full bg-green-100 px-2 py-1 text-center text-sm font-semibold text-green-700">
//                                       Open
//                                     </span>

//                                     <div className="flex flex-wrap gap-2">
//                                       {fallbackOpenMonths.map((month) => (
//                                         <div key={month} className="group relative">
//                                           <span className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
//                                             <Calendar1 className="h-4 w-4" />
//                                             {month}

//                                             <Info className="h-3 w-3 text-gray-500 cursor-pointer" />
//                                           </span>

//                                           <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
//                                             {isAsap
//                                               ? "Deadline: ASAP"
//                                               : `Deadline: ${deadlineMap[month] || "ASAP"}`}
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* Closed */}
//                                 {fallbackClosed.length > 0 && (
//                                   <div className="flex items-start gap-3">
//                                     <span className="min-w-[60px] rounded-full bg-red-100 px-2 py-1 text-center text-sm font-semibold text-red-700">
//                                       Closed
//                                     </span>

//                                     <div className="flex flex-wrap gap-2">
//                                       {fallbackClosed.map((item) => (
//                                         <div key={item.month} className="group relative">
//                                           <span className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
//                                             <Calendar1 className="h-4 w-4" />
//                                             {item.month}
//                                             <Info className="h-3 w-3 text-gray-500" />
//                                           </span>

//                                           <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white group-hover:block">
//                                             {item.remark}
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                         </div>


//                         {/* Action Buttons - Compact */}
//                         <div className="flex items-center gap-2 mt-auto pt-4">
//                           <Link
//                             href={`/dashboard/programs/${course.slug}`}
//                             className="flex-1 text-center px-3 py-1.5 bg-white border border-orange-500 text-orange-500 rounded-md text-base font-medium transition-all duration-200 "
//                           >
//                             View Details
//                           </Link>

//                           <button
//                             onClick={() => {
//                               setSelectedCourse(course);
//                               setIsModalOpen(true);
//                             }}
//                             className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#f26d44] border border-primary/40 text-white rounded-md text-base font-medium transition-all duration-200 "
//                           >
//                             Apply
//                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>

//                       <style jsx>{`
//               @keyframes fadeInUp {
//                 from {
//                   opacity: 0;
//                   transform: translateY(15px);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0);
//                 }
//               }
              
//               .fade-in-up {
//                 opacity: 0;
//                 animation: fadeInUp 0.4s ease forwards;
//               }
//             `}</style>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>


//         {/* Infinite Scroll Loader */}
//         <div ref={observerTarget} className="py-8">
//           {loadingMore && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center"
//             >
//               <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
//               <p className="mt-3 text-base text-gray-800">Loading more programs...</p>
//             </motion.div>
//           )}
//           {!hasMore && courses.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-8"
//             >

//               <p className="text-gray-800">You've explored all programs</p>
//               <p className="text-base text-gray-800/70 mt-1">
//                 Showing {courses.length} programs
//               </p>
//             </motion.div>
//           )}
//         </div>

//         {/* Application Modal */}
//         <CreateApplicationModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onApplicationCreated={() => {
//             // Refresh applications list or show success message
//           }}
//           program={selectedCourse}
//         />
//       </div>
//     </main>
//   )
// }