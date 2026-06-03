'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tag, Tagging } from '../tag';

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
  tag?: any;
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
  title = " Video || Testinomial",
  subtitle = "",
  tag = 2
}: VideoTestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Filter only video testimonials
  const videoItems = items.filter(item => item.videoUrl);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videoItems.length);
    setIsPlaying(true);
  }, [videoItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videoItems.length) % videoItems.length);
    setIsPlaying(true);
  }, [videoItems.length]);

  // Empty state
  if (!videoItems.length) {
    return (
      <section className="bg-white py-10 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-lg lg:text-2xl font-bold mb-4">
            {title.includes('||') ? (
              <>

                <Tag data={tag} css={"text-[#f46c44]"} text={title.split('||')[0].trim()} /> {' '}
                <Tag data={tag} css={"text-gray-600"} text={title.split('||')[1].trim()} />
                {/* <span className="text-gray-600">{title.split('||')[1].trim()}</span> */}
              </>
            ) : title}
          </span>
          <p className="text-gray-500">No video testimonials available</p>
        </div>
      </section>
    );
  }

  const currentItem = videoItems[currentIndex];
  const videoId = getYouTubeId(currentItem.videoUrl);
  const isMp4 = currentItem.videoUrl?.endsWith('.mp4');


  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white py-10 pb-20 relative max-w-screen overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <Tagging data={tag} css="relative inline-block mb-4 sm:mb-6 block">
            <span className="text-black text-2xl sm:text-3xl block font-medium mr-2">
              {title.split("||")[0]}
            </span>
            <span className="text-[#F46C44] text-2xl sm:text-3xl block font-semibold mr-2">
              {title.split("||")[1]}
            </span>
          
          </Tagging>


          <p
            className="text-gray-600 mt-2"
            dangerouslySetInnerHTML={{
              __html: subtitle
            }}
          />
        </motion.div>

        {/* Main Video Section */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Video - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-black"
            >
              <div className="aspect-video w-full">
                {isMp4 ? (
                  <video
                    key={currentItem.videoUrl} // Force re-render on video change
                    src={currentItem.videoUrl}
                    controls
                    autoPlay={isPlaying}
                    className="w-full h-full"
                  />
                ) : videoId ? (
                  <iframe
                    key={currentItem.videoUrl} // Force re-render on video change
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading='lazy'
                    title={`${currentItem.name} testimonial`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Video unavailable</p>
                  </div>
                )}
              </div>

              {/* Testimonial Quote Overlay */}

            </motion.div>
          </div>

          {/* More Videos Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 h-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-600 fill-red-600" />
                More Videos
              </h3>

              <div className="space-y-4">
                {videoItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => handleThumbnailClick(index)}
                    className={`group cursor-pointer transition-all ${index === currentIndex ? 'scale-[1.02]' : ''
                      }`}
                  >
                    <div className="flex gap-3">
                      {/* Video Thumbnail */}
                      <div className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gray-200">
                        {getYouTubeId(item.videoUrl) ? (
                          <img
                            src={`https://img.youtube.com/vi/${getYouTubeId(item.videoUrl)}/mqdefault.jpg`}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs">
                            Video
                          </div>
                        )}
                        {/* Play Icon Overlay */}
                        <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-all ${index === currentIndex ? 'bg-black/50' : 'group-hover:bg-black/40'
                          }`}>
                          <Play className={`w-6 h-6 text-white ${index === currentIndex ? 'fill-white' : 'fill-white/80'
                            }`} />
                        </div>
                        {/* Active Indicator */}
                        {index === currentIndex && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-red-600 transition">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {item.designation || 'Testimonial'}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation Arrows for Mobile/Tablet */}
              <div className="flex items-center justify-between mt-6 lg:hidden">
                <button
                  onClick={prevSlide}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} / {videoItems.length}
                </span>
                <button
                  onClick={nextSlide}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                  aria-label="Next video"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Progress Indicators for Mobile */}
        <div className="flex justify-center gap-2 mt-8 lg:hidden">
          {videoItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentIndex
                  ? 'w-8 bg-red-600'
                  : 'w-2 bg-gray-400 hover:bg-gray-600'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}