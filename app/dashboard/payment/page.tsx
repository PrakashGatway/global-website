"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
import toast from "react-hot-toast"

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface Purchase {
  _id: string
  transactionId: string
  amount: number
  originalAmount: number
  gst: number
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Refunded'
  paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'Wallet' | 'Bank Transfer'
  couponCode: string
  couponDiscount: number
  isWalletUsed: boolean
  walletPointsUsed: number
  reason: string
  refund?: {
    refundId: string
    refundAmount: number
    refundDate: string
    reason: string
  }
  createdAt: string
  updatedAt: string
  application?: {
    _id: string
    applicationNumber: string
    intake: string
    course: {
      _id: string
      name: string
      slug: string
      university: {
        _id: string
        name: string
        uni_logo: string
        city: string
        country: string
      }
    }
  }
  isService: boolean
  serviceName: string
}

// Status configuration
const statusConfig = {
  Completed: {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    label: 'Success',
    badge: 'bg-green-500/10 text-green-600'
  },
  Cancelled: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="w-4 h-4 text-red-600" />,
    label: 'Failed',
    badge: 'bg-red-500/10 text-red-600'
  },
  Pending: {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <Clock className="w-4 h-4 text-yellow-600" />,
    label: 'Pending',
    badge: 'bg-yellow-500/10 text-yellow-600'
  },
  Refunded: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <RefreshCw className="w-4 h-4 text-blue-600" />,
    label: 'Refunded',
    badge: 'bg-blue-500/10 text-blue-600'
  }
}

// Payment method icons and colors
const paymentMethods = {
  'Credit Card': {
    icon: <CreditCard className="w-5 h-5" />,
    color: 'text-blue-600 bg-blue-50',
    label: 'Credit Card'
  },
  'Debit Card': {
    icon: <CreditCard className="w-5 h-5" />,
    color: 'text-green-600 bg-green-50',
    label: 'Debit Card'
  },
  'UPI': {
    icon: <FileText className="w-5 h-5" />,
    color: 'text-indigo-600 bg-indigo-50',
    label: 'UPI'
  },
  'Wallet': {
    icon: <DollarSign className="w-5 h-5" />,
    color: 'text-emerald-600 bg-emerald-50',
    label: 'Wallet'
  },
  'Bank Transfer': {
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-purple-600 bg-purple-50',
    label: 'Bank Transfer'
  }
}

// Category icons based on service/application
const getCategoryIcon = (purchase: Purchase) => {
  if (purchase.isService) {
    return <Shield className="w-5 h-5 text-blue-600" />
  }
  if (purchase.application?.course) {
    return <GraduationCap className="w-5 h-5 text-purple-600" />
  }
  return <FileText className="w-5 h-5 text-gray-400" />
}

const getCategoryLabel = (purchase: Purchase) => {
  if (purchase.isService) {
    return purchase.serviceName || 'Service Fee'
  }
  if (purchase.application?.course) {
    return 'Application Fee'
  }
  return 'Payment'
}

