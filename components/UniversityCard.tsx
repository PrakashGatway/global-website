"use client"
import Image from "next/image";
import { useEffect, useRef } from "react";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { Map, MapPin, Star } from "lucide-react";

export default function UniversityCard({ university }) {
  const sliderRef = useRef(null);
  const sliderInstanceRef = useRef(null);
  
  const galleryImages = university.uni_gallery?.images || [];
  const hasGallery = galleryImages.length > 0;

  // ============ KEEN SLIDER SETUP ============
  useEffect(() => {
    if (!hasGallery || !sliderRef.current) return;

    sliderInstanceRef.current = new KeenSlider(sliderRef.current, {
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 0,
      },
      created(s) {
        s.moveToIdx(0);
      },
    });

    // Automatic sliding every 3 seconds
    const interval = setInterval(() => {
      if (sliderInstanceRef.current) {
        sliderInstanceRef.current.next();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (sliderInstanceRef.current) {
        sliderInstanceRef.current.destroy();
      }
    };
  }, [hasGallery]);
  // ============================================

  // Extract rankings
  const theRank = university.uni_rank?.find(r => r.type === "THE")?.rank || "N/A";
  const qsRank = university.uni_rank?.find(r => r.type === "QS World")?.rank || "N/A";
  
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount || amount === "N/A") return "N/A";
    return `${amount} CAD`;
  };

  // Get flag emoji
  const getFlagEmoji = (country) => {
    const flags = {
      "UK": "🇬🇧",
      "US": "🇺🇸",
      "Canada": "🇨🇦",
      "Australia": "🇦🇺",
    };
    return flags[country] || "🌍";
  };

  return (
   
        
          <div key={university.id} className="bg-gray-100 rounded-3xl  shadow-sm hover:shadow-md transition-shadow relative">
            
            {/* Top Section - Logo and Name */}
            <div className=" p-6 flex gap-4 items-start">
              {/* Logo Container */}
              <div className="w-33 h-23 flex-shrink-0 rounded-2xl border shadow-[-4px_-2px_3px_rgba(0,0,0,0.2)] border-gray bg-white flex items-center justify-center overflow-hidden absolute -top-2 -left-12">
                <img
                  src={university.uni_logo}
                  alt={university.name}
                  className="w-36 h-26 object-contain"
                />
              </div>

              {/* Name and Badge */}
              <div className="flex-1 pt-1 pl-20 text-end">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {university.name}
                </h3>
                
                <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
                  University
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="px-2  py-2 ">
              <p className="text-sm text-gray-700 flex">
                <MapPin/>
              <span>
                 {university.city} , {university.country}
                </span> 
              </p>
            </div>

            {/* National Ranking */}
           <div className="px-4 py-3">
  <div className="flex flex-col-1 gap-3">
    {university.uni_rank?.map((rank, index) => (
      <p key={index} className="text-xs text-gray-800 font-medium">
        {rank.type}: <span className="font-bold">{rank.rank}</span> ({rank.year})
      </p>
    ))}
  </div>
</div>


            {/* Orange Fee Section */}
            <div className="bg-[#f46c44] px-6 py-4 text-white">
           

              {/* Fee Information */}
              <p className="text-sm mb-2 flex justify-center">
                Average Annual UG Fee: <span className="font-bold pl-2">{university.financials.ug_fees}</span>
              </p>
              <p className="text-sm flex justify-center ">
                Average Annual PG Fee: <span className="font-bold  pl-2">{university.financials.pg_fees}</span>
              </p>
            </div>

            {/* Cost of Living Section */}
            <div className=" px-6 py-2 text-center">
              <p className="text-sm text-gray-700 mb-3">
                Average Cost of Living:
              </p>
              <p className="text-xl font-bold text-gray-900">
                {university.financials.cost_of_living}/year
              </p>
            </div>

            {/* Button */}
            <div className="px-6 pb-2 text-center">
              <Link href={`/universities/${university.slug}`} >
              <button className="bg-amber-900 hover:bg-amber-950 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
                View Details &gt;
              </button>
              </Link>
              
            </div>

          </div>
   
  );
}