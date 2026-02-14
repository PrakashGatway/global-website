"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CreditCard, Calendar, CheckCircle, XCircle, Clock, Download,
  FileText, TrendingUp, AlertCircle, Search as SearchIcon, Filter,
  ChevronDown, Eye, Copy, Share2, Printer, RefreshCw, DollarSign,
  BarChart2, PieChart, Users, Shield, Tag, Receipt, Activity,
  ExternalLink, X, Loader2, Globe, Building, Star,
  BookOpen,
  GraduationCap,
  Home
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { ModernSelect } from "@/components/ui/select"
import { format, formatDistanceToNow } from "date-fns"

// Dummy transaction data
const dummyTransactions = [
  {
    _id: 'txn_001',
    transactionId: 'TXN-2026-02-14-001',
    amount: 5000.00,
    currency: 'USD',
    description: 'University Application Fee - Harvard University',
    status: 'success' as 'success',
    paymentMethod: 'credit_card' as 'credit_card',
    cardLast4: '4567',
    date: '2026-02-14T10:30:00Z',
    receiptUrl: '#',
    category: 'application_fee'
  },
  {
    _id: 'txn_002',
    transactionId: 'TXN-2026-02-13-002',
    amount: 150.00,
    currency: 'USD',
    description: 'IELTS Test Registration Fee',
    status: 'success',
    paymentMethod: 'debit_card',
    cardLast4: '8901',
    date: '2026-02-13T14:20:00Z',
    receiptUrl: '#',
    category: 'exam_fee'
  },
  {
    _id: 'txn_003',
    transactionId: 'TXN-2026-02-12-003',
    amount: 2500.00,
    currency: 'USD',
    description: 'Visa Processing Fee - USA Student Visa',
    status: 'success',
    paymentMethod: 'paypal',
    cardLast4: undefined,
    date: '2026-02-12T09:15:00Z',
    receiptUrl: '#',
    category: 'visa_fee'
  },
  {
    _id: 'txn_004',
    transactionId: 'TXN-2026-02-10-004',
    amount: 1200.00,
    currency: 'USD',
    description: 'Consultancy Service Fee - Premium Package',
    status: 'success',
    paymentMethod: 'bank_transfer',
    cardLast4: undefined,
    date: '2026-02-10T16:45:00Z',
    receiptUrl: '#',
    category: 'service_fee'
  },
  {
    _id: 'txn_005',
    transactionId: 'TXN-2026-02-08-005',
    amount: 350.00,
    currency: 'USD',
    description: 'Document Verification & Attestation',
    status: 'success',
    paymentMethod: 'credit_card',
    cardLast4: '2345',
    date: '2026-02-08T11:20:00Z',
    receiptUrl: '#',
    category: 'document_fee'
  },
  {
    _id: 'txn_006',
    transactionId: 'TXN-2026-02-05-006',
    amount: 8000.00,
    currency: 'USD',
    description: 'Tuition Deposit - Stanford University',
    status: 'pending' as 'pending',
    paymentMethod: 'credit_card',
    cardLast4: '6789',
    date: '2026-02-05T13:10:00Z',
    receiptUrl: '#',
    category: 'tuition_fee'
  },
  {
    _id: 'txn_007',
    transactionId: 'TXN-2026-02-03-007',
    amount: 200.00,
    currency: 'USD',
    description: 'TOEFL Test Registration',
    status: 'failed' as 'failed',
    paymentMethod: 'debit_card',
    cardLast4: '1122',
    date: '2026-02-03T10:05:00Z',
    receiptUrl: '#',
    category: 'exam_fee'
  },
  {
    _id: 'txn_008',
    transactionId: 'TXN-2026-02-01-008',
    amount: 1800.00,
    currency: 'USD',
    description: 'Accommodation Booking Fee - University Dormitory',
    status: 'success',
    paymentMethod: 'upi',
    cardLast4: undefined,
    date: '2026-02-01T15:30:00Z',
    receiptUrl: '#',
    category: 'accommodation'
  },
  {
    _id: 'txn_009',
    transactionId: 'TXN-2026-01-28-009',
    amount: 4500.00,
    currency: 'USD',
    description: 'University Application Fee - MIT',
    status: 'success',
    paymentMethod: 'credit_card',
    cardLast4: '3456',
    date: '2026-01-28T09:45:00Z',
    receiptUrl: '#',
    category: 'application_fee'
  },
  {
    _id: 'txn_010',
    transactionId: 'TXN-2026-01-25-010',
    amount: 950.00,
    currency: 'USD',
    description: 'GRE Test Registration Fee',
    status: 'refunded' as 'refunded',
    paymentMethod: 'paypal',
    cardLast4: undefined,
    date: '2026-01-25T14:15:00Z',
    receiptUrl: '#',
    category: 'exam_fee'
  },
  {
    _id: 'txn_011',
    transactionId: 'TXN-2026-01-20-011',
    amount: 3200.00,
    currency: 'USD',
    description: 'University Application Fee - Oxford University',
    status: 'success',
    paymentMethod: 'bank_transfer',
    cardLast4: undefined,
    date: '2026-01-20T11:30:00Z',
    receiptUrl: '#',
    category: 'application_fee'
  },
  {
    _id: 'txn_012',
    transactionId: 'TXN-2026-01-15-012',
    amount: 450.00,
    currency: 'USD',
    description: 'Passport Processing Fee',
    status: 'success',
    paymentMethod: 'credit_card',
    cardLast4: '5678',
    date: '2026-01-15T09:20:00Z',
    receiptUrl: '#',
    category: 'visa_fee'
  }
]

