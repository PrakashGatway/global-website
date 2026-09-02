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
  Trophy,
  Award,
  FileText,
  DollarSign,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import AmazingSelect, { ModernSelect } from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useGlobal } from "@/src/statecontext";
import Select from "react-select";

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

function CourseShortlist({ isOpen, onClose, setSelectedCount }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(0);
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
      setSelected(res.data.data.filter((ele) => ele?.selected).length || 0);
    } catch (err) {
      setError("Failed to load. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchCourses(page);
  }, [isOpen, page, fetchCourses]);

  const toggleCourse = async (id) => {
    await axiosInstance.patch("/auth/edit-doc", { categorie_shortlist: id });
    fetchCourses(page);
    setSelectedCount?.(
      (prev) => prev + (list.find((e) => e.name === id)?.selected ? -1 : 1),
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col max-h-[85vh]">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
          <h2 className="text-xl font-bold text-white">
            Choose Your Field of Study
          </h2>
          <p className="text-indigo-100 text-sm mt-1">{totalItems} available</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <Loader2
              size={32}
              className="animate-spin mx-auto text-indigo-600"
            />
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading &&
            !error &&
            list.map((ele) => (
              <button
                key={ele.id}
                onClick={() => toggleCourse(ele.name)}
                className={`w-full flex items-center gap-3 p-3 border-2 mb-2
                ${ele.selected ? "border-indigo-600 bg-indigo-50" : "border-gray-100 hover:border-indigo-200"}`}
              >
                <span>{ele.selected ? "✓" : ""}</span>
                <span className="font-semibold">{ele.name}</span>
                <span className="text-sm text-gray-500 ml-auto">
                  {ele.description}
                </span>
              </button>
            ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-3 bg-gray-50">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 ${page === i + 1 ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between p-4 border-t">
          <span>{selected} selected</span>
          <button
            onClick={onClose}
            disabled={selected < 2}
            className="px-6 py-2 bg-indigo-600 text-white disabled:bg-gray-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UniversitiesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    axiosInstance.get("/courses/categories?page=1&limit=10").then((res) => {
      const count = res.data.data.filter((ele) => ele?.selected).length || 0;
      setSelectedCount(count);
      setIsOpen(count < 2);
      setHasChecked(true);
    });
  }, []);

  return (
    <div>
      {/* {hasChecked && selectedCount < 2 && ( 
         <CourseShortlist
           isOpen={isOpen}
           onClose={() => setIsOpen(false)}
           setSelectedCount={setSelectedCount}
         />
       )}*/}

      <Suspense fallback={<div>Loading...</div>}>
        <UniversitiesPageClient />
      </Suspense>
    </div>
  );
}

