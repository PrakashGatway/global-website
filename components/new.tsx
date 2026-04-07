"use client";

// app/universities/[slug]/UniDetailsClient.tsx  — CLIENT COMPONENT

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SocialLinksCard from "@/components/socialLinkCard";
import DOMPurify from "isomorphic-dompurify";
import FAQSection from "@/components/faqPage";

import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axiosInstance from '@/app/axiosInstance'
import toast from 'react-hot-toast'
import UniversityCard from "./UniversityCard";
import Link from "next/link";


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


const FormSection = () => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",          // ✅ validate on typing
    reValidateMode: "onChange"
  });

  const navigate = useRouter();

  const onSubmit = async (formData) => {
    try {
      const payload = {
        fullName: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        destination: formData.country,
        subject: "Study Abroad Enquiry",
        type: "website-form",
        source: "website",
        city: formData.city,
        description: `State: ${formData.state}`,
      };

      await axiosInstance.post("/contactus", payload);
      toast.success("Form submitted successfully");
      navigate.push("/thank-you");
      reset();
    } catch (error) {
      toast.error("Submit Error");
    }
  };

  return (
    
        <div className="bg-white border border-gray-300 p-5 sm:p-8 shadow-sm rounded-lg w-full">
          <h2 className="text-orange-500 text-sm sm:text-xl font-semibold mb-5 tracking-wide">
            GET IN TOUCH
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="text-sm text-gray-700">Full Name</label>
                <input
                  {...register("fullname", { required: "Name is required" })}
                  className={`w-full border-b-2 pb-1 bg-transparent text-sm focus:outline-none 
                  ${errors.fullname ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs">{errors.fullname.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-700">Email ID</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.(com|in)$/i,
                      message: "Only .com and .in emails allowed",
                    },
                  })}
                  className={`w-full border-b-2 pb-1 bg-transparent text-sm focus:outline-none 
                  ${errors.email ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
                />

                {/* show only format error while typing */}
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-700">Mobile Number</label>
                <input
                  maxLength={10}
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid 10 digit number",
                    },
                  })}
                  className={`w-full border-b-2 pb-1 bg-transparent text-sm focus:outline-none 
                  ${errors.phone ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="text-sm text-gray-700">State</label>
                <input
                  {...register("state")}
                  className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1"
                />
              </div>

              {/* City */}
              <div>
                <label className="text-sm text-gray-700">City</label>
                <input
                  {...register("city")}
                  className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1"
                />
              </div>

              {/* Country */}
              <div>
                <label className="text-sm text-gray-700">Country</label>
                <select
                  {...register("country")}
                  className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1"
                >
                  <option value="">Country to Study</option>
                  {["USA", "UK", "France", "Germany", "Italy", "Dubai"].map((c) => (
                    <option key={c} value={c.toLowerCase()}>
                      Study In {c}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary hover:bg-primary text-white px-6 py-2 rounded-full"
              >
                {isSubmitting ? "Submitting..." : "CONTACT US"}
              </button>
            </div>
          </form>
        </div>

  );
};


export default function UniDetailsClient({ data, Faqres, Universityres }: { data: UniversityData; Faqres?: any ,   Universityres?: any }) {
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
      <div className="relative max-w-[100vw] overflow-hidden mx-auto h-[30rem] px-10 py-10 flex items-center justify-center ">

        <div className="absolute bg-[#f46c44] w-full h-[35rem] left-0 -top-[100px]" 
        style={{"borderRadius":"0 0 50% 50%/0 0 100% 100%",   "transform": "scaleX(2.4)"}}></div>

        <div className="flex md:flex-col lg:flex-row-reverse  bg-white rounded overflow-hidden shadow-md w-full h-[100%] z-50 mt-20">
          {data.cover_photo && (
            <img
              src={data.cover_photo}
              alt={`${data.name} cover`}
              className="w-full h-100 object-cover"
            />
          )}

          <div className="p-6 flex items-start gap-10 flex-col w-full lg:w-1/3 ">
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
      {/* <SocialLinksCard
        facebook={data.social_links?.facebook}
        twitter={data.social_links?.twitter}
        instagram={data.social_links?.instagram}
        linkedin={data.social_links?.linkedin}
      /> */}

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
  className="prose max-w-none text-slate-700 
             prose-headings:text-slate-900
             [&_ul]:list-disc 
             [&_ol]:list-decimal 
             [&_ul]:pl-5 
             [&_ol]:pl-5 
             [&_li]:mb-1"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(section.content),
  }}
/>
            </div>
          ))}

          <div className="max-w-7xl mx-auto rounded-3xl p-6 bg-gradient-to-r from-[#f6f3f9] to-[#f1f5fb] shadow-sm border border-gray-200 backdrop-blur-md">
  <div className="flex flex-col md:flex-row items-center justify-between gap-6">

    {/* LEFT SECTION */}
    <div className="flex-1 relative">
      <p className="text-orange-500 font-semibold text-xs tracking-wider mb-2">
        SCHOLARSHIP PREDICTOR
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-[#1f2a44] leading-snug mb-4">
        Share your details and <br />
        easily find scholarships <br />
        that actually fit your <br />
        profile
      </h2>

      {/* USERS */}
      <div className="flex items-center gap-3 mt-4">
       <div className="flex -space-x-2">
  <img
    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
    className="w-8 h-8 rounded-full border-2 border-white object-cover"
  />
  <img
    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
    className="w-8 h-8 rounded-full border-2 border-white object-cover"
  />
  <img
    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
    className="w-8 h-8 rounded-full border-2 border-white object-cover"
  />
</div>
        <span className="text-sm text-gray-600">
          Helped 12K+ students
        </span>
      </div>

      {/* BACKGROUND GRID EFFECT */}
      <div className="absolute right-10 top-5 opacity-30 pointer-events-none">
        <div className="w-32 h-32 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:10px_10px]" />
      </div>
    </div>

    {/* RIGHT SECTION */}
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 min-w-[260px]">
      <p className="text-sm text-gray-600 text-center mb-4">
        Let's start! It will just take 2 mins
      </p>

      <div className="flex gap-3 justify-center">
        <Link href={"/scholarship-predictor"} >
        <button className="px-5 py-3 rounded-xl border border-blue-400 text-primary font-semibold hover:bg-primary hover:text-white transition">
          I want to do <br />
          <span className="font-bold">Masters →</span>
        </button>
        </Link>

        <button className="px-5 py-3 rounded-xl border border-blue-400 text-primary font-semibold hover:bg-primary hover:text-white transition">
          I want to do <br />
          <span className="font-bold">Bachelors →</span>
        </button>
      </div>
    </div>

  </div>
</div>

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
        <div className="space-y-6 sticky top-32 self-start">

            <FormSection />

          {/* Financial Overview */}
          {/* <Card>
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
          </Card> */}

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

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-bold text-3xl">Explore More Universities for Your Study Plans</h2>

           <UniversityCard
  university={Universityres
    .map((uni) => (uni._id === data._id ? null : uni))
    .filter(Boolean)}
/>


      </div>
      


       <section className="relative bg-[#ee6a43] overflow-hidden py-12 sm:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-0">
      
              {/* Text */}
              <div className="text-white relative z-10">
                
                <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                 {data?.extra_content?.extra?.ctatitle}
                </h2>
                <p
                  className="mt-4 text-sm sm:text-base lg:text-lg max-w-xl text-white/90"
                  >{data?.extra_content?.extra?.ctadescription}</p>
                
                <div className="mt-6 sm:mt-8">
                  <a href="/contact">
                    <button className="bg-secondary hover:bg-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
                      Contact US
                    </button>
                  </a>
                </div>
              </div>
      
              {/* Decorative circle — only on lg */}
              <div className="hidden lg:flex relative h-[380px] items-center justify-center">
                <img
                  src="/images/circle stand.png"
                  alt=""
                  className="absolute z-10 w-[90px] bottom-3"
                  style={{ right: "calc(50% - 45px)" }}
                />
                <img
                  src="/images/circle.png"
                  alt=""
                  className="w-80 xl:w-96 animate-spin [animation-duration:60s]"
                />
              </div>
            </div>
      
            <img
              src="/images/country-building-img.png"
              alt=""
              className="absolute bottom-0 right-0 w-2/3 sm:w-1/2 object-contain pointer-events-none"
            />
            <div className="absolute bottom-0 left-0 w-full sm:w-1/2 h-2 sm:h-3 bg-yellow-400" />
          </section>

      
            <FAQSection 
              Faqres={Faqres} 
            />

    </main>
  );
}