"use client"
import Image from 'next/image';
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import UniversitySliderClient from "@/components/UniversitySliderClient";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Send, Linkedin } from "lucide-react";
import { useState } from "react";

export default function EventsPage() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'events' | 'webinars'>('events');

  const upcomingEvents = [
    {
      id: 1,
      title: "GAway Global Education",
      date: "Sun, 18th Jan 2026",
      time: "10:00 am to 5:00 pm",
      location: "Hotel Centre Point, Ramdaspeth, Nagpur",
      description: "Interact with Representatives of 175+ Universities across 18 Countries.",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Overseas Education Fair - Nagpur",
      category: "Education Fair",
      date: "January 18, 2026",
      time: "10:00 AM - 5:00 PM",
      location: "Hotel Centre Point, Ramdaspeth, Nagpur",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Interact with Representatives of 175+ Universities across 18 Countries. Attend KC's Biggest Overseas Education Fair in Nagpur."
    },
    {
      id: 2,
      title: "Master's in UK - Information Session",
      category: "Webinar",
      date: "January 20, 2026",
      time: "2:00 PM - 4:00 PM",
      location: "Online",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Got admission in just 14 days. Apply for Jan & Sep intake. Learn about top UK universities and scholarship opportunities."
    },
    {
      id: 3,
      title: "Study in Canada - Virtual Fair",
      category: "Virtual Event",
      date: "January 22, 2026",
      time: "11:00 AM - 3:00 PM",
      location: "Online",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Connect with Canadian universities, learn about visa requirements, and explore scholarship opportunities for international students."
    },
    {
      id: 4,
      title: "GMAT Preparation Workshop",
      category: "Workshop",
      date: "January 25, 2026",
      time: "10:00 AM - 1:00 PM",
      location: "Mumbai Office",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Score 690+ in GMAT. Free Demo Class. Expert tips and strategies to ace your GMAT exam and secure admission to top business schools."
    },
    {
      id: 5,
      title: "Overseas Education Fair - Pune",
      category: "Education Fair",
      date: "January 28, 2026",
      time: "10:00 AM - 5:00 PM",
      location: "Hotel Le Meridien, Pune",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Meet representatives from top universities worldwide. Get personalized counseling and explore study abroad opportunities."
    },
    {
      id: 6,
      title: "Scholarship Opportunities Webinar",
      category: "Webinar",
      date: "February 1, 2026",
      time: "3:00 PM - 5:00 PM",
      location: "Online",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Discover various scholarship opportunities available for international students in USA, UK, Canada, Australia, and Europe."
    },
    {
      id: 7,
      title: "Study in Germany - Public Universities",
      category: "Information Session",
      date: "February 5, 2026",
      time: "2:00 PM - 4:00 PM",
      location: "Delhi Office",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Learn about tuition-free education in Germany, admission requirements, and career opportunities for international students."
    },
    {
      id: 8,
      title: "Visa Application Guidance Session",
      category: "Workshop",
      date: "February 8, 2026",
      time: "11:00 AM - 1:00 PM",
      location: "Bangalore Office",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Complete guide to student visa requirements, documentation, and application process for major study destinations."
    },
    {
      id: 9,
      title: "IELTS/TOEFL Preparation Workshop",
      category: "Workshop",
      date: "February 12, 2026",
      time: "10:00 AM - 2:00 PM",
      location: "Hyderabad Office",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg",
      excerpt: "Expert tips and strategies to achieve your target scores. Free mock tests and personalized feedback from certified trainers."
    }
  ];

  const webinarsEvents = [
    {
      id: 1,
      type: "main",
      title: "GAway Global Education",
      date: "Sun, 18th Jan 2026",
      time: "10:00 am to 5:00 pm",
      location: "Hotel Centre Point, Ramdaspeth, Nagpur",
      description: "Interact with Representatives of 175+ Universities across 18 Countries.",
      image: "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
    },
    {
      id: 2,
      type: "uk-masters",
      title: "Master's in the UK",
      banner: "Get admission in just 14 days",
      description: "Apply to 150+ UK Universities",
      buttonText: "Check Eligibility Now"
    },
    {
      id: 3,
      type: "fair",
      title: "Overseas Education Fair - Nagpur",
      date: "Sunday, 18th January 2026",
      time: "10:00 am - 5:00 pm",
      description: "Attend KC's Biggest Overseas Education Fair in Nagpur and Interact with Representatives of 175+ Universities across 18 Countries.",
      buttonText: "Register Now"
    },
    {
      id: 4,
      type: "uk-masters",
      title: "Master's in the UK",
      banner: "Get admission in just 14 days",
      description: "Apply to 150+ UK Universities",
      buttonText: "Check Eligibility Now"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Navigation />

      {/* Upcoming Events Hero Section */}
      <section className="relative py-20" style={{ paddingTop: '90px', marginTop: '75px', backgroundColor: '#FF6B35' }}>
        {/* Decorative G Logo on Left Side */}
        <div className="absolute -left-2 top-[30%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <div style={{ 
            transform: 'rotate(-20deg)',
            filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)',
            mixBlendMode: 'multiply'
          }}>
            <Image
              src="/g logo.png"
              alt="Decorative G Logo"
              width={400}
              height={40}
              className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
            />
          </div>
        </div>
        {/* Decorative Arrow on Right Side */}
        <div className="absolute -right-30 top-[55%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <Image
            src="/g logo.png"
            alt="Decorative Arrow"
            width={400}
            height={40}
            className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
            style={{ 
              transform: 'scaleX(-1) rotate(-35deg)',
              filter: 'brightness(0) saturate(100%) invert(1)',
              WebkitFilter: 'brightness(0) saturate(100%) invert(1)',
              mixBlendMode: 'screen'
            }}
          />
        </div>
        {/* Background G Logo - Semi-transparent (Centered) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
         
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Upcoming Events Button - Centered */}
          <div className="flex justify-center mb-12">
            <button className="bg-white text-[#55433d] px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-all">
              Upcoming Events
            </button>
          </div>

          {/* Main Event Card */}
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-gray-200 rounded-4xl p-5 lg:p-4 relative overflow-visible">
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
                {/* Left Side - Event Details */}
                <div className="relative z-10">
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                    {upcomingEvents[currentEventIndex].title}
                  </h2>
                  <div className="space-y-5 mb-6">
                    <p className="text-lg lg:text-xl text-gray-700 font-medium">
                      {upcomingEvents[currentEventIndex].date}
                    </p>
                    <p className="text-lg lg:text-xl text-gray-700 font-medium">
                      {upcomingEvents[currentEventIndex].time}
                    </p>
                    <p className="text-lg lg:text-xl text-gray-700 font-medium">
                      {upcomingEvents[currentEventIndex].location}
                    </p>
                  </div>
                  <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                    {upcomingEvents[currentEventIndex].description}
                  </p>
                </div>

                {/* Right Side - Image */}
                <div className="relative">
                  <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                    <img
                      src={upcomingEvents[currentEventIndex].image}
                      alt={upcomingEvents[currentEventIndex].title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Arrows - On far left and right edges of grey card */}
              <button
                onClick={() => setCurrentEventIndex((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length)}
                className="absolute -left-6 lg:-left-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all z-20"
              >
                <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length)}
                className="absolute -right-6 lg:-right-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all z-20"
              >
                <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Webinars & Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-12 text-center">
            Webinars & Events
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Top Left - Main Event Card (Large) */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {/* Left Side - Event Details */}
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#FF6B35] mb-4">
                    {webinarsEvents[0].title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700 font-medium">{webinarsEvents[0].date}</p>
                    <p className="text-gray-700 font-medium">{webinarsEvents[0].time}</p>
                    <p className="text-gray-700 font-medium">{webinarsEvents[0].location}</p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {webinarsEvents[0].description}
                  </p>
                </div>
                {/* Right Side - Image */}
                <div className="relative h-[300px] md:h-full rounded-xl overflow-hidden">
                  <img
                    src={webinarsEvents[0].image}
                    alt={webinarsEvents[0].title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Top Right - UK Master's Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              {/* Red Banner */}
              <div className="bg-red-600 text-white px-4 py-2 text-center font-semibold text-sm">
                {webinarsEvents[1].banner}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-6 bg-[#012169] relative">
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(45deg, transparent 35%, white 35%, white 65%, transparent 65%), linear-gradient(-45deg, transparent 35%, white 35%, white 65%, transparent 65%)'
                    }}></div>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-[#C8102E]"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-0.5 h-full bg-[#C8102E]"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{webinarsEvents[1].title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{webinarsEvents[1].description}</p>
                <button className="bg-[#FF6B35] hover:bg-[#e85f2f] text-white px-6 py-2 rounded font-semibold transition-colors w-full">
                  {webinarsEvents[1].buttonText}
                  </button>
                {/* Big Ben Image */}
                <div className="mt-4 h-32 bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg flex items-center justify-center">
                  <div className="text-4xl">🏛️</div>
                </div>
              </div>
            </div>

            {/* Bottom Left - Education Fair Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{webinarsEvents[2].title}</h3>
              <p className="text-gray-600 mb-2">{webinarsEvents[2].date}</p>
              <p className="text-gray-600 mb-2">{webinarsEvents[2].time}</p>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{webinarsEvents[2].description}</p>
              <button className="bg-[#FF6B35] hover:bg-[#e85f2f] text-white px-6 py-2 rounded font-semibold transition-colors w-full">
                {webinarsEvents[2].buttonText}
                  </button>
            </div>

            {/* Bottom Right - UK Master's Card (Duplicate) */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              {/* Red Banner */}
              <div className="bg-red-600 text-white px-4 py-2 text-center font-semibold text-sm">
                {webinarsEvents[3].banner}
              </div>
              <div className="p-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-6 bg-[#012169] relative">
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(45deg, transparent 35%, white 35%, white 65%, transparent 65%), linear-gradient(-45deg, transparent 35%, white 35%, white 65%, transparent 65%)'
                    }}></div>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-[#C8102E]"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-0.5 h-full bg-[#C8102E]"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{webinarsEvents[3].title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{webinarsEvents[3].description}</p>
                <button className="bg-[#FF6B35] hover:bg-[#e85f2f] text-white px-6 py-2 rounded font-semibold transition-colors w-full">
                  {webinarsEvents[3].buttonText}
                  </button>
                {/* Big Ben Image */}
                <div className="mt-4 h-32 bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg flex items-center justify-center">
                  <div className="text-4xl">🏛️</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All our events & webinars Section */}
      <section className="bg-gray-100 py-8 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-8 text-center">
            All our events & webinars
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-8 py-3 font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-gray-200 text-gray-800 border-2 border-gray-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('webinars')}
              className={`px-8 py-3 font-semibold transition-all ${
                activeTab === 'webinars'
                  ? 'bg-gray-200 text-gray-800 border-2 border-gray-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Webinars
            </button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="bg-white py-0 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* G Logo for third row last column - behind the card */}
          <div className="absolute right-[-70px] top-[70%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block z-0">
            <Image
              src="/g logo.png"
              alt="Decorative Arrow"
              width={400}
              height={80}
              className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
              style={{ transform: 'scaleX(-1) rotate(-40deg)' }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-[111]">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="
                  relative bg-white border border-[#FF6B35]
                  rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                  transition-all duration-300 hover:shadow-xl
                "
              >
                {/* ORANGE BACKGROUND SHAPE */}
                <div
                  className="
                    absolute -top-2 -left-2
                    w-28 h-28 sm:w-36 sm:h-36 lg:w-45 lg:h-45
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                    bg-[#FF6B35] -z-10
                  "
                ></div>

                {/* IMAGE */}
                <div
                  className="
                    relative overflow-hidden bg-gray-300
                    h-[200px] sm:h-[220px] lg:h-[260px]
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                  "
                >
                  <img
                    src={event.image || 'https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg';
                    }}
                  />

                  {/* OVERLAY */}
                  <div
                    className="
                      absolute inset-0 bg-black/50
                      flex flex-col items-center justify-center text-center px-4
                      rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                      pointer-events-none
                    "
                  >
                    <h3 className="text-white text-lg sm:text-xl lg:text-3xl font-semibold mb-2 sm:mb-4 lg:mb-6">
                      {event.title}
                    </h3>
                    <p className="text-white text-sm sm:text-base lg:text-lg">
                      {event.category} • {event.date}
                    </p>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-5 lg:p-6 text-center">
                  <div className="mb-3 text-gray-700 text-sm">
                    <p className="font-semibold">{event.time}</p>
                    <p className="text-xs">{event.location}</p>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-4 lg:mb-6">
                    {event.excerpt}
                  </p>

                  <button
                    className="
                      bg-[#FF6B35] hover:bg-[#e85f2f]
                      text-white text-sm font-semibold
                      px-5 py-2 rounded transition-colors
                    "
                  >
                    Register Now »
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-gray-700">
              &lt;&lt;
            </button>
            <button className="px-4 py-2 rounded-full bg-[#FF6B35] text-white font-semibold w-10 h-10">
              1
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-all text-gray-700 w-10 h-10">
              2
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-all text-gray-700 w-10 h-10">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-all text-gray-700 w-10 h-10">
              19
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-gray-700">
              &gt;&gt;
            </button>
          </div>
        </div>
      </section>

      {/* Join Our Exclusive Study Abroad Network */}
      <section className="py-10 bg-[#FF6B35] relative overflow-visible">
        {/* Decorative Arrow on Left Side */}
        <div className="absolute -left-30 top-2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <div style={{ 
            transform: 'rotate(-20deg)',
            filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)',
            mixBlendMode: 'multiply'
          }}>
            <Image
              src="/g logo.png"
              alt="Decorative Arrow"
              width={400}
              height={40}
              className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
            />
          </div>
        </div>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Join Our Exclusive Study Abroad Network
            </h2>
            <p className="text-white text-lg mb-8 opacity-90">
              Get updates on what&apos;s happening around in the study abroad space, important notifications on events and journeys of other students
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <input
                type="email"
                placeholder="Email"
                className="w-full sm:w-[500px] px-6 py-3 rounded-none outline-none text-gray-800 bg-white border border-gray-300"
              />
              <button className="bg-white text-[#FF6B35] w-full sm:w-[200px] px-6 py-3 rounded-none font-bold hover:bg-gray-100 transition-all whitespace-nowrap">
                I AM IN
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="Telegram"
              >
                <Send size={24} />
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
