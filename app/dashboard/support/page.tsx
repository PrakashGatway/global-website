"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle, HelpCircle, Phone, Video, Clock, CheckCircle,
  AlertCircle, X, ChevronRight, Plus, Search, Filter,
  Calendar, Mail, User, Tag, FileText, Upload,
  Download, Star, TrendingUp, RefreshCw, Send,Home ,BookOpen
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { format, formatDistanceToNow } from "date-fns"

interface SupportTicket {
  _id: string
  subject: string
  description: string
  category: 'admission' | 'visa' | 'scholarship' | 'accommodation' | 'course' | 'other'
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  attachments?: string[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  counselor?: {
    name: string
    email: string
    phone: string
  }
  comments?: TicketComment[]
}

interface TicketComment {
  _id: string
  message: string
  author: 'user' | 'counselor'
  createdAt: string
  attachment?: string
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'my-tickets' | 'resolved'>('my-tickets')
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showTicketDetails, setShowTicketDetails] = useState<SupportTicket | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form States
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'admission' as 'admission' | 'visa' | 'scholarship' | 'accommodation' | 'course' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high',
    attachments: [] as File[]
  })

  const [commentForm, setCommentForm] = useState({
    ticketId: '',
    message: '',
    attachment: null as File | null
  })

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/support/tickets')
      setTickets(response.data.result || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  // Handle file upload for ticket attachments
  const handleFileUpload = async (files: FileList) => {
    const uploadedUrls: string[] = []
    const formData = new FormData()

    Array.from(files).forEach(file => {
      formData.append('files', file)
    })

    try {
      setUploading(true)
      const response = await axiosInstance.post('/support/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data.result.urls
    } catch (error) {
      console.error('Error uploading files:', error)
      return []
    } finally {
      setUploading(false)
    }
  }

  // Create new ticket
  const handleCreateTicket = async () => {
    if (!ticketForm.subject || !ticketForm.description) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      
      // Upload attachments first if any
      let attachmentUrls: string[] = []
      if (ticketForm.attachments.length > 0) {
        attachmentUrls = await handleFileUpload(ticketForm.attachments as any)
      }

      const response = await axiosInstance.post('/support/tickets', {
        subject: ticketForm.subject,
        description: ticketForm.description,
        category: ticketForm.category,
        priority: ticketForm.priority,
        attachments: attachmentUrls
      })

      setTickets([response.data.result, ...tickets])
      setShowCreateForm(false)
      
      // Reset form
      setTicketForm({
        subject: '',
        description: '',
        category: 'admission',
        priority: 'medium',
        attachments: []
      })

      alert('Ticket created successfully! Our counselor will get back to you soon.')
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Failed to create ticket. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Add comment to ticket
  const handleAddComment = async () => {
    if (!commentForm.message.trim() || !commentForm.ticketId) return

    try {
      setSaving(true)
      
      let attachmentUrl: string | null = null
      if (commentForm.attachment) {
        const urls = await handleFileUpload([commentForm.attachment] as any)
        attachmentUrl = urls[0]
      }

      const response = await axiosInstance.post(`/support/tickets/${commentForm.ticketId}/comment`, {
        message: commentForm.message,
        attachment: attachmentUrl
      })

      // Update ticket in state
      setTickets(tickets.map(ticket => 
        ticket._id === commentForm.ticketId 
          ? response.data.result 
          : ticket
      ))

      if (showTicketDetails?._id === commentForm.ticketId) {
        setShowTicketDetails(response.data.result)
      }

      // Reset comment form
      setCommentForm({
        ticketId: commentForm.ticketId,
        message: '',
        attachment: null
      })

    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSaving(false)
    }
  }

  // Close ticket
  const handleCloseTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to close this ticket?')) return

    try {
      await axiosInstance.patch(`/support/tickets/${ticketId}`, {
        status: 'closed'
      })

      setTickets(tickets.map(ticket => 
        ticket._id === ticketId 
          ? { ...ticket, status: 'closed' } 
          : ticket
      ))

      if (showTicketDetails?._id === ticketId) {
        setShowTicketDetails({ ...showTicketDetails, status: 'closed' as any })
      }

      alert('Ticket closed successfully.')
    } catch (error) {
      console.error('Error closing ticket:', error)
    }
  }

  // Reopen ticket
  const handleReopenTicket = async (ticketId: string) => {
    try {
      await axiosInstance.patch(`/support/tickets/${ticketId}`, {
        status: 'open'
      })

      setTickets(tickets.map(ticket => 
        ticket._id === ticketId 
          ? { ...ticket, status: 'open' } 
          : ticket
      ))

      if (showTicketDetails?._id === ticketId) {
        setShowTicketDetails({ ...showTicketDetails, status: 'open' as any })
      }

      alert('Ticket reopened successfully.')
    } catch (error) {
      console.error('Error reopening ticket:', error)
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return { 
          color: 'bg-blue-100 text-blue-700', 
          icon: <Clock className="w-4 h-4 text-blue-600" />,
          label: 'Open'
        }
      case 'in_progress':
        return { 
          color: 'bg-purple-100 text-purple-700', 
          icon: <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />,
          label: 'In Progress'
        }
      case 'resolved':
        return { 
          color: 'bg-green-100 text-green-700', 
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          label: 'Resolved'
        }
      case 'closed':
        return { 
          color: 'bg-gray-100 text-gray-700', 
          icon: <X className="w-4 h-4 text-gray-600" />,
          label: 'Closed'
        }
      default:
        return { 
          color: 'bg-gray-100 text-gray-700', 
          icon: <Clock className="w-4 h-4 text-gray-600" />,
          label: 'Unknown'
        }
    }
  }

  // Get category icon and label
  const getCategoryInfo = (category: string) => {
    const categories = {
      admission: { icon: <User className="w-4 h-4" />, label: 'Admission' },
      visa: { icon: <FileText className="w-4 h-4" />, label: 'Visa' },
      scholarship: { icon: <Star className="w-4 h-4" />, label: 'Scholarship' },
      accommodation: { icon: <Home className="w-4 h-4" />, label: 'Accommodation' },
      course: { icon: <BookOpen className="w-4 h-4" />, label: 'Course' },
      other: { icon: <HelpCircle className="w-4 h-4" />, label: 'Other' }
    }
    return categories[category as keyof typeof categories] || categories.other
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto sm:p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">Support Center</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Get help with your queries. Our counselors are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActiveTab('create')
                    setShowCreateForm(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Ticket</span>
                </button>

                <button
                  onClick={() => setActiveTab('my-tickets')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'my-tickets'
                      ? 'bg-primary/10 text-primary border border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span>My Tickets</span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {tickets.filter(t => t.status !== 'closed').length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('resolved')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'resolved'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span>Resolved Tickets</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
                  </span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-semibold mb-3">Categories</h4>
                <div className="space-y-2">
                  {[
                    { key: 'admission', label: 'Admission Queries' },
                    { key: 'visa', label: 'Visa Assistance' },
                    { key: 'scholarship', label: 'Scholarship Help' },
                    { key: 'accommodation', label: 'Accommodation' },
                    { key: 'course', label: 'Course Selection' },
                    { key: 'other', label: 'Other Issues' }
                  ].map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setActiveTab('my-tickets')
                        // Filter logic can be added here
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      {getCategoryInfo(cat.key).icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Create Ticket Form */}
              {showCreateForm && (
                <motion.div
                  key="create-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card border border-border rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Create Support Ticket</h2>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Subject *</label>
                      <input
                        type="text"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Category *</label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm(prev => ({ 
                          ...prev, 
                          category: e.target.value as any 
                        }))}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="admission">Admission Query</option>
                        <option value="visa">Visa Assistance</option>
                        <option value="scholarship">Scholarship Help</option>
                        <option value="accommodation">Accommodation</option>
                        <option value="course">Course Selection</option>
                        <option value="other">Other Issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Priority *</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['low', 'medium', 'high'] as const).map(priority => (
                          <label
                            key={priority}
                            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                              ticketForm.priority === priority
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <input
                              type="radio"
                              name="priority"
                              value={priority}
                              checked={ticketForm.priority === priority}
                              onChange={(e) => setTicketForm(prev => ({ 
                                ...prev, 
                                priority: e.target.value as any 
                              }))}
                              className="w-4 h-4"
                            />
                            <span className="capitalize">{priority}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Description *</label>
                      <textarea
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Please provide detailed information about your issue..."
                        rows={6}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Attachments</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              setTicketForm(prev => ({
                                ...prev,
                                attachments: Array.from(e.target.files || [])
                              }))
                            }
                          }}
                          className="hidden"
                          id="ticket-attachments"
                          accept="image/*,application/pdf,application/msword,.doc,.docx"
                        />
                        <label
                          htmlFor="ticket-attachments"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {ticketForm.attachments.length > 0
                              ? `${ticketForm.attachments.length} file(s) selected`
                              : 'Click to upload files (Max 5MB each)'}
                          </span>
                        </label>
                      </div>
                      {ticketForm.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {ticketForm.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                              <span className="text-sm truncate">{file.name}</span>
                              <button
                                onClick={() => {
                                  setTicketForm(prev => ({
                                    ...prev,
                                    attachments: prev.attachments.filter((_, i) => i !== index)
                                  }))
                                }}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateTicket}
                        disabled={saving || !ticketForm.subject || !ticketForm.description}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Create Ticket
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* My Tickets */}
              {activeTab === 'my-tickets' && (
                <motion.div
                  key="my-tickets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">My Support Tickets</h2>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        New Ticket
                      </button>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : tickets.filter(t => t.status !== 'closed').length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No Active Tickets</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You don't have any active support tickets. Create one to get help!
                        </p>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Create Your First Ticket
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tickets
                          .filter(t => t.status !== 'closed')
                          .map(ticket => {
                            const statusInfo = getStatusInfo(ticket.status)
                            const categoryInfo = getCategoryInfo(ticket.category)
                            const priorityColor = getPriorityColor(ticket.priority)

                            return (
                              <div
                                key={ticket._id}
                                onClick={() => setShowTicketDetails(ticket)}
                                className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                      {statusInfo.icon}
                                      <span className="ml-1">{statusInfo.label}</span>
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColor}`}>
                                      {ticket.priority.toUpperCase()}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    {categoryInfo.icon}
                                    <span>{categoryInfo.label}</span>
                                  </div>
                                  <span>•</span>
                                  <span>
                                    Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                  </span>
                                  {ticket.updatedAt !== ticket.createdAt && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                                      </span>
                                    </>
                                  )}
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                  {ticket.description}
                                </p>

                                {ticket.counselor && (
                                  <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg">
                                    <User className="w-4 h-4 text-primary" />
                                    <span>
                                      Assigned to: <strong>{ticket.counselor.name}</strong>
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Resolved Tickets */}
              {activeTab === 'resolved' && (
                <motion.div
                  key="resolved"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Resolved Tickets</h2>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No Resolved Tickets</h3>
                        <p className="text-sm text-muted-foreground">
                          You don't have any resolved tickets yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tickets
                          .filter(t => t.status === 'resolved' || t.status === 'closed')
                          .map(ticket => {
                            const statusInfo = getStatusInfo(ticket.status)
                            const categoryInfo = getCategoryInfo(ticket.category)

                            return (
                              <div
                                key={ticket._id}
                                onClick={() => setShowTicketDetails(ticket)}
                                className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                      {statusInfo.icon}
                                      <span className="ml-1">{statusInfo.label}</span>
                                    </span>
                                    {ticket.resolvedAt && (
                                      <span className="text-xs text-muted-foreground">
                                        Resolved {formatDistanceToNow(new Date(ticket.resolvedAt), { addSuffix: true })}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    {categoryInfo.icon}
                                    <span>{categoryInfo.label}</span>
                                  </div>
                                  <span>•</span>
                                  <span>
                                    Created {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                                  </span>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                  {ticket.description}
                                </p>

                                {ticket.counselor && (
                                  <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg">
                                    <User className="w-4 h-4 text-primary" />
                                    <span>
                                      Handled by: <strong>{ticket.counselor.name}</strong>
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ticket Details Modal */}
            {showTicketDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowTicketDetails(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Ticket Details</h2>
                    <button
                      onClick={() => setShowTicketDetails(null)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Ticket Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">{showTicketDetails.subject}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusInfo(showTicketDetails.status).color}`}>
                            {getStatusInfo(showTicketDetails.status).icon}
                            <span className="ml-1">{getStatusInfo(showTicketDetails.status).label}</span>
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(showTicketDetails.priority)}`}>
                            {showTicketDetails.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getCategoryInfo(showTicketDetails.category).icon}
                          <span>{getCategoryInfo(showTicketDetails.category).label}</span>
                        </div>
                        <span>•</span>
                        <span>
                          Created: {format(new Date(showTicketDetails.createdAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                        {showTicketDetails.resolvedAt && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">
                              Resolved: {format(new Date(showTicketDetails.resolvedAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{showTicketDetails.description}</p>
                    </div>

                    {/* Counselor Info */}
                    {showTicketDetails.counselor && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Assigned Counselor
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{showTicketDetails.counselor.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{showTicketDetails.counselor.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{showTicketDetails.counselor.phone}</span>
                          </div>
                          <div className="flex gap-2 pt-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              <Phone className="w-4 h-4" />
                              Call
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              <Video className="w-4 h-4" />
                              Video Call
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comments/Conversation */}
                    <div>
                      <h4 className="font-semibold mb-4">Conversation</h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {showTicketDetails.comments && showTicketDetails.comments.length > 0 ? (
                          showTicketDetails.comments.map(comment => (
                            <div
                              key={comment._id}
                              className={`flex gap-3 ${comment.author === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                comment.author === 'user' ? 'bg-primary' : 'bg-muted'
                              }`}>
                                <User className={`w-4 h-4 ${
                                  comment.author === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                                }`} />
                              </div>
                              <div className={`flex-1 ${
                                comment.author === 'user' ? 'text-right' : ''
                              }`}>
                                <div className={`inline-block p-3 rounded-lg ${
                                  comment.author === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card border border-border'
                                }`}>
                                  <p className="whitespace-pre-wrap">{comment.message}</p>
                                  {comment.attachment && (
                                    <a
                                      href={comment.attachment}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 mt-2 text-xs underline"
                                    >
                                      <FileText className="w-3 h-3" />
                                      View Attachment
                                    </a>
                                  )}
                                </div>
                                <p className={`text-xs mt-1 ${
                                  comment.author === 'user' ? 'text-right' : 'text-muted-foreground'
                                }`}>
                                  {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">No comments yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Add Comment */}
                    {showTicketDetails.status !== 'closed' && (
                      <div className="border-t border-border pt-4">
                        <h4 className="font-semibold mb-3">Add Comment</h4>
                        <div className="space-y-3">
                          <textarea
                            value={commentForm.message}
                            onChange={(e) => setCommentForm(prev => ({ 
                              ...prev, 
                              ticketId: showTicketDetails._id,
                              message: e.target.value 
                            }))}
                            placeholder="Type your message here..."
                            rows={3}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          
                          {commentForm.attachment ? (
                            <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                              <span className="text-sm">{commentForm.attachment.name}</span>
                              <button
                                onClick={() => setCommentForm(prev => ({ ...prev, attachment: null }))}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary">
                              <Upload className="w-4 h-4" />
                              <span>Attach file</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setCommentForm(prev => ({ ...prev, attachment: e.target.files![0] }))
                                  }
                                }}
                                accept="image/*,application/pdf"
                              />
                            </label>
                          )}

                          <div className="flex justify-end gap-3">
                            {showTicketDetails.status === 'open' && (
                              <button
                                onClick={() => handleCloseTicket(showTicketDetails._id)}
                                className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                              >
                                Close Ticket
                              </button>
                            )}
                            <button
                              onClick={handleAddComment}
                              disabled={saving || !commentForm.message.trim()}
                              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                              {saving ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Send Message
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reopen Ticket */}
                    {showTicketDetails.status === 'closed' && (
                      <div className="border-t border-border pt-4">
                        <button
                          onClick={() => handleReopenTicket(showTicketDetails._id)}
                          className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          Reopen Ticket
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}