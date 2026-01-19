'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import 'keen-slider/keen-slider.min.css';

export default function IvyLeagueUniversitySlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

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
              perView: 0,
              spacing: 20,
            },
            breakpoints: {
              '(min-width: 840px)': {
                slides: {
                  perView: 3.5,
                  spacing: 0,
                },
              },
              '(min-width: 1024px)': {
                slides: {
                  perView: 6,
                  spacing: 0,
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
    { id: 1, src: '/ivy/Harvard_University_coat_of_arms.svg', alt: 'Harvard University' },
    { id: 2, src: '/ivy/Yale_University_Shield_1.svg', alt: 'Yale University' },
    { id: 3, src: '/ivy/seal-and-logo-of-princeton-university-2JR4KMY.jpg', alt: 'Princeton University' },
    { id: 4, src: '/ivy/UniversityofPennsylvania_Shield_RGB-2.png', alt: 'University of Pennsylvania' },
    { id: 5, src: '/ivy/61Fa-pNEFXL._AC_UF1000,1000_QL80_.jpg', alt: 'Ivy League University' },
    { id: 6, src: '/ivy/images.png', alt: 'Ivy League University' },
  ];

  return (
    <div className="overflow-hidden py-0">
      <div ref={sliderRef} className="keen-slider" style={{ minHeight: '50px' }}>
        {universities.map((university) => (
          <div key={university.id} className="keen-slider__slide">
            <div className="flex flex-col items-center justify-center px-4 h-full">
              <div className="flex items-center justify-center w-full" style={{ height: '150px', minHeight: '150px' }}>
                <Image 
                  src={university.src}
                  alt={university.alt}
                  width={200}
                  height={150}
                  className="object-contain max-h-full max-w-full"
                  style={{ maxHeight: '150px', width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
