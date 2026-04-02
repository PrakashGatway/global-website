import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);


const STACK_OFFSET = 18;

export function Destinationhome({ homePage }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  const stepsData =
    homePage?.dreamDestination?.steps?.map((step, index) => ({
      number: Number(step.order) || index + 1,
      title: step.title,
      description: step.subtitle,
      cta: step.ctabutton,
      route: step.ctaRoute,
    })) || [];

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();
    let ctx: gsap.Context | null = null;
    let mainScrollTrigger: ScrollTrigger | null = null;

    mm.add("(min-width: 1024px)", () => {
      ctx = gsap.context(() => {
        const section = sectionRef.current!;
        const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
        const dots = dotsRef.current.filter(Boolean) as HTMLElement[];
        const totalCards = cards.length;

        const getVh = () => window.innerHeight;

        cards.forEach((card, i) => {
          gsap.set(card, {
            zIndex: 10 + i,
            y: i === 0 ? 0 : STACK_OFFSET * 3 + 400,
            opacity: i === 0 ? 1 : 1,
            scale: i === 0 ? 1 : 1,
            willChange: "transform, opacity",
          });
        });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalCards * getVh() * 0.75}`,
            pin: true,
            anticipatePin: 1,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const activeIndex = Math.min(
                Math.floor(progress * totalCards),
                totalCards - 1
              );
              dots.forEach((dot, i) => {
                dot.classList.toggle("active-dot", i === activeIndex);
              });
            },
          },
        });

        for (let step = 1; step < totalCards; step++) {
          const position = (step / totalCards) * masterTl.duration();

          for (let i = 0; i < step; i++) {
            const targetY = -(totalCards - i - 1) * STACK_OFFSET;
            masterTl.to(
              cards[i],
              {
                y: targetY,
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
              },
              position
            );
          }

          masterTl.to(
            cards[step],
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            position
          );
        }

        mainScrollTrigger = masterTl.scrollTrigger;

      }, sectionRef);

      return () => {
        mainScrollTrigger?.kill();
        ctx?.revert();
      };
    });

    return () => mm.revert();
  }, []);

  console.log(homePage)

  return (
    <section
      ref={sectionRef}
      className="relative bg-white overflow-hidden pt-2 max-w-[1440px] pt-10 mx-auto "

    >
      {/* Desktop: Fixed height with h-screen */}
      <div className="hidden lg:block w-full h-[700px] flex flex-col">
        {/* Title */}
        <div className="text-center pt-12 lg:py-10 px-4">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-primary">
            {homePage?.dreamDestination?.title ? (
              <>
                <span className="text-primary">
                  {homePage?.dreamDestination?.title.split("||")[0]}
                </span>
                <span className="text-[#F46C44]">
                  {homePage?.dreamDestination?.title.split("||")[1]}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: "#F46C44" }}>4 Steps</span> to Your Dream Destination
              </>
            )}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 lg:px-10 xl:pl-12 ">
          <div className="hidden lg:flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full ">
            {/* Left: Stacking cards container */}
            <div className="relative w-full lg:w-1/2 h-[340px]">
              {stepsData.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => (cardsRef.current[i] = el)}
                  className="step-card absolute inset-0 rounded-2xl p-6 sm:p-8 flex flex-col justify-center shadow-lg border border-gray-300"
                  style={{
                    background: "#fff",

                    zIndex: 10 + i,
                  }}
                >
                  <div
                    className=" lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 shrink-0"
                    style={{
                      background: "#1a3a6b",
                      color: "#fff",
                    }}
                  >
                    {step.number}
                  </div>

                  <h3
                    className="text-xl sm:text-2xl font-bold mb-3"
                    style={{ color: "#1a1a2e" }}
                  >
                    {step.title}
                  </h3>

                  <p
                    className="text-sm sm:text-base leading-relaxed mb-5"
                    style={{ color: "#555" }}
                    dangerouslySetInnerHTML={{ __html: step.description || "" }}
                  />

                  <Link href={step?.ctaRoute || "/contact"}>
                    <button
                      className="self-start cursor-pointer text-sm font-semibold px-6 py-2.5 rounded-full border-2 transition-colors hover:bg-[#1a3a6b] hover:text-white"
                      style={{
                        borderColor: "#1a3a6b",
                        color: "#1a3a6b",
                        background: "transparent",
                      }}
                    >
                      {step?.ctabutton || "Free Expert Consultation"}
                    </button></Link>
                </div>
              ))}
            </div>

            {/* Right: Fixed image */}
            <div className="hidden lg:block w-1/2">
              <div className=" ">
                <img
                  src={homePage?.dreamDestination?.Image || "/images/destination-pic.png"}
                  alt="Foreign Education Consultants"
                  className="w-full h-[500px] object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Mobile/Tablet: Auto height, scrollable */}
      <div className="lg:hidden w-full flex flex-col min-h-screen">
        {/* Title */}
        <div className="text-center pt-12 pb-6 px-4">
          <h2
            className="text-lg sm:text-3xl font-bold"
            style={{ color: "#1a1a2e" }}
          >

            {homePage?.dreamDestination?.title ? (
              <>
                <span className="text-primary">
                  {homePage?.dreamDestination?.title.split("||")[0]}
                </span>
                <span className="text-[#F46C44]">
                  {homePage?.dreamDestination?.title.split("||")[1]}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: "#F46C44" }}>4 Steps</span> to Your Dream Destination
              </>
            )}

          </h2>
        </div>

        {/* Cards - All 4 steps scrollable */}
        <div className="flex-1 w-full max-w-2xl mx-auto px-4 pb-12 space-y-4">
          {stepsData.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-white border border-[#e8ecf1] shadow-lg"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-3"
                style={{
                  background: "#1a3a6b",
                  color: "#fff",
                }}
              >
                {step.number}
              </div>

              <h3
                className="text-sm font-bold mb-2"
                style={{ color: "#1a1a2e" }}
              >
                {step.title}
              </h3>

              <p
                className="text-sm sm:text-base leading-relaxed mb-5"
                style={{ color: "#555" }}
                dangerouslySetInnerHTML={{ __html: step.description || "" }}
              />

              <Link href={step?.ctaRoute || "/contact"}>
                <button
                  className="text-xs font-semibold px-5 py-2 rounded-full border-2 transition-colors hover:bg-[#1a3a6b] hover:text-white"
                  style={{
                    borderColor: "#1a3a6b",
                    color: "#1a3a6b",
                    background: "transparent",
                  }}
                >
                  Free Expert Consultation
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .active-dot {
          background: #1a3a6b !important;
          transform: scale(1.4);
          box-shadow: 0 0 0 4px rgba(26, 58, 107, 0.2);
        }
      `}</style>
    </section>
  );
}