"use client"
import { useEffect, useRef } from "react";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { MapPin } from "lucide-react";
import KeenSlider from "keen-slider";

export default function UniversityCard({ university }) {
  const sliderRef = useRef(null);
  const sliderInstanceRef = useRef(null);
  
  // Check if it's an array (for slider) or single object
  const isArray = Array.isArray(university);
  const universities = isArray ? university : [university];
  
  // Handle case when no data
  if (!universities || universities.length === 0 || !universities[0]) {
    return null;
  }

  // If array, setup slider
  useEffect(() => {
    if (sliderRef.current) {
      sliderInstanceRef.current = new KeenSlider(sliderRef.current, {
        loop: true,
        mode: "snap",
        slides: {
          perView: 3,
          spacing: 4,
        },
        breakpoints: {
          "(max-width: 1200px)": {
            slides: {
              perView: 3,
              spacing: 4,
            },
          },
          "(max-width: 900px)": {
            slides: {
              perView: 2,
              spacing: 5,
            },
          },
          "(max-width: 600px)": {
            slides: {
              perView: 1,
              spacing: 4,
            },
          },
        },
        autoplay: {
          duration: 3000,
        },
      });
    }

    return () => {
      if (sliderInstanceRef.current) {
        sliderInstanceRef.current.destroy();
      }
    };
  }, [universities]);

  // Render slider with multiple cards
  return (
    <div ref={sliderRef} className="keen-slider pt-6 max-w-7xl mx-auto">
      {universities.map((uni, index) => (
        <div key={uni._id || index} className="keen-slider__slide !overflow-visible pl-4 pr-1">
          <div className="bg-white rounded-3xl border borser-gray-300 shadow-sm hover:shadow-md transition-shadow  h-[370px] lg:h-full ml-1 relative  ">
            {/* Top Section - Logo and Name */}
            <div className="grid grid-cols-1 gap-4 px-4 py-2 items-start ">
              
              {/* Logo Container */}
              <div className="lg:w-33 lg:h-23 w-20 h-20 flex-shrink-0 rounded-2xl border shadow-[-4px_-2px_3px_rgba(0,0,0,0.2)] border-gray bg-white flex items-center justify-center overflow-hidden absolute z-10 -top-3 -left-3">
                <img
                  src={uni.uni_logo}
                  alt={uni.name}
                  className="w-36 h-26 object-contain "
                />
              </div>

              {/* Name and Badge */}
              <div className="flex-1 py-2 pl-24 text-end">
                <h3 className="lg:text-base text-sm font-bold text-gray-900 mb-1">
                  {uni.name}
                </h3>
                
                <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
                  University
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="px-2 pb-2">
              <p className="lg:text-sm text-xs text-gray-700 flex">
                <MapPin className="mr-1" size={16}/>
                <span>
                  {uni.city}, {uni.country}
                </span> 
              </p>
            </div>

            {/* National Ranking */}
            <div className="pl-3 pb-3">
              <div className="grid grid-cols-3 gap-4 px-4">
                {uni.uni_rank?.map((rank, idx) => (
                  <p key={idx} className="text-xs  text-gray-800 font-medium">
                    {rank.type}:<span className="font-bold">{rank.rank} </span> 
                    <br /> <span>({rank.year})</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Orange Fee Section */}
            <div className="bg-gray-200 px-6 py-4 text-gray-700 ">
              {/* Fee Information */}
              <p className="text-xs lg:text-sm mb-2 flex justify-center">
                Average Annual UG Fee: <span className="font-bold pl-2">{uni.financials?.ug_fees || 'N/A'}</span>
              </p>
              <p className="text-xs lg:text-sm flex justify-center">
                Average Annual PG Fee: <span className="font-bold pl-2">{uni.financials?.pg_fees || 'N/A'}</span>
              </p>
            </div>

            {/* Cost of Living Section */}
            <div className=" py-2 text-center">
              <p className=" text-xs lg:text-sm text-gray-700 mb-3">
                Average Cost of Living:
              </p>
              <p className="text-xs lg:text-xl font-bold text-gray-900">
                {uni.financials?.cost_of_living || 'N/A'}/year
              </p>
            </div>

            {/* Button */}
            <div className="px-6 pb-4 text-center flex gap-2">
              <Link href={`/universities/${uni.slug}`}>
                <button className="bg-secondary hover:bg-primary text-white px-2 lg:px-6 py-2 rounded-full text-xs  lg:text-sm font-bold transition-colors">
                  View Details &gt;
                </button>
              </Link>

              <Link href={`/universities/${uni.slug}`}>
                <button className="bg-secondary hover:bg-primary text-white px-2 lg:px-6 py-2 rounded-full text-xs lg:text-sm font-bold transition-colors">
                  Apply &gt;
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}