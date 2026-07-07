// app/universities/components/UniversityList.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UniversityCard from './universityCard';
import { UniversityListSkeleton } from './universityCard';
import axiosInstance, { serverInstance } from '@/app/axiosInstance';

interface UniversityListProps {
  initialData: {
    result: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  searchParams: {
    keyword?: string;
    country?: string;
    city?: string;
    type?: string;
    intake?: string;
    tuitionFee?: string;
    language?: string;
  };
}

export default function UniversityList({ initialData, searchParams }: UniversityListProps) {
  const [universities, setUniversities] = useState(initialData.result);
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.page < initialData.totalPages);
  
  const router = useRouter();
  const currentParams = useSearchParams();

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams(currentParams.toString());
      params.set('page', String(page + 1));
      params.set('limit', '9');
      
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

      {/* Show More Button */}
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