import Image from "next/image";
import Navigation from "@/components/Navigation";
import UniversitySliderClient from "@/components/UniversitySliderClient";
import TrustTabs from "@/components/TrustTabs";
import ImageTestimonial from "@/components/ImageTestimonial";
import { Footer } from "@/components/Footer";

export default function Home() {


  const shapePath = `
    M 50 8
    Q 20 8 15 35
    L 15 165
    Q 15 192 42 196
    L 250 184
    Q 285 184 290 155
    L 290 45
    Q 290 20 265 20
    L 50 8
    Z
  `;


  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-5 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden max-w-full" style={{ paddingTop: '80px', overflowX: 'hidden' }}>
        {/* Background Image with Planes - Positioned below Countries nav */}
        <div className="absolute hidden md:block" style={{
          zIndex: 1,
          top: '-90px',
          left: '0',
          width: '100%',
          height: '800px',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          <img
            src="/first page.jpg"
            alt="Background with planes"
            className="w-full h-full"
            style={{
              display: 'block',
              objectFit: 'cover',
              objectPosition: 'top left',
              opacity: 0.75,
              maxWidth: '100%'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            <div className="ml-8 lg:ml-16 mt-8 lg:mt-10">
              <h1 className="text-3xl font-bold mb-4 leading-tight">
                <span className="block text-gray-600 whitespace-nowrap">Your Gateway to the World&apos;s</span>
                <span className="block relative inline-block mt-2" style={{ color: '#f46c44' }}>
                  Top Universities
                  {/* Orange Line Underneath - Full Width */}
                  <span className="absolute left-0 top-full mt-1.5 inline-block h-[1px] w-full" style={{ backgroundColor: '#f46c44' }}>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: '#f46c44' }}></span>
                  </span>
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Specialized admissions guidance for <span style={{ color: '#f46c44', fontWeight: 'bold' }}>Ivy League, Russell Group, German & Italian Public Universities</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-25" style={{ perspective: '1000px' }}>
                <button className="text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-base sm:text-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ backgroundColor: '#f46c44', transform: 'perspective(1000px) rotateY(12deg)', transformStyle: 'preserve-3d', borderRadius: '16px' }}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Get Free Counselling
                </button>
                <button className="text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-base sm:text-lg font-semibold hover:bg-black transition-all" style={{ backgroundColor: '#1f2937', transform: 'perspective(1000px) rotateY(15deg)', transformStyle: 'preserve-3d', borderRadius: '16px' }}>
                  Check Your Eligibility
                </button>
              </div>
            </div>
            <div className="relative w-full overflow-visible flex justify-end pr-8">
              {/* Decorative Image Section - Graduation Cap with Cityscape */}
              <div className="relative w-full h-[450px] overflow-visible" style={{ backgroundColor: 'transparent', paddingRight: '20px' }}>
                {/* Graduation Cap Image */}
                <div className="absolute inset-0 flex items-center justify-end" style={{ zIndex: 10, right: '-100px', paddingRight: '20px' }}>
                  <Image
                    src="/logo-design.png"
                    alt="Graduation Cap and Cityscape"
                    width={600}
                    height={400}
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="pt-8 pb-16 overflow-hidden" style={{ marginTop: '-30px' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-16 h-16 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold text-gray-800 mb-2">97%</div>
                    <div className="text-lg text-gray-600 leading-relaxed">
                      <div className="whitespace-nowrap">Application Acceptance</div>
                      <div>in Public Universities</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-16 h-16 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold text-gray-800 mb-2">#1</div>
                    <div className="text-lg text-gray-600 leading-relaxed">
                      <div>Consultancy for</div>
                      <div>Top-Tier Programs</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-16 h-16 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold text-gray-800 mb-2">5000+</div>
                    <div className="text-lg text-gray-600 leading-relaxed">
                      <div>Successful</div>
                      <div>Student Applications</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-16 h-16 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold text-gray-800 mb-2">15+</div>
                    <div className="text-lg text-gray-600 leading-relaxed">
                      <div>Years of</div>
                      <div>Expert Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UniversitySliderClient />

      {/* Why GAway Global Section */}
      <section className="py-15 bg-white overflow-hidden 
      bg-[url('/bg-02.jpg')]
      bg-cover
      bg-center
      bg-no-repeat relative"> 
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden
        ">
          <h2 className="text-5xl font-bold text-center mb-12">
            <span style={{ color: '#f46c44' }}>Why</span>{" "}
            <span className="text-gray-600">GAway Global ?</span>
          </h2>
          <div className="relative">
            {/* Horizontal Line with circles at ends */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#f46c44' }}>
              {/* Left circle */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: '#f46c44' }}></div>
              {/* Right circle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: '#f46c44' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative pt-20">
              {/* Point 1 - Specialized ONLY */}
              <div className="text-center relative">
                {/* Vertical line - stops before text */}
                <div className="absolute w-0.5 h-12 left-1/2 -translate-x-1/2" style={{ backgroundColor: '#6b7280', top: '-80px', zIndex: 1 }}></div>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-3 bg-white relative z-10" style={{ borderColor: '#f46c44' }}>
                    <svg className="w-10 h-10" style={{ color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {/* Text container with white background to hide line */}
                  <div className="relative z-10 px-2 py-1 inline-block">
                    <h3 className="text-2xl font-semibold mb-2" style={{ color: '#6b7280' }}>
                      Specialized ONLY
                    </h3>
                    <p className="text-xl leading-relaxed mt-1" style={{ color: '#f46c44' }}>
                      in elite admissions
                    </p>
                  </div>
                </div>
              </div>

              {/* Point 2 - 10+ yrs experience */}
              <div className="text-center relative">
                {/* Vertical line - stops before text */}
                <div className="absolute w-0.5 h-12 left-1/2 -translate-x-1/2" style={{ backgroundColor: '#6b7280', top: '-80px', zIndex: 1 }}></div>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-3 bg-white relative z-10" style={{ borderColor: '#f46c44' }}>
                    <svg className="w-10 h-10" style={{ color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  {/* Text container with white background to hide line */}
                  <div className="relative z-10 px-2 py-1 inline-block">
                    <h3 className="text-2xl font-semibold mb-1" style={{ color: '#f46c44' }}>
                      10+ <span style={{ color: '#6b7280' }}>yrs</span>
                    </h3>
                    <p className="text-xl leading-relaxed" style={{ color: '#6b7280' }}>
                      experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Point 3 - Transparent process */}
              <div className="text-center relative">
                {/* Vertical line - stops before text */}
                <div className="absolute w-0.5 h-12 left-1/2 -translate-x-1/2" style={{ backgroundColor: '#6b7280', top: '-80px', zIndex: 1 }}></div>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-3 bg-white relative z-10" style={{ borderColor: '#f46c44' }}>
                    <svg className="w-10 h-10" style={{ color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                  </div>
                  {/* Text container with white background to hide line */}
                  <div className="relative z-10 px-2 py-1 inline-block">
                    <h3 className="text-xl font-semibold mb-1" style={{ color: '#f46c44' }}>
                      Transparent process
                    </h3>
                    <p className="text-lg leading-relaxed" style={{ color: '#6b7280' }}>
                      (No hidden fees)
                    </p>
                  </div>
                </div>
              </div>

              {/* Point 4 - Country-specific experts */}
              <div className="text-center relative">
                {/* Vertical line - stops before text */}
                <div className="absolute w-0.5 h-12 left-1/2 -translate-x-1/2" style={{ backgroundColor: '#6b7280', top: '-80px', zIndex: 1 }}></div>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-3 bg-white relative z-10" style={{ borderColor: '#f46c44' }}>
                    <svg className="w-10 h-10" style={{ color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  {/* Text container with white background to hide line */}
                  <div className="relative z-10 px-2 py-1 inline-block">
                    <h3 className="text-xl font-semibold mb-1" style={{ color: '#f46c44' }}>
                      Country-specific
                    </h3>
                    <p className="text-xl leading-relaxed" style={{ color: '#f46c44' }}>
                      experts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partner Section */}
      <section className="py-18 overflow-hidden w-full 
      bg-[url('/bg-01.jpg')]
      bg-cover
      bg-center
      bg-no-repeat relative" >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/30 z-0"></div>
        <div className="w-full px-4 sm:px-6 lg:px-8 overflow-hidden ml-8 relative z-10
        ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* LEFT IMAGE STACK - Tilted Container */}
            <div className="relative flex items-center justify-center">
              {/* Main Container - Tilted Counter-clockwise (No Orange Border) */}
              <div className="relative w-full max-w-[500px] h-[500px]  rounded-[28px] transform -rotate-[4deg]">
                {/* Image 2 - Middle Bottom Left, Slight Clockwise Tilt with Orange Border - YouTube Video */}
                <div className="absolute bottom-16 left-12 w-72 h-96 rounded-2xl overflow-hidden border-[2px] border-orange-500 transform rotate-[1.5deg] z-20 bg-white transition-all duration-300 ease-in-out hover:z-50 hover:scale-110 hover:shadow-2xl hover:rotate-[2deg] cursor-pointer">
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src="https://www.youtube.com/embed/aJTjHXbOlFI?start=2"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Image 3 - Bottom Right, Clockwise Tilt (On Top) with Orange Border - YouTube Video */}
                <div className="absolute bottom-8 right-8 w-64 h-80 rounded-2xl overflow-hidden border-[2px] border-orange-500 transform rotate-[7deg] z-30 bg-white transition-all duration-300 ease-in-out hover:z-50 hover:scale-110 hover:shadow-2xl hover:rotate-[8deg] cursor-pointer">
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src="https://www.youtube.com/embed/aJTjHXbOlFI?start=2"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Experience Badge - Circular Orange Badge */}
                <div className="absolute bottom-16 left-32 z-40 w-28 h-28 rounded-full bg-orange-500 border-[4px] border-white shadow-2xl flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">15</span>
                  <span className="text-xs text-white text-center leading-tight font-semibold">
                    Years of<br />Experience
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div>
              <h2 className="text-4xl font-bold leading-tight mb-6">
                <span style={{ color: '#f46c44' }}>Your Trusted Partner in</span>
                <br />
                <span className="text-gray-600">Immigration Services</span>
              </h2>

              <p className="text-lg text-gray-600 max-w-xl mb-10 leading-relaxed">
                We provide reliable guidance for study, work, and permanent residency
                applications. Our experienced team supports you at every step of your
                immigration journey.
              </p>

              {/* Tabs with Orange Line and Video */}
              <TrustTabs />

              {/* CTA Buttons */}
              <div className="mt-2 flex gap-4 items-center">
                <button className="text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all hover:opacity-90" style={{ backgroundColor: '#f46c44' }}>
                  About Us
                </button>
                <button className="text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all hover:opacity-90 ml-20" style={{ backgroundColor: '#f46c44' }}>
                  CEO & Founder
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ivy League Testimonial Section */}
      <section className="py-0 overflow-hidden bg-[url('/bg-01.jpg')]
      bg-cover
      bg-center
      bg-no-repeat relative" style={{ backgroundColor: '#ffeae5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-0">
            <span style={{ color: '#f46c44' }}>Video</span>{" "}
            <span className="text-gray-600">Testimonials</span>
          </h2>

          <div className="relative max-w-6xl mx-auto overflow-x-hidden">
            {/* Outer Pink Background */}
            <div className="relative rounded-[80px] p-12 overflow-hidden lg:overflow-visible" style={{ opacity: 0.85, borderColor: '#f5a899' }}>
              <div className="flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden lg:overflow-visible">
                {/* Video Container with Tilted Border */}
                <div className="flex-1 w-full lg:max-w-2xl">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900" style={{ transform: 'rotate(-0deg)', border: '15px solid #ffa78f' }}>
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/aJTjHXbOlFI"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Speech Bubble - PSD Style LEFT TILT */}
                {/* 
                🎯 TWEAK SETTINGS - Ivy League Card:
                
                1. LEFT POSITION (Line 358):
                   marginLeft: '-290px'
                   - ज्यादा LEFT: '-280px', '-300px', '-350px'
                   - कम LEFT: '-180px', '-150px', '-100px'
                
                2. HEIGHT (Line 353):
                   minHeight: '260px'
                   - ज्यादा HEIGHT: '300px', '320px', '350px'
                   - कम HEIGHT: '240px', '220px', '200px'
                
                3. UP/DOWN POSITION (Line 359):
                   marginTop: '-130px'
                   - UP (ऊपर): '-150px', '-170px', '-200px'
                   - DOWN (नीचे): '-110px', '-100px', '-80px'
                
                4. WIDTH (Line 351):
                   lg:w-96 (384px)
                   - ज्यादा WIDTH: lg:w-[400px], lg:w-[450px], lg:w-[500px]
                   - कम WIDTH: lg:w-80 (320px), lg:w-72 (288px), lg:w-64 (256px)
                
                5. ROTATION (Line 355):
                   rotateY(-28deg) - tilt angle
                   - ज्यादा tilt: '-35deg', '-40deg'
                   - कम tilt: '-20deg', '-15deg'
                */}
                <div
                  className="w-full lg:w-96 relative mt-8 lg:mt-0 ivy-league-card overflow-hidden"
                  style={{
                    minHeight: '260px',
                    maxWidth: '100%',
                    padding: '25px 40px 25px 35px',
                  }}
                >
                  {/* SVG Border with Background - Same as Image Testimonials */}
                  <svg
                    viewBox="0 0 300 200"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {/* Background fill */}
                    <path
                      d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z"
                      fill="#374151"
                    />
                    {/* Border stroke */}
                    <path
                      d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z"
                      fill="none"
                      stroke="#f46c44"
                      strokeWidth="3"
                    />
                  </svg>

                  {/* Content inside border */}
                  <div className="relative z-10 h-full flex flex-col overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                    <h3 className="text-xl lg:text-2xl font-bold mb-2 text-center break-words" style={{ color: '#d4ff00', wordWrap: 'break-word', overflowWrap: 'break-word', minWidth: 0 }}>Ivy League</h3>
                    <p className="text-white text-xs lg:text-sm leading-relaxed flex-1 break-words overflow-hidden" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', minWidth: 0, width: '100%', maxWidth: '100%' }}>
                      My <span style={{ color: '#d4ff00' }} className="font-semibold">Ivy League</span> admit was made possible by gaway global's{' '}
                      <span style={{ color: '#d4ff00' }} className="font-semibold">extensive admissions counselling support</span>{' '}
                      with my applications. Moreover, their online portal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows - Bottom Right of Container */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 z-50">
              <button className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#f46c44' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#f46c44' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Testimonials Section */}
      <ImageTestimonial />

      {/* Top Universities Hub Section */}
      <section className="py-10 overflow-hidden" style={{ backgroundColor: '#ffeae5' }}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">

    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">
        <span style={{ color: '#f46c44' }}>Top Universities</span>{" "}
        <span className="text-gray-700">Hub</span>
      </h2>
      <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
        Explore globally recognized university groups across major study destinations,
        carefully curated for ambitious international students.
      </p>
    </div>

    {/* Universities Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">

      {/* Ivy League */}
      <div className="text-center group">
        <div className="relative mx-auto w-full max-w-[280px] mb-6">
          <svg viewBox="0 0 300 200" className="w-full h-auto" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
            <defs>
              <clipPath id="tiltedClip1">
                <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z" />
              </clipPath>
            </defs>
            <image
              href="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop"
              x="0" y="0" width="300" height="200"
              clipPath="url(#tiltedClip1)"
              preserveAspectRatio="xMidYMid slice"
            />
            <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z"
              fill="none"
              stroke="#f46c44"
              strokeWidth="3" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Ivy League Universities
        </h3>
        <p className="text-sm font-medium" style={{ color: '#f46c44' }}>
          America&apos;s most prestigious institutions
        </p>
      </div>

      {/* Russell Group */}
      <div className="text-center group">
        <div className="relative mx-auto w-full max-w-[280px] mb-6">
          <svg viewBox="0 0 300 200" className="w-full h-auto" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
            <defs>
              <clipPath id="tiltedClip2">
                <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z" />
              </clipPath>
            </defs>
            <image
              href="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop"
              x="0" y="0" width="300" height="200"
              clipPath="url(#tiltedClip2)"
              preserveAspectRatio="xMidYMid slice"
            />
            <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z"
              fill="none"
              stroke="#f46c44"
              strokeWidth="3" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Russell Group Universities
        </h3>
        <p className="text-sm font-medium" style={{ color: '#f46c44' }}>
          Leading UK research universities
        </p>
      </div>

      {/* TU9 */}
      <div className="text-center group">
        <div className="relative mx-auto w-full max-w-[280px] mb-6">
          <svg viewBox="0 0 300 200" className="w-full h-auto" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
            <defs>
              <clipPath id="tiltedClip3">
                <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z" />
              </clipPath>
            </defs>
            <image
              href="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop"
              x="0" y="0" width="300" height="200"
              clipPath="url(#tiltedClip3)"
              preserveAspectRatio="xMidYMid slice"
            />
            <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z"
              fill="none"
              stroke="#f46c44"
              strokeWidth="3" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          TU9 & Public Universities
        </h3>
        <p className="text-sm font-medium" style={{ color: '#f46c44' }}>
          Germany&apos;s top technical institutions
        </p>
      </div>

      {/* Italian Public */}
      <div className="text-center group">
        <div className="relative mx-auto w-full max-w-[280px] mb-6">
          <svg viewBox="0 0 300 200" className="w-full h-auto" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
            <defs>
              <clipPath id="tiltedClip4">
                <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z" />
              </clipPath>
            </defs>
            <image
              href="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop"
              x="0" y="0" width="300" height="200"
              clipPath="url(#tiltedClip4)"
              preserveAspectRatio="xMidYMid slice"
            />
            <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z"
              fill="none"
              stroke="#f46c44"
              strokeWidth="3" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Italian Public Universities
        </h3>
        <p className="text-sm font-medium" style={{ color: '#f46c44' }}>
          Affordable education with global value
        </p>
      </div>

    </div>
  </div>
</section>

      {/* GA way global Blogs */}
      <section className="py-10 bg-gradient-to-b from-[#f3f3f3] to-white bg-[url('/bg-01.jpg')] bg-cover bg-center bg-no-repeat relative">
    <div className="max-w-6xl mx-auto px-4">

      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold">
          <span style={{ color: '#f46c44' }}>GA way</span>{" "}
          <span className="text-gray-600">global Blogs</span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Smart insights, expert guidance, and real updates to help you plan your
          study abroad journey with confidence.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">

        {/* CARD */}
        {[
          {
            icon: "💡",
            tag: "10 Essential",
            title: "Study Abroad Tips",
            img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
          },
          {
            icon: "🎓",
            tag: "Top 10",
            title: "Scholarships for Indian Students",
            img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop",
          },
          {
            icon: "📘",
            tag: "Complete Guide to",
            title: "Admissions Success",
            img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop",
          },
        ].map((card, i) => (
          <div key={i} className="text-center group">
            <div className="relative overflow-hidden mx-auto w-full mb-6">
              <svg viewBox="0 0 300 200" className="w-full h-auto" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
                <defs>
                  <clipPath id={`blogImageClip${i}`}>
                    <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z" />
                  </clipPath>
                </defs>
                <image
                  href={card.img}
                  x="0" y="0" width="400" height="200"
                  clipPath={`url(#blogImageClip${i})`}
                  preserveAspectRatio="xMidYMid slice"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center center" }}
                />
                <path d="M 50 8 Q 20 8 15 35 L 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 45 Q 290 20 265 20 L 50 8 Z"
                  fill="none"
                  stroke="#f46c44"
                  strokeWidth="3" />
                {/* Orange strip at bottom - aligned with border curve */}
                <path d="M 15 165 Q 15 192 42 196 L 250 184 Q 285 184 290 155 L 290 165 Q 285 192 258 196 L 42 196 Q 15 192 15 165 Z"
                  fill="#f46c44"
                  style={{ opacity: 1 }} />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Preparing for TOEFL Speaking Scoring section: Key Skills and Practice Techniques
            </h3>
            <p className="text-sm font-medium" style={{ color: '#f46c44' }}>
              Particularly for non-native English speakers, the TOEFL Speaking segment can be a difficult part.
            </p>
          </div>
        ))}

      </div>
    </div>
    </section>

      <Footer />

    </div>
  );
}

