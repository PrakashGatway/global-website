"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
// import ThreeDButton from "./3dbutton"

export function Footer({ Featureitem = [],Serviceitem =[] ,countryres
  
}: {
  Featureitem?: any[]}) {

   const pathname = usePathname()

   

  // hide footer on auth pages
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/dashboard") || pathname.startsWith("/api")
  ) {
    return null
  }
  return (
    <>
      {/* Footer */}
      
      <footer className="bg-secondary  pt-32 pb-10 overflow-visible">

        

        <div className=" mx-auto px-4 sm:px-6 lg:px-16 overflow-visible">

          

          {/* ================= MAIN FOOTER CARD with Orange Border ================= */}
          <div className="rounded-[50px] px-6 md:px-12 pt-8 pb-12 relative ">

            {/* ================= TOP IMAGE STRIP with Orange Border - Positioned Upward ================= */}
           <div className="w-full mb-16 -mt-20">
           

  {/* OUTER ORANGE FRAME */}
  <div
  className="
    relative
    h-[160px] sm:h-[180px] md:h-[220px]
    rounded-[50px] sm:rounded-[60px] lg:rounded-[70px]
    bg-[#f46c44]
    shadow-xl
    p-[6px] sm:p-[10px] lg:p-0
  "
>


    {/* INNER IMAGE HOLDER */}
   <div
  className="
    absolute
    top-[6px] bottom-[6px] left-[16px] right-[16px]
    sm:top-[10px] sm:bottom-[10px] sm:left-[28px] sm:right-[28px]
    lg:top-[14px] lg:bottom-[14px] lg:left-[40px] lg:right-[40px]
    rounded-[35px] sm:rounded-[40px] lg:rounded-[45px]
    overflow-hidden
    bg-white
  "
>

      <img
        src="/images/footer-image.png"
        alt="European landmarks"
        className="w-full h-full object-cover grayscale"
      />
    </div>
    

  </div>

</div>

          <div className="text-white pb-20 ">
            <h1 className="font-bold pb-5">Choose Your Destination</h1>
            <div className="flex flex-wrap gap-5">
 {countryres.map((item,i)=>

          <Link key={i}  href={`/destination/${item?.slug}`} >
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-orange-500">{item?.navbarTitle}</span></div></Link> )} </div>  </div>
          
         


            <div className="flex flex-col lg:flex-row">

              {/* BRAND */}
              <div className="w-full lg:w-1/4 pr-0 lg:pr-8 mb-10 lg:mb-0">
                <Image
                  src="/images/footer-logo.png"
                  alt="GAway Global"
                  width={200}
                  height={50}
                  className="mb-4 text-white"
                />
                <h3 className="text-xl font-bold text-gray-100 mb-3">Ooshas Global</h3>
                <p className="text-gray-100 text-base leading-relaxed mb-6">
                  Your trusted partner for global education, university admissions, and international study planning.
                </p>

               
              </div>

              {/* CONTENT AREA WITH DIVIDERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

  {/* STUDY DESTINATIONS */}
  <div className="px-0 sm:px-4 lg:px-6 relative">
    <div className="h-full flex flex-col">
      <h4 className="text-gray-100 font-bold text-lg mb-4">
        Top Group of Universities
      </h4>

      {Featureitem.map((item) => (
        <ul
          key={item._id}
          className="space-y-2 text-gray-100 text-base"
        >
          <li
            className="
              cursor-pointer
              transition-all duration-300
              hover:text-[#f46c44]
              hover:translate-x-2
            "
          >
            <Link href={`/destination/${item.slug}`}>
              {item?.navbarTitle}
            </Link>
          </li>
        </ul>
      ))}
    </div>

    {/* Divider only on lg */}
    <div className="hidden lg:block absolute right-0 top-0 w-[2px] h-full bg-[#e87a4d] rounded-full" />
  </div>

  {/* SERVICES */}
  <div className="px-0 sm:px-4 lg:px-6 relative">
    <div className="h-full flex flex-col">
      <h4 className="text-gray-100 font-bold text-lg mb-4">
        Our Services
      </h4>

      {Serviceitem.map((item) => (
        <ul
          key={item._id}
          className="space-y-2 text-gray-100 text-base"
        >
          <li
            className="
              cursor-pointer
              transition-all duration-300
              hover:text-[#f46c44]
              hover:translate-x-2
            "
          >
            <Link href={`/service/${item.slug}`}>
              {item?.navbarTitle}
            </Link>
          </li>
        </ul>
      ))}
    </div>

    {/* Divider only on lg */}
    <div className="hidden lg:block absolute right-0 top-0 w-[2px] h-full bg-[#e87a4d] rounded-full" />
  </div>

  {/* RESOURCES */}
  <div className="px-0 sm:px-4 lg:px-6 relative">
    <div className="h-full flex flex-col">
      <h4 className="text-gray-100 font-bold text-lg mb-4">
        Resources
      </h4>

      <ul className="space-y-2 text-gray-100 text-base">
        <li
          className="
            cursor-pointer
            transition-all duration-300
            hover:text-[#f46c44]
            hover:translate-x-2
          "
        >
          <Link href="/blog">Blogs</Link>
        </li>

        <li
          className="
            cursor-pointer
            transition-all duration-300
            hover:text-[#f46c44]
            hover:translate-x-2
          "
        >
          <Link href="/events">Events & Webinars</Link>
        </li>
      </ul>
    </div>

    {/* Divider only on lg */}
    <div className="hidden lg:block absolute right-0 top-0 w-[2px] h-full bg-[#e87a4d] rounded-full" />
  </div>

  {/* CONNECT */}
  <div className="px-0 sm:px-4 lg:px-6">
    <div className="h-full flex flex-col">
      <h4 className="text-gray-100 font-bold text-lg mb-4">
        Connect
      </h4>

      <ul className="space-y-2 text-gray-100 text-base">
        <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
          Instagram
        </li>
        <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
          Facebook
        </li>
        <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
          LinkedIn
        </li>
        <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
          YouTube
        </li>
        <li className="cursor-pointer transition-all duration-300 hover:text-[#f46c44] hover:translate-x-2">
          <Link href="/contact">Contact Us</Link>
        </li>
      </ul>
    </div>
  </div>

</div>


            </div>

            

          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="mt-10 flex flex-col md:flex-row justify-between items-center text-base text-gray-100 gap-4">
            <p>© 2023 Ooshas Global. All rights reserved.</p>

            <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
              <a href="privacy-policy" className="hover:text-orange-500">Privacy Policy</a>
              <a href="terms-condition" className="hover:text-orange-500">Terms of Service</a>
            
            </div>
          </div>

        </div>
      </footer>
    
    </>
  )
}