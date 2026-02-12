// dashboard-layout.tsx
"use client"

import type React from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useIsMobile } from "@/hooks/use-mobile"
import { GlobalProvider } from "../../src/statecontext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [router])

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen && isMobile) {
        setSidebarOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen, isMobile])

  return (
    <GlobalProvider>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen overflow-hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader 
              onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            />
            
            <main 
              ref={containerRef}
              className="flex-1 overflow-y-auto pb-20 lg:pb-0"
            >
              <div className="container mx-auto p-4 md:p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
        
        <MobileBottomNav />
      </div>
    </GlobalProvider>
  )
}