'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, AlertCircle, CheckCircle, Send, Plus, Filter } from 'lucide-react'
import Image from 'next/image'
import axiosInstance from '@/app/axiosInstance'
import toast from 'react-hot-toast'
import { useGlobal } from '@/src/statecontext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Select from "react-select";

interface Ticket {
  _id: string
  id: string
  subject: string
  description: string
  status: 'pending' | 'resolved'
  priority: string
  created_at: string
  updated_at: string
  createdAt: string
  reply?: Reply[]
}

interface Reply {
  id: string
  user_id: string
  message: string
  description?: string
  is_support: boolean
  created_at: string
  user?: string
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [referralList, setReferralList] = useState<any[]>([])
  const [replyMessage, setReplyMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  const { profile } = useGlobal()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Create ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium',
  })

  // Fetch tickets for all referrals
  const fetchTickets = useCallback(async () => {
    if (!referralList.length) return
    
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      params.append('limit', '20')

      const ticketPromises = referralList.map((ele) =>
        axiosInstance.get(`/support/user/${ele._id}/?${params.toString()}`)
      )

      const responses = await Promise.all(ticketPromises)
      const allTickets = responses.flatMap((res) => res.data?.data ?? [])
      
      setTickets(allTickets)
      return allTickets
    } catch (error) {
      toast.error('Failed to fetch tickets.')
    } finally {
      setIsLoading(false)
    }
  }, [filter, referralList])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets,isSending])

  // Fetch users for assignment
  const fetchReferrals = useCallback(async (code: string, id: string) => {
    if (!code) {
      setReferralList([])
      return
    }
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/users/code/${code}/${id}`)
      const data: any = response.data.data ?? []
      setReferralList(Array.isArray(data) ? data : [data])
    } catch (err) {
      console.error('Error fetching referrals:', err)
      setReferralList([])
    } finally {
      setIsLoading(false)
    }
  }, [isSending])

  useEffect(() => {
    fetchReferrals(profile?.referalCode || '', profile?._id || '')
  }, [profile?.referalCode, profile?._id, fetchReferrals])

  // Handle send reply
  const handleSendReply = async (message: string) => {
    if (!selectedTicket?._id) return
    
    setIsSending(true)
    try {
      await axiosInstance.put(`/support/reply/${selectedTicket._id}`, {
        description: message,
      })
      setReplyMessage('')
      const fetchedTickets = await fetchTickets()
      // Update selected ticket with new reply
      const updatedTicket = (fetchedTickets || tickets).find(t => t._id === selectedTicket._id)
      if (updatedTicket) setSelectedTicket(updatedTicket)
      toast.success('Reply sent successfully')
    } catch (error) {
      toast.error('Failed to send reply.')
    } finally {
      setIsSending(false)
    }
  }

  // Handle update ticket status
  const handleUpdateStatus = async (newStatus: 'pending' | 'resolved') => {
    if (!selectedTicket) return

    setUpdatingStatus(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await axiosInstance.put(`/support/${selectedTicket._id}`, { 
        status: newStatus 
      })

      if (response.data?.success || response.status === 200) {
        setSuccessMessage(`Ticket status updated to ${newStatus}`)
        toast.success(`Ticket status updated to ${newStatus}`)
        
        // Update local state
        const updatedTicket = { ...selectedTicket, status: newStatus }
        setSelectedTicket(updatedTicket)
        
        // Refresh tickets list
        await fetchTickets()
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update status'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Handle create ticket
  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      // Create ticket for each referral
      const ticketPromises = referralList.map((ele) =>
        axiosInstance.post(`/support/${ele._id}`, {
          subject: newTicket.subject,
          description: newTicket.description,
          priority: newTicket.priority,
        })
      )

      await Promise.all(ticketPromises)
      toast.success('Ticket(s) created successfully')
      setIsModalOpen(false)
      setNewTicket({ subject: '', description: '', priority: 'medium' })
      await fetchTickets()
    } catch (error) {
      toast.error('Failed to create ticket.')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-scroll to bottom when replies change
  useEffect(() => {
    if (selectedTicket?.reply && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedTicket?.reply])

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFullDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusIcon = (status: string) => {
    if (status === 'resolved') return <CheckCircle className="w-4 h-4 text-green-600" />
    return <AlertCircle className="w-4 h-4 text-orange-600" />
  }

  // Filter tickets based on selected filter
  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filter)

  return (
    <div className="flex flex-col h-screen sm:p-4">
      {/* Create Ticket Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter ticket subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTicket.priority}
                onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
              >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
               
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your issue in detail..."
                rows={5}
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
            className="w-96 bg-white rounded-xl overflow-hidden border-2 flex flex-col"
          >
            {/* Header with Filter and Create Button */}
            <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold">
                  <Mail className="w-5 h-5" />
                  <span>Support Tickets</span>
                  <span className="ml-2 text-sm text-gray-500">{filteredTickets.length}</span>
                </div>

              </div>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className="flex-1"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilter('pending')}
                  className="flex-1"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'resolved' ? 'default' : 'outline'}
                  onClick={() => setFilter('resolved')}
                  className="flex-1"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolved
                </Button>
              </div>
            </div>

            {/* Ticket List Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && tickets.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading tickets...</p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 text-center min-h-[60vh]"
                >
                  <Image 
                    src="https://assets-v2.lottiefiles.com/a/09c40a94-1179-11ee-a418-7394edff93c8/NEgtRnqrdz.gif" 
                    alt="No tickets" 
                    loading="lazy"
                    width={250} 
                    height={250} 
                    className="m-auto opacity-50" 
                  />
                  <p className="mt-4 text-gray-500">No tickets found</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {filteredTickets.map((ticket, index) => (
                    <motion.button
                      key={ticket._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`
                        w-full px-4 py-3 border-b border-gray-200 cursor-pointer transition-all text-left
                        ${selectedTicket?._id === ticket._id ? 'bg-gray-100 border-l-4 border-l-blue-500' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {getStatusIcon(ticket.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate text-sm">
                              {ticket.subject}
                            </h3>
                            <Badge
                              variant={ticket.status === 'resolved' ? 'secondary' : 'default'}
                              className="whitespace-nowrap text-xs"
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 truncate mb-1">
                            {ticket.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(ticket.createdAt || ticket.created_at)}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Ticket Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex-1 bg-white rounded-xl overflow-hidden border-2"
          >
            {selectedTicket ? (
              <div className="flex flex-col h-full">
                {/* Ticket Detail Header */}
                <div className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-gray-900 max-w-2xl break-words">
                      {selectedTicket.subject}
                    </h2>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {getStatusIcon(selectedTicket.status)}
                      <Badge
                        variant={selectedTicket.status === 'resolved' ? 'secondary' : 'default'}
                        className="text-sm px-3 py-1"
                      >
                        {selectedTicket.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 break-words">
                    {selectedTicket.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 flex-wrap gap-2">
                    <span>Created {formatFullDate(selectedTicket.createdAt || selectedTicket.created_at)}</span>
                    <div className="flex gap-2">
                      {selectedTicket.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus('resolved')}
                          disabled={updatingStatus}
                        >
                          {updatingStatus ? 'Updating...' : 'Mark as Resolved'}
                        </Button>
                      )}
                      {selectedTicket.status === 'resolved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus('pending')}
                          disabled={updatingStatus}
                        >
                          {updatingStatus ? 'Updating...' : 'Reopen Ticket'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Success/Error Messages */}
                  {successMessage && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}
                </div>

                {/* Replies Section */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3 bg-gray-50">
                  {!selectedTicket.reply || selectedTicket.reply.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm py-8">
                      <p>No replies yet</p>
                      <p className="text-xs mt-1">
                        {selectedTicket.status === 'resolved'
                          ? 'This ticket is resolved'
                          : 'Be the first to reply'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTicket.reply.map((reply, index) => (
                        <motion.div
                          key={reply.id || index}
                          initial={{ opacity: 0, x: reply.user !== profile?._id ? 20 : -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`
                            p-3 rounded-2xl shadow-md hover:shadow-lg transition-all max-w-xl w-auto
                            ${reply.user !== profile?._id 
                              ? 'bg-white border border-gray-200 rounded-bl-none' 
                              : 'bg-blue-500 text-white rounded-br-none ml-auto'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-1 px-1">
                            <span className={`text-xs font-semibold ${reply.user !== profile?._id ? 'text-gray-600' : 'text-blue-100'}`}>
                              {reply.user !== profile?._id ? 'Support Team' : 'You'}
                            </span>
                            <span className={`text-xs ${reply.user !== profile?._id ? 'text-gray-400' : 'text-blue-200'}`}>
                              {formatDate(reply.created_at)}
                            </span>
                          </div>
                          <p className={`text-sm px-1 ${reply.user !== profile?._id ? 'text-gray-800' : 'text-white'}`}>
                            {reply.description || reply.message}
                          </p>
                        </motion.div>
                      ))}
                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>

                {/* Reply Input */}
                {selectedTicket.status === 'pending' && (
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your reply here..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            if (replyMessage.trim()) handleSendReply(replyMessage)
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleSendReply(replyMessage)}
                        disabled={isSending || !replyMessage.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSending ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                <Mail className="w-16 h-16 opacity-30" />
                <div className="text-center">
                  <p className="text-lg font-semibold">No ticket selected</p>
                  <p className="text-sm mt-2">
                    Select a ticket from the list to view details
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}


