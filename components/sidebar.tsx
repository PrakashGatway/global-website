import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";.
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  FileText,
  Wallet,
  Headphones,
  Bell,
  Settings,
  ChevronLeft,
  LucideIndianRupee,
  ChevronRight,
  User2Icon,
  ReceiptText,
  School,
  Tickets,
  GiftIcon,
  Armchair,
  HandCoins,
  UsersIcon,
  Building2Icon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGlobal } from "@/src/statecontext";
import { MdDetails } from "react-icons/md";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: School, label: "Universities", href: "/dashboard/universities" },
  { icon: ReceiptText, label: "Countries", href: "/dashboard/countries" },
  { icon: BarChart3, label: "Find Programs", href: "/dashboard/programs" },
  { icon: FileText, label: "Application", href: "/dashboard/application" },
  { icon: Tickets, label: "Visa Process", href: "/dashboard/visa" },
  { icon: HandCoins, label: "Scholarship", href: "/dashboard/scholarships" },
  { icon: Armchair, label: "Accommodation", href: "/dashboard/accommodation" },
  // { icon: Wallet, label: "Ooshas Solution", href: "/dashboard/solution" },
  { icon: Wallet, label: "Payments", href: "/dashboard/payment" },
  { icon: GiftIcon, label: "Offers", href: "/dashboard/offers" },
  { icon: Headphones, label: "Support", href: "/dashboard/support" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const counsellor = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: UsersIcon, label: "Student", href: "/dashboard/user" },
  { icon: FileText, label: "Application", href: "/dashboard/application_details" },
  { icon: BarChart3, label: "Find Programs", href: "/dashboard/programs" },
  { icon: FileText, label: "Visa Prosessing", href: "/dashboard/visaDetails" },
  { icon: Building2Icon, label: "Accommodation Details", href: "/dashboard/accommodation-create" },
  { icon: Headphones, label: "Support", href: "/dashboard/support/counsellor" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },

]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = usePathname();
  const { profile, show } = useGlobal();

  // console.log()
  // if(location){
  //   location.startsWith("/dashboard/loan")
  //   return null
  // }

  if (!profile) {
    return null
  }

  return (
    <motion.aside
      animate={{ width: show ? 110 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden relative lg:flex flex-col h-screen border-r sticky top-0 bg-[#f26d44] text-sidebar-foreground overflow-hidden z-40"
    >

      {/* <div className="absolute z-10 top-0 -right-0 bg-red-600">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 px-0.5 hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div> */}
      {/* Logo */}
      <div className="flex bg-white items-center gap-3 pl-6 pr-3 min-h-[64px]">
        <AnimatePresence>
          <Image
            src="https://ooshasglobal.com/images/newlogo3.png"
            alt="Logo"
            width={100}
            height={90}
            loading="lazy"
            className="scale-120"
          />
        </AnimatePresence>
      </div>

      {/* Menu Items */}
      <nav className={`flex-1 ${show ? "px-2 py-4 pb-12 space-y-[1.5px]" : "px-3 py-4 space-y-[2px]"}  overflow-y-auto mt-1 no-scrollbar scrollbar-hide scollbar-none`}>

        {(profile.role == "counsellor" ? counsellor : menuItems).map((item) => {
          const isActive =
            location === item.href ||
            (item.href !== "/dashboard" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block"
            >
              <motion.div
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.04 }}
                className={`flex items-center rounded-lg transition-colors relative ${isActive
                  ? "bg-[#6d1901]/70 font-semibold shadow"
                  : "hover:bg-[#6d1901]/30"

                  } ${show ? "flex-col gap-1 px-2 py-2" : "gap-2 px-4 py-2.5"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}

                <item.icon className="w-6 h-6 flex-shrink-0 stroke-[1.6px] mb-0 pb-0" />
                <AnimatePresence>
                  {show && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-center overflow-hidden text-[11px]"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {!show && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden text-[15px]"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })
        }
      </nav>

      {/* Logout */}
      {/* <div className="px-3 py-2 border-t border-sidebar-border/30">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full hover:bg-sidebar-accent transition-colors">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!show && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap text-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div> */}

    </motion.aside>
  );
}