"use client";

import axiosInstance from "@/app/axiosInstance";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

/* ─── Data ─── */






const requirementTabs = [
  {
    name: "Academic",
    items: [
      "First-class or strong upper second-class undergraduate degree (or international equivalent)",
      "Degree in Business, Management, Economics, or a related discipline",
      "Minimum GPA of 3.7/4.0 or equivalent",
    ],
  },
  {
    name: "Language",
    items: [
      "IELTS Academic: 7.5 overall (min 7.0 per component)",
      "TOEFL iBT: 110 overall (min 22L, 24R/W, 25S)",
      "Cambridge C1 Advanced: 191 overall (min 185 per component)",
    ],
  },
  {
    name: "Additional",
    items: [
      "GMAT or GRE recommended (strengthens application)",
      "Minimum 2 years of relevant work experience preferred",
      "Must not have previously studied at a UK institution for a degree",
    ],
  },
];






const faqs = [
  { q: "Who is eligible to apply?", a: "International students from any country who have received an offer to study a full-time Master's programme at Oxford. You must demonstrate exceptional academic achievement, leadership potential, and commitment to community impact." },
  { q: "What does the scholarship cover exactly?", a: "Full tuition fees (£52,400), a living allowance of ~£18,000/year, one return airfare from your home country, and a one-time settling-in allowance of £500. It does NOT cover dependants or additional travel." },
  { q: "Can I apply without an admission offer?", a: "No. You must have a valid, unconditional or conditional offer of admission from Oxford before submitting your scholarship application. Apply to your programme by December to allow sufficient time." },
  { q: "Is there an interview process?", a: "Yes. Shortlisted candidates are invited to a 25–30 minute virtual interview. Questions cover academic motivation, leadership experience, proposed impact, and how the scholarship aligns with your long-term goals." },
  { q: "Can I hold other funding alongside this?", a: "You may hold small supplementary awards (up to £5,000/year total) with prior written approval from the scholarship committee. The scholarship is intended to be your primary funding source." },
  { q: "What if I defer my admission?", a: "The scholarship is not automatically transferable to a deferred year. You must re-apply and will be considered alongside the new applicant pool. Deferral is granted only in exceptional circumstances." },
];

const contentTabs = [
  { id: "overview", label: "Overview" },
  { id: "costs", label: "Costs & Funding" },
  { id: "requirements", label: "Requirements" },
  { id: "benefits", label: "Benefits" },
  { id: "howToApply", label: "How To Apply" },

];