function UniversitiesPageClient() {
  const { allProfile, profile } = useGlobal();

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
  const searchParams = useSearchParams();
  const [total, setTotal] = useState(0);
  const pathname = usePathname();
  const queryCountry = searchParams.get("country");
  const router = useRouter();
  // Filters state
  const [filters, setFilters] = useState({
    country: [],
    category: "", // add this
    intake: [],
    city: "",
    uni_type: "",
    has_accommodation: "",
    min_acceptance_rate: "",
    max_acceptance_rate: "",
    sort_by: "name",
    sort_order: "asc",
  }) as any;

  // useEffect(() => {
  //   

  //   const preferredCountries =
  //     allProfile?.profile?.preferences?.preferredCountries || [];

  //   const countryCodes = countries
  //     .filter((c) => preferredCountries.includes(c.label))
  //     .map((c) => c.value);

  //   const shortlistCategories =
  //     allProfile?.profile?.otherDetails?.categorie_shortlist?.join(",") || "";

  //   setFilters((prev) => ({
  //     ...prev,
  //     country: countryCodes,
  //     category: shortlistCategories,
  //   }));
  // }, [searchParams, allProfile, countries]);

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
  const fetchUniversities = useCallback(
    async (reset = false) => {
      try {
        const currentPage = reset ? 1 : page;

        const selectedCountries =
          filters.country.length > 0
            ? filters.country
            : queryCountry
              ? [queryCountry]
              : [];

        // Build query parameters based on backend controller
        const params = new URLSearchParams({
          withCountry: true,
          page: currentPage.toString(),
          isWeb: "true",
          limit: "9",
          ...(debouncedSearchQuery && { name: debouncedSearchQuery }),
          ...(selectedCountries.length > 0 && {
            country: selectedCountries.join(","),
          }),
          ...(filters.city && { city: filters.city }),
          ...(filters.uni_type && { type: filters.uni_type }),
          ...(filters.intake.length > 0 && { intake: filters.intake }), // Backend expects 'intake' param to be present for filtering
        });

        const response = await axiosInstance.get(`/universities?${params}`);
        const data = response.data.result;

        if (reset) {
          setUniversities(data || []);
        } else {
          setUniversities((prev) => [...prev, ...(data || [])]);
        }

        setTotal(response.data.total);

        setHasMore(response.data.page < response.data.totalPages || false);
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [page, debouncedSearchQuery, filters],
  );

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    if (queryCountry) {
      setFilters((prev) => ({
        ...prev,
        country: [queryCountry],
      }));

      const params = new URLSearchParams(searchParams.toString());
      params.delete("country");

      router.replace(
        params.toString() ? `${pathname}?${params}` : pathname,
        { scroll: false }
      );
    }
  }, [queryCountry]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchUniversities(true);
  }, [debouncedSearchQuery, filters]);

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
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.country.length > 0) count++;
    if (filters.city) count++;
    if (filters.uni_type) count++;
    if (filters.has_accommodation) count++;
    if (filters.min_acceptance_rate) count++;
    if (filters.max_acceptance_rate) count++;
    if (filters.intake.length > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const clearFilters = () => {
    setFilters({
      country: [],
      category: "",
      city: "",
      uni_type: "",
      has_accommodation: "",
      min_acceptance_rate: "",
      max_acceptance_rate: "",
      sort_by: "name",
      sort_order: "asc",
      intake: [],
    });
    setSearchQuery("");
    setPage(1);
  };





  const intakeOptions = [
    // Monthly Intakes
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
    { value: "Spring", label: "Spring" },
    { value: "Summer", label: "Summer" },
    { value: "Fall", label: "Fall" },
    { value: "Autumn", label: "Autumn" },
    { value: "Winter", label: "Winter" }
  ];

  // Mobile filter toggle
  const toggleMobileFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    if (
      allProfile?.profile?.preferences?.preferredCountries?.length &&
      filters.country.length === 0
    ) {
      const countryCodes = countries
        .filter((c) =>
          allProfile.profile.preferences.preferredCountries.includes(c.label)
        )
        .map((c) => c.value);

      setFilters((prev) => ({
        ...prev,
        country: countryCodes,
      }));
    }
  }, [allProfile, countries]);


  return (
    <main className="mx-auto sm:px-4 sm:py-6 ">
      {/* Hero Section */}
      <div className="flex max-w-[1600px] flex-col md:flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-white border border-orange-100 p-6 mb-8 px-4 rounded-xl">
        <div className="mb-6 md:mb-0">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-orange-100 text-orange-600 rounded-full mb-3">
            Global University Search
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Find Universities That Match Your Ambitions
          </h1>
          <p className="text-gray-600 text-sm max-w-xl">
            Browse thousands of universities, filter by country, intake, and study level to find the perfect destination for your future.
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center sm:px-8">
          <img src="/shapes/2.webp" alt="uni" className="w-40 scale-160" />
        </div>
      </div>

      {/* --- NEW TOP FILTER BAR SECTION --- */}
      <div className="bg-white max-w-[1600px] border border-gray-200 rounded-xl p-4 px-4 mb-8 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">

          {/* 1. Search Input */}
          <div className="flex-grow min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search scholarships by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 border border-orange-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-sm transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 2. Country Select */}
          <div className="min-w-[160px] flex-grow md:flex-grow-0">
            <Select
              isMulti
              options={countries.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
              value={countries
                .filter((c) => filters.country?.includes(c.value))
                .map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
              onChange={(selected) =>
                setFilters((prev) => ({
                  ...prev,
                  country: selected?.map((item) => item.value) || [],
                }))
              }
              placeholder="All Countries"
              classNamePrefix="custom-select"
              styles={{
                control: (base, state) => ({
                  ...base, minHeight: '42px', borderColor: state.isFocused ? "#f97316" : "#f97316", borderRadius: '8px', boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(249, 115, 22, 0.25)" // orange ring
                    : "none",
                  "&:hover": {
                    borderColor: "#f97316",
                  },
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          </div>

          {/* 3. Intake Select */}
          <div className="min-w-[160px] flex-grow md:flex-grow-0">
            <Select
              isMulti
              options={intakeOptions}
              value={intakeOptions.filter((item) => filters.intake?.includes(item.value))}
              onChange={(selected) => setFilters({ ...filters, intake: selected?.map((item) => item.value) || [] })}
              placeholder="All Levels" // Using "All Levels" as per screenshot, or change to "All Intakes"
              classNamePrefix="custom-select"
              styles={{
                control: (base, state) => ({
                  ...base, minHeight: '42px', borderColor: state.isFocused ? "#f97316" : "#f97316", borderRadius: '8px', boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(249, 115, 22, 0.25)" // orange ring
                    : "none",
                  "&:hover": {
                    borderColor: "#f97316",
                  }, borderRadius: '8px'
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          </div>

          {/* 4. Funding/Type Select (Mapped to your uni_type logic) */}
          <div className="min-w-[160px] flex-grow md:flex-grow-0">
            <Select
              options={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' }
              ]}
              value={filters.uni_type ? [{ value: filters.uni_type, label: filters.uni_type === 'public' ? 'Public' : 'Private' }] : null}
              onChange={(selected) => handleFilterChange("uni_type", selected?.value || "")}
              placeholder="All Funding Types"
              isClearable
              classNamePrefix="custom-select"
              styles={{
                control: (base, state) => ({
                  ...base, minHeight: '42px', borderColor: state.isFocused ? "#f97316" : "#f97316", borderRadius: '8px', boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(249, 115, 22, 0.25)" // orange ring
                    : "none",
                  "&:hover": {
                    borderColor: "#f97316",
                  }, borderRadius: '8px'
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          </div>



          {/* 6. Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Grid/List Toggle Icons (Visual only based on screenshot) */}
            <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
              <button className="p-2 bg-orange-50 text-orange-600"><Filter className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:bg-gray-50"><div className="w-4 h-4 border-l-2 border-r-2 border-current mx-0.5"></div></button>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => {/* Trigger manual search if needed, otherwise filters are live */ }}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-md shadow-orange-200"
            >
              <Filter className="w-4 h-4" />
              <span>Apply</span>
            </button>
          </div>
        </div>

        {/* Active Filters Chips Row (Optional: Shows below inputs if active) */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Active:</span>

            {filters.country.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-100">
                {filters.country.length} Countries
                <button onClick={() => handleFilterChange("country", [])}><X className="w-3 h-3 hover:text-orange-900" /></button>
              </span>
            )}

            {filters.intake.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-100">
                {filters.intake.length} Intakes
                <button onClick={() => handleFilterChange("intake", [])}><X className="w-3 h-3 hover:text-orange-900" /></button>
              </span>
            )}

            {filters.uni_type && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-100">
                {filters.uni_type.charAt(0).toUpperCase() + filters.uni_type.slice(1)}
                <button onClick={() => handleFilterChange("uni_type", "")}><X className="w-3 h-3 hover:text-orange-900" /></button>
              </span>
            )}

            <button onClick={clearFilters} className="ml-auto text-xs text-gray-500 hover:text-red-500 underline decoration-dotted">
              Clear all
            </button>
          </div>
        )}
      </div>
      {/* --- END TOP FILTER BAR --- */}


      {/* Results Count Header */}
      {!loading && universities.length > 0 && (
        <div className="mb-4 px-2">
          <p className="text-sm text-gray-500">
            Found <span className="font-bold text-gray-900">{total}</span> universities
          </p>
        </div>
      )}

      {/* University Cards Grid */}
      <div className="bg-[#fffbf6]">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-[1600px] "
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gradient-to-br from-muted to-muted/50"></div>
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded"></div>
                        <div className="h-3 w-24 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-12 bg-muted rounded"></div>
                    <div className="h-12 bg-muted rounded"></div>
                    <div className="h-12 bg-muted rounded"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </div>
            ))
          ) : universities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-full">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No universities found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded-lg"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            universities.map((uni, index) => (
              <motion.div
                key={index}
                className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.35)]  hover:scale-103 transition-all duration-300 flex flex-col h-full border-t-4 border-t-orange-500 border border-orange-500"
              >
                <div className="p-5 flex flex-col flex-1">
                  {/* Header - Orange Icon + Title */}
                  <div className="flex items-start gap-4 mb-3">
                    {/* Orange Circular Icon */}
                    <div className="flex-shrink-0 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{uni.city}, {uni?.country?.name?.slice(0, 2)?.toUpperCase() || "IT"}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        Study at the {uni.name}—a globally renowned institution in.........
                      </p>


                      {/* Program Tags */}
                      {uni.tags && (
                        <div className="flex flex-wrap gap-2 my-2">
                          {uni.tags
                            .split(",")
                            .slice(0, 4)
                            .map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* Intakes Section */}
                      <div
                        className={`flex items-center gap-3 my-2 ${uni?.intakes?.length > 0 ? "visible" : "invisible"}`}
                      >
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                          INTAKES
                        </span>

                        <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-green-600 bg-green-50 border border-green-200 rounded-lg">
                          Open
                        </span>

                        {uni?.intakes?.length > 0 && (
                          <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg">
                            {uni.intakes[0]}
                          </span>
                        )}
                      </div>
                    </div>


                  </div>



                  {/* Stats Section - Cream Background */}
                  <div className="bg-orange-50/50 rounded-xl border border-orange-100 mb-4 mt-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-orange-200">
                      {/* QS Ranking */}
                      <div className="px-2 py-4  flex md:justify-center items-center gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-lg">🏆</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">QS Ranking</p>
                          <p className="text-sm font-bold text-gray-900">
                            #{uni?.uni_rank?.[0]?.rank?.split(/[-–]/)[0] || "42"}
                          </p>
                        </div>
                      </div>

                      {/* Tuition Fee */}
                      <div className="px-2 py-4 flex md:justify-center items-center gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-lg">💰</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Tution Fee Yearly</p>
                          <p className="text-sm font-bold text-gray-900">
                            {uni.financials?.ug_fees || "$3,000+"}
                          </p>
                        </div>
                      </div>

                      {/* Programs */}
                      <div className="px-2 py-4 flex md:justify-center  items-center gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-lg">📋</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Acceptance Rate</p>
                          <p className="text-sm font-bold text-gray-900">
                            {uni.acceptanceRate || "180+"} {" "}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-center items-center gap-3 mt-auto pt-2">
                    <Link
                      href={`/dashboard/universities/${uni?.slug}`}
                      className="flex items-center px-5 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all duration-300 text-center rounded-xl"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/dashboard/programs?university=${uni._id}`}
                      className="flex items-center px-5 py-3 text-sm font-bold text-orange-500 bg-white border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300 text-center rounded-xl"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Infinite Scroll / Loading More */}
      <div ref={observerTarget} className="py-12 text-center">
        {loadingMore && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <p className="text-sm text-gray-400">Loading more...</p>
          </div>
        )}
        {!hasMore && universities.length > 0 && (
          <p className="text-sm text-gray-400 italic">You've reached the end of the list</p>
        )}
      </div>
    </main>
  );
}