"use client"

import type React from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useIsMobile } from "@/hooks/use-mobile"
import { GlobalProvider, useGlobal } from "../../src/statecontext"

import { usePathname } from "next/navigation"
import { NotificationProvider } from "@/components/dashboard/Notification"

import {
  messaging,
  getToken,
  onMessage,
} from "@/lib/firebase";
import axiosInstance from "../axiosInstance"
import { toast } from "sonner" // Make sure to import toast

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

  // Add a ref to track if token has been requested/saved
  const tokenRequestedRef = useRef(false);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [router])

  useEffect(() => {
    if (profile && !loading && !tokenRequestedRef.current) {
      tokenRequestedRef.current = true; // Mark as requested immediately to prevent multiple calls
      requestPermission();
    }
  }, [profile, loading]); // Remove requestPermission from dependencies

  const requestPermission = async () => {
    try {
      // Check if Notification API is available
      if (typeof Notification === 'undefined') {
        console.log('Notification API not supported');
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        if (!messaging) {
          return;
        }

        const token = await getToken(messaging, {
          vapidKey: "BDyrqnEnHplqPQDrfienXIeY4eo49-eCp3Sq7kp78t1RXwPWnUpILuTdBJXY2Isu5fZNX6fDV1FhF6m7yP0Hr2s",
        });

        if (token && profile?._id) {
          await axiosInstance.post('/users/save-token', {
            token,
            userId: profile._id
          })
        }
      }
    } catch (error) {
      console.log('Error requesting notification permission:', error);
      tokenRequestedRef.current = false;
    }
  };

  useEffect(() => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      if (payload.notification?.body) {
        toast.success(payload.notification.body);
      }
    });
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen && isMobile) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen, isMobile])

  if (!loading && !profile) {
    window.location.replace("/login")
    return null
  }

  if (loading) {
    return null
  }

  // if (usePathname()?.includes("/checkout")) {
  //   return (
  //     <div className="min-h-screen bg-white">
  //       <main
  //         className="flex-1 overflow-y-auto pb-20 lg:pb-0"
  //       >
  //         <div className="mx-auto">
  //           {children}
  //         </div>
  //       </main>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader profile={profile} Logout={Logout} />
          <main
            ref={containerRef}
            className="flex-1 overflow-y-auto pb-20 lg:pb-0"
          >
            <div className="mx-auto p-2 md:p-4">
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  )
}