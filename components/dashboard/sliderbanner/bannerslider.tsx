"use client";

import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef } from "react";

export default function RewardSlider() {

  const timer = useRef();

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    created(slider) {
      startAuto(slider);
    },
    dragStarted() {
      clearInterval(timer.current);
    },
    animationEnded(slider) {
      startAuto(slider);
    },
    updated(slider) {
      startAuto(slider);
    },
  });

  function startAuto(slider) {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      slider.next();
    }, 4000);
  }

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  const slides = [
    {
      title: "Get rewarded for studying!",
      desc: "Receive 500 (CAD, USD, AUD, GBP, or EUR)* to support your pre-arrival needs when you enroll in an eligible program through ApplyBoard.",
      btn: "See promotion details",
      image: "https://img.freepik.com/premium-vector/vector-now-open-red-banner_123447-706.jpg?w=360",
    },
    {
      title: "Start your global education journey",
      desc: "Apply faster with expert counsellors and top university partnerships worldwide.",
      btn: "Apply Now",
      image: "https://img.freepik.com/premium-vector/vector-now-open-red-banner_123447-706.jpg?w=360",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto mt-10 px-4">

      <div ref={sliderRef} className="keen-slider rounded-2xl overflow-hidden">

        {slides.map((item, i) => (
          <div key={i} className="keen-slider__slide">

            {/* CARD */}
            <div className="
              relative flex items-center justify-between
              bg-gradient-to-r
              from-orange-400 via-orange-500 to-amber-700
              text-white
              rounded-2xl
              p-10
              min-h-[190px]
              overflow-hidden
            ">

              {/* LEFT CONTENT */}
              <div className="max-w-lg z-10">
                <h2 className="text-3xl font-bold mb-3">
                  {item.title}
                </h2>

                <p className="text-sm opacity-90 mb-5 leading-relaxed">
                  {item.desc}
                </p>

                <button className="
                  bg-white text-gray-800
                  px-5 py-2 rounded-lg
                  font-medium shadow
                  hover:scale-105 transition
                ">
                  {item.btn}
                </button>

                <p className="text-xs opacity-80 mt-3">
                  *Rewards vary by study destination.
                </p>
              </div>

              {/* RIGHT IMAGE */}
              <div className="
                absolute right-0 bottom-0
                opacity-30 lg:opacity-100
              ">
                <img
                  src={item.image}
                  className="w-[260px] lg:w-[320px]"
                  alt=""
                />
              </div>

            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
