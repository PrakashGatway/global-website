"use client"

import { useLayoutEffect, useRef } from "react";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';



export function Destinationhome() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  gsap.registerPlugin(ScrollTrigger);

  /* 🔹 STATIC DATA */
  const staticData = {
    title: "4 Steps to your || dream destination",
    items: [
      {
        title: "Education Counselling",
        subtitle: "Expert guidance||for your academic journey",
        image: "/images/counselling.jpg",
        content: "15+||Years Experience"
      },
      {
        title: "University Applications",
        subtitle: "IELTS, TOEFL, PTE||with proven track record",
        image: "/images/test-prep.jpg",
        content: "98%||Success Rate"
      },
      {
        title: "Loan And Scholarships",
        subtitle: "Find the perfect match||for your profile",
        image: "/images/university.jpg",
        content: "500+||Partner Universities"
      },
      {
        title: "Visa Processing",
        subtitle: "End-to-end support||for smooth processing",
        image: "/images/visa.jpg",
        content: "95%||Visa Success"
      }
    ]
  };

  const items = staticData.items;

  /* 🔥 FIXED GSAP LOGIC */
  useLayoutEffect(() => {
    if (!sectionRef.current || !items.length) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        // Initially hide all right images except first
        gsap.set(".help-right", { opacity: 0, y: 40, scale: 0.95 });
        gsap.set(".help-left", { autoAlpha: 0 });
        
        // Show first items
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
            invalidateOnRefresh: true,
          },
        });

        items.forEach((_, i) => {
          if (i === 0) return;

          // Previous image out
          tl.to(`.help-right-${i - 1}`, {
            opacity: 0,
            y: -120,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.out",
          }, `>${i === 1 ? 0 : 0.2}`);

          // Current image in
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
            "<+=0.1"
          );

          // Hide previous text
          tl.set(`.help-left-${i - 1}`, { autoAlpha: 0 }, "<");
          
          // Show current text
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
      className="bg-[#fff9f4] flex items-center min-h-screen lg:h-screen overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-0">
        {/* TITLE */}
        <h3 
          className="text-center text-[2.6rem] font-semibold mb-12" 
          style={{ 
            color: '#f46c44'
            
          }}
        >
          <span className="text-[#f46c44]">{staticData.title.split("||")[0]}</span>{" "}
          <span className="text-gray-600">{staticData.title.split("||")[1]}</span>
        </h3>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT TEXT STACK */}
          <div className="relative h-[300px] lg:h-[350px]">
  {items.map((item: any, i: number) => (
    <div
      key={i}
      className={`help-left help-left-${i} absolute inset-0 transition-opacity duration-300`}
      style={{
        opacity: i === 0 ? 1 : 0,
        visibility: i === 0 ? "visible" : "hidden",
      }}
    >
      <h2
        className="text-[2.2rem] lg:text-[3.6rem] font-semibold text-[#f46c44] leading-tight mb-4 w-3xl"
        
      >
        {item.title}
      </h2>

      <ul className="text-gray-700 text-base lg:text-lg space-y-3">
        {item.subtitle.split("||").map((p: string, idx: number) => (
          <li key={idx} className="flex items-start">
            <span className="text-[#f46c44] mr-2">•</span>
            <span>{p.trim()}</span>
          </li>
        ))}
      </ul>

      {/* BUTTON */}
      <div className="mt-6">
        <button className="bg-[#f46c44] hover:bg-[#e85b32] text-white font-semibold px-6 py-3 rounded-full transition duration-300 shadow-md">
          Free Expert Consultation
        </button>
      </div>
    </div>
  ))}
</div>

          {/* RIGHT IMAGE STACK */}
          <div className="relative h-[440px] hidden lg:block">
            {items.map((item: any, i: number) => (
              <div
                key={i}
                className={`help-right help-right-${i} absolute inset-0`}
                style={{ 
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)'
                }}
              >
                {/* Main Image Card */}
                <div className="absolute top-6 right-12 w-[380px] h-[440px] shadow-2xl bg-white rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}