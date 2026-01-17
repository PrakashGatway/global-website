"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Bell, User, Menu, Settings } from "lucide-react"

export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const [searchFocus, setSearchFocus] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 gap-4">
        {/* Left - Menu Button & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <motion.div animate={{ width: searchFocus ? "100%" : "auto" }} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-background"
            />
          </motion.div>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-full bg-primary/20 border border-primary/30 cursor-pointer"
          >
            <User className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
      </div>
    </header>
  )
}
