// app/visa-journey/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Bell, HelpCircle, ChevronDown, CheckCircle2, Download,
  FileText, User, MapPin, Calendar, Building2, ArrowRight, Eye,
  Shield, Clock, CheckCircle, AlertCircle, Phone, Mail, MessageCircle,
  Settings, CreditCard, FileCheck, Lock, Briefcase, GraduationCap,
  Globe, Edit3, UploadCloud, X, Trash2, Info, PlayCircle, Video,
  Home, Plane, Heart, BookOpen as BookOpenIcon, Check, AlertTriangle,
  Fingerprint, Camera, CreditCard as CreditCardIcon, Map as MapIcon,
  Calendar as CalendarIcon, FileOutput, Clock as ClockIcon, CheckCheck,
  RefreshCw, EyeOff, ThumbsUp, Search, FileSearch, FileSignature,
  FileDigit, FileBox, Award, Ticket, Bookmark, ShieldIcon, Files,
  FileInput, FileClock, CheckCheckIcon, Sparkles, Star, LayoutDashboard,
  LinkIcon, Edit, Send
} from 'lucide-react';
import axiosInstance, { fileBaseurl } from '@/app/axiosInstance';
import { useRouter } from 'next/navigation';

const iconMap = {
  User: User, FileText: FileText, FileCheck: FileCheck, Globe: Globe,
  Calendar: Calendar, CheckCircle: CheckCircle, Building2: Building2,
  Shield: Shield, Clock: Clock, CheckCircle2: CheckCircle2, HelpCircle: HelpCircle,
  AlertCircle: AlertCircle, ThumbsUp: ThumbsUp, Download: Download,
  Briefcase: Briefcase, CreditCard: CreditCard, Edit3: Edit3, UploadCloud: UploadCloud,
  Eye: Eye, Trash2: Trash2, Info: Info, PlayCircle: PlayCircle, Video: Video,
  Home: Home, Plane: Plane, Heart: Heart, GraduationCap: GraduationCap,
  Camera: Camera, MapPin: MapPin, Phone: Phone, Mail: Mail, Fingerprint: Fingerprint,
  FileOutput: FileOutput, RefreshCw: RefreshCw, EyeOff: EyeOff, FileSearch: FileSearch,
  FileSignature: FileSignature, FileDigit: FileDigit, FileBox: FileBox, Search: Search,
  CheckCheck: CheckCheck, Award: Award, Ticket: Ticket, CheckCheckIcon: CheckCheckIcon,
  BookOpen: BookOpen, MessageCircle: MessageCircle, Lock: Lock, Bookmark: Bookmark,
  LayoutDashboard: LayoutDashboard
};

const ProgressStep = ({ step, index, total, currentStepId, onStepClick }) => {
  const isLast = index === total - 1;
  const isActive = step.id === currentStepId;
  
  let circleBg = 'bg-gray-200';
  let lineBg = 'bg-gray-200';
  let labelColor = 'text-gray-500';
  let status = 'locked';
  const stepIcons = {
    1: {
      active: "/icons/approval.png",
      inactive: "/icons/approva 2.png",
    },
    2: {
      active: "/icons/approval.png",
      inactive: "/icons/approva 2.png",
    },
    3: {
      active: "/icons/visa.png",
      inactive: "/icons/visa 2.png",
    },
    4: {
      active: "/icons/biomatric.png",
      inactive: "/icons/biomatric 2.png",
    },
    5: {
      active: "/icons/descision.png",
      inactive: "/icons/descision 2.png",
    },
    6: {
      active: "/icons/visa approved.png",
      inactive: "/icons/visa approved 2.png",
    },
  };
    
  if (step.page?.status === 'Completed' || step.status === 'Completed') {
    status = 'completed';
    circleBg = 'bg-green-500';
    lineBg = 'bg-green-500';
    labelColor = 'text-green-600';
  } else if (isActive) {
    status = 'active';
    circleBg = 'bg-[#f56e45]';
    lineBg = 'bg-[#f56e45]';
    labelColor = 'text-[#f56e45]';
  }

  return (
    <div 
      className="flex flex-col items-center relative flex-1 min-w-[80px] cursor-pointer opacity-80 transition-opacity"
      onClick={() => onStepClick(step.id)}
    >
      {!isLast && (
        <div className={`absolute top-7 left-[60%] w-full h-[2px] -z-10 ${lineBg}`}></div>
      )}

      <div className={`w-14 h-14 rounded-full p-3 flex items-center justify-center z-10 border-2 ${isActive || status === 'completed' ? 'border-green-500 bg-white' : 'border-gray-300 bg-white'}`}>
        <img
          src={
            status === "completed" || isActive
              ? stepIcons[step.id]?.active
              : stepIcons[step.id]?.inactive
          }
          alt={step.label}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="mt-2 text-center">
        <div className={`text-sm font-bold ${labelColor}`}>{step.label}</div>
        <div className={`text-sm font-medium mt-1 ${labelColor}`}>
          {status === 'completed' ? 'Completed' : isActive ? 'In Progress' : 'Upcoming'}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ item }) => {
  const IconComponent = iconMap[item.icon] || FileText;
  return (
    <div className="flex items-start gap-2">
      <div className="p-1.5 bg-gray-50 flex-shrink-0">
        <IconComponent size={14} className="text-gray-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{item.label}</p>
        <p className={`text-sm font-medium ${item.isHighlight ? 'text-green-600' : 'text-gray-800'}`}>
          {item.isFlag ? <span className="flex items-center gap-1"><span>🇩🇪</span> {item.value || "--"}</span> : item.value || "--"}
        </p>
      </div>
    </div>
  );
};

