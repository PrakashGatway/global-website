'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
    <section className="max-w-[1440px] mx-auto lg:pt-1 overflow-hidden bg-white">
     {universities?.title && (
      <div className="relative max-w-7xl px-4 mx-auto">
        <h2 className="text-xl   mb-2 ">
          <span className="text-[#F46C44] lg:text-4xl font-light" >
            {universities?.title?.split('||')[0] || null}
          </span>{" "} <br />
          <span className="text-primary font-bold relative lg:text-5xl">
            {universities?.title?.split('||')[1] || null}



          </span>



        </h2>

      </div>
     ) } 

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





import { motion } from "framer-motion";
import { useState, useMemo } from "react";

// --- Types ---
interface Country {
    id: string;
    name: string;
    description: string;
    link: string;
    badge?: string;
    badgeColor?: string;
    bgClass: string;
    image: string;
}



export const CountryCardGrid = ({ countries }: { countries: any[] }) => {
   const [hoveredId, setHoveredId] = useState<string | null>(null);
   const [mappedCountries, setMappedCountries] = useState<any[]>([]);

   useEffect(() => {
       if (countries && Array.isArray(countries)) {
           const transformed = countries.map((item: any, index: number) => {
               // Handle nested country object (like item 0) OR flat structure (items 1-6)
               const countryData = item && typeof item === 'object' 
                   ? { ...item.country, ...item } 
                   : { ...item };

               // Normalize all required fields with fallbacks
               const normalized = {
                   id: String(countryData._id || countryData.id || index),
                   name:  countryData.title || 'Country',
                   image: countryData.image || countryData.navbarImage || countryData.cardImage || '',
                   link: countryData.slug ? `/${countryData.slug}` : countryData.link || '#',
                   description: countryData.subTitle || countryData.description || '',
                  
                   
                  
                   ...item
               };

               return normalized;
           });

           setMappedCountries(transformed);
       }
   }, [countries]);

   console.log(countries);

   // --- Dynamic Layout Logic --- (UNCHANGED)
   const firstRow = useMemo(() => mappedCountries.slice(0, 4), [mappedCountries]);
   const secondRow = useMemo(() => mappedCountries.slice(4), [mappedCountries]);

   const getCardWidth = (id: string, rowType: 'first' | 'second') => {
       const rowItems = rowType === 'first' ? firstRow : secondRow;
       const idsInRow = rowItems.map(c => c.id);
       
       if (!idsInRow.includes(id)) return "lg:w-[20%]";

       const defaultBigId = rowType === 'first' ? idsInRow[0] : idsInRow[idsInRow.length - 1];

       if (!hoveredId) {
           return id === defaultBigId ? "lg:w-[40%]" : "lg:w-[20%]";
       }

       if (idsInRow.includes(hoveredId)) {
           return id === hoveredId ? "lg:w-[40%]" : "lg:w-[20%]";
       }

       return id === defaultBigId ? "lg:w-[40%]" : "lg:w-[20%]";
   };

   if (!mappedCountries.length) return null;

   return (
       <div className="w-full max-w-7xl mx-auto px-4 py-8">
           {/* Mobile View */}
           <div className="lg:hidden">
               <div className="grid grid-cols-2 gap-3 sm:gap-4">
                   {mappedCountries.map((country) => (
                       <MobileCard key={country.id} country={country} />
                   ))}
               </div>
           </div>

           {/* Desktop View - First Row */}
           {firstRow.length > 0 && (
               <div className="hidden lg:flex lg:flex-row gap-4 mb-4">
                   {firstRow.map((country) => (
                       <DesktopCard 
                           key={country.id}
                           country={country}
                           widthClass={getCardWidth(country.id, 'first')}
                           hoveredId={hoveredId}
                           setHoveredId={setHoveredId}
                       />
                   ))}
               </div>
           )}

           {/* Desktop View - Second Row */}
           {secondRow.length > 0 && (
               <div className="hidden lg:flex lg:flex-row gap-4">
                   {secondRow.map((country, index) => (
                       <DesktopCard 
                           key={country.id}
                           country={country}
                           widthClass={getCardWidth(country.id, 'second')}
                           hoveredId={hoveredId}
                           setHoveredId={setHoveredId}
                           delay={0.2 + index * 0.05}
                       />
                   ))}
               </div>
           )}
       </div>
   );
};

