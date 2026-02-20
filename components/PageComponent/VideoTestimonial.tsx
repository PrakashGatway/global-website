'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoTestimonialItem {
  _id: string;
  name: string;
  message: string;
  videoUrl: string;
  designation?: string;
  university?: string;
  image?: string;
  rating?: number;
}

interface VideoTestimonialsSliderProps {
  items: VideoTestimonialItem[];
  title?: string;
  subtitle?: string;
  autoPlay?: boolean;
  interval?: number;
  showProgress?: boolean;
  pauseOnHover?: boolean;
}

const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && (match[1]?.length === 11 || match[2]?.length === 11)) {
        return match[1]?.length === 11 ? match[1] : match[2];
      }
    }
    return null;
  } catch {
    return null;
  }
};

export default function VideoTestimonialsSlider({
  items = [],
  title = "Video || Testimonials",
  subtitle = "What our students say",
  autoPlay = true,
  interval = 5000,
  showProgress = true,
  pauseOnHover = true,
}: VideoTestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);

  // Filter only video testimonials
  const videoItems = items.filter(item => item.videoUrl);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videoItems.length);
  }, [videoItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videoItems.length) % videoItems.length);
  }, [videoItems.length]);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || videoItems.length <= 1) return;
    if (pauseOnHover && isHovering) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, nextSlide, pauseOnHover, isHovering, videoItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Empty state
  if (!videoItems.length) {
    return (
      <section className="bg-[#efefef] py-10 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-lg lg:text-2xl font-bold mb-4">
            {title.includes('||') ? (
              <>
                <span className="text-[#f46c44]">{title.split('||')[0].trim()}</span>{' '}
                <span className="text-gray-600">{title.split('||')[1].trim()}</span>
              </>
            ) : title}
          </h2>
          <p className="text-gray-500">No video testimonials available</p>
        </div>
      </section>
    );
  }

  const currentItem = videoItems[currentIndex];
  const videoId = getYouTubeId(currentItem.videoUrl);
  const isMp4 = currentItem.videoUrl?.endsWith('.mp4');

  return (
    <section className="bg-[#efefef] py-10 pb-20 relative max-w-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Section */}
        <div className="mb-10 lg:mb-20">
          <h2 className="text-lg lg:text-5xl font-light text-red-700">
            {title.includes("||") ? title.split("||")[0].trim() : ""}
          </h2>
          <h3 className="text-xl lg:text-6xl font-bold text-primary relative inline-block lg:mt-2">
            {title.includes("||") ? title.split("||")[1].trim() : "Testimonials"}
            <span className="absolute right-0 -bottom-1 w-32 h-[2px] lg:h-1 bg-red-600"></span>
          </h3>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>

        {/* Slider */}
        <div
          className="relative mx-auto"
          onMouseEnter={() => pauseOnHover && setIsHovering(true)}
          onMouseLeave={() => pauseOnHover && setIsHovering(false)}
        >
          {/* Background decorative element */}
          <div className="hidden lg:block absolute -left-40 -top-10 w-[45%] h-[75%] bg-[#e5cfc5] rounded-tr-[40px] rounded-br-[30px] z-0"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className=" "
            >
              
              {/* Video Container */}
              <div className="relative w-full lg:w-[95%] mx-auto  lg:h-[500px] rounded-[30px] lg:rounded-[40px] shadow-2xl bg-white overflow-hidden">
                <div className="aspect-video lg:h-full w-full">
                  {isMp4 ? (
                    <video
                      src={currentItem.videoUrl}
                      controls
                      className="w-full h-full  inset-0"
                    />
                  ) : videoId ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${currentItem.name} testimonial`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500">Video unavailable</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Testimonial Badge */}
              <div className="absolute bottom-[-40px] right-[-10px] sm:right-0 sm:bottom-[-30px] lg:-bottom-10 lg:-right-16 bg-[#6d1901] w-[90%] sm:w-[320px] text-white px-5 sm:px-6 py-5 sm:py-6 rounded-2xl lg:rounded-3xl shadow-xl z-20 hidden lg:block">
                <p className="text-base sm:text-lg font-semibold leading-relaxed">
                  {currentItem.message}
                </p>
                <div className="mt-3">
                  <p className="font-bold text-lg">{currentItem.name}</p>
                
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          {showProgress && videoItems.length > 1 && (
            <div className="flex justify-center gap-2 mt-16 lg:mt-20">
              {videoItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-8 bg-red-600' 
                      : 'w-2 bg-gray-400 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

       
        </div>
      </div>
    </section>
  );
}