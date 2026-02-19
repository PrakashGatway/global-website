'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Ticket {
  id: string
  subject: string
  description: string
  status: 'pending' | 'resolved'
  priority: string
  created_at: string
  updated_at: string
}

interface TicketListProps {
  tickets: Ticket[]
  selectedId?: string
  onSelectTicket: (id: string) => void
}

export function TicketList({ tickets, selectedId, onSelectTicket }: TicketListProps) {
  const getStatusIcon = (status: string) => {
    if (status === 'resolved') return <CheckCircle className="w-4 h-4 text-green-600" />
    return <AlertCircle className="w-4 h-4 text-orange-600" />
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-3 border-b border-border sticky top-0 bg-white"
      >
        <div className="flex items-center gap-2 font-semibold transition-colors">
          <Mail className="w-5 h-5" />
          <span>Support Tickets</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="ml-auto "
          >
            {tickets.length}
          </motion.span>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 text-center min-h-[60vh]"

          >
            <Image src="https://assets-v2.lottiefiles.com/a/09c40a94-1179-11ee-a418-7394edff93c8/NEgtRnqrdz.gif" alt="No tickets" width={250} height={250} className="m-auto opacity-50" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {tickets.map((ticket, index) => (
              <motion.button
                key={ticket._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgb(var(--secondary))' }}
                onClick={() => onSelectTicket(ticket)}
                className={cn(
                  'w-full px-4 py-2 border-b border-border cursor-pointer transition-all text-left',
                  selectedId._id == ticket._id &&
                  '!bg-gray-300 border-l-4  border-l-primary'
                )}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="mt-1 flex-shrink-0"
                  >
                    {getStatusIcon(ticket.status)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0">
                      <h3 className="font-semibold text-foreground truncate text-sm">
                        {ticket.subject}
                      </h3>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15 + index * 0.05 }}
                      >
                        <Badge
                          variant={
                            ticket.status === 'resolved' ? 'secondary' : 'default'
                          }
                          className="whitespace-nowrap text-xs"
                        >
                          {ticket.status}
                        </Badge>
                      </motion.div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {ticket.description}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
