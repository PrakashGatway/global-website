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
  ArrowLeft,
  Globe,
  Building2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useGlobal } from "@/src/statecontext"
import MultiStepForm from "./PopupForm"

// Types for better TypeScript support
type NavItem = {
  title: string
  route: string
  id: number
  hasDropdown?: boolean
  type?: "service" | "country" | "destination"
}

type Country = {
  code: string
  name: string
  flag?: string
  slug?: string
}

type University = {
  _id: string
  name: string
  slug: string
  country: string
  uni_logo?: string
  countryData?: Array<{ name: string; flg?: string }>
}

export default function Navbar({
  Serviceitem,
  countryres,
  unicat
}: {
  Serviceitem?: any[],
  countryres?: any[],
  unicat?: University[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { profile, loading, Logout } = useGlobal()
  const [isScrolled, setIsScrolled] = useState(false)
  const [Login, setLogin] = useState(false)
  const [openForm, setOpenForm] = useState(false)

  // Mobile navigation state
  const [mobileNavStack, setMobileNavStack] = useState<Array<{
    type: 'main' | 'countries' | 'universities' | 'services' | 'destinations'
    data?: any
    title?: string
  }>>([{ type: 'main' }])

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [countryUniversities, setCountryUniversities] = useState<University[]>([])

  const pathname = usePathname()

  const navbar: NavItem[] = [
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset nav stack when closing
      setMobileNavStack([{ type: 'main' }]);
      setSelectedCountry(null);
    }
    return () => {
      document.body.style.overflow = "";
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
  const getUniqueCountries = (): Country[] => {
    if (!unicat || !Array.isArray(unicat)) return [];
    const countryMap = new Map<string, Country>();
    unicat.forEach((uni) => {
      const countryCode = uni.country;
      const countryName = uni.countryData?.[0]?.name;
      const countryFlag = uni.countryData?.[0]?.flg;
      if (!countryMap.has(countryCode)) {
        countryMap.set(countryCode, {
          code: countryCode,
          name: countryName || countryCode,
          flag: countryFlag,
          slug: countryName?.toLowerCase().replace(/\s+/g, '-')
        });
      }
    });
    return Array.from(countryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const filterUniversitiesByCountry = (countryCode: string): University[] => {
    if (!countryCode || !unicat) return [];
    return unicat.filter((uni) => uni.country === countryCode);
  };

  const loadCountryUniversities = (country: Country) => {
    setSelectedCountry(country);
    const filtered = filterUniversitiesByCountry(country.code);
    setCountryUniversities(filtered);
  };

  // Navigation handlers
  const pushNav = (screen: { type: any; data?: any; title?: string }) => {
    setMobileNavStack(prev => [...prev, screen]);
  };

  const popNav = () => {
    setMobileNavStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const handleCountrySelect = (country: Country) => {
    loadCountryUniversities(country);
    pushNav({ type: 'universities', data: country, title: country.name });
  };

  const handleNavClick = (item: NavItem) => {
    if (!item.hasDropdown) {
      setIsOpen(false);
      return;
    }

    if (item.type === 'destination') {
      pushNav({ type: 'countries', title: 'Select Country' });
    } else if (item.type === 'service') {
      pushNav({ type: 'services', data: Serviceitem, title: 'Our Services' });
    } else if (item.type === 'country') {
      pushNav({ type: 'destinations', data: countryres, title: 'Destinations' });
    }
  };

  const uniqueCountries = getUniqueCountries();

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.2 }
    })
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
        <div className={`mx-auto max-w-[1540px] flex justify-between relative transition-all duration-500 ease-in-out ${isScrolled ? "h-full" : ""}`}>
          {/* Logo */}
          <div className="items-center text-end px-8 gap-2 bg-white">
            <Link href="/">
              <Image
                src="/images/newlogo3.png"
                alt="Logo"
                width={800}
                height={100}
                className={`object-contain w-20 m-auto py-2.5 lg:w-28 lg:ml-10 ${isScrolled ? "" : ""}`}
                priority
              />
            </Link>
          </div>

          <div className={`flex flex-col ${isScrolled ? "justify-center" : "item-center gap-3 sm:px-15"}`}>
            {/* Top Bar - Only show when not scrolled */}
            {!isScrolled && (
              <div className="w-full justify-end items-center gap-6 lg:flex hidden z-10 px-4 text-white">
                <div className="bg-[#6d1901] shadow-xl flex justify-center items-center gap-2 px-4 py-1.5 rounded-b-2xl text-sm font-medium gap-8">
                  <a href="tel:+919875863347" className="flex items-center gap-2 hover:opacity-80 transition font-medium">
                    <span>Consult With Expert:</span>
                    <span className="font-semibold text-yellow-300">+91 9875863347</span>
                  </a>
                  {Login ? (
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
                      <span className="w-3 h-3 bg-yellow-300 rounded-full"></span>
                      Dashboard
                    </Link>
                  ) : (
                    <a href="/login" className="flex items-center gap-2 hover:opacity-80 transition">
                      <span className="w-3 h-3 bg-yellow-300 rounded-full"></span>
                      Student Login
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* ================= DESKTOP MENU ================= */}
            <div className={`hidden lg:flex items-center gap-2 ${isScrolled ? "justify-center" : "justify-center pb-4"}`}>
              {navbar?.map((item) => (
                <div key={item.id} className="relative group">
                  <Link
                    href={item.route}
                    className="flex items-center gap-1 px-3 text-[15px] font-[500] text-white hover:text-[var(--primary)] transition"
                  >
                    <span>{item.title}</span>
                    {item.hasDropdown && <ChevronDown size={14} className="mt-[2px]" />}
                  </Link>

                  {/* Desktop Dropdown */}
                  {item.hasDropdown && (
                    <div className="absolute -left-[10px] top-full mt-4 -translate-x-1/2 opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-300 ease-out z-50">
                      <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] w-[700px] p-5 border border-gray-100">
                        {item.type === "destination" ? (
                          <div className="flex gap-6">
                            {/* Countries Column */}
                            <div className="w-1/3 border-r border-gray-100">
                              <p className="text-sm font-semibold text-gray-800 mb-3 px-1">Countries</p>
                              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                                {uniqueCountries.map((country) => (
                                  <div key={country.code}>
                                    <div
                                      onMouseEnter={() => loadCountryUniversities(country)}
                                      onClick={() => loadCountryUniversities(country)}
                                      className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${selectedCountry?.code === country.code ? "bg-[var(--primary)] text-white shadow-md" : "hover:bg-gray-100 text-gray-700"}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        {country.flag && <img src={country.flag} alt={country.name} className="w-5 h-5 rounded-full object-cover" />}
                                        <span className="font-medium truncate">{country.name}</span>
                                      </div>
                                      {selectedCountry?.code === country.code && <ChevronRight size={14} />}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Universities Column */}
                            <div className="w-2/3 pl-2 flex flex-col">
                              <p className="text-sm font-semibold text-gray-800 mb-3 px-1">
                                {selectedCountry ? `Universities in ${selectedCountry.name}` : "Select a Country"}
                              </p>
                              {selectedCountry ? (
                                countryUniversities.length > 0 ? (
                                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                                    {countryUniversities.map((uni) => (
                                      <Link key={uni._id} href={`/universities/${uni.slug}`} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-[var(--primary)] hover:text-white hover:shadow-md transition group/item">
                                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                                          {uni.uni_logo ? (
                                            <Image src={uni.uni_logo} alt={uni.name} width={48} height={48} className="object-contain w-full h-full p-1" />
                                          ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                              <GraduationCap size={20} className="text-gray-400" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="overflow-hidden">
                                          <p className="font-semibold text-sm truncate group-hover/item:text-white">{uni.name}</p>
                                          <p className="text-xs opacity-70 truncate group-hover/item:text-white/80">{uni.countryData?.[0]?.name || uni.country}</p>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-400 text-sm">No universities found</div>
                                )
                              ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                  <GraduationCap size={32} className="mb-2 opacity-50" />
                                  <span className="text-xs">Select a country to see universities</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {(item.type === "service" ? Serviceitem : item.type === "country" ? countryres : uniqueCountries)?.map((items: any) => {
                              const href = item.type == "service" ? `/service/${items.slug}` : `/${items.slug}`;
                              const title = items.navbarTitle || items.name;
                              const image = items.navbarImage || items.flag;
                              return (
                                <Link key={items._id || items.code} href={href} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition">
                                  <div className="w-10 h-10 rounded-full bg-white shadow overflow-hidden">
                                    <Image src={image || "/placeholder.png"} alt={title} width={40} height={40} className="object-cover w-full h-full" />
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


            </div>
          </div>
          {isScrolled && (
            <div className="lg:flex items-center mr-4  hidden">
              {Login && profile ? (
                <>
                  <div className="flex items-center cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
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
                <Link href="/login" className="bg-secondary text-white px-4 py-2 hover:bg-primary rounded-full text-sm font-semibold">
                  Login/Signup
                </Link>
              )}
            </div>
          )}

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 pr-3 lg:hidden">
            <a href="tel:+919875863347" className="flex items-center gap-1 bg-white text-[#f46c44] px-3 py-2 rounded-full shadow-md active:scale-95 transition">
              <Phone size={16} />
              <span className="text-xs font-semibold">9875863347</span>
            </a>
            <button onClick={() => setIsOpen(true)} className="text-white bg-[#6d1901] p-2 rounded-md">
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* ================= MOBILE DRAWER ================= */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[1px] transition"
                onClick={() => setIsOpen(false)}
              />

              {/* Drawer */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
                className="fixed left-0 top-0 z-[9999] w-full max-w-[380px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 bg-white/80 backdrop-blur-[1px] sticky top-0 z-10">
                  {mobileNavStack.length > 1 ? (
                    <button
                      onClick={popNav}
                      className="flex items-center gap-1.5 py-3 text-[#f46c44] font-medium hover:opacity-80 transition -ml-1"
                    >
                      <ArrowLeft size={22} />
                      <span>Back</span>
                    </button>
                  ) : (
                    <Image src="/images/newlogo3.png" alt="Logo" width={85} height={20} className="object-contain" />
                  )}
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-gray-50 hover:bg-gray-300 transition">
                    <X size={22} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <AnimatePresence mode="wait" custom={mobileNavStack.length}>
                    {mobileNavStack.map((screen, index) => {
                      if (index !== mobileNavStack.length - 1) return null;
                      return (
                        <motion.div
                          key={`${screen.type}-${index}`}
                          custom={mobileNavStack.length - (mobileNavStack.findIndex(s => s.type === screen.type) || 0)}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="absolute inset-0 overflow-y-auto"
                        >
                          {screen.type === 'main' && (
                            <div className="px-4 py-2 space-y-1">
                              {[...navbar, { title: "Blogs", route: "/blog", id: 23 }, { title: "Events & Webinars", route: "/events", id: 13 }].map((item) => (
                                <div key={item.id} className="rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => item.hasDropdown ? handleNavClick(item) : setIsOpen(false)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/60 active:bg-white/80 transition rounded-xl group"
                                  >
                                    <span className="text-base font-medium text-gray-800 group-hover:text-[#f46c44] transition">
                                      {item.title}
                                    </span>
                                    {item.hasDropdown ? (
                                      <ChevronRight size={18} className="text-gray-400 group-hover:text-[#f46c44] transition" />
                                    ) : (
                                      <ChevronRight size={18} className="text-gray-200" />
                                    )}
                                  </button>
                                </div>
                              ))}

                              {/* Auth Section */}
                              <div className="pt-4 mt-4 border-t border-gray-100">
                                {!Login ? (
                                  <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full bg-gradient-to-r from-[#f46c44] to-[#e55a34] text-white py-3 rounded-full font-semibold text-center hover:opacity-95 transition shadow-lg shadow-orange-200"
                                  >
                                    Login / Signup
                                  </Link>
                                ) : (
                                  <div className="space-y-2">
                                    <Link
                                      href="/dashboard"
                                      onClick={() => setIsOpen(false)}
                                      className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-[#f46c44] transition"
                                    >
                                      <div className="w-10 h-10 rounded-full bg-[#f46c44] text-white flex items-center justify-center font-semibold">
                                        {profile?.name?.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="flex-1 text-left">
                                        <p className="font-semibold text-gray-800 text-sm">{profile?.name}</p>
                                        <p className="text-xs text-gray-500">View Dashboard</p>
                                      </div>
                                      <ChevronRight size={16} className="text-gray-400" />
                                    </Link>
                                    <button
                                      onClick={() => { Logout(); setIsOpen(false); }}
                                      className="w-full text-left px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition"
                                    >
                                      Logout
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {screen.type === 'countries' && (
                            <div className="px-4 py-2">
                              <div className="mb-4">
                                <h2 className="text-base font-bold text-gray-800">{screen.title}</h2>
                                <p className="text-xs text-gray-500">Choose your study destination</p>
                              </div>

                              <div className="space-y-2">
                                {uniqueCountries.map((country) => (
                                  <motion.button
                                    key={country.code}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => handleCountrySelect(country)}
                                    className="w-full flex items-center gap-4 p-4 py-2.5 bg-orange-50 rounded-2xl hover:border-[#f46c44]/30 hover:shadow-md transition group text-left"
                                  >
                                    {country.flag ? (
                                      <div className="w-10 h-10 flex-shrink-0">
                                        <img src={country.flag} alt={country.name} className="w-full h-full object-cover" />
                                      </div>
                                    ) : (
                                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Globe size={20} className="text-gray-400" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm text-gray-800 group-hover:text-[#f46c44] transition">
                                        {country.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {filterUniversitiesByCountry(country.code).length} universities
                                      </p>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#f46c44] transition flex-shrink-0" />
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )}

                          {screen.type === 'universities' && selectedCountry && (
                            <div className="px-4 py-3">
                              <div className="mb-1 sticky top-0 bg-gradient-to-b from-white to-transparent pb-3 z-10">
                                <div className="flex items-center gap-3 mb-2">
                                  {selectedCountry.flag && (
                                    <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-10 h-10 object-cover" />
                                  )}
                                  <h2 className="text-base font-bold text-gray-800">{selectedCountry.name}<p className="text-xs text-gray-500 font-medium block">{countryUniversities.length} universities available</p></h2>
                                </div>

                              </div>

                              {countryUniversities.length > 0 ? (
                                <div className="space-y-3 pb-4">
                                  {countryUniversities.map((uni) => (
                                    <Link
                                      key={uni._id}
                                      href={`/universities/${uni.slug}`}
                                      onClick={() => setIsOpen(false)}
                                      className="block"
                                    >
                                      <motion.div
                                        whileTap={{ scale: 0.99 }}
                                        className="flex items-center gap-4 p-4 py-2 rounded-2xl bg-orange-50 hover:border-[#f46c44]/30 hover:shadow-lg transition group"
                                      >
                                        <div className="w-16 h-16 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                          {uni.uni_logo ? (
                                            <Image
                                              src={uni.uni_logo}
                                              alt={uni.name}
                                              width={64}
                                              height={64}
                                              className="object-contain p-2"
                                            />
                                          ) : (
                                            <Building2 size={28} className="text-gray-300" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-gray-800 group-hover:text-[#f46c44] transition truncate">
                                            {uni.name}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Globe size={12} />
                                            {uni.countryData?.[0]?.name || uni.country}
                                          </p>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#f46c44] transition flex-shrink-0" />
                                      </motion.div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <GraduationCap size={32} className="text-gray-400" />
                                  </div>
                                  <p className="text-gray-600 font-medium">No universities found</p>
                                  <p className="text-sm text-gray-400 mt-1">Try selecting another country</p>
                                  <button
                                    onClick={popNav}
                                    className="mt-6 text-[#f46c44] font-medium hover:underline"
                                  >
                                    ← Choose different country
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {(screen.type === 'services' || screen.type === 'destinations') && (
                            <div className="px-4 py-3">
                              <div className="mb-4">
                                <h2 className="text-lg font-bold text-gray-800">{screen.title}</h2>
                              </div>

                              <div className="space-y-2">
                                {(screen.data || []).map((item: any) => {
                                  const href = screen.type === 'services' ? `/service/${item.slug}` : `/${item.slug}`;
                                  const title = item.navbarTitle || item.name;
                                  const image = item.flag || item.navbarImage;

                                  return (
                                    <Link
                                      key={item._id || item.code}
                                      href={href}
                                      onClick={() => setIsOpen(false)}
                                      className="block"
                                    >
                                      <motion.div
                                        whileTap={{ scale: 0.99 }}
                                        className="flex items-center gap-2 p-4 bg-orange-50 rounded-2xl hover:border-[#f46c44]/30 hover:shadow-md transition group"
                                      >
                                        <div className="w-14 rounded-lg shadow h-10 overflow-hidden flex-shrink-0">
                                          <Image
                                            src={image || "https://t4.ftcdn.net/jpg/00/65/77/21/360_F_65772192_jm8MYL39Bp5pp90KlyGWrRgErYa70lZZ.jpg"}
                                            alt={title}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full object-center h-full"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm text-gray-800 group-hover:text-[#f46c44] transition">
                                            {title}
                                          </p>
                                          {item.subTitle && (
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{item.subTitle}</p>
                                          )}
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#f46c44] transition flex-shrink-0" />
                                      </motion.div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
                <div className="h-6 bg-gradient-to-t from-gray-50 to-transparent flex-shrink-0" />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}
      </AnimatePresence>
    </>
  )
}