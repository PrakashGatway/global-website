'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { TicketForm } from './ticket-form'
import {toast} from "react-hot-toast"
import axiosInstance from '@/app/axiosInstance'

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketCreated?: () => void
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onTicketCreated,
}: CreateTicketModalProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.post('/support', {
        subject: formData.subject,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        relatedIssue: formData.relatedIssue
      })
      toast.success('Your support ticket has been created.')

      onClose()
      onTicketCreated?.()
    } catch (error) {
      toast.error(error.message || 'Failed to create support ticket.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-50 "
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0.5, scale: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0.5, scale: 0, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
          >
            <div className="relative bg-white rounded-2xl shadow-xl min-h-[80vh] max-h-[90vh] overflow-hidden w-full max-w-3xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex items-center justify-between px-6 py-3 border-b sticky top-0 bg-white"
              >
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Create Support Ticket
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Follow the steps to submit your ticket
                  </p>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="p-6"
              >
                <TicketForm
                  onSubmit={handleSubmit}
                  onClose={onClose}
                  isLoading={isLoading}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