/* ─── Animated Tab Content Wrapper ─── */
function TabPanel({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;

    const updateHeight = () => {
      setHeight(innerRef.current?.scrollHeight || 0);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(innerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="overflow-hidden transition-all duration-500"
      style={{ height: active ? height : 0 }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

export default function ScholarshipPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reqTab, setReqTab] = useState(0);
  const [heroScale, setHeroScale] = useState(1.05);

  const [Scholarship, setScholarship] = useState([])
  const [Loading, setLoading] = useState(false)
  const [Error, setError] = useState('')
  const [Simillar,fetchSimilarScholarships] = useState([])

  const params = useParams();
  const slug = params?.slug as string;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/contactus", {
        subject: "Contact Form",
        type: "Website",
        fullName: `${data.name}`,
        email: data.email,
        phone: data.mobile,
        destination: data.destination,
        description: "this is form",
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
    const fetchScholarshipDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/scholarships/slug/${slug}`);
        const data = response.data;

        if (data.success) {
          setScholarship(data.data);
          // Fetch similar scholarships
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to load scholarship details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarshipDetails()
  }, [])

 useEffect(() => {
  const fetchAllScholarship = async () => {
    try {
      const res = await axiosInstance.get("/scholarships/public/list");

      fetchSimilarScholarships(res.data?.data || []);
    
    } catch (err) {
      console.error(err);
    }
  };

  fetchAllScholarship();
}, []);


  useEffect(() => {
    const onScroll = () => {
      const s = Math.max(1, 1.05 - window.scrollY * 0.0002);
      setHeroScale(s);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);

  }, []);

  console.log(Simillar)

 const allSimillar = Simillar.filter(
  (item) => item.slug !== slug
).slice(0, 3);
  console.log(allSimillar)
  return (
    <main className="bg-[#FAFAF9] text-neutral-900 antialiased">
      {/* ───── HERO ───── */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop')",
            transform: `scale(${heroScale})`,
            transition: "transform 0.1s linear",
          }}
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/30 to-black/20" /> */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-10">
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Fully Funded", "Masters", "United Kingdom"].map((tag, i) => (
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
              {Scholarship?.title}
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-white text-sm md:text-base mt-2 font-light line-clamp-2">
              {Scholarship?.shortDescription}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───── KEY FACTS STRIP ───── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 ">
            <div className="py-4 px-3 text-center border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                Amount
              </p>
              <p className="font-medium text-sm">{Scholarship?.amount}</p>
            </div>

            <div className="py-4 px-3 text-center border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                Delivery Mode
              </p>
              <p className="font-medium text-sm">{Scholarship?.deliveryMode}</p>
            </div>

            <div className="py-4 px-3 text-center border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                Funding Type
              </p>
              <p className="font-medium text-sm">{Scholarship?.fundingType}</p>
            </div>


            <div className="py-4 px-3 text-center border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                Intake
              </p>
              <p className="font-medium text-sm">{Scholarship?.intake}</p>
            </div>

            <div className="py-4 px-3 text-center border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                Study Mode
              </p>
              <p className="font-medium text-sm">{Scholarship?.studyMode}</p>
            </div>

            <div className="py-4 px-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                Deadline
              </p>
              <p className="font-medium text-sm">{Scholarship?.deadline}</p>
            </div>
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

              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm  mb-1">
                <div className="flex overflow-x-auto no-scrollbar">
                  {contentTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setOpenFaq(null); }}
                      className={`relative flex-shrink-0 text-sm font-medium px-6 py-4 transition-colors duration-300 whitespace-nowrap ${activeTab === tab.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
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


              {/* ─── TAB PANELS ─── */}
              <div className="bg-white rounded-2xl border border-neutral-200 border-t-0 rounded-t-none shadow-sm ">

                {/* Overview */}
                <TabPanel active={activeTab === "overview"}>
                  <div className="p-6 md:p-8 space-y-8 ">

                    {/* About */}
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        About This Scholarship
                      </h2>

                      <div className="prose prose-sm max-w-none text-neutral-600">
                        {Scholarship?.description}
                      </div>
                    </section>

                    {/* Key Facts */}
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        Scholarship Overview
                      </h2>

                      <div className="grid md:grid-cols-2 gap-x-10 border rounded-lg">
                        {Object.entries(Scholarship?.valueDetails || {}).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between p-4 border-b last:border-b-0"
                          >
                            <span className="text-neutral-500">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Benefits Snapshot */}
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        Benefits at a Glance
                      </h2>

                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(Scholarship?.benefits || {})
                          .slice(0, 4)
                          .map(([title, value]) => (
                            <div
                              key={title}
                              className="border rounded-lg p-4 bg-neutral-50"
                            >
                              <h4 className="font-medium text-neutral-900 mb-2">
                                {title}
                              </h4>
                              <p className="text-sm text-neutral-600">
                                {value}
                              </p>
                            </div>
                          ))}
                      </div>
                    </section>

                    {/* Eligibility */}
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        Eligibility Requirements
                      </h2>

                      <div className="grid md:grid-cols-2 gap-y-3">
                        {Object.entries(Scholarship?.eligibilityCriteria || {})
                          .slice(0, 6)
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-orange-500" />
                              <span className="font-medium">{key}</span>
                              <span className="text-neutral-500">({value})</span>
                            </div>
                          ))}
                      </div>
                    </section>

                    {/* Application Process */}
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        Application Process
                      </h2>

                      <div className="space-y-3">
                        {Object.entries(Scholarship?.howToApply || {})
                          .slice(0, 5)
                          .map(([step, desc], index) => (
                            <div
                              key={step}
                              className="flex gap-4 border-l-2 border-orange-500 pl-4"
                            >
                              <div className="font-semibold text-orange-600">
                                {index + 1}
                              </div>

                              <div>
                                <h4 className="font-medium">{step}</h4>
                                <p className="text-sm text-neutral-600">
                                  {desc}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </section>

                  </div>
                </TabPanel>

                {/* Costs */}
                <TabPanel active={activeTab === "costs"}>
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-1">Costs & Funding</h2>
                      <p className="text-sm text-neutral-400 font-light">Estimated annual costs for international students</p>
                    </div>

                    <div className="space-y-0">
                      {Object.entries(Scholarship?.valueDetails || {}).map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between py-2.5 border-b border-neutral-50 group"
                        >
                          <span className="text-sm text-neutral-400 group-hover:text-neutral-600 transition-colors">
                            {label}
                          </span>
                          <span className="text-sm font-medium text-right max-w-[60%]">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                      <p className="text-sm text-emerald-800 font-light leading-relaxed">
                        <strong className="font-medium">Scholarship covers:</strong> Full tuition (£52,400) + Living allowance (£18,000) + Travel grant (~£1,000) + Settling-in (£500) = <strong className="font-medium">~£71,900 covered</strong> of the £75,900 estimated total cost.
                      </p>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-5">
                      <h3 className="font-medium text-sm mb-3">Coverage Breakdown</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Tuition Fees", pct: 69, amount: "£52,400" },
                          { label: "Living Allowance", pct: 24, amount: "£18,000" },
                          { label: "Travel & Settling", pct: 2, amount: "£1,500" },
                          { label: "Not Covered", pct: 5, amount: "~£4,000" },
                        ].map((b) => (
                          <div key={b.label}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-neutral-600 font-light">{b.label}</span>
                              <span className="font-medium text-xs">{b.amount} ({b.pct}%)</span>
                            </div>
                            <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(.16,1,.3,1)]"
                                style={{
                                  width: activeTab === "costs" ? `${b.pct}%` : "0%",
                                  background: b.label === "Not Covered" ? "#d4d4d4" : "#ea580c",
                                  transitionDelay: "200ms",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* Requirements */}
                <TabPanel active={activeTab === "requirements"}>
                  <div className="p-6 md:p-8 space-y-8">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-5">Admission & Eligibility Requirements</h2>

                      <div className="flex gap-1 mb-6 bg-neutral-100 rounded-xl p-1">
                        {requirementTabs.map((r, i) => (
                          <button
                            key={r.name}
                            onClick={() => setReqTab(i)}
                            className={`flex-1 text-xs font-semibold py-2.5 rounded-lg transition-all duration-300 ${reqTab === i ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                              }`}
                          >
                            {r.name}
                          </button>
                        ))}
                      </div>

                      <ul className="space-y-3">
                        {requirementTabs[reqTab].items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-neutral-600 font-light">
                            <svg className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-neutral-100">
                      <h3 className="font-medium text-base mb-4">Required Documents</h3>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                        {Object.entries(Scholarship?.eligibilityCriteria || {}).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center gap-2.5 text-sm text-neutral-600 font-light py-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />

                              <span className="font-medium">{key}</span>
                              <span>{`(${value})`}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                      <div className="flex items-center gap-2 text-red-700 font-medium text-sm mb-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Important
                      </div>
                      <p className="text-sm text-red-600/80 font-light leading-relaxed">
                        Incomplete applications will not be considered. Ensure all documents are uploaded before the 30 September 2026 deadline.
                      </p>
                    </div>
                  </div>
                </TabPanel>

                {/* Curriculum */}
                <TabPanel active={activeTab === "benefits"}>
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-1">Programme Benefits</h2>
                      <p className="text-sm text-neutral-400 font-light">180 ECTS · 12 months · Three terms + summer dissertation</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(Scholarship?.benefits || {}).map(
                        ([title, description], index) => (
                          <div
                            key={title}
                            className="flex gap-4 p-4 border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 transition-colors"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-sm font-semibold text-orange-600">
                                {index + 1}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-neutral-900 mb-1">
                                {title.toUpperCase()}
                              </h4>

                              <p className="text-sm text-neutral-600">
                                {description}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </TabPanel>

                {/* Careers */}
                <TabPanel active={activeTab === "howToApply"}>
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-1">How To Apply</h2>
                      <p className="text-sm text-neutral-400 font-light">95% employed within 6 months · Average starting salary: £62,000</p>
                    </div>

                    <div className="overflow-x-auto -mx-6 md:-mx-8">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="text-left px-6 md:px-8 pb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                              Step
                            </th>
                            <th className="text-left px-4 pb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                              Description
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {Object.entries(Scholarship?.howToApply || {}).map(
                            ([step, description]) => (
                              <tr
                                key={step}
                                className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors"
                              >
                                <td className="py-4 px-6 md:px-8 font-medium text-sm text-neutral-800 w-[220px]">
                                  {step}
                                </td>

                                <td className="py-4 px-4 text-sm text-neutral-600 font-light">
                                  {description}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { num: 95, suffix: "%", label: "Employed in 6 months" },
                        { num: 62000, suffix: "", label: "Avg. starting salary (£)" },
                        { num: 40, suffix: "+", label: "Countries where alumni work" },
                      ].map((s) => (
                        <div key={s.label} className="bg-neutral-50 rounded-xl p-5 text-center">
                          <div className="text-2xl font-medium tracking-tight text-orange-600">
                            <AnimatedNumber value={s.num} suffix={s.suffix} />
                          </div>
                          <p className="text-xs text-neutral-400 mt-1 font-medium">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabPanel>

                {/* FAQ */}
                <TabPanel active={activeTab === "faq"}>
                  <div className="p-6 md:p-8 space-y-2">
                    <h2 className="text-xl font-medium tracking-tight mb-5">Frequently Asked Questions</h2>
                    {faqs.map((faq, i) => (
                      <div key={i} className="border border-neutral-100 rounded-xl overflow-hidden hover:border-neutral-200 transition-colors duration-300">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left group"
                        >
                          <span className="font-medium text-sm pr-4 group-hover:text-orange-600 transition-colors duration-300">{faq.q}</span>
                          <div
                            className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center flex-shrink-0 transition-all duration-300"
                            style={{
                              transform: openFaq === i ? "rotate(45deg)" : "rotate(0)",
                              background: openFaq === i ? "#ea580c" : "transparent",
                              borderColor: openFaq === i ? "#ea580c" : "#e5e5e5",
                            }}
                          >
                            <svg className="w-3 h-3 transition-colors duration-300" fill="none" stroke={openFaq === i ? "#fff" : "#a3a3a3"} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12M6 12h12" />
                            </svg>
                          </div>
                        </button>
                        <div
                          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                          style={{ maxHeight: openFaq === i ? "200px" : "0" }}
                        >
                          <p className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed font-light">{faq.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabPanel>

              </div>
            </div>

            {/* ─── RIGHT SIDEBAR ─── */}
            <div className="lg:w-[320px] flex-shrink-0">
              <div className="lg:sticky lg:top-5 space-y-4">

                {/* CTA Card */}
              <div className="bg-white/95 relative backdrop-blur-sm p-5 rounded-2xl border-2 border-[#F46C44] max-w-full mx-auto">
            <div className="absolute top-4 right-4 z-10">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-orange-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Animated Pulse Dot */}
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

              {/* Name & Mobile Row */}
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 pt-5">
                {/* Name */}
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
                  {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                {/* Mobile */}
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
                  {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile.message}</p>}
                </div>
              </div>

              {/* Email */}
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
                {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>}
              </div>

              {/* Destination */}
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
                {errors.destination && <p className="text-[11px] text-red-500 font-medium">{errors.destination.message}</p>}
              </div>

              {/* Message */}


              {/* Checkbox */}
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
              {errors.agree && <p className="text-[11px] text-red-500 font-medium -mt-2">{errors.agree.message}</p>}

              {/* Submit Button */}
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

              



                {/* Similar */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5">
  <div className="flex items-center justify-between mb-4">
    <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
      Similar Scholarships
    </h4>

    <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold uppercase">
      {allSimillar?.length || 1} Available
    </span>
  </div>

  <div className="space-y-4">
    {allSimillar?.map((item) => (
     <Link
  href={`/scholarship/${item.slug}`}
  className="group flex gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:border-orange-300 hover:shadow-md transition-all"
>
  <img
    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&auto=format&fit=crop&q=80"
    alt="Scholarship"
    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
  />

  <div className="flex-1 ">
    <span className="inline-block text-[10px] font-semibold text-orange-600 uppercase tracking-wider">
      Scholarship
    </span>

    <h5 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
      {item.title}
    </h5>


    <div className="flex items-center justify-between mt-2 ">
      <span className="text-xs text-gray-500">
        {item.fundingType}
      </span>

      <span className="text-xs  font-medium text-orange-600 group-hover:translate-x-1 transition-transform">
        View →
      </span>
    </div>
  </div>
</Link>
    ))}
  </div>
</div>



              </div>
            </div>

          </div>
        </div>
      </section>


    </main>
  );
}