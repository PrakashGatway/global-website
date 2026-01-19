"use client"

import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"
import { Shield, Eye, Lock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const privacySettings = [
  { title: "Profile Privacy", description: "Control who can view your profile", icon: Eye },
  { title: "Data Collection", description: "Manage how your data is collected", icon: Shield },
  { title: "Third-Party Access", description: "Control third-party app access", icon: Share2 },
  { title: "Login Activity", description: "View and manage your login sessions", icon: Lock },
]

export default function PrivacyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Privacy Settings</h1>
              <p className="text-muted-foreground">Manage your privacy and data preferences</p>
            </motion.div>

            <div className="space-y-4">
              {privacySettings.map((setting, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <setting.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">{setting.title}</h3>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
