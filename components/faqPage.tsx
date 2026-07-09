"use client"
import React, { useState } from 'react';

const FAQSection = ({ Faqres }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-5 max-w-7xl mx-auto    ">
      <div className="container   ">
        {/* Header */}
        <div className="text-justify py-5    ">
          <h2 className="text-3xl text-gray-900">
            <span className='text-xl lg:text-4xl font-light text-[#F46C44] '>Frequently</span>{" "}
            <br /><span className=' text-xl lg:text-4xl text-primary font-bold relative'>Asked Questions
            </span>
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-3">
            {Faqres && Faqres.length > 0 && (Faqres || []).map((faq, index) => (
              <div
                key={faq._id || index}
                className="bg-white rounded-xl py-4 border border-orange-200 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 lg:px-6 text-left flex justify-between items-center focus:outline-none  focus:ring-opacity-50 rounded-xl"
                >
                  <div className=" text-sm lg:text-lg font-medium text-gray-900 pr-4" dangerouslySetInnerHTML={{__html :faq.question}}/>
                 
                  <svg
                    className={`w-6 h-6 text-primary-600 flex-shrink-0 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
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
                  className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-6  ">
                    <div className="text-black text-xs lg:text-base " dangerouslySetInnerHTML={{__html :faq.answer}}/>
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