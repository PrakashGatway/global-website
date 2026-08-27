'use client';

import { useKeenSlider } from 'keen-slider/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import 'keen-slider/keen-slider.min.css';

const slides = [
    {
        image: '/images/events-banner.png',
        title: 'Overseas Education Fair 2026',
        subtitle: 'Meet 175+ Universities from 18 Countries'
    },
    {
        image: '/images/events-banner.png',
        title: 'Study Abroad Summit',
        subtitle: 'Your Gateway to Global Education'
    },
    {
        image: '/images/events-banner.png',
        title: 'International Education Expo',
        subtitle: 'Shape Your Future with Global Opportunities'
    },
];

export default function EventsSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        initial: 0,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
        breakpoints: {
            '(min-width: 768px)': {
                slides: { perView: 1, spacing: 0 },
            },
        },
    });

    return (
        <div className="relative w-full max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
                <div ref={sliderRef} className="keen-slider">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="keen-slider__slide relative min-w-full"
                        >
                            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px]">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={() => slider.current?.prev()}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110 z-10"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                </button>
                <button
                    onClick={() => slider.current?.next()}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110 z-10"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                </button>

                {/* Dots Indicator */}
                {loaded && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => slider.current?.moveToIdx(index)}
                                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                                    currentSlide === index
                                        ? 'bg-white w-6 md:w-8'
                                        : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}