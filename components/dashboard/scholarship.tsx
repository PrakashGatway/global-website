"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap,
    MapPin,
    Calendar,
    Award,
    Filter,
    X,
    ChevronDown,
    ExternalLink,
    BookOpen,
    DollarSign,
    Clock
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import axiosInstance from "@/app/axiosInstance";

interface Scholarship {
    _id: string;
    title: string;
    description: string;
    slug: string;
    level: string[];
    fundingType: string;
    studyMode: string;
    deliveryMode: string;
    amount: string;
    deadline: string;
    intake: string;
    selectionBasis: string;
    country: {
        _id: string;
        name: string;
        flag?: string;
    };
    university: {
        _id: string;
        name: string;
        logo?: string;
    };
    subject?: {
        _id: string;
        name: string;
    };
}

interface CourseDetailScholarshipsProps {
    countryId: string;
    universityId?: string;
    subjectId?: string;
    limit?: number;
    showFilters?: boolean;
    title?: string;
}

export default function CourseDetailScholarships({
    countryId,
    universityId,
    subjectId,
    limit = 5,
    showFilters = true,
    title = "Available Scholarships"
}: CourseDetailScholarshipsProps) {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: limit,
        totalPages: 0
    });

    // Filter states
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);
    const [filters, setFilters] = useState({
        level: "",
        fundingType: "",
        studyMode: "",
        deliveryMode: ""
    });

    // Available filter options (populated from API response or predefined)
    const [availableFilters, setAvailableFilters] = useState({
        levels: [] as string[],
        fundingTypes: [] as string[],
        studyModes: [] as string[],
        deliveryModes: [] as string[]
    });

    useEffect(() => {
        fetchScholarships();
    }, [countryId, universityId, subjectId, pagination.page, filters]);

    const fetchScholarships = async () => {
        try {
            setLoading(true);

            // Build query parameters
            const params = new URLSearchParams({
                country: countryId,
                page: pagination.page.toString(),
                limit: pagination.limit.toString()
            });

            if (universityId) params.append("university", universityId);
            if (subjectId) params.append("subject", subjectId);
            if (filters.level) params.append("level", filters.level);
            if (filters.fundingType) params.append("fundingType", filters.fundingType);
            if (filters.studyMode) params.append("studyMode", filters.studyMode);
            if (filters.deliveryMode) params.append("deliveryMode", filters.deliveryMode);

            const response = await axiosInstance.get(`/scholarships/public/list?${params.toString()}`);
            const data = response.data;

            if (data.success) {
                setScholarships(data.data);
                setPagination(data.pagination);

                // Extract unique filter options from results
                const levels = new Set<string>();
                const fundingTypes = new Set<string>();
                const studyModes = new Set<string>();
                const deliveryModes = new Set<string>();

                data.data.forEach((s: Scholarship) => {
                    s.level?.forEach(l => levels.add(l));
                    if (s.fundingType) fundingTypes.add(s.fundingType);
                    if (s.studyMode) studyModes.add(s.studyMode);
                    if (s.deliveryMode) deliveryModes.add(s.deliveryMode);
                });

                setAvailableFilters({
                    levels: Array.from(levels),
                    fundingTypes: Array.from(fundingTypes),
                    studyModes: Array.from(studyModes),
                    deliveryModes: Array.from(deliveryModes)
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to load scholarships");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
    };

    const clearFilters = () => {
        setFilters({
            level: "",
            fundingType: "",
            studyMode: "",
            deliveryMode: ""
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== "");

    // Scholarship Card Component
    const ScholarshipCard = ({ scholarship }: { scholarship: Scholarship }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl border-2 border-[#F26D44]/30 p-5 transition-all duration-300 group"
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Scholarship Details */}
                <div className="flex-1">
                    <Link href={`/scholarships/${scholarship.slug}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-[#F26D44] transition-colors mb-2">
                            {scholarship.title}
                        </h3>
                    </Link>

                    <p className="text-base text-gray-800 mb-2">At {scholarship.university?.name}</p>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {scholarship.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {scholarship.level?.map((lvl, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-100 text-gray-700 rounded-full text-xs font-medium">
                                {lvl}
                            </span>
                        ))}
                        {scholarship.fundingType && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                {scholarship.fundingType}
                            </span>
                        )}
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{scholarship.country?.name}</span>
                        </div>
                       
                        {scholarship.deadline && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <span>Deadline: {format(new Date(scholarship.deadline), 'dd MMM yyyy')}</span>
                            </div>
                        )}
                        {scholarship.selectionBasis && (
                            <div className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-gray-400" />
                                <span>{scholarship.selectionBasis}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* View Details Button */}
                <div className="flex items-center">
                    <Link
                        href={`/dashboard/scholarships/${scholarship.slug}`}
                        className="px-4 py-2 text-sm font-medium text-[#F26D44] hover:text-white border border-[#F26D44] hover:bg-[#F26D44] rounded-lg transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );

    // Filter Panel Component
    const FilterPanel = () => (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 rounded-xl p-4 mb-4 overflow-hidden"
        >
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Filter Scholarships</h4>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-[#F26D44] hover:text-[#F26D44]/80 flex items-center gap-1"
                    >
                        <X className="w-3 h-3" />
                        Clear All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Level Filter */}
                <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange("level", e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                >
                    <option value="">All Levels</option>
                    {availableFilters.levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>

                {/* Funding Type Filter */}
                <select
                    value={filters.fundingType}
                    onChange={(e) => handleFilterChange("fundingType", e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                >
                    <option value="">All Funding Types</option>
                    {availableFilters.fundingTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                {/* Study Mode Filter */}
                <select
                    value={filters.studyMode}
                    onChange={(e) => handleFilterChange("studyMode", e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                >
                    <option value="">All Study Modes</option>
                    {availableFilters.studyModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                    ))}
                </select>

                {/* Delivery Mode Filter */}
                <select
                    value={filters.deliveryMode}
                    onChange={(e) => handleFilterChange("deliveryMode", e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                >
                    <option value="">All Delivery Modes</option>
                    {availableFilters.deliveryModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                    ))}
                </select>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-4 mt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>

                {/* {showFilters && (
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-[#F26D44] text-white rounded-full text-xs flex items-center justify-center">
                {Object.values(filters).filter(v => v !== "").length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFiltersPanel ? "rotate-180" : ""}`} />
          </button>
        )} */}
            </div>

            {/* Filter Panel */}
            {/* <AnimatePresence>
        {showFiltersPanel && <FilterPanel />}
      </AnimatePresence> */}

            {/* Loading State */}
            {loading && (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="flex gap-2">
                                        <div className="h-6 bg-gray-200 rounded w-16" />
                                        <div className="h-6 bg-gray-200 rounded w-16" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchScholarships}
                        className="mt-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Scholarships List */}
            {!loading && !error && (
                <>
                    {scholarships.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            <div className="space-y-3">
                                {scholarships.map((scholarship) => (
                                    <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
                                ))}
                            </div>
                        </AnimatePresence>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <h4 className="text-lg font-medium text-gray-900 mb-1">No Scholarships Found</h4>
                            <p className="text-sm text-gray-600">
                                No scholarships match your current filters. Try adjusting your criteria.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-gray-600">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>

                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}