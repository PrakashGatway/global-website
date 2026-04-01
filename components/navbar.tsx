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
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import axiosInstance from "@/app/axiosInstance"
import { useGlobal } from "@/src/statecontext"
import MultiStepForm from "./PopupForm"

// ================= STATIC UNIVERSITIES DATA =================
// Replace this data with your actual database later
const GROUP_UNIVERSITIES_DATA = {
  // Italy Universities Group
  "italy": [
    {
      _id: "uni-1",
      name: "University of Bologna",
      slug: "university-of-bologna",
      image: "/images/universities/bologna.png",
      location: "Bologna, Italy",
    },
    {
      _id: "uni-2",
      name: "Sapienza University of Rome",
      slug: "sapienza-university-rome",
      image: "/images/universities/sapienza.png",
      location: "Rome, Italy",
    },
    {
      _id: "uni-3",
      name: "University of Milan",
      slug: "university-of-milan",
      image: "/images/universities/milan.png",
      location: "Milan, Italy",
    },
    {
      _id: "uni-4",
      name: "Politecnico di Milano",
      slug: "politecnico-milano",
      image: "/images/universities/polimi.png",
      location: "Milan, Italy",
    },
  ],

  // France Universities Group
  "france": [
    {
      _id: "uni-5",
      name: "Sorbonne University",
      slug: "sorbonne-university",
      image: "/images/universities/sorbonne.png",
      location: "Paris, France",
    },
    {
      _id: "uni-6",
      name: "University of Paris",
      slug: "university-of-paris",
      image: "/images/universities/paris.png",
      location: "Paris, France",
    },
    {
      _id: "uni-7",
      name: "Sciences Po",
      slug: "sciences-po",
      image: "/images/universities/sciencespo.png",
      location: "Paris, France",
    },
  ],

  // Dubai Universities Group
  "dubai": [
    {
      _id: "uni-8",
      name: "American University in Dubai",
      slug: "american-university-dubai",
      image: "/images/universities/aud.png",
      location: "Dubai, UAE",
    },
    {
      _id: "uni-9",
      name: "University of Dubai",
      slug: "university-of-dubai",
      image: "/images/universities/ud.png",
      location: "Dubai, UAE",
    },
    {
      _id: "uni-10",
      name: "Dubai Medical College",
      slug: "dubai-medical-college",
      image: "/images/universities/dmc.png",
      location: "Dubai, UAE",
    },
  ],

  // German Universities Group
  "germany": [
    {
      _id: "uni-11",
      name: "Technical University of Munich",
      slug: "tum",
      image: "/images/universities/tum.png",
      location: "Munich, Germany",
    },
    {
      _id: "uni-12",
      name: "Heidelberg University",
      slug: "heidelberg-university",
      image: "/images/universities/heidelberg.png",
      location: "Heidelberg, Germany",
    },
    {
      _id: "uni-13",
      name: "LMU Munich",
      slug: "lmu-munich",
      image: "/images/universities/lmu.png",
      location: "Munich, Germany",
    },
  ],

  // UK Universities Group
  "uk": [
    {
      _id: "uni-14",
      name: "University of Oxford",
      slug: "oxford",
      image: "/images/universities/oxford.png",
      location: "Oxford, UK",
    },
    {
      _id: "uni-15",
      name: "University of Cambridge",
      slug: "cambridge",
      image: "/images/universities/cambridge.png",
      location: "Cambridge, UK",
    },
    {
      _id: "uni-16",
      name: "Imperial College London",
      slug: "imperial-college",
      image: "/images/universities/imperial.png",
      location: "London, UK",
    },
  ],

  // USA Universities Group
  "usa": [
    {
      _id: "uni-17",
      name: "Harvard University",
      slug: "harvard",
      image: "/images/universities/harvard.png",
      location: "Massachusetts, USA",
    },
    {
      _id: "uni-18",
      name: "Stanford University",
      slug: "stanford",
      image: "/images/universities/stanford.png",
      location: "California, USA",
    },
    {
      _id: "uni-19",
      name: "MIT",
      slug: "mit",
      image: "/images/universities/mit.png",
      location: "Massachusetts, USA",
    },
  ],
}

