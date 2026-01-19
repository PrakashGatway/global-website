"use client"

import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"
import { Bell, Lock, Eye, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const settings = [
  { title: "Email Notifications", description: "Get notified about important updates", icon: Bell },
  { title: "Two-Factor Authentication", description: "Add extra security to your account", icon: Lock },
  { title: "Profile Visibility", description: "Control who can see your profile", icon: Eye },
]

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toggles, setToggles] = useState({ notifications: true, twoFactor: false, visibility: true })

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
            </motion.div>

            <div className="space-y-4">
              {settings.map((setting, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6 flex items-center justify-between hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <setting.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">{setting.title}</h3>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setToggles({ ...toggles, [Object.keys(toggles)[i]]: !Object.values(toggles)[i] })}
                    className="p-2"
                  >
                    <ToggleRight
                      className={`w-6 h-6 transition-colors ${Object.values(toggles)[i] ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-8 border-t border-border"
            >
              <h2 className="font-bold mb-4">Danger Zone</h2>
              <Button variant="destructive">Delete Account</Button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
