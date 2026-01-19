"use client"

import type React from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="pb-20 lg:pb-0">
      {children}
      <MobileBottomNav />
    </div>
  )
}
