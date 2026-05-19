"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface AnimatedMetricBarProps {
  label: string
  sublabel: string
  value: number
  maxHeight?: number
  color: string
  index?: number
}

export function AnimatedMetricBar({
  label,
  sublabel,
  value,
  maxHeight = 150,
  color,
  index = 0,
}: AnimatedMetricBarProps) {
  const height = Math.max(value * 1.5, 30)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative flex items-end">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: index * 0.15 + 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="w-14 rounded-full transition-all"
          style={{ backgroundColor: color }}
        />
        
        {/* Animated value badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.8, type: "spring" }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold shadow-lg border border-gray-100"
          style={{ color }}
        >
          {value}%
        </motion.span>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="mt-1 text-xs text-gray-400">{sublabel}</p>
      </div>
    </motion.div>
  )
}

interface TicketItemProps {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  subtitle: string
  value: number
  valueColor: string
  statusText: string
  index?: number
}

export function TicketItem({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  value,
  valueColor,
  statusText,
  index = 0,
}: TicketItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      whileHover={{ x: 4, backgroundColor: "rgba(249, 250, 251, 0.5)" }}
      className="flex items-center justify-between rounded-xl p-2 transition-colors"
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </motion.div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>

      <div className="text-right">
        <motion.h3
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
          className="text-2xl font-bold text-gray-900"
        >
          {value}
        </motion.h3>
        <p className={`mt-1 text-xs ${valueColor}`}>{statusText}</p>
      </div>
    </motion.div>
  )
}

interface ApplicationItemProps {
  name: string
  email: string
  phone: string
  country: string
  course: string
  status: string
  intake: string
  createdAt: string
  index?: number
}

export function ApplicationItem({
  name,

  phone,
  country,
  course,
  status,
  
  index = 0,
}: ApplicationItemProps) {
  const statusColors: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Refused: "bg-red-50 text-red-700 border-red-200",
    default: "bg-blue-50 text-blue-700 border-blue-200",
  }

  const statusClass = statusColors[status] || statusColors.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 + 0.2 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(249, 250, 251, 0.8)" }}
      className="flex items-center justify-between rounded-xl p-4 transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-sm"
    >
      <div className="flex items-center gap-4 ">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg"
        >
          {name?.charAt(0)}
        </motion.div>

        <div className="w-40">
          <h4 className="text-base font-semibold text-gray-800">{name}</h4>
          <p className="mt-0.5 text-sm text-gray-500">{course}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
         
            <span className="flex items-center gap-1">
              <span className="text-gray-300">☎</span> {phone}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-gray-300">🌍</span> {country}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.15 + 0.4 }}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClass}`}
        >
          {status}
        </motion.span>
       
      </div>
    </motion.div>
  )
}
