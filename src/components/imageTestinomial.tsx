"use client";

import { useEffect, useRef } from "react";

export default function TestimonialSlider() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cardWidth = 520; // card width + gap
    const interval = setInterval(() => {
      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - cardWidth
      ) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
   <div className="flex flex-wrap justify-center" ref={sliderRef}>
  <div style={{ perspective: "900px" }}>
    <div className="relative w-[480px] h-[360px] bg-white p-[28px]">

      {/* SVG DEFINITIONS */}
      <svg width="0" height="0" viewBox="0 0 300 200">
        <defs>
          <clipPath id="testimonialShape">
            <path
              d="
                M 50 8
                Q 20 8 15 35
                L 15 165
                Q 15 192 42 196
                L 250 184
                Q 285 184 290 155
                L 290 45
                Q 290 20 265 20
                L 50 8
                Z
              "
            />
          </clipPath>
        </defs>
      </svg>

      {/* CONTENT */}
      <div className="flex gap-6 h-full">
        {/* LEFT TEXT */}
        <div className="flex-1 ml-10 mt-6">
          <h3 className="text-lg font-bold text-gray-600 mb-3">
            Aditya Sharma
          </h3>

          <p className="text-sm text-black leading-6 mb-6 w-[210px]">
            One of our proud alumni, has successfully completed his Bachelor's
            degree in Germany
          </p>

          <div className="mt-auto text-black">
            <h2 className="text-3xl font-bold">Harvard</h2>
            <span className="text-sm tracking-wide">University</span>
          </div>
        </div>

        {/* RIGHT IMAGE (VISIBLE NOW) */}
        <div className="w-[150px] h-[150px]">
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{
              transform: "rotateY(-179deg)", // 👈 minus rotation
              transformOrigin: "center",
              transformStyle: "preserve-3d",
            }}
          >
            <image
              href="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600"
              width="300"
              height="200"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#testimonialShape)"
            />
          </svg>
        </div>
      </div>

      {/* OUTER BORDER */}
      <svg
        viewBox="0 0 300 200"
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: "rotateY(12deg)",
          transformOrigin: "right center",
          transformStyle: "preserve-3d",
        }}
      >
        <path
          d="
            M 50 8
            Q 20 8 15 35
            L 15 165
            Q 15 192 42 196
            L 250 184
            Q 285 184 290 155
            L 290 45
            Q 290 20 265 20
            L 50 8
            Z
          "
          fill="none"
          stroke="#f46c44"
          strokeWidth="3"
        />
      </svg>

    </div>
  </div>



   <div style={{ perspective: "900px" }}>
    <div className="relative w-[480px] h-[360px] bg-white p-[28px]">

      {/* SVG DEFINITIONS */}
      <svg width="0" height="0" viewBox="0 0 300 200">
        <defs>
          <clipPath id="testimonialShape">
            <path
              d="
                M 50 8
                Q 20 8 15 35
                L 15 165
                Q 15 192 42 196
                L 250 184
                Q 285 184 290 155
                L 290 45
                Q 290 20 265 20
                L 50 8
                Z
              "
            />
          </clipPath>
        </defs>
      </svg>

      {/* CONTENT */}
      <div className="flex gap-6 h-full">
        {/* LEFT TEXT */}
        <div className="flex-1 ml-10 mt-6">
          <h3 className="text-lg font-bold text-gray-600 mb-3">
            Aditya Sharma
          </h3>

          <p className="text-sm text-black leading-6 mb-6 w-[210px]">
            One of our proud alumni, has successfully completed his Bachelor's
            degree in Germany
          </p>

          <div className="mt-auto text-black">
            <h2 className="text-3xl font-bold">Harvard</h2>
            <span className="text-sm tracking-wide">University</span>
          </div>
        </div>

        {/* RIGHT IMAGE (VISIBLE NOW) */}
        <div className="w-[150px] h-[150px]">
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{
              transform: "rotateY(-179deg)", // 👈 minus rotation
              transformOrigin: "center",
              transformStyle: "preserve-3d",
            }}
          >
            <image
              href="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600"
              width="300"
              height="200"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#testimonialShape)"
            />
          </svg>
        </div>
      </div>

      {/* OUTER BORDER */}
      <svg
        viewBox="0 0 300 200"
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: "rotateY(12deg)",
          transformOrigin: "right center",
          transformStyle: "preserve-3d",
        }}
      >
        <path
          d="
            M 50 8
            Q 20 8 15 35
            L 15 165
            Q 15 192 42 196
            L 250 184
            Q 285 184 290 155
            L 290 45
            Q 290 20 265 20
            L 50 8
            Z
          "
          fill="none"
          stroke="#f46c44"
          strokeWidth="3"
        />
      </svg>

    </div>
  </div>
   <div style={{ perspective: "900px" }}>
    <div className="relative w-[480px] h-[360px] bg-white p-[28px]">

      {/* SVG DEFINITIONS */}
      <svg width="0" height="0" viewBox="0 0 300 200">
        <defs>
          <clipPath id="testimonialShape">
            <path
              d="
                M 50 8
                Q 20 8 15 35
                L 15 165
                Q 15 192 42 196
                L 250 184
                Q 285 184 290 155
                L 290 45
                Q 290 20 265 20
                L 50 8
                Z
              "
            />
          </clipPath>
        </defs>
      </svg>

      {/* CONTENT */}
      <div className="flex gap-6 h-full">
        {/* LEFT TEXT */}
        <div className="flex-1 ml-10 mt-6">
          <h3 className="text-lg font-bold text-gray-600 mb-3">
            Aditya Sharma
          </h3>

          <p className="text-sm text-black leading-6 mb-6 w-[210px]">
            One of our proud alumni, has successfully completed his Bachelor's
            degree in Germany
          </p>

          <div className="mt-auto text-black">
            <h2 className="text-3xl font-bold">Harvard</h2>
            <span className="text-sm tracking-wide">University</span>
          </div>
        </div>

        {/* RIGHT IMAGE (VISIBLE NOW) */}
        <div className="w-[150px] h-[150px]">
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{
              transform: "rotateY(-179deg)", // 👈 minus rotation
              transformOrigin: "center",
              transformStyle: "preserve-3d",
            }}
          >
            <image
              href="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600"
              width="300"
              height="200"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#testimonialShape)"
            />
          </svg>
        </div>
      </div>

      {/* OUTER BORDER */}
      <svg
        viewBox="0 0 300 200"
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: "rotateY(12deg)",
          transformOrigin: "right center",
          transformStyle: "preserve-3d",
        }}
      >
        <path
          d="
            M 50 8
            Q 20 8 15 35
            L 15 165
            Q 15 192 42 196
            L 250 184
            Q 285 184 290 155
            L 290 45
            Q 290 20 265 20
            L 50 8
            Z
          "
          fill="none"
          stroke="#f46c44"
          strokeWidth="3"
        />
      </svg>

    </div>
  </div>
</div>
  );
}


