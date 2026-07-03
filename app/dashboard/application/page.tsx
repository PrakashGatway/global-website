"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap, MapPin, Calendar, DollarSign, FileText, Upload,
  Download, CheckCircle, AlertCircle, Clock, X, ChevronRight,
  Plus, Search, Filter, Eye, Edit2, Save, Trash2, RefreshCw,
  Mail, Phone, MessageCircle, Award, TrendingUp, Star, Flag, Mail as MailIcon, FileX,
  Building2, BadgeCheck,
  AlertCircleIcon,
  SendHorizonalIcon,
  WatchIcon,
  Check
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { format, formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaPlaneArrival } from "react-icons/fa"
import { useGlobal } from "@/src/statecontext"

// Types based on schema
interface Document {
  name: string
  description?: string
  docUrl: string
  docType: string
}

interface BackupCourse {
  course: {
    _id: string
    name: string
    university?: {
      _id: string
      name: string
      uni_logo?: string
    }
  }
  intake: string
  order: number
}

interface Application {
  _id: string
  applicationNumber: string
  student?: {
    _id: string
    name: string
    email: string
    phone?: string
    profileImage?: string
  }
  country: string
  course: {
    _id: string
    name: string
    shortName?: string
    level?: string
    duration?: string
    tuitionFee?: number
    currency?: string
    applicationFee?: number
    university?: {
      _id: string
      name: string
      slug: string
      country: string
      city: string
      uni_logo?: string
    }
  }
  intake: string
  paymentStatus: 'Pending' | 'Completed' | 'Failed'
  expectations?: {
    understood: boolean
    agreed: boolean
  }
  documents: Document[]
  OoshasDocuments: Document[]
  extraRequirements?: any
  backups: BackupCourse[]
  primaryStatus: 'Pending' | 'Under Review' | 'Offer Received' | 'Case Closed' | 'Application Refused' | 'Withdrawn'
  isWithdrawn: boolean
  userNotes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

const errorMessage = (msg, className) => {
  return (
    <div className={`w-full rounded-xl border mb-3 border-red-300 bg-red-50 p-5 py-2 flex items-center gap-4 ${className || ''}`}>
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="">
          <AlertCircleIcon className="w-7 h-7 text-red-600 stroke-[1.5px]" />
        </div>
      </div>

      {/* Content */}
      <div className="text-red-700 text-sm leading-relaxed">
        <p>
          {msg}
        </p>
      </div>
    </div>
  )
}

// Status color mapping
const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    'Pending': {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: <Clock className="w-4 h-4" />,
      label: 'Pending'
    },
    'Started': {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'Processing'
    },
    'ReviewbyOoshas': {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'Under Review'
    },
    'SubmitToSchool': {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <SendHorizonalIcon className="w-4 h-4" />,
      label: 'Submitted to School'
    },
    'AwaitingSchoolResponse': {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <WatchIcon className="w-4 h-4" />,
      label: 'Awaiting School Response'
    },
    'AdmissionProcessing': {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Admission Processing'
    },
    'OfferReceived': {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Offer Received'
    },
    'Refused': {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: <FileX className="w-4 h-4" />,
      label: 'Application Refused'
    },
    'Withdrawn': {
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: <Flag className="w-4 h-4" />,
      label: 'Withdrawn'
    },
    'PreArrival': {
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <Calendar className="w-4 h-4" />,
      label: 'Pre-Arrival'
    },
    'Arrived': {
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <FaPlaneArrival className="w-4 h-4" />,
      label: 'Arrived'
    },
    'Completed': {
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <Check className="w-4 h-4" />,
      label: 'Completed'
    }
  }
  return statusMap[status] || statusMap['Pending']
}

// Payment status mapping
const getPaymentStatusInfo = (status: string) => {
  const statusMap: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    'Pending': {
      color: 'bg-yellow-100 text-yellow-700',
      icon: <Clock className="w-4 h-4 stroke-[1.5px]" />,
      label: 'Pending'
    },
    'Completed': {
      color: 'bg-green-100 text-green-700',
      icon: <CheckCircle className="w-4 h-4 stroke-[1.5px]" />,
      label: 'Completed'
    },
    'Failed': {
      color: 'bg-red-100 text-red-700',
      icon: <AlertCircle className="w-4 h-4 stroke-[1.5px]" />,
      label: 'Failed'
    }
  }
  return statusMap[status] || statusMap['Pending']
}

export default function ApplicationHistoryPage({heading = "Application History", subheading = "Track your study abroad applications and manage required documents", limit = 10, viewAll = false}) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [filterCountry, setFilterCountry] = useState<string>('')
  const {allProfile} = useGlobal()


  const router = useRouter()

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: limit || 10,
    total: 0,
    pages: 0,
    hasMore: false
  })

  // Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Fetch applications with pagination
  const fetchApplications = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true)
      else setLoadingMore(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filterStatus.length > 0 && { primaryStatus: filterStatus.join(',') }),
        ...(filterCountry && { country: filterCountry }),
        ...(searchQuery && { search: searchQuery })
      })

      const response = await axiosInstance.get(`/applications?${params}`)
      const data = response.data


      setApplications(prev =>
        append ? [...prev, ...data.data] : data.data
      )

      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        pages: data.pages,
        hasMore: data.page < data.pages
      })
    } catch (error) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filterCountry, pagination.limit])

  // Initial fetch
  useEffect(() => {
    fetchApplications(1, false)
  }, [filterCountry])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (loading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && pagination.hasMore && !loadingMore) {
          fetchApplications(pagination.page + 1, true)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loading, pagination.hasMore, loadingMore, pagination.page, fetchApplications])


