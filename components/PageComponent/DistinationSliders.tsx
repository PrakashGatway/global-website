"use client";

import { useEffect, useRef } from "react";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";

const DATA = [
  { count: 244, text: "Offers to Cornell" },
  { count: 109, text: "Offers to Princeton" },
  { count: 187, text: "Offers to Stanford" },
  { count: 130, text: "Offers to Yale" },
  { count: 139, text: "Offers to Johns Hopkins" },
  { count: 24, text: "Offers to Caltech" },
  { count: 365, text: "Offers to UC Berkeley" },
  { count: 338, text: "Offers to UCLA" },
];

function OfferCard({ count, text }: { count: number; text: string }) {
  return (
    <div className="keen-slider__slide !w-full">
      <div className="
        flex items-center gap-2
        border-2 border-[#ff6a3d]
        text-[#ff6a3d]
        px-6 py-4
        text-base font-medium
        whitespace-nowrap
        bg-white
      ">
        <span className="font-bold text-xl">{count}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

function marquee(speed = 0.1) {
  return (slider: any) => {
    let rafId: number;
    let lastTime: number | null = null;

    function loop(time: number) {
      if (lastTime) {
        const delta = time - lastTime;
        slider.track.details.position += (speed * delta) / 15000;
        slider.track.details.position %= slider.track.details.length;
        slider.track.to(slider.track.details.position);
      }
      lastTime = time;
      rafId = requestAnimationFrame(loop);
    }

    slider.on("created", () => {
      rafId = requestAnimationFrame(loop);
    });

    slider.on("destroyed", () => {
      cancelAnimationFrame(rafId);
    });
  };
}


export default function OffersSlider() {
  const sliderRef1 = useRef<HTMLDivElement>(null);
  const sliderRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef1.current || !sliderRef2.current) return;

    const slider1 = new KeenSlider(
      sliderRef1.current,
      {
        loop: true,
        drag: true,
        renderMode: "performance",
        slides: { perView: "6", spacing: 6 },
      },
      [marquee(0.4)] // left → right
    );

    const slider2 = new KeenSlider(
      sliderRef2.current,
      {
        loop: true,
        drag: true,
        rtl: true,
        slides: { perView: "6", spacing: 6 },
      },
      [marquee(0.4)] // right → left
    );

    return () => {
      slider1.destroy();
      slider2.destroy();
    };
  }, []);

  return (
    <div className="space-y-6 py-8 overflow-hidden bg-white">
      <div ref={sliderRef1} className="keen-slider">
        {[...DATA, ...DATA].map((item, i) => (
          <OfferCard key={i} {...item} />
        ))}
      </div>

      <div ref={sliderRef2} className="keen-slider">
        {[...DATA, ...DATA].map((item, i) => (
          <OfferCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}


import React from 'react';
import Image from 'next/image';

import { useState } from 'react';

export const IvyLeagueSection = ({ whySpecialData }: { whySpecialData: any }) => {
  // Use API title or fallback structure
  const fullTitle = whySpecialData?.title || "What Makes Ivy league Special";
  
  // Map API items to card format
  const cards = (whySpecialData?.items || []).map((item: any) => ({
    id: item.title,
    title: item.title,
    description: item.subtitle || "",
    ctaText: "Free Expert Consultation", // Not in API → keep static per your design
    ctaLink: "#" // Not in API → keep static
  }));

  // Fallback image for the right-side visual (since API provides no global image)
  const fallbackImage = "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200";

  return (
    <section
      className="min-h-screen py-16 px-4 md:px-8 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #fffaf7 0%, 100%)'
      }}
    >
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* LEFT: Cards */}
        <div className="w-full lg:w-1/2 relative">
          <h4 
            className="text-[2.6rem] mb-6 text-[#f46c44] font-semibold" 
            style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
          >
            {fullTitle}
          </h4>
          
          <div className="relative perspective-1000">
            {cards.map((card, index) => (
              <div
                key={card.id}
                style={{
                  transform: 'perspective(1000px) rotateY(25deg) rotateZ(-5deg) skewX(-6deg) skewY(2deg) rotateX(3deg)',
                  transition: 'transform 0.5s ease-in-out'
                }}
                className="bg-gradient-to-r from-[#f46c44] max-w-lg rounded-3xl mb-12 via-[#f46c44]/90 to-[#f46c44]/40 p-6 transition-all duration-300"
              >
                <div className="relative z-20">
                  <h3 
                    style={{ 
                      fontFamily: "'Mileast', 'Playplay Display', 'Cormorant Garamond', Georgia, serif", 
                      fontWeight: 500 
                    }}
                    className="text-[2rem] font-bold mb-1 text-white"
                  >
                    {card.title}
                  </h3>
                  <p className="mb-2 text-white text-base">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-center">
                    <a
                      href={card.ctaLink}
                      className="inline-block bg-[#ffffff]/80 text-gray-600 font-semibold py-2 px-4 rounded-full transition-all duration-300"
                    >
                      {card.ctaText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Image with fallback */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-full h-full">
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full"
              preserveAspectRatio="none"
              style={{
                filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
              }}
            >
              <defs>
                <clipPath id="til" clipPathUnits="userSpaceOnUse">
                  <path d="M45.235 17.808Q21.782 19.632 22.621 47.924L22.412 220.324Q21.782 245.981 51.393 252.749L204.127 281.166Q233.417 288.339 235.357 260.421L235.97 53.425Q236.438 16.291 204.181 17.969L49.519 17.358Z" />
                </clipPath>
              </defs>
              
              {/* Use fallback image since API doesn't provide one for this section */}
              <image
                href={fallbackImage}
                x="0"
                y="0"
                width="100%"
                height="100%"
                clipPath="url(#til)"
                preserveAspectRatio="xMidYMid slice"
              />

              <path
                d="M45.235 17.808Q21.782 19.632 22.621 47.924L22.412 220.324Q21.782 245.981 51.393 252.749L204.127 281.166Q233.417 288.339 235.357 260.421L235.97 53.425Q236.438 16.291 204.181 17.969L49.519 17.358Z"
                fill="none"
                stroke="#f46c44"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

import { 
  Award, 
  GraduationCap, 
  FileText, 
  ClipboardList, 
  ScrollText, 
  FolderOpen, 
  FileSignature 
} from 'lucide-react';

// Helper to map requirement text to icon
const getIconComponentt = (title: string) => {
  const lower = title.toLowerCase();
  
  if (lower.includes('passport')) return GraduationCap; // as in your original
  if (lower.includes('gmat') || lower.includes('gre')) return GraduationCap;
  if (lower.includes('recommendation') || lower.includes('lor')) return FileText;
  if (lower.includes('cv') || lower.includes('resume')) return Award;
  if (lower.includes('toefl') || lower.includes('ielts') || lower.includes('c1')) return ClipboardList;
  if (lower.includes('transcript')) return ScrollText;
  if (lower.includes('portfolio')) return FolderOpen;
  if (lower.includes('statement of purpose') || lower.includes('sop')) return FileSignature;
  
  return Award; // default if no match (still from API-driven logic)
};

const RequirementItemm = ({ title }: { title: string }) => {
  const Icon = getIconComponentt(title);
  return (
    <div className="flex items-start space-x-6">
      <Icon className="text-[#f46c44] -mt-0.5 flex-shrink-0" size={40} />
      <span className="text-[#656565] font-medium">{title}</span>
    </div>
  );
};

export function AdmissionRequirementsUK({ admissionData }: { admissionData: any }) {
  // Parse title with "||" support
  const fullTitle = admissionData?.title || "";
  const parts = fullTitle.includes('||')
    ? fullTitle.split('||').map((s: string) => s.trim())
    : [fullTitle.split(' ').slice(0, 3).join(' '), fullTitle.split(' ').slice(3).join(' ')];

  const prefix = parts[0] || "Admission Requirements for";
  const suffix = parts[1] || "United Kingdom Study Abroad";

  const items = admissionData?.items || [];

  // Split into two columns
  const midIndex = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, midIndex);
  const rightColumn = items.slice(midIndex);

  return (
    <section className="bg-[#f5f1f0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 
          style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 600 }} 
          className="text-[2.6rem] font-bold text-[#f46c44] mb-3 leading-tight"
        >
          <span className="block text-[#656565]">{prefix}</span>
          {suffix}
        </h2>

        <p className="text-[#656565] max-w-3xl mb-6 text-base font-semibold">
          {admissionData?.subtitle || ""}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {leftColumn.map((item: any, index: number) => (
              <RequirementItemm key={index} title={item.title} />
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {rightColumn.map((item: any, index: number) => (
              <RequirementItemm key={index + leftColumn.length} title={item.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Item Component ---------- */

function Item({
  icon: Icon,
  text,
  underline
}: {
  icon: any;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[#f46c44]">
        <Icon size={40} strokeWidth={1.2} />
      </div>
      <p style={{textDecoration:underline && "underline"}} className="text-[#656565] text-base font-semibold leading-relaxed">
        {text}
      </p>
    </div>
  );
}


export function HowGawayHelps({ howWeHelpData }: { howWeHelpData: any }) {
  // Parse title with "||" separator support
  const fullTitle = howWeHelpData?.title || "";
  const [prefix, suffix] = fullTitle.includes('||')
    ? fullTitle.split('||').map((s: string) => s.trim())
    : fullTitle.split(' ').length > 1
    ? [fullTitle.split(' ')[0], fullTitle.split(' ').slice(1).join(' ')]
    : ["", fullTitle];

  // Get the first item from API
  const item = howWeHelpData?.items?.[0];

  return (
    <section className="bg-[#fff9f4] py-20">
      <h3 
        style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} 
        className="text-center text-[2.6rem] font-semibold mb-12"
      >
        <span className="text-[#f46c44]">{prefix}</span>{" "}
        <span className="text-[#6b6b6b]">{suffix}</span>
      </h3>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* LEFT TEXT CONTENT */}
        <div>
          <h2 
            style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} 
            className="text-[3.6rem] font-semibold text-[#f46c44] leading-tight mb-2"
          >
            {item?.title?.split(' ').slice(0, 2).join(' ')} <br />
            {item?.title?.split(' ').slice(2).join(' ')}
          </h2>

          <p className="text-[#656565] font-semibold mb-4">
            {item?.subtitle || item?.content}
          </p>
        </div>

        {/* RIGHT CARDS - Using ONLY API images */}
        <div className="relative h-[440px] duration-300 ease-in-out transition-all w-full flex justify-center">

          {/* BACK CARD - Use API image or empty */}
          {item?.image && (
            <div className="
              absolute top-2 right-25
              w-[380px] h-[440px] duration-300 ease-in-out transition-all
              border-2 border-[#f46c44]
              bg-orange-500
              rotate-[5deg]
            ">
              
            </div>
          )}

          {/* MIDDLE CARD - Use second item image if available */}
          {item?.image && (
            <div className="
              absolute top-6  right-12 duration-300 ease-in-out transition-all
              w-[380px] h-[440px]
              border-2 border-[#f46c44]
              bg-white
            ">
             <img
                src={item.image}
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* FRONT IMAGE CARD - Use third item image if available */}
          {item?.image && (
            <div className="
              absolute bottom-10 hover:z-1 right-[70%] translate-x-1/2
              w-[230px] h-[230px]
              bg-white
              border-2 border-[#f46c44]
              shadow-lg
              rotate-[6deg]
              overflow-hidden
            ">
             <div className="p-6 text-sm font-medium" >
              {item.content}
             </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}


import { 
 
  IdCard // fallback
} from 'lucide-react';

// Helper: map requirement title to icon
const getIconComponent = (title: string) => {
  const lower = title.toLowerCase();
  
  if (lower.includes('passport')) return IdCard;
  if (lower.includes('gmat') || lower.includes('gre')) return GraduationCap;
  if (lower.includes('recommendation') || lower.includes('lor')) return FileText;
  if (lower.includes('cv') || lower.includes('resume')) return FileText;
  if (lower.includes('toefl') || lower.includes('ielts') || lower.includes('c1')) return ClipboardList;
  if (lower.includes('transcript')) return ScrollText;
  if (lower.includes('portfolio')) return FolderOpen;
  if (lower.includes('statement of purpose') || lower.includes('sop')) return FileSignature;
  
  // Default fallback
  return Award;
};

// Reusable Item component
const RequirementItem = ({ title, underline = true }: { title: string; underline?: boolean }) => {
  const Icon = getIconComponent(title);
  return (
    <div className={`${underline ? 'border-b border-gray-300 pb-2' : ''} flex items-start space-x-3`}>
      <Icon className="text-[#f46c44] -mt-0.5 flex-shrink-0" size={40} />
      <span className="text-[#656565] font-medium">{title}</span>
    </div>
  );
};

// Main ScholarshipRequirements component
export function ScholarshipRequirements({ scholarshipData }: { scholarshipData: any }) {
  // Extract items and remove duplicates by title (optional)
  const uniqueItems = Array.from(
    new Map(scholarshipData.items.map((item: any) => [item.title.trim(), item])).values()
  );

  // Split into two columns
  const midIndex = Math.ceil(uniqueItems.length / 2);
  const leftColumn = uniqueItems.slice(0, midIndex);
  const rightColumn = uniqueItems.slice(midIndex);

  // Parse title with "||" separator
  const fullTitle = scholarshipData.title || "Scholarships to Study in United Kingdom";
  const [prefix, suffix] = fullTitle.includes('||')
    ? fullTitle.split('||').map(s => s.trim())
    : ["Scholarships to Study in", "United Kingdom"];

  return (
    <section className="bg-[#f5f1f0] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 
          style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} 
          className="text-[2.6rem] font-bold text-[#f46c44] mb-3 leading-tight"
        >
          <span className="text-[#656565]">{prefix} </span>
          {suffix}
        </h2>

        <p className="text-[#656565] max-w-3xl mb-6 text-base font-semibold">
          {scholarshipData.subtitle || "Here are the major requirements to study in UK which you need to ensure while applying to a UK university:"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {leftColumn.map((item: any, index: number) => (
              <RequirementItem key={index} title={item.title.trim()} />
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {rightColumn.map((item: any, index: number) => (
              <RequirementItem key={index + leftColumn.length} title={item.title.trim()} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}