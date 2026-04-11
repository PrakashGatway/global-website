"use client";

import { useState, useEffect, useRef } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Tag, Tagging } from "./tag";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const StudentVisaStories = ({
  title,
  subtitle,
  stories,
  autoSlideInterval = 3000,
  tag = 1
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [loaded, setLoaded] = useState(false);

  // Responsive slides
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 640) return setSlidesPerView(1);
      if (window.innerWidth < 1024) return setSlidesPerView(3);
      setSlidesPerView(4);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  // Keen slider setup
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: slidesPerView,
      spacing: 24,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // Auto slide
  useEffect(() => {
    if (!instanceRef.current) return;

    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [instanceRef, autoSlideInterval]);

  if (!stories?.length) return null;

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-12">
          <Tagging data={tag} css="relative inline-block mb-4 sm:mb-6 block">
            <span className="text-[#F46C44] text-2xl sm:text-3xl block font-medium mr-2">
              {title?.split('||')[0]?.trim() || ""}
            </span>
            <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold">
              {title?.split('||')[1]?.trim() || ""}
            </span>
            <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
          </Tagging>

          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl">{subtitle}</p>
          )}
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Buttons */}
          {/* {loaded && instanceRef.current && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white p-3 rounded-full shadow border"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white p-3 rounded-full shadow border"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )} */}

          {/* Slides */}
          <div ref={sliderRef} className="keen-slider py-4">
            {stories.map((story, idx) => (
              <div key={idx} className="keen-slider__slide pb-4">
                <StoryCard story={story} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

const StoryCard = ({ story }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group bg-white rounded-3xl shadow overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative h-84 overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
        {story.image ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={story.image}
              alt={story.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover object-top transition ${imageLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
            {story.name?.charAt(0) || "S"}
          </div>
        )}

        {/* Status */}
        {/* {story.status && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
            {story.status}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default StudentVisaStories;