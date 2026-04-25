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
    const documentCount = application.documents.length

    return (
      <motion.div
        onClick={() => router.push(`/dashboard/application/${application.applicationNumber}`)}
        className="bg-white border-2 rounded-xl p-5 pb-3 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center overflow-hidden group-hover:border-[#F26D44] transition-colors">
              {university?.uni_logo ? (
                <Image
                  src={university.uni_logo}
                  alt={university.name}
                  width={60}
                  height={60}
                  className="object-contain mt-1"
                />
              ) : (
                <Building2 className="w-14 h-14 stroke-[1px] text-gray-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-base text-gray-900">{application.course?.name || 'University'}</h3>
                <span className="text-base bg-gray-100 font-medium text-gray-800 px-2 py-0.5 rounded-full">
                  {application.applicationNumber}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                  <span className="flex items-center gap-1">
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </span>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">{university.name}</p>
              <p className="text-sm text-gray-700 font-medium">Academic Intake: {application.intake}</p>
            </div>
          </div>


          {/* Status Badges */}
          <div className="flex flex-col items-start justify-between h-full gap-2">
            {/* <div className="flex items-center gap-2">
              <span>
                Status :
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                <span className="flex items-center gap-1">
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </span>
            </div> */}
            {application.course.applicationFee && statusInfo.label == "Pending" && (
              <span className="text-sm font-medium text-gray-900">
                Application Fee: {application.course.currency || 'USD'} {application.course.applicationFee.toLocaleString()}
              </span>
            )}
            <div className="flex w-full justify-end gap-1">
              {paymentInfo.label == "Pending" && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/dashboard/checkout?application=${application.applicationNumber}`);
                }} className="text-sm z-50 shadow-md transition-colors hover:shadow-xl font-medium border border-gray-300 px-3 py-2 rounded-lg bg-[#1C3058] hover:bg-[#1C3058]/80 text-gray-100">
                  Pay Now
                </button>
              )}
              <button className="text-sm hover:ring-1 shadow-md transition-colors hover:shadow-xl font-medium border border-gray-300 px-3 py-2 rounded-lg text-gray-800">
                View
              </button>
            </div>

          </div>
        </div>
        {paymentInfo.label == "Pending" && errorMessage('Without payment confirmation, the application process cannot proceed. Please complete the payment to move forward with your application.', 'py-2')}

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-1.5 border-t border-gray-300">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex flex-wrap items-center gap-3 !text-xs !text-gray-600">
              {application.course.level && (
                <span className="flex items-center gap-1">
                  <Award className="w-5 h-5 stroke-[1.5px]" />
                  {application.course.level}
                </span>
              )}
              {application.course.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-5 h-5 stroke-[1.5px]" />
                  {application.course.duration}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-5 h-5 stroke-[1.5px]" />
                {application.country}
              </span>

            </div>
            {application.backups?.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <GraduationCap className="w-5 h-5 stroke-[1.5px]" />
                {application.backups.length} Backup{application.backups.length !== 1 ? 's' : ''}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <Clock className="w-5 h-5 stroke-[1.5px] " />
              {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center gap-2">

            <div className="flex items-center text-xs gap-1">
              <span>
                Payment Status :
              </span>
              <span className={`px-3 py-1 rounded-full font-medium border ${paymentInfo.color}`}>
                <span className="flex items-center text-xs gap-1">
                  {paymentInfo.icon}
                  {paymentInfo.label == "Pending" ? "Unpaid" : paymentInfo.label}
                </span>
              </span>
            </div>
          </div>

        </div>
      </motion.div >
    )
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{heading}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {subheading}
              </p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                      <div className="h-5 bg-gray-200 rounded w-[50%] mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-[25%]"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F26D44] to-[#626363] text-white rounded-lg hover:from-[#d55a3a] hover:to-[#4a4a4a] transition-all"
            >
              <Plus className="w-4 h-4" />
              Start New Application
            </Link>
          </div>
        ) : (
          <>
            { allProfile?.profileCompletion < 60 && errorMessage('The student\'s profile is incomplete and the system is not able to determine eligibility or calculate correct administration fees due to missing/invalid information related to the student. It is highly advised that you complete the profile before submitting applications.')}
            <div className="space-y-4">
              {applications.map(application => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>
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
                    className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
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