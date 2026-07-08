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
      className="keen-slider pt-6 max-w-7xl mx-auto  px-2 md:px-0 "
    >
      {universities?.map((uni, index) => (
         <div
      key={uni._id || index}
      className="keen-slider__slide pt-4 p-3"
    >
      <div className="px-0 h-full">
     <div
  className="
    bg-white 
    border border-gray-200
    shadow-sm
    hover:shadow-xl
    hover:-translate-y-2
    transition-all duration-500
    overflow-hidden
    h-full
    flex flex-col
    group
  "
>
  {/* Header */}
  <div className="p-4">

    <div className="flex items-start gap-2">

      <div className="w-20 h-20 rounded-full bg-white border border-orange-200 flex items-center justify-center flex-shrink-0">
        <img
          src={uni.uni_logo}
          alt={uni.name}
          className="w-14 h-14 object-contain"
        />
      </div>

      <div className="flex-1">

        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-7">
          {uni.name}
        </h3>

        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <MapPin size={15} className="mr-1 text-orange-500" />
          {uni.city}, {uni.country}
        </div>

      </div>

    </div>

  </div>

  {/* Rankings */}
  <div className="px-6">

    <div className="flex items-center gap-2 py-2 justify-center">

      {uni?.uni_rank?.map((rank, idx) => (
        <div
          key={idx}
          className="flex flex-col w-full p-2 items-center justify-between bg-gray-100 rounded-xl px-2"
        >
          <span className="text-sm font-medium text-gray-600">
            {rank.type}
          </span>

          <span className="font-bold text-orange-600">
            #{rank.rank?.split("–")[0]}
            <span className="text-xs text-gray-500 ml-1">
              ({rank?.year})
            </span>
          </span>
        </div>
      ))}

    </div>

  </div>

  {/* Fees */}
  <div className="mx-6 mt-2 py-3 bg-orange-50 border border-orange-100 p-3">

    <div className="flex justify-between text-sm">

      <span className="text-gray-600">
        UG Tuition
      </span>

      <span className="font-bold text-gray-900">
        {formatFee(uni.financials?.ug_fees)}
      </span>

    </div>

    <div className="border-t border-orange-100 my-2"></div>

    <div className="flex justify-between text-sm">

      <span className="text-gray-600">
        PG Tuition
      </span>

      <span className="font-bold text-gray-900">
        {formatFee(uni.financials?.pg_fees)}
      </span>

    </div>
    <div className="border-t border-orange-100 my-2"></div>

    <div className="flex justify-between text-sm">

      <span className="text-gray-600">
        Cost of Living
      </span>

      <span className="font-bold text-gray-900">
        {formatFee(uni.financials?.cost_of_living)}
       
      </span>

    </div>

  </div>

  {/* Buttons */}

  <div className="mt-auto p-4">

    <div className="grid grid-cols-2 gap-3">

      <Link href={`/universities/${uni.slug}`}>
        <button
          className="
          w-full
         
          border
          border-orange-500
          text-orange-600
          py-3
          font-semibold
          hover:bg-orange-50
          transition
          text-sm
        "
        >
          View Details
        </button>
      </Link>

      <Link href={`/universities/${uni.slug}`}>
        <button
          className="
          w-full
       text-sm
          bg-[#E67E22]
          hover:bg-[#cf6f1d]
          text-white
          py-3
          font-semibold
          transition
        "
        >
          Apply Now
        </button>
      </Link>

    </div>

  </div>

</div></div>
</div>
      ))}
    </div>
  );
}