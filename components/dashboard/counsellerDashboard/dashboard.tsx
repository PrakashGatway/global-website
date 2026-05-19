"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  IndianRupee,
  AlertCircle,
  Timer,
  CheckCheck,
  TrendingUp,
  BarChart3,
  Sparkles,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"


import Link from "next/link"
import { StatCard } from "./stat-card"
import { ProgressRing } from "./process-ring"
import { AnimatedMetricBar, ApplicationItem, TicketItem } from "./animated-element"
import axiosInstance from "@/app/axiosInstance"



interface CounsellorData {
  users?: {
    total?: number
    active?: number
    activeLast7Days?: number
    newUsers?: { thisWeek?: number }
  }
  applications?: {
    total?: number
    pending?: number
    inProgress?: number
    offerReceived?: number
    completed?: number
    refused?: number
    newApplications?: { today?: number; thisWeek?: number }
    recent?: Array<{
      _id: string
      student: { name: string; email: string; phone: string }
      course: { name: string }
      country: string
      primaryStatus: string
      intake: string
      createdAt: string
    }>
  }
  metrics?: {
    completionRate?: number
    applicationConversionRate?: number
    offerRate?: number
    supportResolutionRate?: number
  }
  revenue?: {
    total?: number
    today?: number
    thisWeek?: number
    thisMonth?: number
    completedPurchases?: number
  }
  support?: {
    total?: number
    open?: number
    pending?: number
    resolved?: number
  }
}

