import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Background Decorative Elements - Paper Airplanes and Planes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Paper Airplane - Upper Left */}
        <div className="absolute top-20 left-[15%] opacity-30">
          <svg className="w-16 h-16 text-gray-500 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          {/* Dotted Path - Loop */}
          <svg className="absolute -left-16 -top-8 w-48 h-32 opacity-40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5">
            <path d="M0 20 Q40 0 80 10 Q120 20 160 5" stroke="currentColor" fill="none"/>
          </svg>
        </div>

        {/* Commercial Airplane - Upper Right */}
        <div className="absolute top-16 right-[15%] opacity-30">
          <svg className="w-20 h-20 text-gray-500 transform -rotate-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          {/* Dotted Path - Curve */}
          <svg className="absolute -right-20 -top-12 w-56 h-40 opacity-40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5">
            <path d="M0 30 Q30 10 60 15 Q90 20 120 8 Q150 0 180 5" stroke="currentColor" fill="none"/>
          </svg>
        </div>

        {/* Subtle Wavy Shapes - Bottom Right */}
        <div className="absolute bottom-10 right-[5%] opacity-10">
          <svg className="w-64 h-32" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 20 Q20 10 40 20 T80 20 T120 20" stroke="currentColor" fill="none"/>
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="block text-gray-900">Your Gateway to the World&apos;s</span>
              <span className="block relative inline-block" style={{ color: '#f46c44' }}>
                Top Universities
                {/* Orange Line Underneath - Full Width */}
                <span className="absolute left-0 top-full mt-1.5 inline-block h-[1px] w-full" style={{ backgroundColor: '#f46c44' }}>
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: '#f46c44' }}></span>
                </span>
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              Specialized admissions guidance for Ivy League, Russell Group, German & Italian Public Universities
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold flex items-center justify-center gap-2 transition-all" style={{ backgroundColor: '#f46c44' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e35a34'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f46c44'}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Get Free Counselling
              </button>
              <button className="bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-black transition-all">
                Check Your Eligibility
              </button>
            </div>
          </div>

          {/* Right Side: Graduation Cap Image */}
          <div className="relative w-full h-96 flex items-center justify-center overflow-hidden bg-gray-100">
            {/* Background Image with Planes - Using img tag for guaranteed visibility */}
            <img
              src="/first-page.jpg"
              alt="Background with planes"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                zIndex: 0
              }}
            />
            {/* Graduation Cap Image - Centered, allowing background to show */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
              <Image
                src="/logo-design.png"
                alt="Graduation Cap and Cityscape"
                width={500}
                height={320}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

