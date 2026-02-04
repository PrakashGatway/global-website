'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface VideoTestimonialItem {
  title: string;
  text: string;
  videoUrl: string;
}

interface VideoTestimonialsSliderProps {
  items: VideoTestimonialItem[] | any[];
  title?: string;
  emptyStateMessage?: string;
  autoPlay?: boolean;
  interval?: number;
  showProgress?: boolean;
  showControls?: boolean;
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

const normalizeItem = (item: any): (VideoTestimonialItem & { videoId: string | null }) | null => {
  if (!item) return null;

  const title = item.title || item.heading || item.name || "Trusted Success";
  const text = item.text || item.description || item.subtitle || item.content || item.review || "";
  const videoUrl = item.videoUrl || item.video || item.youtube_link || item.youtubeUrl || item.url || "";
  const videoId = getYouTubeId(videoUrl);
  
 const isMp4 = videoUrl.endsWith(".mp4");

return {
  title,
  text,
  videoUrl,
  videoId: isMp4 ? null : getYouTubeId(videoUrl),
  isMp4,
};

};

export default function VideoTestimonialsSlider({
  items = [],
  title = "Video || Testimonials",
  emptyStateMessage = "No video testimonials available",
  autoPlay = true, // Default to true for auto-play
  interval = 5000, // 5 seconds default
  showProgress = true,
  showControls = true,
  pauseOnHover = true,
}: VideoTestimonialsSliderProps) {
  // Process items
  const validItems = items
    .map(normalizeItem)
    .filter(Boolean) as (VideoTestimonialItem & { videoId: string })[];

  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);

