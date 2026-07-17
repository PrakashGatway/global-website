"use client"

import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

// Dummy logo data
const dummyLogos = [
  { src: "/anime/p1.svg", alt: "Abertay University" },
  { src: "/anime/p2.svg", alt: "University of Aberdeen" },
  { src: "/anime/p3.svg", alt: "Aston University" },
  { src: "/anime/p4.svg", alt: "University of Bath" },
  { src: "/anime/p5.svg", alt: "University of Birmingham" },
  { src: "/anime/p6.svg", alt: "University of Bristol" },
  { src: "/anime/p7.svg", alt: "University of Cambridge" },
  { src: "/anime/p8.svg", alt: "University of Edinburgh" },
  { src: "/anime/p9.svg", alt: "Imperial College London" },
  { src: "/anime/p10.svg", alt: "University of Leeds" },
  { src: "/anime/p11.svg", alt: "University of Manchester" },
  { src: "/anime/p12.svg", alt: "Newcastle University" },
  { src: "/anime/p13.svg", alt: "University of Nottingham" },
  { src: "/anime/p14.svg", alt: "University of Oxford" },
  { src: "/anime/p15.svg", alt: "University of Sheffield" },
  { src: "/anime/p16.svg", alt: "University College London (UCL)" },
  { src: "/anime/p17.svg", alt: "King's College London" },
  { src: "/anime/p18.svg", alt: "University of Glasgow" },
  { src: "/anime/p19.svg", alt: "University of Southampton" },
  { src: "/anime/p20.svg", alt: "University of Warwick" },
  { src: "/anime/p21.svg", alt: "University of York" },
  { src: "/anime/p22.svg", alt: "Queen Mary University of London" },
  { src: "/anime/p23.svg", alt: "University of London" }
];

interface Logo {
  src: string
  alt: string
}

interface SliderRowProps {
  logos: Logo[]
  direction: "left" | "right"
  speed: number // in seconds
}

const SliderRow: React.FC<SliderRowProps> = ({ logos, direction, speed }) => {
  const logoWidth = 110 // px
  const logoHeight = 40 // px
  const gap = 12 // px, for gap-x-8

  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos]

  const originalSetWidth = logos.length * logoWidth + (logos.length - 1) * gap

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true, // Keen-slider's loop, though framer-motion handles the continuous animation
    renderMode: "performance",
    drag: false, // Disable keen-slider's drag as we want continuous animation
    slides: {
      perView: "auto",
      spacing: gap,
    },
  })

  return (
    <div className="relative overflow-hidden py-4">
      <div ref={sliderRef} className="keen-slider">
        <motion.div
          className="keen-slider__track flex flex-nowrap w-max gap-x-8"
          animate={{
            x: direction === "right" ? [`-${originalSetWidth}px`, "0px"] : ["0px", `-${originalSetWidth}px`],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: speed,
              ease: "linear",
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
            >
              <Image
                src={logo.src || "/placeholder.svg"}
                alt={logo.alt}
                width={logoWidth}
                height={logoHeight}
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
      <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-gray-100 to-transparent backdrop-blur-[1px] pointer-events-none z-4" />
      <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-gray-100 to-transparent backdrop-blur-[1px] pointer-events-none z-4" />
    </div>
  )
}

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#FAFBFF] py-12">
      <div className="w-full px-4">
        <div className="text-center mb-16">
          <h2 className="heading text-center d-block mb-2 text-2xl font-bold">
            Our Partner Universities
          </h2>
        </div>
        <div className="space-y-2">
          <SliderRow logos={dummyLogos.slice(0, 10)} direction="right" speed={30} />
         
        </div>
      </div>
    </div>
  )
}


export function SingleSlider() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#FAFBFF] py-2">
      <div className="w-full px-2">
        
        <div className="space-y-2">
          <SliderRow logos={dummyLogos.slice(0, 20)} direction="right" speed={30} />
        </div>
      </div>
    </div>
  )
}