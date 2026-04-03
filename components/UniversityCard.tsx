"use client";
import { useEffect, useRef } from "react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { MapPin } from "lucide-react";
import KeenSlider from "keen-slider";

export default function UniversityCard({ university, bgcolor = "bg-white" }) {
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
        perView: 3,
        spacing: 10,
      },
      breakpoints: {
        "(max-width: 1200px)": {
          slides: { perView: 3, spacing: 8 },
        },
        "(max-width: 900px)": {
          slides: { perView: 2, spacing: 8 },
        },
        "(max-width: 600px)": {
          slides: { perView: 1, spacing: 6 },
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

  return (
    <div
      ref={sliderRef}
      className="keen-slider pt-6 max-w-7xl mx-auto overflow-hidden"
    >
      {universities.map((uni, index) => (
        <div key={uni._id || index} className="keen-slider__slide pt-4">
          {/* 👉 ONLY THIS WRAPPER ADDED (UI SAME) */}
          <div className="pl-4 pr-1">
            <div
              className={`${bgcolor} rounded-3xl border borser-gray-300 shadow-sm hover:shadow-md 
              transition-shadow min-h-[25rem] lg:h-full ml-1 relative`}
            >
              {/* Top Section */}
              <div className="flex px-4 py-2 items-center justify-start gap-4">
                <div className="
                border-gray bg-white flex items-center justify-center
                 overflow-hidden ">
                  <img
                    src={uni.uni_logo}
                    alt={uni.name}
                    className="w-24 h-20 object-contain"
                  />
                </div>

                <div className="flex-1 text-left">
                  <h3 className="lg:text-base text-sm font-bold text-gray-900 mb-1">
                    {uni.name}
                  </h3>

                <p className="lg:text-sm text-xs font-semibold flex items-center justify-start">
                  <MapPin className="mr-1" size={16} />
                  <span>
                    {uni.city}, {uni.country}
                  </span>
                </p>
                  {/* <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
                    University
                  </div> */}
                </div>
              </div>


              {/* Ranking */}
              <div className="pl-3 pb-3 my-2">
                <div className="grid grid-cols-3 gap-4 px-4">
                  {uni.uni_rank?.map((rank, idx) => (
                    <p key={idx} className="text-sm  font-medium">
                      {rank.type}:{" "}
                      <span className="font-bold">{rank.rank}</span>
                      <br /> <span>({rank.year})</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Fees */}
              <div className="bg-gray-200 px-6 py-4 text-gray-700">
                <p className="text-xs lg:text-sm mb-2 flex justify-center">
                  Average Annual UG Fee:
                  <span className="font-bold pl-2">
                    {uni.financials?.ug_fees || "N/A"}
                  </span>
                </p>
                <p className="text-xs lg:text-sm flex justify-center">
                  Average Annual PG Fee:
                  <span className="font-bold pl-2">
                    {uni.financials?.pg_fees || "N/A"}
                  </span>
                </p>
              </div>

              {/* Cost */}
              <div className="py-2 text-center mt-2">
                <p className="text-xs lg:text-sm mb-2">
                  Average Cost of Living
                </p>
                <p className="text-xs lg:text-xl font-bold text-gray-900">
                  {uni.financials?.cost_of_living || "N/A"}/year
                </p>
              </div>

              {/* Buttons */}
              <div className="px-6 pb-4 text-center flex gap-2 justify-end absolute bottom-0 right-12 ">
                <Link href={`/universities/${uni.slug}`}>
                  <button className="bg-secondary hover:bg-primary text-white px-2 lg:px-6 py-2 rounded-full text-xs lg:text-sm font-bold transition-colors">
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
        </div>
      ))}
    </div>
  );
}
