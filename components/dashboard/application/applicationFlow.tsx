// components/application/ApplicationFlow.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, Clock, ArrowRight, Calendar, FileText, User, Mail, 
  Globe, CreditCard, Phone, MapPin, Save, ArrowLeft, Upload, X, 
  Eye, Download, AlertCircle, Send 
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import toast from "react-hot-toast"
import { useGlobal } from "@/src/statecontext"

// ==================== Application Started Component ====================
const ApplicationStarted = ({ application, onContinue }: { application: any; onContinue: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
    >
 

      {/* Application Started Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Application Started</h2>
            <p className="text-gray-600">
              You have started your application for {application?.course?.name} at {application?.course?.university?.name} for the {application?.intake} intake.
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Started on {application?.createdAt ? new Date(application.createdAt).toLocaleString() : 'N/A'}</span>
            </div>
            <button
              onClick={onContinue}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              Continue Application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Application Tasks */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Application Tasks</h3>
        <div className="space-y-3">
          {[
            { title: "Fill Application Form", description: "Provide your personal, academic and contact details", status: "current" },
            { title: "Upload Documents", description: "Upload required documents", status: "pending" },
            { title: "Program Questions", description: "Answer program specific questions", status: "pending" },
            { title: "Review & Submit", description: "Review your application and submit", status: "pending" }
          ].map((task, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                task.status === "current" ? "bg-blue-600" : "bg-gray-300"
              }`}>
                {task.status === "current" && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${task.status === "current" ? "text-blue-700" : "text-gray-900"}`}>
                  {task.title}
                </h4>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <ArrowRight className={`w-4 h-4 ${task.status === "current" ? "text-blue-600" : "text-gray-400"}`} />
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Tasks
        </button>
      </div>

      {/* Application Status */}
      <div className="p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Application Status</h3>
        <div className="space-y-2">
          {[
            { label: "Submitted to School", status: "completed" },
            { label: "Awaiting School Response", status: "current" },
            { label: "Admission Processing", status: "pending" },
            { label: "Offer Received", status: "pending" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                item.status === "completed" ? "bg-green-500" :
                item.status === "current" ? "bg-blue-500 animate-pulse" : "bg-gray-300"
              }`} />
              <span className={`text-sm ${
                item.status === "completed" ? "text-green-700" :
                item.status === "current" ? "text-blue-700 font-medium" : "text-gray-500"
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Application Details */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-900">{application?.student?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium text-gray-900 capitalize">{application?.student?.gender || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Application ID</p>
            <p className="font-medium text-gray-900">{application?.applicationNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">E-Mail</p>
            <p className="font-medium text-gray-900">{application?.student?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nationality</p>
            <p className="font-medium text-gray-900">{application?.student?.nationality || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passport No.</p>
            <p className="font-medium text-gray-900">{application?.student?.passportNumber || "N/A"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ==================== Fill Application Form Component ====================
const FillApplicationForm = ({ application, onNext, onSave }: { application: any; onNext: () => void; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    fullName: application?.student?.name || "",
    gender: application?.student?.gender || "",
    nationality: application?.student?.nationality || "",
    dateOfBirth: application?.student?.dateOfBirth ? new Date(application.student.dateOfBirth).toISOString().split('T')[0] : "",
    email: application?.student?.email || "",
    phone: application?.student?.phone || "",
    passportNumber: application?.student?.passportNumber || "",
    address: application?.student?.address || "",
    city: application?.student?.city || "",
    state: application?.student?.state || "",
    postalCode: application?.student?.postalCode || "",
    country: application?.student?.country || ""
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setSaved(false)
  }

  const handleSave = () => {
    onSave(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fill Application Form</h2>
            <p className="text-gray-600 mt-1">Provide your personal, academic and contact details</p>
          </div>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Saved</span>
            </motion.div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your nationality"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
                required
              />
            </div>
          </div>

          {/* Passport Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => handleChange("passportNumber", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your passport number"
              />
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your complete address"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="State"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Postal code"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Country"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            Save Progress
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  )
}

// ==================== Upload Documents Component ====================
const UploadDocumentsStep = ({ application, onNext, onPrevious, onSave }: { application: any; onNext: () => void; onPrevious: () => void; onSave: (data: any) => void }) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({})

  const requiredDocuments = [
    { id: "passport", label: "Passport Copy", required: true, description: "Upload your valid passport (first and last page)" },
    { id: "photo", label: "Passport Size Photograph", required: true, description: "Recent passport size photograph with white background" },
    { id: "tenthMarksheet", label: "10th Marksheet", required: true, description: "10th standard marksheet or certificate" },
    { id: "twelfthMarksheet", label: "12th Marksheet", required: true, description: "12th standard marksheet or certificate" },
    { id: "graduationMarksheet", label: "Graduation Marksheets", required: false, description: "All semester/year wise marksheets (if applicable)" },
    { id: "ieltsScorecard", label: "IELTS/TOEFL Scorecard", required: false, description: "English proficiency test scorecard" },
    { id: "cv", label: "CV/Resume", required: false, description: "Updated CV/Resume" },
    { id: "lor", label: "Letters of Recommendation", required: false, description: "LORs from professors/employers" }
  ]

  const handleFileUpload = (docId: string, file: File) => {
    setUploadedFiles({ ...uploadedFiles, [docId]: file })
  }

  const removeFile = (docId: string) => {
    const newFiles = { ...uploadedFiles }
    delete newFiles[docId]
    setUploadedFiles(newFiles)
  }

  const isFormComplete = () => {
    return requiredDocuments.filter(doc => doc.required).every(doc => uploadedFiles[doc.id])
  }

  const handleSubmit = () => {
    onSave(uploadedFiles)
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
        <p className="text-gray-600 mt-1">Please upload the required documents</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{doc.label}</h3>
                    {doc.required && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">Required</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                </div>
                {uploadedFiles[doc.id] ? (
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeFile(doc.id)} className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <FileText className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {!uploadedFiles[doc.id] ? (
                <label className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Upload {doc.label}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(doc.id, file)
                    }}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 truncate flex-1">{uploadedFiles[doc.id].name}</span>
                  <span className="text-xs text-green-600">{(uploadedFiles[doc.id].size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upload Progress Indicator */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Upload Progress</span>
            <span className="text-sm text-blue-600">
              {Object.keys(uploadedFiles).length} / {requiredDocuments.filter(d => d.required).length} required
            </span>
          </div>
          <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(uploadedFiles).length / requiredDocuments.filter(d => d.required).length) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ==================== Program Questions Component ====================
const ProgramQuestionsStep = ({ application, onNext, onPrevious, onSave }: { application: any; onNext: () => void; onPrevious: () => void; onSave: (data: any) => void }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [saved, setSaved] = useState(false)

  const questions = [
    {
      id: "q1",
      question: "Why are you interested in this program?",
      type: "textarea",
      required: true,
      placeholder: "Explain your motivation for choosing this program..."
    },
    {
      id: "q2",
      question: "What are your career goals after completing this program?",
      type: "textarea",
      required: true,
      placeholder: "Describe your career aspirations..."
    },
    {
      id: "q3",
      question: "Do you have any relevant work experience?",
      type: "textarea",
      required: false,
      placeholder: "Share your work experience if any..."
    },
    {
      id: "q4",
      question: "How did you hear about this university?",
      type: "select",
      required: true,
      options: ["Social Media", "Education Fair", "Agent/Counselor", "University Website", "Friend/Family", "Other"]
    }
  ]

  const handleChange = (id: string, value: string) => {
    setAnswers({ ...answers, [id]: value })
    setSaved(false)
  }

  const handleSave = () => {
    onSave(answers)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isFormComplete = () => {
    return questions.filter(q => q.required).every(q => answers[q.id]?.trim())
  }

  const handleSubmit = () => {
    onSave(answers)
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Program Questions</h2>
            <p className="text-gray-600 mt-1">Answer program specific questions</p>
          </div>
          {saved && (
            <motion.div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Saved</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {q.question}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {q.type === "textarea" ? (
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={q.placeholder}
                  required={q.required}
                />
              ) : (
                <select
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={q.required}
                >
                  <option value="">Select an option</option>
                  {q.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Save Progress
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormComplete()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ==================== Review & Submit Component ====================
const ReviewSubmitStep = ({ application, formData, documents, answers, onSubmit, onPrevious }: { application: any; formData: any; documents: any; answers: any; onSubmit: () => void; onPrevious: () => void }) => {
  const [submitting, setSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async () => {
    if (!agreed) {
      toast.error("Please agree to the terms and conditions")
      return
    }
    setSubmitting(true)
    await onSubmit()
    setSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-gray-600 mt-1">Review your application before submitting</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Personal Information Review */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-medium text-gray-900">{formData?.fullName || application?.student?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Gender</p>
              <p className="font-medium text-gray-900 capitalize">{formData?.gender || application?.student?.gender}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900">{formData?.dateOfBirth || application?.student?.dateOfBirth?.split('T')[0]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Nationality</p>
              <p className="font-medium text-gray-900">{formData?.nationality || application?.student?.nationality}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{formData?.email || application?.student?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{formData?.phone || application?.student?.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Passport Number</p>
              <p className="font-medium text-gray-900">{formData?.passportNumber || application?.student?.passportNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Documents Review */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Uploaded Documents</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(documents || {}).map(([key, file]: [string, any]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Program Questions Review */}
        {answers && Object.keys(answers).length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Program Questions</h3>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(answers).map(([key, value]: [string, any]) => {
                const question = [
                  "Why are you interested in this program?",
                  "What are your career goals after completing this program?",
                  "Do you have any relevant work experience?",
                  "How did you hear about this university?"
                ][parseInt(key.replace('q', '')) - 1]
                return (
                  <div key={key}>
                    <p className="text-xs text-gray-500">{question}</p>
                    <p className="text-sm text-gray-900">{value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Declaration */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Declaration</h4>
              <p className="text-sm text-yellow-700">
                I hereby declare that all the information provided in this application is true and correct to the best of my knowledge.
                I understand that providing false information may result in rejection of my application or cancellation of admission.
              </p>
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500" 
                />
                <span className="text-sm text-yellow-800">I agree to the terms and conditions</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
          >
            {submitting ? (
              <>Submitting...</>
            ) : (
              <>
                Submit Application
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ==================== Main Application Flow Component ====================
export default function ApplicationFlow({ application, onUpdate }: { application: any; onUpdate: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [documents, setDocuments] = useState({})
  const [answers, setAnswers] = useState({})
  const [showStarted, setShowStarted] = useState(true)
  const { profile } = useGlobal()

  // Check if application already has data
  useEffect(() => {
    if (application?.student?.name) {
      setFormData({
        fullName: application.student.name,
        gender: application.student.gender,
        nationality: application.student.nationality,
        dateOfBirth: application.student.dateOfBirth?.split('T')[0],
        email: application.student.email,
        phone: application.student.phone,
        passportNumber: application.student.passportNumber,
        address: application.student.address,
        city: application.student.city,
        state: application.student.state,
        postalCode: application.student.postalCode,
        country: application.student.country
      })
    }
  }, [application])

  const handleContinue = () => {
    setShowStarted(false)
    setCurrentStep(1)
  }

  const saveFormData = async (data: any) => {
    try {
      await axiosInstance.put(`/applications/update/${application._id}`, {
        student: {
          ...application.student,
          name: data.fullName,
          gender: data.gender,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
          phone: data.phone,
          passportNumber: data.passportNumber,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country
        }
      })
      setFormData(data)
      onUpdate()
      toast.success("Progress saved")
      return true
    } catch (error) {
      console.error("Error saving form data:", error)
      toast.error("Failed to save progress")
      return false
    }
  }

  const saveDocuments = async (docs: any) => {
    setDocuments(docs)
    toast.success("Documents saved")
    return true
  }

  const saveAnswers = async (ans: any) => {
    setAnswers(ans)
    toast.success("Answers saved")
    return true
  }

  const submitApplication = async () => {
    try {
      await axiosInstance.put(`/applications/update/${application._id}`, {
        status: "submitted",
        primaryStatus: "SubmitToSchool",
        submittedAt: new Date().toISOString(),
        submittedBy: profile?._id
      })
      toast.success("Application submitted successfully!")
      onUpdate()
      return true
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error("Failed to submit application")
      return false
    }
  }

  if (showStarted && currentStep === 0) {
    return <ApplicationStarted application={application} onContinue={handleContinue} />
  }

  // Render current step component
  if (currentStep === 1) {
    return <FillApplicationForm application={application} onNext={() => setCurrentStep(2)} onSave={saveFormData} />
  }
  if (currentStep === 2) {
    return <UploadDocumentsStep application={application} onNext={() => setCurrentStep(3)} onPrevious={() => setCurrentStep(1)} onSave={saveDocuments} />
  }
  if (currentStep === 3) {
    return <ProgramQuestionsStep application={application} onNext={() => setCurrentStep(4)} onPrevious={() => setCurrentStep(2)} onSave={saveAnswers} />
  }
  if (currentStep === 4) {
    return <ReviewSubmitStep application={application} formData={formData} documents={documents} answers={answers} onSubmit={submitApplication} onPrevious={() => setCurrentStep(3)} />
  }

  return null
}