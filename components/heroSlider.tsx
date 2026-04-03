'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';

interface GalleryItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface HeroSliderProps {
  images: string[];
  videos: string[];
  universityName: string;
}

export default function HeroSlider({ images, videos, universityName }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
const galleryRef = useRef<any>(null);




  
  // Prepare gallery items
  const galleryItems: GalleryItem[] = [
    ...images.map(img => ({
      type: 'image' as const,
      url: img,
      thumbnail: img
    })),
    ...videos.map(video => ({
      type: 'video' as const,
      url: video,
      thumbnail: getYouTubeThumbnail(video)
    }))
  ];


  
const startAutoSlide = () => {
  stopAutoSlide();
  intervalRef.current = setInterval(() => {
    setCurrentIndex((prev) =>
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );
  }, 5000); // 5 sec
};

const stopAutoSlide = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
};


useEffect(() => {
  const handler = () => startAutoSlide();

  document.addEventListener('lgAfterClose', handler);
  return () => document.removeEventListener('lgAfterClose', handler);
}, []);




  // Function to get YouTube thumbnail
  function getYouTubeThumbnail(url: string): string {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`;
    }
    return '/default-thumbnail.jpg';
  }

  // Handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === galleryItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? galleryItems.length - 1 : prevIndex - 1
    );
  };

  if (galleryItems.length === 0) {
    return (
      <div className="relative h-[400px] w-full bg-gradient-to-r from-blue-50 to-slate-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-300 mb-2">📸</div>
            <p className="text-slate-400">No gallery images available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = galleryItems[currentIndex];
// console.log("currentItem" , currentItem.url)  
  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
      {/* Main Slider */}
      <div className="relative h-full w-full"
      onMouseEnter={stopAutoSlide}
  onMouseLeave={startAutoSlide}>
        {currentItem.type === 'image' ? (
          <div className="relative h-full w-full">
            <Image
              src={currentItem.url}
              alt={`${universityName} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ) : (
          <div className="relative h-full w-full">
            {/* Video thumbnail with play button */}
            <Image
              src={currentItem.thumbnail || ''}
              alt={`${universityName} - Video ${currentIndex + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        {galleryItems.length > 1 && (
          <>
            <button
               onClick={() => {
    stopAutoSlide();
    
    startAutoSlide();
    prevSlide()
  }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
    stopAutoSlide();
    
    startAutoSlide();
    nextSlide()
  }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {galleryItems.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* LightGallery for full gallery view */}
      <div className="hidden">
       <LightGallery
  onInit={(detail) => {
    galleryRef.current = detail;
  }}
  speed={500}
  plugins={[lgZoom, lgVideo]}
  elementClassNames="hidden"
>

  {galleryItems.map((item, index) => (
    <a
      key={index}
      href={item.url}
      data-lg-size={item.type === 'image' ? '1400-800' : undefined}
      {...(item.type === 'video'
        ? {
            'data-video': JSON.stringify({
              source: [{ src: item.url, type: 'video/youtube' }],
              attributes: { preload: false, controls: true },
            }),
          }
        : {})}
    >
      <img src={item.thumbnail || item.url} alt="" />
    </a>
  ))}
</LightGallery>

      </div>

      {/* Gallery Thumbnails */}
      {galleryItems.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 px-4">
          <div className="flex overflow-x-auto space-x-2 py-2">
            {galleryItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex 
                    ? 'border-blue-500 ring-2 ring-blue-500/30' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <div className="relative w-full h-full">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <>
                      <Image
                        src={item.thumbnail || '/default-thumbnail.jpg'}
                        alt={`Video thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View Gallery Button */}
      <div className="absolute top-4 right-4 text-white  ">
      <button className='cursor-pointer bg-white text-orange-500 p-2 rounded-[12px]'
  onClick={() => {
    stopAutoSlide();

    if (galleryRef.current?.instance) {
      galleryRef.current.instance.openGallery(currentIndex);
    }
  }}
>
  View Gallery ({galleryItems.length})
</button>


      </div>
    </div>
  );
}