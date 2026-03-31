"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause, Star } from 'lucide-react'

const StudentVisaStories = ({ 
  title,
  subtitle,
  stories,
  autoSlideInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(3)
  const timerRef = useRef(null)

  // Calculate slides per view based on screen size
  const getSlidesPerView = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }
    return 3
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView())
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getSlidesPerView])

  const totalSlides = Math.ceil(stories.length / slidesPerView)
  const maxIndex = totalSlides - 1

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || stories.length <= slidesPerView) return
    
    timerRef.current = setInterval(() => {
      nextSlide()
    }, autoSlideInterval)
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isAutoPlaying, currentIndex, stories.length, slidesPerView, autoSlideInterval])

  const nextSlide = useCallback(() => {
    if (currentIndex < maxIndex) {
      setDirection(1)
      setCurrentIndex(prev => prev + 1)
    } else {
      setDirection(1)
      setCurrentIndex(0)
    }
  }, [currentIndex, maxIndex])

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(prev => prev - 1)
    } else {
      setDirection(-1)
      setCurrentIndex(maxIndex)
    }
  }, [currentIndex, maxIndex])

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }, [currentIndex])

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev)
  }, [])

  if (!stories || stories.length === 0) {
    return null
  }

  const showNavigation = stories.length > slidesPerView

  // Get current visible stories
  const getVisibleStories = () => {
    const start = currentIndex * slidesPerView
    return stories.slice(start, start + slidesPerView)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    })
  }

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-left mb-12">
          <h2 className="text-xl mb-2">
            <span className="text-[#F46C44] lg:text-4xl font-light">
              {title?.split("||")[0]?.trim()}
            </span>{" "}
            <br />
            <span className="text-primary font-bold relative inline-block lg:text-4xl">
              {title?.split("||")[1]?.trim()}
              <span className="absolute right-0 -bottom-2 w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>
            </span>
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Slider Section */}
        <div className="relative">
          {/* Navigation Buttons */}
          {showNavigation && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}

         

          {/* Slides Container */}
          <div className="overflow-hidden py-4">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${slidesPerView}, minmax(0, 1fr))`
                }}
              >
                {getVisibleStories().map((story, idx) => (
                  <StoryCard key={story._id || `${currentIndex}-${idx}`} story={story} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Navigation */}
          {showNavigation && totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-orange-500"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const StoryCard = ({ story }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl shadow-lg  transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-84 overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0">
        {story.image ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <motion.img
              src={story.image}
              alt={story.name}
              className={`w-full h-full object-cover object-top transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-5xl font-bold">
              {story.name?.charAt(0) || "S"}
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        {story.status && (
          <div className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold ${
            story.status === "Approved" || story.status === "Visa" 
              ? "bg-orange-500 text-white" 
              : "bg-orange-500 text-white"
          }`}>
            {story.status}
          </div>
        )}
      </div>

    </motion.div>
  )
}

export default StudentVisaStories