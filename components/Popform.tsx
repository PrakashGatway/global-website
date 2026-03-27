"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Phone, Mail, User, MapPin, Globe, CheckCircle, GraduationCap } from 'lucide-react'
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
    } = useForm()

    // Available countries list
    const countries = [
        "Study In USA",
        "Study In UK",
        "Study In France",
        "Study In Germany",
        "Study In Italy",
        "Study In Dubai"
    ]

    // Detect country from URL
    const getDefaultCountry = () => {
        if (pathname?.includes('/usa') || pathname?.includes('/us')) return "Study In USA"
        if (pathname?.includes('/uk') || pathname?.includes('/united-kingdom')) return "Study In UK"
        if (pathname?.includes('/france')) return "Study In France"
        if (pathname?.includes('/germany')) return "Study In Germany"
        if (pathname?.includes('/italy')) return "Study In Italy"
        if (pathname?.includes('/dubai') || pathname?.includes('/uae')) return "Study In Dubai"
        return "Study In Italy" // Default fallback
    }

    // Set default country when form opens
    useEffect(() => {
        if (isOpen) {
            const defaultCountry = getDefaultCountry()
            setValue("studyCountry", defaultCountry)
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={()=>onClose(false)}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={()=>onClose(false)}
                            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-5 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-white">Book Your Free Consultation</h2>
                            <p className="text-white/90 text-xs mt-1">Get expert guidance for your study abroad journey</p>
                        </div>

                        <div className="p-5">
                            {!isSuccess ? (
                                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                                    {/* 2-Column Grid for inputs */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
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
                                                    className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            {errors.fullName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Email ID <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="email"
                                                    {...register("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                    className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                            )}
                                        </div>

                                        {/* Mobile Number */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Mobile Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="tel"
                                                    {...register("mobile", {
                                                        required: "Mobile number is required",
                                                        pattern: {
                                                            value: /^[0-9]{10}$/,
                                                            message: "Please enter a valid 10-digit mobile number"
                                                        }
                                                    })}
                                                    className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                                    placeholder="Enter 10-digit mobile number"
                                                />
                                            </div>
                                            {errors.mobile && (
                                                <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                                            )}
                                        </div>

                                        {/* City */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
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
                                                    className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                                    placeholder="Enter your city"
                                                />
                                            </div>
                                            {errors.city && (
                                                <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                                            )}
                                        </div>

                                        {/* Program/Degree */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Degree / Program <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    {...register("degree", {
                                                        required: "Degree/Program is required",
                                                        minLength: { value: 2, message: "Please enter your degree/program" }
                                                    })}
                                                    className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.degree ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                                    placeholder="Enter your degree/program"
                                                />
                                            </div>
                                            {errors.degree && (
                                                <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>
                                            )}
                                        </div>

                                        {/* Country - SELECT ONLY */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Country to Study <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <select
                                                    {...register("studyCountry", { required: "Please select your preferred country" })}
                                                    className={`w-full pl-9 pr-3 py-2 text-sm border ${errors.studyCountry ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white`}
                                                >
                                                    {countries.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.studyCountry && (
                                                <p className="text-red-500 text-xs mt-1">{errors.studyCountry.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Query - Full Width */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Your Query / Message
                                        </label>
                                        <textarea
                                            {...register("message")}
                                            rows={2}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                            placeholder="Tell us about your study abroad goals..."
                                        />
                                    </div>

                                    {/* Consent - Full Width */}
                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            {...register("description", { required: "You must agree to receive information" })}
                                            className="mt-0.5 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <label className="text-xs text-gray-600 leading-relaxed">
                                            I agree to receive information about study abroad programs, scholarships, and updates.
                                        </label>
                                    </div>
                                    {errors.consent && (
                                        <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>
                                    )}

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Book Free Consultation
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            ) : (
                                <motion.div
                                    variants={successVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                                    <p className="text-sm text-gray-600">
                                        Your consultation request has been submitted successfully.
                                        <br />
                                        Our counselor will contact you shortly.
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PopupForm