"use client"

import type React from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useIsMobile } from "@/hooks/use-mobile"
import { GlobalProvider, useGlobal } from "../../src/statecontext"
import { NotificationProvider } from "@/components/dashboard/Notification"

import {
  messaging,
  getToken,
  onMessage,
} from "@/lib/firebase";
import axiosInstance from "../axiosInstance"
import { toast } from "sonner" // Make sure to import toast
import DriverTour from "@/components/Tour/DriverTour"

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
  }, [profile, loading]);


  const requestPermission = async () => {
    try {
      if (typeof Notification === 'undefined') {
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

  const [startTour, setStartTour] = useState(false);

  useEffect(() => {
    if (!profile) return

    const hasSeen = localStorage.getItem(`dashboardTour_${profile?.email}`);

    if (!hasSeen) {
      setTimeout(() => {
        setStartTour(true);
      }, 500);
    }
    
  }, [profile]);

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

  // if (usePathname().includes("/checkout")) {
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

  

const steps = [
  
  {
    element: "#overviewer",
    popover: {
      description: `
        <div class="tour-mobile-card">

          <div class="tour-image-wrapper">
            <img
              src="/ai.gif"
              alt="Assistant"
              class="tour-main-image"
            />
          </div>

          <div class="tour-content">

            <div class="tour-step">
              Step 1 of 9
            </div>

            <h2 class="tour-title">
              Let's complete your
              <span>Profile</span>
            </h2>

            <p class="tour-description">
              Delays in profile completion will affect all
              subsequent steps including university
              shortlisting and applications
            </p>

            <p class="tour-duration">
              Est. &nbsp;4–6 weeks remaining
            </p>

          </div>

        </div>
      `,

      side: "bottom",
      align: "center",

      popoverClass: "mobile-tour-popover",
    },
  },

  {
    element: "#profile",
    popover: {
      description: `
        <div class="tour-content-card">

          <div class="tour-small-image">
            <img
              src="/ai.gif"
              alt="Profile"
              class="tour-small-img"
            />
          </div>

          <h2 class="tour-heading">
            👤 Your Profile
          </h2>

          <p class="tour-text">
            Keep your personal and academic information updated.
            A complete profile helps us provide better university
            recommendations and application support.
          </p>

        </div>
      `,

      side: "bottom",
      align: "center",

      popoverClass: "mobile-tour-popover",
    },
  },

  {
    element: "#notification",
    popover: {
      description: `
        <div class="tour-content-card">

          <div class="tour-small-image">
            <img
              src="/ai.gif"
              alt="Notifications"
              class="tour-small-img"
            />
          </div>

          <h2 class="tour-heading">
            🔔 Notifications
          </h2>

          <p class="tour-text">
            Stay updated with alerts, deadlines, application
            updates, and important announcements related to
            your study abroad journey.
          </p>

        </div>
      `,

      side: "bottom",
      align: "center",

      popoverClass: "mobile-tour-popover",
    },
  },

  {
    element: "#dashboard",
    popover: {
      description: `
        <div class="tour-content-card">

          <div class="tour-small-image">
            <img
              src="/ai.gif"
              alt="Dashboard"
              class="tour-small-img"
            />
          </div>

          <h2 class="tour-heading">
            📊 Dashboard
          </h2>

          <p class="tour-text">
            Your central hub for managing your study abroad
            journey. Access your applications, track your
            progress, and stay updated with important activities.
          </p>

        </div>
      `,

      side: isMobile ? "top" : "right",
      align: "center",

      popoverClass: "mobile-bottom-nav-tour",
    },
  },

  {
    element: "#universities",
    popover: {
      description: `
        <div class="tour-content-card">

          <div class="tour-small-image">
            <img
              src="/ai.gif"
              alt="Universities"
              class="tour-small-img"
            />
          </div>

          <h2 class="tour-heading">
            🎓 Universities
          </h2>

          <p class="tour-text">
            Explore universities, compare courses, check
            requirements, and shortlist institutions that
            match your academic goals.
          </p>

        </div>
      `,

      side: isMobile ? "top" : "right",
      align: "center",

      popoverClass: "mobile-bottom-nav-tour",
    },
  },

  {
    element: "#find-programs",
    popover: {
      description: `
        <div class="tour-content-card">

          <div class="tour-small-image">
            <img
              src="/ai.gif"
              alt="Programs"
              class="tour-small-img"
            />
          </div>

          <h2 class="tour-heading">
            🔍 Find Programs
          </h2>

          <p class="tour-text">
            Discover programs based on your preferred
            destination, course, university, budget, and
            academic requirements.
          </p>

        </div>
      `,

      side: isMobile ? "top" : "right",
      align: "center",

      popoverClass: "mobile-bottom-nav-tour",
    },
  },

  {
    element: "#offers",
    popover: {
      description: `
        <div class="tour-content-card">

          <div class="tour-small-image">
            <img
              src="/ai.gif"
              alt="Offers"
              class="tour-small-img"
            />
          </div>

          <h2 class="tour-heading">
            📨 Offers
          </h2>

          <p class="tour-text">
            View and respond to admission offers and acceptance
            letters. Compare your offers and make informed
            decisions about your future.
          </p>

        </div>
      `,

      side: isMobile ? "top" : "right",
      align: "center",

      popoverClass: "mobile-bottom-nav-tour",
    },
  },

  {
    element: "#settings",
    popover: {
      description: `
        <div class="tour-content-card">

          <div class="tour-small-image">
            <img
              src="/ai.gif"
              alt="Settings"
              class="tour-small-img"
            />
          </div>

          <h2 class="tour-heading">
            ⚙️ Settings
          </h2>

          <p class="tour-text">
          Manage your account settings and tailor your preferences. Update your profile, control your privacy and notifications, and explore other sections of the platform.
          </p>

        </div>
      `,

      side: isMobile ? "top" : "right",
      align: "center",

      popoverClass: "mobile-bottom-nav-tour",
    },
  },

  {
    element: "#assistant",
    popover: {
      description: `
        <div class="tour-content-card">

          <div class="tour-small-image">
            <img
              src="/ai.gif"
              alt="Assistant"
              class="tour-small-img"
            />
          </div>

          <h2 class="tour-heading">
            🤖 Your Assistant
          </h2>

          <p class="tour-text">
            I am here to help you navigate the app, understand
            features, explore universities and programs, and
            answer questions throughout your journey.
          </p>

          <div class="tour-options">

            <span>
              About University
            </span>

            <span>
              Cost & Duration
            </span>

            <span>
              Features
            </span>

            <span>
              Scholarships
            </span>

          </div>

        </div>
      `,

      side: isMobile ? "top" : "right",
      align: "center",

      popoverClass: isMobile
        ? "mobile-bottom-nav-tour"
        : "desktop-tour-popover",
    },
  },
];

  return (
    <div className="min-h-screen bg-white">

      <DriverTour
        start={startTour}
        profile={profile}
        onFinish={() => setStartTour(false)}
        step={!isMobile ? null : steps}
      />


      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div id="overview">
            <DashboardHeader profile={profile} Logout={Logout} />
          </div>
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