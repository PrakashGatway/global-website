"use client";

import axiosInstance from "@/app/axiosInstance";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FAQSection from "./faqPage";

/* ─── Scroll Animation Hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Counter Animation ─── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal();

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// interface ScholarshipPageProps {
//   initialScholarship: any;
//   initialContentTabs: any[];
//   initialSimilar: any[];
//   error?: string | null;
//   slug: string;
// }


// export default function ScholarshipPage({
//   initialScholarship,
//   initialContentTabs,
//   initialSimilar,
//   error: initialError,
//   slug,
// }: ScholarshipPageProps) {

//   console.log(initialScholarship, initialContentTabs, initialSimilar,'data comming form the server side')

//   const [activeTab, setActiveTab] = useState("overview");
//   const [openFaq, setOpenFaq] = useState<number | null>(null);
//   const [heroScale, setHeroScale] = useState(1.05);

//   const [scholarship, setScholarship] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [similar, setSimilar] = useState([]);
//   const [contentTabs, setContentTabs] = useState<{ id: string; label: string; content?: string }[]>([
//     { id: "overview", label: "Overview" }
//   ]);

//   // Refs for scrolling
//   const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

//   const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

//   const onSubmit = async (data: any) => {
//     try {
//       const res = await axiosInstance.post("/contactus", {
//         subject: "Contact Form",
//         type: "Website",
//         fullName: `${data.name}`,
//         email: data.email,
//         phone: data.mobile,
//         destination: data.destination,
//         description: "Scholarship inquiry",
//       });

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Message sent successfully ✅");
//         reset();
//       } else {
//         toast.error("Failed to send message ❌");
//       }
//     } catch (error) {
//       toast.error("Failed to send message ❌");
//     }
//   };

//   // Fetch scholarship details
//   useEffect(() => {
//     const fetchScholarshipDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(`/scholarships/slug/${slug}`);
//         const data = response.data;

//         if (data.success) {
//           setScholarship(data.data);
          
//           // Build tabs from extra_content sections
//           const sections = data.data?.extra_content?.sections || [];
//           const tabs = sections.map((section: any) => ({
//             id: section.section_key,
//             label: section.heading,
//             content: section.content || null
//           }));
          
        
          
//           setContentTabs(tabs);
//         } else {
//           setError(data.message);
//         }
//       } catch (err) {
//         setError("Failed to load scholarship details");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) {
//       fetchScholarshipDetails();
//     }
//   }, [slug]);

//   // Fetch similar scholarships
//   useEffect(() => {
//     const fetchAllScholarships = async () => {
//       try {
//         const res = await axiosInstance.get("/scholarships/public/list");
//         setSimilar(res.data?.data || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchAllScholarships();
//   }, []);


interface ScholarshipPageProps {
  initialScholarship: any;
  initialContentTabs: any[];
  initialSimilar: any[];
  faqres: any[];
  error?: string | null;
  slug: string;
}

export default function ScholarshipPage({
  initialScholarship,
  initialContentTabs,
  initialSimilar,
  faqres,
  error: initialError,
  slug,
}: ScholarshipPageProps) {

  console.log(
    initialScholarship,
    initialContentTabs,
    initialSimilar,
    "Data coming from the server"
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroScale, setHeroScale] = useState(1.05);

  // Initialize state from server props
  const [scholarship] = useState(initialScholarship);
  const [similar] = useState(initialSimilar);
  const [loading] = useState(false);
  const [error] = useState(initialError || "");

  const [contentTabs] = useState<
    { id: string; label: string; content?: string }[]
  >(
    initialContentTabs?.length
      ? initialContentTabs
      : [{ id: "overview", label: "Overview" }]
  );

  // Refs for scrolling
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await axiosInstance.post("/contactus", {
        subject: "Contact Form",
        type: "Website",
        fullName: data.name,
        email: data.email,
        phone: data.mobile,
        destination: data.destination,
        description: "Scholarship inquiry",
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Message sent successfully ✅");
        reset();
      } else {
        toast.error("Failed to send message ❌");
      }
    } catch (error) {
      toast.error("Failed to send message ❌");
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const s = Math.max(1, 1.05 - window.scrollY * 0.0002);
      setHeroScale(s);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (tabId: string) => {
    setActiveTab(tabId);
    const ref = sectionRefs.current[tabId];
    if (ref) {
      const offset = 120; // Offset for sticky header
      const elementPosition = ref.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Get section content from extra_content
  const getSectionContent = (key: string) => {
    if (!scholarship?.extra_content?.sections) return null;
    const section = scholarship.extra_content.sections.find((s: any) => s.section_key === key);
    return section?.content || null;
  };

  const allSimilar = similar
    .filter((item: any) => item.slug !== slug)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h2 className="text-2xl font-semibold text-gray-800">Scholarship Not Found</h2>
          <p className="text-gray-600 mt-2">{error || "The scholarship you're looking for doesn't exist."}</p>
          <Link href="/scholarships" className="mt-4 inline-block text-orange-500 hover:underline">
            Browse all scholarships →
          </Link>
        </div>
      </div>
    );
  }

  // Get tags from scholarship data
  const getTags = () => {
    const tags = [];
    if (scholarship.fundingType) tags.push(scholarship.fundingType);
    if (scholarship.level && scholarship.level.length > 0) {
      tags.push(scholarship.level[0]);
    }
    if (scholarship.country?.name) tags.push(scholarship.country.name);
    return tags.slice(0, 3);
  };

  // Get key facts
  const getKeyFacts = () => {
    return [
      { label: "Amount", value: scholarship.amount || "N/A" },
      { label: "Delivery Mode", value: scholarship.deliveryMode || "N/A" },
      { label: "Funding Type", value: scholarship.fundingType || "N/A" },
      { label: "Intake", value: scholarship.intake || "N/A" },
      { label: "Study Mode", value: scholarship.studyMode || "N/A" },
      { label: "Deadline", value: scholarship.deadline || "N/A" },
    ];
  };

  return (
    <main className="bg-[#FAFAF9] text-neutral-900 antialiased">
      {/* ───── HERO ───── */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${scholarship.heroImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop'})`,
            transform: `scale(${heroScale})`,
            transition: "transform 0.1s linear",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-10">
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-3">
              {getTags().map((tag, i) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    background: i === 0 ? "rgba(234,88,12,0.9)" : "rgba(255,255,255,0.12)",
                    borderColor: i === 0 ? "transparent" : "rgba(255,255,255,0.2)",
                    color: "#fff",
                    backdropFilter: i > 0 ? "blur(8px)" : "none",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.15] max-w-4xl">
              {scholarship?.title}
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-white text-sm md:text-base mt-2 font-light line-clamp-2">
              {scholarship?.shortDescription}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───── KEY FACTS STRIP ───── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
            {getKeyFacts().map((fact, index) => (
              <div 
                key={fact.label} 
                className={`py-4 px-3 text-center ${index < 5 ? 'border-r' : ''}`}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                  {fact.label}
                </p>
                <p className="font-medium text-sm">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── MAIN TWO-COLUMN ───── */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ─── LEFT COLUMN ─── */}
            <div className="flex-1 min-w-0">
              {/* ─── TAB NAV ─── */}
              <div className="bg-white rounded border border-neutral-200 shadow-sm mb-8 sticky top-16 md:top-20 z-20">
                <div className="flex overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {contentTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => scrollToSection(tab.id)}
                      className={`relative flex-shrink-0 text-sm font-medium px-6 py-4 transition-colors duration-300 whitespace-nowrap ${
                        activeTab === tab.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                      }`}
                    >
                      {tab.label}
                      <div
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-orange-600 rounded-full transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                        style={{
                          transform: activeTab === tab.id ? "scaleX(1)" : "scaleX(0)",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── ALL SECTIONS ─── */}
              <div className="space-y-0">
              
                {/* Dynamic Section Tabs */}
                {contentTabs.map((tab) => {
                  
                  
                  const content = getSectionContent(tab.id);
                  if (!content) return null;

                  return (
                    <div 
                      key={tab.id}
                      ref={(el) => { sectionRefs.current[tab.id] = el; }}
                      className="bg-white  p-4 md:p-6 "
                    >
                      <h2 className="text-2xl font-semibold mb-4">{tab.label}</h2>
                      <div 
                        // className="prose prose-sm max-w-none text-neutral-600" 
                        
                className="prose max-w-none text-slate-700 
             prose-headings:text-slate-900
             [&_ul]:list-disc 
             [&_ol]:list-decimal 
             [&_ul]:pl-5 
             [&_ol]:pl-5 
             [&_li]:my-2
             [&_p]:my-4
             "
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT SIDEBAR ─── */}
            <div className="lg:w-[320px] flex-shrink-0">
              <div className="lg:sticky lg:top-5 space-y-4">
                {/* CTA Card */}
                <div className="bg-white/95 relative backdrop-blur-sm p-5 rounded-2xl border-2 border-[#F46C44] max-w-full mx-auto">
                  <div className="absolute top-4 right-4 z-10">
                    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-orange-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                      <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                        Book Free Counselling
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 pt-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Full Name
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Enter your name"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                          />
                        </div>
                        {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message as string}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="mobile" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <input
                            id="mobile"
                            {...register("mobile", {
                              required: "Mobile number required",
                              pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10 digit number" },
                            })}
                            placeholder="10-digit mobile"
                            type="tel"
                            inputMode="numeric"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                          />
                        </div>
                        {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile.message as string}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                          id="email"
                          {...register("email", {
                            required: "Email required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                          })}
                          placeholder="your@email.com"
                          type="email"
                          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="destination" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Preferred Destination
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <select
                          id="destination"
                          {...register("destination", { required: "Select destination" })}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200 appearance-none cursor-pointer text-gray-700 hover:border-gray-300"
                        >
                          <option value="" disabled className="text-gray-400">Select country</option>
                          {["USA", "UK", "France", "Germany", "Italy", "Dubai", "New Zealand", "Australia"].map((c) => (
                            <option key={c} value={c.toLowerCase()}>
                              Study In {c}
                            </option>
                          ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {errors.destination && <p className="text-[11px] text-red-500 font-medium">{errors.destination.message as string}</p>}
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="agree"
                        {...register("agree", { required: "You must accept terms" })}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400/30 cursor-pointer transition"
                      />
                      <label htmlFor="agree" className="text-[12px] text-gray-600 leading-tight cursor-pointer">
                        I agree to the <a href="/terms" className="text-orange-600 font-medium hover:underline">terms & privacy policy</a>
                      </label>
                    </div>
                    {errors.agree && <p className="text-[11px] text-red-500 font-medium -mt-2">{errors.agree.message as string}</p>}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Book Free Counselling →"
                      )}
                    </button>
                  </form>
                </div>

                {/* Similar Scholarships */}
                {allSimilar.length > 0 && (
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                        Similar Scholarships
                      </h4>
                      <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold uppercase">
                        {allSimilar.length} Available
                      </span>
                    </div>

                    <div className="space-y-4">
                      {allSimilar.map((item: any) => (
                        <Link
                          key={item._id}
                          href={`/scholarship/${item.slug}`}
                          className="group flex gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:border-orange-300 hover:shadow-md transition-all"
                        >
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&auto=format&fit=crop&q=80"}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <span className="inline-block text-[10px] font-semibold text-orange-600 uppercase tracking-wider">
                              Scholarship
                            </span>
                            <h5 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
                              {item.title}
                            </h5>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {item.fundingType || "N/A"}
                              </span>
                              <span className="text-xs font-medium text-orange-600 group-hover:translate-x-1 transition-transform">
                                View →
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FAQSection Faqres={faqres} />
    </main>
  );
}

