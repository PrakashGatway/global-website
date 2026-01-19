'use client';

import { useEffect, useRef } from 'react';
import 'keen-slider/keen-slider.min.css';

export default function StatisticsSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keenSlider = async () => {
      const KeenSlider = (await import('keen-slider')).default;
      
      if (sliderRef.current) {
        const slider = new KeenSlider(
          sliderRef.current,
          {
            loop: true,
            mode: 'free-snap',
            slides: {
              origin: 'center',
              perView: 2,
              spacing: 15,
            },
            breakpoints: {
              '(min-width: 640px)': {
                slides: {
                  perView: 3,
                  spacing: 15,
                },
              },
              '(min-width: 768px)': {
                slides: {
                  perView: 4,
                  spacing: 15,
                },
              },
              '(min-width: 1024px)': {
                slides: {
                  perView: 4,
                  spacing: 15,
                },
              },
            },
          },
          [
            (slider) => {
              let timeout: ReturnType<typeof setTimeout>;
              let mouseOver = false;
              function clearNextTimeout() {
                clearTimeout(timeout);
              }
              function nextTimeout() {
                clearTimeout(timeout);
                if (mouseOver) return;
                timeout = setTimeout(() => {
                  slider.next();
                }, 3000);
              }
              slider.on("created", () => {
                slider.container.addEventListener("mouseover", () => {
                  mouseOver = true;
                  clearNextTimeout();
                });
                slider.container.addEventListener("mouseout", () => {
                  mouseOver = false;
                  nextTimeout();
                });
                nextTimeout();
              });
              slider.on("dragStarted", clearNextTimeout);
              slider.on("animationEnded", nextTimeout);
              slider.on("updated", nextTimeout);
            },
          ]
        );

        return () => {
          slider.destroy();
        };
      }
    };

    keenSlider();
  }, []);

  const statistics = [
    { num: '244', text: 'Offers to Cornell' },
    { num: '109', text: 'Offers to Princeton' },
    { num: '187', text: 'Offers to Stanford' },
    { num: '130', text: 'Offers to Yale' },
    { num: '139', text: 'Offers to Columbia' },
    { num: '24', text: 'Offers to Oxford' },
    { num: '365', text: 'Offers to UC Berkeley' },
    { num: '338', text: 'Offers to UPenn' }
  ];

  return (
    <div className="overflow-hidden py-4">
      <div ref={sliderRef} className="keen-slider">
        {statistics.map((stat, i) => (
          <div key={i} className="keen-slider__slide" style={{ minWidth: '160px', maxWidth: '180px' }}>
            <div className="text-center border-2 rounded-lg p-4 bg-white h-full" style={{ borderColor: '#f46c44', borderWidth: '2px', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#f46c44', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
                {stat.num}
              </div>
              <p className="text-xs md:text-sm text-gray-700 font-medium leading-tight">{stat.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
