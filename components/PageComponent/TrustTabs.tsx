"use client";

import { useState } from "react";
import Image from "next/image";

interface TabItem {
  tab: string;
  features: string;
  videoLink?: string; // e.g., "https://youtu.be/wPc6mANhIj4"
}

interface AboutTabsSectionProps {
  tabs: TabItem[];
}

// Helper: Extract YouTube ID from any YouTube URL format
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle youtu.be short URLs
  if (url.includes('youtu.be')) {
    return url.split('/').pop()?.split('?')[0] || null;
  }
  
  // Handle full youtube.com URLs
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

export default function AboutTabsSection({ tabs }: AboutTabsSectionProps) {
  // Map API data to internal structure with video IDs
  const mappedTabs = tabs
    .filter((t) => t.tab && t.features)
    .map((item) => ({
      key: item.tab.toLowerCase().replace(/\s+/g, ""),
      label: item.tab,
      title: item.tab === "Trust"
        ? "Your Trusted Partner in Immigration Services"
        : "Complete Transparency at Every Step",
      description: item.tab === "Trust"
        ? "We provide reliable guidance for study, work, and permanent residency applications. Our experienced team supports you at every step of your immigration journey."
        : "No hidden processes, no hidden fees. We believe in honest communication and clarity throughout your immigration journey.",
      points: item.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      videoId: item.videoLink ? getYouTubeId(item.videoLink.trim()) : null,
    }));

  const initialTab = mappedTabs.length > 0 ? mappedTabs[0].key : "trust";
  const [activeTab, setActiveTab] = useState(initialTab);

  const activeData = mappedTabs.find((t) => t.key === activeTab) || mappedTabs[0];

 

  if (mappedTabs.length === 0) return null;

  return (
    <section className="mb-6">
      {/* TABS HEADER */}
      <div className="relative mb-8">
        <div className="absolute -bottom-3 z-11 left-0 right-0 h-[2px] bg-primary" />

        <div className="flex flex-wrap justify-start gap-3 sm:gap-2 ">
          {mappedTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-5 sm:px-6 py-2 rounded-full shadow-2xl
                text-sm lg:text-base font-semibold transition-all hover:bg-primary hover:text-white
                ${
                  activeTab === tab.key
                    ? "bg-secondary text-white shadow-2xl"
                    : "bg-white text-gray-500"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
        {/* LEFT VIDEO PLAYER */}
        <div className="relative flex-shrink-0">
          <div className="rounded-2xl overflow-hidden shadow-xl w-[300px] sm:w-[230px]">
            {activeData?.videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeData.videoId}?autoplay=0&modestbranding=1&rel=0`}
                title={`${activeData.label} Video`}
                className="w-full h-40"
                style={{ aspectRatio: "230/250" }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Image
                src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
                alt="Team Discussion"
                width={230}
                height={250}
                className="object-cover w-full h-full"
                priority
              />
            )}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="text-center sm:text-left">
  <ul className="">
    {activeData?.points?.[0]
      ?.split("•")
      ?.filter(Boolean)
      ?.map((point, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-gray-600 font-medium"
        >
          <span className="text-[#f46c44] text-lg mt-1 shrink-0">✓</span>
          <span>{point.trim()}</span>
        </li>
      ))}
  </ul>
</div>
      </div>
    </section>
  );
}