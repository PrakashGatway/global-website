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
import { useGlobal } from "@/src/statecontext"
import MultiStepForm from "./PopupForm"




export default function Navbar({
  Featureitem,
  Serviceitem,
  countryres

}: {
  Featureitem?: any[],
  ServiceItem?: any[]

}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mobileDropdown, setMobileDropdown] = React.useState(null)
  const { profile, loading, Logout } = useGlobal()
  const [isScrolled, setIsScrolled] = useState(false);
  const [Login, setLogin] = useState(false)
  const [openForm, setOpenForm] = useState(false)






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
      type: "country",
      id: 4


    },
    {
      title: "Universities",
      route: "/",
      hasDropdown: true,
      type: "destination",
      id: 5


    },
    {
      title: "Blogs",
      route: "/blog"
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




  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setIsScrolled(prev => {
        // activate only after bigger scroll
        if (!prev && scrollY > 120) return true;

        // deactivate only when clearly back to top
        if (prev && scrollY < 60) return false;

        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  useEffect(() => {
    if (isOpen) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);




  useEffect(() => {
    const token = localStorage.getItem("token")
    setLogin(!!token)
  }, [])



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


      {/* ================= MAIN NAVBAR ================= */}
      <nav
        className={`
    sticky top-0 z-[999]
    bg-[#f46c44] shadow-sm 
    transition-transform duration-300 ease-in-out
    ${isScrolled ? "-translate-y-1" : "translate-y-0"}
  `}
      >


        <div
          className={`mx-auto  flex justify-between relative transition-all duration-500  ease-in-out ${isScrolled ? "h-full" : ""
            }`}
        >


          {/* Left */}

          <div className={`items-center text-end px-8 py-2  gap-2 bg-white    `}>

            <span className={`font-medium  ${isScrolled ? "hidden lg:hidden" : "hidden lg:block "}`} >
              Contact Your Nearest Centre
            </span>
            {/* LOGO */}
            <Link href="/">
              <Image
                src="/images/newlogo3.png"
                alt="Logo"
                width={800}
                height={100}
                className="object-contain w-36 lg:w-44 lg:ml-10"
                priority
              />
            </Link>
          </div>




          <div className={`flex flex-col    ${isScrolled ? "justify-center" : "item-center gap-6 px-15"}  `}>

            {!isScrolled && (
              <>
                {/* Right */}
                <div className=" w-full justify-end  items-center gap-6 lg:flex hidden z-10 px-4  text-white">
                  <div className="bg-[#6d1901]    flex justify-center items-center gap-2 px-4 py-2  text-sm font-medium gap-8">


                    <a
                      href="tel:+919876543210"
                      className="flex items-center gap-2 hover:opacity-80 transition font-medium"
                    >
                      <span>Consult With Expert:</span>
                      <span className="font-semibold text-yellow-300">
                        +91 9887120429
                      </span>
                    </a>


                    <button onClick={() => setOpenForm(true)} className=" text-[var(--secondary-foreground)]  text-sm font-semibold shadow hover:opacity-90 transition">
                      Free Demo
                    </button>

                    {
                      Login ? (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 hover:opacity-80 transition"
                        >
                          <span className={`w-3 h-3 bg-yellow-300 rounded-full`}></span>
                          Dashboard
                        </Link>
                      ) :
                        (
                          <a href="/login" className={`flex items-center gap-2 hover:opacity-80 transition ${Login ? "hidden" : "block"}  `}>
                            <span className={`w-3 h-3 bg-yellow-300 rounded-full`}></span>
                            Student Login
                          </a>
                        )
                    }


                  </div>

                </div>
              </>
            )}




            {/* ================= DESKTOP MENU ================= */}
            <div className={`hidden lg:flex items-end gap-2 ${isScrolled ? "flex justify-end" : "justify-center"} `} >


              {navbar?.map((item, i) => (
                <div key={i} className="relative group ">

                  <Link
                    href={item.route}
                    className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-white hover:text-[var(--primary)] transition"
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
                        {/* ===== TITLE ONLY FOR UNIVERSITIES ===== */}
                        {item.type === "destination" && (
                          <div className="mb-4 px-1">
                            <h3 className="text-sm font-semibold text-gray-800">
                              Top Group
                            </h3>
                            <div className="w-12 h-[2px] bg-[var(--primary)] mt-1 rounded-full"></div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          {(
                            item.type === "service"
                              ? Serviceitem
                              : item.type === "country"
                                ? countryres
                                : Featureitem
                          )?.map((uni) => {

                            const href =
                              item.type === "service"
                                ? `/service/${uni.slug}`
                                : item.type === "country"
                                  ? `/destination/${uni.slug}`
                                  : `/universities/group/${uni.slug}`;

                            return (
                              <Link
                                key={uni._id}
                                href={href}
                                className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition"
                              >
                                <div className="w-10 h-10 rounded-full bg-white shadow overflow-hidden">
                                  <Image
                                    src={uni?.navbarImage}
                                    alt={uni?.navbarTitle}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                  />
                                </div>

                                <div>
                                  <p className="font-semibold text-sm">{uni.navbarTitle}</p>
                                  <p className="text-xs opacity-70">{uni.subTitle}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              ))}
              {isScrolled && (
                <div className="relative group mr-4">
                  {Login && profile ? (
                    <>
                      {/* Profile Button */}
                      <div className="flex items-center cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          {profile?.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Hover Dropdown */}
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 group-hover:translate-y-0 translate-y-2
">

                        <div className="p-4 border-b">
                          <p className="font-semibold text-gray-800">
                            {profile?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {profile?.email}
                          </p>
                        </div>

                        <div className="flex flex-col text-sm">
                          <Link
                            href="/dashboard"
                            className="px-4 py-3 hover:bg-gray-100 transition"
                          >
                            Dashboard
                          </Link>

                          <button
                            onClick={Logout}
                            className="text-left px-4 py-3 hover:bg-red-50 text-red-600 transition"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-secondary text-white px-5 py-3 rounded-full text-sm font-semibold"
                    >
                      Login / Signup
                    </Link>
                  )}
                </div>
              )}



            </div>


          </div>



          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-gray-800 px-4"
          >
            <Menu size={33} />
          </button>
        </div>

        {/* ================= MOBILE SIDEBAR ================= */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] bg-black/40 flex h-[100vh] ">

              <div
                className="absolute inset-0 bg-transparent"
                onClick={() => setIsOpen(false)}
              />

              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="relative w-full  h-full bg-white shadow-2xl flex flex-col overflow-y-auto overscroll-contain"
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
                              setMobileDropdown(mobileDropdown === item.id ? null : item.id)
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
                            {/* ✅ SAME DATA SOURCE LOGIC AS DESKTOP */}
                            {(
                              item.type === "service"
                                ? Serviceitem
                                : item.type === "country"
                                  ? countryres
                                  : Featureitem
                            )?.map((uni) => {

                              // ✅ SAME ROUTE LOGIC AS DESKTOP
                              const href =
                                item.type === "service"
                                  ? `/service/${uni.slug}`
                                  : item.type === "country"
                                    ? `/destination/${uni.slug}`
                                    : `/universities/group/${uni.slug}`;

                              return (
                                <Link
                                  key={uni._id}
                                  href={href}
                                  onClick={() => {
                                    setIsOpen(false);
                                    setMobileDropdown(null);
                                  }}
                                  className="flex items-center gap-3 py-3 text-gray-600 hover:text-[var(--primary)]"
                                >
                                  <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                    <Image
                                      src={
                                        uni.navbarImage ||
                                        "https://www.countryflags.com/wp-content/uploads/canada-flag-png-xl.png"
                                      }
                                      alt={uni.navbarTitle}
                                      width={28}
                                      height={28}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium text-sm">{uni.navbarTitle}</span>
                                    {uni.subTitle && (
                                      <p className="text-xs text-gray-400">{uni.subTitle}</p>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
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

      <AnimatePresence>
        {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}

      </AnimatePresence>


    </>
  )
}
