"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap, MapPin, Calendar, DollarSign, FileText, Upload,
  Download, CheckCircle, AlertCircle, Clock, X, ChevronRight,
  Plus, Search, Filter, Eye, Edit2, Save, Trash2, RefreshCw,
  Mail, Phone, MessageCircle, Award, TrendingUp, Star, Flag,
  Users, Briefcase, BookOpen, Home, Settings, User, Mail as MailIcon
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { format, formatDistanceToNow } from "date-fns"

interface ApplicationDocument {
  _id: string
  name: string
  type: string
  fileUrl: string
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
  uploadedAt: string
  verifiedAt?: string
  rejectionReason?: string
}

interface ApplicationTimeline {
  _id: string
  status: string
  description: string
  date: string
  by: string
}

interface Application {
  _id: string
  universityId: string
  universityName: string
  universityLogo?: string
  courseId: string
  courseName: string
  courseLevel: string
  intake: string
  applicationFee: number
  tuitionFee: number
  currency: string
  status: 'draft' | 'submitted' | 'under_review' | 'additional_docs' | 'accepted' | 'rejected' | 'visa_processing' | 'visa_granted' | 'enrolled'
  priority: 'low' | 'medium' | 'high'
  submittedDate?: string
  decisionDate?: string
  visaStartDate?: string
  visaEndDate?: string
  documents: ApplicationDocument[]
  timeline: ApplicationTimeline[]
  requirements: {
    ielts?: string
    toefl?: string
    pte?: string
    gre?: string
    gmat?: string
    workExperience?: string
    statementOfPurpose?: boolean
    lettersOfRecommendation?: number
    resume?: boolean
    passportCopy?: boolean
    academicTranscripts?: boolean
    degreeCertificates?: boolean
  }
  counselor?: {
    name: string
    email: string
    phone: string
    avatar?: string
  }
  notes?: string
  scholarshipAmount?: number
}

// Status color mapping
const getStatusInfo = (status: string) => {
  const statusMap: any = {
    draft: { 
      color: 'bg-gray-100 text-gray-700', 
      icon: <Clock className="w-4 h-4 text-gray-600" />,
      label: 'Draft'
    },
    submitted: { 
      color: 'bg-blue-100 text-blue-700', 
      icon: <SendIcon className="w-4 h-4 text-blue-600" />,
      label: 'Submitted'
    },
    under_review: { 
      color: 'bg-purple-100 text-purple-700', 
      icon: <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />,
      label: 'Under Review'
    },
    additional_docs: { 
      color: 'bg-yellow-100 text-yellow-700', 
      icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
      label: 'Additional Docs Required'
    },
    accepted: { 
      color: 'bg-green-100 text-green-700', 
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      label: 'Accepted'
    },
    rejected: { 
      color: 'bg-red-100 text-red-700', 
      icon: <X className="w-4 h-4 text-red-600" />,
      label: 'Rejected'
    },
    visa_processing: { 
      color: 'bg-indigo-100 text-indigo-700', 
      icon: <Clock className="w-4 h-4 text-indigo-600" />,
      label: 'Visa Processing'
    },
    visa_granted: { 
      color: 'bg-emerald-100 text-emerald-700', 
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
      label: 'Visa Granted'
    },
    enrolled: { 
      color: 'bg-teal-100 text-teal-700', 
      icon: <GraduationCap className="w-4 h-4 text-teal-600" />,
      label: 'Enrolled'
    }
  }
  return statusMap[status] || statusMap.draft
}

// Document type icons
const getDocumentIcon = (type: string) => {
  const docIcons: any = {
    'passport': <FileText className="w-5 h-5 text-blue-600" />,
    'transcript': <FileText className="w-5 h-5 text-green-600" />,
    'certificate': <Award className="w-5 h-5 text-yellow-600" />,
    'sop': <BookOpen className="w-5 h-5 text-purple-600" />,
    'lor': <Users className="w-5 h-5 text-indigo-600" />,
    'resume': <FileText className="w-5 h-5 text-red-600" />,
    'ielts': <FileText className="w-5 h-5 text-orange-600" />,
    'toefl': <FileText className="w-5 h-5 text-pink-600" />
  }
  return docIcons[type.toLowerCase()] || <FileText className="w-5 h-5 text-gray-600" />
}

