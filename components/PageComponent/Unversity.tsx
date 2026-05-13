'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function UniversitySliderClient({ universities }) {
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
    <section className="max-w-[1440px] mx-auto lg:pt-12 overflow-hidden">
      <div className="  relative max-w-7xl px-4 mx-auto">
        <h2 className="text-xl   mb-2 ">
          <span className="text-[#F46C44] lg:text-4xl font-light" >
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
                  className="object-contain w-[240px] sm:w-[280px] lg:w-[240px]"
                />
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


export const CountryCardGrid = ({ countries }) => {
  console.log(countries)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {countries.map((country) => (
        <Link
          key={country._id}
          href={`/${country.slug}`}
          className="group relative block h-48 sm:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Learn about studying in ${country.navbarTitle || country.title}`}
        >
          {/* Background Image */}
          <img
            src={country.navbarImage || country.cardImage || '/placeholder-country.jpg'}
            alt={`${country.navbarTitle || country.title} flag or landmark`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

          {/* Content Badge */}
          <div className="absolute inset-0 flex items-end justify-center pb-4 px-3">
            <span className="bg-black/50 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm sm:text-base py-2.5 px-5 rounded-xl shadow-lg transform transition-transform group-hover:scale-[1.02]">
              {country.navbarTitle || country.title}
            </span>
          </div>

          {/* Optional: Subtitle or CTA hint on hover */}
          <div className="absolute inset-0 flex items-start justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white/90 text-xs bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
              Explore →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};