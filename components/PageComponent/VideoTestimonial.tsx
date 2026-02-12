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
      <section className=" py-4 lg:py-12 text-center">
        <h2 className="text-lg lg:text-2xl font-bold mb-4">
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
 <section className="bg-[#efefef] py-10 pb-20 relative">

  <div className="max-w-7xl mx-auto px-6">

    {/* ================= TITLE ================= */}
    <div className=" mb-10 lg:mb-20">
      <h2 className="text-lg lg:text-5xl font-light text-red-700">
        {title.includes("||")
          ? title.split("||")[0].trim()
          : ""}
      </h2>

      <h3 className="text-xl lg:text-6xl font-bold text-primary relative inline-block lg:mt-2">
        {title.includes("||")
          ? title.split("||")[1].trim()
          : "Testimonials"}

        <span className="absolute right-0 -bottom-1 w-32 h-[2px] lg:h-1 bg-red-600"></span>
      </h3>
    </div>

    {/* ================= SLIDER ================= */}
    <div
  className="relative mx-auto"
  onMouseEnter={() => pauseOnHover && setIsHovering(true)}
  onMouseLeave={() => pauseOnHover && setIsHovering(false)}
>

  {/* ===== STATIC BEIGE BACKGROUND (NOT INSIDE MOTION) ===== */}
  <div className="hidden lg:block absolute -left-40 -top-10 w-[45%] h-[75%] bg-[#e5cfc5] rounded-tr-[40px] rounded-br-[30px] z-0"></div>

  <AnimatePresence mode="wait">
    <motion.div
  key={index}
  initial={{ x: 100 }}
  animate={{ x: 0 }}
  exit={{ x: -100 }}
  transition={{ duration: 0.4, ease: "easeInOut" }}
  className="relative z-10"
>

      {/* ================= VIDEO ================= */}
     <div className="relative 
                w-full 
                sm:w-[90%] 
                md:w-[80%] 
                lg:w-[95%] 
                mx-auto 
                py-1 
                lg:h-[500px] 
                rounded-[30px] lg:rounded-[40px] 
                shadow-2xl 
                bg-white">

  <div className="aspect-video lg:h-full">
    {item.isMp4 ? (
      <video
        src={item.videoUrl}
        controls
        className="w-full h-full object-cover rounded-[30px] lg:rounded-[40px]"
      />
    ) : item.videoId ? (
      <iframe
        className="w-full h-full rounded-[30px] lg:rounded-[40px]"
        src={`https://www.youtube.com/embed/${item.videoId}`}
        allowFullScreen
      />
    ) : (
      <p className="text-center text-gray-500 py-20">
        Video unavailable
      </p>
    )}
  </div>

  {/* ================= BADGE ================= */}
  <div className="
      absolute 
      bottom-[-40px] 
      right-[-10px] 
      sm:right-0 
      sm:bottom-[-30px]
      lg:-bottom-10 
      lg:-right-16 
      bg-[#6d1901] 
      w-[90%] 
      sm:w-[320px] 
      text-white 
      px-5 
      sm:px-6 
      py-5 
      sm:py-6 
      rounded-2xl 
      lg:rounded-3xl 
      shadow-xl 
      z-20
      lg:block hidden
    ">
    <p className="text-base sm:text-lg font-semibold leading-relaxed">
      {item.title}
      <br />
      {item.text}
    </p>
  </div>

</div>

    </motion.div>
  </AnimatePresence>

</div>

  </div>
</section>

);

}