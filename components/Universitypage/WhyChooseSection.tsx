"use client";
import { useForm } from "react-hook-form";
import { DynamicLucideIcon } from "@/components/DynamicLucideIcon";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Tagging } from "../tag";
import InnerContent from "../dom/DomParser";
import axiosInstance from "@/app/axiosInstance";
import toast from "react-hot-toast";

export const WhyStudySectionUniversity = ({ data }) => {
    if (data?.isHidden == "yes") return null;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            const res = await axiosInstance.post("/contactus", {
                subject: "Contact Form",
                type: "Website",
                fullName: formData.name,
                email: formData.email,
                phone: formData.mobile,
                destination: formData.destination,
                description: "Scholarship inquiry",
            });

            if (res.status === 200 || res.status === 201) {
                toast.success("Message sent successfully ✅");

                setIsSubmitted(true);
                reset();
                setTimeout(() => {
                    setIsSubmitted(false);
                }, 5000);
            } else {
                toast.error("Failed to send message ❌");
            }
        } catch (error) {
            console.error("Form submission error:", error);

            toast.error(
                error?.message ||
                "Failed to send message ❌"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full py-10 sm:py-12 [text-shadow:0_0px_0px_rgba(0,0,0,0.9)] px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column - Cards */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        {/* Header */}
                        <div className="">
                            <Tagging data={data?.tag} css="relative inline-block mb-4 sm:mb-6 block">
                                <span className="text-[#F46C44] text-2xl sm:text-3xl block font-semibold mr-2">
                                    {data?.title?.split("||")[0]?.trim() || ""}
                                </span>
                                <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-semibold">
                                    {data?.title?.split("||")[1]?.trim() || ""}
                                </span>
                            </Tagging>
                            <InnerContent cleanedHtml={data?.subtitle} />
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {(data?.items || []).map((item, index) => (
                                <div
                                    key={index}
                                    className="group bg-gradient-to-br from-orange-100/50 to-white relative hover:shadow transition-all duration-300 border border-gray-100 hover:border-[#F46C44]/20 overflow-hidden"
                                >

                                    <div className="p-4 ">
                                        <div className="flex items-start gap-4">
                                            {/* Icon Container */}
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 mt-px rounded-full bg-gradient-to-br from-[#F46C44]/30 to-[#F46C44]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <DynamicLucideIcon
                                                        name={item.icon}
                                                        size={20}
                                                        className="text-gray-600 sm:w-6 sm:h-6"
                                                    />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className="text-lg text-[#123b73] font-semibold mb-px"
                                                    dangerouslySetInnerHTML={{ __html: item?.title }}
                                                />
                                                <div className=" text-gray-600 leading-relaxed">
                                                    <InnerContent text={"14"} cleanedHtml={item.description} />
                                                </div>

                                                {/* Optional CTA */}
                                                {item.ctaText && (
                                                    <Link
                                                        href={item.ctaLink || "#"}
                                                        className="inline-flex items-center gap-1.5 mt-3 text-[#F46C44] text-sm font-medium hover:gap-2.5 transition-all duration-300"
                                                    >
                                                        {item.ctaText}
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Sticky Form */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="lg:sticky lg:top-22 space-y-6">
                            {/* CTA Card */}
                            <div className="relative w-full max-w-md lg:max-w-full mx-auto">
                                <div className="relative bg-white shadow-xl overflow-hidden border border-gray-200">
                                    {/* Decorative Top Bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F46C44] to-[#F46C44]/60"></div>

                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-[#F46C44] to-[#F46C44]/90 px-5 py-3.5">
                                        <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Book Your Free Consultation
                                        </h3>
                                    </div>

                                    {/* Stats Bar */}
                                    <div className="flex items-center justify-around py-3 px-4 border-b border-gray-100 bg-gray-50/50">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">📚</span>
                                            <span className="text-xs font-semibold text-[#0b2545]">100+ Courses</span>
                                        </div>
                                        <div className="w-px h-6 bg-gray-200"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">👨‍🎓</span>
                                            <span className="text-xs font-semibold text-[#0b2545]">10K+ Counseled</span>
                                        </div>
                                        <div className="w-px h-6 bg-gray-200"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">⭐</span>
                                            <span className="text-xs font-semibold text-[#0b2545]">4.9 Rating</span>
                                        </div>
                                    </div>

                                    {isSubmitted ? (
                                        <div className="py-10 px-6 text-center">
                                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto shadow-lg">
                                                ✓
                                            </div>
                                            <h4 className="mt-4 text-xl font-bold text-[#0b2545]">Thank You!</h4>
                                            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                                                Our counsellor will contact you shortly. We're excited to help you!
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                                            {/* Name Field */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <input
                                                        {...register("name", { required: "Name is required" })}
                                                        placeholder="Enter your full name"
                                                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F46C44]/30 focus:border-[#F46C44] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                                                    />
                                                </div>
                                                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                                            </div>

                                            {/* Mobile Field */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                                                    Mobile Number <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <input
                                                        {...register("mobile", {
                                                            required: "Mobile number required",
                                                            pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10-digit number" },
                                                        })}
                                                        placeholder="Enter 10-digit mobile"
                                                        type="tel"
                                                        inputMode="numeric"
                                                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F46C44]/30 focus:border-[#F46C44] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                                                    />
                                                </div>
                                                {errors.mobile && <p className="text-xs text-red-500 font-medium">{errors.mobile.message}</p>}
                                            </div>

                                            {/* Email Field */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <input
                                                        {...register("email", {
                                                            required: "Email required",
                                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                                                        })}
                                                        placeholder="your@email.com"
                                                        type="email"
                                                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F46C44]/30 focus:border-[#F46C44] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                                                    />
                                                </div>
                                                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                                            </div>

                                            {/* Destination Field */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                                                    Destination <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <select
                                                        {...register("destination", { required: "Please select a destination" })}
                                                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F46C44]/30 focus:border-[#F46C44] transition-all duration-200 appearance-none cursor-pointer text-gray-700 hover:border-gray-300"
                                                    >
                                                        <option value="" disabled className="text-gray-400">Select your destination</option>
                                                        {["USA", "UK", "France", "Germany", "Italy", "Dubai", "New Zealand", "Australia", "Canada"].map((c) => (
                                                            <option key={c} value={c.toLowerCase()}>Study In {c}</option>
                                                        ))}
                                                    </select>
                                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                                {errors.destination && <p className="text-xs text-red-500 font-medium">{errors.destination.message}</p>}
                                            </div>

                                            {/* Terms Checkbox */}
                                            <div className="flex items-start gap-2.5 pt-1">
                                                <input
                                                    type="checkbox"
                                                    id="agree"
                                                    {...register("agree", { required: "You must accept the terms" })}
                                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]/30 cursor-pointer transition flex-shrink-0"
                                                />
                                                <label htmlFor="agree" className="text-xs text-gray-600 leading-tight cursor-pointer">
                                                    I agree to the <a href="/terms-condition" className="text-[#F46C44] font-medium hover:underline">terms & privacy policy</a>
                                                </label>
                                            </div>
                                            {errors.agree && <p className="text-xs text-red-500 font-medium -mt-2">{errors.agree.message}</p>}

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-[#F46C44] to-[#F46C44]/90 hover:from-[#d95a32] hover:to-[#d95a32] transition-all duration-300 text-white font-bold py-3 rounded-lg text-lg shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Get Started Now
                                                    </>
                                                )}
                                            </button>

                                            {/* Trust Badge */}
                                            <div className="flex items-center justify-center gap-4 pt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-xs text-gray-500">100% Free</span>
                                                </div>
                                                <div className="w-px h-4 bg-gray-200"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-xs text-gray-500">No Spam</span>
                                                </div>
                                                <div className="w-px h-4 bg-gray-200"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-xs text-gray-500">Expert Guidance</span>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export const ConsultationForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            const res = await axiosInstance.post("/contactus", {
                subject: "Contact Form",
                type: "Website",
                fullName: formData.name,
                email: formData.email,
                phone: formData.mobile,
                destination: formData.destination,
                description: "Scholarship inquiry",
            });

            if (res.status === 200 || res.status === 201) {
                toast.success("Message sent successfully ✅");

                setIsSubmitted(true);
                reset();

                setTimeout(() => {
                    setIsSubmitted(false);
                }, 5000);
            } else {
                toast.error("Failed to send message ❌");
            }
        } catch (error) {
            console.error("Form submission error:", error);

            toast.error(
                error?.message ||
                "Failed to send message ❌"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative w-full max-w-md lg:max-w-full mx-auto">

            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-[#F46C44] to-[#F46C44]/90 px-5 py-3.5">
                    <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>

                        Book Your Free Consultation
                    </h3>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-around py-3 px-4 border-b border-gray-100 bg-gray-50/50">

                    <div className="flex items-center gap-2">
                        <span className="text-lg">📚</span>
                        <span className="text-xs font-semibold text-[#0b2545]">
                            100+ Courses
                        </span>
                    </div>

                    <div className="w-px h-6 bg-gray-200"></div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg">👨‍🎓</span>
                        <span className="text-xs font-semibold text-[#0b2545]">
                            10K+ Counseled
                        </span>
                    </div>

                    <div className="w-px h-6 bg-gray-200"></div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg">⭐</span>
                        <span className="text-xs font-semibold text-[#0b2545]">
                            4.9 Rating
                        </span>
                    </div>

                </div>

                {/* Success State */}
                {isSubmitted ? (
                    <div className="py-12 px-6 text-center">

                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto shadow-lg">
                            ✓
                        </div>

                        <h4 className="mt-4 text-xl font-bold text-[#0b2545]">
                            Thank You!
                        </h4>

                        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                            Our counsellor will contact you shortly. We're excited to help you!
                        </p>

                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-4 space-y-3"
                    >

                        {/* Name Field */}
                        <div className="space-y-1.5">

                            <label className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                                Full Name <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">

                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>

                                <input
                                    {...register("name", {
                                        required: "Name is required",
                                    })}
                                    placeholder="Enter your full name"
                                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F46C44]/30 focus:border-[#F46C44] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                                />

                            </div>

                            {errors.name && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.name.message}
                                </p>
                            )}

                        </div>

                        {/* Mobile Field */}
                        <div className="space-y-1.5">

                            <label className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">

                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>

                                <input
                                    {...register("mobile", {
                                        required: "Mobile number required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Enter valid 10-digit number",
                                        },
                                    })}
                                    placeholder="Enter 10-digit mobile"
                                    type="tel"
                                    inputMode="numeric"
                                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F46C44]/30 focus:border-[#F46C44] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                                />

                            </div>

                            {errors.mobile && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.mobile.message}
                                </p>
                            )}

                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">

                            <label className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                                Email Address <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">

                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>

                                <input
                                    {...register("email", {
                                        required: "Email required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    placeholder="your@email.com"
                                    type="email"
                                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F46C44]/30 focus:border-[#F46C44] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                                />

                            </div>

                            {errors.email && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.email.message}
                                </p>
                            )}

                        </div>

                        {/* Destination Field */}
                        <div className="space-y-1.5">

                            <label className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                                Destination <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">

                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>

                                <select
                                    {...register("destination", {
                                        required: "Please select a destination",
                                    })}
                                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F46C44]/30 focus:border-[#F46C44] transition-all duration-200 appearance-none cursor-pointer text-gray-700 hover:border-gray-300"
                                >

                                    <option
                                        value=""
                                        disabled
                                        className="text-gray-400"
                                    >
                                        Select your destination
                                    </option>

                                    {[
                                        "USA",
                                        "UK",
                                        "France",
                                        "Germany",
                                        "Italy",
                                        "Dubai",
                                        "New Zealand",
                                        "Australia",
                                        "Canada",
                                    ].map((c) => (
                                        <option
                                            key={c}
                                            value={c.toLowerCase()}
                                        >
                                            Study In {c}
                                        </option>
                                    ))}

                                </select>

                                <svg
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>

                            </div>

                            {errors.destination && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.destination.message}
                                </p>
                            )}

                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2.5 pt-1">

                            <input
                                type="checkbox"
                                id="agree"
                                {...register("agree", {
                                    required: "You must accept the terms",
                                })}
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#F46C44] focus:ring-[#F46C44]/30 cursor-pointer transition flex-shrink-0"
                            />

                            <label
                                htmlFor="agree"
                                className="text-xs text-gray-600 leading-tight cursor-pointer"
                            >
                                I agree to the{" "}
                                <a
                                    href="/terms-condition"
                                    className="text-[#F46C44] font-medium hover:underline"
                                >
                                    terms & privacy policy
                                </a>
                            </label>

                        </div>

                        {errors.agree && (
                            <p className="text-xs text-red-500 font-medium -mt-2">
                                {errors.agree.message}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#F46C44] to-[#F46C44]/90 hover:from-[#d95a32] hover:to-[#d95a32] transition-all duration-300 text-white font-bold py-3 rounded-lg text-lg shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >

                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                        />

                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>

                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>

                                    Get Started Now
                                </>
                            )}

                        </button>

                        {/* Trust Badge */}
                        <div className="flex items-center justify-center gap-4 pt-1">

                            <div className="flex items-center gap-1.5">
                                <svg
                                    className="w-4 h-4 text-green-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>

                                <span className="text-xs text-gray-500">
                                    100% Free
                                </span>
                            </div>
                            <div className="w-px h-4 bg-gray-200"></div>

                            <div className="flex items-center gap-1.5">
                                <svg
                                    className="w-4 h-4 text-green-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>

                                <span className="text-xs text-gray-500">
                                    Expert Guidance
                                </span>
                            </div>

                        </div>

                    </form>
                )}

            </div>
        </div>
    );
};


export const UniversityFeeCard = ({
    openPopup,
    tuitionFee = "AUD 48,000",
    convertedFee = "₹25,75,000",
    applicationFee = "AUD 100",
    onEnquire,
    onConsultation,
}:any) => {
    const supportItems = [
        {
            label: "Free Profile Evaluation",
            icon: "◎",
        },
        {
            label: "Step-by-step Admission Support",
            icon: "♧",
        },
        {
            label: "Visa Assistance",
            icon: "▧",
        },
        {
            label: "Education Loan Assistance",
            icon: "□",
        },
        {
            label: "Pre-Departure Support",
            icon: "▣",
        },
    ];

    return (
        <div className="w-full max-w-sm rounded-xl bg-white border border-gray-100 shadow-xl p-5">

            {/* Tuition Fee */}
            <div>
                <p className="text-[12px] font-semibold text-[#53617A]">
                    Tuition Fees (Total)
                </p>

                <h2 className="mt-1 text-[26px] leading-tight font-bold text-[#10295C]">
                   ₹ {tuitionFee}
                </h2>
            </div>

            {/* Application Fee */}
            <div className="mt-2 inline-flex items-center rounded-md bg-[#EAF8F0] px-3 py-1.5">
                <span className="text-xs font-semibold text-[#43A66A]">
                    + Application Fees: ₹ {applicationFee}
                </span>
            </div>

            {/* Buttons */}
            <div className="mt-5 space-y-2.5">

                <button
                    type="button"
                    onClick={openPopup}
                    className="
                        w-full
                        rounded-lg
                        bg-white border-2 border-orange-500
                        py-2.5
                        text-sm
                        font-bold hover:text-white hover:bg-orange-600
                        text-gray-700
                    "
                >
                    Enquire Now
                </button>

            </div>

            {/* Support List */}
            <div className="mt-3 space-y-2">

                {supportItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3"
                    >
                        {/* Icon */}
                        <div
                            className="
                                flex
                                h-7
                                w-7
                                flex-shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#EAF8F0]
                                text-[#43A66A]
                                text-sm
                                font-semibold
                            "
                        >
                            {item.icon}
                        </div>

                        {/* Text */}
                        <span className="text-[12px] font-semibold text-[#34415E]">
                            {item.label}
                        </span>
                    </div>
                ))}

            </div>

        </div>
    );
};