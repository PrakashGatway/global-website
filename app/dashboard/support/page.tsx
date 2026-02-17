'use client'

import { useState, useEffect } from 'react'
import { EnhancedHeader } from '@/components/dashboard/enhanced-header'
import { CreateTicketModal } from '@/components/dashboard/create-ticket-modal'
import { TicketList } from '@/components/dashboard/ticket-list'
import { TicketDetail } from '@/components/dashboard/ticket-detail'
import { motion } from 'framer-motion'
import axiosInstance from '@/app/axiosInstance'
import toast from 'react-hot-toast'

interface Ticket {
  id: string
  subject: string
  description: string
  status: 'pending' | 'resolved'
  priority: string
  created_at: string
  updated_at: string
}

interface Reply {
  id: string
  user_id: string
  message: string
  is_support: boolean
  created_at: string
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string>()
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [filter])

  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      const res = await axiosInstance.get(`/support?${params}`)
      const data = res.data?.data
      setTickets(data)
      if (data.length > 0 && !selectedTicketId) {
        setSelectedTicketId(data[0])
      }
    } catch (error) {
      toast.error('Failed to fetch tickets.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTicketId) {
      fetchReplies()
    }
  }, [selectedTicketId])

  const fetchReplies = async () => {
    if (!selectedTicketId) return

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicketId}/replies`)
      if (!res.ok) throw new Error('Failed to fetch replies')

      const data = await res.json()
      setReplies(data)
    } catch (error) {
     
    }
  }

  const handleSendReply = async (message: string) => {
    if (!selectedTicketId._id) return

    try {
      const res = await axiosInstance.put(
        `/support/reply/${selectedTicketId._id}`,
        { description: message }
      )

      await fetchReplies()
    } catch (error) {
    
    }
  }

  const handleCreateTicket = () => {
    setIsModalOpen(true)
  }

  const handleTicketCreated = () => {
    fetchTickets()
  }

  return (
    <div className="flex flex-col h-screen sm:p-4">
      <EnhancedHeader
        filter={filter}
        onFilterChange={setFilter}
        onCreateTicket={handleCreateTicket}
      />

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 overflow-hidden"
      >
        <div className="flex flex-1 gap-3 mt-6 mx-auto w-full">
          {/* Ticket List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-96 bg-white rounded-xl overflow-hidden border border-border"
          >
            <TicketList
              tickets={tickets}
              selectedId={selectedTicketId}
              onSelectTicket={setSelectedTicketId}
            />
          </motion.div>

          {/* Ticket Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden border border-border"
          >
            {selectedTicketId ? (
              <TicketDetail
                ticket={selectedTicketId}
                isLoading={isLoading}
                onSendReply={handleSendReply}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4"
              >
                <div className="text-center">
                  <p className="text-lg font-semibold">No ticket selected</p>
                  <p className="text-sm mt-2">
                    Select a ticket from the list to view details
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