const COLORS = {
  purple: "#8b5cf6",
  teal: "#14b8a6",
  pink: "#ec4899",
  blue: "#3b82f6",
  green: "#22c55e",
  emerald: "#10b981",
}

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function DashboardCounsellor() {
  const [cousellorData, setCounsollerdata] = useState<CounsellorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState("all")
  const [sortType, setSortType] = useState("default")

  const counsellorres = async () => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.get("/dashboard/counsellor")
      setCounsollerdata(res?.data?.data)
    } catch {
      console.error("something went wrong...")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    counsellorres()
  }, [])

  const applicationStats = [
    { name: "Pending", value: cousellorData?.applications?.pending || 0, color: COLORS.purple },
    { name: "In Progress", value: cousellorData?.applications?.inProgress || 0, color: COLORS.teal },
    { name: "Completed", value: cousellorData?.applications?.completed || 0, color: COLORS.pink },
    { name: "Refused", value: cousellorData?.applications?.refused || 0, color: COLORS.blue },
    { name: "Offers", value: cousellorData?.applications?.offerReceived || 0, color: COLORS.green },
  ]

  let filteredData = [...applicationStats]

  if (filterType !== "all") {
    filteredData = filteredData.filter((item) => item.name === filterType)
  }

  if (sortType === "high") {
    filteredData.sort((a, b) => b.value - a.value)
  }

  if (sortType === "low") {
    filteredData.sort((a, b) => a.value - b.value)
  }

  const recentApplications = cousellorData?.applications?.recent || []

  // Weekly data calculation
  const getWeekNumber = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), 0, 1)
    const pastDays = (date.getTime() - firstDay.getTime()) / 86400000
    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7)
  }

  const currentWeek = getWeekNumber(new Date())

  const weeklyData: Record<string, number> = {
    [`Week ${currentWeek - 3}`]: 0,
    [`Week ${currentWeek - 2}`]: 0,
    [`Week ${currentWeek - 1}`]: 0,
    [`Week ${currentWeek}`]: 0,
  }

  recentApplications.forEach((app) => {
    const appDate = new Date(app.createdAt)
    const appWeek = getWeekNumber(appDate)
    if (weeklyData[`Week ${appWeek}`] !== undefined) {
      weeklyData[`Week ${appWeek}`] += 1
    }
  })

  const maxApplications = Math.max(...Object.values(weeklyData), 1)

  const applicationChartData = Object.entries(weeklyData).map(([week, value]) => ({
    week,
    applications: Math.round((value / maxApplications) * 100),
    total: value,
  }))

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/50" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-3xl bg-white/50 lg:col-span-2" />
            <div className="h-96 animate-pulse rounded-3xl bg-white/50" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden"
    >
      <main className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="mt-1 text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-white shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Live Data</span>
          </motion.div>
        </motion.div>

        {/* Top Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <StatCard
            title="Total Users"
            value={cousellorData?.users?.total?.toLocaleString()}
            change={{ value: "15.8%", type: "increase" }}
            icon={Users}
            iconBgColor="bg-[#6d1901]"
            iconColor="text-white"
            bgColor="bg-gradient-to-br from-orange-500 to-rose-500"
            textcolor="white"
            index={0}
          />
          <StatCard
            title="Total Revenue"
            value={
              cousellorData?.revenue?.total
                ? `₹${cousellorData.revenue.total.toLocaleString()}`
                : undefined
            }
            change={{ value: "34.0%", type: "increase" }}
            icon={IndianRupee}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
            index={1}
            
          />
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* Applications Overview Chart */}
          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2"
          >
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800">Applications Overview</h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">Track applications & performance</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 ">
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="all">All</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Refused">Refused</option>
                  <option value="Offers">Offers</option>
                </motion.select>

                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="default">Default</option>
                  <option value="high">Highest First</option>
                  <option value="low">Lowest First</option>
                </motion.select>
              </div>
            </div>

            {/* Top Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                {
                  label: "Total Applications",
                  value: cousellorData?.applications?.total,
                  bg: "bg-gray-50",
                  color: "text-gray-800",
                },
                {
                  label: "Today",
                  value: cousellorData?.applications?.newApplications?.today,
                  bg: "bg-indigo-50",
                  color: "text-indigo-600",
                },
                {
                  label: "This Week",
                  value: cousellorData?.applications?.newApplications?.thisWeek,
                  bg: "bg-blue-50",
                  color: "text-blue-600",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`rounded-2xl ${stat.bg} p-4 transition-shadow hover:shadow-md`}
                >
                  <p className={`text-sm ${stat.color} opacity-70`}>{stat.label}</p>
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className={`mt-3 text-2xl font-bold ${stat.color}`}
                  >
                    {stat.value ?? "—"}
                  </motion.h2>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="h-[180px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationChartData} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${props.payload.total} Applications`,
                      props.payload.week,
                    ]}
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="applications" fill={COLORS.emerald} radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 flex flex-wrap items-center gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.name}</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Project Progress */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Project Progress</h2>
                <p className="mt-1 text-sm text-slate-500">Overall completion status</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
              >
                Active
              </motion.div>
            </div>

            <div className="mt-8 flex justify-center">
              <ProgressRing
                progress={cousellorData?.metrics?.completionRate || 0}
                color="#16a34a"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Second Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* Performance Analytics */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Performance Analytics</h3>
                <p className="mt-1 text-sm text-gray-500">Weekly counsellor performance</p>
              </div>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
              >
                <TrendingUp className="h-6 w-6" />
              </motion.div>
            </div>

            <div className="flex items-end justify-between gap-4 pt-8">
              <AnimatedMetricBar
                label="Conversion"
                sublabel="Applications"
                value={cousellorData?.metrics?.applicationConversionRate || 0}
                color={COLORS.emerald}
                index={0}
              />
              <AnimatedMetricBar
                label="Offers"
                sublabel="Received"
                value={cousellorData?.metrics?.offerRate || 0}
                color={COLORS.teal}
                index={1}
              />
              <AnimatedMetricBar
                label="Completed"
                sublabel="Success rate"
                value={cousellorData?.metrics?.completionRate || 0}
                color="#166534"
                index={2}
              />
              <AnimatedMetricBar
                label="Support"
                sublabel="Resolution"
                value={cousellorData?.metrics?.supportResolutionRate || 0}
                color="#9ca3af"
                index={3}
              />
            </div>
          </motion.div>

          {/* Support Tickets */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Support Tickets</h3>
                <p className="mt-1 text-sm text-gray-500">Track requests & resolutions</p>
              </div>
              <Link href="/dashboard/support/counsellor">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  View All
                </motion.button>
              </Link>
            </div>

            <div className="space-y-4">
              <TicketItem
                icon={AlertCircle}
                iconBg="bg-red-50"
                iconColor="text-red-500"
                title="Open Tickets"
                subtitle="Requires attention"
                value={cousellorData?.support?.open ?? 0}
                valueColor="text-red-500"
                statusText="Active issues"
                index={0}
              />
              <TicketItem
                icon={Timer}
                iconBg="bg-amber-50"
                iconColor="text-amber-500"
                title="Pending Tickets"
                subtitle="Waiting for response"
                value={cousellorData?.support?.pending ?? 0}
                valueColor="text-amber-500"
                statusText="In progress"
                index={1}
              />
              <TicketItem
                icon={CheckCheck}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="Resolved Tickets"
                subtitle="Successfully completed"
                value={cousellorData?.support?.resolved ?? 0}
                valueColor="text-emerald-600"
                statusText="Completed"
                index={2}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4"
            >
              <div>
                <p className="text-sm text-gray-500">Total Tickets</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900">
                  {cousellorData?.support?.total ?? 0}
                </h3>
              </div>
              <div className="flex gap-2">
                {["red", "amber", "emerald"].map((color, i) => (
                  <motion.div
                    key={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className={`rounded-full bg-${color}-100 px-3 py-1 text-xs font-medium text-${color}-600`}
                  >
                    {color === "red" ? "Open" : color === "amber" ? "Pending" : "Resolved"}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Recent Applications</h3>
                <p className="mt-1 text-sm text-gray-500">Latest student activities</p>
              </div>
              <Link href="/dashboard/application_details">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  View All
                </motion.button>
              </Link>
            </div>

            <div className="space-y-2">
              {recentApplications.length > 0 ? (
                recentApplications.slice(0, 2).map((app, index) => (
                  <ApplicationItem
                    key={app._id}
                    name={app.student.name}
  
                    phone={app.student.phone}
                    country={app.country}
                    course={app.course.name}
                    status={app.primaryStatus}
                 
                
                    index={index}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-200"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl"
                    >
                      📄
                    </motion.div>
                    <h4 className="mt-3 text-lg font-semibold text-gray-700">
                      No Applications Found
                    </h4>
                    <p className="mt-1 text-sm text-gray-400">
                      Recent applications will appear here
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  )
}