export default function Navbar({
  Featureitem,
  Serviceitem,
  countryres
}: {
  Featureitem?: any[],
  ServiceItem?: any[],
  countryres?: any[]
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mobileDropdown, setMobileDropdown] = React.useState(null)
  const { profile, loading, Logout } = useGlobal()
  const [isScrolled, setIsScrolled] = useState(false);
  const [Login, setLogin] = useState(false)
  const [openForm, setOpenForm] = useState(false)

  // States for university groups
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [groupUniversities, setGroupUniversities] = useState<any[]>([])

  const pathname = usePathname()

  const navbar = [
    { title: "Home", route: "/", id: 1 },
    { title: "About Us", route: "/about", id: 2 },
    { title: "Service", route: "/service", hasDropdown: true, type: "service", id: 3 },
    { title: "Destination", route: "/", hasDropdown: true, type: "country", id: 4 },
    { title: "Universities", route: "/", hasDropdown: true, type: "destination", id: 5 },
    { title: "Career", route: "/career", id: 7 },
    { title: "Contact Us", route: "/contact", id: 8 },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(prev => {
        if (!prev && scrollY > 120) return true;
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

  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/dashboard") || pathname.startsWith("/api") || pathname.startsWith("/onboarding")) {
    return null
  }

  // Load static universities for a group
  const loadGroupUniversities = (groupId: string, groupName: string) => {
    if (selectedGroup?._id === groupId) return;

    setSelectedGroup({ _id: groupId, name: groupName });
    
    // Get static data from GROUP_UNIVERSITIES_DATA
    const staticData = GROUP_UNIVERSITIES_DATA[groupId] || [];
    setGroupUniversities(staticData);
  };

  return (
    <>
      {/* ================= MAIN NAVBAR ================= */}
      <nav
        className={`
    sticky top-0 z-[999]
    bg-[#f46c44] shadow-sm 
    transition-transform duration-300 ease-in-out
    ${isScrolled ? "lg:-translate-y-1" : "lg:translate-y-0"}
  `}
      >
        <div
          className={`mx-auto max-w-[1540px] flex justify-between relative transition-all duration-500 ease-in-out lg:ease-in-out ${isScrolled ? "h-full " : ""
            }`}
        >
          {/* Left */}
          <div className={`items-center text-end px-8 gap-2 bg-white`}>
           
            <Link href="/">
              <Image
                src="/images/newlogo3.png"
                alt="Logo"
                width={800}
                height={100}
                className={`object-contain w-20 m-auto py-3 lg:w-28 lg:ml-10 ${isScrolled ? " " : ""}`}
                priority
              />
            </Link>
          </div>

          <div className={`flex flex-col ${isScrolled ? "justify-center " : "item-center gap-6 px-15"} `}>
            {!isScrolled && (
              <>
                <div className="w-full justify-end items-center gap-6 lg:flex hidden z-10 px-4 text-white">
                  <div className="bg-[#6d1901] flex justify-center items-center gap-2 px-4 py-0.5 text-sm font-medium gap-8">
                    <a href="tel:+919876543210" className="flex items-center gap-2 hover:opacity-80 transition font-medium">
                      <span>Consult With Expert:</span>
                      <span className="font-semibold text-yellow-300">+91 9887120429</span>
                    </a>
                    {Login ? (
                      <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
                        <span className={`w-3 h-3 bg-yellow-300 rounded-full`}></span>
                        Dashboard
                      </Link>
                    ) : (
                      <a href="/login" className={`flex items-center gap-2 hover:opacity-80 transition ${Login ? "hidden" : "block"} `}>
                        <span className={`w-3 h-3 bg-yellow-300 rounded-full`}></span>
                        Student Login
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ================= DESKTOP MENU ================= */}
            <div className={`hidden lg:flex items-center gap-2  ${isScrolled ? "justify-center" : "justify-center pb-4"} `}>
              {navbar?.map((item, i) => (
                <div key={i} className="relative group">
                  <Link
                    href={item.route}
                    className="flex items-center gap-1 px-4 text-[15px] font-medium text-white hover:text-[var(--primary)] transition"
                  >
                    <span>{item.title}</span>
                    {item.hasDropdown && <ChevronDown size={14} className="mt-[2px]" />}
                  </Link>

                  {/* ================= DESKTOP DROPDOWN ================= */}
                  {item.hasDropdown && (
                    <div
                      className="
                absolute -left-[10px] top-full mt-6 -translate-x-1/2
                opacity-0 invisible scale-95
                group-hover:opacity-100 group-hover:visible group-hover:scale-100
                transition-all duration-300 ease-out
                z-50
              "
                    >
                      <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] w-[700px] p-5 border border-gray-100">
                        
                        {/* LOGIC FOR UNIVERSITIES DROPDOWN */}
                        {item.type === "destination" ? (
                          <div className="flex gap-6 ">
                            {/* LEFT COLUMN: Groups List */}
                            <div className="w-1/3 border-r border-gray-100 ">
                              <h3 className="text-sm font-semibold text-gray-800 mb-3 px-1">
                                Top Groups
                              </h3>
                              <div className="space-y-1">
                                {Featureitem?.map((group) => {
                                  const groupSlug = group.slug || group._id;
                                  const groupHref = `/universities/group/${groupSlug}`;
                                  
                                  return (
                                    <div key={group._id} className="relative">
                                      {/* Make the entire row clickable as a link */}
                                      <Link
                                        href={groupHref}
                                        onMouseEnter={() => loadGroupUniversities(groupSlug, group.navbarTitle)}
                                        onClick={() => loadGroupUniversities(groupSlug, group.navbarTitle)}
                                        className={`
                                          w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm
                                          ${selectedGroup?._id === groupSlug
                                            ? "bg-[var(--primary)] text-white shadow-md" 
                                            : "hover:bg-gray-100 text-gray-700"}
                                        `}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-full bg-white overflow-hidden flex-shrink-0">
                                             <Image 
                                                src={group?.navbarImage || "/placeholder.png"} 
                                                alt={group.navbarTitle} 
                                                width={24} height={24} 
                                                className="object-cover w-full h-full"
                                             />
                                          </div>
                                          <span className="font-medium truncate">{group.navbarTitle}</span>
                                        </div>
                                        {selectedGroup?._id === groupSlug && <ChevronRight size={14} />}
                                      </Link>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* RIGHT COLUMN: Universities List */}
                            <div className="w-2/3 pl-2">
                              <h3 className="text-sm font-semibold text-gray-800 mb-3 px-1">
                                {selectedGroup ? `Universities in ${selectedGroup.name}` : "Select a Group"}
                              </h3>
                              
                              {selectedGroup ? (
                                groupUniversities.length > 0 ? (
                                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                    {groupUniversities.map((uni) => (
                                      <Link
                                        key={uni._id}
                                        href={`/universities/${uni.slug}`}
                                        className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl hover:bg-[var(--primary)] hover:text-white transition group/item"
                                      >
                                        <div className="w-10 h-10 rounded-full bg-white shadow overflow-hidden flex-shrink-0">
                                          <Image
                                            src={uni?.image || "/placeholder.png"}
                                            alt={uni?.name}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                          />
                                        </div>
                                        <div className="overflow-hidden">
                                          <p className="font-semibold text-sm truncate">{uni.name}</p>
                                          <p className="text-xs opacity-70 truncate">{uni.location || "View Details"}</p>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-400 text-sm">
                                    No universities found in this group.
                                  </div>
                                )
                              ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                  <GraduationCap size={32} className="mb-2 opacity-50" />
                                  <span className="text-xs">see universities</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // DEFAULT DROPDOWN FOR SERVICE & COUNTRY
                          <>
                            {item.type === "destination" && (
                              <div className="mb-4 px-1">
                                <h3 className="text-sm font-semibold text-gray-800">Top Group</h3>
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
                                      ? `/${uni.slug}`
                                      : `/universities/group/${uni.slug}`;

                                return (
                                  <Link
                                    key={uni._id}
                                    href={href}
                                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition"
                                  >
                                    <div className="w-10 h-10 rounded-full bg-white shadow overflow-hidden">
                                      <Image
                                        src={uni?.navbarImage || "/placeholder.png"}
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
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isScrolled && (
                <div className="relative group mr-4">
                  {Login && profile ? (
                    <>
                      <div className="flex items-center cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          {profile?.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div
                        className="
    absolute right-0 mt-3 w-56
    bg-white rounded-xl shadow-xl border border-gray-100
    opacity-0 invisible
    translate-y-2
    group-hover:opacity-100
    group-hover:visible
    group-hover:translate-y-0
    transition-all duration-300
    z-50
  "
                      >
                        <div className="p-4 border-b">
                          <p className="font-semibold text-gray-800">{profile?.name}</p>
                          <p className="text-sm text-gray-500">{profile?.email}</p>
                        </div>
                        <div className="flex flex-col text-sm ">
                          <Link href="/dashboard" className="px-4 py-3 hover:bg-gray-100 transition">Dashboard</Link>
                          <button onClick={Logout} className="text-left px-4 py-3 hover:bg-red-50 text-red-600 transition">Logout</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="">
                      <Link href="/login" className="bg-secondary text-white px-5 py-3 hover:bg-primary rounded-full text-sm font-semibold">
                        Login / Signup
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button onClick={() => setIsOpen(true)} className="lg:hidden text-gray-800 px-4">
            <Menu size={33} />
          </button>
        </div>

        {/* ================= MOBILE SIDEBAR ================= */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex h-[100vh]">
              <div className="absolute inset-0 " onClick={() => setIsOpen(false)} />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="relative w-full max-w-[300px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between px-5 border-b bg-gray-50">
                  <Image src="/images/newlogo3.png" alt="Logo" width={110} height={36} />
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-gray-200 transition">
                    <X size={22} />
                  </button>
                </div>

                <div className="flex-1 px-4">
                  {navbar.map((item) => (
                    <div key={item.title} className="rounded-xl px-2 py-1 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between py-2">
                        <Link
                          href={item.route}
                          onClick={() => { if (!item.hasDropdown) setIsOpen(false); }}
                          className="text-[15px] font-semibold text-gray-800 hover:text-[var(--primary)]"
                        >
                          {item.title}
                        </Link>
                        {item.hasDropdown && (
                          <button
                            onClick={() => setMobileDropdown(mobileDropdown === item.id ? null : item.id)}
                            className="p-2"
                          >
                            <motion.div animate={{ rotate: mobileDropdown === item.id ? 180 : 0 }} transition={{ duration: 0.25 }}>
                              <ChevronDown size={18} />
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
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden pl-4 border-l-2 border-gray-100"
                          >
                            {/* MOBILE LOGIC FOR UNIVERSITIES */}
                            {item.type === "destination" ? (
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Select Group</p>
                                {Featureitem?.map((group) => {
                                  const groupSlug = group.slug || group._id;
                                  const groupHref = `/universities/group/${groupSlug}`;
                                  
                                  return (
                                    <div key={group._id} className="mb-2">
                                      {/* Make group title clickable */}
                                      <Link
                                        href={groupHref}
                                        onClick={() => {
                                          loadGroupUniversities(groupSlug, group.navbarTitle);
                                          setIsOpen(false);
                                        }}
                                        className="w-full text-left font-medium text-sm text-[var(--primary)] mb-1 flex justify-between hover:underline"
                                      >
                                        {group.navbarTitle}
                                        {selectedGroup?._id === groupSlug && <ChevronDown size={14} />}
                                      </Link>
                                      
                                      {/* Show universities if this group is selected in mobile */}
                                      {selectedGroup?._id === groupSlug && (
                                        <div className="pl-2 space-y-1 mt-1">
                                          {groupUniversities.map(uni => (
                                            <Link
                                              key={uni._id}
                                              href={`/universities/${uni.slug}`}
                                              onClick={() => setIsOpen(false)}
                                              className="block text-xs text-gray-600 py-1 hover:text-[var(--primary)]"
                                            >
                                              • {uni.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              // Standard Mobile Dropdown
                              (item.type === "service" ? Serviceitem : item.type === "country" ? countryres : Featureitem)?.map((uni) => {
                                const href = item.type === "service" ? `/service/${uni.slug}` : item.type === "country" ? `/${uni.slug}` : `/universities/group/${uni.slug}`;
                                return (
                                  <Link
                                    key={uni._id}
                                    href={href}
                                    onClick={() => { setIsOpen(false); setMobileDropdown(null); }}
                                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                      <Image src={uni.navbarImage || "https://www.countryflags.com/wp-content/uploads/canada-flag-png-xl.png"} alt={uni.navbarTitle} width={36} height={36} className="object-cover w-20 h-full" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-medium text-gray-700">{uni.navbarTitle}</span>
                                      {uni.subTitle && <p className="text-[10px] text-gray-400">{uni.subTitle}</p>}
                                    </div>
                                  </Link>
                                );
                              })
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="p-5 border-t bg-white">
                  {!Login && !profile ? (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-center bg-[var(--primary)] text-white pb-3 rounded-xl font-semibold hover:opacity-90 transition">
                      Login/Signup
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center bg-[var(--primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
                      Dashboard
                    </Link>
                  )}
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