'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import 'keen-slider/keen-slider.min.css';

export default function UniversitySlider() {
  const sliderRef = useRef(null);

  useEffect(() => {
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
              perView: 2.5,
              spacing: 2,
            },
            breakpoints: {
              '(min-width: 640px)': {
                slides: {
                  perView: 3.5,
                  spacing: 3,
                },
              },
              '(min-width: 1024px)': {
                slides: {
                  perView: 8.5,
                  spacing: 4,
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
  }, []);

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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span style={{ color: '#f46c44' }}>International</span> University Partners
        </h2>
        
        <div ref={sliderRef} className="keen-slider">
          {universities.map((university) => {
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
    </section>
  );
}

