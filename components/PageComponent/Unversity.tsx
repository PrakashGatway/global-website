'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function UniversitySliderClient({universities}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const initSlider = async () => {
    const KeenSlider = (await import("keen-slider")).default;

    if (!sliderRef.current) return;

    // ✅ MARQUEE PLUGIN
    const marquee = (slider: any) => {
      let raf: number;
      const speed = 0.0008; // ⭐ control speed here

      const move = () => {
        if (!slider.track.details) return;

        slider.track.add(speed);
        raf = requestAnimationFrame(move);
      };

      slider.on("created", () => {
        raf = requestAnimationFrame(move);
      });

      slider.on("destroyed", () => {
        cancelAnimationFrame(raf);
      });
    };

    const slider = new KeenSlider(
      sliderRef.current,
      {
        loop: true,
        renderMode: "performance",
        drag: false, // important for marquee feel
        slides: {
          origin: "center",
          perView: 3,
          spacing: 0,
        },
        breakpoints: {
          "(min-width: 300px)": {
            slides: { perView: 2, spacing: 0 },
          },
          "(min-width: 640px)": {
            slides: { perView: 4.2, spacing: 0 },
          },
          "(min-width: 1024px)": {
            slides: { perView: 6, spacing: 12 },
          },
        },
      },
      [marquee]
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
    <section className="  lg:pt-12 overflow-hidden">
      <div className="  relative max-w-7xl px-4 mx-auto">
            <h2 className="text-xl   mb-2 ">
              <span  className="text-[#F46C44] lg:text-4xl font-light" >
                {universities.title?.split('||')[0]}
              </span>{" "} <br />
              <span className="text-primary font-bold relative lg:text-5xl">
                {universities.title?.split('||')[1]}
        <span className="absolute right-0 -bottom-1 lg:bottom-0  w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>


                
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