export default function PaymentHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Filters state
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    minAmount: "",
    maxAmount: "",
    sort_by: "createdAt",
    sort_order: "desc"
  })

  // Fetch payment history from API
  const fetchPaymentHistory = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
        ...(filters.minAmount && { minAmount: filters.minAmount }),
        ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
        sort_by: filters.sort_by,
        sort_order: filters.sort_order
      })

      const response = await axiosInstance.get(`/purchases/payments/history?${params}`)
      const { purchases: data, pagination } = response.data.data

      if (reset) {
        setPurchases(data || [])
      } else {
        setPurchases(prev => [...prev, ...(data || [])])
      }

      setTotalPages(pagination?.pages || 1)
      setHasMore(currentPage < (pagination?.pages || 1))
    } catch (error) {
      console.error('Error fetching payment history:', error)
      toast.error('Failed to load payment history')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [page, debouncedSearchQuery, filters])

  // Initial fetch and reset on filter changes
  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchPaymentHistory(true)
  }, [debouncedSearchQuery, filters])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => prev + 1)
          setLoadingMore(true)
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

  // Load more when page changes
  useEffect(() => {
    if (page > 1 && !loading) {
      fetchPaymentHistory(false)
    }
  }, [page])

  // Handle click outside for filters
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isClickInsideSelect = event.target instanceof Element && (
        event.target.closest('[data-radix-select-content]') ||
        event.target.closest('[data-headlessui-state="open"]') ||
        event.target.closest('[role="listbox"]') ||
        event.target.closest('.select-dropdown')
      )

      if (filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node) &&
        !isClickInsideSelect) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Calculate statistics
  const stats = useMemo(() => {
    const completedPurchases = purchases.filter(p => p.status === 'Completed')
    return {
      totalSpent: completedPurchases.reduce((sum, p) => sum + p.amount, 0),
      totalCount: purchases.length,
      successCount: completedPurchases.length,
      pendingCount: purchases.filter(p => p.status === 'Pending').length,
      refundedCount: purchases.filter(p => p.status === 'Refunded').length
    }
  }, [purchases])

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
      minAmount: "",
      maxAmount: "",
      sort_by: "createdAt",
      sort_order: "desc"
    })
    setSearchQuery("")
    setPage(1)
  }

  // Copy transaction ID
  const copyTransactionId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      toast.success('Transaction ID copied!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  // View receipt/download
  const viewReceipt = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setShowDetailsModal(true)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

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
    <main className="flex-1 overflow-y-auto max-w-7xl mx-auto px-4">
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-6 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Payment History
            </h1>
            <p className="text-muted-foreground text-sm">
              Track all your transactions and payment details
            </p>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        {/* <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex-1"
          >
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions by ID, amount, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background/50 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          <div className="relative" ref={filterButtonRef}>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full animate-pulse">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                    style={{ transformOrigin: 'top right' }}
                  >
                    <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        Filters
                      </h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4" />
                          Status
                        </label>
                        <ModernSelect
                          options={[
                            { value: 'Completed', label: 'Completed' },
                            { value: 'Pending', label: 'Pending' },
                            { value: 'Cancelled', label: 'Cancelled' },
                            { value: 'Refunded', label: 'Refunded' }
                          ]}
                          value={filters.status}
                          onChange={(value) => handleFilterChange('status', value)}
                          placeholder="Select status"
                          className="py-0"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="w-4 h-4" />
                          Payment Method
                        </label>
                        <ModernSelect
                          options={[
                            { value: 'Credit Card', label: 'Credit Card' },
                            { value: 'Debit Card', label: 'Debit Card' },
                            { value: 'UPI', label: 'UPI' },
                            { value: 'Wallet', label: 'Wallet' },
                            { value: 'Bank Transfer', label: 'Bank Transfer' }
                          ]}
                          value={filters.paymentMethod}
                          onChange={(value) => handleFilterChange('paymentMethod', value)}
                          placeholder="Select method"
                          className="py-0"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          Amount Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.minAmount}
                            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxAmount}
                            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                          />
                        </div>
                      </div>

                      {activeFilterCount > 0 && (
                        <div className="pt-3 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {filters.status && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                Status: {filters.status}
                                <button onClick={() => handleFilterChange('status', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                            {filters.paymentMethod && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.paymentMethod}
                                <button onClick={() => handleFilterChange('paymentMethod', '')} className="hover:bg-primary/20 rounded-full p-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 p-4 border-t border-border bg-muted/30">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div> */}

        {/* Results Count */}
        {/* {!loading && purchases.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{purchases.length}</span> transactions
            </p>
          </motion.div>
        )} */}

        {/* Transactions List */}
        <motion.div
          className="flex flex-col gap-3"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-48"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))
          ) : purchases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <CreditCard className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No transactions found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || activeFilterCount > 0
                  ? "Try adjusting your search or filters"
                  : "You haven't made any payments yet. Your transaction history will appear here once you make a payment."
                }
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            purchases.map((purchase, index) => {
              const status = statusConfig[purchase.status]
              const paymentMethod = paymentMethods[purchase.paymentMethod as keyof typeof paymentMethods] || paymentMethods['Credit Card']
              const categoryIcon = getCategoryIcon(purchase)
              const categoryLabel = getCategoryLabel(purchase)

              return (
                <motion.div
                  key={purchase._id}
                  className={`group relative bg-gradient-to-br ${status.color.replace('border-', 'border-2')} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow hover:shadow-primary/10 cursor-pointer`}
                  onClick={() => viewReceipt(purchase)}
                >
                  <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-4 px-2 flex-1 min-w-0">
                      {/* Icon */}
                      {/* <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border shrink-0">
                        {categoryIcon}
                      </div> */}

                      {/* Info */}
                      <div className="flex flex-col min-w-0 flex-1">
                        {/* Description */}
                        <h3 className="font-bold text-base truncate">
                          {categoryLabel}
                        </h3>

                        {/* Course/Service Name */}
                        {purchase.application?.course && (
                          <p className="text-sm text-muted-foreground truncate">
                            {purchase.application.course.name}
                          </p>
                        )}
                        {purchase.isService && purchase.serviceName && (
                          <p className="text-sm text-muted-foreground truncate">
                            {purchase.serviceName}
                          </p>
                        )}

                        {/* University Info */}
                        {purchase.application?.course?.university && (
                          <div className="flex items-center gap-2 mt-1">
                            {purchase.application.course.university.uni_logo && (
                              <img
                                src={purchase.application.course.university.uni_logo}
                                alt=""
                                className="w-4 h-4 object-contain"
                              />
                            )}
                            <p className="text-xs text-muted-foreground">
                              {purchase.application.course.university.name}
                            </p>
                          </div>
                        )}

                        {/* Transaction ID */}

                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-center justify-between md:justify-end gap-2">
                      {/* Amount */}
                      <div className="flex gap-2">
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {formatCurrency(purchase.amount)}
                          </p>
                          {purchase.originalAmount > purchase.amount && (
                            <p className="text-xs text-green-600">
                              Saved {formatCurrency(purchase.originalAmount - purchase.amount)}
                            </p>
                          )}
                        </div>

                        {/* Status */}
                        <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${status.badge}`}>
                          {status.icon}
                          <span>{status.label}</span>
                        </div>

                        {/* Copy Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyTransactionId(purchase.transactionId)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
                        >
                          {copiedId === purchase.transactionId ? (
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
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="font-mono">ID: {purchase.transactionId}</span>
                        <span>{format(new Date(purchase.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                  </div>

                  {/* Coupon/Wallet Info Badge */}
                  {(purchase.couponCode || purchase.isWalletUsed) && (
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-2 bg-muted/30 border-t border-border/50 text-xs">
                      <div className="flex items-center gap-3">
                        {purchase.couponCode && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Tag className="w-3 h-3" />
                            Coupon: {purchase.couponCode} (Saved {formatCurrency(purchase.couponDiscount)})
                          </span>
                        )}
                        {purchase.isWalletUsed && purchase.walletPointsUsed > 0 && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <DollarSign className="w-3 h-3" />
                            Wallet: Used {purchase.walletPointsUsed} points
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </motion.div>

        {/* Load More / Infinite Scroll */}
        <div ref={observerTarget} className="py-8">
          {loadingMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Loading more transactions...</p>
            </motion.div>
          )}
          {!hasMore && purchases.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-muted-foreground">You've reached the end</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Showing {purchases.length} transactions
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPurchase && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto z-50 bg-background rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Transaction Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="font-mono text-sm">{selectedPurchase.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{format(new Date(selectedPurchase.createdAt), 'PPP p')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(selectedPurchase.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusConfig[selectedPurchase.status].badge}`}>
                        {statusConfig[selectedPurchase.status].icon}
                        {statusConfig[selectedPurchase.status].label}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <div className="flex items-center gap-2">
                        <span>{selectedPurchase.paymentMethod}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Original Amount</p>
                      <p>{formatCurrency(selectedPurchase.originalAmount)}</p>
                    </div>
                  </div>

                  {selectedPurchase.couponCode && (
                    <div>
                      <p className="text-sm text-muted-foreground">Coupon Applied</p>
                      <p>{selectedPurchase.couponCode} - Saved {formatCurrency(selectedPurchase.couponDiscount)}</p>
                    </div>
                  )}

                  {selectedPurchase.isWalletUsed && (
                    <div>
                      <p className="text-sm text-muted-foreground">Wallet Used</p>
                      <p>{selectedPurchase.walletPointsUsed} points</p>
                    </div>
                  )}

                  {selectedPurchase.application?.course && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Program</p>
                        <p>{selectedPurchase.application.course.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">University</p>
                        <p>{selectedPurchase.application.course.university.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Intake</p>
                        <p>{selectedPurchase.application.intake}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Application Number</p>
                        <p>{selectedPurchase.application.applicationNumber}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      copyTransactionId(selectedPurchase.transactionId)
                    }}
                    className="flex-1 px-4 py-2 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Copy Transaction ID
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}