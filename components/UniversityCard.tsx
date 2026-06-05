"use client";
import { useEffect, useRef } from "react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { MapPin } from "lucide-react";
import KeenSlider from "keen-slider";

export default function UniversityCard({ university, bgcolor = "bg-white", perView = "3" }) {
  const sliderRef = useRef(null);
  const sliderInstanceRef = useRef(null);

  const isArray = Array.isArray(university);
  const universities = isArray ? university : [university];

  if (!universities || universities.length === 0 || !universities[0]) {
    return null;
  }

  useEffect(() => {
    if (!sliderRef.current) return;

    let timeout;
    let mouseOver = false;

    const slider = new KeenSlider(sliderRef.current, {
      loop: true,
      mode: "snap",
      renderMode: "performance",
      slides: {
        perView: perView,
        spacing: 4,
      },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 2, spacing: 4 },
        },
        "(max-width: 768px)": {
          slides: { perView: 1, spacing: 8 },
        },
      },

      created(s) {
        sliderInstanceRef.current = s;

        s.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearTimeout(timeout);
        });

        s.container.addEventListener("mouseout", () => {
          mouseOver = false;
          autoplay();
        });

        autoplay();
      },

      dragStarted() {
        clearTimeout(timeout);
      },

      animationEnded() {
        autoplay();
      },

      updated() {
        autoplay();
      },
    });

    function autoplay() {
      if (mouseOver) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        slider.next();
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
      slider.destroy();
    };
  }, [universities]);

  // Helper function to format fee display
  const formatFee = (fee) => {
    if (!fee || fee === "N/A") return "N/A";
    // If fee already has € symbol, return as is
    if (fee.includes("€")) return fee;
    return `€${fee}`;
  };

  return (
    <div
      ref={sliderRef}
      className="keen-slider pt-6 max-w-7xl mx-auto overflow-hidden px-2 md:px-0"
    >
      {universities.map((uni, index) => (
        <div key={uni._id || index} className="keen-slider__slide pt-4">
          <div className="pl-2 pr-2 md:pl-4 md:pr-1 h-full">
            <div
              className={`${bgcolor} rounded-3xl border border-gray-300 shadow-sm hover:shadow-md 
              transition-shadow min-h-[28rem] h-full flex flex-col relative`}
            >
              {/* Top Section */}
              <div className="flex px-3 md:px-4 py-4 items-center justify-start gap-2 md:gap-4">
                <div className="border-gray bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={uni.uni_logo}
                    alt={uni.name}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 line-clamp-2 break-words">
                    {uni.name}
                  </h3>

                  <p className="text-xs md:text-sm font-semibold flex items-center justify-start">
                    <MapPin className="mr-1 flex-shrink-0" size={14} />
                    <span className="truncate">
                      {uni.city}, {uni.country}
                    </span>
                  </p>
                </div>
              </div>

              {/* Ranking Section */}
              <div className="px-3 md:px-4 pb-3 my-1">
                <div className="grid grid-cols-1 gap-2">
                  {uni.uni_rank?.map((rank, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-1">
                      <span className="text-xs md:text-sm font-medium text-gray-600">
                        {rank.type}:
                      </span>
                      <span className="text-xs md:text-sm font-bold text-gray-900">
                        {rank.rank} <span className="font-normal text-gray-500">({rank.year})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fees Section - Improved */}
              <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 mt-2">
                <div className="space-y-2">
                  <p className="text-xs md:text-sm flex justify-between items-center">
                    <span className="text-gray-600">Avg Annual UG Fee:</span>
                    <span className="font-bold text-gray-900">
                      {formatFee(uni.financials?.ug_fees)}
                    </span>
                  </p>
                  <p className="text-xs md:text-sm flex justify-between items-center">
                    <span className="text-gray-600">Avg Annual PG Fee:</span>
                    <span className="font-bold text-gray-900">
                      {formatFee(uni.financials?.pg_fees)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Cost Section */}
              <div className="py-3 text-center mt-2">
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  Average Cost of Living
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {formatFee(uni.financials?.cost_of_living)}
                  <span className="text-xs font-normal text-gray-500">/year</span>
                </p>
              </div>

              {/* Buttons - Fixed positioning */}
              <div className="mt-auto pt-4 pb-4 px-3 md:px-6">
                <div className="flex gap-2 justify-start">
                  <Link href={`/universities/${uni.slug}`}>
                    <button className="bg-secondary hover:bg-primary text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-colors whitespace-nowrap">
                      View Details →
                    </button>
                  </Link>

                  <Link href={`/universities/${uni.slug}`}>
                    <button className="bg-secondary hover:bg-primary text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-colors whitespace-nowrap">
                      Apply →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}