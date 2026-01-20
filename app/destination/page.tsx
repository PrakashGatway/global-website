"use client"
import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import { GraduationCap, Target, BookOpen, Award } from 'lucide-react';

export default function DestinationPage() {
  const destinations = [
    {
      name: "Ivy League",
      slug: "ivy-league",
      description: "Top universities abroad",
      icon: GraduationCap,
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
      color: "#f46c44"
    },
    {
      name: "GMAT Preparation",
      slug: "gmat",
      description: "Score high in GMAT",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
      color: "#1f6f94"
    },
    {
      name: "PTE Academic",
      slug: "pte",
      description: "Pearson Test of English",
      icon: Award,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
      color: "#047d92"
    },
    {
      name: "GRE Preparation",
      slug: "gre",
      description: "Mock tests & practice",
      icon: Target,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
      color: "#e21735"
    }
  ];

  return (
    <div className='bg-[#fffaf7] relative'>
      {/* Hero Section */}
      <section className="relative flex items-center overflow-hidden" style={{ backgroundColor: '#f46c44', borderTop: 'none', boxShadow: 'none', isolation: 'isolate', zIndex: 1 }}>
        <div className="absolute -left-40 top-[0%] opacity-10 pointer-events-none hidden lg:block">
          <div style={{
            transform: 'rotate(-30deg) scaleY(1)',
            mixBlendMode: 'multiply'
          }}>
            <Image
              src="/images/g logo.png"
              alt="Decorative Arrow"
              width={600}
              height={40}
              className="w-64 h-66 lg:w-116 lg:h-116 object-contain"
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative px-4 py-20">
          <div className="text-white space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight">
              Study Destinations
            </h1>
            <p className="text-lg max-w-2xl font-medium text-white">
              Explore our comprehensive range of study destinations and test preparation programs. 
              From Ivy League universities to specialized test prep, we guide you every step of the way.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="
              text-white px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1f2937]
              rounded-tr-4xl shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)] text-base font-semibold
              hover:bg-black hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)] 
              flex items-center justify-center gap-2
              transition-all hover:opacity-90
            "
              >
                Get Free Counselling
              </button>

              <button
                className="
              text-black/80 px-6 sm:px-8 py-2.5 sm:py-3 bg-white
              rounded-tr-4xl shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)] text-base  font-semibold
              transition-all hover:bg-black hover:text-white hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)] 
            "
              >
                Check Your Eligibility
              </button>
            </div>
          </div>
          <div className="relative w-full h-[400px] lg:h-[500px]">
            <div
              className="w-full h-full bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop')",
              }}
            />
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-[3rem] font-bold mb-2" style={{ color: '#FF6B35' }}>
              Choose Your Destination
            </h2>
            <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
              Select from our range of study destinations and test preparation programs 
              designed to help you achieve your academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((destination, index) => {
              const IconComponent = destination.icon;
              return (
                <motion.div
                  key={destination.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/${destination.slug}`}>
                    <div className="
                      relative bg-white border border-[#FF6B35]
                      rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                      transition-all duration-300 hover:shadow-xl cursor-pointer
                      h-full flex flex-col
                    ">
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
                          h-[200px] sm:h-[220px] lg:h-[220px]
                          rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                        "
                      >
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg';
                          }}
                        />
                        <div
                          className="
                            absolute inset-0 bg-black/40
                            flex flex-col items-center justify-center text-center px-4
                            rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                            pointer-events-none
                          "
                        >
                          <IconComponent className="w-16 h-16 text-white mb-4" />
                          <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">
                            {destination.name}
                          </h3>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-6 text-center flex-1 flex flex-col justify-between">
                        <p className="text-gray-800 text-base font-medium mb-4">
                          {destination.description}
                        </p>

                        <button
                          className="
                            bg-[#FF6B35] hover:bg-[#e85f2f]
                            text-white text-sm font-semibold
                            px-5 py-2 rounded transition-colors
                            mt-auto
                          "
                        >
                          Explore More »
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="py-20 bg-[#f9f5f2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Why Choose Our Destinations?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We provide comprehensive support for all your study abroad needs. 
                From university selection to test preparation, our expert team guides 
                you through every step of your journey.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FF6B35] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Expert Guidance</h4>
                    <p className="text-gray-600">
                      Our experienced counselors provide personalized guidance tailored to your academic goals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#FF6B35] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Proven Track Record</h4>
                    <p className="text-gray-600">
                      Thousands of successful students have achieved their dreams with our support.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#FF6B35] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Comprehensive Support</h4>
                    <p className="text-gray-600">
                      From application to visa processing, we're with you every step of the way.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop"
                  alt="Study Abroad"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: '#FF6B35' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white text-xl mb-10 max-w-3xl mx-auto">
            Contact us today to learn more about our destinations and how we can help you achieve your study abroad goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact">
              <button className="bg-white text-[#FF6B35] px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-all" style={{ borderTopRightRadius: '25px' }}>
                Contact Us
              </button>
            </Link>
            <Link href="/service">
              <button className="bg-transparent border-2 border-white text-white px-10 py-4 font-bold text-lg hover:bg-white hover:text-[#FF6B35] transition-all" style={{ borderTopRightRadius: '25px' }}>
                Our Services
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
