'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import 'keen-slider/keen-slider.min.css';

interface UniversitySliderClientProps {
  variant?: 'default' | 'about-us';
  direction?: 'left' | 'right';
  speed?: number;
}

export default function UniversitySliderClient({ variant = 'default', direction, speed = 30 }: UniversitySliderClientProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip keen-slider if direction is provided (using CSS animations instead)
    if (direction) return;

    const keenSlider = async () => {
      const KeenSlider = (await import('keen-slider')).default;
      
      if (sliderRef.current) {
        const slider = new KeenSlider(
          sliderRef.current,
          {
            loop: true,
            mode: 'free',
            slides: {
              origin: 'center',
              perView: variant === 'about-us' ? 5.5 : 2.5,
              spacing: variant === 'about-us' ?30: 20,  
            },
            breakpoints: {
              '(min-width: 640px)': {
                slides: {
                  perView: variant === 'about-us' ? 3.5 : 3.5,
                  spacing: variant === 'about-us' ? 20 : 20,
                },
              },
              '(min-width: 1024px)': {
                slides: {
                  perView: variant === 'about-us' ? 5 : 100 ,
                  spacing: variant === 'about-us' ? 20 : 20,
                },
              },
            },
          },
          [
            (slider) => {
              let timeout: ReturnType<typeof setTimeout>;
              let mouseOver = false;
              function clearNextTimeout() {
                clearTimeout(timeout);
              }
              function nextTimeout() {
                clearTimeout(timeout);
                if (mouseOver) return;
                timeout = setTimeout(() => {
                  slider.next();
                }, 3000);
              }
              slider.on("created", () => {
                slider.container.addEventListener("mouseover", () => {
                  mouseOver = true;
                  clearNextTimeout();
                });
                slider.container.addEventListener("mouseout", () => {
                  mouseOver = false;
                  nextTimeout();
                });
                nextTimeout();
              });
              slider.on("dragStarted", clearNextTimeout);
              slider.on("animationEnded", nextTimeout);
              slider.on("updated", nextTimeout);
            },
          ]
        );

        return () => {
          slider.destroy();
        };
      }
    };

    keenSlider();
  }, [variant, direction]);

  const universities = [
    { id: 1, src: '/university1.svg', alt: 'University 1' },
    { id: 2, src: '/university2.svg', alt: 'University 2' },
    { id: 3, src: '/university3.svg', alt: 'University 3' },
    { id: 4, src: '/university4.svg', alt: 'University 4' },
    { id: 5, src: '/university5.svg', alt: 'University 5' },
    { id: 6, src: '/university6.svg', alt: 'University 6' },
    { id: 7, src: '/university7.svg', alt: 'University 7' },
    { id: 8, src: '/university8.svg', alt: 'University 8' },
    { id: 9, src: '/university9.svg', alt: 'University 9' },
    { id: 10, src: '/university10.svg', alt: 'University 10' },
  ];

  // CSS Animation-based slider when direction is provided
  if (direction) {
    return (
      <div className="overflow-hidden w-full py-0.5">
        <div
          className={`flex gap-2 whitespace-nowrap ${
            direction === "right"
              ? "animate-slider-right"
              : "animate-slider-left"
          }`}
          style={{ animationDuration: `${speed}s` }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-2">
              {universities.map((university, index) => (
                <div
                  key={`${i}-${university.id}`}
                  className="border-t border-b border-gray-400 px-3 py-1.5 flex items-center justify-center min-w-[180px] bg-white"
                  style={{ 
                    height: '50px',
                    borderTopRightRadius: '18px',
                    borderTopLeftRadius: '0',
                    borderBottomLeftRadius: '0',
                    borderBottomRightRadius: '0',
                    borderLeftWidth: '0.3px',
                    borderRightWidth: '0.3px'
                  }}
                >
                  <Image
                    src={university.src}
                    alt={university.alt}
                    width={75}
                    height={25}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="pt-0 pb-16 bg-white" style={variant === 'about-us' ? { overflowX: 'visible' } : {}}>
      <div className="max-w-7xl mx-auto">
        {variant === 'default' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              <span style={{ color: '#f46c44' }}>International</span>{" "}
              <span className="text-gray-800">University Partners</span>
            </h2>
          </div>
        )}
        
        <div className="px-4 sm:px-6 lg:px-8" style={variant === 'about-us' ? { overflowX: 'visible' } : {}}>
          <div ref={sliderRef} className="keen-slider" style={variant === 'about-us' ? { overflow: 'visible', paddingLeft: '1rem', paddingRight: '1rem' } : {}}>
        {universities.map((university, index) => {
          if (variant === 'about-us') {
            return (
              <div key={university.id} className="keen-slider__slide" style={{ minWidth: '220px', boxSizing: 'border-box' }}>
                <div className="relative h-20 bg-white p-4 w-full overflow-hidden" style={{ borderTopRightRadius: '24px', border: '1.5px solid black', boxSizing: 'border-box' }}>
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <Image 
                      src={university.src}
                      alt={university.alt}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            );
          }
          
          const pathData = "M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z";
          return (
            <div key={university.id} className="keen-slider__slide">
              <div className="relative w-full h-24 bg-white rounded-lg p-4 overflow-visible" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
                {/* SVG Border - properly sized */}
                <svg
                  viewBox="0 0 300 200"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#f46c44"
                    strokeWidth="1.5"
                  />
                </svg>
                {/* Content */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <Image 
                    src={university.src}
                    alt={university.alt}
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>
    </section>
  );
}
