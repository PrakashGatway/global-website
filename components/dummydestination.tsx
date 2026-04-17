import { useRef } from "react";
import Link from "next/link";


export function Destinationhome({ homePage }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const stepsData =
    homePage?.dreamDestination?.steps?.map((step, index) => ({
      number: Number(step.order) || index + 1,
      title: step.title,
      description: step.subtitle,
      cta: step.ctabutton,
      route: step.ctaRoute,
    })) || [];

  const titleParts = homePage?.dreamDestination?.title?.split("||") || [];
  const defaultTitle = "4 Steps to Your Dream Destination";
  const imageSrc =
    homePage?.dreamDestination?.Image || "/images/destination-pic.png";

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-12 lg:py-20 max-w-[1440px] mx-auto px-4"
    >
      {/* Title */}
      <div className="text-center mb-10 lg:mb-16">
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

      {/* Desktop Layout */}
      <div className="flex items-stretch gap-8 xl:gap-12">
        {/* LEFT - Cards */}
        <div className="w-full lg:w-1/2 space-y-6">
          {stepsData.map((step, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              style={{top:80+(i+1)*40 + "px"}}
              className={`sticky rounded-2xl p-6 xl:p-8 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4"
                style={{ background: "#1a3a6b", color: "#fff" }}
              >
                {step.number}
              </div>

              <h3 className="text-xl xl:text-2xl font-bold mb-3 text-[#1a1a2e]">
                {step.title}
              </h3>

              <span
                className="text-base leading-relaxed mb-5 text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: step?.description,
                }}
              />

              <Link href={step?.route || "/contact"}>
                <button
                  className="text-sm font-semibold px-6 py-2.5 rounded-full border-2 hover:text-white transition-all duration-300 hover:bg-[#1a3a6b] hover:text-white"
                  style={{
                    borderColor: "#1a3a6b"
                  }}
                >
                  {step?.cta || "Free Expert Consultation"}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* RIGHT - Sticky Image (FIXED) */}
        <div className="w-full hidden lg:block lg:w-1/2 flex justify-center self-stretch">
          <div className="sticky top-24 h-fit w-full max-w-[550px]">
            <img
              src={imageSrc}
              alt="Foreign Education Consultants"
              className="w-full h-auto object-contain rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      {/* <div className="lg:hidden space-y-5">
        {stepsData.map((step, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="rounded-2xl p-6 bg-white border border-[#e8ecf1] shadow-lg"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold mb-4"
              style={{ background: "#1a3a6b", color: "#fff" }}
            >
              {step.number}
            </div>

            <h3 className="text-lg font-bold mb-2 text-[#1a1a2e]">
              {step.title}
            </h3>

            <p
              className="text-sm leading-relaxed mb-4 text-gray-600"
              dangerouslySetInnerHTML={{
                __html: step.description || "",
              }}
            />

            <Link href={step?.route || "/contact"}>
              <button
                className="text-sm font-semibold px-5 py-2.5 rounded-full border-2 transition-all duration-300 hover:bg-[#1a3a6b] hover:text-white"
                style={{
                  borderColor: "#1a3a6b"
                }}
              >
                {step?.cta || "Free Expert Consultation"}
              </button>
            </Link>
          </div>
        ))}
      </div> */}
    </section>
  );
}