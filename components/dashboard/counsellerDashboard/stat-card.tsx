"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value?: string | number
  change?: {
    value: string
    type: "increase" | "decrease"
  }
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  bgColor?: string
  textcolor?: string
  index?: number
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor = "bg-gray-100",
  iconColor = "text-gray-600",
  bgColor = "bg-white",
  textcolor = "gray-900",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.2 },
      }}
      className={`${bgColor} relative overflow-hidden rounded-2xl border border-gray-100 p-6 shadow-sm`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        style={{
          background: `radial-gradient(circle at 100% 0%, ${bgColor === "bg-white" ? "#f3f4f6" : "rgba(255,255,255,0.2)"} 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${textcolor === "white" ? "text-white/80" : "text-gray-500"}`}>
            {title}
          </p>
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className={`mt-2 text-3xl font-bold tracking-tight ${textcolor === "white" ? "text-white" : "text-gray-900"}`}
          >
            {value ?? "—"}
          </motion.h3>
          {change && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="mt-2 flex items-center gap-1"
            >
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  change.type === "increase"
                    ? textcolor === "white"
                      ? "bg-white/20 text-white"
                      : "bg-emerald-50 text-emerald-600"
                    : textcolor === "white"
                      ? "bg-white/20 text-white"
                      : "bg-red-50 text-red-600"
                }`}
              >
                {change.type === "increase" ? "↑" : "↓"} {change.value}
              </span>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: index * 0.1 + 0.1,
          }}
          className={`${iconBgColor} flex h-12 w-12 items-center justify-center rounded-xl`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </motion.div>
      </div>

      {/* Subtle animated pulse */}
      <motion.div
        className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-gradient-to-tr from-transparent to-white/5"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
