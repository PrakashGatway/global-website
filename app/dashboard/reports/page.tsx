"use client"

import { motion } from "framer-motion"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"
import { Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

const reportData = [
  { month: "Jan", revenue: 4000, growth: 2400 },
  { month: "Feb", revenue: 3000, growth: 1398 },
  { month: "Mar", revenue: 2000, growth: 9800 },
  { month: "Apr", revenue: 2780, growth: 3908 },
  { month: "May", revenue: 1890, growth: 4800 },
  { month: "Jun", revenue: 2390, growth: 3800 },
]

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
                <p className="text-muted-foreground">View and analyze your performance metrics</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h3 className="font-bold mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--color-primary))" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h3 className="font-bold mb-4">Growth Comparison</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="growth" fill="hsl(var(--color-chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
