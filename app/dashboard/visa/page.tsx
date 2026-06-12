// app/visa-journey/page.js
'use client';

import React, { useState, useEffect } from 'react';
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
  LinkIcon
} from 'lucide-react';
import axiosInstance, { fileBaseurl } from '@/app/axiosInstance';

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
        <div className={`absolute top-5 left-[60%] w-full h-1 -z-10 ${lineBg}`}></div>
      )}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 ${isActive || status === 'completed' ? 'border-green-500 bg-white' : 'border-gray-300 bg-white'}`}>
        {status === 'completed' ? (
          <CheckCircle2 size={20} className="text-green-500" />
        ) : isActive ? (
          <div className="w-3 h-3 bg-[#f56e45] rounded-full"></div>
        ) : status === 'locked' ? (
          <Lock size={14} className="text-gray-400" />
        ) : (
          <span className="text-sm font-bold text-gray-500">{step.id}</span>
        )}
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
      <div className="p-1.5 bg-gray-50 rounded-lg flex-shrink-0">
        <IconComponent size={14} className="text-gray-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{item.label}</p>
        <p className={`text-sm font-medium ${item.isHighlight ? 'text-green-600' : 'text-gray-800'}`}>
          {item.isFlag ? <span className="flex items-center gap-1"><span>🇩🇪</span> {item.value}</span> : item.value}
        </p>
      </div>
    </div>
  );
};

const DocumentRow = ({ row, showSize = true }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center py-2 border-b border-gray-50 last:border-0 gap-1">
    <div className="flex items-center gap-2 flex-1">
      <FileText size={12} className="text-gray-500" />
      <span className="text-sm text-gray-700">{row.name}</span>
    </div>
    <div className="flex items-center gap-3 sm:gap-4 text-sm">
      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">{row.status}</span>
      <span className="text-gray-400">{row.date}</span>
      {showSize && <span className="text-gray-400">{row.size || '-'}</span>}
      <span className="text-gray-400">{row.remarks || 'Accepted'}</span>
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

// Static fallback data structure
const getStaticFallbackData = () => ({
  steps: [
    {
      id: 1,
      label: "APS",
      route: "aps-applied",
      page: { title: 'APS Application', status: 'In Progress', subtitle: 'Complete your APS process to proceed with visa application.' },
      banner: { type: 'info', title: 'Your APS application is in progress.', subtitle: 'Complete your APS process to proceed with visa application.', action: 'View APS Application' },
      progress: 90,
      sections: {
        overview: {
          title: "Application Overview",
          updated: "Just now",
          details: [
            { label: "Application Number", value: "OS1779510584408", highlight: true },
            { label: "Applied University", value: "Technical University of Munich" },
            { label: "Course", value: "Bachelor of Computer Science" },
            { label: "Country", value: "Italy", isFlag: true },
            { label: "Application Date", value: "02 June 2026" },
            { label: "Current Status", value: "Under Review", highlight: true },
            { label: "Expected Result", value: "15 July 2026" }
          ]
        },
        whatIsThis: {
          title: "What is APS Certificate?",
          description: "The Academic Evaluation Centre (APS) certificate verifies the authenticity of your academic documents for studying in Germany.",
          items: [
            { icon: "FileCheck", text: "Document Verification" },
            { icon: "Shield", text: "Authenticity Check" },
            { icon: "Clock", text: "4-6 Weeks Process" },
            { icon: "GraduationCap", text: "Required for Visa" }
          ]
        },
        preparationCards: [
          { icon: "FileText", title: "Blocked Account", desc: "Open a blocked account for your living expenses in Germany.", btnText: "Learn More" },
          { icon: "Shield", title: "Health Insurance", desc: "Get mandatory health insurance for your student visa.", btnText: "Compare Plans" },
          { icon: "Building2", title: "Visa Appointment", desc: "Book your visa appointment at the German embassy.", btnText: "Check Slots" },
          { icon: "Home", title: "Accommodation", desc: "Find student housing in your university city.", btnText: "Search Now" }
        ],
        documents: {
          title: "Required Documents for APS",
          columns: [
            [{ label: "10th Marksheet", status: "Completed", action: "View" },
             { label: "12th Marksheet", status: "Completed", action: "View" },
             { label: "Bachelor's Degree", status: "Completed", action: "View" }],
            [{ label: "Passport Copy", status: "Completed", action: "View" },
             { label: "Language Certificate", status: "In Progress", action: "Upload" },
             { label: "LOR", status: "To be uploaded", action: "Upload" }]
          ]
        }
      }
    },
    {
      id: 2,
      label: "APS Approval",
      route: "aps-approval",
      page: { title: 'APS Approval', status: 'Pending', subtitle: 'Your APS certificate is being processed.' },
      banner: { type: 'info', title: 'APS Application Under Review', subtitle: 'Your documents are being verified by APS India.', action: 'Track Status' },
      sections: {
        approvalDetails: {
          title: "APS Certificate Details",
          items: [
            { icon: "FileText", label: "Certificate Number", value: "APS-2026-123456" },
            { icon: "Calendar", label: "Issue Date", value: "Pending" },
            { icon: "Clock", label: "Valid Until", value: "Pending" },
            { icon: "Shield", label: "Verification Status", value: "In Progress", isHighlight: true }
          ],
          certificate: {
            title: "APS Certificate",
            status: "Awaiting Approval"
          }
        },
        whatHappensNext: {
          title: "What happens next?",
          description: "Once your APS is approved, you can proceed with your visa application.",
          steps: [
            { icon: "Mail", title: "Email Notification", description: "You'll receive an email once approved" },
            { icon: "Download", title: "Download Certificate", description: "Download your APS certificate" },
            { icon: "FileText", title: "Visa Application", description: "Start your visa application" },
            { icon: "Calendar", title: "Book Appointment", description: "Schedule your visa interview" }
          ],
          actionButton: "Proceed to Visa Application"
        },
        documents: {
          title: "Submitted Documents",
          columns: ["Document Name", "Status", "Remarks"],
          rows: [
            { name: "Academic Documents", status: "Verified", remarks: "Accepted" },
            { name: "Language Proficiency", status: "Verified", remarks: "Accepted" },
            { name: "Passport Copy", status: "Verified", remarks: "Accepted" }
          ],
          buttonText: "View All Documents"
        }
      }
    },
    {
      id: 3,
      label: "Visa Application",
      route: "visa-application",
      page: { title: 'Visa Application', status: 'In Progress', subtitle: 'Complete your visa application form.' },
      banner: { type: 'info', title: 'Visa Application in Progress', subtitle: 'Please complete all sections and upload required documents.', action: 'Continue Application' },
      progress: 45,
      sections: {
        applicationInfo: {
          title: "Application Information",
          items: [
            { icon: "FileText", label: "Visa Application Number", value: "VIS-2026-789012" },
            { icon: "Building2", label: "Embassy", value: "German Embassy, New Delhi" },
            { icon: "Calendar", label: "Applied On", value: "10 June 2026" },
            { icon: "Clock", label: "Last Updated", value: "12 June 2026" }
          ]
        },
        personalInfo: {
          title: "Personal Information",
          items: [
            { label: "Full Name", value: "John Doe" },
            { label: "Date of Birth", value: "15 March 1998" },
            { label: "Passport Number", value: "P12345678" },
            { label: "Nationality", value: "Indian" }
          ]
        },
        familyInfo: {
          father: { name: "Robert Doe", occupation: "Engineer", phone: "+91 9876543210" },
          mother: { name: "Jane Doe", occupation: "Teacher", phone: "+91 9876543211" }
        },
        travelInfo: {
          title: "Travel Information",
          items: [
            { label: "Intended Arrival", value: "01 September 2026" },
            { label: "Duration of Stay", value: "2 Years" },
            { label: "Port of Entry", value: "Frankfurt Airport" },
            { label: "Previous Travel", value: "None" }
          ]
        },
        academicInfo: {
          title: "Academic Information",
          items: [
            { label: "University Name", value: "Technical University of Munich" },
            { label: "Course", value: "Master in Computer Science" },
            { label: "Start Date", value: "01 October 2026" },
            { label: "End Date", value: "30 September 2028" }
          ]
        },
        financialInfo: {
          title: "Financial Information",
          items: [
            { label: "Blocked Account", value: "Opened - €11,208" },
            { label: "Tuition Fee Paid", value: "€3,000" },
            { label: "Sponsorship", value: "Self/Family" },
            { label: "Scholarship", value: "None" }
          ]
        },
        documents: {
          title: "Required Documents",
          rows: [
            { name: "Passport", status: "Uploaded", date: "10 Jun 2026", size: "2.3 MB", action: "view" },
            { name: "Visa Application Form", status: "Uploaded", date: "10 Jun 2026", size: "1.1 MB", action: "view" },
            { name: "APS Certificate", status: "Pending", date: "-", size: "-", action: "upload" },
            { name: "Blocked Account Proof", status: "Pending", date: "-", size: "-", action: "upload" }
          ]
        },
        declarations: {
          title: "Declaration",
          checkboxText: "I declare that all information provided is true and complete to the best of my knowledge.",
          date: "12 June 2026",
          name: "John Doe"
        }
      }
    },
    {
      id: 4,
      label: "Biometrics",
      route: "biometrics",
      page: { title: 'Biometrics Appointment', status: 'Scheduled', subtitle: 'Your biometrics appointment has been scheduled.' },
      banner: { type: 'success', title: 'Biometrics Scheduled', subtitle: 'Please attend your appointment on the scheduled date.', action: 'Download Appointment Letter' },
      sections: {
        appointmentDetails: {
          title: "Appointment Details",
          items: [
            { icon: "Calendar", label: "Appointment Date", value: "25 June 2026" },
            { icon: "Clock", label: "Time", value: "10:30 AM" },
            { icon: "MapPin", label: "Venue", value: "German Visa Application Centre, New Delhi" },
            { icon: "Info", label: "Important Instructions", value: "Arrive 15 minutes before scheduled time", fullWidth: true }
          ],
          infoCards: [
            { label: "Visa Application ID", value: "VIS-2026-789012" },
            { label: "Appointment Status", value: "Confirmed", isHighlight: true },
            { label: "Documents to Carry", value: "6 Items" },
            { label: "Fees Paid", value: "€75" }
          ]
        },
        whatIsBiometrics: {
          title: "What is Biometrics?",
          description: "Biometrics includes fingerprinting and photograph capture for identity verification.",
          watchButton: "Watch Video Guide"
        },
        documentsToCarry: {
          title: "Documents to Carry",
          items: [
            "Original Passport",
            "Appointment Letter Copy",
            "Visa Application Copy",
            "Recent Photographs (2)",
            "Visa Fee Receipt"
          ],
          note: "Note: Please carry all original documents for verification"
        },
        biometricsProcess: {
          title: "Biometrics Process",
          steps: [
            { title: "Document Verification", description: "Your documents will be verified at the counter" },
            { title: "Photograph Capture", description: "Your photograph will be taken professionally" },
            { title: "Fingerprint Scanning", description: "All 10 fingers will be scanned" },
            { title: "Signature Capture", description: "Your digital signature will be captured" }
          ]
        },
        beforeYouGo: {
          title: "Before You Go",
          items: [
            { text: "Reach on time" },
            { text: "Carry all documents" },
            { text: "Dress formally" },
            { text: "No electronic items" },
            { text: "Follow guidelines" }
          ]
        },
        feesDetails: {
          title: "Fees Details",
          items: [
            { description: "Visa Application Fee", amount: "€75", status: "Paid" },
            { description: "Biometrics Fee", amount: "Included", status: "Paid" },
            { description: "Service Charge", amount: "₹1,000", status: "Paid", isTotal: true }
          ],
          paymentDate: "12 June 2026",
          paymentMode: "Online - Credit Card"
        },
        appointmentHistory: {
          title: "Appointment History",
          items: [
            { date: "12 Jun 2026", time: "10:30 AM", status: "Scheduled" },
            { date: "10 Jun 2026", time: "-", status: "Slot Selected" },
            { date: "08 Jun 2026", time: "-", status: "Application Submitted" }
          ]
        },
        afterBiometrics: {
          title: "After Biometrics",
          steps: [
            { icon: "Clock", title: "Processing", description: "Visa processing begins" },
            { icon: "FileText", title: "Status Check", description: "Track your application" },
            { icon: "Mail", title: "Decision", description: "Receive email notification" },
            { icon: "Ticket", title: "Passport", description: "Collect your passport" }
          ]
        },
        declaration: {
          title: "Confirmation",
          checkboxText: "I confirm that I have attended the biometrics appointment and provided my biometrics.",
          date: "25 June 2026",
          name: "John Doe"
        }
      }
    },
    {
      id: 5,
      label: "Visa Decision",
      route: "visa-decision",
      page: { title: 'Visa Decision', status: 'Under Review by Embassy', subtitle: 'Your application is being processed by the embassy.' },
      banner: { type: 'info', title: 'Application Under Review', subtitle: 'The embassy is processing your visa application.', action: 'Track Application' },
      sections: {
        applicationDetails: {
          title: "Application Details",
          items: [
            { icon: "FileText", label: "Application ID", value: "VIS-2026-789012" },
            { icon: "Calendar", label: "Submitted On", value: "10 June 2026" },
            { icon: "Building2", label: "Processing Embassy", value: "German Embassy, New Delhi" },
            { icon: "Clock", label: "Processing Time", value: "4-6 weeks" }
          ]
        },
        currentStatus: {
          title: "Current Status",
          status: "Under Review",
          description: "Your application is currently under review by the embassy. This may take 4-6 weeks.",
          details: [
            { label: "Last Updated", value: "15 June 2026" },
            { label: "Current Stage", value: "Document Verification" },
            { label: "Estimated Decision", value: "End of July 2026" }
          ]
        },
        decisionTimeline: {
          title: "Decision Timeline",
          items: [
            { label: "Application Received", date: "10 Jun 2026", status: "completed", description: "Application submitted successfully" },
            { label: "Document Verification", date: "15 Jun 2026", status: "active", description: "Verification in progress" },
            { label: "Background Check", date: "Pending", status: "pending", description: "Will start after verification" },
            { label: "Final Decision", date: "Pending", status: "pending", description: "Approval/Rejection notification" }
          ]
        },
        whatHappensNext: {
          title: "What happens next?",
          steps: [
            { title: "Verification Complete", description: "Your documents will be verified" },
            { title: "Decision Made", description: "You'll receive email notification" },
            { title: "Passport Collection", description: "Collect your passport with visa" },
            { title: "Travel Planning", description: "Plan your travel to Germany" }
          ],
          importantNote: {
            title: "Important Note",
            items: [
              "Do not book flights until visa is approved",
              "Processing times may vary based on individual cases",
              "You may be called for additional documents if required"
            ]
          }
        },
        submittedDocuments: {
          title: "Submitted Documents",
          rows: [
            { name: "Passport", status: "Verified", date: "10 Jun 2026" },
            { name: "APS Certificate", status: "Verified", date: "12 Jun 2026" },
            { name: "Financial Documents", status: "Under Review", date: "15 Jun 2026" }
          ]
        },
        embassyUpdate: {
          title: "Embassy Updates",
          items: [
            { date: "15 Jun 2026", status: "Update", description: "Document verification in progress" },
            { date: "12 Jun 2026", status: "Update", description: "Application received by embassy" },
            { date: "10 Jun 2026", status: "Info", description: "Application forwarded to embassy" }
          ]
        },
        declaration: {
          title: "Acknowledgment",
          checkboxText: "I acknowledge that I have read and understood the visa processing timeline and conditions.",
          date: "15 June 2026",
          name: "John Doe"
        }
      }
    },
    {
      id: 6,
      label: "Visa Approved",
      route: "visa-approved",
      page: { title: 'Visa Approved', status: 'Approved', subtitle: 'Congratulations! Your visa has been approved.' },
      banner: { type: 'success', title: 'Visa Approved!', subtitle: 'Your visa has been approved. Please collect your passport.', action: 'Download Visa Letter' },
      sections: {
        visaApprovalDetails: {
          title: "Visa Approval Details",
          items: [
            { icon: "Award", label: "Visa Type", value: "Student Visa" },
            { icon: "Calendar", label: "Valid From", value: "01 September 2026" },
            { icon: "Calendar", label: "Valid Until", value: "30 September 2028" },
            { icon: "Globe", label: "Entries", value: "Multiple" }
          ]
        },
        congratulations: {
          title: "Congratulations!",
          message: "Your German Student Visa has been approved. You can now plan your travel to Germany."
        },
        whatHappensNext: {
          title: "Next Steps",
          steps: [
            { icon: "Ticket", title: "Collect Passport" },
            { icon: "Plane", title: "Book Flights" },
            { icon: "Home", title: "Find Accommodation" },
            { icon: "Calendar", title: "Plan Arrival" }
          ]
        },
        visaDetails: {
          title: "Visa Sticker Details",
          items: [
            { label: "Visa Number", value: "GER-VISA-2026-12345" },
            { label: "Passport Number", value: "P12345678" },
            { label: "Duration", value: "24 Months" },
            { label: "Work Permit", value: "120 full days / 240 half days" }
          ]
        },
        passportCollection: {
          title: "Passport Collection",
          items: [
            { label: "Collection Mode", value: "In Person / Courier" },
            { label: "Collection Date", value: "25 July 2026 onwards" },
            { label: "Collection Time", value: "9:00 AM - 4:00 PM" },
            { label: "Documents Required", value: "Original receipt + ID proof" }
          ],
          note: "If opting for courier, passport will be delivered within 3-5 business days"
        },
        documentsSummary: {
          title: "Documents Summary",
          rows: [
            { name: "Passport with Visa Sticker", status: "Ready", date: "25 Jul 2026" },
            { name: "Visa Approval Letter", status: "Downloaded", date: "20 Jul 2026" },
            { name: "Travel Insurance", status: "Purchased", date: "22 Jul 2026" }
          ]
        },
        embassyMessage: {
          title: "Message from Embassy",
          message: "Congratulations on your visa approval! Please ensure you carry all necessary documents while traveling. Welcome to Germany!"
        },
        importantInfo: {
          title: "Important Information",
          items: [
            { title: "Travel Insurance", description: "Ensure you have valid travel insurance for first 3 months" },
            { title: "Registration", description: "Register at local citizen's office within 14 days of arrival" },
            { title: "Blocked Account", description: "Activate your blocked account upon arrival" },
            { title: "Health Insurance", description: "German health insurance must be active from day 1" }
          ]
        }
      }
    }
  ],
  sidebar: {
    summary: {
      title: "Application Summary",
      fields: [
        { label: "Student Name", value: "John Doe" },
        { label: "Country", value: "India", isFlag: true },
        { label: "University", value: "Technical University of Munich" },
        { label: "Course", value: "Master in Computer Science" }
      ]
    },
    quickLinks: {
      title: "Quick Links",
      items: [
        { icon: "HelpCircle", text: "Visa FAQ" },
        { icon: "FileText", text: "Document Checklist" },
        { icon: "Clock", text: "Processing Times" },
        { icon: "AlertCircle", text: "Track Application" }
      ]
    },
    counselor: {
      title: "Your Counselor",
      avatar: "/avatar-placeholder.png",
      name: "Sarah Johnson",
      role: "Senior Visa Counselor",
      rating: 4.9,
      students: 128,
      actionButton: "Message Counselor"
    }
  }
});

const Step1APSApplied = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 1) || getStaticFallbackData().steps[0];
  
  return (
    <>
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData?.sections?.overview?.title || "Application Overview"}</h3>
          <span className="text-sm text-gray-500">Updated: {stepData?.sections?.overview?.updated || "Just now"}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details || []).map((detail, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-500">{detail.label}</p>
              <p className={`text-sm font-medium ${detail.highlight ? 'text-[#f56e45]' : 'text-gray-800'}`}>
                {detail.value}
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

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
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
              <div key={idx} className="flex flex-col items-center text-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <IconComp className="text-[#f56e45] mb-1" size={20} />
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

<div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
  {/* Header */}
  <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-5 border-b border-orange-200">
    <h3 className="text-lg font-bold text-gray-800">
      Prepare for Visa Application
    </h3>
    <p className="text-sm text-gray-600 mt-1">
      Complete these steps while waiting for your APS result.
    </p>
  </div>

  {/* Preparation Cards */}
  <div className="p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[
        {
          icon: "FileText",
          title: "Blocked Account",
          desc: "Open a blocked account for your living expenses in Germany.",
          btnText: "Learn More",
        },
        {
          icon: "Shield",
          title: "Health Insurance",
          desc: "Get mandatory health insurance for your student visa.",
          btnText: "Compare Plans",
        },
        {
          icon: "Building2",
          title: "Visa Appointment",
          desc: "Book your visa appointment at the German embassy.",
          btnText: "Check Slots",
        },
        {
          icon: "Home",
          title: "Accommodation",
          desc: "Find student housing in your university city.",
          btnText: "Search Now",
        },
      ].map((card, idx) => {
        const IconComp = iconMap[card.icon] || HelpCircle;

        return (
          <div
            key={idx}
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
              <IconComp className="text-orange-500" size={24} />
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">
              {card.title}
            </h4>

            <p className="text-sm text-gray-500 leading-relaxed">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  </div>

  {/* Visa Details */}
  <div className="border-t border-gray-200 bg-gray-50">
    <div className="px-6 py-5">
      <h3 className="text-lg font-bold text-gray-800 mb-5">
        Important Details for Visa Application
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(stepData?.importantInfo || []).map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              {item.title}
            </p>

            <p className="text-sm font-medium text-gray-800 break-words">
              {item.description}
            </p>

            {item.type === "requirement" && (
              <div className="mt-4">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id={`file-upload-${item.title}`}
                />

                <label
                  htmlFor={`file-upload-${item.title}`}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 border border-dashed border-orange-300
                   bg-orange-50 rounded-lg text-sm text-orange-600 cursor-pointer hover:bg-orange-100 transition"
                >
                  <UploadCloud size={16} />
                  Upload Document
                </label>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

       {/*<div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-1">Prepare for Visa Application</h3>
        <p className="text-sm text-gray-500 mb-4">Complete these steps while waiting for your APS result.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "FileText", title: "Blocked Account", desc: "Open a blocked account for your living expenses in Germany.", btnText: "Learn More" },
            { icon: "Shield", title: "Health Insurance", desc: "Get mandatory health insurance for your student visa.", btnText: "Compare Plans" },
            { icon: "Building2", title: "Visa Appointment", desc: "Book your visa appointment at the German embassy.", btnText: "Check Slots" },
            { icon: "Home", title: "Accommodation", desc: "Find student housing in your university city.", btnText: "Search Now" }
          ].map((card, idx) => {
            const IconComp = iconMap[card.icon] || HelpCircle;
            return (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-3"><IconComp className="text-orange-400" size={28} /></div>
                <h4 className="font-bold text-sm text-gray-800 mb-1">{card.title}</h4>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{card.desc}</p>
               </div>
            );
          })}
        </div>

        
      <div className="bg-white p-6  border border-gray-200 shadow-sm mt-2">
        <h3 className="font-bold text-gray-800 mb-4">Visa Details</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.importantInfo || [
            { label: "Visa Number", value: "GER-VISA-2026-12345" },
            { label: "Passport Number", value: "P12345678" },
            { label: "Duration", value: "24 Months" },
            { label: "Work Permit", value: "120 full days / 240 half days" }
          ]).map((item, idx) => (
            <div key={idx} className='space-y-2'>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-sm font-medium text-gray-800">{item.description}</p>
              
                {item.type === "requirement" && <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      // onChange={handleFileSelect}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      id={`file-upload-${item.title}`}
                    />
                    <label
                      htmlFor={`file-upload-${item.title}`}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-200"
                    >
                      <UploadCloud size={16} />
                      Choose File
                    </label>
                  </div>

                </div>
                }
            </div>
          ))}
        </div>
      </div> 
      </div>*/}

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Required Documents for APS</h3>
          <button className="text-[#f56e45] text-sm font-bold bg-orange-50 px-3 py-1 rounded">View All Documents →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {[
            [
              { label: "10th Marksheet", status: "Completed", action: "View" },
              { label: "12th Marksheet", status: "Completed", action: "View" },
              { label: "Bachelor's Degree", status: "Completed", action: "View" }
            ],
            [
              { label: "Passport Copy", status: "Completed", action: "View" },
              { label: "Language Certificate", status: "In Progress", action: "Upload" },
              { label: "LOR", status: "To be uploaded", action: "Upload" }
            ]
          ].map((column, colIdx) => (
            <div key={colIdx}>
              {column.map((doc, idx) => {
                const statusColor = {
                  'Completed': 'bg-green-500',
                  'In Progress': 'bg-yellow-500',
                  'To be uploaded': 'bg-orange-400',
                  'Not required': 'bg-gray-300'
                }[doc.status] || 'bg-gray-300';
                return (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
                      <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{doc.status}</span>
                      <span className="text-sm text-[#f56e45] cursor-pointer hover:underline">{doc.action}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Completed</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> In Progress</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> To be uploaded</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Not Required</span>
        </div>
      </div>
    </>
  );
};

const Step2APSApproval = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 2) || getStaticFallbackData().steps[1];
  
  return (
    <>
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">APS Certificate Details</h3>
        <div className='md:flex items-center justify-center'>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details || [
            { icon: "FileText", label: "Certificate Number", value: "APS-2026-123456" },
            { icon: "Calendar", label: "Issue Date", value: "Pending" },
            { icon: "Clock", label: "Valid Until", value: "Pending" },
            { icon: "Shield", label: "Verification Status", value: "In Progress", isHighlight: true }
          ]).map((item, idx) => (
            <DetailItem key={idx} item={item} />
          ))}
        </div>
        <div className="mt-6 md:mt-1 flex justify-center">
          <div className="bg-white border border-green-200 rounded-lg p-4 w-full max-w-[280px] flex items-center gap-4 shadow-sm">
            <div className="flex-1">
              <FileText size={40} className="text-green-600 mb-1" />
              <h5 className="font-bold text-sm text-gray-800">APS Certificate</h5>
              <p className="text-sm text-green-600 font-medium">Awaiting Approval</p>
            </div>
            <div className="bg-green-50 p-2 rounded-full">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">What happens next?</h3>
        <p className="text-sm text-gray-500 mb-6">Once your APS is approved, you can proceed with your visa application.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          { [
            { icon: "Mail", title: "Email Notification", description: "You'll receive an email once approved" },
            { icon: "Download", title: "Download Certificate", description: "Download your APS certificate" },
            { icon: "FileText", title: "Visa Application", description: "Start your visa application" },
            { icon: "Calendar", title: "Book Appointment", description: "Schedule your visa interview" }
          ].map((step, idx) => {
            const IconComponent = iconMap[step.icon] || FileText;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <IconComponent size={18} className="text-green-600" />
                </div>
                <h5 className="text-sm font-bold text-gray-800">{step.title}</h5>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>


        <div className="mt-6 flex justify-center">
          <button className="flex items-center gap-2 bg-[#f56e45] hover:bg-[#f56e45] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm">
            Proceed to Visa Application <ArrowRight size={16} />
          </button>
        </div>
      </div>

      
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Important Info</h3>

         <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">#</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Details</th>
              </tr>
            </thead>
            <tbody>
              {stepData?.importantInfo?.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.title}</td>
                  <td className="py-2"><span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">{row.description}</span></td>
                </tr>
              ))}
            </tbody>
           </table>

      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Submitted Documents</h3>
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
              {[
                { name: "Academic Documents", status: "Verified", remarks: "Accepted" },
                { name: "Language Proficiency", status: "Verified", remarks: "Accepted" },
                { name: "Passport Copy", status: "Verified", remarks: "Accepted" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.name}</td>
                  <td className="py-2"><span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">{row.status}</span></td>
                  <td className="py-2 text-sm text-gray-500">{row.remarks}</td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
        <div className="mt-4 flex justify-center">
          <button className="flex items-center gap-2 border border-orange-200 bg-orange-50 text-[#f56e45] text-sm font-medium px-4 py-2 rounded-lg">
            <Eye size={14} /> View All Documents
          </button>
        </div>
      </div>
    </>
  );
};

const Step3VisaApplication = ({ data, currentStepId, apiData }) => {
  const staticData = getStaticFallbackData();
  const stepData = apiData?.steps?.find(s => s.id === 3) || staticData.steps[2];
  
  return (
    <>
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Application Information</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details ||[
            { icon: "FileText", label: "Visa Application Number", value: "VIS-2026-789012" },
            { icon: "Building2", label: "Embassy", value: "German Embassy, New Delhi" },
            { icon: "Calendar", label: "Applied On", value: "10 June 2026" },
            { icon: "Clock", label: "Last Updated", value: "12 June 2026" }
          ]).map((item, idx) => (
            <DetailItem key={idx} item={item} />
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

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
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

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Family Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Father's Details</h5>
            <div className="space-y-2">
              <div><span className="text-sm text-gray-500">Name</span><p className="font-medium text-sm">--</p></div>
              <div><span className="text-sm text-gray-500">Occupation</span><p className="font-medium text-sm">--</p></div>
              <div><span className="text-sm text-gray-500">Phone</span><p className="font-medium text-sm">--</p></div>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-3">Mother's Details</h5>
            <div className="space-y-2">
              <div><span className="text-sm text-gray-500">Name</span><p className="font-medium text-sm">--</p></div>
              <div><span className="text-sm text-gray-500">Occupation</span><p className="font-medium text-sm">--</p></div>
              <div><span className="text-sm text-gray-500">Phone</span><p className="font-medium text-sm">--</p></div>
            </div>
          </div>
        </div>
      </div>

      
      
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Important Info</h3>

         <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">#</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Details</th>
               </tr>
            </thead>
            <tbody>
              {stepData?.importantInfo?.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.title}</td>
                  <td className="py-2"><span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">{row.description}</span></td>
                 </tr>
              ))}
            </tbody>
           </table>

      </div>

      
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Progress Step</h3>

         <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-sm font-semibold text-gray-500">#</th>
                <th className="pb-2 text-sm font-semibold text-gray-500">Details</th>
               </tr>
            </thead>
            <tbody>
              {stepData?.progressSteps?.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-700">{row.title}</td>
                  <td className="py-2"><span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">{row.description}</span></td>
                 </tr>
              ))}
            </tbody>
           </table>

      </div>

      

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
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
                <th className="pb-2 text-sm font-semibold text-gray-500 text-center">File Size</th>
                <th className="pb-2 text-sm font-semibold text-gray-500 text-right">Action</th>
               </tr>
            </thead>
            <tbody>
              {[
                { name: "Passport", status: "Uploaded", date: "10 Jun 2026", size: "2.3 MB", action: "view" },
                { name: "Visa Application Form", status: "Uploaded", date: "10 Jun 2026", size: "1.1 MB", action: "view" },
                { name: "APS Certificate", status: "Pending", date: "-", size: "-", action: "upload" },
                { name: "Blocked Account Proof", status: "Pending", date: "-", size: "-", action: "upload" }
              ].map((row, idx) => {
                const statusColor = row.status === 'Uploaded' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50';
                return (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-2"><div className="flex items-center gap-2"><FileText size={12} className="text-gray-500"/><span className="text-sm text-gray-700">{row.name}</span></div></td>
                    <td className="py-2 text-center"><span className={`text-sm ${statusColor} px-2 py-0.5 rounded`}>{row.status}</span></td>
                    <td className="py-2 text-center text-sm text-gray-400">{row.date}</td>
                    <td className="py-2 text-center text-sm text-gray-400">{row.size}</td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {row.action === 'view' ? <Eye size={14} className="text-[#f56e45] cursor-pointer" /> 
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
        <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <UploadCloud size={40} className="text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">Drag & drop files here or <span className="text-[#f56e45] cursor-pointer hover:underline">click to upload</span></p>
            <p className="text-sm text-gray-400">Accepted formats: PDF, JPG, PNG (Max size: 10MB each)</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Declaration</h3>
        <div className="flex items-start gap-3 mb-4">
          <input type="checkbox" className=" w-4 h-4 rounded border-gray-300 text-[#f56e45]" />
          <p className="text-sm text-gray-600">I declare that all information provided is true and complete to the best of my knowledge.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{new Date().toISOString().split('T')[0]}</p></div>
            <div><p className="text-sm text-gray-500">Applicant Name</p><p className="font-medium">{apiData?.user?.name || "John Doe"}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50">Save as Draft</button>
            <button className="bg-white border border-orange-200 text-[#f56e45] text-sm font-medium px-4 py-2 rounded hover:bg-orange-50">Continue Later</button>
            <button className="bg-[#f56e45] text-white text-sm font-medium px-6 py-2 rounded hover:bg-[#f56e45]">Review Application</button>
          </div>
        </div>
      </div>
    </>
  );
};

const Step4Biometrics = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 4) || getStaticFallbackData().steps[3];
  
  return (
    <>
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Appointment Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(stepData?.sections?.overview?.details ||[
            { label: "Visa Application ID", value: "VIS-2026-789012" },
            { label: "Appointment Status", value: "Confirmed", isHighlight: true },
            { label: "Documents to Carry", value: "6 Items" },
            { label: "Fees Paid", value: "€75" }
          ]).map((item, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`text-sm font-medium ${item.isHighlight ? 'text-green-600' : 'text-gray-800'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">What is Biometrics?</h3>
        <p className="text-sm text-gray-500 mb-3">Biometrics includes fingerprinting and photograph capture for identity verification.</p>
        <button className="flex items-center gap-2 text-orange-600 text-sm font-medium hover:underline">
          <PlayCircle size={16} /> Watch Video Guide
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Fees Details</h3>
          </div>
          <div className="space-y-1">
            {(stepData?.importantInfo ||[
              { title: "Visa Application Fee", description: "€75", status: "Paid" },
              { title: "Biometrics Fee", description: "Included", status: "Paid" },
              { title: "Service Charge", description: "₹1,000", status: "Paid" }
            ]).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{item.title}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-800">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Appointment History</h3>
          <div className="space-y-1">
            {stepData?.statusTimeline?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-1.5">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {idx < 3 && <div className="w-0.5 h-4 bg-gray-200"></div>}
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

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
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
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
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
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
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



      <div className="bg-white p-6  border border-gray-200 shadow-sm">
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
                <p className="text-[8px] text-gray-500 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Confirmation</h3>
        <div className="flex items-start gap-3 mb-4">
          <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-600" />
          <p className="text-sm text-gray-600">I confirm that I have attended the biometrics appointment and provided my biometrics.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">25 June 2026</p></div>
            <div><p className="text-sm text-gray-500">Applicant Name</p><p className="font-medium">John Doe</p></div>
          </div>
          <button className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50">Save & Print</button>
        </div>
      </div>
    </>
  );
};

const Step5VisaDecision = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 5) || getStaticFallbackData().steps[4];
  
  return (
    <>
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Application Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details || [
            { icon: "FileText", label: "Application ID", value: "No data" },
            { icon: "Calendar", label: "Submitted On", value: "No data" },
            { icon: "Building2", label: "Processing Embassy", value: "--" },
            { icon: "Clock", label: "Processing Time", value: "--" }
          ]).map((item, idx) => (
            <DetailItem key={idx} item={item} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Current Status</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-orange-50 p-4 rounded-lg border border-orange-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <Clock size={28} className="text-orange-600" />
            </div>
            <h4 className="font-bold text-sm text-orange-800">
              {stepData?.sections?.overview?.details?.find(item => item.label?.toLowerCase() === "status")?.value || "--"}
            </h4>
            <p className="text-sm text-gray-600 mt-1">Your application is currently under review by the embassy. This may take 4-6 weeks.</p>
          </div>
          <div className="flex-1 space-y-2">
            {(stepData?.sections?.overview?.details?.filter(ele => ele.highlight === true) || [
              { label: "Last Updated", value: "15 June 2026" },
              { label: "Current Stage", value: "Document Verification" },
              { label: "Estimated Decision", value: "End of July 2026" }
            ]).map((item, idx) => (
              <div key={idx} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Decision Info</h3>
          <div className="space-y-1">
            {(stepData?.importantInfo || [
              { label: "Application Received", date: "10 Jun 2026", status: "completed", description: "Application submitted successfully" },
              { label: "Document Verification", date: "15 Jun 2026", status: "active", description: "Verification in progress" },
              { label: "Background Check", date: "Pending", status: "pending", description: "Will start after verification" },
              { label: "Final Decision", date: "Pending", status: "pending", description: "Approval/Rejection notification" }
            ]).map((item, idx) => {
              const isActive = item.status === 'active';
              const isCompleted = item.status === 'completed';
              return (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-orange-600' : isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {isCompleted && <Check size={12} className="text-white" />}
                      {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    {idx < 3 && <div className={`w-0.5 h-6 ${isActive ? 'bg-orange-300' : isCompleted ? 'bg-green-300' : 'bg-gray-200'}`}></div>}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${isActive ? 'text-orange-600' : isCompleted ? 
                        'text-green-600' : 'text-gray-500'}`}>{item.label}</p>
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">What happens next?</h3>
          <div className="space-y-1">
            {[
              { title: "Verification Complete", description: "Your documents will be verified" },
              { title: "Decision Made", description: "You'll receive email notification" },
              { title: "Passport Collection", description: "Collect your passport with visa" },
              { title: "Travel Planning", description: "Plan your travel " }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600">{idx + 1}</span>
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
          <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg">
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
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Submitted Documents</h3>
            <span className="text-sm text-orange-600 cursor-pointer hover:underline">View All Documents →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody>
                {[
                  { name: "Passport", status: "Verified", date: "10 Jun 2026" },
                  { name: "APS Certificate", status: "Verified", date: "12 Jun 2026" },
                  { name: "Financial Documents", status: "Under Review", date: "15 Jun 2026" }
                ].map((row, idx) => (
                  <DocumentRow key={idx} row={row} showSize={false} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Embassy Updates</h3>
          </div>
          <div className="space-y-1">
            {(stepData?.statusTimeline || [
              { date: "15 Jun 2026", status: "Update", description: "Document verification in progress" },
              { date: "12 Jun 2026", status: "Update", description: "Application received by embassy" },
              { date: "10 Jun 2026", status: "Info", description: "Application forwarded to embassy" }
            ]).map((item, idx) => (
              <div key={idx} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{item.date}</span>
                    <span className="text-sm text-orange-600 font-medium">{item.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Acknowledgment</h3>
        <div className="flex items-start gap-3 mb-4">
          <input type="checkbox" className=" w-4 h-4 rounded border-gray-300 text-orange-600" />
          <p className="text-sm text-gray-600">I acknowledge that I have read and understood the visa processing timeline and conditions.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">15 June 2026</p></div>
            <div><p className="text-sm text-gray-500">Applicant Name</p><p className="font-medium">John Doe</p></div>
          </div>
          <button className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50">Save & Print</button>
        </div>
      </div>
    </>
  );
};

const Step6VisaApproved = ({ data, currentStepId, apiData }) => {
  const stepData = apiData?.steps?.find(s => s.id === 6) || getStaticFallbackData().steps[5];
  
  return (
    <>
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Visa Approval Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.sections?.overview?.details || [
            { icon: "Award", label: "Visa Type", value: "Student Visa" },
            { icon: "Calendar", label: "Valid From", value: "01 September 2026" },
            { icon: "Calendar", label: "Valid Until", value: "30 September 2028" },
            { icon: "Globe", label: "Entries", value: "Multiple" }
          ]).map((item, idx) => (
            <DetailItem key={idx} item={item} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6  border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <Award size={32} className="text-green-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Congratulations!</h3>
          <p className="text-sm text-gray-600 mt-2">Your German Student Visa has been approved. You can now plan your travel to Germany.</p>
        </div>
        <div className="bg-white p-6  border border-gray-200 shadow-sm">
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
                    <IconComp size={18} className="text-orange-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">{step.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Visa Sticker Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {(stepData?.importantInfo || [
            { label: "Visa Number", value: "GER-VISA-2026-12345" },
            { label: "Passport Number", value: "P12345678" },
            { label: "Duration", value: "24 Months" },
            { label: "Work Permit", value: "120 full days / 240 half days" }
          ]).map((item, idx) => (
            <div key={idx}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

        <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-2">
          <Info size={14} className="text-orange-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-orange-700">If opting for courier, passport will be delivered within 3-5 business days</p>
        </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Documents Summary</h3>
          <span className="text-sm text-orange-600 cursor-pointer hover:underline">View All Documents →</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              {[
                { name: "Passport with Visa Sticker", status: "Ready", date: "25 Jul 2026" },
                { name: "Visa Approval Letter", status: "Downloaded", date: "20 Jul 2026" },
                { name: "Travel Insurance", status: "Purchased", date: "22 Jul 2026" }
              ].map((row, idx) => (
                <DocumentRow key={idx} row={row} showSize={false} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-orange-600"><MessageCircle size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Message from Embassy</h3>
            <p className="text-sm text-gray-600">Congratulations on your visa approval! Please ensure you carry all necessary documents while traveling. Welcome to Germany!</p>
          </div>
        </div>
      </div>
    </>
  );
};

// AddCommentStep Component - For steps with no data or pending status
const AddCommentStep = ({ data, currentStepId, apiData }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the current step data
  const currentStepInfo = apiData?.steps?.find(s => s.id === currentStepId);
  const isStepCompleted = currentStepInfo?.status === 'Completed' || currentStepInfo?.page?.status === 'Completed';

  // Load comments from API data or initialize
  useEffect(() => {
    if (apiData?.comments) {
      setComments(apiData.comments);
    }
  }, [apiData]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      // API call to submit comment
      const newComment = {
        id: Date.now(),
        text: comment,
        author: apiData?.user?.name || 'Student',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
      };
      
      // In a real implementation, you would call an API endpoint
      // await axiosInstance.post('/visa/comment', { comment, stepId: currentStepId });
      
      setComments([newComment, ...comments]);
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the step is completed, show a different message
  if (isStepCompleted) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50  p-6 border border-green-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-green-800 mb-2">Step Completed Successfully!</h3>
          <p className="text-sm text-green-700 max-w-md mx-auto">
            This step of your visa journey has been completed. You can now proceed to the next step.
          </p>
          <button 
            className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Go to Next Step
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Not Started / Pending Banner */}
      <div className="bg-yellow-50  p-6 border border-yellow-200 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-yellow-600" />
        </div>
        <h3 className="text-lg font-bold text-yellow-800 mb-2">Step Not Started Yet</h3>
        <p className="text-sm text-yellow-700 max-w-md mx-auto">
          This step of your visa journey hasn't been initiated yet. 
          Please complete the previous steps first or contact your counselor for assistance.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Go to Previous Step
          </button>
          <button 
            className="border border-yellow-300 text-yellow-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            Contact Counselor
          </button>
        </div>
      </div>

      {/* Step Information - Show what's required */}
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-bold text-gray-700 mb-2">Estimated Processing Time:</p>
            <p className="text-2xl font-bold text-[#f56e45]">2-4 Weeks</p>
            <p className="text-sm text-gray-500 mt-1">Processing times may vary based on individual cases</p>
          </div>
        </div>
      </div>

      {/* Required Documents for this step */}
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
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

      {/* Comments Section */}
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle size={18} className="text-[#f56e45]" />
          Comments & Queries
        </h3>
        
        {/* Add Comment */}
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ask a question or leave a comment about this step..."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#f56e45] focus:ring-1 focus:ring-[#f56e45] min-h-[100px]"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !comment.trim()}
              className="bg-[#f56e45] hover:bg-[#f56e45] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Post Comment'}
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Comments List */}
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
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <MessageCircle size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No comments yet. Be the first to ask a question!</p>
            </div>
          )}
        </div>
      </div>

      {/* Support Contact */}
      <div className="bg-white p-6  border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Need Help?</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone size={18} className="text-[#f56e45]" />
            <div>
              <p className="text-sm text-gray-500">Call our support team</p>
              <p className="text-sm font-medium text-gray-800">+91-11-1234-5678</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail size={18} className="text-[#f56e45]" />
            <div>
              <p className="text-sm text-gray-500">Email us</p>
              <p className="text-sm font-medium text-gray-800">support@visajourney.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
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
    <div className="bg-orange-50  p-8 border border-orange-200 text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText size={40} className="text-orange-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">No Active Visa Application</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        You haven't started your visa application process yet. Start your journey to study in Germany by creating a new application.
      </p>
      <button 
        onClick={onStartApplication}
        className="bg-[#f56e45] hover:bg-[#f56e45] text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
      >
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
      console.log("api calling...")
      const response = await axiosInstance.get('/visa/my');
      console.log(response.data);
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // API returns data as an array, take the first item
        const applicationData = response.data.data[0];
        setApiData(applicationData);
        // Set current step from API data
        if (applicationData.currentStep) {
          setCurrentStep(applicationData.currentStep);
        }
      } else {
        // No application found
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
    // Navigate to start application page or show modal
    console.log("Start new application");
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  // Use API data if available, otherwise use static fallback for demo
  const data = apiData || getStaticFallbackData();

  // Get current step data
  const currentStepData = data?.steps?.find(step => step.id === currentStep);
  const pageData = currentStepData?.page || { title: "Visa Journey", status: "In Progress", subtitle: "" };
  const bannerData = currentStepData?.banner || { type: "info", title: "", subtitle: "", action: "" };

  const renderStepContent = () => {
    const stepProps = {
      data: data,
      currentStepId: currentStep,
      apiData: data
    };

    // Check if current step data exists and has content
    const hasStepData = currentStepData && (
      currentStepData.sections || 
      currentStepData.page?.status === 'Completed' ||
      currentStepData.progress !== undefined
    );

    // If step data is missing or empty, show AddCommentStep
    if (!hasStepData && currentStep > 0) {
      return <AddCommentStep {...stepProps} />;
    }

    // Map your known static steps
    const stepsMap = {
      1: Step1APSApplied,
      2: Step2APSApproval,
      3: Step3VisaApplication,
      4: Step4Biometrics,
      5: Step5VisaDecision,
      6: Step6VisaApproved,
    };

    // Determine which component to render
    let StepComponent;

    if (!currentStep || currentStep <= 0) {
      StepComponent = stepsMap[1];
    } 
    else if (currentStep > 6) {
      StepComponent = AddCommentStep;
    }
    else {
      StepComponent = stepsMap[currentStep] || stepsMap[1];
    }

    // Render the selected component
    return <StepComponent {...stepProps} />;
  };

  const getBannerStyles = () => {
    if (bannerData.type === 'success') {
      return 'bg-green-50 border-green-100 text-green-800';
    }
    return 'bg-orange-50 border-orange-100 text-orange-800';
  };

  const getBannerIconStyles = () => {
    if (bannerData.type === 'success') {
      return 'bg-green-600';
    }
    return 'bg-orange-600';
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

  // Show no application view if no API data and no fallback needed
  if (!apiData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-[1600px] mx-auto p-6">
          <NoApplicationView onStartApplication={handleStartApplication} />
        </main>
      </div>
    );
  }

  // Get steps for progress bar
  const progressSteps = data.steps || [];

  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto p-4">
        
        {/* Page Title */}
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

        {/* Progress Tracker */}
        {progressSteps.length > 0 && (
          <div className="bg-white p-6  border border-gray-200 shadow-sm mb-6 overflow-x-auto">
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

        {/* Banner - only show if title exists */}
        {bannerData.title && 
        <div className={`${getBannerStyles()}  p-4 mb-6 gap-4 border`}>
          <div className="flex items-start gap-3">
            <div className={`rounded-full p-1 ${bannerData?.type === 'success' ? 'bg-green-600' : 'bg-orange-600'}`}>
              <CheckCircle size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{bannerData?.title || "No banner title"}</h4>
              <p className="text-sm mt-0.5">{bannerData?.subtitle || "No banner subtitle"}</p>
            </div>
            {bannerData?.action && (
              <div>
                <button className="text-sm font-medium text-[#f56e45] bg-white px-3 py-1 rounded border border-orange-200">
                  {bannerData.action}
                </button>
                {bannerData?.fileUrl && (
                  <a
                    href={fileBaseurl(bannerData.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2 px-3 py-1"
                  >
                    <Download size={12} />
                    Download File
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        }

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Dynamic Content */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {renderStepContent()}
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Application Summary - with API data if available */}
            <div className="bg-white p-4  border border-gray-200 shadow-sm">
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
                  <span className="font-medium text-gray-800">{apiData._id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Course</span>
                  <span className="font-medium text-gray-800">{data.application?.course?.name || data.course?.name || "Computer Science"}</span>
                </div>
                {data.applicationId && (
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span className="text-gray-500">Application ID</span>
                    <span className="font-medium text-gray-800">{data.applicationId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Steps Card */}
            <div className="bg-white p-4  border border-gray-200 shadow-sm">
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

            {/* Quick Links */}
            <div className="bg-white p-4  border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Quick Links</h4>
              <div className="space-y-0.5">
                <QuickLinkItem item={{ icon: "HelpCircle", text: "Visa FAQ" }} />
                <QuickLinkItem item={{ icon: "FileText", text: "Document Checklist" }} />
                <QuickLinkItem item={{ icon: "Clock", text: "Processing Times" }} />
                <QuickLinkItem item={{ icon: "AlertCircle", text: "Track Application" }} />
              </div>
            </div>

            {/* Counselor */}
            <div className="bg-white p-4  border border-gray-200 shadow-sm">
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
                    <span className="text-[8px] text-gray-400">4.9 (128 students)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <button className="flex-1 p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-center"><MessageCircle size={14} className="text-gray-500" /></button>
                <button className="flex-1 p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-center"><Phone size={14} className="text-gray-500" /></button>
                <button className="flex-1 p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-center"><Mail size={14} className="text-gray-500" /></button>
              </div>
              <button className="w-full bg-[#f56e45] hover:bg-[#f56e45] text-white text-sm font-bold py-2 rounded-lg transition-colors">Message Counselor</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}