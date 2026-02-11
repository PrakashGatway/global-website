'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function UniversitySliderClient({universities}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSlider = async () => {
      const KeenSlider = (await import('keen-slider')).default;

      if (!sliderRef.current) return;

      const slider = new KeenSlider(
        sliderRef.current,
        {
          loop: true,
          mode: 'loop',
          slides: {
            origin: 'center',
            perView: 3,
            spacing: 0,
          },
          breakpoints: {
            '(min-width: 300px)': {
              slides: {
                perView: 3,
                spacing: 0,
              },
            },
            '(min-width: 640px)': {
              slides: {
                perView: 4.2,
                spacing: 0,
              },
            },
            '(min-width: 1024px)': {
              slides: {
                perView: 6,
                spacing: 12,
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

            slider.on('created', () => {
              slider.container.addEventListener('mouseenter', () => {
                mouseOver = true;
                clearNextTimeout();
              });
              slider.container.addEventListener('mouseleave', () => {
                mouseOver = false;
                nextTimeout();
              });
              nextTimeout();
            });

            slider.on('dragStarted', clearNextTimeout);
            slider.on('animationEnded', nextTimeout);
            slider.on('updated', nextTimeout);
          },
        ]
      );

      return () => slider.destroy();
    };

    initSlider();
  }, []);

  const universitie = [
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
    <section className="pt-12 overflow-hidden">
      <div className="  relative max-w-7xl mx-auto">
            <h2 className="text-5xl  mb-2 ">
              <span  className="text-red-700" >
                {universities.title?.split('||')[0]}
              </span>{" "} <br />
              <span className="text-primary font-bold relative">
                {universities.title?.split('||')[1]}
        <span className="absolute left-0 bottom-0  w-25 h-1 bg-red-700"></span>


                
              </span>



            </h2>
          
          </div>

      {/* FULL WIDTH SLIDER */}
      <div ref={sliderRef} className="keen-slider w-full   ">
        {universitie.map((university) => (
          <div key={university.id} className="keen-slider__slide ">
            <div className=" rounded-xl ">
              
              

              {/* Logo */}
            <div className="flex items-center justify-center h-[220px] sm:h-[260px] lg:h-[300px] w-full px-2">
  <Image
    src={university.src}
    alt={university.alt}
    width={800}
    height={450}
    className="object-contain w-[240px] sm:w-[280px] lg:w-[640px]"
  />
</div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
