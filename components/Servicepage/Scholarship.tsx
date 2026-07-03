import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, Globe, Monitor, Award, ArrowRight, Clock } from 'lucide-react';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css'; // Import default styles

// --- Sub-Component: Single Card (UNCHANGED) ---
const ScholarshipCardItem = ({ scholarship }) => {
  const {
    title,
    description,
    amount,
    deadline,
    deliveryMode,
    country,
    university,
    level,
    fundingType,
    slug,
    status,
  } = scholarship;

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Check Urgency
  const getDaysRemaining = () => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysRemaining();
  const isUrgent = daysLeft !== null && daysLeft > 0 && daysLeft < 15;

  return (
    // Added 'h-full' to ensure uniform height in slider
    <div className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 overflow-hidden">
      
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
        {status === 'Active' && (
          <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
            Active
          </span>
        )}
        {isUrgent && (
          <span className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 rounded-full border border-rose-100 shadow-sm flex items-center gap-1">
            <Clock size={12} />
            {daysLeft} days left
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 flex-grow">
        {/* Meta Header */}
        <div className="flex items-center justify-between mb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Globe size={14} className="text-blue-500" />
            <span>{country?.name || 'Global'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Monitor size={14} className="text-purple-500" />
            <span>{deliveryMode || 'Online'}</span>
          </div>
        </div>

        {/* Title & Desc */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed">
          {description || 'Details regarding this scholarship are currently being updated.'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Award Value</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
              <Award size={16} className="text-yellow-500" />
              <span className="truncate">{amount || 'N/A'}</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Deadline</p>
            <div className={`flex items-center gap-1.5 text-sm font-semibold ${isUrgent ? 'text-rose-600' : 'text-gray-800'}`}>
              <Calendar size={16} />
              <span>{formatDate(deadline)}</span>
            </div>
          </div>

          <div className="col-span-2">
             <p className="text-xs text-gray-500 mb-1.5">Eligible Levels</p>
             <div className="flex flex-wrap gap-1.5">
                {Array.isArray(level) && level.length > 0 ? (
                  level.slice(0, 3).map((lvl, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-gray-200 rounded text-gray-600 shadow-sm">
                      {lvl}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">Any Level</span>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
         
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Provider</p>
            <p className="text-xs font-medium text-gray-900 truncate" title={university?.name}>
              {university?.name || 'University'}
            </p>
          </div>
        </div>

        <Link 
          href={`/scholarships/${slug}`}
          className="shrink-0 flex items-center gap-1 px-4 py-2 bg-orange-500 hover:bg-primary text-white text-sm font-medium rounded-lg transition-colors"
        >
          View
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

// --- Main Component: Handles Mapping & Slider ---
const ScholarshipList = ({ scholarships = [], title = '', subtitle = '' }) => {
  
  const sliderRef = useRef(null);
  const sliderInstance = useRef(null);

  useEffect(() => {
    if (sliderRef.current && scholarships.length > 0) {
      sliderInstance.current = new KeenSlider(sliderRef.current, {
        loop: true,
        slides: {
          perView: 1,
          spacing: 24, // Matches your gap-6 (1.5rem = 24px)
        },
        breakpoints: {
          '(min-width: 768px)': {
            slides: { perView: 2, spacing: 24 },
          },
          '(min-width: 1024px)': {
            slides: { perView: 3, spacing: 24 },
          },
        },
        animation: {
          duration: 3000, // Time between slides (ms)
          easing: 'ease-in-out',
        },
        created: (s) => {
            // Optional: Start animation immediately or on interaction
             s.moveToIdx(5, true, { duration: 0 }); 
        },
      });

      // Auto-play logic using Keen Slider's built-in animation hook isn't direct, 
      // so we use setInterval to move next
      const interval = setInterval(() => {
        if (sliderInstance.current) {
          sliderInstance.current.next();
        }
      }, 4000); // Slide every 4 seconds

      // Cleanup
      return () => {
        clearInterval(interval);
        if (sliderInstance.current) {
          sliderInstance.current.destroy();
        }
      };
    }
  }, [scholarships]);

  if (!scholarships || scholarships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-0 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Award size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No scholarships found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-5 lg:px-0">
      <div className='mb-1'>
        {/* Note: Ensure title/subtitle are strings if not using dangerouslySetInnerHTML for simple text */}
        <span className="text-2xl font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-gray-600 mt-4" dangerouslySetInnerHTML={{ __html: subtitle }} />
      </div>

      {/* Keen Slider Container */}
      <div ref={sliderRef} className="keen-slider">
        {scholarships.map((item) => (
          <div key={item._id} className="keen-slider__slide">
            <ScholarshipCardItem 
              scholarship={item} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipList;