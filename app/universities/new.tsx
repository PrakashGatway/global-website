"use client";

// app/universities/[slug]/UniDetailsClient.tsx  — CLIENT COMPONENT

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SocialLinksCard from "@/components/socialLinkCard";
import DOMPurify from "isomorphic-dompurify";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Section {
  _id: string;
  section_key: string;
  heading: string;
  content: string;
  order: number;
}

interface UniversityData {
  _id: string;
  name: string;
  slug: string;
  uni_type: string;
  short_description: string;
  code: string;
  address: string;
  country: string;
  city: string;
  cover_photo?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  uni_logo: string;
  uni_web: string;
  uni_rank: Array<{
    type: string;
    rank: string;
    year?: string;
  }>;
  google_location: {
    lat: string;
    lng: string;
  };
  uni_contact: string;
  established_year: number;
  on_compus_accommodation: boolean;
  off_campus_accommodation: boolean;
  status: string;
  financials: {
    cost_of_living: string;
    ug_fees: string;
    pg_fees: string;
    other_fees: string;
  };
  location_alias: string;
  extra_content?: {
    _id: string;
    sections: Section[];
    isPublished: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  seo_metadata?: {
    meta_title: string;
    meta_description: string;
    canonical_tag: string;
    meta_keywords: string;
  };
  createdAt: string;
  updatedAt: string;
  uni_gallery?: {
    images: string[];
    videos: string[];
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UniDetailsClient({ data }: { data: UniversityData }) {
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const activeSections: Section[] = data.extra_content?.sections ?? [];
  const latitude = data.google_location?.lat;
  const longitude = data.google_location?.lng;
  const location = [data.city, data.country].filter(Boolean).join(", ");

  console.log(data)
  
  // Smooth scroll to a section
  const scrollToSection = (key: string) => {
    sectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Scroll spy — highlight the nav item whose section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeSections]);


  const navRef = useRef<HTMLDivElement>(null);
const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

// 2. Add this effect (after your scroll spy effect)
useEffect(() => {
  if (!activeSection || !navRef.current) return;

  const activeBtn = buttonRefs.current[activeSection];
  if (!activeBtn) return;

  const nav = navRef.current;
  nav.scrollTo({
    left: activeBtn.offsetLeft - nav.offsetWidth / 2 + activeBtn.offsetWidth / 2,
    behavior: "smooth",
  });
}, [activeSection]);



  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* ── HEADER CARD ─────────────────────────────────────────────────── */}
      <div className=" w-[95%] mx-auto h-[30rem] px-4 py-10 flex items-center justify-center ">

        <div className="absolute bg-[#f46c44] w-full h-[35rem] left-0 -top-[100px]" 
        style={{"borderRadius":"0 0 50% 50%/0 0 100% 100%",   "transform": "scaleX(2.4)"}}></div>

        <div className="flex flex-row-reverse bg-white rounded overflow-hidden shadow-md w-full h-[100%] z-50 mt-20">
          {data.cover_photo && (
            <img
              src={data.cover_photo}
              alt={`${data.name} cover`}
              className="w-full h-100 object-cover"
            />
          )}

          <div className="p-6 flex items-start gap-10 flex-col w-1/3 ">
            <img
              src={data.uni_logo}
              alt={`${data.name} logo`}
              className="w-full h-28 object-contain bg-white rounded-xl border border-slate-100"
            />

            <div>
              <h1 className="text-3xl font-bold text-slate-900">{data.name}</h1>
              <div className="flex items-center text-gray-500 mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                {location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SOCIAL LINKS ────────────────────────────────────────────────── */}
      <SocialLinksCard
        facebook={data.social_links?.facebook}
        twitter={data.social_links?.twitter}
        instagram={data.social_links?.instagram}
        linkedin={data.social_links?.linkedin}
      />

      {/* ── STICKY SECTION NAVBAR ───────────────────────────────────────── */}
      {/* {activeSections.length > 0 && (
        <div className="bg-white border-b sticky top-20 z-30">
          <div className="overflow-x-auto">
            <div className="flex gap-8 px-4">
              {activeSections.map((section) => (
                <button
                  key={section._id}
                  onClick={() => scrollToSection(section.section_key)}
                  className={`px-2 py-4 font-bold border-0 border-b-4 whitespace-nowrap transition-colors ${
                    activeSection === section.section_key
                      ? "border-orange-600 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-black"
                  }`}
                >
                  {section.heading}
                </button>
              ))}
            </div>
          </div>
        </div>
      )} */}

      {activeSections.length > 0 && (
  <div className="bg-white border-b sticky top-20 z-30">
    <div
      ref={navRef}                          // 👈 ref on the scrollable container
      className="overflow-x-auto scrollbar-hide"
    >
      <div className="flex gap-8 px-4">
        {activeSections.map((section) => (
          <button
            key={section._id}
            ref={(el) => { buttonRefs.current[section.section_key] = el; }}  // 👈 ref each button
            onClick={() => scrollToSection(section.section_key)}
            className={`px-2 py-4 font-bold border-0 border-b-4 whitespace-nowrap transition-colors ${
              activeSection === section.section_key
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {section.heading}
          </button>
        ))}
      </div>
    </div>
  </div>
)}

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">

        {/* LEFT — sections + map */}
        <div className="lg:col-span-2 space-y-16">

          {activeSections.map((section) => (
            <div
              key={section._id}
              id={section.section_key}
              ref={(el) => {
                sectionRefs.current[section.section_key] = el;
              }}
              className="scroll-mt-28"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {section.heading}
              </h2>
              <div
                className="prose max-w-none text-slate-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(section.content),
                }}
              />
            </div>
          ))}

          {/* Location section */}
          <div id="location" ref={(el) => { sectionRefs.current["location"] = el; }} className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Location</h2>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Map */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0 overflow-hidden rounded-lg">
                    {latitude && longitude ? (
                      <iframe
                        title="University Location"
                        width="100%"
                        height="350"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                        className="border-0"
                      />
                    ) : (
                      <div className="h-[350px] flex items-center justify-center text-gray-400">
                        No location data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Address card */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                    <span>{data.address || "Address not available"}</span>
                  </div>

                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-800">City:</span> {data.city}</p>
                    <p><span className="font-medium text-slate-800">Country:</span> {data.country}</p>
                  </div>

                  {latitude && longitude && (
                    <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      <a
                        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Google Maps
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6 sticky top-28 self-start">

          {/* Financial Overview */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-bold text-slate-900">Financial Overview</h3>

              {[
                { label: "Cost of Living (Annual)", value: data.financials?.cost_of_living },
                { label: "Undergraduate Fees",      value: data.financials?.ug_fees },
                { label: "Postgraduate Fees",       value: data.financials?.pg_fees },
                { label: "Other Fees",              value: data.financials?.other_fees },
              ].map(({ label, value }, i) => (
                <div key={label} className={i > 0 ? "border-t border-slate-100 pt-4" : ""}>
                  <p className="text-sm text-gray-600 mb-1">{label}</p>
                  <p className="text-xl font-bold text-orange-600">{value || "N/A"}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6 space-y-3">
              <h3 className="font-bold text-slate-900">Ready to Apply?</h3>

              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Get Brochure
              </Button>
              <Button variant="outline" className="w-full hover:bg-orange-50">
                Talk to Expert
              </Button>
              {data.uni_web && (
                <Button variant="outline" className="w-full hover:bg-orange-50" asChild>
                  <a href={data.uni_web} target="_blank" rel="noopener noreferrer">
                    Visit Official Website
                  </a>
                </Button>
              )}

              <p className="text-xs text-slate-500 text-center pt-1">
                Contact us for admission assistance
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-bold text-slate-900">Contact Information</h3>

              <div>
                <p className="text-sm font-medium text-slate-800 mb-1">Address</p>
                <p className="text-sm text-slate-600">{data.address || "N/A"}</p>
              </div>

              {data.uni_contact && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-medium text-slate-800 mb-1">Contact</p>
                  <p className="text-sm text-slate-600">{data.uni_contact}</p>
                </div>
              )}

              {data.uni_web && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-medium text-slate-800 mb-1">Website</p>
                  <a
                    href={data.uni_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {data.uni_web}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white mt-16 p-6 text-center">
        <p className="text-sm text-slate-400">
          Last updated on{" "}
          {new Date(data.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </main>
  );
}