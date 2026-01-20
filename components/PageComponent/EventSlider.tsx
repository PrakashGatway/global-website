'use client';

import { useKeenSlider } from 'keen-slider/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    '/images/events-banner.png',
    '/images/events-banner.png',
    '/images/events-banner.png',
];

export default function EventsSlider() {
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        renderMode: 'performance',
        slides: {
            perView: 1,
        },
    });

    return (
        <div className="w-full mx-auto px-50 absolute z-5">
            <div className="relative overflow-hidden -top-65">
                <div ref={sliderRef} className="keen-slider">
                    {slides.map((src, index) => (
                        <motion.div
                            key={index}
                            className="keen-slider__slide"
                            initial={{ opacity: 0.6, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <Image
                                src={src}
                                alt={`Event ${index + 1}`}
                                width={1920}
                                height={700}
                                className="w-full h-auto object-contain"
                                priority={index === 0}
                            />
                        </motion.div>
                    ))}
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => slider.current?.prev()}
                    className="absolute left-[40px] top-[50%] shadow-xl border-2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center z-10"
                >
                    <ChevronLeft size={24} className="text-gray-800" />
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => slider.current?.next()}
                    className="absolute right-[40px] top-[50%] shadow-xl border-2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center z-10"
                >
                    <ChevronRight size={24} className="text-gray-800" />
                </motion.button>

            </div>
        </div>
    );
}
