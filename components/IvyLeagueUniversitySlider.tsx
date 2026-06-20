'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

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
              perView: 3,
              spacing: 20,
            },
            breakpoints: {
              '(min-width: 840px)': {
                slides: {
                  perView: 5.5,
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
    { id: 1, src: 'https://www.gatewayabroadeducations.com/anime/p1.svg', alt: 'University 1' },
    { id: 2, src: 'https://www.gatewayabroadeducations.com/anime/p2.svg', alt: 'University 2' },
    { id: 3, src: 'https://www.gatewayabroadeducations.com/anime/p3.svg', alt: 'University 3' },
    { id: 4, src: 'https://www.gatewayabroadeducations.com/anime/p4.svg', alt: 'University 4' },
    { id: 5, src: 'https://www.gatewayabroadeducations.com/anime/p5.svg', alt: 'University 5' },
    { id: 6, src: 'https://www.gatewayabroadeducations.com/anime/p6.svg', alt: 'University 6' },
    { id: 7, src: 'https://www.gatewayabroadeducations.com/anime/p7.svg', alt: 'University 7' },
    { id: 8, src: 'https://www.gatewayabroadeducations.com/anime/p8.svg', alt: 'University 8' },
    { id: 9, src: 'https://www.gatewayabroadeducations.com/anime/p9.svg', alt: 'University 9' },
    { id: 10, src: 'https://www.gatewayabroadeducations.com/anime/p10.svg', alt: 'University 10' },
  ];

  return (
    <div className="overflow-hidden py-0">
  <div
    ref={sliderRef}
    className="keen-slider"
    style={{ minHeight: "50px" }}
  >
    {universities.map((university) => (
      <div key={university.id} className="keen-slider__slide">
        <div className="flex flex-col items-center justify-center lg:px-3  h-full w-[120px] sm:w-[160px] md:w-[180px]">
          
          {/* IMAGE WRAPPER */}
          <div
            className="
              flex items-center justify-center w-full
              h-[120px]
              sm:h-[140px]
              md:h-[150px]
            "
          >
            <Image
              src={university.src}
              alt={university.alt}
              width={200}
              height={150}
              loading="lazy"
              className="object-contain max-h-full max-w-full"
              sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 200px"
              style={{
                width: "auto",
                height: "auto",
                maxHeight: "100%",
              }}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
