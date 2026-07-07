// app/universities/components/UniversityFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCcw } from 'lucide-react';

interface UniversityFiltersProps {
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

export default function UniversityFilters({ searchParams }: UniversityFiltersProps) {
  const router = useRouter();
  const currentParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams.toString());
    
    if (value) {
      params.set(key, value);
      params.set('page', '1'); // Reset to page 1 on filter change
    } else {
      params.delete(key);
    }
    
    router.push(`/universities?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    router.push('/universities', { scroll: false });
  };

  const handleMultiSelect = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams.toString());
    const currentValues = params.get(key)?.split(',') || [];
    
    let newValues: string[];
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    if (newValues.length > 0) {
      params.set(key, newValues.join(','));
      params.set('page', '1');
    } else {
      params.delete(key);
    }
    
    router.push(`/universities?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white border border-gray-100 p-6 sticky top-22">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Filter Universities</h3>
        <button 
          onClick={handleReset} 
          className="flex items-center gap-1 text-sm text-[#F46C44] hover:underline font-medium"
        >
          <RefreshCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-3">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
          <select 
            value={searchParams.country || ''} 
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F46C44] bg-white text-gray-700 text-sm"
          >
            <option value="">All Countries</option>
            <option value="Germany">Germany</option>
            <option value="UK">United Kingdom</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="France">France</option>
            <option value="Ireland">Ireland</option>
            <option value="Dubai">Dubai</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
          <select 
            value={searchParams.city || ''} 
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F46C44] bg-white text-gray-700 text-sm"
          >
            <option value="">All Cities</option>
            <option value="Berlin">Berlin</option>
            <option value="Munich">Munich</option>
            <option value="Hamburg">Hamburg</option>
            <option value="Frankfurt">Frankfurt</option>
            <option value="Stuttgart">Stuttgart</option>
          </select>
        </div>

        {/* University Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">University Type</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="Public" 
                checked={searchParams.type?.includes('Public') || false}
                onChange={() => handleMultiSelect('type', 'Public')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              Public
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="Private" 
                checked={searchParams.type?.includes('Private') || false}
                onChange={() => handleMultiSelect('type', 'Private')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              Private
            </label>
          </div>
        </div>

        {/* Tuition Fees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuition Fees</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="Low" 
                checked={searchParams.tuitionFee?.includes('Low') || false}
                onChange={() => handleMultiSelect('tuitionFee', 'Low')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              Low (&lt; €5,000)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="Medium" 
                checked={searchParams.tuitionFee?.includes('Medium') || false}
                onChange={() => handleMultiSelect('tuitionFee', 'Medium')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              Medium (€5,000 - €15,000)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="High" 
                checked={searchParams.tuitionFee?.includes('High') || false}
                onChange={() => handleMultiSelect('tuitionFee', 'High')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              High (Above €15,000)
            </label>
          </div>
        </div>

        {/* Intake */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Intake</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="Winter" 
                checked={searchParams.intake?.includes('Winter') || false}
                onChange={() => handleMultiSelect('intake', 'Winter')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              Winter (Oct)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="Summer" 
                checked={searchParams.intake?.includes('Summer') || false}
                onChange={() => handleMultiSelect('intake', 'Summer')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              Summer (Apr)
            </label>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Language of Instruction</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="English" 
                checked={searchParams.language?.includes('English') || false}
                onChange={() => handleMultiSelect('language', 'English')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              English
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="German" 
                checked={searchParams.language?.includes('German') || false}
                onChange={() => handleMultiSelect('language', 'German')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              German
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                value="Both" 
                checked={searchParams.language?.includes('Both') || false}
                onChange={() => handleMultiSelect('language', 'Both')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              />
              Both
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}