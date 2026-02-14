"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import {
  Bell, AlertCircle, MessageSquare, FileText, CheckCircle, X, 
  Eye, EyeOff, Search as SearchIcon, Filter, Clock, Calendar,
  Trash2, Archive, Star, Tag, GraduationCap, Users, TrendingUp,
  Loader2, ChevronLeft, ChevronRight
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

// Notification interface
interface Notification {
  id: string
  type: 'missing_requirement' | 'note' | 'application_status'
  title: string
  message: string
  timestamp: string
  read: boolean
  applicationName?: string
  priority: 'high' | 'medium' | 'low'
  actionUrl?: string
}

// Dummy notifications data
const dummyNotifications: Notification[] = [
  {
    id: 'req_001',
    type: 'missing_requirement',
    title: 'Missing Document: Passport Copy',
    message: 'Your application for Harvard University is missing a valid passport copy. Please upload it within 7 days.',
    timestamp: '2026-02-14T10:30:00Z',
    read: false,
    applicationName: 'Harvard University - MBA',
    priority: 'high',
    actionUrl: '/dashboard/applications/app_001/documents'
  },
  {
    id: 'note_001',
    type: 'note',
    title: 'Counselor Note: Application Strategy',
    message: 'I\'ve reviewed your profile and recommend applying to 3 additional universities to increase your chances.',
    timestamp: '2026-02-14T08:45:00Z',
    read: false,
    applicationName: 'Harvard University - MBA',
    priority: 'medium',
    actionUrl: '/dashboard/applications/app_001/notes'
  },
  {
    id: 'status_001',
    type: 'application_status',
    title: 'Application Submitted Successfully!',
    message: 'Your application for Harvard University has been successfully submitted. You will receive a confirmation email shortly.',
    timestamp: '2026-02-14T15:10:00Z',
    read: false,
    applicationName: 'Harvard University - MBA',
    priority: 'low',
    actionUrl: '/dashboard/applications/app_001'
  },
  {
    id: 'req_002',
    type: 'missing_requirement',
    title: 'IELTS Score Required',
    message: 'Stanford University requires a minimum IELTS score of 7.0. Please upload your test results to proceed.',
    timestamp: '2026-02-13T14:20:00Z',
    read: true,
    applicationName: 'Stanford University - CS',
    priority: 'high',
    actionUrl: '/dashboard/applications/app_002/documents'
  },
  {
    id: 'note_002',
    type: 'note',
    title: 'Important: Visa Interview Preparation',
    message: 'Your visa interview is scheduled for March 15th. Please prepare the following documents and review common questions.',
    timestamp: '2026-02-13T11:30:00Z',
    read: false,
    applicationName: 'Stanford University - CS',
    priority: 'high',
    actionUrl: '/dashboard/applications/app_002/notes'
  },
  {
    id: 'status_002',
    type: 'application_status',
    title: 'Application Under Review',
    message: 'Stanford University has started reviewing your application. The review process typically takes 4-6 weeks.',
    timestamp: '2026-02-13T09:45:00Z',
    read: true,
    applicationName: 'Stanford University - CS',
    priority: 'medium',
    actionUrl: '/dashboard/applications/app_002'
  },
  {
    id: 'req_003',
    type: 'missing_requirement',
    title: 'Statement of Purpose Needed',
    message: 'Your application for MIT is missing the Statement of Purpose document. This is a critical requirement.',
    timestamp: '2026-02-12T09:15:00Z',
    read: false,
    applicationName: 'MIT - Engineering',
    priority: 'medium',
    actionUrl: '/dashboard/applications/app_003/documents'
  },
  {
    id: 'status_003',
    type: 'application_status',
    title: 'Interview Invitation',
    message: 'Congratulations! You\'ve been invited for an interview with MIT admissions committee. Please schedule your slot.',
    timestamp: '2026-02-12T14:30:00Z',
    read: false,
    applicationName: 'MIT - Engineering',
    priority: 'high',
    actionUrl: '/dashboard/applications/app_003/interview'
  }
]

