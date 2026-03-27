"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause, Star } from 'lucide-react'

const StudentVisaStories = ({ 
  title = "Our Student Visa Success Stories",
  subtitle = "Real stories from students who achieved their dream of studying abroad",
  stories,
  autoSlideInterval = 5000
}) => {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const timerRef = useRef(null)

  const getCardsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }
    return 3
  }

  console.log(stories)

  const [cardsToShow, setCardsToShow] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow())
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalSlides = Math.max(0, stories.length - cardsToShow + 1)
  const maxIndex = totalSlides - 1

  useEffect(() => {
    if (isAutoPlaying && stories.length > cardsToShow) {
      timerRef.current = setInterval(() => {
        nextSlide()
      }, autoSlideInterval)
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isAutoPlaying, currentIndex, stories.length, cardsToShow, autoSlideInterval])

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setDirection(1)
      setCurrentIndex(prev => prev + 1)
    } else {
      setDirection(1)
      setCurrentIndex(0)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(prev => prev - 1)
    } else {
      setDirection(-1)
      setCurrentIndex(maxIndex)
    }
  }

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  if (!stories || stories.length === 0) {
    return null
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" }
    })
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative">
          {stories.length > cardsToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {stories.length > cardsToShow && (
            <button
              onClick={toggleAutoPlay}
              className="absolute top-0 right-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-300"
            >
              {isAutoPlaying ? (
                <Pause className="w-4 h-4 text-gray-600" />
              ) : (
                <Play className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          <div className="overflow-hidden">
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
                  gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))`
                }}
              >
                {stories
                  .slice(currentIndex, currentIndex + cardsToShow)
                  .map((story, idx) => (
                    <StoryCard key={story._id || idx} story={story} />
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {stories.length > cardsToShow && totalSlides > 1 && (
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

  // Render stars based on rating
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
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        {story.image ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={story.image}
              alt={story.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500">
            <span className="text-white text-4xl font-bold">
              {story.name?.charAt(0) || "S"}
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        {story.status && (
          <div className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold ${
            story.status === "Approved" 
              ? "bg-green-500 text-white" 
              : "bg-orange-500 text-white"
          }`}>
            {story.status}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Student Name & Designation */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {story.name || "Student"}
          </h3>
          {story.designation && (
            <p className="text-sm text-orange-500 font-medium">
              {story.designation}
            </p>
          )}
        </div>

        {/* Rating Stars */}
        {story.rating && (
          <div className="flex gap-0.5 mb-3">
            {renderStars(story.rating)}
          </div>
        )}

        {/* Message/Story */}
        <div className="relative mb-4">
          <svg
            className="absolute -top-2 -left-2 w-8 h-8 text-gray-200"
            fill="currentColor"
            viewBox="0 0 32 32"
          >
            <path d="M10 8c-3.3 0-6 2.7-6 6v2c0 3.3 2.7 6 6 6s6-2.7 6-6-2.7-6-6-6zm12 0c-3.3 0-6 2.7-6 6v2c0 3.3 2.7 6 6 6s6-2.7 6-6-2.7-6-6-6z" />
          </svg>
          <p className="text-gray-600 text-sm leading-relaxed pl-6 min-h-[80px]">
            {story.message || story.story || "An incredible journey! The support and guidance helped me achieve my dream."}
          </p>
        </div>

        {/* Target & Date */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {story.target && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {story.target === "visa" ? "Student Visa" : story.target}
            </span>
          )}
          {story.createdAt && (
            <span className="text-xs text-gray-400">
              {new Date(story.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default StudentVisaStories