// mobile-bottom-nav.tsx
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, BarChart3, MessageSquare, Settings, Shield, Bell, Wallet, FileText, GraduationCapIcon, GiftIcon } from "lucide-react"

// Updated to match sidebar items or create a subset for mobile
const tabs = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", id:'dashboard' },
  { icon: BarChart3, label: "Universities", href: "/dashboard/universities", id: 'universities' },
  { icon: GraduationCapIcon, label: "Programs", href: "/dashboard/programs", id: 'find-programs' },
  { icon: GiftIcon, label: "Offers", href: "/dashboard/offers", id: 'offers' },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", id: 'settings' }
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + '/')
          return (
            <Link key={tab.href} href={tab.href} id={tab.id} className="flex-1 min-w-0">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <motion.div 
                  animate={{ scale: isActive ? 1.1 : 1 }} 
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <tab.icon className="w-5 h-5" />
                </motion.div>
                <span className="text-[11px] mt-1 font-medium truncate px-1">{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}