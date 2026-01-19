"use client"

import Image from "next/image"
import ThreeDButton from "./3dbutton"

export function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-100 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">

          {/* ================= MAIN FOOTER CARD with Orange Border ================= */}
          <div className="rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-8 sm:pb-12 relative">

            {/* ================= TOP IMAGE STRIP with Orange Border - Positioned Upward ================= */}
            <div className="w-full mb-8 sm:mb-12 -mt-12 sm:-mt-16 lg:-mt-20">
              <div className="relative h-[120px] sm:h-[150px] lg:h-[180px] rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] border-t-[5px] sm:border-t-[8px] lg:border-t-[10px] border-r-[15px] sm:border-r-[20px] lg:border-r-[30px] border-b-[5px] sm:border-b-[8px] lg:border-b-[10px] border-l-[15px] sm:border-l-[20px] lg:border-l-[30px] border-[#f46c44] overflow-hidden bg-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=300&fit=crop"
                  alt="European Landmarks"
                  className="w-full h-full object-cover grayscale"
                  style={{ objectPosition: "center center" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row gap-0">

              {/* BRAND */}
              <div className="col-span-2 md:col-span-1 lg:w-auto pr-4 md:pr-6 lg:pr-0 pb-6 md:pb-8 lg:pb-0">
                <Image
                  src="/logo.png"
                  alt="GAway Global"
                  width={200}
                  height={67}
                  className="mb-4 w-40 sm:w-48 lg:w-[200px]"
                />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">GA Way Global</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-md lg:max-w-none">
                  Your trusted partner for global education, university admissions, and international study planning.
                </p>

                <ThreeDButton children="Get In Touch" textColor="text-white" />
              </div>

              {/* Divider - Hidden on mobile/tablet, visible on large screens */}
              <span className="hidden lg:block w-[4px] h-[220px] bg-[#e87a4d] rounded-full mx-2"></span>

              {/* STUDY DESTINATIONS */}
              <div className="lg:w-auto lg:mx-5 pr-4 md:pr-6 lg:pr-0 pb-6 md:pb-8 lg:pb-0">
                <h4 className="text-orange-500 font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  Study Destinations
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm lg:w-[200px]">
                  <li>USA Universities</li>
                  <li>UK Universities</li>
                  <li>Germany Public Universities</li>
                  <li>Italy & France</li>
                  <li>Canada & Australia</li>
                </ul>
              </div>

              {/* Divider - Hidden on mobile/tablet, visible on large screens */}
              <span className="hidden lg:block w-[4px] h-[220px] bg-[#e87a4d] rounded-full mx-2"></span>

              {/* SERVICES */}
              <div className="lg:w-auto lg:mx-5 pr-4 md:pr-6 lg:pr-0 pb-6 md:pb-8 lg:pb-0">
                <h4 className="text-orange-500 font-bold text-base sm:text-lg mb-3 sm:mb-4 lg:mx-5">
                  Our Services
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm lg:w-[200px]">
                  <li>Profile Evaluation</li>
                  <li>University Shortlisting</li>
                  <li>SOP & LOR Guidance</li>
                  <li>Visa Assistance</li>
                  <li>Scholarship Support</li>
                </ul>
              </div>

              {/* Divider - Hidden on mobile/tablet, visible on large screens */}
              <span className="hidden lg:block w-[4px] h-[220px] bg-[#e87a4d] rounded-full mx-2"></span>

              {/* RESOURCES */}
              <div className="lg:w-auto lg:mx-5 pr-4 md:pr-6 lg:pr-0 pb-6 md:pb-8 lg:pb-0">
                <h4 className="text-orange-500 font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  Resources
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm lg:w-[150px]">
                  <li>Blogs</li>
                  <li>Case Studies</li>
                  <li>Student Testimonials</li>
                  <li>FAQs</li>
                  <li>Events & Webinars</li>
                </ul>
              </div>

              {/* Divider - Hidden on mobile/tablet, visible on large screens */}
              <span className="hidden lg:block w-[4px] h-[220px] bg-[#e87a4d] rounded-full mx-2"></span>

              {/* CONNECT */}
              <div className="lg:w-auto lg:mx-5 pr-4 md:pr-6 lg:pr-0 pb-0 md:pb-0 lg:pb-0">
                <h4 className="text-orange-500 font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  Connect
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm lg:w-[100px]">
                  <li>Instagram</li>
                  <li>Facebook</li>
                  <li>LinkedIn</li>
                  <li>YouTube</li>
                  <li>Contact Us</li>
                </ul>
              </div>

            </div>
          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-500 gap-3 sm:gap-4">
            <p className="text-center sm:text-left">© 2023 GAway Global. All rights reserved.</p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Cookie Policy</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  )
}
