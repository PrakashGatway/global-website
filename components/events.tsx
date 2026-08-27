"use client"

import Image from 'next/image';
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Send, Linkedin, ChevronLeft, ChevronRight, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import EventsSlider from '@/components/PageComponent/EventSlider';
import Link from 'next/link';

export default function Events({ data, page, limit, total, type }) {
    const activeTab = type;
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const totalpage = Math.ceil(total / limit)

    // Helper to clean image URLs
    const cleanImageUrl = (url: string) => url.trim();

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <>
            <div className="bg-white overflow-x-hidden">
                {/* Upcoming Events Hero Section */}
                <section className="relative h-[400px] bg-gradient-to-br from-[#f46c44] via-[#f46c44] to-[#e55a30] overflow-hidden">
                    

                    {/* Title */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white/95 backdrop-blur-sm text-gray-800 px-8 md:px-12 py-3 md:py-4 rounded-full shadow-lg"
                        >
                            <h1 className="text-xl md:text-3xl font-bold text-center">
                                Upcoming <span className="text-[#f46c44]">Events</span>
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* Events Slider */}
                <div className="relative z-20 -mt-20 md:-mt-28 px-4 md:px-8">
                    <EventsSlider />
                </div>

                {/* Featured Events Section */}
                <section className="bg-gradient-to-b from-[#fff7f3] to-white py-12 md:py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2 
                            {...fadeInUp}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center"
                        >
                            Webinars & <span className="text-[#f46c44]">Events</span>
                        </motion.h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            {/* LEFT BIG CARD */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative group cursor-pointer"
                            >
                                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-full">
                                    <div className="relative h-[300px] overflow-hidden">
                                        <Image
                                            src="/images/events-banner.png"
                                            alt="GAway Global Education Event"
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            priority
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 text-white">
                                           
                                            <button className="inline-flex items-center gap-2 bg-[#f46c44] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a30] transition-all transform hover:scale-105">
                                                Register Now <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* RIGHT SMALL CARDS */}
                            <div className="space-y-6">
                                {/* Master's in UK Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
                                >
                                    <div className="flex flex-col sm:flex-row h-full">
                                        <div className="relative w-full sm:w-[40%] h-[200px] sm:h-auto bg-gradient-to-br from-[#f46c44]/10 to-[#f46c44]/20">
                                            <Image
                                                src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop"
                                                alt="UK Universities"
                                                fill
                                                loading="lazy"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-5 md:p-6 flex-1 flex flex-col justify-center">
                                            <p className="text-sm font-semibold text-[#f46c44] mb-2">
                                                Get admission in just 14 days
                                            </p>
                                            <h4 className="font-bold text-xl md:text-2xl text-gray-800 mb-2">
                                                Master's in the <span className="text-[#f46c44]">UK</span>
                                            </h4>
                                            <p className="text-gray-600 mb-3">Made Easy</p>
                                            <p className="text-sm text-gray-700">Apply to 150+ UK Universities</p>
                                            <div className="flex gap-3 mt-3">
                                                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">OXFORD</span>
                                                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">BRISTOL</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Overseas Education Fair Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
                                >
                                    <div className="flex flex-col sm:flex-row h-full">
                                        <div className="relative w-full sm:w-[40%] h-[200px] sm:h-auto bg-gradient-to-br from-[#f46c44]/10 to-[#f46c44]/20">
                                            <Image
                                                src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop"
                                                alt="Education Fair"
                                                fill
                                                loading="lazy"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-5 md:p-6 flex-1 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-[#f46c44]" />
                                                <p className="text-sm font-semibold text-gray-600">
                                                    Sunday, 18th January 2026 · 10:00 am – 5:00 pm
                                                </p>
                                            </div>
                                            <h4 className="font-bold text-xl md:text-2xl text-gray-800 mb-2">
                                                Overseas Education Fair – Nagpur
                                            </h4>
                                            <p className="text-sm text-gray-600 leading-snug">
                                                Attend KC's Biggest Overseas Education Fair in Nagpur and Interact with Representatives of 175+ Universities across 18 Countries.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* All our events & webinars Section */}
                <section className="bg-white py-12 md:py-20 relative px-4">
                    <div className="container mx-auto max-w-7xl">
                        <motion.h2 
                            {...fadeInUp}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center"
                        >
                            All our <span className="text-[#f46c44]">events</span> & <span className="text-[#f46c44]">webinars</span>
                        </motion.h2>

                        {/* Tabs Container */}
                        <div className="bg-gray-100 rounded-2xl p-2 mb-8 md:mb-12 max-w-md mx-auto">
                            <div className="flex gap-2">
                                <Link href="/events?type=event&page=1&limit=1" className="flex-1">
                                    <button
                                        className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                                            activeTab === "event"
                                                ? "bg-white text-gray-800 shadow-md"
                                                : "text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        Events
                                    </button>
                                </Link>
                                <Link href="/events?type=webnair&page=1&limit=1" className="flex-1">
                                    <button
                                        className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                                            activeTab === "webnair"
                                                ? "bg-white text-gray-800 shadow-md"
                                                : "text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        Webinars
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Events Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {data.map((event, index) => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                                        <div className="relative h-[220px] md:h-[260px] overflow-hidden">
                                            <Image
                                                src={event?.coverImage || "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"}
                                                alt={event?.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = cleanImageUrl('https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg');
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                                                <span className="inline-block bg-[#f46c44] text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                                                    {event.extraMetadata.eventType}
                                                </span>
                                                <h3 className="text-lg md:text-xl lg:text-2xl font-bold line-clamp-2">
                                                    {event.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="p-4 md:p-6 flex-1 flex flex-col">
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Calendar className="w-4 h-4 text-[#f46c44] mr-2 flex-shrink-0" />
                                                    <span className="font-medium">
                                                        {new Date(event.extraMetadata.eventDate).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Clock className="w-4 h-4 text-[#f46c44] mr-2 flex-shrink-0" />
                                                    <span>
                                                        {new Date(`1970-01-01T${event.extraMetadata.startTime}`).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                                                        {" - "}
                                                        {new Date(`1970-01-01T${event.extraMetadata.endTime}`).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <MapPin className="w-4 h-4 text-[#f46c44] mr-2 flex-shrink-0" />
                                                    <span>{event.extraMetadata.location}</span>
                                                </div>
                                            </div>

                                            <div 
                                                className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3"
                                                dangerouslySetInnerHTML={{ __html: event.shortDescription }} 
                                            />

                                            <Link
                                                href={`/events/${event.slug}`}
                                                className="mt-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#f46c44] transition-all transform hover:scale-105"
                                            >
                                                View & Register <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pagination */}
                <section className="py-8 md:py-12 bg-gray-50 px-4">
                    <div className="container mx-auto max-w-7xl">
                        <div className="flex justify-center items-center gap-2 flex-wrap">
                            {page > 1 ? (
                                <Link
                                    href={`/events?type=${type}&page=${page - 1}&limit=${limit}`}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white hover:border-[#f46c44] hover:text-[#f46c44] text-gray-700 transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                            ) : (
                                <span className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
                                    <ChevronLeft className="w-5 h-5" />
                                </span>
                            )}

                            {Array.from({ length: totalpage }).map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <Link
                                        key={pageNumber}
                                        href={`/events?type=${type}&page=${pageNumber}&limit=${limit}`}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${
                                            page === pageNumber
                                                ? "bg-[#f46c44] text-white shadow-lg"
                                                : "border border-gray-300 text-gray-700 hover:bg-white hover:border-[#f46c44] hover:text-[#f46c44]"
                                        }`}
                                    >
                                        {pageNumber}
                                    </Link>
                                );
                            })}

                            {page < totalpage ? (
                                <Link
                                    href={`/events?type=${type}&page=${page + 1}&limit=${limit}`}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white hover:border-[#f46c44] hover:text-[#f46c44] text-gray-700 transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            ) : (
                                <span className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
                                    <ChevronRight className="w-5 h-5" />
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Join Our Exclusive Study Abroad Network */}
                <section className="py-12 md:py-20 bg-gradient-to-br from-[#f46c44] to-[#e55a30] relative overflow-hidden px-4">
                    <div className="container mx-auto max-w-4xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                Join Our Exclusive Study Abroad Network
                            </h2>
                            <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
                                Get updates on what's happening around in the study abroad space, important notifications on events and journeys of other students
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-6 py-4 rounded-lg outline-none text-gray-800 bg-white shadow-lg focus:ring-2 focus:ring-white/50 transition-all"
                                />
                                <button className="bg-white text-[#f46c44] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap">
                                    I AM IN
                                </button>
                            </div>
                            
                            <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
                                {[
                                    { icon: Facebook, label: "Facebook" },
                                    { icon: Instagram, label: "Instagram" },
                                    { icon: Twitter, label: "Twitter" },
                                    { icon: Youtube, label: "YouTube" },
                                    { icon: Send, label: "Telegram" },
                                    { icon: Linkedin, label: "LinkedIn" }
                                ].map((social, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black transition-all"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={20} className="md:w-6 md:h-6" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    )
}