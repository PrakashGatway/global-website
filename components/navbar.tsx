"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Phone,
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useGlobal } from "@/src/statecontext"
import MultiStepForm from "./PopupForm"

export default function Navbar({
  Serviceitem,
  countryres,
  unicat
}: {
  Serviceitem?: any[],
  countryres?: any[],
  unicat?: any[]
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mobileDropdown, setMobileDropdown] = React.useState(null)
  const { profile, loading, Logout } = useGlobal()
  const [isScrolled, setIsScrolled] = useState(false);
  const [Login, setLogin] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [countryUniversities, setCountryUniversities] = useState<any[]>([])

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

  // Get unique countries from universities data
  const getUniqueCountries = () => {
    if (!unicat || !Array.isArray(unicat)) return [];

    const countryMap = new Map();

    unicat.forEach((uni: any) => {
      const countryCode = uni.country;
      const countryName = uni.countryData?.[0]?.name;
      const countryFlag = uni.countryData?.[0]?.flg;

      if (!countryMap.has(countryCode)) {
        countryMap.set(countryCode, {
          code: countryCode,
          name: countryName,
          flag: countryFlag,
          slug: countryName?.toLowerCase().replace(/\s+/g, '-')
        });
      }
    });

    return Array.from(countryMap.values());
  };

  // <<<<<<< HEAD
  // Filter universities by country code
  const filterUniversitiesByCountry = (countryCode: string) => {
    if (!countryCode) return [];
    if (!unicat || !Array.isArray(unicat) || unicat.length === 0) return [];

    const filtered = unicat.filter((uni: any) => uni.country === countryCode);
    return filtered;
  };

  // Load universities for a specific country
  const loadCountryUniversities = (country: any) => {
    if (selectedCountry?.code === country.code) return;

    setSelectedCountry(country);

    const filteredUniversities = filterUniversitiesByCountry(country.code);
    setCountryUniversities(filteredUniversities);
  };

  const uniqueCountries = getUniqueCountries();
  // >>>>>>> dbc4de64f697e561e6b4575774845dab574d990c

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

          <div className={`flex flex-col ${isScrolled ? "justify-center " : "item-center gap-6 sm:px-15"} `}>
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
            <div className={`hidden lg:flex items-center gap-2 ${isScrolled ? "justify-center" : "justify-center pb-4"}`}>
              {navbar?.map((item, i) => (
                <div key={i} className="relative group">
                  <Link
                    href={item.route}
                    className="flex items-center gap-1 px-4 text-[15px] font-bold text-white hover:text-[var(--primary)] transition"
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
                          <div className="flex gap-6">
                            {/* LEFT COLUMN: Countries List */}
                            <div className="w-1/3 border-r border-gray-100">
                              <h3 className="text-sm font-semibold text-gray-800 mb-3 px-1">
                                Countries
                              </h3>

                              {/* 🔥 SCROLLABLE AREA */}
                              <div className="space-y-1 no-scrollbar max-h-[60vh] hide-scrollbar overflow-y-auto pr-2">
                                {uniqueCountries.map((country) => {
                                  return (
                                    <div key={country.code} className="relative">
                                      <div
                                        onMouseEnter={() => loadCountryUniversities(country)}
                                        onClick={() => loadCountryUniversities(country)}
                                        className={`
              w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm
              ${selectedCountry?.code === country.code
                                            ? "bg-[var(--primary)] text-white shadow-md"
                                            : "hover:bg-gray-100 text-gray-700"
                                          }
            `}
                                      >
                                        <div className="flex items-center gap-2">
                                          {country.flag && (
                                            <img
                                              src={country.flag}
                                              alt={country.name}
                                              className="w-5 h-5 rounded-full object-cover"
                                            />
                                          )}
                                          <span className="font-medium truncate">
                                            {country.name}
                                          </span>
                                        </div>

                                        {selectedCountry?.code === country.code && (
                                          <ChevronRight size={14} />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* RIGHT COLUMN: Universities List */}
                            <div className="w-2/3 pl-2 flex flex-col">
                              <h3 className="text-sm font-semibold text-gray-800 mb-3 px-1">
                                {selectedCountry
                                  ? `Universities in ${selectedCountry.name}`
                                  : "Select a Country"}
                              </h3>

                              {selectedCountry ? (
                                countryUniversities.length > 0 ? (
                                  // 🔥 SCROLLABLE AREA
                                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                                    {countryUniversities.map((uni) => (
                                      <Link
                                        key={uni._id}
                                        href={`/universities/${uni.slug}`}
                                        className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-[var(--primary)] hover:text-white hover:shadow-md transition group/item"
                                      >
                                        {/* ✅ Square Logo */}
                                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                                          {uni.uni_logo ? (
                                            <Image
                                              src={uni.uni_logo}
                                              alt={uni.name}
                                              width={48}
                                              height={48}
                                              className="object-contain w-full h-full p-1"
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                              <GraduationCap size={20} className="text-gray-400" />
                                            </div>
                                          )}
                                        </div>

                                        {/* Content */}
                                        <div className="overflow-hidden">
                                          <p className="font-semibold text-sm truncate group-hover/item:text-white">
                                            {uni.name}
                                          </p>
                                          <p className="text-xs opacity-70 truncate group-hover/item:text-white/80">
                                            {uni.countryData?.[0]?.name || uni.country || "View Details"}
                                          </p>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-400 text-sm">
                                    No universities found in {selectedCountry.name}
                                  </div>
                                )
                              ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                  <GraduationCap size={32} className="mb-2 opacity-50" />
                                  <span className="text-xs">
                                    Select a country to see universities
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // DEFAULT DROPDOWN FOR SERVICE & COUNTRY
                          <div className="grid grid-cols-2 gap-3">
                            {(
                              item.type === "service"
                                ? Serviceitem
                                : item.type === "country"
                                  ? countryres
                                  : uniqueCountries
                            )?.map((item: any) => {
                              const href = item.type === "service"
                                ? `/service/${item.slug}`
                                : item.type === "country"
                                  ? `/${item.slug}`
                                  : `/${item.slug}`;

                              const title = item.navbarTitle || item.name;
                              const image = item.navbarImage || item.flag;
                              const subTitle = item.subTitle || `${item.code || ''} - ${item.universityCount || 0} universities`;

                              return (
                                <Link
                                  key={item._id || item.code}
                                  href={href}
                                  className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition"
                                >
                                  <div className="w-10 h-10 rounded-full bg-white shadow overflow-hidden">
                                    <Image
                                      src={image || "/placeholder.png"}
                                      alt={title}
                                      width={40}
                                      height={40}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">{title}</p>

                                  </div>
                                </Link>
                              );
                            })}
                          </div>
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
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                        <div className="p-4 border-b">
                          <p className="font-semibold text-gray-800">{profile?.name}</p>
                          <p className="text-sm text-gray-500">{profile?.email}</p>
                        </div>
                        <div className="flex flex-col text-sm">
                          <Link href="/dashboard" className="px-4 py-3 hover:bg-gray-100 transition">Dashboard</Link>
                          <button onClick={Logout} className="text-left px-4 py-3 hover:bg-red-50 text-red-600 transition">Logout</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link href="/login" className="bg-secondary text-white px-5 py-3 hover:bg-primary rounded-full text-sm font-semibold">
                      Login / Signup
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE RIGHT ACTIONS */}
          <div className="flex items-center gap-3 pr-3 lg:hidden">
            <a href="tel:+919887120429" className="flex items-center gap-1 bg-white text-[#f46c44] px-3 py-2 rounded-full shadow-md active:scale-95 transition">
              <Phone size={16} />
              <span className="text-xs font-semibold">9887120429</span>
            </a>
            <button onClick={() => setIsOpen(true)} className="text-white bg-[#6d1901] p-2 rounded-md">
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* ================= MOBILE SIDEBAR ================= */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex h-[100vh]">
              <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
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
                        <Link href={item.route} onClick={() => { if (!item.hasDropdown) setIsOpen(false); }} className="text-[15px] font-semibold text-gray-800 hover:text-[var(--primary)]">
                          {item.title}
                        </Link>
                        {item.hasDropdown && (
                          <button onClick={() => setMobileDropdown(mobileDropdown === item.id ? null : item.id)} className="p-2">
                            <motion.div animate={{ rotate: mobileDropdown === item.id ? 180 : 0 }} transition={{ duration: 0.25 }}>
                              <ChevronDown size={18} />
                            </motion.div>
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {item.hasDropdown && mobileDropdown === item.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden pl-4 border-l-2 border-gray-100">
                            {item.type === "destination" ? (
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Select Country</p>
                                {uniqueCountries.map((country) => (
                                  <MobileCountryDropdown
                                    key={country.code}
                                    country={country}
                                    selectedCountry={selectedCountry}
                                    countryUniversities={countryUniversities}
                                    loadCountryUniversities={loadCountryUniversities}
                                    filterUniversitiesByCountry={filterUniversitiesByCountry}
                                    setIsOpen={setIsOpen}
                                    setMobileDropdown={setMobileDropdown}
                                  />
                                ))}
                              </div>
                            ) : (
                              (item.type === "service" ? Serviceitem : countryres)?.map((item: any) => {
                                const href = item.type === "service" ? `/service/${item.slug}` : `/${item.slug}`;
                                return (
                                  <Link key={item._id} href={href} onClick={() => { setIsOpen(false); setMobileDropdown(null); }} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition">
                                    <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                      <Image src={item.navbarImage || "/placeholder.png"} alt={item.navbarTitle} width={36} height={36} className="object-contain w-20 h-full" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-medium text-gray-700">{item.navbarTitle}</span>
                                      {item.subTitle && <p className="text-[10px] text-gray-400">{item.subTitle}</p>}
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


// Add this component inside your Navbar component or in a separate file
const MobileCountryDropdown = ({
  country,
  selectedCountry,
  countryUniversities,
  loadCountryUniversities,
  filterUniversitiesByCountry,

  setMobileDropdown
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Close dropdown when selected country changes to a different country
    if (selectedCountry?.code !== country.code) {
      setIsOpen(false);
    }
  }, [selectedCountry?.code, country.code]);

  const handleToggle = () => {
    if (selectedCountry?.code === country.code && isOpen) {
      setIsOpen(false);
    } else {
      loadCountryUniversities(country);
      setIsOpen(true);
    }
  };

  return (
    <div className="mb-2">
      <div
        onClick={handleToggle}
        className="w-full text-left font-medium text-sm text-[var(--primary)] mb-1 flex justify-between items-center hover:underline cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {country.flag && (
            <img src={country.flag} alt={country.name} className="w-4 h-4 rounded-full" />
          )}
          <span>{country.name}</span>
          <span className="text-xs text-gray-400">
            ({filterUniversitiesByCountry(country.code).length})
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && selectedCountry?.code === country.code && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pl-2 space-y-1 mt-1 overflow-hidden"
          >
            {countryUniversities.map(uni => (
              <Link
                key={uni._id}
                href={`/universities/${uni.slug}`}
                onClick={() => {
                  setIsOpen(false);
                  setMobileDropdown(null);
                }}
                className="flex items-center gap-2 text-xs text-gray-600 py-2 px-2 hover:bg-gray-50 hover:text-[var(--primary)] rounded-lg transition"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {uni.uni_logo ? (
                    <Image
                      src={uni.uni_logo}
                      alt={uni.name}
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <GraduationCap size={14} className="text-gray-400 m-auto mt-1" />
                  )}
                </div>
                <span className="flex-1">{uni.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};