// Notification type configuration
const notificationTypes = {
  missing_requirement: {
    label: 'Missing Requirements',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'bg-red-50 border-red-200 text-red-700',
    badge: 'bg-red-100 text-red-600',
    gradient: 'from-red-400 to-red-600'
  },
  note: {
    label: 'Notes',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    badge: 'bg-blue-100 text-blue-600',
    gradient: 'from-blue-400 to-blue-600'
  },
  application_status: {
    label: 'Application Status',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-green-50 border-green-200 text-green-700',
    badge: 'bg-green-100 text-green-600',
    gradient: 'from-green-400 to-green-600'
  }
}

// Priority configuration
const priorityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-700' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  low: { label: 'Low', color: 'bg-green-100 text-green-700' }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const filterButtonRef = useRef(null)
  const [markingAllRead, setMarkingAllRead] = useState(false)

  // Filters state
  const [filters, setFilters] = useState({
    type: "",
    priority: "",
    showUnreadOnly: false
  })

  // Handle click outside filter drawer
  useEffect(() => {
    function handleClickOutside(event) {
      const isClickInsideSelect = event.target.closest('[data-radix-select-content]') || 
                                  event.target.closest('[data-headlessui-state="open"]') ||
                                  event.target.closest('[role="listbox"]') ||
                                  event.target.closest('.select-dropdown')
      
      if (filterButtonRef.current && 
          !filterButtonRef.current.contains(event.target) && 
          !isClickInsideSelect) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Initialize notifications
  useEffect(() => {
    setTimeout(() => {
      setNotifications(dummyNotifications)
      setLoading(false)
    }, 600)
  }, [])

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Type filter
    if (filters.type && notification.type !== filters.type) return false
    
    // Priority filter
    if (filters.priority && notification.priority !== filters.priority) return false
    
    // Unread filter
    if (filters.showUnreadOnly && notification.read) return false
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.applicationName?.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  // Get counts for tabs
  const getUnreadCount = (type: string) => {
    return notifications.filter(n => 
      (type === 'all' || n.type === type) && !n.read
    ).length
  }

  // Toggle read status
  const toggleReadStatus = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    )
  }

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Mark all as read
  const markAllAsRead = () => {
    setMarkingAllRead(true)
    setTimeout(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setMarkingAllRead(false)
    }, 500)
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([])
    }
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.type) count++
    if (filters.priority) count++
    if (filters.showUnreadOnly) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: "",
      priority: "",
      showUnreadOnly: false
    })
    setSearchQuery("")
  }

  // Notification Card with Swipe Actions
  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const x = useMotionValue(0)
    const opacity = useTransform(x, [-100, 0], [1, 0])
    const rotate = useTransform(x, [-100, 0], [0, 0])
    
    const typeConfig = notificationTypes[notification.type]
    const priorityConfigItem = priorityConfig[notification.priority]

    // Handle swipe actions
    const handleDragEnd = (_: any, info: any) => {
      if (info.offset.x < -100) {
        // Swipe left to delete
        deleteNotification(notification.id)
      } else if (info.offset.x > 100) {
        // Swipe right to mark as read
        toggleReadStatus(notification.id)
      }
    }

    return (
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`group relative bg-white rounded-2xl border ${
          notification.read 
            ? 'border-border' 
            : `border-2 ${typeConfig.color.replace('text', 'border')}`
        } overflow-hidden transition-all duration-300 hover:shadow-md`}
      >
        {/* Left Swipe Action (Delete) */}
        <motion.div 
          className="absolute left-0 top-0 bottom-0 w-24 bg-red-500 flex items-center justify-center"
          style={{ opacity: useTransform(x, [-120, -60], [1, 0]) }}
        >
          <Trash2 className="w-6 h-6 text-white" />
        </motion.div>
        
        {/* Right Swipe Action (Mark Read) */}
        <motion.div 
          className="absolute right-0 top-0 bottom-0 w-24 bg-green-500 flex items-center justify-center"
          style={{ opacity: useTransform(x, [60, 120], [0, 1]) }}
        >
          <CheckCircle className="w-6 h-6 text-white" />
        </motion.div>

        <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* LEFT SECTION */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Type Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.badge}`}>
              {typeConfig.icon}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  {notification.title}
                </h3>
                {!notification.read && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityConfigItem.color}`}>
                    {priorityConfigItem.label}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notification.message}
              </p>
              
              {notification.applicationName && (
                <div className="mt-2 flex items-center gap-2 text-sm text-primary font-medium">
                  <GraduationCap className="w-4 h-4" />
                  <span className="truncate">{notification.applicationName}</span>
                </div>
              )}
              
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(notification.timestamp), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center justify-between md:justify-end gap-3 md:min-w-[200px]">
            {/* Action Button */}
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm whitespace-nowrap"
              >
                {notification.type === 'missing_requirement' ? 'Upload' : 'View'}
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleReadStatus(notification.id)
                }}
                className={`p-2 rounded-lg transition-colors ${
                  notification.read 
                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted' 
                    : 'text-primary bg-primary/10 hover:bg-primary/20'
                }`}
                title={notification.read ? 'Mark as unread' : 'Mark as read'}
              >
                {notification.read ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteNotification(notification.id)
                }}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Action Button */}
        {notification.actionUrl && (
          <div className="md:hidden p-4 pt-0 border-t border-border">
            <a
              href={notification.actionUrl}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              {notification.type === 'missing_requirement' ? 'Upload Document' : 
               notification.type === 'note' ? 'View Details' : 'View Application'}
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="space-y-4 sm:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Notifications
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Stay updated with your application progress
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              disabled={markingAllRead || notifications.every(n => n.read)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {markingAllRead ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Mark All Read
            </button>
            
            <button
              onClick={clearAllNotifications}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Clear all notifications"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex gap-4 flex-wrap">
          <motion.div className="relative flex-1 min-w-[250px]">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notifications by title, message, or application..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          <div className="relative" ref={filterButtonRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Drawer */}
            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed inset-0 z-40"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                    style={{ transformOrigin: 'top right' }}
                  >
                    <div className="flex items-center justify-between p-4 py-3 border-b border-border">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                      </h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-sm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Type Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          Notification Type
                        </label>
                        <select
                          value={filters.type}
                          onChange={(e) => handleFilterChange('type', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">All Types</option>
                          <option value="missing_requirement">Missing Requirements</option>
                          <option value="note">Notes</option>
                          <option value="application_status">Application Status</option>
                        </select>
                      </div>

                      {/* Priority Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Priority
                        </label>
                        <select
                          value={filters.priority}
                          onChange={(e) => handleFilterChange('priority', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">All Priorities</option>
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                        </select>
                      </div>

                      {/* Unread Only */}
                      <div className="space-y-2 pt-2 border-t border-border">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.showUnreadOnly}
                            onChange={(e) => handleFilterChange('showUnreadOnly', e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium">Show unread only</span>
                        </label>
                      </div>

                      {/* Active Filters Display */}
                      {activeFilterCount > 0 && (
                        <div className="pt-2 border-t border-border">
                          <div className="flex flex-wrap gap-1.5">
                            {filters.type && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.type.replace('_', ' ')}
                                <button onClick={() => handleFilterChange('type', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.priority && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.priority} priority
                                <button onClick={() => handleFilterChange('priority', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.showUnreadOnly && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                Unread only
                                <button onClick={() => handleFilterChange('showUnreadOnly', false)} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 p-4 py-3 border-t border-border bg-muted/20">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notifications List */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12  bg-card border border-border rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bell className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No notifications found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery || activeFilterCount > 0
                  ? "Try adjusting your search or filters"
                  : "You don't have any notifications right now. Check back later for updates on your applications!"
                }
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {filteredNotifications.map((notification, index) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </>
          )}
        </motion.div>
      </div>
    </main>
  )
}