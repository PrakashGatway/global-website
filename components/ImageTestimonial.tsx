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
  subtitle ,
  items = [],
  font,
  bg,
}: ImageTestimonialProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const AUTO_SLIDE_INTERVAL = 3000;
useEffect(() => {
  if (!sliderRef.current || items.length === 0) return;

  let timeout: ReturnType<typeof setTimeout> | null = null;
  let mouseOver = false;
  let slider: any;

  const clearNextTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const nextTimeout = () => {
    clearNextTimeout();
    if (mouseOver) return;

    timeout = setTimeout(() => {
      slider?.next();
      nextTimeout();
    }, AUTO_SLIDE_INTERVAL); // 👈 speed fully controlled here
  };

  const initSlider = async () => {
    const KeenSlider = (await import("keen-slider")).default;

    slider = new KeenSlider(
      sliderRef.current!,
      {
        loop: true,
        mode: "free-snap",
        slides: {
          origin: "center",
          perView: 1,
          spacing: 16,
        },
        breakpoints: {
          "(min-width: 640px)": {
            slides: { perView: 1.5, spacing: 24 },
          },
          "(min-width: 1024px)": {
            slides: { perView: 3.2, spacing: 32 },
          },
        },
      },
      [
        (s) => {
          s.on("created", () => {
            nextTimeout();

            s.container.addEventListener("mouseenter", () => {
              mouseOver = true;
              clearNextTimeout();
            });

            s.container.addEventListener("mouseleave", () => {
              mouseOver = false;
              nextTimeout();
            });
          });

          s.on("dragStarted", clearNextTimeout);
          s.on("animationEnded", nextTimeout);
          s.on("updated", nextTimeout);
        },
      ]
    );
  };

  initSlider();

  // ✅ CLEANUP (VERY IMPORTANT)
  return () => {
    clearNextTimeout();
    slider?.destroy();
  };
}, [items]);

 



  return (
   <section
  className="py-12 sm:py-14 lg:py-16"
  style={{ backgroundColor: !bg && "#f5f1f0", overflow: "visible" }}
>
  <div
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-visible"
  >
    <h2 className="text-[2rem] sm:text-[2.2rem] lg:text-[2.6rem] font-bold">

     <span className="text-[#656565]" >{title?.split("||")[0] }</span> 
     <span className="text-orange-500">{title?.split("||")[1] }</span> 

    </h2>

    <p className="text-gray-600 text-sm sm:text-base font-medium max-w-3xl mx-auto leading-relaxed">
      {subtitle}
    </p>

    {/* SLIDER */}
    <div ref={sliderRef} className="keen-slider">
          {items.map((testimonial) => (
            <div key={testimonial.id} className="keen-slider__slide">
              <div className="flex items-center justify-center h-full mt-6 py-1">
                <div className="relative lg:w-[340px] w-[380px] h-[350px] ">
                  <div style={{ backgroundImage: "url('/shapes/testi.png')" }} className="absolute left-1 top-1 right-1 w-full h-[97%] bg-contain bg-center bg-no-repeat" />
                  <div className="absolute top-3 left-0 w-full flex flex-col gap-2 h-full py-12 pl-8 pr-2 ">
                    <div className="grid grid-cols-20">
                      <div className="col-span-11">
                        <h3 className="text-lg font-bold text-gray-600 mb-3">
                          {testimonial.name}
                        </h3>
                        <p className="lg:text-base text-[11px] text-gray-700 ">
                          {testimonial.text}
                        </p>
                      </div>

                      <div style={{ perspective: '500px' }} className="col-span-9" >
                        <div className="border border-gray-400 rounded-2xl overflow-hidden" style={{
                          transform: `
          rotateY(-20deg)
          rotateX(10deg)
          rotateZ(2deg)
          skewX(5deg)
          skewY(5deg)
        `,
                        }}>
                          <img className="scale-112 object-cover h-28 w-full" style={{
                            transform: `
          rotateY(0deg)
          rotateX(-10deg)
          rotateZ(-2deg)
          skewX(0deg)
        `,
                          }} src="https://t3.ftcdn.net/jpg/06/50/56/80/360_F_650568058_q6KruAvlT4w7RahAGwIwgIY8ZjIkGAYg.jpg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <img src="https://www.gatewayabroadeducations.com/anime/p17.svg" className="h-full w-30 object-contain" alt="" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
  </div>
</section>

  );
}