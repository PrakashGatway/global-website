// app/scholarship/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, MapPin, Grid, List, ChevronRight, Star, GraduationCap, Globe, Calendar, DollarSign, Filter, Loader2, AlertCircle } from 'lucide-react';
import axiosInstance from '@/app/axiosInstance';
import { useRouter } from 'next/navigation';
import { STUDY_LEVELS } from '@/utils/schema';


// TypeScript Interfaces matching your schema
interface Country {
    _id: string;
    name: string;
    code: string;
}

interface University {
    _id: string;
    name: string;
    slug: string;
}

interface Scholarship {
    _id: string;
    title: string;
    slug: string;
    description: string;
    country: Country;
    university: University | null;
    level: string[];
    fundingType: string;
    studyMode: string;
    deliveryMode: string;
    amount: string;
    deadline: string;
    intake: string;
    eligibilityCriteria: Record<string, any>;
    benefits: Record<string, any>;
    selectionBasis: string;
    howToApply: Record<string, any>;
    isPublished: boolean;
    status: 'Active' | 'Inactive';
    createdAt: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ApiResponse {
    success: boolean;
    pagination?: Pagination;
    data: Scholarship[];
    message?: string;
}

export const scholarshipApi = {
    async getScholarships(params: Record<string, any>): Promise<ApiResponse> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) searchParams.append(key, String(value));
        });

        const response = await axiosInstance.get(`/scholarships/public?${searchParams}`);
        return response.data;
    },

    async getScholarshipBySlug(slug: string): Promise<{ success: boolean; data: Scholarship }> {
        const response = await axiosInstance.get(`/scholarships/slug/${slug}`);
        return response.data;
    }
};

// Filter Options
const FUNDING_TYPES = [
    { value: '', label: 'All Funding Types' },
    { value: 'Full Scholarship', label: 'Full Scholarship' },
    { value: 'Partial Scholarship', label: 'Partial Scholarship' },
    { value: 'Fee waiver/discount', label: 'Fee Waiver' },
    { value: 'Stipend', label: 'Stipend' },
    { value: 'Loan', label: 'Loan' },
    { value: 'Research Grant', label: 'Research Grant' }
];

const DELIVERY_MODES = [
    { value: '', label: 'All Modes' },
    { value: 'Online', label: 'Online' },
    { value: 'Offline', label: 'On-Campus' },
    { value: 'Hybrid', label: 'Hybrid' }
];

const COUNTRIES = [
    { name: "United Kingdom", flag: "🇬🇧", code: "GB" },
    { name: "Canada", flag: "🇨🇦", code: "CA" },
    { name: "Ireland", flag: "🇮🇪", code: "IE" },
    { name: "United States", flag: "🇺🇸", code: "US" },
    { name: "Australia", flag: "🇦🇺", code: "AU" },
    { name: "New Zealand", flag: "🇳🇿", code: "NZ" },
    { name: "Germany", flag: "🇩🇪", code: "DE" },
    { name: "UAE", flag: "🇦🇪", code: "AE" }
];

