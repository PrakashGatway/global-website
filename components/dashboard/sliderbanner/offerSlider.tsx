"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Tag, Calendar, Copy, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";

interface Offer {
  _id: string;
  code: string;
  title: string;
  description: string;
  couponData: {
    discountType: "percentage" | "fixed";
    discountValue: number;
    minPurchaseAmount: number;
    maxDiscountAmount?: number;
    applicableTo: string;
    applicableToModel?: string;
    applicableItems?: any[];
    isUserSpecific?: boolean;
    users?: any[];
  };
  validTo: string;
}

interface OfferSliderProps {
  offers?: Offer[];
}

// Gradient pairs for backgrounds
const gradientPairs = [
  ["#F26D44", "#cd6035"], // Orange gradient
  ["#FF6B6B", "#FF8E8E"], // Red gradient
  ["#545b5b", "#50a8a4"], // Teal gradient
  ["#747776", "#C0F0DF"], // Mint gradient
  ["#FFD93D", "#FFE569"], // Yellow gradient
  ["#6C5CE7", "#8A7CFF"], // Purple gradient
  ["#FF8A5C", "#FFB08C"], // Peach gradient
  ["#FF6B8B", "#FF99B4"], // Pink gradient
  ["#95E1D3", "#B8F2E6"], // Light teal gradient
  ["#F8C291", "#FAD4B0"], // Light orange gradient
];

// Function to generate random gradient
const getRandomGradient = (seed: string) => {
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradientPairs.length;
  const colors = gradientPairs[index];
  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
};

// Function to format discount
const formatDiscount = (offer: Offer) => {
  const { discountType, discountValue } = offer.couponData;
  if (discountType === "percentage") {
    return `${discountValue}% OFF`;
  } else {
    return `₹${discountValue} OFF`;
  }
};

// Function to get applicable text
const getApplicableText = (offer: Offer) => {
  const { applicableTo, applicableToModel, minPurchaseAmount } = offer.couponData;
  
  let text = "";
  if (applicableTo === "all") {
    text = "All items";
  } else if (applicableToModel) {
    text = `On ${applicableToModel}s`;
  } else {
    text = applicableTo;
  }
  
  if (minPurchaseAmount > 0) {
    text += ` • Min. ₹${minPurchaseAmount}`;
  }
  
  return text;
};

export default function OfferSlider({ offers = [] }: OfferSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (offers.length === 0) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  if (!offers || offers.length === 0) {
    return null;
  }

  const slide = offers[current];

  const goPrev = () => {
    setDirection(-1);
    setCurrent((current - 1 + offers.length) % offers.length);
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((current + 1) % offers.length);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative rounded-3xl overflow-hidden h-70 animate-fade-up">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide._id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            background: getRandomGradient(slide._id),
          }}
        >
          {/* Pattern overlay for texture */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`pattern-${slide._id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pattern-${slide._id})`} />
            </svg>
          </div>
          
          {/* Diagonal lines overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`lines-${slide._id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="20" x2="20" y2="0" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#lines-${slide._id})`} />
            </svg>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-center p-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="space-y-2"
          >
            {/* Offer Tag */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                Limited Time Offer
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-1">
                {slide.title}
              </h2>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-black">
                  {formatDiscount(slide)}
                </span>
                <span className="text-sm opacity-90">
                  {slide.description}
                </span>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="flex items-center gap-1">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border-2 border-white/30">
                <span className="text-base font-bold text-sm tracking-wider">
                  {slide.code}
                </span>
              </div>
              <button
                onClick={() => handleCopyCode(slide.code)}
                className="px-2 py-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors border-2 border-white/30"
              >
                {copiedCode === slide.code ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Offer Details */}
            <div className="space-y-2 text-xs opacity-90">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Valid till:</span>
                {format(new Date(slide.validTo), "dd MMM yyyy")}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {/* {offers.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors hidden md:block z-20 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors hidden md:block z-20 backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )} */}

      {/* Slide Indicators */}
      {/* {offers.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === current 
                  ? "w-6 bg-white" 
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}