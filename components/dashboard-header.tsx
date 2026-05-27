import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Settings, LogOut, ChevronDown, BellElectricIcon, BellIcon, HistoryIcon, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import { useGlobal } from "@/src/statecontext";

export function DashboardHeader({ profile, Logout }) {
  const [searchFocus, setSearchFocus] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = usePathname()
  const [newNotification, setNewNotification] = useState([]);
  const { show, setShow } = useGlobal();

  // if(location){
  //   location.startsWith("/dashboard/loan")
  //   return null
  // }

  // Fetch notifications with unread filter support
  const fetchNotifications = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        unread: 'true'
      });

      const response = await axiosInstance.get(`/notifications?${params.toString()}`);

      if (response.data.success) {
        const newNotifications = response.data.data.notifications;
        console.log("Fetched notifications:", newNotifications);
        setNewNotification(newNotifications);

      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  // console.log("profile", profile);

  
  useEffect(() => {
    fetchNotifications();
  }, [])

  

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b  border-border">
      <div className="flex items-center justify-between px-2 md:px-4 py-2 gap-4">
        <div className="flex gap-3 w-[50%] items-center justify-start">
          <Menu className="text-gray-600" onClick={() => setShow(!show)} />
          <motion.div
            animate={{ maxWidth: searchFocus ? 600 : 420 }}
            className="relative flex-1"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-primary/30 transition-all bg-background text-sm"
            />
          </motion.div>
        </div>


        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/notifications"
            className="h-11 w-11 flex items-center justify-center p-0 m-0  relative "
          >
            {newNotification.length > 0 && (
              <span className="absolute z-50 -top-1 -right-1 bg-destructive text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {newNotification.length}
              </span>
            )}
            <Image src="https://i.pinimg.com/originals/fb/11/55/fb1155591460c455edf3ced130b127b9.gif"
              alt="avatar" width={40} height={40} className="w-full rounded-full h-full object-cover" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-xl transition-colors"
            >
              <span className="h-10 w-10 border rounded-full p-0 m-0 shadow-lg overflow-hidden">
                <Image
                  src={profile && profile.profileImage ? profile.profileImage
                    : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9lRck6miglY0SZF_BZ_sK829yiNskgYRUg&s`}
                  alt={profile && profile.name || "user"} width={34} height={34} className="ovject-cover" />
              </span>
              <div className="hidden md:block text-left ">
                <p className="text-sm font-semibold capitalize leading-none">{profile && profile.name}</p>

                <p className="text-sm text-gray-600 pt-1 capitalize leading-none"> {
                  profile?.role == "user" ? "User" : profile?.role}</p>

              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-50 bg-black/10" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 1, y: -130, x: 20, scale: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 1, y: -130, x: 20, scale: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <span className="h-11 w-11 border rounded-full p-0 m-0  shadow-lg overflow-hidden">
                          <Image src={profile && profile.profileImage ? profile.profileImage : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9lRck6miglY0SZF_BZ_sK829yiNskgYRUg&s`} alt={profile && profile.name} width={40} height={40} className="h-full w-full ovject-cover" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold capitalize">{profile && profile.name}</p>
                          <p className="text-xs text-muted-foreground">{profile && profile.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        <User className="w-5 h-5 text-muted-foreground" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/dashboard/notifications"
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        <BellIcon className="w-5 h-5 text-muted-foreground" />
                        Notification
                      </Link>
                      {profile?.role !== "counsellor" && <Link
                        href="/dashboard/application"
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        <HistoryIcon className="w-5 h-5 text-muted-foreground" />
                        Application history
                      </Link>}
                    </div>
                    <div className="p-1.5 border-t border-border">
                      <button
                        onClick={() => Logout()}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
