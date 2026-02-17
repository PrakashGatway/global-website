'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EnhancedHeaderProps {
  filter: 'all' | 'pending' | 'resolved'
  onFilterChange: (filter: 'all' | 'pending' | 'resolved') => void
  onCreateTicket: () => void
}

export function EnhancedHeader({
  filter,
  onFilterChange,
  onCreateTicket,
}: EnhancedHeaderProps) {
  const tabs = [
    { id: 'all', label: 'All Tickets', count: 12 },
    { id: 'pending', label: 'Pending', count: 7 },
    { id: 'resolved', label: 'Resolved', count: 5 },
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Support Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-xs text-muted-foreground mt-1"
          >
            Manage your support tickets and get help
          </motion.p>
        </div>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateTicket}
        >
          <Button
            size="lg"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Create Ticket</span>
          </Button>
        </motion.button>
      </div>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 bg-white border-b border-border/40 backdrop-blur-sm supports-[backdrop-filter]:bg-white/95"
      >

        {/* Filter Tabs */}
        <div className="mt-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex gap-1"
          >
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                onClick={() =>
                  onFilterChange(tab.id as 'all' | 'pending' | 'resolved')
                }
                className="relative px-4 py-2 text-sm font-medium transition-colors"
              >
                <span
                  className={`transition-colors ${filter === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {tab.label}
                </span>

                {/* Animated underline */}
                {filter === tab.id && (
                  <motion.div
                    layoutId="underline"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.header>
    </>
  )
}
