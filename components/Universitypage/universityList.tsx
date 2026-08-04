'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react'; // FIX: Added missing import for empty state
import { UniversityListSkeleton } from './universityCard';
import Link from 'next/link';
import axiosInstance from '@/app/axiosInstance';
import dynamic from "next/dynamic";

const UniversityCard = dynamic(
  () => import("@/components/UniversityCard"),
  {
    loading: () => <p>Loading...</p>,
  }
);

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {universities.map((uni, index) => (
          <div
            key={uni._id || index}
            className="px-1 pb-2"
          >
            <div className="px-0 h-full">
              <div
                className="
    bg-white
    overflow-hidden
    hover:shadow-xl
    transition-all
    duration-500
    group
    h-full
    flex
    flex-col
  "
              >
                {/* Cover Image */}
                <div className="relative">
                  <img
                    src={uni.cover_photo}
                    alt={uni.name}
                    className="w-full h-38 object-cover"
                  />

                  {/* Logo */}
                  <div className="absolute -bottom-4 left-5 bg-white shadow-lg p-2">
                    <img
                      src={uni.uni_logo}
                      alt={uni.name}
                      className="w-16 h-10 object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-6 px-5 flex-1 flex flex-col">

                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                    {uni.name}
                  </h3>

                  <div className="mt-1 flex items-start text-gray-600 leading-7">
                    <MapPin
                      size={18}
                      className="text-orange-500 mr-2  flex-shrink-0"
                    />

                    <span className="line-clamp-2 text-xs">
                      {uni.address
                        ? uni.address
                        : `${uni.city}, ${uni.country}`}
                    </span>
                  </div>
                  {uni?.uni_rank?.length > 0 && (
                    <div className="flex gap-3 items-center justify-start">
                      {uni.uni_rank.slice(0, 2).map((rank, idx) => (
                        <div
                          key={idx}
                          className="bg-orange-50 my-2 flex gap-2 items-center border border-orange-100 px-4 py-2"
                        >
                          <p className="text-xs font-medium text-gray-800">
                            {rank?.type?.split(" ")[0]}
                          </p>

                          <p className="font-semibold text-orange-600">
                            #{rank.rank?.split("–")[0]}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fees */}
                  {/* <div className="my-2  text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">
          Living Cost
        </span>

        <span className="font-semibold">
          {formatFee(uni.financials?.cost_of_living)}
        </span>
      </div>
    </div> */}

                  {/* Bottom CTA */}
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="flex flex-col mt-auto "
                  >
                    <div className="flex items-center justify-between text-gray-800 hover:text-orange-700 py-3 pb-4">
                      <span className="text-base font-semibold">
                        Enquiry Now
                      </span>

                      <span className="text-xl"> →</span>
                    </div>
                  </Link>

                </div>
              </div>
            </div>
          </div>
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
  // {
  //   icon: BriefcaseBusiness,
  //   highlight: "Excellent",
  //   title: "Career Opportunities",
  //   description:
  //     "Strong economy and global career prospects",
  // },
];

export function StudyStats({ statsData }: any) {
  const items = statsData?.items && statsData.items.length > 0
    ? statsData.items.map(item => ({
      title: item.title,
      stats: item.stats,
      icon: item.icon,
      description: item.description || item.title
    }))
    : stats;

  // Ensure we have 4 items, pad with defaults if needed
  while (items.length < 4) {
    const defaultItem = stats[items.length % stats.length];
    items.push({ ...defaultItem });
  }
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto ">
        <div className=" bg-gradient-to-r from-white via-orange-100 to-white overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-gray-200">
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-start gap-5 p-6  hover:bg-white transition duration-300"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
                    <DynamicLucideIcon
                      name={item.icon}
                      size={30}
                      className="text-[#173B78] stroke-[1.6]"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#FF5A1F] leading-none">
                      {item.stats}
                    </h3>

                    <p className="mt-1 text-base font-semibold text-[#173B78]">
                      {item.title}
                    </p>
                    {/* <p className="mt-px font-medium text-sm leading-6 text-gray-600">
                      {item.description}
                    </p> */}
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
  GraduationCap, // Added missing import
  Flame,
  Languages,
  HelpCircle,
} from "lucide-react";
import { DynamicLucideIcon } from '../DynamicLucideIcon';
import InnerContent from '../dom/DomParser';

// Dictionary to dynamically resolve dynamic icon strings coming from your API data
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Landmark,
  GraduationCap,
  Flame,
  Languages,
};

// Hardcoded static fallback content
const defaultFeatures = [
  {
    icon: "Landmark",
    title: "Types of Universities",
    description: "Explore Public Universities, Private Universities and Universities of Applied Sciences.",
  },
  {
    icon: "GraduationCap",
    title: "Tuition Fees Overview",
    description: "Most public universities have low or no tuition fees. Semester contribution is usually €150 - €350.",
  },
  {
    icon: "Flame",
    title: "Why Study in Germany?",
    description: "High quality education, affordable cost, diverse culture and excellent career opportunities.",
  },
  {
    icon: "Languages",
    title: "Language Requirements",
    description: "Many programs are available in English. Some programs may require German language skills.",
  },
];

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

interface UniversityOverviewProps {
  pageData?: {
    title?: string;
    description?: string;
    features?: FeatureItem[];
  };
}

export function UniversityOverview({ pageData }: UniversityOverviewProps) {
  const rawTitle = pageData?.title || "Study at World Class || Universities";
  const rawDescription = pageData?.description || "<p></p>";

  const displayFeatures = pageData?.features && pageData.features.length > 0
    ? pageData.features
    : [];

  const titleParts = rawTitle.split("||");
  const mainTitle = titleParts[0]?.trim();
  const highlightedTitle = titleParts[1]?.trim();

  return (
    <section className="relative [text-shadow:0_0px_0px_rgba(0,0,0,0.9)] bg-white py-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50/30 to-transparent pointer-events-none hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-1 gap-6">

          <div className="">
            <h2 className="text-2xl mb-4 md:text-4xl font-semibold leading-[1.15] text-[#163567] tracking-tight">
              {mainTitle}{" "}
              {highlightedTitle && (
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#FF5A1F]">{highlightedTitle}</span>
                  {/* Modern highlight marker effect */}
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-orange-100/70 -z-10 rounded-sm" />
                </span>
              )}
            </h2>
            <div>
              <InnerContent text={17} cleanedHtml={rawDescription || ""} />
            </div>
            {/* <div
              className="mt-8 text-base md:text-lg text-gray-600 leading-relaxed [&_strong]:text-[#163567] [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: rawDescription }}
            /> */}
          </div>

          {/* Right Side - Interactive Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFeatures && displayFeatures.slice(0, 4).map((item: any, index: number) => {
              const IconComponent = typeof item.icon === "string"
                ? (iconMap[item.icon] || HelpCircle)
                : item.icon;

              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-transparent hover:shadow-2xl hover:shadow-orange-100/40 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full overflow-hidden"
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50/0 group-hover:from-orange-50/80 group-hover:to-white transition-all duration-500" />

                  {/* Content Wrapper (z-10 ensures text sits above the background glow) */}
                  <div className="relative z-10 flex flex-col h-full">

                    {/* 3. Icon Container with Soft Aura */}

                    <div className="flex-1 flex mt-2 flex-col">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="relative p-2.5 rounded-full bg-gradient-to-br from-orange-50 to-orange-100/50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-200/60 transition-all duration-300">
                          <IconComponent size={22} className="text-[#FF5A1F]" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg w-full font-semibold text-[#163567] mb-2 group-hover:text-[#FF5A1F] transition-colors duration-300">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-500 flex-1">
                        {item.description}
                      </p>
                    </div>
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