// Custom Send icon component
const SendIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

export default function ApplicationHistoryPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'accepted' | 'rejected'>('all')
  const [showApplicationDetails, setShowApplicationDetails] = useState<Application | null>(null)
  const [showUploadModal, setShowUploadModal] = useState<{ 
    applicationId: string, 
    documentType: string 
  } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [notesForm, setNotesForm] = useState({
    applicationId: '',
    notes: ''
  })

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/applications')
      setApplications(response.data.result || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // Filter applications based on tab and search
  const filteredApplications = applications.filter(app => {
    // Tab filter
    if (activeTab === 'active' && !['submitted', 'under_review', 'additional_docs', 'visa_processing'].includes(app.status)) {
      return false
    }
    if (activeTab === 'accepted' && app.status !== 'accepted' && app.status !== 'visa_granted' && app.status !== 'enrolled') {
      return false
    }
    if (activeTab === 'rejected' && app.status !== 'rejected') {
      return false
    }

    // Status filter
    if (filterStatus.length > 0 && !filterStatus.includes(app.status)) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        app.universityName.toLowerCase().includes(query) ||
        app.courseName.toLowerCase().includes(query) ||
        app.courseLevel.toLowerCase().includes(query) ||
        app.intake.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Handle document upload
  const handleDocumentUpload = async () => {
    if (!documentFile || !showUploadModal) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', documentFile)
      formData.append('documentType', showUploadModal.documentType)
      formData.append('applicationId', showUploadModal.applicationId)

      const response = await axiosInstance.post('/applications/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Update application in state
      setApplications(applications.map(app => 
        app._id === showUploadModal.applicationId
          ? { ...app, documents: [...app.documents, response.data.result] }
          : app
      ))

      setShowUploadModal(null)
      setDocumentFile(null)
      alert('Document uploaded successfully!')
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Handle document delete
  const handleDeleteDocument = async (applicationId: string, documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await axiosInstance.delete(`/applications/${applicationId}/documents/${documentId}`)
      
      setApplications(applications.map(app => 
        app._id === applicationId
          ? { ...app, documents: app.documents.filter(doc => doc._id !== documentId) }
          : app
      ))

      if (showApplicationDetails?._id === applicationId) {
        setShowApplicationDetails({
          ...showApplicationDetails,
          documents: showApplicationDetails.documents.filter(doc => doc._id !== documentId)
        })
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  // Handle notes update
  const handleUpdateNotes = async () => {
    if (!notesForm.applicationId) return

    try {
      setSaving(true)
      await axiosInstance.patch(`/applications/${notesForm.applicationId}`, {
        notes: notesForm.notes
      })

      setApplications(applications.map(app => 
        app._id === notesForm.applicationId
          ? { ...app, notes: notesForm.notes }
          : app
      ))

      if (showApplicationDetails?._id === notesForm.applicationId) {
        setShowApplicationDetails({ ...showApplicationDetails, notes: notesForm.notes })
      }
    } catch (error) {
      console.error('Error updating notes:', error)
    } finally {
      setSaving(false)
    }
  }

  // Get document status color
  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'uploaded':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  // Application Card Component
  const ApplicationCard = ({ application }: { application: Application }) => {
    const statusInfo = getStatusInfo(application.status)
    const pendingDocs = application.documents.filter(doc => doc.status === 'pending').length

    return (
      <div
        onClick={() => setShowApplicationDetails(application)}
        className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {application.universityLogo ? (
              <img
                src={application.universityLogo}
                alt={application.universityName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{application.universityName}</h3>
              <p className="text-sm text-muted-foreground">{application.courseName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} mb-2`}>
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
            </span>
            {application.priority === 'high' && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                High Priority
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{application.courseLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{application.intake}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>USA</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>{application.tuitionFee.toLocaleString()} {application.currency}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {application.submittedDate && (
              <span>
                Submitted {formatDistanceToNow(new Date(application.submittedDate), { addSuffix: true })}
              </span>
            )}
            {application.decisionDate && application.status === 'accepted' && (
              <span className="text-green-600">
                Decision: {formatDistanceToNow(new Date(application.decisionDate), { addSuffix: true })}
              </span>
            )}
          </div>
          
          {pendingDocs > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {pendingDocs} doc{pendingDocs > 1 ? 's' : ''} pending
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">Application History</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Track your study abroad applications and upload required documents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="hidden">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filter Applications
              </h3>
              
              {/* Status Tabs */}
              <div className="space-y-1 mb-6">
                {[
                  { key: 'all', label: 'All Applications', count: applications.length },
                  { key: 'active', label: 'Active', count: applications.filter(a => ['submitted', 'under_review', 'additional_docs', 'visa_processing'].includes(a.status)).length },
                  { key: 'accepted', label: 'Accepted', count: applications.filter(a => ['accepted', 'visa_granted', 'enrolled'].includes(a.status)).length },
                  { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-primary/10 text-primary border border-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Application Status</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {[
                    'draft', 'submitted', 'under_review', 'additional_docs',
                    'accepted', 'rejected', 'visa_processing', 'visa_granted', 'enrolled'
                  ].map(status => {
                    const info = getStatusInfo(status)
                    return (
                      <label key={status} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterStatus.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilterStatus([...filterStatus, status])
                            } else {
                              setFilterStatus(filterStatus.filter(s => s !== status))
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className={`text-xs ${info.color} px-2 py-0.5 rounded`}>
                          {info.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-6 border-t border-border">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                    <Search className="w-4 h-4" />
                    <span>Search Applications</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Status</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export All</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Search Bar */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-6">
              <div className="relative">
                <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by university, course, or intake..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Applications Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-2xl">
                <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Applications Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || filterStatus.length > 0
                    ? 'Try adjusting your filters or search query'
                    : 'You haven\'t submitted any applications yet'}
                </p>
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Start New Application
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map(application => (
                  <ApplicationCard key={application._id} application={application} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {showApplicationDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowApplicationDetails(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {showApplicationDetails.universityLogo ? (
                    <img
                      src={showApplicationDetails.universityLogo}
                      alt={showApplicationDetails.universityName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{showApplicationDetails.universityName}</h2>
                    <p className="text-muted-foreground">{showApplicationDetails.courseName}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {showApplicationDetails.courseLevel}
                      </span>
                      <span className="text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {showApplicationDetails.intake}
                      </span>
                      <span className="text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        USA
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplicationDetails(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Timeline */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Application Status</h3>
                  <span className={`px-4 py-2 rounded-full font-medium ${getStatusInfo(showApplicationDetails.status).color}`}>
                    {getStatusInfo(showApplicationDetails.status).icon}
                    <span className="ml-2">{getStatusInfo(showApplicationDetails.status).label}</span>
                  </span>
                </div>

                {/* Timeline */}
                <div className="relative pl-6 border-l-2 border-primary/20">
                  {showApplicationDetails.timeline.map((event, index) => (
                    <div key={event._id} className="mb-6">
                      <div className="absolute -left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-background" />
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">{event.status}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {format(new Date(event.date), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated by: {event.by}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-lg mb-4">Financial Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Application Fee</p>
                    <p className="font-medium">
                      {showApplicationDetails.applicationFee.toLocaleString()} {showApplicationDetails.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tuition Fee (Annual)</p>
                    <p className="font-medium">
                      {showApplicationDetails.tuitionFee.toLocaleString()} {showApplicationDetails.currency}
                    </p>
                  </div>
                  {showApplicationDetails.scholarshipAmount && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Scholarship Amount</p>
                      <p className="font-medium text-green-600">
                        {showApplicationDetails.scholarshipAmount.toLocaleString()} {showApplicationDetails.currency}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Counselor */}
              {showApplicationDetails.counselor && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Assigned Counselor
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {showApplicationDetails.counselor.avatar ? (
                        <img
                          src={showApplicationDetails.counselor.avatar}
                          alt={showApplicationDetails.counselor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{showApplicationDetails.counselor.name}</p>
                        <p className="text-sm text-muted-foreground">{showApplicationDetails.counselor.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={`tel:${showApplicationDetails.counselor.phone}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <a
                        href={`mailto:${showApplicationDetails.counselor.email}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <MailIcon className="w-4 h-4" />
                        Email
                      </a>
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Required Documents */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Required Documents</h3>
                  <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {showApplicationDetails.documents.filter(d => d.status === 'verified').length} / {showApplicationDetails.documents.length} verified
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'passportCopy', label: 'Passport Copy', required: true },
                    { key: 'academicTranscripts', label: 'Academic Transcripts', required: true },
                    { key: 'degreeCertificates', label: 'Degree Certificates', required: true },
                    { key: 'statementOfPurpose', label: 'Statement of Purpose', required: true },
                    { key: 'lettersOfRecommendation', label: 'Letters of Recommendation', required: true },
                    { key: 'resume', label: 'Resume/CV', required: true },
                    { key: 'ielts', label: 'IELTS Score', required: false },
                    { key: 'toefl', label: 'TOEFL Score', required: false },
                    { key: 'gre', label: 'GRE Score', required: false },
                    { key: 'gmat', label: 'GMAT Score', required: false }
                  ].map(doc => {
                    const uploadedDoc = showApplicationDetails.documents.find(d => 
                      d.type.toLowerCase().includes(doc.key.toLowerCase())
                    )
                    const isRequired = (showApplicationDetails.requirements as any)[doc.key]

                    return (
                      <div key={doc.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDocumentIcon(doc.key)}
                          <div>
                            <p className="font-medium">{doc.label}</p>
                            {isRequired && <p className="text-xs text-muted-foreground">Required</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadedDoc ? (
                            <span className={`px-3 py-1 rounded-full text-xs ${getDocumentStatusColor(uploadedDoc.status)}`}>
                              {uploadedDoc.status.toUpperCase()}
                            </span>
                          ) : (
                            <button
                              onClick={() => setShowUploadModal({
                                applicationId: showApplicationDetails._id,
                                documentType: doc.key
                              })}
                              className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors"
                            >
                              Upload
                            </button>
                          )}
                          {uploadedDoc && (
                            <button
                              onClick={() => handleDeleteDocument(showApplicationDetails._id, uploadedDoc._id)}
                              className="p-1 hover:bg-destructive/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Uploaded Documents */}
              {showApplicationDetails.documents.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {showApplicationDetails.documents.map(doc => (
                      <div key={doc._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDocumentIcon(doc.type)}
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${getDocumentStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Notes */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Notes & Comments</h3>
                  {notesForm.applicationId === showApplicationDetails._id && (
                    <button
                      onClick={handleUpdateNotes}
                      disabled={saving}
                      className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {saving ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      Save
                    </button>
                  )}
                </div>
                {notesForm.applicationId === showApplicationDetails._id ? (
                  <textarea
                    value={notesForm.notes}
                    onChange={(e) => setNotesForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add your notes here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="space-y-3">
                    {showApplicationDetails.notes ? (
                      <p className="whitespace-pre-wrap">{showApplicationDetails.notes}</p>
                    ) : (
                      <p className="text-muted-foreground">No notes added yet.</p>
                    )}
                    <button
                      onClick={() => {
                        setNotesForm({
                          applicationId: showApplicationDetails._id,
                          notes: showApplicationDetails.notes || ''
                        })
                      }}
                      className="px-3 py-1 border border-border text-xs rounded hover:bg-muted transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Document Type
                </label>
                <input
                  type="text"
                  value={showUploadModal.documentType.replace(/([A-Z])/g, ' $1').trim()}
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Choose File
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="document-upload"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {documentFile ? (
                      <div className="text-primary font-medium">
                        {documentFile.name}
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to select file (Max 10MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
                {documentFile && (
                  <p className="text-xs text-muted-foreground mt-2">
                    File size: {(documentFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowUploadModal(null)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDocumentUpload}
                  disabled={uploading || !documentFile}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Document
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  )
}