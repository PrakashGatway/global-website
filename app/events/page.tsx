"use client";
import Image from 'next/image';
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Send, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import EventsSlider from '@/components/PageComponent/EventSlider';

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
      buttonText: ""
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
      description: "Apply to 150+ UK Universities"
    }
  ];

  // Helper to clean image URLs
  const cleanImageUrl = (url: string) => url.trim();

  return (
    <div className="bg-white overflow-x-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Upcoming Events Hero Section */}
      <section className="bg-[#f46c44] h-[500px] relative overflow-hidden">
        {/* Decorative Arrow on Left Side */}
        <div className="absolute -left-30 top-[55%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <div style={{
            transform: 'rotate(35deg)',
            filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)',
            mixBlendMode: 'multiply'
          }}>
            <Image
              src="/images/g logo.png"
              alt="Decorative Arrow"
              width={400}
              height={40}
              className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
            />
          </div>
        </div>
        {/* Decorative Arrow on Right Side */}
        <div className="absolute -right-30 top-[55%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <Image
            src="/images/g logo.png"
            alt="Decorative Arrow"
            width={400}
            height={40}
            className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
            style={{ transform: 'scaleX(-1) rotate(-35deg)' }}
          />
        </div>

        {/* Title pill */}
        <div className="flex justify-center mt-10">
          <span className="bg-white text-gray-700 px-10 py-2 rounded-full text-xl font-semibold shadow">
            Upcoming Events
          </span>
        </div>
      </section>
      <EventsSlider />

      <section className="bg-[#fff7f3] py-0 mt-80">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-600 mb-10">
            Webinars & Events
          </h2>

          <div className="grid grid-cols-1 lg:flex gap-8 items-start">
            {/* LEFT BIG CARD */}
            <div className="lg:col-span-2">
              <div className="relative rounded-3xl overflow-hidden shadow-xl w-2xl bg-white">
                <Image
                  src="/images/events-banner.png"
                  alt="GAway Global Education Event"
                  width={1200}
                  height={600}
                  className="w-2xl h-auto object-cover"
                  priority
                />
                <div className="flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                  <div className="max-w-xl">
                    <p className="text-sm sm:text-base text-gray-700 mb-1">
                      Sunday, 18th January 2026 · 10:00 am – 5:00 pm
                    </p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                      Overseas Education Fair – Nagpur
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Attend KC's Biggest Overseas Education Fair in Nagpur and
                      interact with representatives of 175+ Universities across
                      18 Countries.
                    </p>
                    <button className="mt-6 inline-block bg-[#f46c44] text-white px-6 py-2.5 rounded-md font-semibold hover:opacity-90 transition">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SMALL CARDS */}
            <div className="space-y-6">
              {/* Master's in UK Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-[600px] h-[275px]">
                <div className="w-[300px] h-full flex items-center justify-center bg-[#fff7f3]">
                  <Image
                    src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop"
                    alt="UK Universities"
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-5 relative -top-9 flex flex-col justify-center mt-8">
                  <p className="text-[14px] font-semibold text-red-600 mb-2">
                    Get admission in just 14 days
                  </p>
                  <h4 className="font-bold text-[20px] text-gray-800 mb-2">
                    Master's in the <span className="text-red-600">UK</span>
                  </h4>
                  <p className="text-[14px] text-gray-600 mb-3">Made Easy</p>
                  <p className="text-[13px] text-gray-700 mb-3">Apply to 150+ UK Universities</p>
                  <div className="flex gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-gray-600">OXFORD</span>
                    <span className="text-[11px] font-semibold text-gray-600">BRISTOL</span>
                  </div>
                </div>
              </div>

              {/* Overseas Education Fair Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-[600px] h-[275px]">
                <div className="w-[300px] h-full flex items-center justify-center bg-[#fff7f3]">
                  <Image
                    src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop"
                    alt="Education Fair"
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 relative -top-10 flex flex-col justify-center mt-8">
                  <p className="text-[14px] font-bold text-gray-500 mb-1">
                    Sunday, 18th January 2026 · 10:00 am – 5:00 pm
                  </p>
                  <h4 className="font-bold text-[20px] text-gray-500 mb-2">
                    Overseas Education Fair – Nagpur
                  </h4>
                  <p className="text-[14px] font-bold text-gray-600 leading-snug">
                    Attend KC's Biggest Overseas Education Fair in Nagpur and Interact with Representatives of 175+ Universities across 18 Countries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All our events & webinars Section */}
      <section className="bg-white py-8 relative">
        {/* G Logo on Right Side */}
        <div className="absolute right-[-120px] top-[13%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block z-0 rounded-lg p-4">
          <Image
            src="/images/g logo.png"
            alt="Decorative G Logo"
            width={400}
            height={80}
            className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
            style={{ transform: 'scaleX(-1) rotate(-35deg)' }}
          />
        </div>
        <div className="container mx-auto px-6">
          <h2 className="text-2xl lg:text-5xl font-bold text-gray-800 mb-8 text-center">
            All our events & webinars
          </h2>

          {/* Tabs Container */}
          <div className="bg-gray-200 rounded-3xl p-3 mb-8 max-w-sm mx-auto">
            <div className="flex justify-center gap-1">
              <button
                onClick={() => setActiveTab('events')}
                className={`px-8 py-3 font-semibold transition-all rounded ${activeTab === 'events'
                  ? 'bg-white text-gray-800'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab('webinars')}
                className={`px-8 py-3 font-semibold transition-all rounded ${activeTab === 'webinars'
                  ? 'bg-white text-gray-800'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Webinars
              </button>
            </div>
          </div>

          {/* Events Content */}
          {activeTab === 'events' && (
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
              <div className="max-w-7xl mx-auto">
                <div className="absolute right-[-70px] top-[70%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block z-0">
                  <Image
                    src="/images/g logo.png"
                    alt="Decorative Arrow"
                    width={400}
                    height={80}
                    className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
                    style={{ transform: 'scaleX(-1) rotate(-40deg)' }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-[111]">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="relative border border-[#FF6B35] bg-white rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="absolute -top-2 -left-2 w-28 h-28 sm:w-36 sm:h-36 lg:w-45 lg:h-45 rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] bg-[#FF6B35] -z-10"></div>

                      <div className="relative overflow-hidden bg-gray-300 h-[200px] sm:h-[220px] lg:h-[260px] rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]">
                        <img
                          src={cleanImageUrl(event.image)}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = cleanImageUrl('https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg');
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4 rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] pointer-events-none">
                          <h3 className="text-white text-lg sm:text-xl lg:text-3xl font-semibold mb-2 sm:mb-4 lg:mb-6">
                            {event.title}
                          </h3>
                          <p className="text-white text-sm sm:text-base lg:text-lg">
                            {event.category} • {event.date}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 lg:p-6 text-center">
                        <div className="mb-3 text-gray-700 text-sm">
                          <p className="font-semibold">{event.time}</p>
                          <p className="text-xs">{event.location}</p>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-4 lg:mb-6">
                          {event.excerpt}
                        </p>
                        <button className="text-white px-6 py-2 mx-auto sm:py-3 bg-[#1f2937] rounded-tr-4xl shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)] text-sm font-semibold hover:bg-[#FF6B35] hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)] flex items-center justify-center gap-2 transition-all hover:opacity-90">
                          Register Now »
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Webinars Content */}
          {activeTab === 'webinars' && (
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
              <div className="max-w-7xl mx-auto">
                <div className="absolute right-[-70px] top-[70%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block z-0">
                  <Image
                    src="/images/g logo.png"
                    alt="Decorative Arrow"
                    width={400}
                    height={80}
                    className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
                    style={{ transform: 'scaleX(-1) rotate(-40deg)' }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-[111]">
                  {webinarsEvents.map((event) => (
                    <div
                      key={event.id}
                      className="relative bg-white border border-[#FF6B35] rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="absolute -top-2 -left-2 w-28 h-28 sm:w-36 sm:h-36 lg:w-45 lg:h-45 rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] bg-[#FF6B35] -z-10"></div>

                      <div className="relative overflow-hidden bg-gray-300 h-[200px] sm:h-[220px] lg:h-[260px] rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]">
                        <img
                          src={cleanImageUrl(event.image || 'https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg')}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = cleanImageUrl('https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg');
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4 rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] pointer-events-none">
                          <h3 className="text-white text-lg sm:text-xl lg:text-3xl font-semibold mb-2 sm:mb-4 lg:mb-6">
                            {event.title}
                          </h3>
                          {event.date && (
                            <p className="text-white text-sm sm:text-base lg:text-lg">
                              {event.date}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 lg:p-6 text-center">
                        {event.description && (
                          <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-4 lg:mb-6">
                            {event.description}
                          </p>
                        )}
                        <button className="bg-[#FF6B35] hover:bg-[#e85f2f] text-white text-sm font-semibold px-5 py-2 rounded transition-colors">
                          {event.buttonText || "Register Now »"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
      <section className="py-10 bg-[#FF6B35] relative overflow-hidden">
        <div className="absolute -left-30 top-[70%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <div style={{
            transform: 'rotate(-20deg)',
            filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)',
            mixBlendMode: 'multiply'
          }}>
            <Image
              src="/images/g logo.png"
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
              <button className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer" aria-label="Facebook">
                <Facebook size={24} />
              </button>
              <button className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer" aria-label="Instagram">
                <Instagram size={24} />
              </button>
              <button className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer" aria-label="Twitter">
                <Twitter size={24} />
              </button>
              <button className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer" aria-label="YouTube">
                <Youtube size={24} />
              </button>
              <button className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer" aria-label="Telegram">
                <Send size={24} />
              </button>
              <button className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer" aria-label="LinkedIn">
                <Linkedin size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}