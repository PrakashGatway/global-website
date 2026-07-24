"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Phone, Mail, User, MapPin, Globe, CheckCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

const PopupForm = ({ isOpen, onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const pathname = usePathname()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({ mode: "onChange" })

  // Detect country from URL
  const getDefaultCountry = () => {
    if (pathname?.includes('/usa') || pathname?.includes('/us')) return "usa"
    if (pathname?.includes('/uk') || pathname?.includes('/united-kingdom')) return "uk"
    if (pathname?.includes('/france')) return "france"
    if (pathname?.includes('/germany')) return "germany"
    if (pathname?.includes('/italy')) return "italy"
    if (pathname?.includes('/dubai') || pathname?.includes('/uae')) return "dubai"
    return "italy" // Default fallback
  }

  // Set default country when form opens
  useEffect(() => {
    if (isOpen) {
      const defaultCountry = getDefaultCountry()
      setValue("destination", defaultCountry)
    }
  }, [isOpen, setValue, pathname])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset()
      setIsSuccess(false)
      setIsSubmitting(false)
    }
  }, [isOpen, reset])

  const onFormSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await onSubmit(data)
      if (response.success) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose(true)  // ✅ Pass true = form submitted
          reset()
          setIsSuccess(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  }

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-[1px] overflow-y-auto"
          onClick={() => onClose(false)}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-5xl bg-[#FDF4EF] overflow-hidden rounded-3xl shadow-2xl flex max-h-[90vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full">
              
              {/* Left Panel - Hidden on small screens */}
              <div className="hidden lg:flex w-[44%] p-8 lg:p-10 flex-col justify-start relative">
                <div className="absolute w-[220vh] rounded-full h-[220vh] bg-white -top-[66vh] left-[80%] z-0">

                </div> 
                <img src="/shapes/popbg.webp" alt="Image" className="absolute h-42 -scale-x-100 bottom-0 object-cover" />
                <div className="relative z-1">
                  <h2 className="text-3xl font-semibold text-gray-800 leading-tight">
                    Guidance for Your <br/>
                    <span className="text-[#F46C44]">Dream Career</span>
                  </h2>

                  <div className="mt-10 space-y-5">
                    <div className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#F25D85] flex-shrink-0"></span>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Trusted by 3,00,000+ Learners
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Join a thriving community of students pursuing global education.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#F25D85] flex-shrink-0"></span>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          360° Expert Support at Every Step
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          End-to-end guidance from application to admission.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#F25D85] flex-shrink-0"></span>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Access 1000+ Global University Partners
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Explore top universities across the world.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Form Area with Curve */}
              <div className="flex-1 w-full lg:w-[100%] bg-white relative z-10 flex flex-col overflow-hidden">
                
                {/* Close Button */}
                <button
                  onClick={() => onClose(false)}
                  className="absolute top-6 right-6 z-30 p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  <X size={20} />
                </button>

                {/* Header (Non-scrollable) */}
                <div className="pe-6 ps-6 sm:pe-10 pt-8 mb-3 pb-4 flex-shrink-0">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                    Book Your Free Consultation
                  </h2>
                </div>

                {/* Form Content (Scrollable) */}
                <div className="pe-6 ps-6 sm:pe-10 overflow-y-auto flex-1 pb-4">
                  {!isSuccess ? (
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="text"
                              {...register("fullName", {
                                required: "Full name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters" }
                              })}
                              className={`w-full pl-9 pr-3 py-2.5 text-sm border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25D85] transition-all`}
                              placeholder="Enter your full name"
                            />
                          </div>
                          {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                          )}
                        </div>
                        
                        {/* Mobile */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="tel"
                              maxLength={10}
                              {...register("mobile", {
                                required: "Mobile number is required",
                                pattern: {
                                  value: /^[0-9]{10}$/,
                                  message: "Please enter a valid 10-digit mobile number"
                                }
                              })}
                              className={`w-full pl-9 pr-3 py-2.5 text-sm border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25D85] transition-all`}
                              placeholder="Enter 10-digit mobile number"
                            />
                          </div>
                          {errors.mobile && (
                            <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                          Email ID <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="email"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(com|in|org|net|edu|gov|co|io)$/i,
                                message: "Enter a valid email with proper domain (e.g. .com, .in)",
                              }
                            })}
                            className={`w-full pl-9 pr-3 py-2.5 text-sm border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25D85] transition-all`}
                            placeholder="Enter your email"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* State */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            State <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="text"
                              {...register("state", {
                                required: "State is required",
                                minLength: { value: 2, message: "Please enter a valid state name" }
                              })}
                              className={`w-full pl-9 pr-3 py-2.5 text-sm border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25D85] transition-all`}
                              placeholder="Enter your state"
                            />
                          </div>
                          {errors.state && (
                            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                          )}
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            City <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="text"
                              {...register("city", {
                                required: "City is required",
                                minLength: { value: 2, message: "Please enter a valid city name" }
                              })}
                              className={`w-full pl-9 pr-3 py-2.5 text-sm border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25D85] transition-all`}
                              placeholder="Enter your city"
                            />
                          </div>
                          {errors.city && (
                            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Country to Study */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                          Country to Study <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                          <select
                            {...register("destination", { required: "Please select your preferred country" })}
                            className={`w-full pl-9 pr-3 py-2.5 text-sm border ${errors.destination ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25D85] bg-white appearance-none cursor-pointer transition-all`}
                          >
                            <option value="">Select Country</option>
                            {["USA", "UK", "France", "Germany", "Italy", "Dubai", "New Zealand", "Australia"].map((c) => (
                              <option key={c} value={c.toLowerCase()}>
                                Study In {c}
                              </option>
                            ))}
                          </select>
                          {/* Custom Dropdown Arrow */}
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        {errors.destination && (
                          <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>
                        )}
                      </div>

                      {/* Consent */}
                      <div className="flex items-start gap-2 pt-2">
                        <input
                          type="checkbox"
                          {...register("consent", { required: "You must agree to receive information" })}
                          className="mt-0.5 w-4 h-4 text-[#F25D85] border-gray-300 rounded focus:ring-[#F25D85] cursor-pointer"
                        />
                        <label className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          I agree to receive information about study abroad programs, scholarships, and updates.
                        </label>
                      </div>
                      {errors.consent && (
                        <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>
                      )}
                    </form>
                  ) : (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      className="text-center py-12 sm:py-20"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        Thank You!
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Your consultation request has been submitted successfully.
                        <br />
                        Our counselor will contact you shortly.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Footer (Non-scrollable) */}
                {!isSuccess && (
                  <div className="pe-6 ps-6 sm:pe-10 py-4 bg-white flex-shrink-0">
                    <motion.button
                      type="submit"
                      onClick={handleSubmit(onFormSubmit)}
                      disabled={isSubmitting}
                      className="w-full bg-[#F46C44] text-white py-3 rounded-xl font-semibold hover:bg-[#e54e75] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Book Free Consultation
                          <Send size={18} />
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PopupForm