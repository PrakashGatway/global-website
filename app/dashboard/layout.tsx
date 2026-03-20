
"use client"

import type React from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useIsMobile } from "@/hooks/use-mobile"
import { GlobalProvider, useGlobal } from "../../src/statecontext"
import Loading from "../loading"
import { usePathname } from "next/navigation"
import { NotificationProvider } from "@/components/dashboard/Notification"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { profile, loading, Logout } = useGlobal();

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [router])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen && isMobile) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen, isMobile])

  if (loading) {
    <Loading />
  }
  if (!loading && !profile) {
    window.location.replace("/login")
    return null
  }

  if (usePathname().includes("/checkout")) {
    return (
      <GlobalProvider>
        <div className="min-h-screen bg-white">
          <main
            className="flex-1 overflow-y-auto pb-20 lg:pb-0"
          >
            <div className="mx-auto">
              {children}
            </div>
          </main>
        </div>
      </GlobalProvider>
    )
  }

  return (
    <GlobalProvider>
      <div className="min-h-screen bg-white">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader profile={profile} Logout={Logout} />

            <main
              ref={containerRef}
              className="flex-1 overflow-y-auto pb-20 lg:pb-0"
            >
              <div className="mx-auto p-4">
               <NotificationProvider>
          {children}
        </NotificationProvider>
              </div>
            </main>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    </GlobalProvider>
  )
}