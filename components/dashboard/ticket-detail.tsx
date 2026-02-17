'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useGlobal } from '@/src/statecontext'
import { Input } from '../ui/input'

interface Reply {
  id: string
  user_id: string
  message: string
  is_support: boolean
  created_at: string
}

interface Ticket {
  id: string
  subject: string
  description: string
  status: 'pending' | 'resolved'
  priority: string
  created_at: string
  updated_at: string
}

interface TicketDetailProps {
  ticket: Ticket
  replies: Reply[]
  onSendReply: (message: string) => Promise<void>
  onUpdateStatus: (status: 'pending' | 'resolved') => Promise<void>
  isLoading?: boolean
}

export function TicketDetail({
  ticket,
  onSendReply
}: TicketDetailProps) {
  const [replyMessage, setReplyMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const { profile } = useGlobal()

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return
    setIsSending(true)
    try {
      await onSendReply(replyMessage)
      setReplyMessage('')
    } finally {
      setIsSending(false)
    }
  }

    const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.reply])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border px-6 py-4 sticky top-0 bg-white"
      >
        <div className="flex items-start justify-between mb-2">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl capitalize font-bold text-foreground max-w-2xl"
          >
            {ticket.subject}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <motion.div whileHover={{ scale: 1.1 }}>
              {ticket.status === 'resolved' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-600" />
              )}
            </motion.div>
            <Badge
              variant={ticket.status === 'resolved' ? 'secondary' : 'default'}
              className="text-sm px-3 py-1"
            >
              {ticket.status}
            </Badge>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 mb-2"
        >
          {ticket.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between text-xs text-muted-foreground"
        >
          <span>Created {formatDate(ticket.createdAt)}</span>
          {/* <motion.div className="flex gap-2">
            {ticket.status === 'open' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus('resolved')}
                  disabled={isLoading}
                >
                  Mark as Resolved
                </Button>
              </motion.div>
            )}
            {ticket.status === 'resolved' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus('open')}
                  disabled={isLoading}
                >
                  Reopen Ticket
                </Button>
              </motion.div>
            )}
          </motion.div> */}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 overflow-y-auto scrollbar-hide  px-6 py-6 space-y-4 bg-gray-100"
      >
        {ticket?.reply?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-muted-foreground text-sm py-8"
          >
            <p>No replies yet</p>
            <p className="text-xs mt-1">
              {ticket.status === 'resolved'
                ? 'This ticket is resolved'
                : 'Be the first to reply'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-2"
          >
            {ticket?.reply?.map((reply, index) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, x: reply.user != profile._id ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-2 rounded-[15px_15px_0px_15px] w-fit shadow-xl hover:shadow-2xl border transition-all max-w-xl w-auto  ${reply.user != profile._id
                  ? 'bg-primary border-primary'
                  : 'border-primary/40 border-2 bg-gray-100'
                  } ${reply.user != profile._id ? '' : 'ml-auto'}`}
              >
                <div className="flex items-center justify-between px-2">
                  {/* <span className="text-sm font-semibold text-foreground">
                    {reply.user != profile._id ? 'Support Team' : 'You'}
                  </span> */}
                  <p className="text-[15px] text-foreground font-medium">{reply.description}</p>
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef} />

          </motion.div>
        )}
      </motion.div>

      {ticket.status == 'pending' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className=""
        >
          <div className="flex p-1 gap-2">
            <Input
              placeholder="Type your reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="resize-none shadow-none py-2.5 text-base border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"

            />
            <motion.div
              className="flex justify-end gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={handleSendReply}
                  className='py-2.5'
                  disabled={isSending || !replyMessage.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