// Status configuration
const statusConfig = {
  success: { 
    color: 'bg-green-100 text-green-700 border-green-200', 
    icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    label: 'Success',
    badge: 'bg-green-500/10 text-green-600'
  },
  failed: { 
    color: 'bg-red-100 text-red-700 border-red-200', 
    icon: <XCircle className="w-4 h-4 text-red-600" />,
    label: 'Failed',
    badge: 'bg-red-500/10 text-red-600'
  },
  pending: { 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
    icon: <Clock className="w-4 h-4 text-yellow-600" />,
    label: 'Pending',
    badge: 'bg-yellow-500/10 text-yellow-600'
  },
  refunded: { 
    color: 'bg-blue-100 text-blue-700 border-blue-200', 
    icon: <RefreshCw className="w-4 h-4 text-blue-600" />,
    label: 'Refunded',
    badge: 'bg-blue-500/10 text-blue-600'
  }
}

// Payment method icons and colors
const paymentMethods = {
  credit_card: { 
    icon: <CreditCard className="w-5 h-5" />, 
    color: 'text-blue-600 bg-blue-50',
    label: 'Credit Card'
  },
  debit_card: { 
    icon: <CreditCard className="w-5 h-5" />, 
    color: 'text-green-600 bg-green-50',
    label: 'Debit Card'
  },
  paypal: { 
    icon: <FileText className="w-5 h-5" />, 
    color: 'text-violet-600 bg-violet-50',
    label: 'PayPal'
  },
  bank_transfer: { 
    icon: <TrendingUp className="w-5 h-5" />, 
    color: 'text-emerald-600 bg-emerald-50',
    label: 'Bank Transfer'
  },
  upi: { 
    icon: <FileText className="w-5 h-5" />, 
    color: 'text-indigo-600 bg-indigo-50',
    label: 'UPI'
  }
}

// Category icons
const categoryIcons = {
  application_fee: <FileText className="w-5 h-5 text-indigo-600" />,
  exam_fee: <BookOpen className="w-5 h-5 text-purple-600" />,
  visa_fee: <CreditCard className="w-5 h-5 text-blue-600" />,
  service_fee: <Users className="w-5 h-5 text-green-600" />,
  document_fee: <FileText className="w-5 h-5 text-yellow-600" />,
  tuition_fee: <GraduationCap className="w-5 h-5 text-red-600" />,
  accommodation: <Home className="w-5 h-5 text-orange-600" />
}

