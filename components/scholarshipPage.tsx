"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

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
const keyFacts = [
  { label: "Degree", value: "MSc Global & Int'l Management" },
  { label: "Duration", value: "12 months" },
  { label: "Credits", value: "180 ECTS" },
  { label: "Language", value: "English" },
  { label: "Format", value: "On Campus" },
  { label: "Intake", value: "October 2026" },
  { label: "Scholarship", value: "₹10,00,000" },
  { label: "Deadline", value: "30 Sept 2026" },
];

const keyFactsDetailed = [
  { l: "Scholarship Name", v: "Global Excellence Scholarship" },
  { l: "University", v: "University of Oxford" },
  { l: "Department", v: "Saïd Business School" },
  { l: "Degree Awarded", v: "MSc in Global & International Management" },
  { l: "Duration", v: "12 months (full-time)" },
  { l: "ECTS Credits", v: "180" },
  { l: "Teaching Language", v: "English" },
  { l: "Mode of Study", v: "On campus" },
  { l: "Intake", v: "October 2026" },
  { l: "Application Deadline", v: "30 September 2026" },
  { l: "Scholarship Amount", v: "₹10,00,000 (~£75,900)" },
  { l: "Coverage", v: "Tuition + Living + Travel" },
  { l: "Eligible Nationalities", v: "All international (non-UK)" },
  { l: "Number of Awards", v: "Up to 30 per year" },
  { l: "Renewable", v: "No (one-year programme)" },
  { l: "Requires Admission Offer", v: "Yes" },
];

const costs = [
  { item: "Tuition Fee (International)", amount: "£52,400" },
  { item: "College Fee", amount: "£3,500" },
  { item: "Living Costs (est. 12 months)", amount: "£18,000" },
  { item: "Books & Supplies", amount: "£800" },
  { item: "Visa & Health Surcharge", amount: "£1,200" },
  { item: "Total Estimated Cost", amount: "£75,900", highlight: true },
];

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

const documents = [
  "Scholarship application form",
  "Personal statement (1,000 words)",
  "Curriculum Vitae",
  "Academic transcripts",
  "Degree certificate",
  "Two reference letters",
  "English test results",
  "GMAT/GRE scores (if available)",
  "Research proposal (research track)",
  "Passport copy",
];

const curriculum = [
  { term: "Michaelmas Term (Oct–Dec)", courses: ["Global Strategy & Competition", "International Political Economy", "Quantitative Methods for Management", "Leadership & Organisational Behaviour"] },
  { term: "Hilary Term (Jan–Mar)", courses: ["Cross-Cultural Management", "International Finance & Risk", "Elective I (12 options)", "Elective II (12 options)"] },
  { term: "Trinity Term (Apr–Jun)", courses: ["Consulting Project (international org)", "Elective III", "Dissertation / Business Plan"] },
  { term: "Summer (Jul–Sep)", courses: ["Dissertation Submission", "Graduation Ceremony"] },
];

const careers = [
  { title: "Management Consultant", companies: "McKinsey, BCG, Bain", salary: "£65,000–£90,000" },
  { title: "Strategy Analyst", companies: "Google, Amazon, JP Morgan", salary: "£55,000–£75,000" },
  { title: "Int'l Business Dev", companies: "Unilever, Siemens, HSBC", salary: "£50,000–£70,000" },
  { title: "Policy Advisor", companies: "World Bank, OECD, UN", salary: "£45,000–£65,000" },
];

const reviews = [
  { name: "Priya S.", country: "India", year: "2024", rating: 5, text: "The Global Excellence Scholarship transformed my career trajectory. The mentorship alone was worth more than the financial support. Oxford's network opened doors I never knew existed." },
  { name: "Ahmed K.", country: "Egypt", year: "2023", rating: 5, text: "The application process was rigorous but fair. The interviewers genuinely wanted to understand my vision. Now I'm working at the World Bank — something I couldn't have imagined before." },
  { name: "Maria L.", country: "Brazil", year: "2024", rating: 4, text: "Incredible programme with world-class professors. The only downside is the intensity — be prepared for a challenging but rewarding year. The scholarship community is incredibly supportive." },
];

