"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  MessageSquare,
  Target,
  FileText,
  Briefcase,
  Phone,
  Calendar,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import axiosInstance from "@/app/axiosInstance"
import { id } from "date-fns/locale"




export default function Navbar({
  Featureitem,
  Serviceitem

}: {
  Featureitem?: any[],
  ServiceItem?: any[]

}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mobileDropdown, setMobileDropdown] = React.useState(null)

  

  const pathname = usePathname()

 

  const navbar = [
    {
      title: "Home",
      route: "/"
      , id: 1

    },
    {
      title: "About Us",
      route: "/about"
      , id: 2


    },
    {
      title: "Service",
      route: "/service",
      hasDropdown: true,
      type: "service"
      , id: 3


    },
    {
      title: "Destination",
      route: "/",
      hasDropdown: true,
      type: "destination",
      id: 4


    },
    {
      title: "Blogs",
      route: "/blog"
      , id: 5


    },
    {
      title: "Events",
      route: "/events"
      , id: 6


    },
    {
      title: "Career",
      route: "/career"
      , id: 7


    },
    {
      title: "Contact Us",
      route: "/contact"
      , id: 8


    },

  ]

  // hide footer on auth pages
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/dashboard")
  ) {
    return null
  }





  return (
    <>
      <div className="relative z-999" style={{ backgroundColor: '#626262' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center py-2 text-xs sm:text-sm gap-2 sm:gap-0">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-white text-xs sm:text-sm">Contact Your Nearest Centre</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a href="/about" className="text-white hover:opacity-80 text-xs sm:text-sm">Our Centres</a>
            <button className="text-gray-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium hover:opacity-90" style={{ backgroundColor: '#ffff29' }}>Free Demo</button>
            <a href="/login" className="text-white hover:opacity-80 text-xs sm:text-sm">Student Login</a>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-[999] bg-white py-2 border-b border-gray-200">

        {/* ================= TOP BAR ================= */}
        <div className="max-w-7xl mx-auto px-4  h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/">
            <Image
              src="/images/newlogo3.png"
              alt="Logo"
              width={230}
              height={100}
              className="object-contain p-2"
              priority
            />
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden lg:flex items-center gap-2">

            {navbar?.map((item) => (
              <div key={item?.id} className="relative group">

                <Link
                  href={item.route}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-800 hover:text-orange-500 hover:bg-orange-50 transition"
                >
                  <span>{item.title}</span>

                  {item.hasDropdown && (
                    <ChevronDown size={14} className="mt-[2px]" />
                  )}
                </Link>

                {/* DESKTOP DROPDOWN */}
             {item.hasDropdown && (
  <div className="absolute left-1/2 top-full mt-5 -translate-x-1/2
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-300">

    <div className="bg-white rounded-2xl shadow-2xl w-[600px] p-5">

      <div className="grid grid-cols-2 gap-2">

        {(item.type === "destination"
          ? Featureitem
          : Serviceitem
        )?.map((uni) => (
          <Link
            key={uni._id}
            href={`/${item.type}/${uni.slug}`}
            className="flex items-center gap-4 p-2 rounded-xl hover:bg-blue-50 transition"
          >
            <Image
              src={uni.navbarImage || "https://www.countryflags.com/wp-content/uploads/canada-flag-png-xl.png"}
              alt={uni?.navbarTitle}
              width={40}
              height={40}
            />

            <div>
              <p className="font-semibold text-gray-900">
                {uni?.navbarTitle}
              </p>
              <p className="text-sm text-gray-500">
                {uni.subTitle || "Study Abroad"}
              </p>
            </div>
          </Link>
        ))}

      </div>

    </div>
  </div>
)}


              </div>
            ))}

          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-gray-700"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* ================= MOBILE SIDEBAR ================= */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[70] flex">

              {/* BACKDROP */}
              <motion.div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* SIDEBAR */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="
          relative
          w-[85%]
          max-w-sm
          h-full
          bg-white
          shadow-2xl
          flex
          flex-col
          overflow-y-auto
          overscroll-contain
        "
              >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={120}
                    height={40}
                  />
                  <button onClick={() => setIsOpen(false)}>
                    <X size={26} />
                  </button>
                </div>

                {/* MENU */}
                <div className="flex-1 px-6 py-4 space-y-1">

                  {navbar.map((item) => (
                    <div key={item.title} className="border-b last:border-0">

                      {/* MAIN ROW */}
                      <div className="flex items-center justify-between py-4">

                        {/* NAV LINK */}
                        <Link
                          href={item.route}
                          onClick={() => {
                            if (!item.hasDropdown) setIsOpen(false)
                          }}
                          className="text-lg font-semibold text-gray-800 hover:text-orange-500"
                        >
                          {item.title}
                        </Link>

                        {/* DROPDOWN TOGGLE */}
                      {item.hasDropdown && (
  <button
    onClick={() =>
      setMobileDropdown(
        mobileDropdown === item.id ? null : item.id
      )
    }
    className="p-2"
  >
    <motion.div
      animate={{ rotate: mobileDropdown === item.id ? 180 : 0 }}
    >
      <ChevronDown size={20} />
    </motion.div>
  </button>
)}

                      </div>

                      {/* DROPDOWN */}
                    <AnimatePresence>
  {item.hasDropdown && mobileDropdown === item.id && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden pl-5 pb-3"
    >
      {(item.type === "destination"
        ? Featureitem
        : Serviceitem
      )?.map((uni) => (
        <Link
          key={uni._id}
          href={`/${item.type}/${uni.slug}`}
          onClick={() => {
            setIsOpen(false);
            setMobileDropdown(null);
          }}
          className="flex items-center gap-3 py-3 text-gray-600 hover:text-orange-500"
        >
          <Image
            src={
              uni.navbarImage ||
              "https://www.countryflags.com/wp-content/uploads/canada-flag-png-xl.png"
            }
            alt={uni.navbarTitle}
            width={28}
            height={28}
          />
          <span className="font-medium">
            {uni.navbarTitle}
          </span>
        </Link>
      ))}
    </motion.div>
  )}
</AnimatePresence>


                    </div>
                  ))}

                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

      </nav>
    </>
  )
}
