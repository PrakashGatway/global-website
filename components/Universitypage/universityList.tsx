'use client';

import { useState } from 'react';
import { Search } from 'lucide-react'; // FIX: Added missing import for empty state
import UniversityCard from './universityCard';
import { UniversityListSkeleton } from './universityCard';
import axiosInstance from '@/app/axiosInstance';

interface UniversityListProps {
  initialData: {
    result: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  searchParams: Record<string, string | undefined>;
}

export default function UniversityList({ initialData, searchParams }: UniversityListProps) {
  const [universities, setUniversities] = useState(initialData.result);
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.page < initialData.totalPages);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && key !== 'page') {
          params.append(key, value);
        }
      });
      params.set('page', String(page + 1));
      params.set('limit', '12');
      // params.append('isWeb', 'true');
      // params.append('populateExtra', 'true');
      
      const res = await axiosInstance.get(`/universities?${params.toString()}`);
      const data = res.data;
      
      if (data.success) {
        setUniversities(prev => [...prev, ...data.result]);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setHasMore(data.page < data.totalPages);
      }
    } catch (error) {
      console.error('Error loading more universities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (universities.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">No universities found</h3>
        <p className="text-gray-500 text-sm mt-1">Try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {universities.map((uni) => (
          <UniversityCard key={uni._id} uni={uni} />
        ))}
        {loading && <UniversityListSkeleton />}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-[#F46C44] hover:bg-[#E85B30] text-white font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Show More'}
          </button>
        </div>
      )}
    </>
  );
}

import {
  GraduationCap,
  IndianRupee,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

const stats = [
  {
    icon: GraduationCap,
    highlight: "300+",
    title: "Universities",
    description:
      "A wide range of top ranked universities across Germany",
  },
  {
    icon: IndianRupee,
    highlight: "Low/No",
    title: "Tuition Fees",
    description:
      "Affordable education with low or no tuition fees",
  },
  {
    icon: Users,
    highlight: "15%+",
    title: "International Students",
    description:
      "Diverse community from around the world",
  },
  {
    icon: BriefcaseBusiness,
    highlight: "Excellent",
    title: "Career Opportunities",
    description:
      "Strong economy and global career prospects",
  },
];

export function StudyStats() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-[1380px] mx-auto px-4">
        <div className=" bg-gradient-to-r from-white via-slate-50 to-white overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-gray-200">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-start gap-5 p-8  hover:bg-white transition duration-300"
                >
                  {/* Icon */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
                    <Icon
                      size={30}
                      className="text-[#173B78] stroke-[2]"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-[#FF5A1F] leading-none">
                      {item.highlight}
                    </h3>

                    <p className="mt-1 text-[15px] font-semibold text-[#173B78]">
                      {item.title}
                    </p>

                    <p className="mt-1 font-medium text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


import {
  Landmark,
  Flame,
  Languages,
} from "lucide-react";

const features = [
  {
    icon: Landmark,
    title: "Types of Universities",
    description:
      "Explore Public Universities, Private Universities and Universities of Applied Sciences.",
  },
  {
    icon: GraduationCap,
    title: "Tuition Fees Overview",
    description:
      "Most public universities have low or no tuition fees. Semester contribution is usually €150 - €350.",
  },
  {
    icon: Flame,
    title: "Why Study in Germany?",
    description:
      "High quality education, affordable cost, diverse culture and excellent career opportunities.",
  },
  {
    icon: Languages,
    title: "Language Requirements",
    description:
      "Many programs are available in English. Some programs may require German language skills.",
  },
];

export function UniversityOverview() {
  return (
    <section className="bg-white">
      <div className="max-w-[1380px] mx-auto px-4">
        <div className="bg-gradient-to-r from-white via-slate-50 to-white overflow-hidden">

          <div className="grid lg:grid-cols-2 gap-12 py-12 items-center">

            {/* Left Side */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-[#163567]">
                Study at World 
                Class{" "}
                <span className="text-[#FF5A1F]">Universities</span>
              </h2>

              <p className="mt-6 text-gray-600 font-medium leading-8">
                Germany is one of the most popular study destinations for
                international students. With over <strong>300 universities</strong>
                {" "}offering world-class education, innovative research
                opportunities and globally recognized degrees, Germany
                provides the perfect environment for academic and personal
                growth.
              </p>
            </div>

            {/* Right Side */}
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-4"
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <Icon
                        size={28}
                        className="text-[#FF5A1F]"
                      />
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="text-lg font-bold text-[#163567]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-base font-medium leading-7 text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}