const similarScholarships = [
  { name: "Clarendon Fund", uni: "University of Oxford", amount: "Full Tuition + Living", tag: "Fully Funded" },
  { name: "Chevening Scholarship", uni: "Various UK Universities", amount: "Full Tuition + Living", tag: "Fully Funded" },
  { name: "Rhodes Scholarship", uni: "University of Oxford", amount: "Full Tuition + Living", tag: "Fully Funded" },
  { name: "Gates Cambridge", uni: "University of Cambridge", amount: "Full Tuition + Living", tag: "Fully Funded" },
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
  { id: "curriculum", label: "Curriculum" },
  { id: "careers", label: "Careers" },
  { id: "faq", label: "FAQ" },
];

/* ─── Animated Tab Content Wrapper ─── */
function TabPanel({ active, children }: { active: boolean; children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (active && innerRef.current) {
      const h = innerRef.current.scrollHeight;
      setHeight(h);
    } else {
      setHeight(0);
    }
  }, [active]);

  return (
    <div
      className="overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
      style={{ height: active ? height : 0 }}
    >
      <div ref={innerRef} className="pb-2">
        {children}
      </div>
    </div>
  );
}

export default function ScholarshipPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reqTab, setReqTab] = useState(0);
  const [heroScale, setHeroScale] = useState(1.05);

  useEffect(() => {
    const onScroll = () => {
      const s = Math.max(1, 1.05 - window.scrollY * 0.0002);
      setHeroScale(s);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.15] max-w-3xl">
              Global Excellence Scholarship
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-white/50 text-sm md:text-base mt-2 font-light">
              University of Oxford · Saïd Business School · MSc Global & International Management
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───── KEY FACTS STRIP ───── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-x divide-neutral-100">
            {keyFacts.map((f, i) => (
              <Reveal key={f.label} delay={i * 50}>
                <div className="py-4 px-3 text-center group cursor-default">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                    {f.label}
                  </p>
                  <p className="font-medium text-sm truncate">{f.value}</p>
                </div>
              </Reveal>
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
              <Reveal>
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-1">
                  <div className="flex overflow-x-auto no-scrollbar">
                    {contentTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setOpenFaq(null); }}
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
              </Reveal>

              {/* ─── TAB PANELS ─── */}
              <div className="bg-white rounded-2xl border border-neutral-200 border-t-0 rounded-t-none shadow-sm">

                {/* Overview */}
                <TabPanel active={activeTab === "overview"}>
                  <div className="p-6 md:p-8 space-y-8">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-4">About This Scholarship</h2>
                      <div className="space-y-4 text-[15px] text-neutral-600 leading-relaxed font-light">
                        <p>
                          The Global Excellence Scholarship at the University of Oxford's Saïd Business School is a flagship fully-funded programme designed to attract exceptional international students to the MSc in Global and International Management. It recognises outstanding academic achievement, demonstrated leadership, and a strong commitment to driving positive change in the global business landscape.
                        </p>
                        <p>
                          Each year, up to <strong className="font-medium text-neutral-900">30 scholars</strong> are selected from a highly competitive global pool. The scholarship covers full tuition fees (£52,400), a generous living allowance (£18,000/year), one return flight, and a settling-in grant. Beyond financial support, scholars gain access to an exclusive mentorship programme, leadership retreats, and a lifelong network of Oxford alumni spanning 140+ countries.
                        </p>
                        <p>
                          The MSc in Global and International Management is a <strong className="font-medium text-neutral-900">12-month intensive programme</strong> combining rigorous academic training with real-world consulting projects. Students develop expertise in global strategy, cross-cultural management, international finance, and political economy.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-5">Key Facts</h2>
                      <div className="grid sm:grid-cols-2 gap-x-10">
                        {keyFactsDetailed.map((item) => (
                          <div key={item.l} className="flex justify-between py-2.5 border-b border-neutral-50 group">
                            <span className="text-sm text-neutral-400 group-hover:text-neutral-600 transition-colors">{item.l}</span>
                            <span className="text-sm font-medium text-right max-w-[60%]">{item.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { num: 30, suffix: "+", label: "Scholars per year" },
                        { num: 140, suffix: "+", label: "Countries represented" },
                        { num: 95, suffix: "%", label: "Employed in 6 months" },
                      ].map((s) => (
                        <div key={s.label} className="bg-neutral-50 rounded-xl p-5 text-center">
                          <div className="text-2xl md:text-3xl font-medium tracking-tight text-orange-600">
                            <AnimatedNumber value={s.num} suffix={s.suffix} />
                          </div>
                          <p className="text-xs text-neutral-400 mt-1 font-medium">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* City */}
                    <div className="rounded-2xl overflow-hidden border border-neutral-100">
                      <div className="relative h-40">
                        <img src="https://picsum.photos/seed/oxford-city-spire/1200/400.jpg" alt="Oxford" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h3 className="absolute bottom-4 left-5 text-lg font-medium text-white">About Oxford</h3>
                      </div>
                      <div className="p-5">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {[
                            { l: "Population", v: "154,000" },
                            { l: "Living Cost", v: "£1,200–1,500/mo" },
                            { l: "To London", v: "1 hr train" },
                          ].map((c) => (
                            <div key={c.l}>
                              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">{c.l}</p>
                              <p className="text-sm font-medium mt-0.5">{c.v}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed font-light">
                          Oxford is a world-renowned university city with a rich history dating back over 800 years. The city offers a unique blend of historic architecture, vibrant cultural life, and a welcoming international community.
                        </p>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-medium tracking-tight">Student Reviews</h2>
                        <div className="text-right">
                          <span className="text-2xl font-medium">4.7</span>
                          <span className="text-orange-400 text-sm ml-1">★★★★★</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {reviews.map((r, i) => (
                          <div key={i} className="border border-neutral-100 rounded-xl p-5 hover:border-neutral-200 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-medium">
                                  {r.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{r.name}</p>
                                  <p className="text-xs text-neutral-400">{r.country} · {r.year}</p>
                                </div>
                              </div>
                              <span className="text-orange-400 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                            </div>
                            <p className="text-sm text-neutral-500 leading-relaxed font-light italic">&ldquo;{r.text}&rdquo;</p>
                          </div>
                        ))}
                      </div>
                    </div>
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
                      {costs.map((c) => (
                        <div
                          key={c.item}
                          className={`flex justify-between items-center py-3.5 border-b ${
                            c.highlight
                              ? "border-t-2 border-t-orange-600 border-b-0 bg-orange-50/50 -mx-6 md:-mx-8 px-6 md:px-8 mt-4"
                              : "border-neutral-50"
                          }`}
                        >
                          <span className={`text-sm ${c.highlight ? "font-medium" : "text-neutral-600 font-light"}`}>{c.item}</span>
                          <span className={`text-sm font-medium ${c.highlight ? "text-orange-600 text-base" : ""}`}>{c.amount}</span>
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
                            className={`flex-1 text-xs font-semibold py-2.5 rounded-lg transition-all duration-300 ${
                              reqTab === i ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600"
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
                        {documents.map((doc) => (
                          <div key={doc} className="flex items-center gap-2.5 text-sm text-neutral-600 font-light py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                            {doc}
                          </div>
                        ))}
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
                <TabPanel active={activeTab === "curriculum"}>
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-1">Programme Structure</h2>
                      <p className="text-sm text-neutral-400 font-light">180 ECTS · 12 months · Three terms + summer dissertation</p>
                    </div>

                    <div className="space-y-4">
                      {curriculum.map((term, ti) => (
                        <div key={term.term} className="border border-neutral-100 rounded-xl overflow-hidden hover:border-neutral-200 transition-colors duration-300">
                          <div className="bg-neutral-50 px-5 py-3 flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
                              T{ti + 1}
                            </div>
                            <h4 className="font-medium text-sm">{term.term}</h4>
                          </div>
                          <div className="px-5 py-3 space-y-2">
                            {term.courses.map((c) => (
                              <div key={c} className="flex items-center gap-2.5 text-sm text-neutral-600 font-light py-1">
                                <div className="w-1 h-1 rounded-full bg-orange-400" />
                                {c}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabPanel>

                {/* Careers */}
                <TabPanel active={activeTab === "careers"}>
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-1">Career Prospects</h2>
                      <p className="text-sm text-neutral-400 font-light">95% employed within 6 months · Average starting salary: £62,000</p>
                    </div>

                    <div className="overflow-x-auto -mx-6 md:-mx-8">
                      <table className="w-full min-w-[480px]">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            {["Role", "Top Employers", "Salary Range"].map((h) => (
                              <th key={h} className={`text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 pb-3 ${h === "Role" ? "text-left px-6 md:px-8" : h === "Salary Range" ? "text-right px-6 md:px-8" : "text-left px-4"}`}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {careers.map((c) => (
                            <tr key={c.title} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                              <td className="py-3.5 px-6 md:px-8 font-medium text-sm">{c.title}</td>
                              <td className="py-3.5 px-4 text-sm text-neutral-500 font-light">{c.companies}</td>
                              <td className="py-3.5 px-6 md:px-8 text-sm font-medium text-right text-orange-600">{c.salary}</td>
                            </tr>
                          ))}
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
                <Reveal delay={200}>
                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden">
                    <div className="relative h-28">
                      <img src="https://picsum.photos/seed/said-business/640/240.jpg" alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-lg">🏛️</div>
                        <div className="text-orange-300 text-xs">★★★★★ <span className="text-white/60 ml-0.5">4.8</span></div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-medium text-sm">University of Oxford</h3>
                      <p className="text-xs text-neutral-400 mb-4">Saïd Business School · Oxford, UK</p>

                      <div className="space-y-2.5 mb-5">
                        {[
                          { l: "Amount", v: "₹10,00,000", vc: "text-orange-600" },
                          { l: "Deadline", v: "30 Sept 2026", vc: "text-red-600" },
                          { l: "Days Left", v: "487 days", vc: "" },
                        ].map((item) => (
                          <div key={item.l} className="flex justify-between text-sm">
                            <span className="text-neutral-400 font-light">{item.l}</span>
                            <span className={`font-medium ${item.vc}`}>{item.v}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 rounded-xl transition-all duration-300 text-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                        Apply Now
                      </button>
                      <button className="w-full border border-neutral-200 hover:border-neutral-300 text-neutral-600 font-medium py-3 rounded-xl transition-all duration-300 text-sm mt-2.5 hover:bg-neutral-50">
                        Check Eligibility
                      </button>
                    </div>
                  </div>
                </Reveal>

                {/* Rankings */}
                <Reveal delay={300}>
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-4">University Rankings</h4>
                    <div className="space-y-3">
                      {[
                        { name: "QS World University", rank: "#1" },
                        { name: "THE World University", rank: "#1" },
                        { name: "FT Business School", rank: "#3" },
                        { name: "Research Quality", rank: "#2" },
                      ].map((r) => (
                        <div key={r.name} className="flex justify-between items-center group">
                          <span className="text-sm text-neutral-500 font-light group-hover:text-neutral-700 transition-colors">{r.name}</span>
                          <span className="text-sm font-medium text-orange-600">{r.rank}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

              

                {/* Similar */}
                <Reveal delay={500}>
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-4">Similar Scholarships</h4>
                    <div className="space-y-3">
                      {similarScholarships.map((s) => (
                        <a
                          key={s.name}
                          href="#"
                          className="block group border border-neutral-100 rounded-xl p-3.5 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h5 className="font-medium text-sm group-hover:text-orange-600 transition-colors duration-300 leading-tight">{s.name}</h5>
                            <span className="text-[8px] font-bold uppercase tracking-[0.15em] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex-shrink-0">
                              {s.tag}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 font-light">{s.uni}</p>
                          <p className="text-xs font-medium text-orange-600 mt-1">{s.amount}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>

          

              </div>
            </div>

          </div>
        </div>
      </section>


    </main>
  );
}