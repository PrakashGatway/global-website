'use client';

import { useRouter } from 'next/navigation';
import { RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';

interface UniversityFiltersProps {
  searchParams: Record<string, string | undefined>;
  defaultCountry: Record<string, string | undefined>;
  countrydata: any;
  slug: any;
  city: Array<any>;
}

export default function UniversityFilters({ searchParams , countrydata, slug, defaultCountry, city }: UniversityFiltersProps) {
  const router = useRouter();

  // Helper to build the new URL based on current props instead of useSearchParams
  const buildNewUrl = (keyToUpdate: string, value: string | null, isMultiSelect = false) => {
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== keyToUpdate && k !== 'page') {
        params.set(k, v);
      }
    });

    if (isMultiSelect && value) {
      const currentValues = searchParams[keyToUpdate]?.split(',').filter(Boolean) || [];
      let newValues: string[];
      
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v != value);
      } else {
        newValues = [...currentValues, value];
      }
      if (newValues.length > 0) {
        params.set(keyToUpdate, newValues.join(','));
      }
    } else if (value) {
      params.set(keyToUpdate, value);
    }
    params.set('page', '1');
    console.log(params.toString())
    
    return `/university/${slug}?${params.toString()}`;
  };

  const handleFilterChange = (key: string, value: string) => {
    router.push(buildNewUrl(key, value || null), { scroll: false });
  };

  const handleReset = () => {
    router.push('/find-universities', { scroll: false });
  };

  const handleMultiSelect = (key: string, value: string) => {
    router.push(buildNewUrl(key, value, true), { scroll: false });
  };

  // useEffect(()=> {
  //   handleFilterChange('country', defaultCountry)
  // },[defaultCountry])

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
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
          <select 
            value={searchParams.country || ''} 
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F46C44] bg-white text-gray-700 text-sm"
          >
            <option value="">All Countries</option>
            {countrydata?.map(ele => (
              <option value={ele.code}>{ele.name}</option>
            ))}
            
          </select>
        </div> */}

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
          <select 
            value={searchParams.city || ''} 
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F46C44] bg-white text-gray-700 text-sm"
          >
            <option value="">All Cities</option>
            {city.map(ele => (
              <option value={ele.title}>{ele.title}</option>
            ))}
            {/* <option value="Berlin">Berlin</option>
            <option value="Munich">Munich</option>
            <option value="Hamburg">Hamburg</option>
            <option value="Frankfurt">Frankfurt</option>
            <option value="Stuttgart">Stuttgart</option> */}
          </select>
        </div>

        {/* University Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">University Type</label>
          <div className="space-y-2">
            {['Public', 'Private'].map((val) => (
              <label key={val} className="flex items-center gap-2 text-sm text-gray-600">
                <input 
                  type="checkbox" 
                  value={val} 
                  // FIX: Use split(',') to prevent "Public" matching "PublicUniversity"
                  checked={(searchParams.type?.split(',').filter(Boolean) || []).includes(val)}
                  onChange={() => handleMultiSelect('type', val)}
                  className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* Tuition Fees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuition Fees</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" value="Low" 
                checked={(searchParams.tuitionFee?.split(',').filter(Boolean) || []).includes('Low')}
                onChange={() => handleMultiSelect('tuitionFee', 'Low')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              /> Low (&lt; €5,000)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" value="Medium" 
                checked={(searchParams.tuitionFee?.split(',').filter(Boolean) || []).includes('Medium')}
                onChange={() => handleMultiSelect('tuitionFee', 'Medium')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              /> Medium (€5,000 - €15,000)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" value="High" 
                checked={(searchParams.tuitionFee?.split(',').filter(Boolean) || []).includes('High')}
                onChange={() => handleMultiSelect('tuitionFee', 'High')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              /> High (Above €15,000)
            </label>
          </div>
        </div>

        {/* Intake */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Intake</label>
          <div className="space-y-2">
            { ["January", "February", "March", "April", 
                "May", "June", "July", "August", 
                "September", "October", "November", "December"
              ].map((val) => (
              <label key={val} className="flex items-center gap-2 text-sm text-gray-600">
                <input 
                  type="checkbox" 
                  value={val} 
                  checked={(searchParams.intake?.split(',').filter(Boolean) || []).includes(val)}
                  onChange={() => handleMultiSelect('intake', val)}
                  className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
                />
                {val}
              </label>
            ))}
            {/* <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" value="Winter" 
                checked={(searchParams.intake?.split(',').filter(Boolean) || []).includes('Winter')}
                onChange={() => handleMultiSelect('intake', 'Winter')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              /> Winter (Oct)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" value="Summer" 
                checked={(searchParams.intake?.split(',').filter(Boolean) || []).includes('Summer')}
                onChange={() => handleMultiSelect('intake', 'Summer')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              /> Summer (Apr)
            </label> */}
          </div>
        </div>

        {/* Language */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Language of Instruction</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" value="English" 
                checked={(searchParams.language?.split(',').filter(Boolean) || []).includes('English')}
                onChange={() => handleMultiSelect('language', 'English')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              /> English
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" value="German" 
                checked={(searchParams.language?.split(',').filter(Boolean) || []).includes('German')}
                onChange={() => handleMultiSelect('language', 'German')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              /> German
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" value="Both" 
                checked={(searchParams.language?.split(',').filter(Boolean) || []).includes('Both')}
                onChange={() => handleMultiSelect('language', 'Both')}
                className="rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]" 
              /> Both
            </label>
          </div>
        </div> */}

      </div>
    </div>
  );
}