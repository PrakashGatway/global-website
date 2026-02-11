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
            slides: { perView: 3, spacing: 32 },
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
  className="py-12 sm:py-14 lg:py-16 bg-[#f46c44]"
  style={{ overflow: "visible" , fontFamily: font ? "'Poppins', sans-serif" : "inherit" }}
>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-visible">

  {/* ================= TITLE ================= */}
  <div className="mb-5 flex items-center relative">

    <h3 className="text-5xl lg:text-6xl text-white relative inline-block">
      <span>{title?.split("||")[0]} {"  "}</span>
      <span className="text-5xl lg:text-6xl font-bold text-white mt-4 relative">
      {title?.split("||")[1]}
      <span className="absolute right-0 -bottom-2 w-32 h-1 bg-yellow-400"></span>

    </span>
    </h3>
    <br />

    

    

  </div>
   <p className="text-primary text-sm sm:text-base font-medium max-w-3xl text-justify leading-relaxed">
      {subtitle}
    </p>
     

   

    {/* SLIDER */}
    <div ref={sliderRef} className="keen-slider">
          {items.map((testimonial) => (
            <div key={testimonial.id} className="keen-slider__slide">
              <div className="flex items-start justify-start h-full mt-6 py-1">
                <div className="relative lg:w-[340px] w-[380px] h-[350px] ">
                  <div style={{ backgroundImage: "url('/shapes/testi.png')" }} className="absolute left-1 top-1 right-1 w-full h-[97%] bg-contain bg-center bg-no-repeat" />
                  <div className="absolute top-3 left-0 w-full flex flex-col gap-2 h-full py-12 pl-8 pr-2 ">
                    <div className="grid grid-cols-20 gap-4">
                      <div className="col-span-11 ">
                        <h3 className="text-[15px] text-left font-bold text-red-700 mb-3">
                          {testimonial.name}
                        </h3>
                        <p className="lg:text-xs font-semibold text-justify text-sm text-blue-700 line-clamp-7">
                          {testimonial.message}
                        </p>
                      </div>

                      <div style={{ perspective: '500px' }} className="col-span-8" >
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
                          }} src={testimonial.image} alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <img src={testimonial.universityLogo} className="h-full w-25 object-contain" alt="" />
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