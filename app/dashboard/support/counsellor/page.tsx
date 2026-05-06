'use client'

import { useState, useEffect, useCallback } from 'react'
import { EnhancedHeader } from '@/components/dashboard/enhanced-header'
import { CreateTicketModal } from '@/components/dashboard/create-ticket-modal'
import { TicketList } from '@/components/dashboard/ticket-list'
import { TicketDetail } from '@/components/dashboard/ticket-detail'
import { motion } from 'framer-motion'
import axiosInstance from '@/app/axiosInstance'
import toast from 'react-hot-toast'
import { useGlobal } from '@/src/statecontext'

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
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all')
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [referralList, setReferralList] = useState<any[]>([])
    const { profile } = useGlobal()

    const fetchTickets = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filter !== 'all') params.append('status', filter)
            params.append('limit', '20')

            // Fetch tickets for all referrals in parallel
            const ticketPromises = referralList.map((ele) =>
                axiosInstance.get(`/support/user/${ele._id}/?${params.toString()}`)
            )

            const responses = await Promise.all(ticketPromises)
            const allTickets = responses.flatMap((res) => res.data?.data ?? [])
            
            setTickets(allTickets)

            // // Update selected ticket if it exists in new data
            // if (selectedTicket?._id) {
            //     const updatedTicket = allTickets.find(
            //         (t: Ticket) => t._id === selectedTicket._id
            //     )
            //     if (updatedTicket) {
            //         setSelectedTicket(updatedTicket)
            //     }
            // }
        } catch (error) {
            toast.error('Failed to fetch tickets.')
        } finally {
            setIsLoading(false)
        }
    }, [filter, referralList, selectedTicket])

    useEffect(() => {
        fetchTickets()
    }, [fetchTickets])

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
    }, [])

    useEffect(() => {
        fetchReferrals(profile?.referalCode || '', profile?._id || '')
    }, [profile?.referalCode, profile?._id, fetchReferrals])

    const handleSendReply = async (message: string) => {
        if (!selectedTicket?._id) return
        try {
            await axiosInstance.put(`/support/reply/${selectedTicket._id}`, {
                description: message,
            })
            await fetchTickets()
        } catch (error) {
            toast.error('Failed to send reply.')
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
            {/* <EnhancedHeader
                filter={filter}
                onFilterChange={setFilter}
                onCreateTicket={handleCreateTicket}
            /> */}

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
                        className="w-96 bg-white rounded-xl overflow-hidden border-2"
                    >
                        <TicketList
                            tickets={tickets}
                            selectedId={selectedTicket}
                            onSelectTicket={setSelectedTicket}
                        />
                    </motion.div>

                    {/* Ticket Detail */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="flex-1 bg-white rounded-xl overflow-hidden border border-2"
                    >
                        {selectedTicket?._id ? (
                            <TicketDetail
                                ticket={selectedTicket}
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