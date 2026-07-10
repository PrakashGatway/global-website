"use client";
import { useEffect, useRef } from "react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { ArrowBigRight, ArrowRight, MapPin } from "lucide-react";
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
        spacing: 24,
      },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 2, spacing: 24 },
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
      className="keen-slider max-w-7xl mx-auto  px-2 md:px-0 "
    >
      {universities?.map((uni, index) => { 
        console.log(uni)
        return (
        
         <div
      key={uni._id || index}
      className="keen-slider__slide  px-1 pb-6"
    >
      <div className="px-0 h-full">
     <div
  className="
    bg-white
    overflow-hidden
    shadow-sm
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
      className="w-full h-42 object-cover"
    />

    {/* Logo */}
    <div className="absolute -bottom-7 left-5 bg-white shadow-lg p-2">
      <img
        src={uni.uni_logo}
        alt={uni.name}
        className="w-20 h-12 object-contain"
      />
    </div>
  </div>

  {/* Content */}
  <div className="pt-8 px-5 flex-1 flex flex-col">

    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
      {uni.name}
    </h3>

    <div className="mt-1 flex items-start text-gray-600 text-[17px] leading-7">
      <MapPin
        size={18}
        className="text-orange-500 mr-2  flex-shrink-0"
      />

      <span className="line-clamp-2 text-sm">
        {uni.address
          ? uni.address
          : `${uni.city}, ${uni.country}`}
      </span>
    </div>

    {/* Ranking */}
    {uni?.uni_rank?.length > 0 && (
      <div className=" flex gap-3 items-center justify-between">
        {uni.uni_rank.slice(0, 3).map((rank, idx) => (
          <div
            key={idx}
            className="bg-orange-50 my-2 flex gap-2 items-center border border-orange-100 px-4 py-2"
          >
            <p className="text-xs font-medium text-gray-800">
              {rank.type}
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
    <span className="text-lg font-semibold">
      Enquiry Now
    </span>

    <span className="text-2xl"> →</span>
  </div>
    </Link>

  </div>
</div>
</div>
</div>
      )})}
    </div>
  );
}