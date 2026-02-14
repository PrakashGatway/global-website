"use client"
import React, { useState } from 'react';

const FAQSection = ({ Faqres }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 lg:py-20 px-4   max-w-7xl mx-auto ">
      <div className="container   ">
        {/* Header */}
        <div className="text-justify mb-12 lg:mb-16    ">
          <h2 className="text-3xl   text-gray-900 mb-4 ">
            <span className=' text-xl lg:text-5xl text-secondary '>Frequently</span>{" "}
            
            <br /><span className=' text-xl lg:text-6xl text-primary font-bold relative'>Asked Questions
              
        <span className="absolute right-0 -bottom-1 w-25 h-[2px] lg:h-1 bg-red-600"></span>
              </span> 

          </h2>
         
        </div>

        {/* FAQ Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4">
            {(Faqres || []).map((faq, index) => (
              <div
                key={faq._id || index}
                className="bg-white rounded-xl shadow-sm border border-secondary overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 lg:px-6 py-3 lg:py-5 text-left flex justify-between items-center focus:outline-none  focus:ring-opacity-50 rounded-xl"
                >
                  <span className=" text-base lg:text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-primary-600 flex-shrink-0 transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                    
                   
                  </div>
                </div>
              </div>
            ))}
          </div>

      
        </div>
      </div>
    </section>
  );
};

export default FAQSection;