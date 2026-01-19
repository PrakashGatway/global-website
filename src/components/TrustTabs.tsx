 'use client';

import { useState, useRef, useEffect } from 'react';

export default function TrustTabs() {
  const [activeTab, setActiveTab] = useState('trust');
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const tabs = [
    { id: 'trust', label: 'Trust' },
    { id: 'transparency', label: 'Transparency' },
    { id: 'excellence', label: 'Excellence' },
  ];

  useEffect(() => {
    const updateUnderline = () => {
      const activeButton = tabRefs.current[activeTab];
      const container = activeButton?.parentElement;
      if (activeButton && container) {
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setUnderlineLeft(buttonRect.left - containerRect.left);
      }
    };

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      setTimeout(updateUnderline, 0);
    });
    
    window.addEventListener('resize', updateUnderline);
    
    return () => {
      window.removeEventListener('resize', updateUnderline);
    };
  }, [activeTab]);

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b-2 border-gray-200 relative overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-2 text-lg font-semibold transition-colors ${
              activeTab === tab.id
                ? 'text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
        {/* Orange line extending from active tab to the right edge */}
        <div
          className="absolute bottom-0 h-0.5 transition-all duration-300"
          style={{
            left: `${underlineLeft}px`,
            width: underlineLeft > 0 ? `calc(100% - ${underlineLeft}px)` : '100%',
            backgroundColor: '#f46c44',
            transform: 'translateY(100%)',
            opacity: underlineLeft >= 0 ? 1 : 0,
          }}
        >
          {/* Small dot at the right end */}
          <span
            className="absolute rounded-full"
            style={{ 
              backgroundColor: '#f46c44',
              width: '6px',
              height: '6px',
              right: '-3px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'trust' && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Video on Left - Smaller */}
            <div className="w-full md:w-56 flex-shrink-0 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-40 md:h-48"
                src="https://www.youtube.com/embed/aJTjHXbOlFI?start=2"
                title="Trust Services"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Features List on Right */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Reliable Service</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Proven Track Record</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Secure Processing</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Trusted Partnerships</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transparency' && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Video on Left - Smaller */}
            <div className="w-full md:w-56 flex-shrink-0 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-40 md:h-48"
                src="https://www.youtube.com/embed/aJTjHXbOlFI?start=2"
                title="Transparency Services"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Features List on Right */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Clear Pricing</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">No Hidden Fees</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Open Communication</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Transparent Process</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'excellence' && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Video on Left - Smaller */}
            <div className="w-full md:w-56 flex-shrink-0 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-40 md:h-48"
                src="https://www.youtube.com/embed/aJTjHXbOlFI?start=2"
                title="Excellence Services"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Features List on Right */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Technology Growth</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Client-Focused Services</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Dedicated Team Members</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base leading-relaxed font-medium">Trusted Immigration Guidance</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

