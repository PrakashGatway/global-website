"use client";

import { useState, useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import { Tag, Tagging } from "./tag";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const StudentVisaStories = ({
  title="Our Student || Visa Approvals",
  isSameLine = "no",
  subtitle,
  stories,
  autoSlideInterval = 3000,
  tag = 1
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
 



  // Responsive slides
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 640) return setSlidesPerView(1);
      if (window.innerWidth < 1024) return setSlidesPerView(2);
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
    perView: 3,
    spacing: 16,
  },
  breakpoints: {
    "(max-width: 640px)": {
      slides: {
        perView: 1,
        spacing: 12,
      },
    },
    "(min-width: 641px) and (max-width: 768px)": {
      slides: {
        perView: 2,
        spacing: 12,
      },
    },
    "(min-width: 769px) and (max-width: 1024px)": {
      slides: {
        perView: 3,
        spacing: 16,
      },
    },
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
    <section className="w-full bg-white overflow-hidden py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
        {/* Header */}
        <div className="text-left my-4">
           {isSameLine === "no" ? (
             <h2>
            <span className="text-[#F46C44] text-2xl sm:text-4xl block font-light mr-2">
              {title?.split("||")[0]}
            </span>
            <span className="text-primary text-2xl sm:text-4xl block font-bold mr-2">
              {title?.split("||")[1]}
            </span></h2>
           ):(
              <h2>
            <span className="text-primary text-2xl sm:text-4xl block font-bold mr-2">
              {title?.split("||")[1]}
            </span></h2>
           )}
          
        

          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl" dangerouslySetInnerHTML={{
              __html: subtitle
            }}>
            </p>
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
          <div ref={sliderRef} className="keen-slider ">
            {stories.map((story, idx) => (
              <div key={idx} className="keen-slider__slide ">
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
  

  return (
   <div className="group bg-white shadow-[0_0_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full">
  {/* Image */}
  <div className="relative h-[250px] sm:h-[300px] md:h-[320px] lg:h-[300px] xl:h-[300px] overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
    {story.image ? (
      <img
        src={story.image}
        alt={story.name}
        className="w-full h-full object-cover object-top transition-opacity duration-300 opacity-100"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
        {story.name?.charAt(0) || "S"}
      </div>
    )}
  </div>
</div>
  );
};

export default StudentVisaStories;