import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-8 py-2.5 gap-4">
        {/* Search */}
        <motion.div
          animate={{ maxWidth: searchFocus ? 500 : 320 }}
          className="relative flex-1"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all bg-background text-sm"
          />
        </motion.div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 hover:bg-muted rounded-xl transition-colors relative"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button> */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-11 w-11 flex items-center justify-center border rounded-full p-0 m-0 shadow-lg relative overflow-hidden"
          >
                <Image src="https://i.pinimg.com/originals/fb/11/55/fb1155591460c455edf3ced130b127b9.gif" alt="avatar" width={40} height={40} className="w-full h-full object-cover" />
          
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-xl transition-colors"
            >
              <span className="h-11 w-11 border rounded-full p-0 m-0  shadow-lg overflow-hidden">
                <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9lRck6miglY0SZF_BZ_sK829yiNskgYRUg&s" alt="avatar" width={40} height={40} />
              </span>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold capitalize leading-none">John Doe</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        {/* <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                            JD
                          </AvatarFallback>
                        </Avatar> */}
                        <div>
                          <p className="text-sm font-semibold">John Doe</p>
                          <p className="text-xs text-muted-foreground">john@example.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Account Settings
                      </button>
                    </div>
                    <div className="p-1.5 border-t border-border">
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
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
