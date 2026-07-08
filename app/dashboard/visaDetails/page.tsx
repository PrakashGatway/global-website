// app/visa-processing/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Filter, Eye, Edit3, Download, ChevronDown, ChevronUp,
  User, FileText, Calendar, Building2, Globe, Briefcase, Clock,
  CreditCard, CheckCircle, AlertCircle, Clock as ClockIcon,
  MapPin, Phone, Mail, MessageCircle, Shield, Award, BookOpen,
  HelpCircle, X, Check, AlertTriangle, FileCheck, GraduationCap,
  TrendingUp, Users, CheckSquare, FileSignature, Home, ArrowRight,
  ExternalLink, MoreVertical, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/app/axiosInstance';

export default function VisaProcessingListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [visaApplications, setVisaApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    approved: 0,
    pending: 0
  });


  useEffect(() => {
    filterAndSortApplications();
  }, [visaApplications, searchTerm, statusFilter, countryFilter, sortBy, sortOrder]);

  const fetchVisaApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/visa/counsellor');
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setVisaApplications(response.data.data);
        calculateStats(response.data.data);
      } else if (response.data.success && response.data.data) {
        // Handle case where data is a single object
        const dataArray = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        setVisaApplications(dataArray);
        calculateStats(dataArray);
      } else {
        setVisaApplications([]);
      }
    } catch (error) {
      console.error("Error fetching visa applications:", error);
      setVisaApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisaApplications();
  }, []);

  const calculateStats = (applications) => {
    const total = applications.length;
    const inProgress = applications.filter(app => {
      const currentStep = app.currentStep || 1;
      return currentStep < 6 && app.steps?.[currentStep - 1]?.page?.status !== 'Completed';
    }).length;
    const completed = applications.filter(app => {
      const currentStep = app.currentStep || 1;
      return currentStep === 6 || app.steps?.find(s => s.id === 6)?.page?.status === 'Approved';
    }).length;
    const approved = applications.filter(app => 
      app.steps?.find(s => s.id === 6)?.page?.status === 'Approved'
    ).length;
    const pending = applications.filter(app => {
      const currentStep = app.currentStep || 1;
      return currentStep === 1 && app.steps?.[0]?.page?.status === 'In Progress';
    }).length;

    setStats({ total, inProgress, completed, approved, pending });
  };

  const filterAndSortApplications = () => {
    let filtered = [...visaApplications];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.course?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => {
        const currentStep = app.currentStep || 1;
        const stepStatus = app.steps?.[currentStep - 1]?.page?.status || 'Pending';
        
        switch (statusFilter) {
          case 'in-progress':
            return currentStep < 6 && stepStatus !== 'Completed' && stepStatus !== 'Approved';
          case 'completed':
            return currentStep === 6 || stepStatus === 'Approved';
          case 'approved':
            return app.steps?.find(s => s.id === 6)?.page?.status === 'Approved';
          case 'pending':
            return currentStep === 1 && stepStatus === 'In Progress';
          default:
            return true;
        }
      });
    }

    // Apply country filter
    if (countryFilter !== 'all') {
      filtered = filtered.filter(app => app.country === countryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'step':
          aValue = a.currentStep || 1;
          bValue = b.currentStep || 1;
          break;
        case 'progress':
          const aStep = a.steps?.find(s => s.id === (a.currentStep || 1));
          const bStep = b.steps?.find(s => s.id === (b.currentStep || 1));
          aValue = aStep?.progress || 0;
          bValue = bStep?.progress || 0;
          break;
        case 'applicationId':
          aValue = a.applicationId || '';
          bValue = b.applicationId || '';
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredApplications(filtered);
  };

  const getCurrentStepStatus = (application) => {
    const currentStep = application.currentStep || 1;
    const step = application.steps?.find(s => s.id === currentStep);
    return {
      stepId: currentStep,
      label: step?.label || `Step ${currentStep}`,
      status: step?.page?.status || 'Pending',
      progress: step?.progress || 0,
      route: step?.route || ''
    };
  };

  const getStepColor = (stepId) => {
    const colors = {
      1: 'bg-orange-100 text-orange-700',
      2: 'bg-green-100 text-green-700',
      3: 'bg-blue-100 text-blue-700',
      4: 'bg-purple-100 text-purple-700',
      5: 'bg-yellow-100 text-yellow-700',
      6: 'bg-teal-100 text-teal-700'
    };
    return colors[stepId] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
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

  const getUniqueCountries = () => {
    const countries = new Set();
    visaApplications.forEach(app => {
      if (app.country) countries.add(app.country);
    });
    return Array.from(countries);
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const handleEdit = (applicationId) => {
    router.push(`/dashboard/visaDetails/${applicationId}`);
  };

  const handleViewJourney = (applicationId) => {
    router.push(`/visa-journey`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin -full h-12 w-12 border-b-2 border-[#f56e45] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visa applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <main className="max-w-[1600px] mx-auto p-4 ">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visa Processing Applications</h1>
              <p className="text-sm text-gray-500 mt-1">Track and manage all student visa applications</p>
            </div>
            <button
              onClick={fetchVisaApplications}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 -lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white -xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 -full flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white -xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 -full flex items-center justify-center">
                <ClockIcon size={20} className="text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white -xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 -full flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white -xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Visa Approved</p>
                <p className="text-2xl font-bold text-teal-600">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 bg-teal-100 -full flex items-center justify-center">
                <Award size={20} className="text-teal-600" />
              </div>
            </div>
          </div>
          {/* <div className="bg-white -xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Pending APS</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 -full flex items-center justify-center">
                <AlertCircle size={20} className="text-yellow-600" />
              </div>
            </div>
          </div> */}
        </div>

        {/* Filters */}
        <div className="bg-white -xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Application ID, Country, Course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 -lg text-sm focus:ring-[#f56e45] focus:border-[#f56e45]"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 -lg text-sm focus:ring-[#f56e45] focus:border-[#f56e45]"
              >
                <option value="all">All Status</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="approved">Visa Approved</option>
                <option value="pending">Pending APS</option>
              </select>
            </div>
            <div>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 -lg text-sm focus:ring-[#f56e45] focus:border-[#f56e45]"
              >
                <option value="all">All Countries</option>
                {getUniqueCountries().map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 -lg text-sm focus:ring-[#f56e45] focus:border-[#f56e45]"
              >
                <option value="date">Sort by Date</option>
                <option value="step">Sort by Step</option>
                <option value="progress">Sort by Progress</option>
                <option value="applicationId">Sort by Application ID</option>
              </select>
              {/* <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 -lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button> */}
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white -xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-500 text-white border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Application ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Current Step</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold ">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold ">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No visa applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const currentStatus = getCurrentStepStatus(app);
                    return (
                      <tr key={app._id} onClick={() => handleEdit(app._id)} className="coursor-pointer hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-800">{app.applicationId || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Globe size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{app.country || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <GraduationCap size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700 max-w-[200px] truncate">
                              {app.course?.name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 -full ${getStepColor(currentStatus.stepId)}`}>
                            {currentStatus.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 -full ${getStatusBadgeColor(currentStatus.status)}`}>
                            {currentStatus.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[100px]">
                              <div className="w-full bg-gray-200 -full h-1.5">
                                <div 
                                  className="bg-[#f56e45] h-1.5 -full" 
                                  style={{ width: `${currentStatus.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{currentStatus.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500">{formatDate(app.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* <button
                              onClick={() => handleViewDetails(app)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 -lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleViewJourney(app._id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 -lg transition-colors"
                              title="View Journey"
                            >
                              <ExternalLink size={16} />
                            </button> */}
                            <button
                              onClick={() => handleEdit(app._id)}
                              className="p-1.5 flex gap-1 items-center text-orange-600 hover:bg-orange-50 -lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={16} /> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Showing {filteredApplications.length} of {visaApplications.length} applications
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <DetailModal
          application={selectedApplication}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => handleEdit(selectedApplication._id)}
          onViewJourney={() => handleViewJourney(selectedApplication._id)}
          getStepColor={getStepColor}
          getStatusBadgeColor={getStatusBadgeColor}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

// Detail Modal Component
function DetailModal({ application, onClose, onEdit, onViewJourney, getStepColor, getStatusBadgeColor, formatDate }) {
  const currentStatus = {
    stepId: application.currentStep || 1,
    label: application.steps?.find(s => s.id === (application.currentStep || 1))?.label || `Step ${application.currentStep || 1}`,
    status: application.steps?.find(s => s.id === (application.currentStep || 1))?.page?.status || 'Pending',
    progress: application.steps?.find(s => s.id === (application.currentStep || 1))?.progress || 0
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white -xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 -lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Application ID</label>
              <p className="text-sm font-medium text-gray-800">{application.applicationId || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Country</label>
              <p className="text-sm font-medium text-gray-800">{application.country || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Course</label>
              <p className="text-sm font-medium text-gray-800">{application.course?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Created At</label>
              <p className="text-sm font-medium text-gray-800">{formatDate(application.createdAt)}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Last Updated</label>
              <p className="text-sm font-medium text-gray-800">{formatDate(application.updatedAt)}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Current Step</label>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 -full ${getStepColor(currentStatus.stepId)}`}>
                  {currentStatus.label}
                </span>
              </div>
            </div>
          </div>

          {/* Application Status */}
          {application.application && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Application Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Primary Status</label>
                  <p className="text-sm font-medium text-gray-800">
                    <span className={`text-xs px-2 py-1 -full ${getStatusBadgeColor(application.application.primaryStatus)}`}>
                      {application.application.primaryStatus}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Payment Status</label>
                  <p className="text-sm font-medium text-gray-800">{application.application.paymentStatus}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Intake</label>
                  <p className="text-sm font-medium text-gray-800">{application.application.intake || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Visa Shortlisted</label>
                  <p className="text-sm font-medium text-gray-800">
                    {application.application.isVisashortlist ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Documents Summary */}
          {application.application?.documents && application.application.documents.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Required Documents</h3>
              <div className="space-y-2">
                {application.application.documents.slice(0, 5).map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{doc.name}</span>
                    <span className={`text-xs px-2 py-0.5 -full ${
                      doc.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
                {application.application.documents.length > 5 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{application.application.documents.length - 5} more documents
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Steps Progress */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Visa Journey Steps</h3>
            <div className="space-y-2">
              {application.steps?.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 -full flex items-center justify-center ${getStepColor(step.id)}`}>
                    <span className="text-xs font-bold">{step.id}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{step.label}</span>
                      <span className={`text-xs px-2 py-0.5 -full ${getStatusBadgeColor(step.page?.status)}`}>
                        {step.page?.status || 'Pending'}
                      </span>
                    </div>
                    {step.progress > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 max-w-[200px]">
                          <div className="w-full bg-gray-200 -full h-1">
                            <div className="bg-[#f56e45] h-1 -full" style={{ width: `${step.progress}%` }}></div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{step.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 -lg text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={onViewJourney}
            className="px-4 py-2 bg-green-600 text-white -lg hover:bg-green-700"
          >
            View Full Journey
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-[#f56e45] text-white -lg hover:bg-[#e55a35]"
          >
            Edit Application
          </button>
        </div>
      </div>
    </div>
  );
}