  // Memoized navigation functions
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % validItems.length);
  }, [validItems.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + validItems.length) % validItems.length);
  }, [validItems.length]);

  // Go to specific slide
  const goToSlide = useCallback((slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < validItems.length) {
      setIndex(slideIndex);
      // Reset auto-play timer when manually changing slide
      if (isAutoPlaying) {
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 100);
      }
    }
  }, [validItems.length, isAutoPlaying]);

  // Auto-play effect with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || validItems.length <= 1) return;
    
    // Pause auto-play when hovering if enabled
    if (pauseOnHover && isHovering) return;

    const timer = setInterval(() => {
      next();
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, validItems.length, interval, next, pauseOnHover, isHovering]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (validItems.length <= 1) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          setIsAutoPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, validItems.length]);

  // Empty state
  if (validItems.length === 0) {
    return (
      <section className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {title.includes('||') ? (
            <>
              <span className="text-[#f46c44]">{title.split('||')[0].trim()}</span>{' '}
              <span className="text-gray-600">{title.split('||')[1].trim()}</span>
            </>
          ) : title}
        </h2>
        <p className="text-gray-500">{emptyStateMessage}</p>
      </section>
    );
  }

  const item = validItems[index];

  const displayTitle = title.includes('||') ? (
    <>
      <span className="text-[#f46c44]">{title.split('||')[0].trim()}</span>{' '}
      <span className="text-gray-600">{title.split('||')[1].trim()}</span>
    </>
  ) : title;

  return (
    <section className="bg-cover bg-center relative overflow-hidden">
      {/* Decorative background images */}
      <div className="absolute -right-20 top-[0%] opacity-10 pointer-events-none hidden lg:block">
        <div style={{ transform: 'rotate(-120deg) scaleY(-1)', mixBlendMode: 'multiply' }}>
          <Image
            src="/images/g logo.png"
            alt="Decorative Arrow"
            width={600}
            height={40}
            className="w-64 h-66 lg:w-116 lg:h-116 object-contain"
            priority={false}
          />
        </div>
      </div>
      <div className="absolute -left-20 bottom-[0%] opacity-10 pointer-events-none hidden lg:block">
        <div style={{ transform: 'rotate(-120deg) scaleY(-1)', mixBlendMode: 'multiply' }}>
          <Image
            src="/images/g logo.png"
            alt="Decorative Arrow"
            width={600}
            height={40}
            className="w-64 h-66 lg:w-116 lg:h-116 object-contain"
            priority={false}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-center mb-6">
          {displayTitle}
        </h2>

        {/* Main slider container with hover detection */}
        <div 
          className="relative mx-auto overflow-hidden h-[520px] sm:h-[600px] lg:h-[85vh]"
          onMouseEnter={() => pauseOnHover && setIsHovering(true)}
          onMouseLeave={() => pauseOnHover && setIsHovering(false)}
          onFocus={() => pauseOnHover && setIsHovering(true)}
          onBlur={() => pauseOnHover && setIsHovering(false)}
        >
          {/* Desktop background shape */}
          <div
            style={{ backgroundImage: "url('/shapes/vbg.png')" }}
            className="hidden lg:block absolute inset-0 bg-contain bg-center bg-no-repeat"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Mobile/Tablet Layout */}
              <div className="lg:hidden flex flex-col items-center gap-6 pt-6">
                <div className="w-full max-w-[340px] aspect-video rounded-xl overflow-hidden shadow-xl">
                 {item.isMp4 ? (
  <video
    src={item.videoUrl}
    controls
    className="w-full h-full object-cover rounded-xl"
  />
) : item.videoId ? (
  <iframe
    className="w-full h-full"
    src={`https://www.youtube.com/embed/${item.videoId}`}
    allowFullScreen
  />
) : (
  <p className="text-center text-gray-500">Video unavailable</p>
)}

                </div>
                
                <div className="text-center max-w-md px-4">
                  <p className="text-xl font-semibold text-[#f46c44] mb-2">
                    {item.title}
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {item.text}
                  </p>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block">
                <div className="h-[72%] w-[48%] absolute top-[16%] left-[13%] z-10">
                  <div className="relative w-full h-full">
                    <svg width="0" height="0" aria-hidden>
                      <defs>
                        <clipPath id="video-shape" clipPathUnits="objectBoundingBox">
                          <path d="M0.06 0.09 Q0.03 0.10 0.03 0.16 L0.03 0.84 Q0.03 0.94 0.07 0.95 L0.93 0.95 Q0.97 0.94 0.97 0.85 L0.94 0.17 Q0.93 0.11 0.86 0.11 L0.13 0.09 Z" />
                        </clipPath>
                      </defs>
                    </svg>
                    
                    <div
                      className="w-full h-full p-4 overflow-hidden"
                      style={{
                        clipPath: "url(#video-shape)",
                        WebkitClipPath: "url(#video-shape)",
                      }}
                    >
                      {item.isMp4 ? (
  <video
    src={item.videoUrl}
    controls
    className="w-full h-full object-cover rounded-xl"
  />
) : item.videoId ? (
  <iframe
    className="w-full h-full"
    src={`https://www.youtube.com/embed/${item.videoId}`}
    allowFullScreen
  />
) : (
  <p className="text-center text-gray-500">Video unavailable</p>
)}

                    </div>
                    
                    <svg
                      viewBox="0 0 1 1"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full pointer-events-none -z-1"
                    >
                      <path
                        d="M0.06 0.09 Q0.03 0.10 0.03 0.16 L0.03 0.84 Q0.03 0.94 0.07 0.95 L0.93 0.95 Q0.97 0.94 0.97 0.85 L0.94 0.17 Q0.93 0.11 0.86 0.11 L0.13 0.09 Z"
                        fill="none"
                        stroke="#FFA88F"
                        strokeWidth="40"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  style={{ backgroundImage: "url('/shapes/vcard.png')" }}
                  className="absolute top-[15%] right-[19%] z-10 w-[24%] h-full bg-contain bg-center bg-no-repeat"
                />

                <div className="absolute top-[45%] right-[21%] z-10 w-[19%] text-center">
                  <p className="text-3xl font-medium mb-2 text-yellow-500">
                    {item.title}
                  </p>
                  <p className="text-white text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

     

         
      

          {/* Navigation Controls */}
          {validItems.length > 1 && showControls && (
            <>
           

              {/* Prev/Next buttons */}
              <div className="absolute bottom-4 right-1/2 translate-x-1/2 lg:right-[12%] lg:translate-x-0 flex gap-3 z-50">
               
                
                <button
                  onClick={prev}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f46c44]/80 flex items-center justify-center text-white hover:bg-[#f46c44] transition-colors hover:scale-105 active:scale-95"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={next}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f46c44]/80 flex items-center justify-center text-white hover:bg-[#f46c44] transition-colors hover:scale-105 active:scale-95"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}

         
        </div>
      </div>
    </section>
  );
}