export default function PaymentHistoryPage() {
  const [transactions, setTransactions] = useState(dummyTransactions)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Filters state
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    category: "",
    minAmount: "",
    maxAmount: "",
    sort_by: "date",
    sort_order: "desc"
  })

  // Handle click outside
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

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    // Status filter
    if (filters.status && txn.status !== filters.status) return false

    // Payment method filter
    if (filters.paymentMethod && txn.paymentMethod !== filters.paymentMethod) return false

    // Category filter
    if (filters.category && txn.category !== filters.category) return false

    // Amount filter
    if (filters.minAmount && txn.amount < parseFloat(filters.minAmount)) return false
    if (filters.maxAmount && txn.amount > parseFloat(filters.maxAmount)) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        txn.transactionId.toLowerCase().includes(query) ||
        txn.description.toLowerCase().includes(query) ||
        txn.amount.toString().includes(query)
      )
    }

    return true
  })

  // Get statistics
  const stats = {
    total: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
    success: filteredTransactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0),
    count: filteredTransactions.length,
    successCount: filteredTransactions.filter(t => t.status === 'success').length
  }

  // Copy transaction ID
  const copyTransactionId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPage(1)
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.status) count++
    if (filters.paymentMethod) count++
    if (filters.category) count++
    if (filters.minAmount) count++
    if (filters.maxAmount) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "",
      paymentMethod: "",
      category: "",
      minAmount: "",
      maxAmount: "",
      sort_by: "date",
      sort_order: "desc"
    })
    setSearchQuery("")
    setPage(1)
  }

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => prev + 1)
          setLoadingMore(true)
          // Simulate loading more data
          setTimeout(() => {
            setLoadingMore(false)
          }, 1000)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loadingMore, loading])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="space-y-4 sm:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Payment History</h1>
              <p className="text-muted-foreground text-sm">
                Track all your transactions and payment details
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4 flex-wrap">
          <motion.div
            variants={itemVariants}
            className="relative flex-1 min-w-[250px]"
          >
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions by ID, amount, or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
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

                    {/* Drawer Content */}
                    <div className="p-4 space-y-4">
                      {/* Status Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Status
                        </label>
                        <ModernSelect
                          options={[
                            { value: 'success', label: 'Success' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'failed', label: 'Failed' },
                            { value: 'refunded', label: 'Refunded' }
                          ]}
                          value={filters.status}
                          onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                          placeholder="Select status"
                          className="py-0"
                        />
                      </div>

                      {/* Payment Method Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Payment Method
                        </label>
                        <ModernSelect
                          options={[
                            { value: 'credit_card', label: 'Credit Card' },
                            { value: 'debit_card', label: 'Debit Card' },
                            { value: 'paypal', label: 'PayPal' },
                            { value: 'bank_transfer', label: 'Bank Transfer' },
                            { value: 'upi', label: 'UPI' }
                          ]}
                          value={filters.paymentMethod}
                          onChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}
                          placeholder="Select method"
                          className="py-0"
                        />
                      </div>

                      {/* Category Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Category
                        </label>
                        <ModernSelect
                          options={[
                            { value: 'application_fee', label: 'Application Fees' },
                            { value: 'exam_fee', label: 'Exam Fees' },
                            { value: 'visa_fee', label: 'Visa Fees' },
                            { value: 'service_fee', label: 'Service Fees' },
                            { value: 'document_fee', label: 'Document Fees' },
                            { value: 'tuition_fee', label: 'Tuition Deposits' },
                            { value: 'accommodation', label: 'Accommodation' }
                          ]}
                          value={filters.category}
                          onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                          placeholder="Select category"
                          className="py-0"
                        />
                      </div>

                      {/* Amount Range */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Amount Range</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.minAmount}
                            onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxAmount}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                          />
                        </div>
                      </div>

                      {/* Active Filters Display */}
                      {activeFilterCount > 0 && (
                        <div className="pt-2 border-t border-border">
                          <div className="flex flex-wrap gap-1.5">
                            {filters.status && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                Status: {filters.status}
                                <button onClick={() => handleFilterChange('status', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.paymentMethod && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.paymentMethod}
                                <button onClick={() => handleFilterChange('paymentMethod', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.category && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.category}
                                <button onClick={() => handleFilterChange('category', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
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

        {/* Stats Cards */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Spent"
            value={`$${stats.success.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            color="from-green-500/10 to-green-600/5 border-green-200"
          />
          <StatCard
            title="Successful"
            value={stats.successCount.toString()}
            icon={<CheckCircle className="w-6 h-6 text-blue-600" />}
            color="from-blue-500/10 to-blue-600/5 border-blue-200"
          />
          <StatCard
            title="Pending"
            value={filteredTransactions.filter(t => t.status === 'pending').length.toString()}
            icon={<Clock className="w-6 h-6 text-yellow-600" />}
            color="from-yellow-500/10 to-yellow-600/5 border-yellow-200"
          />
          <StatCard
            title="Total Transactions"
            value={stats.count.toString()}
            icon={<Receipt className="w-6 h-6 text-purple-600" />}
            color="from-purple-500/10 to-purple-600/5 border-purple-200"
          />
        </motion.div> */}

        {/* Transactions Grid */}
        <motion.div
          className="flex flex-col gap-2 mt-4"
          variants={containerVariants}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-3 w-3/4"></div>
                <div className="h-3 bg-muted rounded mb-4 w-1/2"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between">
                  <div className="h-4 bg-muted rounded w-28"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))
          ) : filteredTransactions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No transactions found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || activeFilterCount > 0
                  ? "Try adjusting your search or filters"
                  : "You haven't made any payments yet. Your transaction history will appear here once you make a payment."
                }
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredTransactions.map((txn, index) => {
              const status = statusConfig[txn.status]
              const paymentMethod = paymentMethods[txn.paymentMethod]
              const categoryIcon = categoryIcons[txn.category as keyof typeof categoryIcons] || <FileText className="w-5 h-5 text-gray-400" />
              
              return (
<motion.div
  key={txn._id}
  variants={itemVariants}
  custom={index}
  whileHover={{ y: -3, scale: 1.01 }}
  className={`group relative bg-gradient-to-br ${status.color.replace(
    'border-',
    'border-2'
  )} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10`}
>
  <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    {/* LEFT SECTION */}
    <div className="flex items-center gap-4 flex-1 min-w-0">

      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm border shrink-0">
        {categoryIcon}
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0 flex-1">

        {/* Description */}
        <h3 className="font-bold text-base truncate">
          {txn.description}
        </h3>

        {/* Payment method */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          {paymentMethod.icon}
          <span>{paymentMethod.label}</span>
          {txn.cardLast4 && (
            <span className="text-xs">•••• {txn.cardLast4}</span>
          )}
        </div>

        {/* Transaction ID + Date */}
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">

          <span title={txn.transactionId} className="truncate max-w-[180px]">
            ID: {txn.transactionId}
          </span>

          <span>
            {format(new Date(txn.date), 'MMM dd, yyyy')}
          </span>

          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(txn.date), 'HH:mm')}
          </span>

        </div>

      </div>
    </div>


    {/* RIGHT SECTION */}
    <div className="flex items-center justify-between md:justify-end gap-6">

      {/* Amount */}
      <div className="text-right">
        <p className="text-xl font-bold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: txn.currency.toUpperCase()
          }).format(txn.amount)}
        </p>
      </div>

      {/* Status */}
      <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${status.badge}`}>
        {status.icon}
        <span className="ml-1">{status.label}</span>
      </div>

      {/* Copy Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          copyTransactionId(txn.transactionId)
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
      >
        {copiedId === txn.transactionId ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </>
        )}
      </button>

    </div>

  </div>
</motion.div>

              )
            })
          )}
        </motion.div>

        {/* Load More / Infinite Scroll */}
        <div ref={observerTarget} className="py-8">
          {loadingMore && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">Loading more transactions...</p>
            </div>
          )}
          {!hasMore && filteredTransactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">You've reached the end of the list</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Showing {filteredTransactions.length} transactions
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}

// Stat Card Component
function StatCard({ title, value, icon, color }: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 border transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  )
}