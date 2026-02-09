"use client";

import axiosInstance from "@/app/axiosInstance";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default  function CaseStudy({ font , caseStudydata , caseStudy  }) {
    const sliderRef = useRef<HTMLDivElement>(null);


    const AUTO_SLIDE_INTERVAL = 3000;

    useEffect(() => {
        const keenSlider = async () => {
            const KeenSlider = (await import('keen-slider')).default;

            if (sliderRef.current) {
                let timeout: ReturnType<typeof setTimeout> | null = null;
                let mouseOver = false;

                const slider = new KeenSlider(
                    sliderRef.current,
                    {
                        loop: true,
                        mode: 'free-snap',
                        slides: {
                            origin: 'center',
                            perView: 1,
                            spacing: 6,
                        },
                        breakpoints: {
                            '(min-width: 640px)': {
                                slides: {
                                    perView: 2,
                                    spacing: 6,
                                },
                            },
                            '(min-width: 1024px)': {
                                slides: {
                                    perView: 3,
                                    spacing: 0,
                                },
                            },
                        },
                    },
                    [
                        (slider) => {
                            function clearNextTimeout() {
                                if (timeout) {
                                    clearTimeout(timeout);
                                    timeout = null;
                                }
                            }

                            function nextTimeout() {
                                clearNextTimeout();
                                if (mouseOver) return;

                                timeout = setTimeout(() => {
                                    slider.next();
                                    nextTimeout(); // Continue auto-sliding after each slide
                                }, AUTO_SLIDE_INTERVAL);
                            }

                            slider.on("created", () => {
                                nextTimeout(); // Start auto-sliding

                                slider.container.addEventListener("mouseover", () => {
                                    mouseOver = true;
                                    clearNextTimeout();
                                });

                                slider.container.addEventListener("mouseout", () => {
                                    mouseOver = false;
                                    nextTimeout();
                                });
                            });

                            slider.on("dragStarted", clearNextTimeout);

                            slider.on("animationEnded", () => {
                                nextTimeout(); // Continue after animation ends
                            });

                            slider.on("updated", () => {
                                if (!mouseOver) {
                                    nextTimeout();
                                }
                            });
                        },
                    ]
                );

                return () => {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    slider.destroy();
                };
            }
        };

        keenSlider();
    }, []);

    const testimonials = caseStudy



    




    

    return (
        <section className="py-16 " style={{ backgroundColor: '#fff9f4' }}>
            <div className="max-w-7xl mx-auto" >
                <h2 style={{ fontFamily: font && "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", transformStyle: 'flat', transformOrigin: 'initial' }} className="text-[2.6rem] font-semibold text-center mb-0">
                    <span style={{ color: '#f46c44' }}>{caseStudydata?.title.split('||')[0].trim()}</span>{" "}
                    <span className="text-gray-600">{caseStudydata?.title.split('||')[1].trim()}</span>
                </h2>
                <p className="max-w-4xl font-semibold mx-auto mt-2 text-lg text-[#656565] lg:text-center px-5">{caseStudydata?.subtitle}</p>

                <div ref={sliderRef} className="keen-slider">
                    {testimonials.map((testimonial) => (
                        <Link href={`/post/${testimonial?.target}`} >
                         <div key={testimonial?._id} className="keen-slider__slide flex justify-center">

                            <svg width="0" height="0" aria-hidden>
                                <defs>
                                    <clipPath
                                        id="testimonial-outer-shape"
                                        clipPathUnits="objectBoundingBox"
                                    >
                                        <path 
                                            d="
          M0.27 0.21
          Q0.15 0.23 0.16 0.33
          L0.17 0.71
          Q0.17 0.84 0.26 0.86
          L0.87 0.99
          Q1.00 1.00 1.00 0.87
          L0.99 0.29
          Q1.00 0.09 0.84 0.12
          L0.32 0.20
          Z
        "
                                        />
                                    </clipPath>
                                </defs>
                            </svg>


                            {/* OUTER SHAPE */}
                            <div
                                style={{
                                    clipPath: "url(#testimonial-outer-shape)",
                                    WebkitClipPath: "url(#testimonial-outer-shape)",
                                    filter: "drop-shadow(0 12px 18px rgba(0, 0, 0, 0.33))",
                                }}
                                className="relative w-full h-95 mr-10"
                            >
                                {/* 🔥 BACKGROUND COLOR */}
                                <div className="absolute inset-0 left bg-[#f67b59]" />

                                {/* CONTENT */}
                               <div
  className="
    relative z-10 w-full h-full
    translate-x-6 translate-y-6
    sm:translate-x-8 sm:translate-y-8
    lg:translate-x-12 lg:translate-y-12
    py-8 px-6
    sm:py-12 sm:px-8
    lg:py-16 lg:px-12
    flex flex-col
  "
>
  <div className="h-full">
    <div>
      <p className="text-sm sm:text-base font-semibold text-gray-50 leading-relaxed">
        {testimonial.name}
      </p>
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-3 lg:mt-0 px-5 md:px-5 lg:px-0">
      <img
        className="
          rounded-xl
          h-20 w-24
          sm:h-24 sm:w-32
          object-cover
          flex-shrink-0
        "
        src={
          testimonial.image ||
          "https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
        }
        alt=""
      />

      <p className="text-xs sm:text-sm font-medium text-gray-50 leading-snug">
        {testimonial.message}
      </p>
    </div>
  </div>
</div>

                            </div>
                        </div></Link>
                       
                    ))}

                </div>
            </div>
        </section>
    );
}
