"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, MessageSquare, BarChart3, Settings, Shield, LogOut, ChevronLeft, Crown } from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: Shield, label: "Privacy", href: "/dashboard/privacy" },
]

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay with swipe support */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            onTap={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar with swipe gesture */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="x"
        dragElastic={0.2}
        dragConstraints={{ left: 0, right: 100 }}
        onDragEnd={(event, { offset, velocity }) => {
          if (offset.x < -50 || velocity.x < -500) {
            onClose()
          }
        }}
        className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground pt-20 lg:pt-0 z-50 lg:static lg:translate-x-0 overflow-y-auto flex flex-col touch-pan-y"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border lg:block hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
              <Crown className="w-6 h-6 text-sidebar-accent-foreground" />
            </div>
            <div>
              <p className="font-bold text-sidebar-foreground">Global Way</p>
              <p className="text-xs text-sidebar-accent-foreground/70">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer group ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"}`}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 rounded-full bg-sidebar-primary-foreground"
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-all group"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>

        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 hover:bg-sidebar-accent/20 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </motion.aside>
    </>
  )
}
