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
 

{/* ================= MAIN NAVBAR ================= */}
<nav className="sticky top-0 z-[999] bg-orange-500 shadow-sm border-b border-gray-100 py-5">

  <div className="mx-auto px-6 h-20 flex  justify-between relative ">

      {/* Left */}
    <div className=" items-center text-end px-5 gap-2 bg-white absolute w-100 h-25 left-0 -bottom-[2px] ">
     
      <span className="font-medium">
        Contact Your Nearest Centre
      </span>
       {/* LOGO */}
    <Link href="/">
      <Image
        src="/images/newlogo3.png"
        alt="Logo"
        width={800}
        height={100}
        className="object-contain w-36 lg:w-44 lg:ml-40"
        priority
      />
    </Link>
    </div>

   <div className="grid grid-col-1 ">

      {/* Right */}
    <div className="flex items-center gap-6">

      <a href="/about" className="hover:opacity-80 transition">
        Our Centres
      </a>

      <button className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-4 py-1.5 rounded-full text-sm font-semibold shadow hover:opacity-90 transition">
        Free Demo
      </button>

      <a href="/login" className="flex items-center gap-2 hover:opacity-80 transition">
        <span className="w-2 h-2 bg-[var(--secondary)] rounded-full"></span>
        Student Login
      </a>

    </div>
    {/* ================= DESKTOP MENU ================= */}
    <div className="hidden lg:flex items-end gap-2 absolute right-0 top-10 ">
      

      {navbar?.map((item) => (
        <div key={item?.id} className="relative group ">

          <Link
            href={item.route}
            className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-gray-800 hover:text-[var(--primary)] transition"
          >
            <span>{item.title}</span>

            {item.hasDropdown && (
              <ChevronDown size={14} className="mt-[2px]" />
            )}
          </Link>

          {/* ================= DESKTOP DROPDOWN ================= */}
          {item.hasDropdown && (
            <div
              className="
                absolute left-1/2 top-full mt-6 -translate-x-1/2
                opacity-0 invisible scale-95
                group-hover:opacity-100 group-hover:visible group-hover:scale-100
                transition-all duration-300 ease-out
                z-50
              "
            >
              <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] w-[640px] p-5 border border-gray-100">

                <div className="grid grid-cols-2 gap-3">

                  {(item.type === "destination" ? Featureitem : Serviceitem)?.map(
                    (uni) => (
                      <Link
                        key={uni._id}
                        href={`/${item.type}/${uni.slug}`}
                        className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all duration-200 group/item"
                      >

                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center relative overflow-hidden">
                          <Image
                            src={
                              uni.navbarImage ||
                              "https://www.countryflags.com/wp-content/uploads/canada-flag-png-xl.png"
                            }
                            alt={uni?.navbarTitle}
                            width={28}
                            height={28}
                            className="object-cover w-full h-full rounded-full"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-sm leading-tight">
                            {uni?.navbarTitle}
                          </p>
                          <p className="text-xs opacity-70">
                            {uni.subTitle || "Test Preparation"}
                          </p>
                        </div>

                      </Link>
                    )
                  )}

                </div>
              </div>
            </div>
          )}

        </div>
      ))}

    </div>
   </div>
    
    

    {/* MOBILE TOGGLE */}
    <button
      onClick={() => setIsOpen(true)}
      className="lg:hidden text-gray-800"
    >
      <Menu size={28} />
    </button>
  </div>

  {/* ================= MOBILE SIDEBAR ================= */}
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[70] flex">

        <motion.div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col overflow-y-auto"
        >

          <div className="flex items-center justify-between px-6 py-5 border-b">
            <Image
              src="/images/newlogo3.png"
              alt="Logo"
              width={120}
              height={40}
            />
            <button onClick={() => setIsOpen(false)}>
              <X size={26} />
            </button>
          </div>

          <div className="flex-1 px-6 py-4 space-y-1">

            {navbar.map((item) => (
              <div key={item.title} className="border-b last:border-0">

                <div className="flex items-center justify-between py-4">

                  <Link
                    href={item.route}
                    onClick={() => {
                      if (!item.hasDropdown) setIsOpen(false)
                    }}
                    className="text-lg font-semibold text-gray-800 hover:text-[var(--primary)]"
                  >
                    {item.title}
                  </Link>

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
                          className="flex items-center gap-3 py-3 text-gray-600 hover:text-[var(--primary)]"
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
