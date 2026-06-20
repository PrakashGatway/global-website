"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
// import ThreeDButton from "./3dbutton"

export function Footer({ Featureitem = [], Serviceitem = [], countryres = [],footerData=[] }: any) {

  const pathname = usePathname()
  const getCurrentYear = () => new Date().getFullYear();

  // hide footer on auth pages
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/consultant") || pathname.startsWith("/thank-you")
  ) {
    return null
  }

  return (
    <>
      {/* Footer */}
      <footer className="bg-secondary pt-3 overflow-visible relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 overflow-visible">
          {/* ================= MAIN FOOTER CARD with Orange Border ================= */}
          <div className="rounded-[50px] px-6 md:px-12 pt-8 pb-12 relative">
            <div className="flex flex-col lg:flex-row">
              {/* CONTENT AREA WITH DIVIDERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

                {/* BRAND - Now with social icons at bottom */}
                <div className="w-full lg:w-60 pr-0 lg:pr-8 mb-10 lg:mb-0 relative flex flex-col h-full">
                  <Image
                    src="/images/footer-logo.png"
                    alt="Ooshas Global"
                    width={130}
                    loading="lazy"
                    height={50}
                    className="mb-4 text-white"
                  />
                  <h3 className="text-xl font-bold text-gray-100 mb-3">Ooshas Global</h3>
                  <p className="text-gray-100 text-sm leading-relaxed mb-6">
                    Your trusted partner for global education, university admissions, and international study planning.
                  </p>

                  {/* Social Icons moved here */}
                  <div className="mt-auto">
                    <h4 className="text-gray-100 font-bold text-lg mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                      <a
                        href="https://www.instagram.com/ooshasglobal"
                        target="_blank"
                        rel="noopener noreferrer"
                         aria-label="Visit Ooshas Global Instagram page"
                        className="text-gray-100 hover:text-[#f46c44] transition-all duration-300 hover:translate-y-[-2px]"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                      <a
                        href="https://www.facebook.com/share/18vb1scYJk/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                         aria-label="Visit Ooshas Global facebook page"
                        className="text-gray-100 hover:text-[#f46c44] transition-all duration-300 hover:translate-y-[-2px]"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                      <a
                        href="https://www.linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                         aria-label="Visit Ooshas Global linkedin page"
                        className="text-gray-100 hover:text-[#f46c44] transition-all duration-300 hover:translate-y-[-2px]"
                      >
                        <Linkedin className="w-6 h-6" />
                      </a>
                      <a
                        href="https://youtube.com/@ooshasglobal"
                        target="_blank"
                         aria-label="Visit Ooshas Global youtube page"
                        rel="noopener noreferrer"
                        className="text-gray-100 hover:text-[#f46c44] transition-all duration-300 hover:translate-y-[-2px]"
                      >
                        <Youtube className="w-6 h-6" />
                      </a>
                    </div>
                  </div>

                  <div className="hidden lg:block absolute right-0 top-0 w-[1px] h-full bg-white rounded-full" />
                </div>

                {/* STUDY DESTINATIONS */}
                <div className="px-2 relative">
                  <div className="h-full flex flex-col">
                    <h4 className="text-gray-100 font-bold text-lg mb-4">
                      Top Group of Universities
                    </h4>

                    <ul className="list-disc pl-2 space-y-2 text-gray-100 text-sm">
                    {Featureitem.map((item) => (
                        <li key={item._id}  className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
                          <Link href={`/universities/group/${item.slug}`}>
                            {item?.navbarTitle}
                          </Link>
                        </li>
                    ))}
                    </ul>
                  </div>

                  {/* Divider only on lg */}
                  <div className="hidden lg:block absolute right-0 top-0 w-[1px] h-full bg-white rounded-full" />
                </div>

                {/* SERVICES */}
                <div className="px-2 relative">
                  <div className="h-full flex flex-col">
                    <h4 className="text-gray-100 font-bold text-lg mb-4">
                      Our Services
                    </h4>

                    <ul  className=" list-disc pl-2 space-y-2 text-gray-100 text-sm">
                    {Serviceitem.map((item) => (
                        <li key={item._id} className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
                          <Link href={`/service/${item.slug}`}>
                            {item?.navbarTitle}
                          </Link>
                        </li>
                    ))}
                    </ul>
                  </div>

                  {/* Divider only on lg */}
                  <div className="hidden lg:block absolute right-0 top-0 w-[1px] h-full bg-white rounded-full" />
                </div>

                {/* RESOURCES */}
                <div className="px-2 relative">
                  <div className="h-full flex flex-col">
                    <h4 className="text-gray-100 font-bold text-lg mb-4">
                      Quick Links
                    </h4>

                    <ul className="list-disc pl-2 space-y-2 text-gray-100 text-sm">
                      <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
                        <Link href="/">Home</Link>
                      </li>
                      <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
                        <Link href="/about">About</Link>
                      </li>
                      <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
                        <Link href="/contact">Contact</Link>
                      </li>
                      <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
                        <Link href="/career">Career</Link>
                      </li>
                      <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
                        <Link href="/blog">Blogs</Link>
                      </li>
                      <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
                        <Link href="/events">Events & Webinars</Link>
                      </li>
                    </ul>
                  </div>

                  {/* Divider only on lg */}
                  <div className="hidden lg:block absolute right-0 top-0 w-[1px] h-full bg-white rounded-full" />
                </div>

                {/* TOP LOCATIONS - Replacing Connect section */}
                <div className="px-2">
                  <div className="h-full flex flex-col">
                    <h4 className="text-gray-100 font-bold text-lg mb-4">
                      We Serve
                    </h4>

                    {footerData && footerData.length > 0 ? (
                      <ul className="list-disc pl-2 space-y-2 text-gray-100 text-sm">
                        {footerData.reverse().map((country) => (
                          <li 
                            key={country._id || country.slug}
                            className="cursor-pointer text-sm transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2"
                          >
                            <Link href={`/${country.slug}`}>
                              {country.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-2 text-gray-100 text-sm">
                       
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-100 gap-4">
            <p>© {getCurrentYear()} Ooshas Global. All rights reserved.</p>

            <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
              <a href="privacy-policy" className="hover:text-orange-500">Privacy Policy</a>
              <a href="terms-condition" className="hover:text-orange-500">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden w-full">
          <style>
            {`
              @keyframes marquee {
                from {
                  transform: translateX(0);
                }
                to {
                  transform: translateX(-50%);
                }
              }
            `}
          </style>
          
          <div 
            className="flex w-max"
            style={{
              animation: 'marquee 100s linear infinite',
            }}
            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
          >
            {/* block 1 */}
            <div className="flex-shrink-0">
              <img src="/images/footer-bg.png" className="h-[300px] w-auto" alt="footer background" />
            </div>

            {/* block 2 duplicate */}
            <div className="flex-shrink-0">
              <img src="/images/footer-bg.png" className="h-[300px] w-auto" alt="footer background" />
            </div>
            
            {/* Optional: Add a third block for extra smoothness */}
            <div className="flex-shrink-0">
              <img src="/images/footer-bg.png" className="h-[300px] w-auto" alt="footer background" />
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}