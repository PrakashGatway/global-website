"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Globe,
  Building,
  ChevronDown,
  Loader2,
  Calendar,
  GraduationCap,
  X,
  Check,
  ExternalLink,
  Shield,
  Sparkles,
  Code,
  Palette,
  BarChart,
  Music,
  Camera,
  PenTool,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import AmazingSelect, { ModernSelect } from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useGlobal } from "@/src/statecontext";

interface University {
  _id: string;
  name: string;
  slug: string;
  slogan: string;
  uni_type: string;
  intakes: string | string[];
  short_description: string;
  code: string;
  address: string;
  country: string;
  city: string;
  uni_logo: string;
  cover_photo: string;
  uni_web: string;
  uni_rank: string | number;
  established_year: number;
  on_campus_accommodation: boolean;
  off_campus_accommodation: boolean;
  status: string;
  acceptanceRate: number;
  tags: string;
  offers: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const iconMap = {
  code: Code,
  design: Palette,
  business: BarChart,
  music: Music,
  photo: Camera,
  writing: PenTool,
  default: Sparkles,
};

function CourseShortlist({ isOpen, onClose }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setselected] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchCourses = useCallback(async (currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(
        `/courses/categories?page=${currentPage}&limit=${limit}`,
      );
      setList(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
      const selectedCount = res.data.data.filter((ele) => ele?.selected == true);
      console.log(selectedCount,list); // This returns the correct count

      setselected(selectedCount?.length || 0);
      if(selectedCount?.length > 1){
        onClose();
      }
    } catch (err) {
      setError("Failed to load Field of Study. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    fetchCourses(page);
  }, [isOpen, page, fetchCourses]);

  const toggleCourse = async (id) => {
    // setselected(prev => [...new Set([...prev, id])]);

    const res = await axiosInstance.patch("/auth/edit-doc", {
      categorie_shortlist: id,
    });
    console.log(res);
    fetchCourses(page);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  const handleSubmit = async () => {
    // const selected = list.filter(course => selected.has(course.id));
    console.log("Selected courses:", selected);
    onClose();
  };

  const handleClose = () => {
    setPage(1);
    setselected([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Choose Your Field of Study.</h2>
              <p className="text-indigo-100 text-sm mt-1">
                {totalItems > 0
                  ? `${totalItems} available`
                  : "Select Field of Study that interest you"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 size={32} className="text-indigo-600 animate-spin" />
              <p className="text-gray-500 text-sm">Loading Fields...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-3">{error}</p>
              <button
                onClick={() => fetchCourses(page)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              {list.map((ele) => {
                const IconComponent = iconMap[ele.icon] || iconMap.default;
                // const isSelected = selected.includes(ele._id);

                return (
                  <button
                    key={ele.id}
                    onClick={() => toggleCourse(ele.name)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group
                      ${
                        ele.selected
                          ? "border-indigo-600 bg-indigo-50 shadow-md"
                          : "border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm"
                      }`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                      ${ele.selected ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"}
                    `}
                    >
                      <IconComponent size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-semibold truncate ${ele.selected ? "text-indigo-900" : "text-gray-900"}`}
                        >
                          {ele.name}
                        </h3>
                        {ele.selected && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                        {ele.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={20}
                      className={`flex-shrink-0 transition-colors ${ele.selected ? "text-indigo-600" : "text-gray-300"}`}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {!loading && !error && list.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Sparkles size={40} className="mx-auto mb-3 opacity-50" />
              <p>No Field available</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex-shrink-0 px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`p-2 rounded-lg transition-all
                ${
                  page === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-white hover:shadow-sm hover:text-indigo-600"
                }`}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all
                    ${
                      pageNum === page
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-white hover:shadow-sm hover:text-indigo-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`p-2 rounded-lg transition-all
                ${
                  page === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-white hover:shadow-sm hover:text-indigo-600"
                }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {selected} selected
            </span>
            {totalPages > 1 && (
              <span className="text-xs text-gray-400">
                Page {page} of {totalPages}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selected === 0}
              className={`px-6 py-2 rounded-xl font-medium text-sm transition-all
                ${
                  selected > 0
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Continue {selected}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UniversitiesPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="">
      {/* <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
      >
        Browse Courses
      </button> */}

      <Suspense
        fallback={
          <div className="p-6 text-sm text-muted-foreground">
            Loading universities...
          </div>
        }
      >
        <UniversitiesPageClient />
      </Suspense>

      <CourseShortlist isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
  // return (
  //   <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading universities...</div>}>
  //     <UniversitiesPageClient />
  //   </Suspense>
  // )
}

function UniversitiesPageClient() {

  const {allProfile} = useGlobal()

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [countries, setCountries] = useState([]);
  const filterButtonRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const searchParams = useSearchParams();
  // const search = searchParams.get("country") || "" //
  const [search, setsearch] = useState("");

  useEffect(() => {
    const country = searchParams.get("country") || "";
    if(country) {
    setsearch(country);
    }else {
      setsearch(allProfile?.profile?.otherDetails?.countries_shortlist?.join(",") || "")
    }

  }, [searchParams,allProfile]);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isClickInsideSelect =
        event.target instanceof Element &&
        (event.target.closest("[data-radix-select-content]") ||
          event.target.closest('[data-headlessui-state="open"]') ||
          event.target.closest('[role="listbox"]') ||
          event.target.closest(".select-dropdown"));

      if (
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node) &&
        !isClickInsideSelect
      ) {
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
    country:  "",
    city: "",
    uni_type: "",
    has_accommodation: "",
    min_acceptance_rate: "",
    max_acceptance_rate: "",
    sort_by: "name",
    sort_order: "asc",
  });

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/countries?limit=300");
      const data = response.data.data;
      let formatData = data.map((country: any) => ({
        label: country.name,
        value: country.code,
      }));
      setCountries(formatData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Fetch universities with debounced search
  const fetchUniversities = useCallback(async (reset = false) => {
      try {
        const currentPage = reset ? 1 : page;
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "8",
          ...(debouncedSearchQuery && { name: debouncedSearchQuery }),
          ...(filters.country && { country: filters.country }),
          ...(filters.sort_by && { sort_by: filters.sort_by }),
          ...(filters.city && { city: filters.city }),
          ...(filters.uni_type && { type: filters.uni_type }),
          ...(filters.country === "" && search && { country: search})
        });

        console.log(params,'param',typeof(search))
        const response = await axiosInstance.get(`/universities?${params}`);
        const data = response.data.result;

        if (reset) {
          setUniversities(data || []);
        } else {
          setUniversities((prev) => [...prev, ...(data || [])]);
        }

        setHasMore(response.data.page < response.data.totalPages || false);
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },[page, debouncedSearchQuery, filters,search]);

  // Initial fetch and reset on filter changes
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchUniversities(true);
  }, [debouncedSearchQuery, filters,search]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage((prev) => prev + 1);
          setLoadingMore(true);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadingMore, loading]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1 && !loading) {
      fetchUniversities(false);
    }
  }, [page, fetchUniversities]);

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

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

  const clearFilters = () => {
    setFilters({
      country: "",
      city: "",
      uni_type: "",
      has_accommodation: "",
      min_acceptance_rate: "",
      max_acceptance_rate: "",
      sort_by: "name",
      sort_order: "asc",
    });
    setSearchQuery("");
    setPage(1);
  };

  const getCardGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case "public":
        return "from-blue-500/10 via-blue-400/5 to-transparent";
      case "private":
        return "from-purple-500/10 via-purple-400/5 to-transparent";
      case "government":
        return "from-emerald-500/10 via-emerald-400/5 to-transparent";
      default:
        return "from-gray-500/10 via-gray-400/5 to-transparent";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "public":
        return <Building className="w-4 h-4" />;
      case "private":
        return <Shield className="w-4 h-4" />;
      default:
        return <GraduationCap className="w-4 h-4" />;
    }
  };

  const formatRank = (rank: string | number) => {
    if (!rank || rank === "N/A") return "Unranked";
    return `#${rank}`;
  };

  const getAcceptanceRateColor = (rate: number) => {
    if (rate >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (rate >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getAcceptanceRateLabel = (rate: number) => {
    if (rate >= 70) return "Open Admission";
    if (rate >= 40) return "Moderate";
    return "Selective";
  };

  return (
    <main className="flex-1 overflow-y-auto max-w-7xl mx-auto px-4">
      <div className="space-y-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          
                    {/* Breadcrumb */}
                    {/* <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Link href="/dashboard" className="hover:text-[#F26D44] transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">Countries</span>
                    </div> */}

                    {/* Title */}
                    <div className="w-full rounded-2xl border border-[#E9ECF5] bg-white p-4 sm:p-6 shadow-sm">

                        {/* Header */}
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-[15px] sm:text-[18px] font-semibold text-[#1E2A5A]">
                                Your Preferences
                            </h2>

                            <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 text-[12px] sm:text-[14px] font-medium text-[#4F46E5] hover:opacity-80 transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                                    />
                                </svg>
                                Edit Preferences
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 21h8M12 17v4M7 4h10l1 10H6L7 4z"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Field of Study
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827] leading-snug">
                                       {allProfile?.profile?.otherDetails?.categorie_shortlist?.join(', ')}
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Intake
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827]">
                                        {allProfile?.data?.intake}
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DDF5E8] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#16A34A]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.4 15A7.97 7.97 0 0020 12a8 8 0 10-8 8"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Budget (Tuition Fee)
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827] leading-snug">
                                        Up to {allProfile?.data?.tuitionfee} / year
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Preferred Location
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827] leading-snug">
                                         {allProfile?.profile?.otherDetails?.countries_shortlist?.join(', ')}
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Post Study Work
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827]">
                                        Important
                                    </h3>
                                </div>
                            </div>

                            {/* Card */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#EEF1F7] p-3 sm:p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8EBF5] bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#5B5BD6]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17 20h5V4H2v16h5"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] sm:text-[12px] font-medium text-[#8A94A6]">
                                        Stay Back Period
                                    </p>

                                    <h3 className="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#111827] leading-snug">
                                        Long Term (2+ years)
                                    </h3>
                                </div>
                            </div>

                        </div>
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
              className="flex items-center gap-2 p-2 lg:px-5 lg:py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 relative"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full animate-pulse">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              />
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
                          onChange={(value) =>{
                            console.log(value,"value")
                            handleFilterChange("country", value)}
                          }
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
                            {
                              value: "public",
                              label: "Public",
                              icon: <Building className="w-4 h-4" />,
                            },
                            {
                              value: "private",
                              label: "Private",
                              icon: <Shield className="w-4 h-4" />,
                            },
                          ].map((type) => (
                            <button
                              key={type.value}
                              onClick={() =>
                                handleFilterChange(
                                  "uni_type",
                                  filters.uni_type === type.value
                                    ? ""
                                    : type.value,
                                )
                              }
                              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                                filters.uni_type === type.value
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50 hover:bg-muted"
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
                                <button
                                  onClick={() =>
                                    handleFilterChange("country", "")
                                  }
                                  className="hover:bg-primary/20 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.uni_type && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.uni_type}
                                <button
                                  onClick={() =>
                                    handleFilterChange("uni_type", "")
                                  }
                                >
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
              Found{" "}
              <span className="font-semibold text-foreground">
                {universities.length}
              </span>{" "}
              universities
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
              <div
                key={i}
                className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse"
              >
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
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
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
                key={index}
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
                      title={
                        uni.short_description || "No description available."
                      }
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
                    {(uni.on_campus_accommodation ||
                      uni.off_campus_accommodation) && (
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
                        {uni.tags
                          .split(",")
                          .slice(0, 3)
                          .map((tag, i) => (
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
                      className="flex-1 p-2 lg:px-4 lg:py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-center group-hover:scale-[1.02]"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/dashboard/programs?university=${uni._id}`}
                      className="flex-1 p-2 lg:px-4 lg:py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-center group-hover:scale-[1.02]"
                    >
                      Apply
                    </Link>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 pointer-events-none ${hoveredCard === uni._id ? "opacity-100" : ""}`}
                />
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
              <p className="mt-3 text-sm text-muted-foreground">
                Loading more universities...
              </p>
            </motion.div>
          )}
          {!hasMore && universities.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-muted-foreground">
                You've explored all universities
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Showing {universities.length} universities
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