// --- Desktop Card Component ---
function DesktopCard({ 
    country, 
    widthClass, 
    hoveredId, 
    setHoveredId, 
    delay = 0.2 
}: { 
    country: Country; 
    widthClass: string; 
    hoveredId: string | null; 
    setHoveredId: (id: string | null) => void;
    delay?: number;
}) {
 
  console.log(country.country)
    return (
        <motion.a
            href={country.link}
            className={`relative h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${widthClass} bg-gradient-to-br ${country.bgClass} hover:shadow-2xl group`}
            onHoverStart={() => setHoveredId(country.id)}
            onHoverEnd={() => setHoveredId(null)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            layout
        >
            <img
                src={country.image?.startsWith('http') ? country.image : ``}
                alt={country.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
            
          {country.country.name && (
  <span
    className="
      absolute top-4 left-4 z-20
      bg-black/50 backdrop-blur-sm
      text-white text-xs font-semibold
      px-3 py-1 rounded-full
      shadow-lg
    "
  >
    <span className="flex items-center gap-2">
      <img
        className="w-8 h-8 rounded-[8px] object-cover"
        src={country.navbarImage}
        alt={country.country.name}
      />

      <span className="whitespace-nowrap">
        {country.country.name}
      </span>
    </span>
  </span>
)}
            
            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-white transition-all ">
                <h3 className="text-2xl font-bold leading-tight">{country?.name}</h3>
                <p className="text-sm text-white/90 mt-1 line-clamp-2">{country?.description}</p>
                
                <span className="inline-flex items-center gap-1 hover:text-orange-500 mt-5  text-white text-xs font-bold px-4  ">
                    Explore {country.name.split(' ')[0]} →
                </span>
            </div>
        </motion.a>
    );
}

// --- Mobile Card Component ---
function MobileCard({ country }: { country: Country }) {
  return (
    <motion.a
      href={country.link}
      className="
        relative w-full
        h-52 sm:h-60 md:h-64
        rounded-2xl overflow-hidden
        cursor-pointer group
        bg-gray-900
        shadow-lg
      "
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image */}
      <img
        src={country.image?.startsWith("http") ? country.image : ""}
        alt={country.name}
        className="
          absolute inset-0
          w-full h-full
          object-cover
          transition-transform duration-500
          group-hover:scale-110
        "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

      {/* Country Badge */}
     {country.country?.name && (
  <div className="absolute top-3 left-3 z-20 max-w-[80%]">
    <div
      className="
        flex items-center gap-2
        bg-black/45 backdrop-blur-md
        text-white
        px-3 py-2
        rounded-full
        shadow-lg
      "
    >
      <img
        className="
          w-5 h-5 min-w-[20px]
          rounded-full
          object-cover
          border border-white/20
        "
        src={country.navbarImage}
        alt={country.country.name}
      />

      <span
        className="
          text-[11px] sm:text-xs
          font-semibold
          truncate
        "
      >
        {country.country.name}
      </span>
    </div>
  </div>
)}
      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white">
        <h3
          className="
            text-base sm:text-lg
            font-bold
            leading-snug
            line-clamp-2
          "
        >
          {country.name}
        </h3>

        <span
          className="
            inline-flex items-center gap-1.5
            mt-3
            bg-[#f46c44] text-white
            text-xs sm:text-sm
            font-semibold
            px-4 py-2
            rounded-full
            shadow-md
          "
        >
          Explore
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.a>
  );
}