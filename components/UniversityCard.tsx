import Image from "next/image";
import { useEffect, useRef } from "react";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";

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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden w-[350px]">

   
      {/* ============================================= */}

      {/* Top Section */}
      <div className="pt-16  text-center">

        {/* Logo */}
        <div className="w-24 h-24  mx-auto rounded-full border-2 border-pink-400 flex items-center justify-center overflow-hidden bg-white -mt-14 relative z-10">
          <Image
            src={university.uni_logo || "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/250px-Utoronto_coa.svg.png"}
            alt={`${university.name} Logo`}
            width={70}
            height={70}
            className="object-contain"
          />
        </div>

        {/* University Name */}
        <h3 className="mt-4 text-lg font-semibold text-red-600 uppercase">
          {university.name}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-600 mt-2">
          {getFlagEmoji(university.country)} {university.city}, {university.country}
        </p>
      </div>

      {/* Ranking Section */}
      <div className="bg-gray-100 p-5 text-center">

        <div className="flex justify-center gap-10 mb-3">
          <div>
            <p className="text-xs text-gray-500">THE</p>
            <p className="font-semibold text-gray-800">Ranking: {theRank}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">QS</p>
            <p className="font-semibold text-gray-800">Ranking: {qsRank}</p>
          </div>
        </div>

        <p className="text-sm text-gray-700">
          Average Annual UG Fee: <span className="font-semibold">{formatCurrency(university.financials?.ug_fees)}</span>
        </p>

        <p className="text-sm text-gray-700 mt-1">
          Average Annual PG Fee: <span className="font-semibold">{formatCurrency(university.financials?.pg_fees)}</span>
        </p>
      </div>

      {/* Cost Section */}
      <div className="p-5 text-center">
        <p className="text-sm text-gray-600">
          Average Cost of Living:
        </p>
        <p className="font-semibold text-gray-900">
          {formatCurrency(university.financials?.cost_of_living)} / year
        </p>
      </div>

      {/* Button */}
     
      <div className="p-5 text-center">
         <Link href={`/universities/${university.slug}`}>
        <button className="bg-[#1f2937] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black transition cursor-pointer">
          VIEW DETAILS →
        </button>
        </Link>
      </div>
      

    </div>
  );
}