export default function ScholarshipPage() {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 12, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [SelectedCountry, setSelectedCountry] = useState([])
    const [allCountries, setallCountries] = useState([])

    // Filter states
    const [filters, setFilters] = useState({
        country: '',
        level: '',
        fundingType: '',
        deliveryMode: '',
        search: ''
    });

    const fetchScholarships = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit: 12,
                country: filters.country || "",
                level: filters.level || "",
                fundingType: filters.fundingType || "",
                deliveryMode: filters.deliveryMode || "",
                search: filters.search || ""
            };

            const response = await axiosInstance.get(`/scholarships/public/list?${new URLSearchParams(params)}`);
            setScholarships(response.data.data);
            if (response.data.pagination) setPagination(response.data.pagination);

        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCounries = async () => {
        try {
            const response = await axiosInstance.get(`/countries?limit=100`)
            setallCountries(response?.data?.data)

        }
        catch (error) {
            console.log(error);
            alert("Error...");
        }
    }
    // Initial fetch and filter change
    useEffect(() => {
        fetchScholarships(1);
        fetchCounries()
    }, []);

    // Handle filter change
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchScholarships(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({ country: '', level: '', fundingType: '', deliveryMode: '', search: '' });
        setTimeout(() => {
            fetchScholarships(1);
        }, 200);
    };

    const router = useRouter()

    return (
        <div className="min-h-screen mx-auto sm:px-2 py-2">

            <div className="">
                <h1 className="text-2xl font-bold mb-1">
                    Find Your Perfect Scholarship
                </h1>
                <p className=" max-w-2xl text-sm text-gray-600 mb-6">
                    Discover fully-funded and partial scholarships from top universities worldwide.
                    Your academic journey starts here.
                </p>
            </div>
            <div className="bg-white py-2 sticky top-0 z-20">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => handleFilterChange('country', '')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 whitespace-nowrap transition-all ${!filters.country
                            ? 'border-[#ff6b35] bg-orange-50 text-[#ff6b35]'
                            : 'border-gray-200 hover:border-[#ff6b35] hover:text-[#ff6b35]'
                            }`}
                    >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">All</span>
                    </button>
                    {allCountries.map((country, i) => (
                        <button
                            key={country._id}
                            onClick={() => handleFilterChange('country', country._id)}
                            className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border-2 whitespace-nowrap transition-all ${filters.country === country?._id
                                ? "border-[#ff6b35] bg-orange-50 text-[#ff6b35]"
                                : "border-gray-200 hover:border-[#ff6b35] hover:text-[#ff6b35]"
                                }`}
                        >
                            <img
                                src={country?.flg}
                                alt={country?.name}
                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover flex-shrink-0"
                            />

                            <span className="text-xs sm:text-sm font-medium leading-none">
                                {country?.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="py-2">
                <div className="flex flex-col lg:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-[50%] -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search scholarships by title, university, or subject..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100 transition"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={filters.level}
                            onChange={(e) => handleFilterChange('level', e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100 min-w-[180px]"
                        >
                            <option value="">All Levels</option>
                            {STUDY_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>

                        <select
                            value={filters.fundingType}
                            onChange={(e) => handleFilterChange('fundingType', e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100 min-w-[180px]"
                        >
                            {FUNDING_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>

                        <select
                            value={filters.deliveryMode}
                            onChange={(e) => handleFilterChange('deliveryMode', e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100 min-w-[160px]"
                        >
                            {DELIVERY_MODES.map(mode => (
                                <option key={mode.value} value={mode.value}>{mode.label}</option>
                            ))}
                        </select>

                        {/* View Toggle & Search Button */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 px-3 border rounded-xl transition ${viewMode === 'grid'
                                    ? 'border-[#ff6b35] bg-orange-50 text-[#ff6b35]'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                title="Grid View"
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 px-3 border rounded-xl transition ${viewMode === 'list'
                                    ? 'border-[#ff6b35] bg-orange-50 text-[#ff6b35]'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                title="List View"
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => fetchScholarships(1)}
                                className="bg-[#ff6b35] text-white px-6 py-2.5 rounded-xl hover:bg-[#e55a2b] transition font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <Filter className="w-4 h-4" />
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Filters & Clear */}
                {(filters.country || filters.level || filters.fundingType || filters.deliveryMode || filters.search) && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-500">Active filters:</span>
                        {filters.search && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-[#ff6b35] rounded-full text-sm">
                                Search: "{filters.search}"
                                <button onClick={() => handleFilterChange('search', '')} className="hover:text-red-500">×</button>
                            </span>
                        )}
                        {filters.country && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-[#ff6b35] rounded-full text-sm">
                                {COUNTRIES.find(c => c.code === filters.country)?.name}
                                <button onClick={() => handleFilterChange('country', '')} className="hover:text-red-500">×</button>
                            </span>
                        )}
                        {filters.level && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-[#ff6b35] rounded-full text-sm">
                                {filters.level}
                                <button onClick={() => handleFilterChange('level', '')} className="hover:text-red-500">×</button>
                            </span>
                        )}
                        {filters.fundingType && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-[#ff6b35] rounded-full text-sm">
                                {filters.fundingType}
                                <button onClick={() => handleFilterChange('fundingType', '')} className="hover:text-red-500">×</button>
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-[#ff6b35] underline ml-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="container mx-auto py-3">
                <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold">{scholarships.length}</span> of{' '}
                        <span className="font-semibold">{pagination.total}</span> scholarships
                    </p>
                    <div className="text-sm text-gray-500">
                        Page {pagination.page} of {pagination.totalPages}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-[#ff6b35] animate-spin mb-4" />
                        <p className="text-gray-500">Loading scholarships...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="container mx-auto py-12">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-red-800">Error loading scholarships</h3>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                            <button
                                onClick={() => fetchScholarships(pagination.page)}
                                className="mt-3 text-sm text-red-700 hover:text-red-900 underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Scholarship Grid/List */}
            {!loading && !error && scholarships.length > 0 && (
                <div className="container mx-auto py-2 pb-12">
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                        {scholarships.map((scholarship) => (
                            <div className="duration-300 hover:scale-102 transition-all hover:-translate-y-1 cursor-pointer" key={scholarship?._id}>
                                <div className="bg-[#efefef] p-1 max-w-[450px] mx-auto">
                                    <div className="overflow-hidden">
                                        <img
                                            src="https://www.mili.edu.af/blogs/elements/post_image/2024-12-23-18-16-4822.jpg"
                                            alt={scholarship.title}
                                            className="w-full h-[170px] object-cover"
                                        />
                                    </div>

                                    <div className="pt-4 px-2">
                                        <div className="relative group w-fit">
                                            <h3 className="text-base line-clamp-2 font-medium text-black cursor-pointer">
                                                {scholarship.title}
                                            </h3>
                                        </div>

                                        <span dangerouslySetInnerHTML={{ __html: scholarship.description }} className="text-[#444] mt-1 text-sm line-clamp-2 leading-relaxed"/>
                                           
                                        {/* Bottom CTA */}
                                        <div onClick={() => router.push(`/dashboard/scholarships/${scholarship.slug}`)} className="flex pb-2 items-center justify-between mt-1 group cursor-pointer">
                                            <span className="text-[#F46C44] text-base font-semibold tracking-wide">
                                                Details
                                            </span>

                                            <span className=" right-0 text-[#F46C44] text-3xl group-hover:translate-x-2 transition-all duration-300">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.page <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.page >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i;
                                    } else {
                                        pageNum = pagination.page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-lg font-medium transition ${pagination.page === pageNum
                                                ? 'bg-[#ff6b35] text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && scholarships.length === 0 && (
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center max-w-md mx-auto">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No scholarships found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your filters or search terms to find relevant scholarships.</p>
                        <button
                            onClick={clearFilters}
                            className="bg-[#ff6b35] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e55a2b] transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}