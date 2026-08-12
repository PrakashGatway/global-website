"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Phone,
  ChevronRight,
  ArrowLeft,
  Globe2,
  Building2,
  Sparkles,
  LogIn,
  LayoutDashboard,
  LogOut,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useGlobal } from "@/src/statecontext";
import MultiStepForm from "./PopupForm";

type NavItem = {
  title: string;
  route: string;
  id: number;
  hasDropdown?: boolean;
  type?: "service" | "country" | "destination";
};

type Country = {
  code: string;
  name: string;
  flag?: string;
  slug?: string;
};

type University = {
  _id: string;
  name: string;
  slug: string;
  country: string;
  uni_logo?: string;
  countryData?: Array<{
    name: string;
    flg?: string;
  }>;
};

type MobileScreen = {
  type: "main" | "countries" | "universities" | "services" | "destinations";
  data?: any;
  title?: string;
};

export default function Navbar({
  Serviceitem,
  countryres,
  unicat,
}: {
  Serviceitem?: any[];
  countryres?: any[];
  unicat?: University[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { profile, Logout } = useGlobal();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [Login, setLogin] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [mobileNavStack, setMobileNavStack] = useState<MobileScreen[]>([
    { type: "main" },
  ]);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const [countryUniversities, setCountryUniversities] = useState<University[]>(
    [],
  );

  /**
   * ---------------------------------------------------------
   * HIDE NAVBAR ON PRIVATE / AUTH ROUTES
   * ---------------------------------------------------------
   */

  const hideNavbar = useMemo(() => {
    return (
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/consultant") ||
      pathname.startsWith("/thank-you")
    );
  }, [pathname]);

  /**
   * ---------------------------------------------------------
   * NAVIGATION DATA
   * ---------------------------------------------------------
   */

  const navbar: NavItem[] = [
    {
      title: "Home",
      route: "/",
      id: 1,
    },
    {
      title: "About Us",
      route: "/about",
      id: 2,
    },
    {
      title: "Services",
      route: "/service",
      hasDropdown: true,
      type: "service",
      id: 3,
    },
    {
      title: "Destinations",
      route: "#",
      hasDropdown: true,
      type: "country",
      id: 4,
    },
    {
      title: "Universities",
      route: "#",
      hasDropdown: true,
      type: "destination",
      id: 5,
    },
    {
      title: "Career",
      route: "/career",
      id: 7,
    },
    {
      title: "Contact Us",
      route: "/contact",
      id: 8,
    },
  ];

  const allNavItems: NavItem[] = [
    ...navbar,
    {
      title: "Blogs",
      route: "/blog",
      id: 23,
      hasDropdown: false,
    },
    {
      title: "Events & Webinars",
      route: "/events",
      id: 13,
      hasDropdown: false,
    },
  ];

  /**
   * ---------------------------------------------------------
   * UNIQUE COUNTRIES
   * ---------------------------------------------------------
   */

  const uniqueCountries = useMemo<Country[]>(() => {
    if (!unicat || !Array.isArray(unicat)) {
      return [];
    }

    const countryMap = new Map<string, Country>();

    unicat.forEach((uni) => {
      const countryCode = uni.country;
      const countryName = uni.countryData?.[0]?.name;
      const countryFlag = uni.countryData?.[0]?.flg;

      if (!countryCode) return;

      if (!countryMap.has(countryCode)) {
        countryMap.set(countryCode, {
          code: countryCode,
          name: countryName || countryCode,
          flag: countryFlag,
          slug: countryName?.toLowerCase().replace(/\s+/g, "-"),
        });
      }
    });

    return Array.from(countryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [unicat]);

  /**
   * ---------------------------------------------------------
   * EFFECTS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setIsScrolled((previous) => {
        if (!previous && scrollY > 100) return true;
        if (previous && scrollY < 50) return false;

        return previous;
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";

      setMobileNavStack([{ type: "main" }]);
      setSelectedCountry(null);
      setCountryUniversities([]);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    setLogin(Boolean(token));
  }, []);

  /**
   * Select first country for desktop mega menu.
   */
  useEffect(() => {
    if (uniqueCountries.length > 0 && !selectedCountry) {
      const firstCountry = uniqueCountries[0];

      setSelectedCountry(firstCountry);
      setCountryUniversities(filterUniversitiesByCountry(firstCountry.code));
    }
  }, [uniqueCountries]);

  /**
   * ---------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------
   */

  function filterUniversitiesByCountry(countryCode: string): University[] {
    if (!countryCode || !unicat) return [];

    return unicat.filter((uni) => uni.country === countryCode);
  }

  const loadCountryUniversities = (country: Country) => {
    if (!country?.code) return;

    setSelectedCountry(country);

    const universities = filterUniversitiesByCountry(country.code);

    setCountryUniversities(universities);
  };

  /**
   * ---------------------------------------------------------
   * MOBILE NAVIGATION
   * ---------------------------------------------------------
   */

  const pushNav = (screen: MobileScreen) => {
    setMobileNavStack((previous) => [...previous, screen]);
  };

  const popNav = () => {
    setMobileNavStack((previous) =>
      previous.length > 1 ? previous.slice(0, -1) : previous,
    );
  };

  const handleCountrySelect = (country: Country) => {
    loadCountryUniversities(country);

    pushNav({
      type: "universities",
      data: country,
      title: country.name,
    });
  };

  const handleMobileItemClick = (item: NavItem) => {
    if (item.hasDropdown) {
      if (item.type === "destination") {
        pushNav({
          type: "countries",
          title: "Select Country",
        });
      }

      if (item.type === "service") {
        pushNav({
          type: "services",
          data: Serviceitem || [],
          title: "Our Services",
        });
      }

      if (item.type === "country") {
        pushNav({
          type: "destinations",
          data: countryres || [],
          title: "Destinations",
        });
      }



      return;
    }else{
      router.push(item.route);
    }

    setIsOpen(false);
  };

  /**
   * ---------------------------------------------------------
   * DROPDOWN HANDLERS
   * ---------------------------------------------------------
   */

  const openDropdown = (type?: string) => {
    if (!type) return;

    setActiveDropdown(type);

    if (type === "destination" && uniqueCountries.length > 0) {
      const firstCountry = uniqueCountries[0];

      loadCountryUniversities(firstCountry);
    }
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  /**
   * ---------------------------------------------------------
   * ANIMATIONS
   * ---------------------------------------------------------
   */

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.97,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      },
    },

    exit: {
      opacity: 0,
      y: -8,
      scale: 0.97,
      transition: {
        duration: 0.18,
      },
    },
  };

  const mobileSlideVariants = {
    enter: {
      x: "100%",
      opacity: 0,
    },

    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 32,
      },
    },

    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.22,
        ease: "easeOut",
      },
    },
  };

  /**
   * ---------------------------------------------------------
   * DON'T RENDER
   * ---------------------------------------------------------
   */

  if (hideNavbar) {
    return null;
  }

  /**
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <>
      <nav
        className={`
          sticky top-0 left-0 right-0 z-[999]
          transition-all duration-500 bg-white
          ${isScrolled ? "sm:py-0 py-1.5  shadow-lg" : "sm:p-0 py-1.5 "}
        `}
      >
        {/* =====================================================
            DESKTOP TOP BAR
        ====================================================== */}

        <AnimatePresence initial={false}>
          {!isScrolled && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="hidden lg:block overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#7a2108] via-[#f46c44] to-[#7a2108] text-white">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="min-h-[38px] flex items-center justify-between">
                    {/* LEFT */}

                    <a
                      href="tel:+919875863347"
                      className="
                        flex items-center gap-2
                        text-xs xl:text-sm
                        font-medium
                        group
                      "
                    >
                      <span
                        className="
                          w-6 h-6 rounded-full
                          bg-white/15
                          flex items-center justify-center
                          group-hover:bg-white/25
                          transition
                        "
                      >
                        <Phone size={12} />
                      </span>

                      <span className="text-white/80">
                        Consult With Expert:
                      </span>

                      <span className="font-bold text-yellow-300">
                        +91 9875863347
                      </span>
                    </a>

                    {/* RIGHT */}

                    <div className="flex items-center gap-5">
                      <div className="hidden xl:flex items-center gap-2 text-xs text-white/80">
                        <Sparkles size={13} />
                        Your journey starts here
                      </div>

                      {Login ? (
                        <Link
                          href="/dashboard"
                          className="
                            flex items-center gap-2
                            text-xs xl:text-sm
                            font-semibold
                            hover:text-yellow-300
                            transition
                          "
                        >
                          <LayoutDashboard size={14} />
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="
                            flex items-center gap-2
                            text-xs xl:text-sm
                            font-semibold
                            hover:text-yellow-300
                            transition
                          "
                        >
                          <LogIn size={14} />
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            MAIN NAVBAR
        ====================================================== */}

        <motion.div
          className={`
            mx-auto max-w-7xl
            transition-all duration-500
            ${isScrolled ? " px-2" : "bg-white px-3"}
          `}
        >
          <div
            className={`
              relative
              flex items-center
              justify-between
              bg-white
              border
              border-white/70
              transition-all duration-500
              ${
                isScrolled
                  ? "rounded-2xl px-3 sm:px-5 py-1.5"
                  : "rounded-none  shadow-none px-1 sm:px-2 py-1"
              }
            `}
          >
            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              href="/"
              className="
                relative z-10
                flex-shrink-0
                group
              "
            >
              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <Image
                  src="/images/newlogo3.png"
                  alt="Ooshas Global"
                  width={160}
                  height={55}
                  priority
                  className="
                    object-contain
                    w-[95px]
                    lg:w-[110px]
                    xl:w-[120px]
                    h-auto
                    transition-all duration-500
                  "
                />
              </motion.div>
            </Link>

            {/* =================================================
                DESKTOP NAV
            ================================================== */}

            <div className="hidden lg:flex flex-1 justify-center px-4">
              <div className="flex items-center gap-0.5 xl:gap-1">
                {navbar.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    (item.route !== "/" && pathname.startsWith(item.route));

                  const dropdownOpen = activeDropdown === item.type;

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => {
                        if (item.hasDropdown) {
                          openDropdown(item.type);
                        }
                      }}
                      onMouseLeave={() => {
                        if (item.hasDropdown) {
                          closeDropdown();
                        }
                      }}
                    >
                      <Link
                        href={item.route}
                        className={`
                          relative
                          flex items-center
                          gap-1
                          px-2.5
                          py-3
                          rounded-xl
                          text-[13px]
                          xl:text-[14px]
                          font-semibold
                          whitespace-nowrap
                          transition-all duration-300
                          ${
                            isActive
                              ? "text-[#f46c44]"
                              : "text-gray-700 hover:text-[#f46c44]"
                          }
                        `}
                      >
                        <span>{item.title}</span>

                        {item.hasDropdown && (
                          <motion.span
                            animate={{
                              rotate: dropdownOpen ? 180 : 0,
                            }}
                            transition={{
                              duration: 0.2,
                            }}
                          >
                            <ChevronDown size={14} strokeWidth={2.2} />
                          </motion.span>
                        )}
                      </Link>

                      {/* =========================================
                          DESKTOP MEGA DROPDOWN
                      ========================================== */}

                      <AnimatePresence>
                        {item.hasDropdown && dropdownOpen && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="
                                absolute
                                top-full
                                left-1/2
                                -translate-x-1/2
                                pt-3
                                z-[100]
                              "
                          >
                            <div
                              className="
                                  bg-white
                                  rounded-3xl
                                  border border-gray-100
                                  shadow-[0_25px_80px_rgba(0,0,0,0.14)]
                                  overflow-hidden
                                  backdrop-blur-xl
                                "
                            >
                              {/* DESTINATION / UNIVERSITY */}

                              {item.type === "destination" ? (
                                <div className="w-[720px] p-4">
                                  <div className="grid grid-cols-[230px_1fr] gap-4">
                                    {/* COUNTRIES */}

                                    <div
                                      className="
                                          rounded-2xl
                                          bg-gray-50
                                          border
                                          border-gray-100
                                          p-2
                                        "
                                    >
                                      <div className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                          <div>
                                            <p className="text-sm font-bold text-gray-900">
                                              Study Destinations
                                            </p>

                                            <p className="text-[10px] text-gray-500">
                                              Choose a country
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-px max-h-[420px] overflow-y-auto scrollbar-thin">
                                        {uniqueCountries.map((country) => {
                                          const active =
                                            selectedCountry?.code ===
                                            country.code;

                                          return (
                                            <button
                                              key={country.code}
                                              onMouseEnter={() =>
                                                loadCountryUniversities(country)
                                              }
                                              onClick={() =>
                                                loadCountryUniversities(country)
                                              }
                                              className={`
                                                    w-full
                                                    flex
                                                    items-center
                                                    gap-3
                                                    px-3
                                                    py-2
                                                    rounded-xl
                                                    text-left
                                                    transition-all
                                                    duration-200
                                                    ${
                                                      active
                                                        ? "bg-[#f46c44] text-white shadow-md"
                                                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                                                    }
                                                  `}
                                            >
                                              {country.flag ? (
                                                <img
                                                  src={country.flag}
                                                  alt={country.name}
                                                  className="
                                                        w-8
                                                        h-8
                                                        rounded-full
                                                        object-cover
                                                        border-2
                                                        border-white
                                                        shadow-sm
                                                      "
                                                />
                                              ) : (
                                                <div
                                                  className={`
                                                        w-8 h-8
                                                        rounded-full
                                                        flex
                                                        items-center
                                                        justify-center
                                                        ${
                                                          active
                                                            ? "bg-white/20"
                                                            : "bg-white"
                                                        }
                                                      `}
                                                >
                                                  <Globe2 size={15} />
                                                </div>
                                              )}

                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">
                                                  {country.name}
                                                </p>

                                                <p
                                                  className={`
                                                        text-[10px]
                                                        ${
                                                          active
                                                            ? "text-white/70"
                                                            : "text-gray-400"
                                                        }
                                                      `}
                                                >
                                                  {
                                                    filterUniversitiesByCountry(
                                                      country.code,
                                                    ).length
                                                  }{" "}
                                                  universities
                                                </p>
                                              </div>

                                              <ChevronRight
                                                size={14}
                                                className={
                                                  active
                                                    ? "text-white"
                                                    : "text-gray-300"
                                                }
                                              />
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* UNIVERSITIES */}

                                    <div className="min-w-0">
                                      <div className="flex items-center justify-between mb-3 px-1">
                                        <div>
                                          <p className="text-base font-bold text-gray-900">
                                            {selectedCountry
                                              ? `Universities in ${selectedCountry.name}`
                                              : "Universities"}
                                          </p>

                                          <p className="text-xs text-gray-400">
                                            Explore top institutions
                                          </p>
                                        </div>

                                        {selectedCountry && (
                                          <div className="flex items-center gap-1 text-sm text-[#f46c44] font-semibold">
                                            <MapPin size={11} />
                                            {selectedCountry.name}
                                          </div>
                                        )}
                                      </div>

                                      {countryUniversities.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2 max-h-[430px] overflow-y-auto pr-1 scrollbar-thin">
                                          {countryUniversities.map((uni) => (
                                            <Link
                                              key={uni._id}
                                              href={`/universities/${uni.slug}`}
                                              className="
                                                    group
                                                    flex
                                                    items-center
                                                    gap-3
                                                    p-1.5
                                                    rounded-2xl
                                                    border
                                                    border-gray-100
                                                    bg-white
                                                    hover:border-[#f46c44]/30
                                                    hover:bg-[#fff8f5]
                                                    hover:shadow-md
                                                    transition-all
                                                    duration-300
                                                  "
                                            >
                                              <div
                                                className="
                                                      w-11
                                                      h-11
                                                      rounded-xl
                                                      bg-gray-50
                                                      border
                                                      border-gray-100
                                                      flex
                                                      items-center
                                                      justify-center
                                                      overflow-hidden
                                                      flex-shrink-0
                                                      group-hover:scale-105
                                                      transition
                                                    "
                                              >
                                                {uni.uni_logo ? (
                                                  <Image
                                                    src={uni.uni_logo}
                                                    alt={uni.name}
                                                    width={44}
                                                    height={44}
                                                    className="object-contain p-1.5"
                                                  />
                                                ) : (
                                                  <GraduationCap
                                                    size={20}
                                                    className="text-gray-300"
                                                  />
                                                )}
                                              </div>

                                              <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-gray-800 truncate group-hover:text-[#f46c44] transition">
                                                  {uni.name}
                                                </p>

                                                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                                  {uni.countryData?.[0]?.name ||
                                                    uni.country}
                                                </p>
                                              </div>

                                              <ArrowUpRight
                                                size={14}
                                                className="
                                                      text-gray-200
                                                      group-hover:text-[#f46c44]
                                                      group-hover:translate-x-0.5
                                                      group-hover:-translate-y-0.5
                                                      transition
                                                      flex-shrink-0
                                                    "
                                              />
                                            </Link>
                                          ))}
                                        </div>
                                      ) : (
                                        <div
                                          className="
                                              h-[350px]
                                              rounded-2xl
                                              bg-gray-50
                                              border
                                              border-dashed
                                              border-gray-200
                                              flex
                                              flex-col
                                              items-center
                                              justify-center
                                              text-center
                                            "
                                        >
                                          <div
                                            className="
                                                w-16
                                                h-16
                                                rounded-2xl
                                                bg-white
                                                shadow-sm
                                                flex
                                                items-center
                                                justify-center
                                                mb-3
                                              "
                                          >
                                            <GraduationCap
                                              size={28}
                                              className="text-gray-300"
                                            />
                                          </div>

                                          <p className="text-sm font-semibold text-gray-500">
                                            No universities found
                                          </p>

                                          <p className="text-xs text-gray-400 mt-1">
                                            Select another country
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* SERVICES / DESTINATIONS */

                                <div className="w-[560px] p-4">
                                  <div className="flex items-center justify-between mb-4 px-1">
                                    <div>
                                      <p className="text-base font-bold text-gray-900">
                                        {item.type === "service"
                                          ? "Our Services"
                                          : "Study Destinations"}
                                      </p>

                                      <p className="text-xs text-gray-400">
                                        Discover what we offer
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    {(item.type === "service"
                                      ? Serviceitem
                                      : countryres
                                    )?.map((data: any) => {
                                      const href =
                                        item.type === "service"
                                          ? `/service/${data.slug}`
                                          : `/${data.slug}`;

                                      const title =
                                        data.navbarTitle || data.name;

                                      const image =
                                        data.navbarImage || data.flag;

                                      return (
                                        <Link
                                          key={data._id || data.code}
                                          href={href}
                                          className="
                                                group
                                                flex
                                                items-center
                                                gap-3
                                                p-2
                                                rounded-2xl
                                                border
                                                border-gray-100
                                                hover:border-[#f46c44]/30
                                                hover:bg-[#fff8f5]
                                                hover:shadow-md
                                                transition-all
                                                duration-300
                                              "
                                        >
                                          <div
                                            className="
                                                  w-11
                                                  h-11
                                                  rounded-xl
                                                  bg-gray-50
                                                  overflow-hidden
                                                  flex-shrink-0
                                                  border
                                                  border-gray-100
                                                "
                                          >
                                            <Image
                                              src={image || "/placeholder.png"}
                                              alt={title}
                                              width={44}
                                              height={44}
                                              className="
                                                    object-cover
                                                    w-full
                                                    h-full
                                                    group-hover:scale-110
                                                    transition-transform
                                                    duration-500
                                                  "
                                            />
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#f46c44] transition">
                                              {title}
                                            </p>

                                            {data.subTitle && (
                                              <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                                {data.subTitle}
                                              </p>
                                            )}
                                          </div>

                                          <ChevronRight
                                            size={14}
                                            className="
                                                  text-gray-200
                                                  group-hover:text-[#f46c44]
                                                  group-hover:translate-x-1
                                                  transition
                                                "
                                          />
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                DESKTOP RIGHT ACTIONS
            ================================================== */}

            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {/* BLOG */}

              <Link
                href="/blog"
                className="
                  hidden xl:flex
                  items-center
                  gap-1.5
                  px-3
                  py-2.5
                  rounded-xl
                  text-xs
                  font-semibold
                  text-gray-600
                  hover:text-[#f46c44]
                  hover:bg-[#fff8f5]
                  transition
                "
              >
                Blogs
              </Link>

              {/* PROFILE */}

              {Login && profile ? (
                <div className="relative group">
                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      pl-1
                      pr-2
                      py-1
                      rounded-full
                      border
                      border-gray-100
                      bg-white
                      hover:border-[#f46c44]/30
                      hover:shadow-md
                      transition
                    "
                  >
                    <div
                      className="
                        w-9
                        h-9
                        rounded-full
                        bg-gradient-to-br
                        from-[#f46c44]
                        to-[#9d2e0d]
                        text-white
                        flex
                        items-center
                        justify-center
                        text-sm
                        font-bold
                        shadow-sm
                      "
                    >
                      {profile?.name?.charAt(0).toUpperCase()}
                    </div>

                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      pt-3
                      opacity-0
                      invisible
                      translate-y-2
                      group-hover:opacity-100
                      group-hover:visible
                      group-hover:translate-y-0
                      transition-all
                      duration-300
                      z-50
                    "
                  >
                    <div
                      className="
                        w-[290px]
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100
                        shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                        p-3
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          p-3
                          rounded-xl
                          bg-gradient-to-r
                          from-[#fff7f3]
                          to-white
                        "
                      >
                        <div
                          className="
                            w-11
                            h-11
                            rounded-full
                            bg-gradient-to-br
                            from-[#f46c44]
                            to-[#9d2e0d]
                            text-white
                            flex
                            items-center
                            justify-center
                            font-bold
                          "
                        >
                          {profile?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-sm text-gray-800 capitalize truncate">
                            {profile?.name}
                          </p>

                          <p
                            className="text-[11px] text-gray-400 truncate"
                            style={{
                              overflowWrap: "anywhere",
                            }}
                          >
                            {profile?.email}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 space-y-1">
                        <Link
                          href="/dashboard"
                          className="
                            flex
                            items-center
                            gap-3
                            px-3
                            py-2.5
                            rounded-xl
                            text-sm
                            text-gray-700
                            hover:bg-gray-50
                            hover:text-[#f46c44]
                            transition
                          "
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>

                        <button
                          onClick={Logout}
                          className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-3
                            py-2.5
                            rounded-xl
                            text-sm
                            text-red-500
                            hover:bg-red-50
                            transition
                            text-left
                          "
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="
                    group
                    relative
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-full
                    bg-gradient-to-r
                    from-[#f46c44]
                    to-[#c63d19]
                    text-white
                    text-xs
                    xl:text-sm
                    font-bold
                    shadow-md
                    shadow-orange-100
                    hover:shadow-lg
                    hover:shadow-orange-200
                    transition-all
                    duration-300
                    overflow-hidden
                  "
                >
                  <span
                    className="
                      absolute
                      inset-0
                      bg-white/20
                      translate-x-[-100%]
                      group-hover:translate-x-[100%]
                      transition-transform
                      duration-700
                    "
                  />

                  <LogIn size={15} />

                  <span className="relative">Login / Signup</span>
                </Link>
              )}
            </div>

            {/* =================================================
                MOBILE ACTIONS
            ================================================== */}

            <div className="flex lg:hidden items-center gap-2">
              <a
                href="tel:+919875863347"
                aria-label="Call Ooshas Global"
                className="
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-full
                  bg-[#fff5f1]
                  text-[#f46c44]
                  border
                  border-[#f46c44]/10
                  shadow-sm
                  active:scale-95
                  transition
                "
              >
                <Phone size={17} />
              </a>

              <button
                aria-label={
                  isOpen ? "Close navigation menu" : "Open navigation menu"
                }
                onClick={() => setIsOpen(!isOpen)}
                className="
    relative
    flex
    h-12
    w-12
    items-center
    justify-center
    rounded-full
    active:scale-95
    transition-all
    duration-300
    overflow-hidden
  "
              >
                {/* Hamburger / Cross */}
                <span className="relative flex h-8 w-8 items-center justify-center">
                  {/* Top */}
                  <span
                    className={`
        absolute
        left-0
        h-[2px]
        w-7
        rounded-full
        bg-gray-700
        transition-all
        duration-300
        ease-in-out
        ${isOpen ? "rotate-45" : "-translate-y-[9px]"}
      `}
                  />

                  <span
                    className={`
        absolute
        left-0
        h-[2px]
        w-7
        rounded-full
       bg-gray-700
        transition-all
        duration-300
        ease-in-out
        ${isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"}
      `}
                  />

                  <span
                    className={`
        absolute
        left-0
        h-[2px]
        w-7
        rounded-full
        bg-gray-700
        transition-all
        duration-300
        ease-in-out
        ${isOpen ? "-rotate-45" : "translate-y-[9px]"}
      `}
                  />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* =======================================================
          MOBILE DRAWER
      ======================================================== */}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* DRAWER */}

            <motion.aside
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 32,
              }}
              className="
                fixed
                left-0
                top-0
                z-[9999]
                h-[100dvh]
                w-full
                max-w-[410px]
                bg-[#fffdfc]
                shadow-[20px_0_80px_rgba(0,0,0,0.18)]
                flex
                flex-col
                overflow-hidden
              "
            >
              {/* =============================================
                  MOBILE HEADER
              ============================================== */}

              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                  px-5
                  py-2.5
                  border-b
                  border-gray-100
                  bg-white
                  z-20
                "
              >
                {mobileNavStack.length > 1 ? (
                  <button
                    onClick={popNav}
                    className="
                      flex
                      items-center
                      gap-2
                      text-[#f46c44]
                      font-semibold
                      text-base py-1
                      active:scale-95
                      transition
                    "
                  >
                    <span
                      className="
                        w-9
                        h-9
                        rounded-full
                        bg-[#fff4ef]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <ArrowLeft size={18} />
                    </span>

                    <span>Back</span>
                  </button>
                ) : (
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Image
                      src="/images/newlogo3.png"
                      alt="Ooshas Global"
                      width={120}
                      height={40}
                      priority
                      className="w-[80px] h-auto object-contain"
                    />
                  </Link>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-gray-100
                    hover:bg-gray-200
                    flex
                    items-center
                    justify-center
                    transition
                    active:scale-95
                  "
                >
                  <X size={19} className="text-gray-700" />
                </button>
              </div>

              {/* =============================================
                  MOBILE CONTENT
              ============================================== */}

              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {mobileNavStack.map((screen, index) => {
                    if (index !== mobileNavStack.length - 1) {
                      return null;
                    }

                    return (
                      <motion.div
                        key={`${screen.type}-${index}`}
                        variants={mobileSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="
                            absolute
                            inset-0
                            overflow-y-auto
                            overscroll-contain
                          "
                      >
                        {/* =================================
                              MAIN MENU
                          ================================== */}

                        {screen.type === "main" && (
                          <div className="px-4 py-4">
                            <div className="space-y-px">
                              {allNavItems.map((item) => (
                                <motion.div
                                  key={item.id}
                                  whileTap={{
                                    scale: 0.985,
                                  }}
                                >
                                  <button
                                    onClick={() => handleMobileItemClick(item)}
                                    className="
                                          w-full
                                          flex
                                          items-center
                                          justify-between
                                          px-3
                                          py-2
                                          rounded-2xl
                                          text-left
                                          hover:bg-[#fff5f1]
                                          active:bg-[#fff0e9]
                                          transition
                                          group
                                        "
                                  >
                                    <div className="flex items-center gap-2">
                                     

                                      <span className="text-base p-1.5 font-semibold text-gray-800 group-hover:text-[#f46c44] transition">
                                        {item.title}
                                      </span>
                                    </div>

                                    <ChevronRight
                                      size={17}
                                      className="
                                            text-gray-300
                                            group-hover:text-[#f46c44]
                                            group-hover:translate-x-1
                                            transition
                                          "
                                    />
                                  </button>
                                </motion.div>
                              ))}
                            </div>

                            {/* AUTH */}

                            <div className="mt-5 pt-5 border-t border-gray-100">
                              {!Login ? (
                                <Link
                                  href="/login"
                                  onClick={() => setIsOpen(false)}
                                  className="
                                      flex
                                      items-center
                                      justify-center
                                      gap-2
                                      w-full
                                      py-3.5
                                      rounded-2xl
                                      bg-gradient-to-r
                                      from-[#f46c44]
                                      to-[#c63d19]
                                      text-white
                                      text-sm
                                      font-bold
                                      shadow-lg
                                      shadow-orange-100
                                      active:scale-[0.98]
                                      transition
                                    "
                                >
                                  <LogIn size={17} />
                                  Login / Signup
                                </Link>
                              ) : (
                                <div className="space-y-2">
                                  <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        p-3
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-white
                                        hover:border-orange-200
                                        transition
                                      "
                                  >
                                    <div
                                      className="
                                          w-11
                                          h-11
                                          rounded-full
                                          bg-gradient-to-br
                                          from-[#f46c44]
                                          to-[#9d2e0d]
                                          text-white
                                          flex
                                          items-center
                                          justify-center
                                          font-bold
                                        "
                                    >
                                      {profile?.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-gray-800 truncate">
                                        {profile?.name}
                                      </p>

                                      <p className="text-xs text-gray-400">
                                        View Dashboard
                                      </p>
                                    </div>

                                    <ChevronRight
                                      size={17}
                                      className="text-gray-300"
                                    />
                                  </Link>

                                  <button
                                    onClick={() => {
                                      Logout();
                                      setIsOpen(false);
                                    }}
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        px-3
                                        py-3
                                        rounded-2xl
                                        text-sm
                                        font-semibold
                                        text-red-500
                                        hover:bg-red-50
                                        transition
                                        text-left
                                      "
                                  >
                                    <LogOut size={17} />
                                    Logout
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* =================================
                              COUNTRIES
                          ================================== */}

                        {screen.type === "countries" && (
                          <div className="px-4 py-5">
                            <div className="mb-5">
                              <div className="flex items-center gap-3">
                                <div>
                                  <h2 className="text-lg font-extrabold text-gray-900">
                                    Choose a Country
                                  </h2>

                                  <p className="text-xs text-gray-400 ">
                                    Find your ideal study destination
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {uniqueCountries.map((country) => (
                                <motion.button
                                  key={country.code}
                                  whileTap={{
                                    scale: 0.98,
                                  }}
                                  onClick={() => handleCountrySelect(country)}
                                  className="
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        p-2
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-white
                                        hover:border-[#f46c44]/20
                                        hover:shadow-md
                                        transition
                                        text-left
                                        group
                                      "
                                >
                                  {country.flag ? (
                                    <div
                                      className="
                                            w-12
                                            h-12
                                            rounded-full
                                            overflow-hidden
                                            flex-shrink-0
                                            border
                                            border-gray-100
                                            bg-gray-50
                                          "
                                    >
                                      <img
                                        src={country.flag}
                                        alt={country.name}
                                        className="
                                              w-full
                                              h-full
                                              object-cover
                                            "
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className="
                                            w-12
                                            h-12
                                            rounded-2xl
                                            bg-gray-50
                                            flex
                                            items-center
                                            justify-center
                                            flex-shrink-0
                                          "
                                    >
                                      <Globe2
                                        size={20}
                                        className="text-gray-400"
                                      />
                                    </div>
                                  )}

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 group-hover:text-[#f46c44] transition">
                                      {country.name}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {
                                        filterUniversitiesByCountry(
                                          country.code,
                                        ).length
                                      }{" "}
                                      universities
                                    </p>
                                  </div>

                                  <div
                                    className="
                                          w-8
                                          h-8
                                          rounded-full
                                          bg-gray-50
                                          flex
                                          items-center
                                          justify-center
                                          group-hover:bg-[#fff0e9]
                                          transition
                                        "
                                  >
                                    <ChevronRight
                                      size={16}
                                      className="
                                            text-gray-300
                                            group-hover:text-[#f46c44]
                                          "
                                    />
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* =================================
                              UNIVERSITIES
                          ================================== */}

                        {screen.type === "universities" && selectedCountry && (
                          <div className="px-4 py-5">
                            <div
                              className="
                                    sticky
                                    top-0
                                    z-10
                                    bg-[#fffdfc]
                                    pb-4
                                  "
                            >
                              <div
                                className="
                                      flex
                                      items-center
                                      gap-3
                                      p-2
                                      rounded-2xl
                                      bg-gradient-to-r
                                      from-[#fff0e9]
                                      to-white
                                      border
                                      border-orange-100
                                    "
                              >
                                {selectedCountry.flag ? (
                                  <img
                                    src={selectedCountry.flag}
                                    alt={selectedCountry.name}
                                    className="
                                          w-12
                                          h-12
                                          rounded-2xl
                                          object-cover
                                          border
                                          border-white
                                        "
                                  />
                                ) : (
                                  <div
                                    className="
                                          w-12
                                          h-12
                                          rounded-2xl
                                          bg-white
                                          flex
                                          items-center
                                          justify-center
                                        "
                                  >
                                    <Globe2
                                      size={20}
                                      className="text-[#f46c44]"
                                    />
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <h2 className="text-base font-extrabold text-gray-900 truncate">
                                    {selectedCountry.name}
                                  </h2>

                                  <p className="text-xs text-gray-400">
                                    {countryUniversities.length} universities
                                    available
                                  </p>
                                </div>
                              </div>
                            </div>

                            {countryUniversities.length > 0 ? (
                              <div className="space-y-2 pb-6">
                                {countryUniversities.map((uni) => (
                                  <Link
                                    key={uni._id}
                                    href={`/universities/${uni.slug}`}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <motion.div
                                      whileTap={{
                                        scale: 0.98,
                                      }}
                                      className="
                                              flex
                                              items-center
                                              gap-3
                                              p-2
                                              rounded-2xl
                                              border
                                              border-gray-100
                                              bg-white
                                              hover:border-[#f46c44]/20
                                              hover:shadow-md
                                              transition
                                              group mb-2
                                            "
                                    >
                                      <div
                                        className="
                                                w-14
                                                h-14
                                                rounded-2xl
                                                bg-gray-50
                                                border
                                                border-gray-100
                                                flex
                                                items-center
                                                justify-center
                                                overflow-hidden
                                                flex-shrink-0
                                              "
                                      >
                                        {uni.uni_logo ? (
                                          <Image
                                            src={uni.uni_logo}
                                            alt={uni.name}
                                            width={56}
                                            height={56}
                                            className="object-contain p-1.5 group-hover:scale-105 transition"
                                          />
                                        ) : (
                                          <Building2
                                            size={25}
                                            className="text-gray-300"
                                          />
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-[#f46c44] transition">
                                          {uni.name}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                          <Globe2 size={11} />
                                          {uni.countryData?.[0]?.name ||
                                            uni.country}
                                        </p>
                                      </div>

                                      <ChevronRight
                                        size={17}
                                        className="
                                                text-gray-300
                                                group-hover:text-[#f46c44]
                                                group-hover:translate-x-1
                                                transition
                                              "
                                      />
                                    </motion.div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div
                                className="
                                      py-20
                                      text-center
                                    "
                              >
                                <div
                                  className="
                                        w-20
                                        h-20
                                        mx-auto
                                        rounded-3xl
                                        bg-gray-50
                                        flex
                                        items-center
                                        justify-center
                                        mb-4
                                      "
                                >
                                  <GraduationCap
                                    size={32}
                                    className="text-gray-300"
                                  />
                                </div>

                                <p className="text-sm font-bold text-gray-600">
                                  No universities found
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                  Try another destination
                                </p>

                                <button
                                  onClick={popNav}
                                  className="
                                        mt-5
                                        text-sm
                                        font-bold
                                        text-[#f46c44]
                                        hover:underline
                                      "
                                >
                                  ← Choose another country
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* =================================
                              SERVICES / DESTINATIONS
                          ================================== */}

                        {(screen.type === "services" ||
                          screen.type === "destinations") && (
                          <div className="px-4 py-5">
                            <div className="mb-5">
                              <h2 className="text-lg font-extrabold text-gray-900">
                                {screen.title}
                              </h2>

                              <p className="text-xs text-gray-400">
                                Explore our options
                              </p>
                            </div>

                            <div className="flex flex-col gap-2">
                              {(screen.data || []).map((item: any) => {
                                const href =
                                  screen.type === "services"
                                    ? `/service/${item.slug}`
                                    : `/${item.slug}`;

                                const title = item.navbarTitle || item.name;

                                const image = item.flag || item.navbarImage;

                                return (
                                  <Link
                                    key={item._id || item.code}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <motion.div
                                      whileTap={{
                                        scale: 0.98,
                                      }}
                                      className="
                                            flex
                                            items-center
                                            gap-3
                                            p-2
                                            rounded-2xl
                                            border
                                            border-gray-100
                                            bg-white
                                            hover:border-[#f46c44]/20
                                            hover:shadow-md
                                            transition
                                            group
                                          "
                                    >
                                      <div
                                        className="
                                              w-10
                                              h-10
                                              rounded-xl
                                              overflow-hidden
                                              flex-shrink-0
                                              bg-gray-50
                                              border
                                              border-gray-100
                                            "
                                      >
                                        <Image
                                          src={image || "/placeholder.png"}
                                          alt={title}
                                          width={56}
                                          height={48}
                                          className="
                                                object-cover
                                                w-full
                                                h-full
                                                group-hover:scale-110
                                                transition-transform
                                                duration-500
                                              "
                                        />
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-[#f46c44] transition">
                                          {title}
                                        </p>

                                        {item.subTitle && (
                                          <p className="text-xs text-gray-400 mt-px truncate">
                                            {item.subTitle}
                                          </p>
                                        )}
                                      </div>

                                      <ChevronRight
                                        size={17}
                                        className="
                                              text-gray-300
                                              group-hover:text-[#f46c44]
                                              group-hover:translate-x-1
                                              transition
                                            "
                                      />
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

              {/* MOBILE BOTTOM FADE */}

              <div
                className="
                  h-7
                  flex-shrink-0
                  bg-gradient-to-t
                  from-gray-100/80
                  to-transparent
                  pointer-events-none
                "
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* =======================================================
          POPUP FORM
      ======================================================== */}

      <AnimatePresence>
        {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}
      </AnimatePresence>
    </>
  );
}
