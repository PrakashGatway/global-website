"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, MessageSquare, BarChart3, Settings, Shield } from "lucide-react"

const tabs = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: Shield, label: "Privacy", href: "/dashboard/privacy" },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card border-t border-border">
      <div className="flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <tab.icon className="w-5 h-5" />
                </motion.div>
                <span className="text-xs mt-1 font-medium hidden sm:inline">{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-b-full"
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
