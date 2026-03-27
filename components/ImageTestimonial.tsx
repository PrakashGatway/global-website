

"use client";
import { useEffect, useRef } from "react";

interface ImageTestimonialItem {
  id: string | number;
  name: string;
  text: string;
  image: string; // full URL
}

interface ImageTestimonialProps {
  title?: string; // e.g., "Image || Testimonials"
  subtitle?: string;
  items: ImageTestimonialItem[];
  font?: boolean;
  bg?: boolean;
}

export default function ImageTestimonial({
  title,
  subtitle,
  items = [],
  font,
  bg,
}: ImageTestimonialProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current || items.length === 0) return;

    let slider: any;

    const initSlider = async () => {
      const KeenSlider = (await import("keen-slider")).default;

      // MARQUEE PLUGIN
      const marquee = (slider: any) => {
        let raf: number;
        const speed = 0.0008; // Smooth slow speed

        const move = () => {
          if (!slider.track.details) return;
          slider.track.add(speed);
          raf = requestAnimationFrame(move);
        };

        slider.on("created", () => {
          raf = requestAnimationFrame(move);
        });

        slider.on("destroyed", () => {
          cancelAnimationFrame(raf);
        });
      };
      console.log(items)

      slider = new KeenSlider(
        sliderRef.current!,
        {
          loop: true,
          renderMode: "performance",
          drag: false, // Keeps smooth marquee feel
          slides: {
            perView: "auto", // Fallback, overridden by breakpoints
            spacing: 16,
          },
          breakpoints: {
            // 📱 Mobile: Show 2 cards
            "(min-width: 0px)": {
              slides: { perView: 2, spacing: 12 },
            },

            // 📲 Tablet: Show 3 cards
            "(min-width: 640px)": {
              slides: { perView: 3, spacing: 20 },
            },

            // 💻 Desktop: Show 4 cards (No spacing as per original request)
            "(min-width: 1024px)": {
              slides: { perView: 4, spacing: 0 },
            },
          },
        },
        [marquee]
      );
    };

    initSlider();

    // ✅ CLEANUP
    return () => {
      slider?.destroy();
    };
  }, [items]);

  return (
    <section className="w-full lg:pt-4  lg:px-4 sm:px-8 bg-white overflow-hidden">
      <div className="mx-auto">
        {/* Heading */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-xl  mb-2">
            <span className="text-[#F46C44] lg:text-4xl font-light">
              {title?.split("||")[0]?.trim() || "Image"}
            </span>{" "}
            <br />
            <span className="text-primary font-bold relative inline-block lg:text-4xl">
              {title?.split("||")[1]?.trim() || "Testimonials"}
              <span className="absolute right-0 -bottom-2 w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>
            </span>
          </h2>
        </div>

        <div className="keen-slider py-6 lg:py-10" ref={sliderRef}>
          {items.map((item, index) => {
            const isReverse = index % 2 === 0;

            return (
              <div
                key={index}
                className="keen-slider__slide px-1 lg:p-2 py-8 lg:py-16 flex justify-center"
              >
                <div
                  className={`flex flex-col ${
                    isReverse ? "flex-col-reverse" : ""
                  } relative w-full max-w-[300px] sm:max-w-none`}
                >
                  {/* Orange Shape */}
                  <div
                    className={`absolute bg-orange-500 rounded-4xl -z-10
                      ${
                        isReverse
                          ? "w-28 h-32 lg:w-50 lg:h-[200px] -bottom-[4px] lg:-bottom-[5px] -right-[4px] lg:-right-[5px]"
                          : "w-28 h-28 lg:w-50 lg:h-50 -top-[29px] lg:-top-[54px] lg:-left-[5px] -left-[4px]"
                      }`}
                  ></div>

                  {/* IMAGE */}
                  <div className="h-[140px] lg:h-[300px] -mt-6 lg:-mt-12 w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top rounded-3xl lg:rounded-4xl"
                    />
                  </div>

                  {/* CARD */}
                  <div
                    className={`bg-white rounded-3xl lg:rounded-4xl
                      py-4 lg:py-6 px-3 lg:px-6
                      shadow-lg border border-gray-200
                      flex gap-3 lg:gap-4 relative z-10
                      ${
                        isReverse
                          ? "-translate-y-0"
                          : "translate-y-[-30px] lg:translate-y-[-56px]"
                      }`}
                  >
                    {/* LOGO */}
                    <img
                      src={item?.universityLogo}
                      alt="Logo"
                      className="w-10 h-10 lg:w-40 lg:h-18 object-contain mt-2 lg:mt-6 flex-shrink-0"
                    />

                    {/* TEXT */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm lg:text-xl font-bold text-[hsl(0,70%,35%)] lg:line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="text-xs lg:text-base text-[hsl(0,70%,35%)] line-clamp-2 lg:line-clamp-4 text-left">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
