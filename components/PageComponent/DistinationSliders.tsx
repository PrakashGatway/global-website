"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
    <div
      className="
        keen-slider__slide
        !w-auto
        !min-w-max
        lg:!w-[280px]
        lg:!min-w-[280px]
        flex justify-center
      "
    >
      <div
        className="
          flex items-center justify-center gap-2
          border-2 border-[#ff6a3d]
          text-[#ff6a3d]
          px-6 py-4
          text-sm sm:text-base
          font-medium
          bg-white
          text-center
          whitespace-nowrap
          w-full
        "
      >
        <span className="font-bold text-lg sm:text-xl shrink-0">
          {count}
        </span>
        <span className="shrink-0">
          {text}
        </span>
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
        slides: {
          perView: "auto",
          spacing: 16,
        },
      },
      [marquee(0.4)]
    );

    const slider2 = new KeenSlider(
      sliderRef2.current,
      {
        loop: true,
        drag: true,
        renderMode: "performance",
        slides: {
          perView: "auto",
          spacing: 16,
        },
      },
      [marquee(-0.4)]
    );


    return () => {
      slider1.destroy();
      slider2.destroy();
    };
  }, []);





  return (
    <div className="space-y-6 pt-8 overflow-hidden bg-white">
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









import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StickyPaymentSection = ({ sections }) => {
  const sectionRef = useRef(null);
  const cards = useMemo(() => {
    return (sections || []).map(item => ({
      id: item.title,
      title: item.title,
      description: item.subtitle || "",
      ctaText: "Free Expert Consultation",
      ctaLink: "#",
    }));
  }, [sections]);





  const [activeIndex, setActiveIndex] = useState(0);


  /* ✅ CONTROLLED REFRESH */
  const refreshST = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current || !cards.length) return;

    const mm = gsap.matchMedia();
    let lastIndex = 0;

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        // INITIAL IMAGE STATE
        gsap.set(".right-image-0", { opacity: 1, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${cards.length * 70}%`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,

            onUpdate: (self) => {
              const index = Math.min(
                cards.length - 1,
                Math.floor(self.progress * cards.length)
              );

              if (index !== lastIndex) {
                lastIndex = index;
                setActiveIndex(index);
              }
            },

            onLeave: () => {
              gsap.to(".pin-wrapper", {
                autoAlpha: 0,
                y: -40,
                duration: 0.5,
                ease: "power2.out",
              });
            },

            onEnterBack: () => {
              gsap.to(".pin-wrapper", {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
              });
            },
          },
        });

        // IMAGE SEQUENCE
        cards.forEach((_, i) => {
          if (i === 0) return;

          tl.to(
            `.right-image-${i - 1}`,
            {
              opacity: 0,
              yPercent: -30,
              scale: 0.95,
              duration: 0.4,
              ease: "power2.out",
            },
            "+=0.5"
          );

          tl.fromTo(
            `.right-image-${i}`,
            { opacity: 0, yPercent: 30, scale: 0.95 },
            {
              opacity: 1,
              yPercent: 0,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
            }
          );
        });

        tl.to(
          cards.map((_, i) => `.right-image-${i}`),
          {
            opacity: 0,
            scale: 0.92,
            y: -40,
            duration: 0.6,
            ease: "power2.out",
          },
          "+=0.3"
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [cards]);


  const rightContentRef = useRef(null);

  useEffect(() => {
    if (!rightContentRef.current) return;

    if (window.innerWidth < 1024) return; // ❌ no animation on mobile

    gsap.fromTo(
      rightContentRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      }
    );
  }, [activeIndex]);


  useEffect(() => {
    if (window.innerWidth < 1024) {
      setActiveIndex(0);
    }
  }, []);










  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-6">
      {/* pin-wrapper only pins on desktop */}
      <div className="pin-wrapper lg:h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">

          {/* RIGHT: IMAGE AREA (DESKTOP ONLY GSAP) */}
          <div className="relative w-full lg:h-[600px] flex items-center justify-center">

            <div className="relative w-full">
              {sections.map((img, i) => (
                <div
                  key={img}
                  className={`
                right-image-${i}
                hidden lg:block
                absolute -top-40
              `}
                >
                  <Image
                    src={img.image}
                    width={500}
                    height={700}
                    alt="img"
                  />
                </div>
              ))}
            </div>

          </div>

          {/* TEXT CONTENT */}
          <div
            ref={rightContentRef}
            className="relative lg:h-[580px]"
          >
            {cards.map((card, i) => (
              <div
                key={card.id}
                className={`
              py-10 lg:py-20
              lg:absolute lg:inset-0
              ${i === activeIndex
                    ? "opacity-100 lg:z-10"
                    : "opacity-100 lg:opacity-0 lg:pointer-events-none"
                  }
            `}
              >
                <div className=" max-w-lg lg:w-2xl lg:h-[580px]">

                  <h3
                    className="text-orange-500 text-[2.2rem] lg:text-[3rem] font-bold mb-4"
                    style={{
                      fontFamily:
                        "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </h3>

                  <ul className="list-disc list-inside text-gray-600 text-base lg:text-lg space-y-3">
                    {card.description
                      .split("•")
                      .filter(Boolean)
                      .map((p, idx) => (
                        <li key={idx}>{p.trim()}</li>
                      ))}
                  </ul>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a
                      className="
                    text-white px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1f2937]
                    rounded-tr-4xl shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
                    text-base font-semibold
                    hover:bg-black hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)]
                    flex items-center justify-center gap-2
                    transition-all hover:opacity-90 cursor-pointer
                  "
                    >
                      {card.ctaText || "Get Free Counselling"}
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>

  );
};

export { StickyPaymentSection };





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
    <section className="bg-[#f5f1f0] py-20 px-5">
      <div className="max-w-7xl mx-auto sm:px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 ">
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
      <p style={{ textDecoration: underline && "underline" }} className="text-[#656565] text-base font-semibold leading-relaxed">
        {text}
      </p>
    </div>
  );
}









export function HowGawayHelps({ howWeHelpData }: { howWeHelpData: any }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  gsap.registerPlugin(ScrollTrigger);


  /* 🔹 NORMALIZE DATA (same as StickyPaymentSection) */
  const items = useMemo(() => howWeHelpData?.items || [], [howWeHelpData]);



  /* 🔥 GSAP LOGIC — SAME AS YOUR WORKING COMPONENT */
  useLayoutEffect(() => {
    if (!sectionRef.current || !items.length) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {

        gsap.set(".help-right", { opacity: 0, y: 40, scale: 0.95 });

        gsap.set(".help-left", { autoAlpha: 0 });
        gsap.set(".help-left-0", { autoAlpha: 1 });
        gsap.set(".help-right-0", { opacity: 1, y: 0, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${items.length * 40}%`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: false,
          },
        });

        items.forEach((_, i) => {
  if (i === 0) return;

  // OLD IMAGE OUT
  tl.to(`.help-right-${i - 1}`, {
    opacity: 0,
    y: -120,
    scale: 0.95,
    duration: 0.4,
    ease: "power2.out",
  });

  // NEW IMAGE IN
  tl.fromTo(
    `.help-right-${i}`,
    { opacity: 0, y: 40, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    },
    "<" // ⭐ start SAME TIME as previous animation
  );

  // ⭐ TEXT SWITCH — NO DELAY
  tl.set(`.help-left-${i - 1}`, { autoAlpha: 0 }, "<");

  tl.set(`.help-left-${i}`, { autoAlpha: 1 }, "<");
});
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [items]);




  return (
    <section
      ref={sectionRef}
      className="bg-[#fff9f4] flex items-center min-h-screen lg:h-screen"
    >
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-0">
        {/* TITLE */}
        <h3 className="text-center text-[2.6rem] font-semibold mb-12" style={{ color: '#f46c44', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}>
          <span className="text-[#f46c44]">{howWeHelpData?.title.split("||")[0]}</span>{" "}
          <span className="text-gray-600">{howWeHelpData?.title.split("||")[1]}</span>
        </h3>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT TEXT */}
          {/* LEFT TEXT STACK */}
          <div className="relative lg:h-[260px] space-y-10 lg:space-y-0">
            {items.map((item: any, i: number) => (
              <div
                key={item.title}
                className={`
        help-left help-left-${i}
        lg:absolute lg:inset-0
        opacity-100
      `}
              >
                <h2
                  className="text-[2.2rem] lg:text-[3.6rem] font-semibold text-[#f46c44] leading-tight mb-2"
                  style={{
                    fontFamily:
                      "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </h2>

                <ul className="text-gray-700 text-base lg:text-lg space-y-2">
                  {item.subtitle.split("||").map((p: string, idx: number) => (
                    <li key={idx}>• {p.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>


          {/* RIGHT IMAGE STACK (DESKTOP ONLY) */}
          <div className="relative h-[440px] hidden lg:flex justify-center">
            {items.map((item: any, i: number) => (
              <div
                key={item.title}
                className={`help-right help-right-${i} absolute inset-0`}
              >
                {/* <div className="absolute top-2 right-25 w-[380px] h-[440px] shadow-2xl border border-orange-500 rotate-[5deg]" /> */}

                <div className="absolute top-6 right-12 w-[380px] h-[440px] shadow-lg bg-white">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="absolute bottom-25 right-[70%] translate-x-1/2 w-[180px] h-[180px] bg-white border-2 shadow-lg overflow-hidden"
                  style={{
                    fontFamily:
                      "'Mileast','Playfair Display','Cormorant Garamond',Georgia,serif",
                  }}
                >
                  <div className="p-6 text-lg font-medium">
                    {item.content?.split("||").map((part: string, idx: number) => (
                      <span
                        key={idx}
                        className={idx % 2 ? "text-[#f46c44] font-semibold" : ""}
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  );
}



import {

  IdCard // fallback
} from 'lucide-react';
import Image from "next/image";

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