const ApplicationCard = ({ application }: { application: any }) => {
    const statusInfo = getStatusInfo(application.primaryStatus)
    const paymentInfo = getPaymentStatusInfo(application.paymentStatus)
    const university = application.course?.university

    return (
      <motion.tr
        onClick={() => router.push(`/dashboard/application/${application.applicationNumber}`)}
        className="hover:bg-gray-50 cursor-pointer group"
        style={{ borderBottom: '1px solid #e5e7eb' }}
      >
        {/* Course & University */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="flex-shrink-0">
              {university?.uni_logo ? (
                <Image
                  src={university.uni_logo}
                  alt={university.name}
                  width={40}
                  loading="lazy"
                  height={40}
                  className="object-contain"
                />
              ) : (
                <Building2 className="w-10 h-10 stroke-[1px] text-gray-400" />
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">{application.course?.name || 'University'}</div>
              <div className="text-xs text-gray-500">{university?.name}</div>
            </div>
          </div>
        </td>

        {/* Application Number */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          <span className="text-sm font-mono text-gray-600">
            {application.applicationNumber}
          </span>
        </td>

        {/* Intake */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          <span className="text-sm text-gray-600">{application.intake}</span>
        </td>

        {/* Level */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          <span className="text-sm text-gray-600">{application.course.level || '—'}</span>
        </td>

        {/* Duration */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          <span className="text-sm text-gray-600">{application.course.duration || '—'}</span>
        </td>

        {/* Country */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          <span className="text-sm text-gray-600">{application.country}</span>
        </td>

        {/* Status */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </td>

        {/* Fee */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          {application.course.applicationFee !== 0 && statusInfo.label == "Pending" ? (
            <span className="font-semibold text-gray-900">
              {application.course.currency || 'USD'} {application.course.applicationFee.toLocaleString()}
            </span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </td>

        {/* Payment Status */}
        <td className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb' }}>
          {(application.course.applicationFee !== 0 && paymentInfo.label == "Pending") ? (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border ${paymentInfo.color}`}>
              {paymentInfo.icon}
              {paymentInfo.label == "Pending" ? "Unpaid" : paymentInfo.label}
            </span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex gap-2">
            {(application.course.applicationFee !== 0 && paymentInfo.label == "Pending") && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/dashboard/checkout?application=${application.applicationNumber}`);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-[#1C3058] hover:bg-[#1C3058]/80 transition-colors"
                style={{ border: '1px solid #1C3058' }}
              >
                Pay Now
              </button>
            )}
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors" style={{ border: '1px solid #d1d5db' }}>
              View
            </button>
          </div>
        </td>
      </motion.tr>
    )
}

// Payment Warning Row Component
const PaymentWarningRow = ({ application }: { application: any }) => {
    const paymentInfo = getPaymentStatusInfo(application.paymentStatus)
    
    return (
      <tr style={{ backgroundColor: '#fefce8', borderBottom: '1px solid #e5e7eb' }}>
        <td colSpan={10} className="px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-yellow-800">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Without payment confirmation, the application process cannot proceed. Please complete the payment to move forward with your application.
          </div>
        </td>
      </tr>
    )
}

return (
  <main className="flex-1 overflow-y-auto">
    <div className="max-w-full mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {subheading}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-screen">
          <div className="max-w-full mx-auto">
            <div className="animate-pulse">
              <table className="w-full" style={{ border: '1px solid #e5e7eb' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    {[...Array(10)].map((_, i) => (
                      <th key={i} className="px-4 py-3" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      {[...Array(10)].map((_, j) => (
                        <td key={j} className="px-4 py-3" style={{ borderRight: j < 9 ? '1px solid #e5e7eb' : 'none' }}>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12" style={{ border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterStatus.length > 0 || filterCountry
              ? 'Try adjusting your filters or search query'
              : 'You haven\'t submitted any applications yet'}
          </p>
          <Link
            href="/dashboard/programs"
            className="inline-flex items-center gap-2 px-6 py-3 text-white transition-all"
            style={{ backgroundColor: '#F26D44' }}
          >
            <Plus className="w-4 h-4" />
            Start New Application
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ border: '1px solid #e5e7eb', borderCollapse: 'collapse' }}>
              {/* Table Header */}
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    App. No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    Intake
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    Fee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ borderBottom: '1px solid #e5e7eb' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {applications.map((application, index) => (
                  <>
                    <ApplicationCard key={application._id} application={application} />
                    
                    {/* Warning row for pending payment applications */}
                    {(application.course.applicationFee !== 0 && 
                      getPaymentStatusInfo(application.paymentStatus).label == "Pending") && (
                      <PaymentWarningRow key={`warning-${application._id}`} application={application} />
                    )}
                    
                    {/* Footer info row for each application */}
                    <tr key={`footer-${application._id}`} style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <td colSpan={10} className="px-4 py-2">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                          </span>
                          {application.backups?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5" />
                              {application.backups.length} Backup{application.backups.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.hasMore && (
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {loadingMore ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Loading more...
                </div>
              ) : (
                <button
                  onClick={() => fetchApplications(pagination.page + 1, true)}
                  className="px-6 py-2 transition-colors text-gray-600"
                  style={{ border: '1px solid #e5e7eb', backgroundColor: 'white' }}
                >
                  Load More
                </button>
              )}
            </div>
          )}
          
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {applications.length} of {pagination.total} applications
          </div>
        </>
      )}
    </div>
  </main>
)
}