"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X, GraduationCap, BookOpen, MessageSquare, Target, FileText, Briefcase, Phone, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Home", href: "/" },
  { 
    name: "About Us", 
    href: "/about", 
    icon: GraduationCap,
   
  },
  { 
    name: "Services", 
    href: "#", 
    hasDropdown: false,
    icon: MessageSquare,
 
  },
  { 
    name: "Destination", 
    href: "/Destination", 
    hasDropdown: true,
    icon: Target,
    dropdownItems: [
      { name: "Ivy League", slug: "ivy-league", description: "Comprehensive IELTS coaching" },
      { name: "GMAT Preparation", slug: "gmat", description: "Score high in GMAT" },
      { name: "PTE Academic", slug: "pte", description: "Pearson Test of English" },
      { name: "GRE Preparation", slug: "gre" , description: "Regular practice tests and mock exams" }
    ]
  },
  { 
    name: "Blogs", 
    href: "/blog", 
    hasDropdown: false,
    icon: FileText,
   
  },
  { 
    name: "Events", 
    href: "/events", 
    hasDropdown: false,
    icon: Calendar,
   
  },
  { 
    name: "Career", 
    href: "/career", 
    hasDropdown: false,
    icon: Briefcase,
    dropdownItems: [
      { name: "Job Opportunities", href: "#jobs", description: "Join our team" },
      { name: "Internships", href: "#internships", description: "Gain practical experience" },
      { name: "Teacher Training", href: "#training", description: "Become an instructor" },
      { name: "Career Guidance", href: "#guidance", description: "Plan your future" }
    ]
  },
  { 
    name: "Contact Us", 
    href: "/contact",
    icon: Phone
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [hoveredDropdown, setHoveredDropdown] = React.useState<string | null>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-999 bg-white border-b border-gray-200 transition-all duration-300 ${
      scrolled ? "shadow py-2" : "py-2"
    }`}>
      {/* ===== Container ===== */}
      <div className="max-w-7xl px-4 mx-auto">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}>

          {/* Logo with scaling effect */}
          <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Gaway Prep"
              width={scrolled ? 140 : 140}
              height={scrolled ? 45 : 50}
              className="h-auto object-contain transition-all duration-300"
              priority
            />
          </Link>

          {/* ===== Desktop Nav ===== */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => setHoveredDropdown(item.name)}
                onMouseLeave={() => setHoveredDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-base font-medium text-gray-800 hover:text-orange-500 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-orange-50"
                >
                  {/* {item.icon && <item.icon size={16} />} */}
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <motion.div
                      animate={{ rotate: hoveredDropdown === item.name ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} className="mt-[2px]" />
                    </motion.div>
                  )}
                </Link>

                {/* Enhanced Dropdown */}
                {item.hasDropdown && (
                  <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <motion.div 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="w-64 rounded-xl bg-white border border-gray-100 shadow-2xl py-4 overflow-hidden"
                    >
                      {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-500" /> */}
                      
                      {item.dropdownItems?.map((dropdownItem, index) => (
                        <motion.div
                          key={dropdownItem.name}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                          key={dropdownItem.slug}
                            href={`/preparation/${dropdownItem.slug}`}
                            className="block px-5 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 group/item transition-all duration-200 border-l-2 border-transparent hover:border-orange-400"
                          >
                            <div className="font-semibold text-gray-800 group-hover/item:text-orange-600 transition-colors">
                              {dropdownItem.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 group-hover/item:text-gray-600">
                              {dropdownItem.description}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                      
                    
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ===== Mobile Menu Button ===== */}
          <button
            className="lg:hidden text-gray-700 hover:text-orange-500 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* ===== Mobile Drawer ===== */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] p-6 shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <GraduationCap size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <Image
                      src="/images/gaway-20prep-20final-202.jpg"
                      alt="Gaway Prep"
                      width={100}
                      height={35}
                      className="h-8 w-auto object-contain"
                    />
                    <div className="text-xs text-gray-500">Educational Excellence</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <div key={item.name} className="border-b border-gray-100 last:border-0">
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-4 text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && <item.icon size={18} />}
                        <span>{item.name}</span>
                      </div>
                      {item.hasDropdown && <ChevronDown size={16} />}
                    </Link>
                    
                    {/* Mobile Dropdown */}
                    {item.hasDropdown && item.dropdownItems && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-8"
                      >
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={"/"}
                            onClick={() => setIsOpen(false)}
                            className="block py-3 text-gray-600 hover:text-orange-500 border-l-2 border-gray-200 hover:border-orange-400 pl-4"
                          >
                            <div className="font-medium">{dropdownItem.name}</div>
                            <div className="text-sm text-gray-400">{dropdownItem.description}</div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <button className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg">
                  Start Free Trial
                </button>
                <div className="text-center text-xs text-gray-500 mt-3">
                  No credit card required
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}