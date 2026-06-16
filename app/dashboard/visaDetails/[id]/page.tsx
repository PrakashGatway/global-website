// app/visa-journey/edit/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Save, ArrowLeft, Trash2, Plus, ChevronDown, ChevronUp,
  Edit3, CheckCircle, AlertCircle, Info, FileText, User,
  Calendar, Building2, Globe, Briefcase, Clock, CreditCard,
  FileCheck, MapPin, Phone, Mail, MessageCircle, Shield,
  Award, BookOpen, HelpCircle, Download, Eye, UploadCloud,
  X, Check, AlertTriangle, Fingerprint, Camera, Link as LinkIcon,
  File,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import axiosInstance, { fileBaseurl } from '@/app/axiosInstance';

export default function VisaJourneyEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadingFile, setUploadingFile] = useState({ stepId: null, isUploading: false });
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    applicationId: "",
    country: "",
    course: "",
    currentStep: 1,
    steps: [],
    documents: []
  });
  
  const search = useParams();
  const dataId = search?.id as string;

  // Fetch existing visa data
  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        const response = await axiosInstance.get(`/visa/${dataId}`);
        if (response.data.success && response.data.data) {
          const apiData = response.data.data;
          setFormData({
            id: apiData._id,
            userId: apiData.user?.name || "123",
            applicationId: apiData.applicationId || "",
            country: apiData.country || "IT",
            course: apiData.course?.name || "69871a5060ce62ab201683ad",
            currentStep: apiData.currentStep || 1,
            steps: apiData.steps || getDefaultSteps(),
            documents: apiData.documents || []
          });
        } else {
          setFormData({
            id: dataId,
            userId: "123",
            applicationId: "OS1779510584408",
            country: "IT",
            course: "69871a5060ce62ab201683ad",
            currentStep: 1,
            steps: getDefaultSteps(),
            documents: []
          });
        }
      } catch (error) {
        console.error("Error fetching visa data:", error);
        setError("Failed to load visa data");
        setFormData({
          id: dataId,
          userId: "123",
          applicationId: "123",
          country: "IT",
          course: "123",
          currentStep: 1,
          steps: getDefaultSteps(),
          documents: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (dataId) {
      fetchVisaData();
    }
  }, [dataId]);

  const getDefaultSteps = () => [
    {
      id: 1,
      label: "APS Applied",
      route: "aps-applied",
      page: {
        title: "APS Application",
        status: "In Progress",
        subtitle: "Complete your APS process to proceed with visa application."
      },
      banner: {
        type: "info",
        title: "Your APS application is in progress.",
        subtitle: "Complete your APS process to proceed with visa application.",
        action: "View APS Application",
        fileUrl: "",
        fileName: ""
      },
      progress: 45,
      sections: {
        overview: {
          title: "APS Application Overview",
          updated: "09 Jul 2024",
          details: [
            { label: "APS Application No.", value: "APSI2416789", highlight: false },
            { label: "Date of APS Application", value: "10 May 2024", highlight: false },
            { label: "APS Status", value: "Under Review", highlight: true },
            { label: "Evaluating Authority", value: "TU Munich", highlight: false },
            { label: "Degree", value: "Bachelor's Degree", highlight: false },
            { label: "University", value: "ABC University", highlight: false },
            { label: "Program", value: "MS in Data Science", highlight: false },
            { label: "Documents Submitted", value: "7 of 11", highlight: false },
            { label: "Payment Status", value: "Paid", highlight: true },
            { label: "Estimated Result Date", value: "25 Jun 2024", highlight: false }
          ]
        }
      },
      importantInfo: [],
      progressSteps: [],
      statusTimeline: []
    },
    {
      id: 2,
      label: "APS Approval",
      route: "aps-approval",
      page: {
        title: "APS Approval",
        status: "Pending",
        subtitle: "Waiting for APS approval."
      },
      banner: {
        type: "info",
        title: "APS certificate pending approval.",
        subtitle: "Your APS certificate is being processed.",
        action: "Track Status",
        fileUrl: "",
        fileName: ""
      },
      progress: 0,
      sections: {
        overview: {
          title: "APS Approval Details",
          updated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          details: [
            { label: "Application Type", value: "Individual", highlight: false },
            { label: "Reference ID", value: "APS123456789", highlight: false },
            { label: "Certificate No.", value: "APS-DE-2024-001234", highlight: false },
            { label: "Country", value: "Germany", highlight: false },
            { label: "Date Applied", value: "10 May 2024", highlight: false },
            { label: "Status", value: "Pending", highlight: true },
            { label: "University", value: "TU Munich", highlight: false },
            { label: "Approved By", value: "APS Germany", highlight: false }
          ]
        }
      },
      importantInfo: [],
      progressSteps: [],
      statusTimeline: []
    },
    {
      id: 3,
      label: "Visa Application",
      route: "visa-application",
      page: {
        title: "Visa Application",
        status: "Pending",
        subtitle: "Complete and submit your visa application for processing."
      },
      banner: {
        type: "info",
        title: "Visa Application in Progress",
        subtitle: "Please complete all sections and upload required documents.",
        action: "Continue Application",
        fileUrl: "",
        fileName: ""
      },
      progress: 0,
      sections: {
        overview: {
          title: "Visa Application Information",
          updated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          details: [
            { label: "Visa Type", value: "Student Visa (D)", highlight: false },
            { label: "Visa Category", value: "National Visa (D)", highlight: false },
            { label: "Country", value: "Germany", highlight: false },
            { label: "Purpose of Stay", value: "Higher Education", highlight: false },
            { label: "Intake", value: "Fall 2026", highlight: false },
            { label: "University", value: "TU Munich", highlight: false },
            { label: "Program", value: "MS in Data Science", highlight: false },
            { label: "Application Fee", value: "€750", highlight: true },
            { label: "Payment Status", value: "Paid", highlight: true },
            { label: "Application No.", value: "VA202406501001", highlight: false },
            { label: "Current Status", value: "In Progress", highlight: true }
          ]
        }
      },
      importantInfo: [],
      progressSteps: [],
      statusTimeline: []
    },
    {
      id: 4,
      label: "Biometrics",
      route: "biometrics",
      page: {
        title: "Biometrics Appointment",
        status: "Pending",
        subtitle: "Schedule your biometrics appointment"
      },
      banner: {
        type: "info",
        title: "Biometrics Appointment Required",
        subtitle: "Please schedule and complete your biometrics appointment.",
        action: "Book Appointment",
        fileUrl: "",
        fileName: ""
      },
      progress: 0,
      sections: {
        overview: {
          title: "Biometrics Appointment Details",
          updated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          details: [
            { label: "Appointment Date", value: "Not Scheduled", highlight: false },
            { label: "Appointment Time", value: "Not Scheduled", highlight: false },
            { label: "Center Name", value: "VFS Global", highlight: false },
            { label: "Center Address", value: "To be confirmed", highlight: false },
            { label: "Status", value: "Pending", highlight: true },
            { label: "Fees Paid", value: "Not Paid", highlight: false }
          ]
        }
      },
      importantInfo: [],
      progressSteps: [],
      statusTimeline: []
    },
    {
      id: 5,
      label: "Visa Decision",
      route: "visa-decision",
      page: {
        title: "Visa Decision",
        status: "Pending"
      },
      banner: {
        type: "info",
        title: "Visa Under Review",
        subtitle: "Your application is being processed by the embassy.",
        action: "Track Status",
        fileUrl: "",
        fileName: ""
      },
      progress: 0,
      sections: {
        overview: {
          title: "Visa Decision Tracking",
          updated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          details: [
            { label: "Visa Type", value: "Student Visa (D)", highlight: false },
            { label: "Application No.", value: "VA202406501001", highlight: false },
            { label: "Status", value: "Under Review", highlight: true },
            { label: "Application Received", value: "10 May 2024", highlight: false },
            { label: "Estimated Decision Date", value: "To be determined", highlight: false },
            { label: "Embassy", value: "German Embassy", highlight: false }
          ]
        }
      },
      importantInfo: [],
      progressSteps: [],
      statusTimeline: []
    },
    {
      id: 6,
      label: "Visa Approved",
      route: "visa-approved",
      page: {
        title: "Visa Approved",
        status: "Pending"
      },
      banner: {
        type: "success",
        title: "Visa Approved!",
        subtitle: "Congratulations! Your visa has been approved.",
        action: "Download Visa Letter",
        fileUrl: "",
        fileName: ""
      },
      progress: 0,
      sections: {
        overview: {
          title: "Visa Approval Details",
          updated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          details: [
            { label: "Visa Status", value: "Approved", highlight: true },
            { label: "Visa Type", value: "Student Visa (D)", highlight: false },
            { label: "Visa Number", value: "VIS123456789", highlight: false },
            { label: "Validity From", value: "To be updated", highlight: false },
            { label: "Validity Till", value: "To be updated", highlight: false },
            { label: "Number of Entries", value: "Multiple", highlight: false }
          ]
        }
      },
      importantInfo: [],
      progressSteps: [],
      statusTimeline: []
    }
  ];

  // Document Handlers - Updated based on API routes
  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get(`/visa/${dataId}/documents`);
      if (response.data.success && response.data.data) {
        setFormData(prev => ({
          ...prev,
          documents: response.data.data.requirements || response.data.data.documents || []
        }));
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Fallback: try to get documents from the visa data
      try {
        const visaResponse = await axiosInstance.get(`/visa/${dataId}`);
        if (visaResponse.data.success && visaResponse.data.data) {
          setFormData(prev => ({
            ...prev,
            documents: visaResponse.data.data.documents || []
          }));
        }
      } catch (fallbackError) {
        console.error("Error in fallback fetch:", fallbackError);
        setError("Failed to fetch documents");
      }
    }
  };

  // Create document requirement without file
  const handleCreateDocumentRequirement = async (documentType, description, isRequired) => {
    setUploadingDocument(true);
    
    try {
      const documentData = {
        visaId: dataId,
        documentType: documentType,
        description: description,
        isRequired: isRequired
      };

      const response = await axiosInstance.post('/visa/document', documentData);
      
      if (response.data.success) {
        await fetchDocuments();
        setSuccess(`Document requirement "${documentType}" created successfully`);
        setTimeout(() => setSuccess(null), 3000);
        return true;
      } else {
        throw new Error(response.data.message || "Failed to create document requirement");
      }
    } catch (error) {
      console.error("Error creating document requirement:", error);
      setError(error.response?.data?.message || "Error creating document requirement");
      return false;
    } finally {
      setUploadingDocument(false);
    }
  };

  // Upload document with file
  const handleDocumentUpload = async (documentType, file, description, isRequired) => {
    setUploadingDocument(true);
    
    try {
      if (file) {
        // Upload file first
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        formDataFile.append('visaId', dataId);
        formDataFile.append('documentType', documentType);
        
        const uploadResponse = await axiosInstance.post('/visa/upload', formDataFile, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (uploadResponse.data.success) {
          await fetchDocuments();
          setSuccess(`Document "${documentType}" uploaded successfully`);
          setTimeout(() => setSuccess(null), 3000);
          return true;
        } else {
          throw new Error(uploadResponse.data.message || "File upload failed");
        }
      } else {
        // Create document requirement without file
        return await handleCreateDocumentRequirement(documentType, description, isRequired);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setError(error.response?.data?.message || "Error uploading document");
      return false;
    } finally {
      setUploadingDocument(false);
    }
  };

  // Delete document
  const handleDocumentDelete = async (documentId, documentType) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await axiosInstance.delete(`/visa/${dataId}/documents/${documentId}`);
      if (response.data.success) {
        await fetchDocuments();
        setSuccess("Document deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.data.message || "Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      setError(error.response?.data?.message || "Error deleting document");
    }
  };

  // Verify document
  const handleDocumentVerify = async (documentId, status, rejectionReason = '') => {
    try {
      const response = await axiosInstance.patch(`/visa/document/${documentId}`, {
        status: status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
        verifiedAt: status === 'verified' ? new Date().toISOString() : undefined
      });
      
      if (response.data.success) {
        await fetchDocuments();
        setSuccess(`Document ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.data.message || `Failed to ${status} document`);
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      setError(error.response?.data?.message || "Error updating document status");
    }
  };

  // Download document
  const handleDocumentDownload = (fileUrl, fileName) => {
    if (!fileUrl) return;
    
    const link = document.createElement('a');
    link.href = fileBaseurl(fileUrl);
    link.download = fileName || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (stepId, file) => {
    if (!file) return;
    
    setUploadingFile({ stepId, isUploading: true });
    
    try {
      const formDataFile = new FormData();
      formDataFile.append('file', file);
      
      const response = await axiosInstance.post('/upload', formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success && response.data.docUrl) {
        setFormData((prev) => ({
          ...prev,
          steps: prev.steps.map(step =>
            step.id === stepId
              ? { 
                  ...step, 
                  banner: { 
                    ...step.banner, 
                    fileUrl: response.data.docUrl,
                    fileName: file.name
                  } 
                }
              : step
          )
        }));
        setSuccess(`File uploaded successfully for step ${stepId}`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file");
    } finally {
      setUploadingFile({ stepId: null, isUploading: false });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (stepId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, [field]: value }
          : step
      )
    }));
  };

  const handleStepPageChange = (stepId, pageField, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, page: { ...step.page, [pageField]: value } }
          : step
      )
    }));
  };

  const handleStepBannerChange = (stepId, bannerField, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, banner: { ...step.banner, [bannerField]: value } }
          : step
      )
    }));
  };

  const handleStepProgressChange = (stepId, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, progress: parseInt(value) || 0 }
          : step
      )
    }));
  };

  const handleSectionDetailChange = (stepId, sectionName, detailIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId && step.sections && step.sections[sectionName]) {
          const updatedDetails = [...step.sections[sectionName].details];
          updatedDetails[detailIndex] = {
            ...updatedDetails[detailIndex],
            [field]: field === 'highlight' ? value : value
          };
          return {
            ...step,
            sections: {
              ...step.sections,
              [sectionName]: {
                ...step.sections[sectionName],
                details: updatedDetails
              }
            }
          };
        }
        return step;
      })
    }));
  };

  const addSectionDetail = (stepId, sectionName) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId && step.sections && step.sections[sectionName]) {
          return {
            ...step,
            sections: {
              ...step.sections,
              [sectionName]: {
                ...step.sections[sectionName],
                details: [
                  ...step.sections[sectionName].details,
                  { label: "New Field", value: "", highlight: false }
                ]
              }
            }
          };
        }
        return step;
      })
    }));
  };

  const removeSectionDetail = (stepId, sectionName, detailIndex) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId && step.sections && step.sections[sectionName]) {
          const updatedDetails = step.sections[sectionName].details.filter((_, i) => i !== detailIndex);
          return {
            ...step,
            sections: {
              ...step.sections,
              [sectionName]: {
                ...step.sections[sectionName],
                details: updatedDetails
              }
            }
          };
        }
        return step;
      })
    }));
  };

  // Important Info Handlers
  const addImportantInfo = (stepId) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? {
              ...step,
              importantInfo: [
                ...(step.importantInfo || []),
                { title: "New Important Info", description: "", type: "info" }
              ]
            }
          : step
      )
    }));
  };

  const handleImportantInfoChange = (stepId, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId) {
          const updatedInfo = [...(step.importantInfo || [])];
          updatedInfo[index] = { ...updatedInfo[index], [field]: value };
          return { ...step, importantInfo: updatedInfo };
        }
        return step;
      })
    }));
  };

  const removeImportantInfo = (stepId, index) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId) {
          const updatedInfo = (step.importantInfo || []).filter((_, i) => i !== index);
          return { ...step, importantInfo: updatedInfo };
        }
        return step;
      })
    }));
  };

  // Progress Steps Handlers
  const addProgressStep = (stepId) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? {
              ...step,
              progressSteps: [
                ...(step.progressSteps || []),
                { label: "New Step", status: "pending", date: "" }
              ]
            }
          : step
      )
    }));
  };

  const handleProgressStepChange = (stepId, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId) {
          const updatedSteps = [...(step.progressSteps || [])];
          updatedSteps[index] = { ...updatedSteps[index], [field]: value };
          return { ...step, progressSteps: updatedSteps };
        }
        return step;
      })
    }));
  };

  const removeProgressStep = (stepId, index) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId) {
          const updatedSteps = (step.progressSteps || []).filter((_, i) => i !== index);
          return { ...step, progressSteps: updatedSteps };
        }
        return step;
      })
    }));
  };

  // Status Timeline Handlers
  const addStatusTimeline = (stepId) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? {
              ...step,
              statusTimeline: [
                ...(step.statusTimeline || []),
                { date: "", status: "", description: "" }
              ]
            }
          : step
      )
    }));
  };

  const handleStatusTimelineChange = (stepId, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId) {
          const updatedTimeline = [...(step.statusTimeline || [])];
          updatedTimeline[index] = { ...updatedTimeline[index], [field]: value };
          return { ...step, statusTimeline: updatedTimeline };
        }
        return step;
      })
    }));
  };

  const removeStatusTimeline = (stepId, index) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId) {
          const updatedTimeline = (step.statusTimeline || []).filter((_, i) => i !== index);
          return { ...step, statusTimeline: updatedTimeline };
        }
        return step;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        currentStep: formData.currentStep,
        steps: formData.steps.map(step => ({
          id: step.id,
          label: step.label,
          route: step.route,
          page: step.page,
          banner: step.banner,
          progress: step.progress || 0,
          sections: step.sections || {},
          importantInfo: step.importantInfo || [],
          progressSteps: step.progressSteps || [],
          statusTimeline: step.statusTimeline || []
        }))
      };
      
      const response = await axiosInstance.put(`/visa/${dataId}`, payload);
      
      if (response.data.success) {
        setSuccess("Visa journey data updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message || "Failed to update visa data");
      }
    } catch (error) {
      console.error("Error saving visa data:", error);
      setError(error.response?.data?.message || "An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in progress':
        return 'bg-orange-100 text-orange-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'under review by embassy':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getBannerTypeColor = (type) => {
    return type === 'success' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200';
  };

  const [currentStep, setCurrentStep] = useState([]);
  useEffect(() => {
    setCurrentStep(
      formData.steps.filter(
        ele => ele.id == formData.currentStep
      )
    );
  }, [formData.currentStep, formData.steps]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f56e45] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visa journey data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto p-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Visa Journey</h1>
              <p className="text-sm text-gray-500 mt-1">Update visa application details and step information</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 bg-[#f56e45] text-white rounded-lg hover:bg-[#e55a35] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                <input
                  type="text"
                  name="applicationId"
                  value={formData.applicationId}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Step</label>
                <select
                  name="currentStep"
                  value={formData.currentStep}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#f56e45] focus:border-[#f56e45]"
                >
                  {formData.steps.map(step => (
                    <option key={step.id} value={step.id}>Step {step.id}: {step.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800">Visa Journey Steps</h2>
            {currentStep.map((step) => (
              <StepEditor
                key={step.id}
                step={step}
                formData={formData}
                currentStep={formData.currentStep}
                visaId={dataId}
                onStepChange={handleStepChange}
                onPageChange={handleStepPageChange}
                onBannerChange={handleStepBannerChange}
                onProgressChange={handleStepProgressChange}
                onSectionDetailChange={handleSectionDetailChange}
                onAddSectionDetail={addSectionDetail}
                onRemoveSectionDetail={removeSectionDetail}
                onFileUpload={handleFileUpload}
                uploadingFile={uploadingFile}
                onAddImportantInfo={addImportantInfo}
                onImportantInfoChange={handleImportantInfoChange}
                onRemoveImportantInfo={removeImportantInfo}
                onAddProgressStep={addProgressStep}
                onProgressStepChange={handleProgressStepChange}
                onRemoveProgressStep={removeProgressStep}
                onAddStatusTimeline={addStatusTimeline}
                onStatusTimelineChange={handleStatusTimelineChange}
                onRemoveStatusTimeline={removeStatusTimeline}
                onCreateDocumentRequirement={handleCreateDocumentRequirement}
                onDocumentUpload={handleDocumentUpload}
                onDocumentDelete={handleDocumentDelete}
                onDocumentVerify={handleDocumentVerify}
                onDocumentDownload={handleDocumentDownload}
                fetchDocuments={fetchDocuments}
                uploadingDocument={uploadingDocument}
                getStatusColor={getStatusColor}
                getBannerTypeColor={getBannerTypeColor}
              />
            ))}
          </div>
        </form>
      </main>
    </div>
  );
}

// Step Editor Component
function StepEditor({ 
  step, 
  currentStep,
  formData,
  visaId,
  onStepChange, 
  onPageChange, 
  onBannerChange, 
  onProgressChange,
  onSectionDetailChange,
  onAddSectionDetail,
  onRemoveSectionDetail,
  onFileUpload,
  uploadingFile,
  onAddImportantInfo,
  onImportantInfoChange,
  onRemoveImportantInfo,
  onAddProgressStep,
  onProgressStepChange,
  onRemoveProgressStep,
  onAddStatusTimeline,
  onStatusTimelineChange,
  onRemoveStatusTimeline,
  onCreateDocumentRequirement,
  onDocumentUpload,
  onDocumentDelete,
  onDocumentVerify,
  onDocumentDownload,
  fetchDocuments,
  uploadingDocument,
  getStatusColor,
  getBannerTypeColor
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [newDocumentType, setNewDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectDocumentData, setRejectDocumentData] = useState({ documentId: null, documentType: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [description, setDescription] = useState('');
  const [isRequired, setIsRequired] = useState(true);

  const statusOptions = ["Pending", "In Progress", "Completed", "Approved", "Scheduled", "Under Review by Embassy"];
  const bannerTypeOptions = ["info", "success"];
  const importantInfoTypeOptions = ["info", "warning", "success", "requirement"];

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDocumentUpload = async () => {
    if (!newDocumentType) {
      alert('Please select document type');
      return;
    }

    const success = await onDocumentUpload(
      newDocumentType, 
      selectedFile, 
      description, 
      isRequired
    );
    
    if (success) {
      resetDocumentForm();
      fetchDocuments(); // Refresh the documents list
    }
  };

  const resetDocumentForm = () => {
    setNewDocumentType('');
    setSelectedFile(null);
    setDescription('');
    setIsRequired(true);
    const fileInput = document.getElementById(`doc-upload-${step.id}`);
    if (fileInput) fileInput.value = '';
  };

  const handleDeleteDocument = async (documentId, documentType) => {
    await onDocumentDelete(documentId, documentType);
  };

  const handleVerifyDocument = async (documentId, documentType, status) => {
    if (status === 'rejected' && !rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }
    await onDocumentVerify(documentId, status, rejectionReason);
    setRejectModalOpen(false);
    setRejectionReason('');
    setRejectDocumentData({ documentId: null, documentType: null });
  };

  const showRejectModal = (documentId, documentType) => {
    setRejectDocumentData({ documentId, documentType });
    setRejectModalOpen(true);
  };

  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'uploaded':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getImportantInfoTypeClass = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'success': return 'bg-green-50 border-green-200 text-green-700';
      case 'danger': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  const getProgressStepStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Step Header */}
      <div 
        className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step.id === 1 ? 'bg-orange-100' :
            step.id === 2 ? 'bg-green-100' :
            step.id === 3 ? 'bg-blue-100' :
            step.id === 4 ? 'bg-purple-100' :
            step.id === 5 ? 'bg-yellow-100' : 'bg-teal-100'
          }`}>
            <span className="text-sm font-bold">{step.id}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{step.label}</h3>
            <p className="text-sm text-gray-500">Route: {step.route}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm px-2 py-1 rounded ${getStatusColor(step.page?.status)}`}>
            {step.page?.status || "Pending"}
          </span>
          {step.progress !== undefined && (
            <span className="text-sm text-gray-500">Progress: {step.progress}%</span>
          )}
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Step Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b pb-2 flex-wrap">
            {['basic', 'page', 'banner', 'sections', 'importantInfo', 'progressSteps', 'statusTimeline', 'documents'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#f56e45] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'importantInfo' ? 'Important Info' : 
                 tab === 'progressSteps' ? 'Progress Steps' : 
                 tab === 'statusTimeline' ? 'Status Timeline' :
                 tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Step ID</label>
                <input
                  type="number"
                  value={step.id}
                  onChange={(e) => onStepChange(step.id, "id", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <input
                  type="text"
                  value={step.route}
                  onChange={(e) => onStepChange(step.id, "route", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={step.label}
                  onChange={(e) => onStepChange(step.id, "label", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                <input
                  type="number"
                  value={step.progress || 0}
                  onChange={(e) => onProgressChange(step.id, e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          {/* Page Information Tab */}
          {activeTab === 'page' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={step.page?.title || ""}
                  onChange={(e) => onPageChange(step.id, "title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Status</label>
                <select
                  value={step.page?.status || "Pending"}
                  onChange={(e) => onPageChange(step.id, "status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={step.page?.subtitle || ""}
                  onChange={(e) => onPageChange(step.id, "subtitle", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          {/* Banner Information Tab */}
          {activeTab === 'banner' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
                  <select
                    value={step.banner?.type || "info"}
                    onChange={(e) => onBannerChange(step.id, "type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {bannerTypeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={step.banner?.title || ""}
                    onChange={(e) => onBannerChange(step.id, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Subtitle</label>
                  <input
                    type="text"
                    value={step.banner?.subtitle || ""}
                    onChange={(e) => onBannerChange(step.id, "subtitle", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Action Text</label>
                  <input
                    type="text"
                    value={step.banner?.action || ""}
                    onChange={(e) => onBannerChange(step.id, "action", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Upload (Optional)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) => onFileUpload(step.id, e.target.files[0])}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      id={`file-upload-${step.id}`}
                    />
                    <label
                      htmlFor={`file-upload-${step.id}`}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-200"
                    >
                      <UploadCloud size={16} />
                      Choose File
                    </label>
                    {uploadingFile.stepId === step.id && uploadingFile.isUploading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f56e45]"></div>
                    )}
                  </div>
                  {step.banner?.fileName && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Uploaded: {step.banner.fileName}
                    </p>
                  )}
                  {step.banner?.fileUrl && (
                    <a
                      href={fileBaseurl(step.banner.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <LinkIcon size={12} />
                      View Uploaded File
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sections Overview Details Tab */}
          {activeTab === 'sections' && step.sections?.overview?.details && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <Info size={16} /> Overview Details
                </h4>
                <button
                  type="button"
                  onClick={() => onAddSectionDetail(step.id, "overview")}
                  className="text-sm text-[#f56e45] hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add Detail
                </button>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {step.sections.overview.details.map((detail, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={detail.label}
                        onChange={(e) => onSectionDetailChange(step.id, "overview", idx, "label", e.target.value)}
                        placeholder="Label"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={detail.value}
                        onChange={(e) => onSectionDetailChange(step.id, "overview", idx, "value", e.target.value)}
                        placeholder="Value"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={detail.highlight || false}
                          onChange={(e) => onSectionDetailChange(step.id, "overview", idx, "highlight", e.target.checked)}
                        />
                        Highlight
                      </label>
                      <button
                        type="button"
                        onClick={() => onRemoveSectionDetail(step.id, "overview", idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Info Tab */}
          {activeTab === 'importantInfo' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <AlertCircle size={16} /> Important Information
                </h4>
                <button
                  type="button"
                  onClick={() => onAddImportantInfo(step.id)}
                  className="text-sm text-[#f56e45] hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add Info
                </button>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {(step.importantInfo || []).map((info, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${getImportantInfoTypeClass(info.type)}`}>
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={info.title || ""}
                          onChange={(e) => onImportantInfoChange(step.id, idx, "title", e.target.value)}
                          placeholder="Title"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                        />
                        <input
                          type="text"
                          value={info.description || ""}
                          onChange={(e) => onImportantInfoChange(step.id, idx, "description", e.target.value)}
                          placeholder="Description"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white md:col-span-1"
                        />
                        <select
                          value={info.type || "info"}
                          onChange={(e) => onImportantInfoChange(step.id, idx, "type", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                        >
                          {importantInfoTypeOptions.map(opt => (
                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveImportantInfo(step.id, idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {(!step.importantInfo || step.importantInfo.length === 0) && (
                  <div className="text-center text-gray-400 py-3 text-sm">
                    No important information added. Click "Add Info" to add.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Steps Tab */}
          {activeTab === 'progressSteps' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <CheckCircle size={16} /> Progress Steps
                </h4>
                <button
                  type="button"
                  onClick={() => onAddProgressStep(step.id)}
                  className="text-sm text-[#f56e45] hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add Step
                </button>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {(step.progressSteps || []).map((progressStep, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={progressStep.label || ""}
                          onChange={(e) => onProgressStepChange(step.id, idx, "label", e.target.value)}
                          placeholder="Step Label"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <select
                          value={progressStep.status || "pending"}
                          onChange={(e) => onProgressStepChange(step.id, idx, "status", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <input
                          type="date"
                          value={progressStep.date || ""}
                          onChange={(e) => onProgressStepChange(step.id, idx, "date", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveProgressStep(step.id, idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {progressStep.status && (
                      <div className="mt-2">
                        <span className={`text-sm px-2 py-0.5 rounded ${getProgressStepStatusClass(progressStep.status)}`}>
                          {progressStep.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {(!step.progressSteps || step.progressSteps.length === 0) && (
                  <div className="text-center text-gray-400 py-3 text-sm">
                    No progress steps added. Click "Add Step" to add.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Timeline Tab */}
          {activeTab === 'statusTimeline' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <Clock size={16} /> Status Timeline
                </h4>
                <button
                  type="button"
                  onClick={() => onAddStatusTimeline(step.id)}
                  className="text-sm text-[#f56e45] hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add Event
                </button>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {(step.statusTimeline || []).map((event, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="date"
                          value={event.date || ""}
                          onChange={(e) => onStatusTimelineChange(step.id, idx, "date", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <select
                          value={event.status || ""}
                          onChange={(e) => onStatusTimelineChange(step.id, idx, "status", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select Status</option>
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={event.description || ""}
                          onChange={(e) => onStatusTimelineChange(step.id, idx, "description", e.target.value)}
                          placeholder="Description"
                          className="px-2 py-1 border border-gray-300 rounded text-sm md:col-span-1"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveStatusTimeline(step.id, idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {event.status && (
                      <div className="mt-2">
                        <span className={`text-sm px-2 py-0.5 rounded ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {(!step.statusTimeline || step.statusTimeline.length === 0) && (
                  <div className="text-center text-gray-400 py-3 text-sm">
                    No timeline events added. Click "Add Event" to add.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab - Updated with proper API integration */}
          {activeTab === 'documents' && (
            <div>
              {/* Upload New Document Section */}
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h5 className="text-sm font-medium text-gray-800 mb-3">Add Document Requirement</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Document Type (e.g., Passport, Visa Letter, APS Certificate)"
                      value={newDocumentType}
                      onChange={(e) => setNewDocumentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <textarea
                      placeholder="Description (e.g., Scanned copy of the first and last page)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={isRequired}
                        onChange={(e) => setIsRequired(e.target.checked)}
                        className="rounded border-gray-300 text-[#f56e45] focus:ring-[#f56e45]"
                      />
                      Required Document
                    </label>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileSelect}
                      id={`doc-upload-${step.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm file:mr-2 file:px-3 file:py-1 file:bg-orange-50 file:border file:border-orange-300 file:text-orange-600 file:text-sm file:rounded hover:file:bg-orange-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional: Upload file if available</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleDocumentUpload}
                    disabled={!newDocumentType || uploadingDocument}
                    className="px-4 py-2 bg-[#f56e45] text-white text-sm rounded hover:bg-[#e55a35] transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploadingDocument ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {selectedFile ? (
                          <><UploadCloud size={16} /> Upload Document with File</>
                        ) : (
                          <><Plus size={16} /> Create Document Requirement</>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={14} /> Document Requirements & Uploads
                </h5>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {(formData.documents || []).length === 0 ? (
                    <div className="text-center text-gray-400 py-6 text-sm bg-gray-50 rounded-lg">
                      No document requirements added yet
                    </div>
                  ) : (
                    formData.documents.map((doc, idx) => (
                      <div key={doc._id || idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={16} className="text-[#f56e45]" />
                              <h6 className="font-medium text-gray-800">{doc.documentType}</h6>
                              {doc.isRequired && (
                                <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                                  Required
                                </span>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded ${getDocumentStatusBadge(doc.status)}`}>
                                {doc.status || (doc.fileUrl ? 'uploaded' : 'pending')}
                              </span>
                            </div>
                            
                            {doc.description && (
                              <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Document Type</p>
                                <p className="text-gray-700">{doc.documentType}</p>
                              </div>
                              {doc.fileName && (
                                <div>
                                  <p className="text-xs text-gray-500">File Name</p>
                                  <p className="text-gray-700">{doc.fileName}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-gray-500">Last Updated</p>
                                <p className="text-gray-700">
                                  {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 
                                   doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>

                            {doc.rejectionReason && (
                              <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                                <p className="text-xs text-red-600 font-medium">Rejection Reason:</p>
                                <p className="text-sm text-red-700">{doc.rejectionReason}</p>
                              </div>
                            )}

                            <div className="mt-3 flex gap-2 flex-wrap">
                              {doc.fileUrl && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => onDocumentDownload(doc.fileUrl, doc.fileName)}
                                    className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100 transition flex items-center gap-1"
                                  >
                                    <Download size={12} /> Download
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => window.open(fileBaseurl(doc.fileUrl), '_blank')}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100 transition flex items-center gap-1"
                                  >
                                    <Eye size={12} /> View
                                  </button>
                                </>
                              )}
                              {/* {doc.status !== 'verified' && doc.fileUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyDocument(doc._id, doc.documentType, 'verified')}
                                  className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100 transition flex items-center gap-1"
                                >
                                  <CheckCircle2 size={12} /> Verify
                                </button>
                              )}
                              {doc.status !== 'rejected' && doc.status !== 'verified' && doc.fileUrl && (
                                <button
                                  type="button"
                                  onClick={() => showRejectModal(doc._id, doc.documentType)}
                                  className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded hover:bg-red-100 transition flex items-center gap-1"
                                >
                                  <XCircle size={12} /> Reject
                                </button>
                              )} */}
                              <button
                                type="button"
                                onClick={() => handleDeleteDocument(doc._id, doc.documentType)}
                                className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded hover:bg-gray-100 transition flex items-center gap-1"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Eye size={16} /> Preview
            </h4>
            <div className={`p-4 rounded-lg ${getBannerTypeColor(step.banner?.type)} border`}>
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-1 ${step.banner?.type === 'success' ? 'bg-green-600' : 'bg-orange-600'}`}>
                  <CheckCircle size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{step.banner?.title || "No banner title"}</h4>
                  <p className="text-sm mt-0.5">{step.banner?.subtitle || "No banner subtitle"}</p>
                  {step.banner?.fileUrl && (
                    <a
                      href={fileBaseurl(step.banner.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                    >
                      <Download size={12} />
                      Download Attached File
                    </a>
                  )}
                </div>
                {step.banner?.action && (
                  <button className="text-sm font-medium text-[#f56e45] bg-white px-3 py-1 rounded border border-orange-200">
                    {step.banner.action}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span> {step.page?.status || "Pending"}
              </p>
              {step.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{step.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#f56e45] h-1.5 rounded-full" style={{ width: `${step.progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Reject Document</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please provide a reason for rejecting this document:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectionReason('');
                  setRejectDocumentData({ documentId: null, documentType: null });
                }}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifyDocument(rejectDocumentData.documentId, rejectDocumentData.documentType, 'rejected')}
                disabled={!rejectionReason}
                className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:bg-gray-300"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}








