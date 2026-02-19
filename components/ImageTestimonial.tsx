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
  const AUTO_SLIDE_INTERVAL = 1000;
  useEffect(() => {
    if (!sliderRef.current || items.length === 0) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;
    let mouseOver = false;
    let slider: any;

  

    const initSlider = async () => {
  const KeenSlider = (await import("keen-slider")).default;

  // MARQUEE PLUGIN
  const marquee = (slider: any) => {
  let raf: number;

  const speed = 0.0008; // ⭐ MAIN SPEED (VERY SMALL)

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


  slider = new KeenSlider(
    sliderRef.current!,
    {
      loop: true,
      renderMode: "performance",
      drag: false, // keeps smooth marquee feel
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 1.5, spacing: 24 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 4, spacing: 0 },
        },
      },
    },
    [marquee]
  );
};



    initSlider();

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
     
      slider?.destroy();
    };
  }, [items]);





  return (
    <section className="w-full py-16 px-8 bg-background">
      <div className="mx-auto">
        {/* Heading */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-xl lg:text-5xl mb-2">
            <span className="text-red-700">
              {title?.split('||')[0]?.trim() || "Image"}
            </span>{" "} <br />
            <span className="text-primary font-bold relative">
              {title?.split('||')[1]?.trim() || "Testimonials"}
              <span className="absolute right-0 bottom-0 w-25 h-[2px] lg:h-1 bg-red-700"></span>
            </span>
          </h2>
        </div>

        {/* Desktop bento grid (≥1024px) */}
        <div className=" keen-slider  py-10" ref={sliderRef} >
          {items.map((item, index) => {
            const isReverse = index % 2 !== 0;
            return (
              <div key={index} className={`keen-slider__slide p-2 py-16`}>
                <div
                  className={`flex flex-col ${isReverse &&"flex-col-reverse"} relative`}
                >
                  <div className={`absolute bg-orange-500 rounded-4xl ${isReverse ? "w-50 -z-1 -bottom-[5px] h-[200px] -right-[5px]" : "h-50 -top-[54px] -left-[5px] -z-1 w-50"}`}></div>
                  {/* IMAGE */}
                  <div className=" h-[300px] -mt-12">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover object-center rounded-4xl"
                    />
                  </div>

                  {/* CARD */}
                  <div className={`bg-white rounded-4xl py-6 shadow-lg border border-gray-500 flex gap-4 relative z-10 transform ${isReverse ? "-translate-y-0" : "translate-y-[-56px]"}`}>
                    <img
                      src='https://logos-world.net/wp-content/uploads/2021/01/Harvard-Emblem.png'
                      className="w-40 h-18 object-contain mt-12"
                    />

                    <div>
                      <h3 className="text-xl font-bold text-[hsl(0,70%,35%)]">
                        {item.name}
                      </h3>

                      <p className="text-base text-[hsl(0,70%,35%)]">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tablet grid (768px–1023px) */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
          {items.map((t, i) => (
            <div key={t.name} className="flex flex-col gap-4">
              {i % 2 === 0 ? (
                <>
                  <div className="rounded-2xl overflow-hidden border-2 border-[hsl(15,80%,50%)] aspect-[3/4]">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-card rounded-2xl p-5 shadow-md border border-border">
                    <h3 className="text-sm font-bold text-[hsl(0,70%,35%)] mb-2">{t.name}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{t.text}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-card rounded-2xl p-5 shadow-md border border-border">
                    <h3 className="text-sm font-bold text-[hsl(0,70%,35%)] mb-2">{t.name}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{t.text}</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden border-2 border-[hsl(15,80%,50%)] aspect-[3/4]">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Mobile (<768px) */}
        <div className="flex flex-col gap-6 md:hidden">
          {items.map((t) => (
            <div key={t.name} className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden border-2 border-[hsl(15,80%,50%)] aspect-[4/5]">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-card rounded-2xl p-5 shadow-md border border-border">
                <h3 className="text-sm font-bold text-[hsl(0,70%,35%)] mb-2">{t.name}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
}