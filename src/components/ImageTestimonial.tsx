"use client";

import { useEffect, useRef } from "react";
import 'keen-slider/keen-slider.min.css';

export default function ImageTestimonial() {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Speed settings - यहाँ speed adjust करें
  const AUTO_SLIDE_INTERVAL = 3000; // Auto-slide interval (milliseconds) - कम करने से तेज होगा
  // उदाहरण: 2000 = 2 seconds (तेज), 4000 = 4 seconds (धीमा)

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
              spacing: 20,
            },
            breakpoints: {
              '(min-width: 640px)': {
                slides: {
                  perView: 1.5,
                  spacing: 24,
                },
              },
              '(min-width: 1024px)': {
                slides: {
                  perView: 3,
                  spacing: 32,
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

  // Path data as a single line to avoid hydration mismatch
  const pathData = "M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z";

  const testimonials = [
    {
      id: 1,
      name: "Aditya Sharma",
      text: "One of our proud alumni, has successfully completed his Bachelor's degree in Germany",
      university: "Harvard",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600"
    },
    {
      id: 2,
      name: "Rohan Gupta",
      text: "One of our proud alumni, has successfully completed his Bachelor's degree in Germany",
      university: "Harvard",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600"
    },
    {
      id: 3,
      name: "Saumya Sharma",
      text: "One of our proud alumni, has successfully completed his Bachelor's degree in Germany",
      university: "Harvard",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600"
    }
  ];

  return (
    <section className="py-10" style={{ backgroundColor: '#FCEEEB', overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ overflow: 'visible' }}>
        <h2 className="text-4xl font-bold text-center mb-0">
          <span style={{ color: '#f46c44' }}>Image</span>{" "}
          <span className="text-gray-600">Testimonials</span>
        </h2>
        
        <div ref={sliderRef} className="keen-slider" style={{ padding: '10px 0' }}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="keen-slider__slide">
              <div style={{ perspective: "900px" }} className="flex items-center justify-center h-full p-4">
                <div className="relative w-[410px] h-[360px] bg-transparent p-[28px]" style={{ overflow: 'visible' }}>
                {/* SVG DEFINITIONS */}
                <svg width="0" height="0" viewBox="0 0 300 200">
                  <defs>
                    <clipPath id={`testimonialShape-${testimonial.id}`}>
                      <path d={pathData} />
                    </clipPath>
                  </defs>
                </svg>

                {/* CONTENT */}
                <div className="flex gap-6 h-full">
                  {/* LEFT TEXT */}
                  <div className="flex-1 ml-10 mt-12">
                    <h3 className="text-lg font-bold text-gray-600 mb-3">
                      {testimonial.name}
                    </h3>

                    <p className="text-sm text-black leading-6 mb-6 w-[210px]">
                      {testimonial.text}
                    </p>

                    <div className="mt-auto text-black">
                      <h2 className="text-3xl font-bold">{testimonial.university}</h2>
                      <span className="text-sm tracking-wide">University</span>
                    </div>
                  </div>

                  {/* RIGHT IMAGE */}
                  <div className="w-[280px] h-[350px] -mt-12">
                    <svg
                      viewBox="0 0 300 200"
                      width="100%"
                      height="100%"
                      style={{
                        transform: "rotateY(-179deg)",
                        transformOrigin: "center",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <image
                        href={testimonial.image}
                        width="300"
                        height="200"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={`url(#testimonialShape-${testimonial.id})`}
                      />
                    </svg>
                  </div>
                </div>

                {/* OUTER BORDER */}
                <svg
                  viewBox="0 0 300 200"
                  className="absolute pointer-events-none"
                  style={{
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                    overflow: 'visible'
                  }}
                >
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#f46c44"
                    strokeWidth="1.5"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                  />
                </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