const DocumentRow = ({ row, showSize = true }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center py-2 border-b border-gray-50 last:border-0 gap-1">
    <div className="flex items-center gap-2 flex-1">
      <FileText size={12} className="text-gray-500" />
      <span className="text-sm text-gray-700">{row.documentType || row.name}</span>
    </div>
    <div className="flex items-center gap-3 sm:gap-4 text-sm">
      <span className={`px-2 py-0.5 rounded ${
        row.status === 'uploaded' || row.status === 'Completed' || row.status === 'Approved' || row.status === 'Verified'
          ? 'text-green-600 bg-green-50' 
          : row.status === 'pending' || row.status === 'In Progress'
          ? 'text-yellow-600 bg-yellow-50'
          : 'text-orange-500 bg-orange-50'
      }`}>
        {row.status}
      </span>
      <span className="text-gray-400">{row.uploadedAt || row.date || '--'}</span>
      {showSize && <span className="text-gray-400">{row.size || '-'}</span>}
      <span className="text-gray-400">{row.remarks || '--'}</span>
    </div>
  </div>
);

const QuickLinkItem = ({ item }) => {
  const IconComponent = iconMap[item.icon] || HelpCircle;
  return (
    <div className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded">
      <div className="flex items-center gap-2">
        <div className="p-1 bg-gray-50 rounded-full">
          <IconComponent size={10} className="text-gray-500" />
        </div>
        <span className="text-sm text-gray-600">{item.text}</span>
      </div>
      <ChevronDown size={10} className="text-gray-400 -rotate-90" />
    </div>
  );
};

