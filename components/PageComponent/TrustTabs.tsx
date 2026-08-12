"use client";

import { useState } from "react";

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
  if (url.includes("youtu.be")) {
    return url.split("/").pop()?.split("?")[0] || null;
  }

  // Handle full youtube.com URLs
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );
  return match ? match[1] : null;
};

export default function AboutTabsSection({ tabs }: AboutTabsSectionProps) {
  // Map API data to internal structure with video IDs
  const mappedTabs = tabs
    .filter((t) => t.tab || t.features || t.videoLink)
    .map((item) => {
      console.log(item);
      return {
        key: item.tab.toLowerCase().replace(/\s+/g, ""),
        label: item.tab,
        title:
          item.tab === "Trust"
            ? "Your Trusted Partner in Immigration Services"
            : "Complete Transparency at Every Step",
        description:
          item.tab === "Trust"
            ? "We provide reliable guidance for study, work, and permanent residency applications. Our experienced team supports you at every step of your immigration journey."
            : "No hidden processes, no hidden fees. We believe in honest communication and clarity throughout your immigration journey.",
        points: item.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        videoId: item.videoLink ? getYouTubeId(item.videoLink.trim()) : null,
      };
    });

  const initialTab = mappedTabs.length > 0 ? mappedTabs[0].key : "trust";
  const [activeTab, setActiveTab] = useState(initialTab);

  const activeData =
    mappedTabs.find((t) => t.key === activeTab) || mappedTabs[0];

  if (mappedTabs.length === 0) return null;
  return (
    <section className="mb-6">
      {/* TABS HEADER */}
      <div className="relative mb-3">
        {/* <div className="absolute -bottom-3 z-11 left-0 right-0 h-[2px] bg-primary " /> */}

        <div className="flex flex-wrap justify-start gap-1 ">
          <div className="mt-4 flex w-full">
            <div
              className="
      flex
      max-w-full
      items-center
      gap-1.5
      overflow-x-auto
      rounded-2xl
      border border-gray-200
      bg-white/80
      p-1
      shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      backdrop-blur-md
      scrollbar-hide
    "
            >
              {mappedTabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
            group
            relative
            shrink-0
            overflow-hidden
            rounded-xl
            px-4
            py-2.5
            text-sm sm:text-base
            font-semibold
            whitespace-nowrap
            transition-all
            duration-300
            ease-out
            ${
              isActive
                ? "bg-secondary text-white shadow-lg shadow-secondary/25"
                : "text-gray-500 hover:bg-gray-50 hover:text-primary"
            }
          `}
                  >
                    {!isActive && (
                      <span
                        className="
                absolute inset-0
                -translate-x-full
                bg-gray-100
                transition-transform duration-300
                group-hover:translate-x-0
              "
                      />
                    )}

                    <span className="relative z-10 text-sm flex items-center justify-center gap-2">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative mt-0 overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          {/* LEFT - VIDEO */}
          <div className="w-full shrink-0 md:w-[320px] lg:w-[350px]">
            <div className="group relative overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-black/5">
              {/* Video */}
              <div className="relative aspect-video w-full overflow-hidden">
                {activeData?.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeData.videoId}?autoplay=0&modestbranding=1&rel=0`}
                    title={`${activeData.label} Video`}
                    className="absolute inset-0 h-full w-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <span className="text-sm font-semibold">
                      No Video Available
                    </span>
                  </div>
                )}
              </div>

              {/* Video label */}
              {activeData?.videoId && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 pointer-events-none">
                  <p className="text-xs font-medium text-white/80">
                    Watch & Learn
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-white">
                    {activeData.label}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - CONTENT */}
          <div className="min-w-0 flex-1">
          

            {/* Points */}
            <ul className="space-y-2">
              {activeData?.points?.[0]
                ?.split("•")
                ?.filter(Boolean)
                ?.map((point, i) => (
                  <li
                    key={i}
                    className="group flex items-center gap-1.5 text-left"
                  >
                    <span
                      className="
                  mt-0.5 flex h-5 w-5 shrink-0
                  items-start justify-center
                  rounded-full
                  bg-secondary/10
                  text-sm font-bold
                  text-secondary
                  transition-all duration-300
                  group-hover:bg-secondary
                  group-hover:text-white
                  group-hover:scale-105
                "
                    >
                      ✓
                    </span>

                    {/* Text */}
                    <span className="pt-0.5 text-sm font-medium leading-6 text-gray-600">
                      {point.trim()}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
