"use client"
import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X, Bell } from "lucide-react"

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message?: string, duration?: number) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Sound effect utility
const playNotificationSound = (type: NotificationType) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Different sounds for different notification types
  switch (type) {
    case 'success':
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
      break
    case 'error':
      oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime) // G4
      oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.15) // F4
      break
    case 'warning':
      oscillator.frequency.setValueAtTime(440.00, audioContext.currentTime) // A4
      oscillator.frequency.setValueAtTime(440.00, audioContext.currentTime + 0.2) // A4
      break
    case 'info':
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      break
  }

  oscillator.type = 'sine'
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration: number = 4000
  ) => {
    const id = Date.now().toString()
    playNotificationSound(type)
    
    setNotifications(prev => [...prev, { id, type, title, message, duration }])

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, duration)
  }, [])

  const success = (title: string, message?: string) => showNotification('success', title, message)
  const error = (title: string, message?: string) => showNotification('error', title, message)
  const warning = (title: string, message?: string) => showNotification('warning', title, message)
  const info = (title: string, message?: string) => showNotification('info', title, message)

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />
      case 'error': return <XCircle className="w-5 h-5" />
      case 'warning': return <AlertCircle className="w-5 h-5" />
      case 'info': return <Info className="w-5 h-5" />
    }
  }

  const getColors = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getIconColors = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'text-green-500'
      case 'error': return 'text-red-500'
      case 'warning': return 'text-amber-500'
      case 'info': return 'text-blue-500'
    }
  }

  return (
    <NotificationContext.Provider value={{ showNotification, success, error, warning, info }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-md">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`
                relative overflow-hidden rounded-xl border shadow-lg p-4
                ${getColors(notification.type)}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`shrink-0 ${getIconColors(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{notification.title}</p>
                  {notification.message && (
                    <p className="text-sm opacity-90 mt-0.5">{notification.message}</p>
                  )}
                  {/* Progress Bar */}
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: notification.duration! / 1000, ease: "linear" }}
                    className={`h-1 mt-3 rounded-full ${
                      notification.type === 'success' ? 'bg-green-300' :
                      notification.type === 'error' ? 'bg-red-300' :
                      notification.type === 'warning' ? 'bg-amber-300' :
                      'bg-blue-300'
                    }`}
                  />
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}