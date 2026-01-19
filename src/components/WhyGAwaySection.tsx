export default function WhyGAwaySection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center text-gray-900 mb-6">
          Why <span style={{ color: '#f46c44' }}>GAway</span> Global ?
        </h2>
        <div className="relative">
          {/* Horizontal Line */}
          <div className="absolute top-16 left-0 right-0 h-1" style={{ backgroundColor: '#f46c44' }}></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative pt-12">
            {/* Point 1 */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10" style={{ backgroundColor: '#f46c44' }}>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm8-2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Specialized ONLY</h3>
              <p className="text-gray-600 text-lg leading-relaxed">in elite admissions</p>
            </div>
            
            {/* Point 2 */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10" style={{ backgroundColor: '#f46c44' }}>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">10+ yrs</h3>
              <p className="text-gray-600 text-lg leading-relaxed">experience</p>
            </div>
            
            {/* Point 3 */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10" style={{ backgroundColor: '#f46c44' }}>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm8-2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Personalized</h3>
              <p className="text-gray-600 text-lg leading-relaxed">counselling & guidance</p>
            </div>
            
            {/* Point 4 */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10" style={{ backgroundColor: '#f46c44' }}>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">High Success</h3>
              <p className="text-gray-600 text-lg leading-relaxed">rate & support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