const Step1APSApplied = ({ data, currentStepId, apiData, visaId }) => {
  const stepData = apiData?.steps?.find(s => s.id === 1);
  const router = useRouter();
  const [uploadingDocs, setUploadingDocs] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState({});

  useEffect(() => {
    if (visaId) {
      fetchUploadedDocuments();
    }
  }, [visaId]);

  const fetchUploadedDocuments = async () => {
    try {
      const response = await axiosInstance.get(`/visa/${visaId}/documents`);
      const docs = response.data.data.requirements;
      const docsMap = {};
      docs.forEach(doc => {
        docsMap[doc.documentType] = doc;
      });
      setUploadedDocs(docsMap);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const handleFileChange = async (e, documentTitle) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      console.error("File size should be less than 5MB");
      return;
    }
    
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      console.error("Invalid file type. Please upload PDF, JPG, PNG, or DOC files.");
      return;
    }

    setUploadingDocs(prev => ({ ...prev, [documentTitle]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentTitle);
      formData.append("visaId", visaId);

      const uploadResponse = await axiosInstance.post("/visa/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    } catch (error) {
      console.error(error.message || "Failed to upload file");
    } finally {
      setUploadingDocs(prev => ({ ...prev, [documentTitle]: false }));
    }
  };

  const handleViewDocument = async (documentTitle) => {
    const doc = uploadedDocs[documentTitle];
    if (doc && doc.fileUrl) {
      window.open(fileBaseurl(doc.fileUrl), '_blank');
    }
  };

  const getDocumentStatus = (documentTitle) => {
    if (uploadedDocs[documentTitle]) {
      return { status: "Uploaded", color: "bg-green-500", action: "View" };
    }
    if (uploadingDocs[documentTitle]) {
      return { status: "Uploading...", color: "bg-yellow-500", action: "Uploading" };
    }
    return { status: "Pending", color: "bg-orange-400", action: "Upload" };
  };

  return (
    <>
      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData?.sections?.overview?.title || "Application Overview"}</h3>
          <span className="text-sm text-gray-500">Updated: {stepData?.sections?.overview?.updated || "Just now"}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details || []).map((detail, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-500">{detail.label}</p>
              <p className={`text-sm font-medium ${detail.highlight ? 'text-[#f56e45]' : 'text-gray-800'}`}>
                {detail.value || "--"}
              </p>
            </div>
          ))}
        </div>
        {stepData?.progress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Application Progress</span>
              <span>{stepData.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#f56e45] h-2 rounded-full" style={{ width: `${stepData.progress}%` }}></div>
            </div>
          </div>
        )}
        <div className="mt-4 bg-orange-50 p-3 rounded border border-orange-100 flex items-center gap-2">
          <div className="bg-[#f56e45] rounded-full p-1">
            <CheckCircle2 size={12} className="text-white" />
          </div>
          <span className="text-sm text-orange-800">Once your APS is approved, you will be able to start your Visa Application.</span>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-2">What is APS Certificate?</h3>
        <p className="text-sm text-gray-500 mb-4">The Academic Evaluation Centre (APS) certificate verifies the authenticity of your academic documents for studying in Germany.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "FileCheck", text: "Document Verification" },
            { icon: "Shield", text: "Authenticity Check" },
            { icon: "Clock", text: "4-6 Weeks Process" },
            { icon: "GraduationCap", text: "Required for Visa" }
          ].map((item, idx) => {
            const IconComp = iconMap[item.icon] || HelpCircle;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3 border hover:bg-gray-50 transition-colors">
                <IconComp className="text-[#f56e45] mb-1" size={20} />
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden -sm">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-5 border-b border-orange-200">
          <h3 className="text-lg font-bold text-gray-800">Prepare for Visa Application</h3>
          <p className="text-sm text-gray-600 mt-1">Complete these steps while waiting for your APS result.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "FileText", title: "Blocked Account", desc: "Open a blocked account for your living expenses in Germany.", btnText: "Learn More", bg:"bg-[#f7faff]" },
              { icon: "Shield", title: "Health Insurance", desc: "Get mandatory health insurance for your student visa.", btnText: "Compare Plans", bg:"bg-[#f5faf9]" },
              { icon: "Building2", title: "Visa Appointment", desc: "Book your visa appointment at the German embassy.", btnText: "Check Slots", bg:"bg-[#fffcfa]" },
              { icon: "Home", title: "Accommodation", desc: "Find student housing in your university city.", btnText: "Search Now", bg:"bg-[#faf7fc]" }
            ].map((card, idx) => {
              const IconComp = iconMap[card.icon] || HelpCircle;
              return (
                <div key={idx} className={`group ${card.bg} border border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:-md transition-all duration-200`}>
                  <div className="w-12 h-12 bg-orange-50 flex items-center justify-center mb-4">
                    <IconComp className="text-orange-500" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{card.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="px-6 py-5">
            <h3 className="text-lg font-bold text-gray-800 mb-5">Important Details for Visa Application</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(stepData?.importantInfo || []).map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">{item.title}</p>
                  <p className="text-sm font-medium text-gray-800 break-words">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Required Documents for APS</h3>
          <button className="text-[#f56e45] text-sm font-bold bg-orange-50 px-3 py-1 rounded" onClick={() => router.push('/dashboard/settings')}>
            View All Documents →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {(apiData?.documents || []).map((item, idx) => {
            const docStatus = getDocumentStatus(item.documentType);
            const isUploaded = item.status === "uploaded";
            const isUploading = docStatus.status === "Uploading...";
            
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Required Document</p>
                    <p className="text-sm font-medium text-gray-800 break-words">{item.documentType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${docStatus.color}`}></div>
                    <span className="text-xs text-gray-500">{item.status}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{item.description || "No description"}</p>
                <div className="mt-4">
                  {!isUploaded ? (
                    <>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" id={`file-upload-${item.documentType}`} onChange={(e) => handleFileChange(e, item.documentType)} disabled={isUploading} />
                      <label htmlFor={`file-upload-${item.documentType}`} className={`flex items-center justify-center gap-2 w-full px-3 py-2 border border-dashed text-sm cursor-pointer transition ${isUploading ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100'}`}>
                        <UploadCloud size={16} />
                        {isUploading ? 'Uploading...' : 'Upload Document'}
                      </label>
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => handleViewDocument(item.documentType)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 border border-green-300 text-sm text-green-600 hover:bg-green-100 transition">
                        <FileText size={16} /> View Document
                      </button>
                    </div>
                  )}
                </div>
                {isUploaded && uploadedDocs[item.documentType] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Uploaded: {new Date(uploadedDocs[item.documentType].uploadedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">Size: {(uploadedDocs[item.documentType].fileSize / 1024).toFixed(2)} KB</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const Step2APSApproval = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 2);
  const router = useRouter();
  
  return (
    <>
      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData?.sections?.overview?.title || "APS Certificate Details"}</h3>
          <span className="text-sm text-gray-500">Updated: {stepData?.sections?.overview?.updated || "Just now"}</span>
        </div>
        <div className='md:flex items-center justify-center'>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
            {(stepData?.sections?.overview?.details || []).map((item, idx) => (
              <div key={idx}>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className={`text-sm font-medium ${item.highlight ? 'text-[#f56e45]' : 'text-gray-800'}`}>
                  {item.value || "--"}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 md:mt-1 flex justify-center">
            <div className="bg-white border border-green-200 p-4 w-full min-w-[180px] flex items-center gap-4 -sm">
              <div className="flex-1">
                <img src={'/gif/Approval.gif'} className='w-20 h-20' />
                <h5 className="font-bold text-sm text-gray-800">APS Certificate</h5>
                <p className="text-sm text-green-600 font-medium">
                  {stepData?.page?.status === 'Completed' ? 'Approved & Issued' : 'Awaiting Approval'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">What happens next?</h3>
        <p className="text-sm text-gray-500 mb-6">Once your APS is approved, you can proceed with your visa application.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "Mail", title: "Email Notification", description: "You'll receive an email once approved" },
            { icon: "Download", title: "Download Certificate", description: "Download your APS certificate" },
            { icon: "FileText", title: "Visa Application", description: "Start your visa application" },
            { icon: "Calendar", title: "Book Appointment", description: "Schedule your visa interview" }
          ].map((step, idx) => {
            const IconComponent = iconMap[step.icon] || FileText;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-4 border border-gray-200 hover:-md transition-">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <IconComponent size={18} className="text-green-600" />
                </div>
                <h5 className="text-sm font-bold text-gray-800">{step.title}</h5>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">Important Info</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-2 text-sm font-semibold text-gray-500">#</th>
              <th className="pb-2 text-sm font-semibold text-gray-500">Details</th>
            </tr>
          </thead>
          <tbody>
            {(stepData?.importantInfo || []).map((row, idx) => (
              <tr key={idx} className="border-b border-gray-50">
                <td className="py-2 text-sm text-gray-700">{row.title}</td>
                <td className="py-2"><span className="text-sm  px-2 py-0.5 rounded">{row.description}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(stepData?.progressSteps && stepData.progressSteps.length > 0) && (
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-4">Progress Steps</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">Step</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Status</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Date</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody>
              {stepData.progressSteps.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.label}</td>
                  <td className="py-2">
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      row.status === 'completed' ? 'text-green-600 bg-green-50' :
                      row.status === 'in-progress' ? 'text-yellow-600 bg-yellow-50' :
                      'text-gray-500 bg-gray-50'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 text-sm text-gray-500">{row.date}</td>
                  <td className="py-2 text-sm text-gray-500">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(stepData?.statusTimeline && stepData.statusTimeline.length > 0) && (
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-4">Status Timeline</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">Date</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Status</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody>
              {stepData.statusTimeline.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.date}</td>
                  <td className="py-2"><span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{row.status}</span></td>
                  <td className="py-2 text-sm text-gray-500">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Submitted Documents</h3>
          <button className="text-[#f56e45] text-sm font-bold bg-orange-50 px-3 py-1 rounded" onClick={() => router.push('/dashboard/settings')}>
            View All Documents →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">Document Name</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Status</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {(apiData?.documents || []).map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.documentType}</td>
                  <td className="py-2"><span className={`text-sm px-2 py-0.5 rounded ${
                    row.status === 'uploaded' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50'
                  }`}>{row.status}</span></td>
                  <td className="py-2 text-sm text-gray-500">{row.description || "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const Step3VisaApplication = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 3);
  const router = useRouter();
  
  return (
    <>
      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData?.sections?.overview?.title || "Application Information"}</h3>
          <span className="text-sm text-gray-500">Updated: {stepData?.sections?.overview?.updated || "Just now"}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details || []).map((item, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`text-sm font-medium ${item.highlight ? 'text-[#f56e45]' : 'text-gray-800'}`}>
                {item.value || "--"}
              </p>
            </div>
          ))}
        </div>
        {stepData?.progress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Application Progress</span>
              <span>{stepData.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#f56e45] h-2 rounded-full" style={{ width: `${stepData.progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Personal Information</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {[
            { label: "Full Name", value: apiData?.user?.name || "--" },
            { label: "Date of Birth", value: apiData?.user?.dateOfBirth?.split('T')[0] || "--" },
            { label: "Passport Number", value: apiData?.user?.passportNumber || "--" },
            { label: "Nationality", value: apiData?.user?.nationality || "--" }
          ].map((item, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Family Information</h3>
          <button onClick={() => router.push('/dashboard/settings')} className='px-2 bg-orange-200 flex items-center'>
            <Edit className='h-4'/> Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-100 p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Father's Details</h5>
            <div className="space-y-2">
              <div><span className="text-sm text-gray-500">Name</span><p className="font-medium text-sm">{apiData?.user?.familyDetails?.fatherName || '--'}</p></div>
              <div><span className="text-sm text-gray-500">Occupation</span><p className="font-medium text-sm">{apiData?.user?.familyDetails?.fatherOccupation || '--'}</p></div>
              <div><span className="text-sm text-gray-500">Phone</span><p className="font-medium text-sm">{apiData?.user?.familyDetails?.fatherPhone || '--'}</p></div>
            </div>
          </div>
          <div className="border border-gray-100 p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Mother's Details</h5>
            <div className="space-y-2">
              <div><span className="text-sm text-gray-500">Name</span><p className="font-medium text-sm">{apiData?.user?.familyDetails?.motherName || '--'}</p></div>
              <div><span className="text-sm text-gray-500">Occupation</span><p className="font-medium text-sm">{apiData?.user?.familyDetails?.motherOccupation || '--'}</p></div>
              <div><span className="text-sm text-gray-500">Phone</span><p className="font-medium text-sm">{apiData?.user?.familyDetails?.motherPhone || '--'}</p></div>
            </div>
          </div>
        </div>
      </div>

      {(stepData?.importantInfo && stepData.importantInfo.length > 0) && (
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-4">Financial Information</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">#</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Details</th>
              </tr>
            </thead>
            <tbody>
              {stepData.importantInfo.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.title}</td>
                  <td className="py-2"><span className="text-sm  px-2 py-0.5 rounded">{row.description}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(stepData?.progressSteps && stepData.progressSteps.length > 0) && (
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-4">Progress Steps</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">Step</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Status</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Date</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody>
              {stepData.progressSteps.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.label}</td>
                  <td className="py-2">
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      row.status === 'completed' ? 'text-green-600 bg-green-50' :
                      row.status === 'in-progress' ? 'text-yellow-600 bg-yellow-50' :
                      'text-gray-500 bg-gray-50'
                    }`}>{row.status}</span>
                  </td>
                  <td className="py-2 text-sm text-gray-500">{row.date}</td>
                  <td className="py-2 text-sm text-gray-500">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Required Documents</h3>
          <span className="text-sm text-[#f56e45] cursor-pointer hover:underline">View All</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">Document Name</th>
                <th className="pb-2 text-sm font-semibold text-gray-500 text-center">Status</th>
                <th className="pb-2 text-sm font-semibold text-gray-500 text-center">Updated On</th>
                <th className="pb-2 text-sm font-semibold text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(apiData?.documents || []).map((row, idx) => {
                const statusColor = row.status === 'uploaded' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50';
                return (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-2"><div className="flex items-center gap-2">
                      <FileText size={12} className="text-gray-500"/><span className="text-sm text-gray-700">{row.documentType}</span></div></td>
                    <td className="py-2 text-center"><span className={`text-sm ${statusColor} px-2 py-0.5 rounded`}>{row.status}</span></td>
                    <td className="py-2 text-center text-sm text-gray-400">{row.uploadedAt ? new Date(row.uploadedAt).toLocaleDateString() : '--'}</td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {row.status === 'uploaded' ? <Eye size={14} className="text-[#f56e45] cursor-pointer" /> 
                        : <UploadCloud size={14} className="text-orange-500 cursor-pointer" />}
                        <Trash2 size={14} className="text-red-400 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">Final Document Review</h3>
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 p-4">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">
            Please carefully review all uploaded documents before proceeding with
            your visa application. Ensure that all information is accurate,
            complete, and matches your official records. If you notice any
            missing documents, incorrect details, or have any questions regarding
            your application, please contact your assigned counsellor for
            assistance before submitting.
          </p>
        </div>
      </div>
    </>
  );
};

const Step4Biometrics = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 4);
  
  const bannerData = stepData?.banner || {};

  return (
    <>
      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData?.sections?.overview?.title || "Appointment Details"}</h3>
          <span className="text-sm text-gray-500">Updated: {stepData?.sections?.overview?.updated || "Just now"}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(stepData?.sections?.overview?.details || []).map((item, idx) => (
            <div key={idx} className="border border-gray-100 p-3">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`text-sm font-medium ${item.highlight ? 'text-[#f56e45]' : 'text-gray-800'}`}>
                {item.value || "--"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-2">What is Biometrics?</h3>
        <p className="text-sm text-gray-500 mb-3">Biometrics includes fingerprinting and photograph capture for identity verification.</p>
        <button className="flex items-center gap-2 text-[#f56e45] text-sm font-medium hover:underline">
          <PlayCircle size={16} /> Watch Video Guide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-gray-200 -sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Fees Details</h3>
          </div>
          <div className="space-y-1">
            {(stepData?.importantInfo || []).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{item.title}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-800">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-4">Appointment History</h3>
          <div className="space-y-1">
            {(stepData?.statusTimeline || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-1.5">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {idx < (stepData?.statusTimeline?.length || 0) - 1 && <div className="w-0.5 h-4 bg-gray-200"></div>}
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">{item.date}</span>
                  <span className="text-gray-500">{item.description}</span>
                  <span className="text-gray-700">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-3">Before You Go</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { text: "Reach on time" },
            { text: "Carry all documents" },
            { text: "Dress formally" },
            { text: "No electronic items" },
            { text: "Follow guidelines" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 py-1">
              <div className="p-1 bg-gray-50 rounded-full"><CheckCircle2 size={12} className="text-green-500" /></div>
              <span className="text-sm text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-3">Documents to Carry</h3>
          <div className="space-y-1 mb-3">
            {[
              "Original Passport",
              "Appointment Letter Copy",
              "Visa Application Copy",
              "Recent Photographs (2)",
              "Visa Fee Receipt"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-700">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 italic">Note: Please carry all original documents for verification</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-3">Biometrics Process</h3>
          <div className="space-y-1">
            {[
              { title: "Document Verification", description: "Your documents will be verified at the counter" },
              { title: "Photograph Capture", description: "Your photograph will be taken professionally" },
              { title: "Fingerprint Scanning", description: "All 10 fingers will be scanned" },
              { title: "Signature Capture", description: "Your digital signature will be captured" }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600">{idx + 1}</span>
                  </div>
                  {idx < 3 && <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{step.title}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">After Biometrics</h3>
        <div className="flex flex-wrap justify-between gap-2">
          {[
            { icon: "Clock", title: "Processing", description: "Visa processing begins" },
            { icon: "FileText", title: "Status Check", description: "Track your application" },
            { icon: "Mail", title: "Decision", description: "Receive email notification" },
            { icon: "Ticket", title: "Passport", description: "Collect your passport" }
          ].map((step, idx) => {
            const IconComp = iconMap[step.icon] || Fingerprint;
            return (
              <div key={idx} className="flex flex-col items-center text-center flex-1 min-w-[100px]">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <IconComp size={18} className="text-orange-600" />
                </div>
                <p className="text-sm font-bold text-gray-800">{step.title}</p>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">Confirmation</h3>
        <div className="flex items-start gap-3 mb-4">
          {/* <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#f56e45]" /> */}
          <p className="text-sm text-gray-600">I confirm that I have attended the biometrics appointment and provided my biometrics.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div><p className="text-sm text-gray-500">Applicant Name</p><p className="font-medium">{data?.user?.name || "--"}</p></div>
          </div>
          <a href={fileBaseurl(bannerData.fileUrl)} target='_blank' className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50" >Save & Print</a>
        </div>
      </div>
    </>
  );
};

const Step5VisaDecision = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 5);
  const router = useRouter();
  
  const bannerData = stepData?.banner || {};

  return (
    <>
      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData?.sections?.overview?.title || "Application Details"}</h3>
          <span className="text-sm text-gray-500">Updated: {stepData?.sections?.overview?.updated || "Just now"}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details || []).map((item, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`text-sm font-medium ${item.highlight ? 'text-[#f56e45]' : 'text-gray-800'}`}>
                {item.value || "--"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">Current Status</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-orange-50 p-4 border border-orange-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <Clock size={28} className="text-orange-600" />
            </div>
            <h4 className="font-bold text-sm text-orange-800">
              {stepData?.sections?.overview?.details?.find(item => item.label?.toLowerCase() === "status")?.value || "--"}
            </h4>
            <p className="text-sm text-gray-600 mt-1">Your application is currently under review by the embassy. This may take 4-6 weeks.</p>
          </div>
          <div className="flex-1 space-y-2">
            {(stepData?.sections?.overview?.details?.filter(ele => ele.highlight === true) || []).map((item, idx) => (
              <div key={idx} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-4">Decision Info</h3>
          <div className="space-y-1">
            {(stepData?.importantInfo || []).map((item, idx) => {
              const isActive = item.status === 'active';
              const isCompleted = item.status === 'completed';
              return (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#f56e45]' : isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {isCompleted && <Check size={12} className="text-white" />}
                      {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    {idx < (stepData?.importantInfo?.length || 0) - 1 && <div className={`w-0.5 h-6 ${isActive ? 'bg-[#f56e45]' : isCompleted ? 'bg-green-300' : 'bg-gray-200'}`}></div>}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${isActive ? 'text-[#f56e45]' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{item.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-4">What happens next?</h3>
          <div className="space-y-1">
            {[
              { title: "Verification Complete", description: "Your documents will be verified" },
              { title: "Decision Made", description: "You'll receive email notification" },
              { title: "Passport Collection", description: "Collect your passport with visa" },
              { title: "Travel Planning", description: "Plan your travel" }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#f56e45]">{idx + 1}</span>
                  </div>
                  {idx < 3 && <div className="w-0.5 h-4 bg-gray-200 mt-1"></div>}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{step.title}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-50 border border-orange-100">
            <h5 className="text-sm font-bold text-orange-800 flex items-center gap-1">
              <AlertCircle size={12} /> Important Note
            </h5>
            <ul className="mt-1 space-y-1">
              {[
                "Do not book flights until visa is approved",
                "Processing times may vary based on individual cases",
                "You may be called for additional documents if required"
              ].map((text, idx) => (
                <li key={idx} className="text-sm text-orange-700 flex items-start gap-1">
                  <div className="mt-0.5">•</div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-gray-200 -sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Submitted Documents</h3>
            <button className="text-[#f56e45] text-sm font-bold bg-orange-50 px-3 py-1 rounded" onClick={() => router.push('/dashboard/settings')}>
              View All Documents →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-sm font-semibold text-gray-500">Document Name</th>
                  <th className="pb-2 text-sm font-semibold text-gray-500">Status</th>
                  <th className="pb-2 text-sm font-semibold text-gray-500">Updated On</th>
                </tr>
              </thead>
              <tbody>
                {(apiData?.documents || []).map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-2 text-sm text-gray-700">{row.documentType}</td>
                    <td className="py-2"><span className={`text-sm ${row.status === 'uploaded' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50'} px-2 py-0.5 rounded`}>{row.status}</span></td>
                    <td className="py-2 text-sm text-gray-400">{row.uploadedAt ? new Date(row.uploadedAt).toLocaleDateString() : '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-200 -sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Embassy Updates</h3>
          </div>
          <div className="space-y-1">
            {(stepData?.statusTimeline || []).map((item, idx) => (
              <div key={idx} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#f56e45]"></div>
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{item.date}</span>
                    <span className="text-sm text-[#f56e45] font-medium">{item.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">Acknowledgment</h3>
        <div className="flex items-start gap-3 mb-4">
          {/* <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#f56e45]" /> */}
          <p className="text-sm text-gray-600">I acknowledge that I have read and understood the visa processing timeline and conditions.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div><p className="text-sm text-gray-500">Applicant Name</p><p className="font-medium">{data?.user?.name || "--"}</p></div>
          </div>
          <a href={fileBaseurl(bannerData.fileUrl)} target='_blank' className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50" >Save & Print</a>
        </div>
      </div>
    </>
  );
};

const Step6VisaApproved = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 6);
  const router = useRouter();
  
  return (
    <>
      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData?.sections?.overview?.title || "Visa Approval Details"}</h3>
          <span className="text-sm text-gray-500">Updated: {stepData?.sections?.overview?.updated || "Just now"}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details || []).map((item, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`text-sm font-medium ${item.highlight ? 'text-[#f56e45]' : 'text-gray-800'}`}>
                {item.value || "--"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-gray-200 -sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <img src={'/gif/complete.gif'} alt={"icon"} className="w-full h-full object-contain" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Congratulations!</h3>
          <p className="text-sm text-gray-600 mt-2">Your Student Visa has been approved. You can now plan your travel.</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 -sm">
          <h3 className="font-bold text-gray-800 mb-4">Next Steps</h3>
          <div className="flex flex-wrap justify-between gap-2">
            {[
              { icon: "Ticket", title: "Collect Passport" },
              { icon: "Plane", title: "Book Flights" },
              { icon: "Home", title: "Find Accommodation" },
              { icon: "Calendar", title: "Plan Arrival" }
            ].map((step, idx) => {
              const IconComp = iconMap[step.icon] || FileOutput;
              return (
                <div key={idx} className="flex flex-col items-center text-center flex-1 min-w-[80px]">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                    <IconComp size={18} className="text-[#f56e45]" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">{step.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">Visa Sticker Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.importantInfo || []).map((item, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-sm font-medium text-gray-800">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-orange-50 border border-orange-100 flex items-start gap-2">
        <Info size={14} className="text-[#f56e45] mt-0.5 flex-shrink-0" />
        <p className="text-sm text-orange-700">If opting for courier, passport will be delivered within 3-5 business days</p>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Documents Summary</h3>
          <button className="text-[#f56e45] text-sm font-bold bg-orange-50 px-3 py-1 rounded" onClick={() => router.push('/dashboard/settings')}>
            View All Documents →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">Document Name</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Status</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Updated On</th>
              </tr>
            </thead>
            <tbody>
              {(apiData?.documents || []).map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.documentType}</td>
                  <td className="py-2"><span className={`text-sm ${row.status === 'uploaded' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'} px-2 py-0.5 rounded`}>{row.status}</span></td>
                  <td className="py-2 text-sm text-gray-400">{row.uploadedAt ? new Date(row.uploadedAt).toLocaleDateString() : '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <div className="flex items-start gap-3">
          <div className="text-[#f56e45]"><MessageCircle size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Message from Embassy</h3>
            <p className="text-sm text-gray-600">Congratulations on your visa approval! Please ensure you carry all necessary documents while traveling.</p>
          </div>
        </div>
      </div>
    </>
  );
};

const AddCommentStep = ({ data, currentStepId, apiData }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepInfo = apiData?.steps?.find(s => s.id === currentStepId);
  const isStepCompleted = currentStepInfo?.status === 'Completed' || currentStepInfo?.page?.status === 'Completed';

  useEffect(() => {
    if (apiData?.comments) {
      setComments(apiData.comments);
    }
  }, [apiData]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newComment = {
        id: Date.now(),
        text: comment,
        author: apiData?.user?.name || 'Student',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
      };
      
      setComments([newComment, ...comments]);
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isStepCompleted) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 p-6 border border-green-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-green-800 mb-2">Step Completed Successfully!</h3>
          <p className="text-sm text-green-700 max-w-md mx-auto">
            This step of your visa journey has been completed. You can now proceed to the next step.
          </p>
          <button className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 transition-colors">
            Go to Next Step
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-6 border border-yellow-200 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-yellow-600" />
        </div>
        <h3 className="text-lg font-bold text-yellow-800 mb-2">Step Not Started Yet</h3>
        <p className="text-sm text-yellow-700 max-w-md mx-auto">
          This step of your visa journey hasn't been initiated yet. 
          Please complete the previous steps first or contact your counselor for assistance.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-2 transition-colors">
            Go to Previous Step
          </button>
          <button className="border border-yellow-300 text-yellow-700 text-sm font-medium px-4 py-2 hover:bg-yellow-100 transition-colors">
            Contact Counselor
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Info size={18} className="text-[#f56e45]" />
          Step Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Requirements for this step:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm text-gray-500">1</span>
                </div>
                <span className="text-sm text-gray-600">Complete all previous steps successfully</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm text-gray-500">2</span>
                </div>
                <span className="text-sm text-gray-600">Ensure all required documents are uploaded</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm text-gray-500">3</span>
                </div>
                <span className="text-sm text-gray-600">Wait for embassy notification</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4">
            <p className="text-sm font-bold text-gray-700 mb-2">Estimated Processing Time:</p>
            <p className="text-2xl font-bold text-[#f56e45]">2-4 Weeks</p>
            <p className="text-sm text-gray-500 mt-1">Processing times may vary based on individual cases</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4">Required Documents</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">Document Name</th>
                <th className="pb-2 text-sm font-semibold text-gray-500 text-center">Status</th>
                <th className="pb-2 text-sm font-semibold text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Valid Passport", status: "Pending" },
                { name: "Visa Application Form", status: "Pending" },
                { name: "APS Certificate", status: "Pending" },
                { name: "Financial Proof", status: "Pending" },
                { name: "Health Insurance", status: "Pending" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2"><div className="flex items-center gap-2"><FileText size={12} className="text-gray-500"/><span className="text-sm text-gray-700">{row.name}</span></div></td>
                  <td className="py-2 text-center"><span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">{row.status}</span></td>
                  <td className="py-2 text-right">
                    <button className="text-sm text-[#f56e45] hover:underline">Upload</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle size={18} className="text-[#f56e45]" />
          Comments & Queries
        </h3>
        
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ask a question or leave a comment about this step..."
            className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#f56e45] focus:ring-1 focus:ring-[#f56e45] min-h-[100px]"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !comment.trim()}
              className="bg-[#f56e45] hover:bg-[#f56e45] text-white text-sm font-medium px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Post Comment'}
              <Send size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">Previous Comments</p>
          {comments.length > 0 ? (
            comments.map((c, idx) => (
              <div key={c.id || idx} className="border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <User size={12} className="text-orange-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">{c.author}</span>
                  <span className="text-sm text-gray-400">{c.date} at {c.time}</span>
                </div>
                <p className="text-sm text-gray-600 ml-8">{c.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-gray-50">
              <MessageCircle size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No comments yet. Be the first to ask a question!</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 -sm">
        <h3 className="font-bold text-gray-800 mb-3">Need Help?</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50">
            <Phone size={18} className="text-[#f56e45]" />
            <div>
              <p className="text-sm text-gray-500">Call our support team</p>
              <p className="text-sm font-medium text-gray-800">+91-11-1234-5678</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50">
            <Mail size={18} className="text-[#f56e45]" />
            <div>
              <p className="text-sm text-gray-500">Email us</p>
              <p className="text-sm font-medium text-gray-800">support@visajourney.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50">
            <MessageCircle size={18} className="text-[#f56e45]" />
            <div>
              <p className="text-sm text-gray-500">Live chat</p>
              <p className="text-sm font-medium text-gray-800">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoApplicationView = ({ onStartApplication }) => (
  <div className="space-y-6">
    <div className="bg-orange-50 p-8 border border-orange-200 text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText size={40} className="text-orange-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">No Active Visa Application</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        You haven't started your visa application process yet. Start your journey to study in Germany by creating a new application.
      </p>
      <button onClick={onStartApplication} className="bg-[#f56e45] hover:bg-[#f56e45] text-white font-medium px-6 py-3 transition-colors inline-flex items-center gap-2">
        Start New Application <ArrowRight size={18} />
      </button>
    </div>
  </div>
);

export default function VisaJourneyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const visaDetails = async () => {
    try {
      const response = await axiosInstance.get('/visa/my');
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const applicationData = response.data.data[0];
        setApiData(applicationData);
        if (applicationData.currentStep) {
          setCurrentStep(applicationData.currentStep);
        }
      } else {
        setApiData(null);
      }
    } catch (error) {
      console.log(error);
      setApiData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    visaDetails();
  }, []);

  const handleStartApplication = () => {
    console.log("Start new application");
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const data = apiData;
  const currentStepData = data?.steps?.find(step => step.id === currentStep);
  const pageData = currentStepData?.page || { title: "Visa Journey", status: "In Progress", subtitle: "" };
  const bannerData = currentStepData?.banner || { type: "info", title: "", subtitle: "", action: "" };

  const renderStepContent = () => {
    const stepProps = {
      data: data,
      currentStepId: currentStep,
      apiData: data,
      visaId: apiData?._id
    };

    const hasStepData = currentStepData && (
      currentStepData.sections || 
      currentStepData.page?.status === 'Completed' ||
      currentStepData.progress !== undefined
    );

    if (!hasStepData && currentStep > 0) {
      return <AddCommentStep {...stepProps} />;
    }

    const stepsMap = {
      1: Step1APSApplied,
      2: Step2APSApproval,
      3: Step3VisaApplication,
      4: Step4Biometrics,
      5: Step5VisaDecision,
      6: Step6VisaApproved,
    };

    let StepComponent;
    if (!currentStep || currentStep <= 0) {
      StepComponent = stepsMap[1];
    } else if (currentStep > 6) {
      StepComponent = AddCommentStep;
    } else {
      StepComponent = stepsMap[currentStep] || stepsMap[1];
    }

    return <StepComponent {...stepProps} />;
  };

  const getBannerStyles = () => {
    if (bannerData.type === 'success') {
      return 'bg-green-50 border-green-100 text-green-800';
    }
    return 'bg-orange-50 border-orange-100 text-orange-800';
  };

  const bannerGifMap = {
    "APS Application": "/gif/registration.gif",
    "APS Approval": "/gif/Approval.gif",
    "Visa Application": "/gif/notepad.gif",
    "Biometrics Appointment": "/gif/Biomatric.gif",
    "Visa Decision": "/gif/visa descision.gif",
    "Visa Approved": "/gif/visa approved.gif",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f56e45] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your visa journey...</p>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-[1600px] mx-auto p-6">
          <NoApplicationView onStartApplication={handleStartApplication} />
        </main>
      </div>
    );
  }

  const progressSteps = data.steps || [];

  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {pageData.title}
            <span className={`text-sm font-normal px-2 py-0.5 rounded ${
              pageData.status === 'Approved' ? 'bg-green-100 text-green-700' :
              pageData.status === 'Completed' ? 'bg-green-100 text-green-700' :
              pageData.status === 'In Progress' ? 'bg-orange-100 text-[#f56e45]' :
              pageData.status === 'Scheduled' ? 'bg-orange-100 text-orange-700' :
              pageData.status === 'Under Review by Embassy' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {pageData.status}
            </span>
          </h1>
          {pageData.subtitle && <p className="text-sm text-gray-500 mt-1">{pageData.subtitle}</p>}
        </div>

        {progressSteps.length > 0 && (
          <div className="bg-white p-6 border border-gray-200 -sm mb-6 overflow-x-auto">
            <div className="flex justify-between min-w-[600px] relative">
              {progressSteps.map((step, index) => (
                <ProgressStep 
                  key={step.id}
                  step={step} 
                  index={index} 
                  total={progressSteps.length} 
                  currentStepId={currentStep}
                  onStepClick={handleStepClick}
                />
              ))}
            </div>
          </div>
        )}

        {bannerData.title && (
          <div className={`${getBannerStyles()} relative overflow-hidden rounded-xl p-5 mb-6 -sm transition-all duration-300 ${
            bannerData?.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500' 
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500'
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src={bannerGifMap[pageData?.title] || "/gif/notepad.gif"}
                  alt={bannerData?.title}
                  className="w-16 h-16 object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base text-gray-800 leading-tight">
                  {bannerData?.title || "No banner title"}
                </h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {bannerData?.subtitle || "No banner subtitle"}
                </p>
                
                {bannerData?.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{bannerData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          bannerData?.type === 'success' ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${bannerData.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {bannerData?.action && (
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  {console.log(fileBaseurl(bannerData.fileUrl))}
                  {bannerData?.fileUrl && (
                    <a
                      href={fileBaseurl(bannerData.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 z-99 corsor-pointer hover:text-blue-600 transition-colors duration-200 
                      flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download File
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="absolute top-0 right-0 opacity-5">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" />
              </svg>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {renderStepContent()}
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white p-4 border border-gray-200 -sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-800">Application Summary</h4>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Student Name</span>
                  <span className="font-medium text-gray-800">{apiData?.user?.name || "--"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Student Email</span>
                  <span className="font-medium text-gray-800">{apiData?.user?.email || "--"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Student Phone</span>
                  <span className="font-medium text-gray-800">{apiData?.user?.phone || "--"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Country</span>
                  <span className="font-medium text-gray-800 flex items-center gap-1">
                    {apiData.country || "India"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Tracking Id</span>
                  <span className="font-medium text-gray-800 text-xs">{apiData._id?.slice(-8) || "--"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 border border-gray-200 -sm">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Application Progress</h4>
              <div className="relative w-28 h-28 mx-auto mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="45" stroke="#f6793b" strokeWidth="8" fill="transparent" strokeDasharray="283" strokeDashoffset={283 - (283 * (currentStepData?.progress || 0) / 100)} strokeLinecap="round" transform="rotate(-90 50 50)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">{currentStepData?.progress || 0}%</span>
                  <span className="text-sm text-gray-400">Completed</span>
                </div>
              </div>
              <div className="w-full space-y-1 mt-1">
                {progressSteps.map((step, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        step.page?.status === 'Completed' || step.status === 'Completed' ? 'bg-green-500' : 
                        step.id === currentStep ? 'bg-[#f56e45]' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-600">{step.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {step.page?.status === 'Completed' || step.status === 'Completed' ? 'Completed' : 
                       step.id === currentStep ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 border border-gray-200 -sm">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Quick Links</h4>
              <div className="space-y-0.5">
                <QuickLinkItem item={{ icon: "HelpCircle", text: "Visa FAQ" }} />
                <QuickLinkItem item={{ icon: "FileText", text: "Document Checklist" }} />
                <QuickLinkItem item={{ icon: "Clock", text: "Processing Times" }} />
                <QuickLinkItem item={{ icon: "AlertCircle", text: "Track Application" }} />
              </div>
            </div>

            <div className="bg-white p-4 border border-gray-200 -sm">
              <h4 className="text-sm font-bold text-gray-800 mb-3">Your Counselor</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <User size={20} className="text-orange-600" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-gray-800">Sarah Johnson</h5>
                  <p className="text-sm text-gray-500">Senior Visa Counselor</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex -space-x-1">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 border border-white"></div>)}
                    </div>
                    <span className="text-sm text-gray-400">4.9 (128 students)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <button className="flex-1 p-1.5 border border-gray-200 hover:bg-gray-50 flex justify-center"><MessageCircle size={14} className="text-gray-500" /></button>
                <button className="flex-1 p-1.5 border border-gray-200 hover:bg-gray-50 flex justify-center"><Phone size={14} className="text-gray-500" /></button>
                <button className="flex-1 p-1.5 border border-gray-200 hover:bg-gray-50 flex justify-center"><Mail size={14} className="text-gray-500" /></button>
              </div>
              <button className="w-full bg-[#f56e45] hover:bg-[#f56e45] text-white text-sm font-bold py-2 transition-colors">Message Counselor</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}