// app/visa-decision/Step-5
'use client';

import React from 'react';
import {
  BookOpen,
  Bell,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Download,
  FileText,
  User,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  Eye,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  Settings,
  CreditCard,
  FileCheck,
  Lock,
  Briefcase,
  GraduationCap,
  Globe,
  Edit3,
  UploadCloud,
  X,
  Trash2,
  Info,
  PlayCircle,
  Video,
  Home,
  Plane,
  Heart,
  BookOpen as BookOpenIcon,
  Check,
  AlertTriangle,
  Fingerprint,
  Camera,
  CreditCard as CreditCardIcon,
  Map as MapIcon,
  Calendar as CalendarIcon,
  FileOutput,
  Clock as ClockIcon,
  CheckCheck,
  RefreshCw,
  EyeOff,
  ThumbsUp,
  Search,
  FileSearch,
  FileSignature,
  FileDigit,
  FileBox
} from 'lucide-react';

// ============================================
// JSON DATA SOURCE
// ============================================

const dashboardData1 = {
  visaProcess: {
    title: "Visa Application",
    status: "Not Started",
    substatus: "Complete the APS process to unlock your visa application.",
    steps: [
      { label: "APS Applied", status: "Completed", date: "10 May 2024", isActive: false },
      { label: "APS Approval", status: "Pending", date: "", isActive: false },
      { label: "Visa Application", status: "Locked", date: "", isActive: true },
      { label: "Biometrics", status: "Locked", date: "", isActive: false },
      { label: "Visa Decision", status: "Locked", date: "", isActive: false },
      { label: "Visa Approved", status: "Locked", date: "", isActive: false }
    ],
    alert: {
      type: "info",
      title: "Your APS application is in progress.",
      message: "Complete your APS process to proceed with visa application.",
      action: "View APS Application"
    }
  },
  apsOverview: {
    updated: "09 Jul 2024",
    details: [
      { label: "APS Application No.", value: "APSI2416789" },
      { label: "Date of APS Application", value: "10 May 2024" },
      { label: "APS Status", value: "Under Review", highlight: true },
      { label: "Evaluating Authority", value: "TU Munich" },
      { label: "Degree", value: "Bachelor's Degree" },
      { label: "University", value: "ABC University" },
      { label: "Program", value: "MS in Data Science" },
      { label: "Year of Graduation", value: "2024" },
      { label: "Documents Submitted", value: "7 of 11" },
      { label: "Payment Status", value: "Paid", highlight: true },
      { label: "Estimated Result Date", value: "25 Jun 2024", colSpan: 2 }
    ]
  },
  whatIsAps: {
    title: "What is APS?",
    description: "APS (Akademische Prüfstelle) is a mandatory verification process for Indian students applying for a student visa to Germany.",
    items: [
      { icon: "FileText", text: "Verify your academic documents." },
      { icon: "CheckCircle", text: "Confirms the authenticity of your degree." },
      { icon: "User", text: "Required for German Student Visa." },
      { icon: "CheckCircle2", text: "Must be completed before visa application." }
    ]
  },
  preparationCards: [
    { icon: "FileText", title: "Gather Documents", desc: "Check the list of documents required for visa.", btnText: "View Checklist" },
    { icon: "BookOpen", title: "Learn Process", desc: "Understand the visa application process.", btnText: "View Guide" },
    { icon: "CreditCard", title: "Calculate Expenses", desc: "Estimate your total expenses in Germany.", btnText: "Calculate Now" },
    { icon: "Bookmark", title: "Book Consultation", desc: "Talk to our experts for personal guidance.", btnText: "Book Now" }
  ],
  requiredDocuments: {
    title: "Required Documents for Visa (Preview)",
    columns: [
      [
        { label: "Passport", status: "To be uploaded", action: "To be uploaded" },
        { label: "APS Certificate", status: "In Progress", action: "To be uploaded" },
        { label: "University Admission Letter", status: "Completed", action: "Uploaded" },
        { label: "Financial Documents", status: "In Progress", action: "To be uploaded" },
        { label: "Proof of Accommodation", status: "Not required", action: "Not required" }
      ],
      [
        { label: "Health Insurance", status: "In Progress", action: "To be uploaded" },
        { label: "CV / Resume", status: "To be uploaded", action: "To be uploaded" },
        { label: "Visa Application Form", status: "To be uploaded", action: "To be uploaded" },
        { label: "Application Fee Receipt", status: "To be uploaded", action: "To be uploaded" },
        { label: "SOP / Motivation Letter", status: "To be uploaded", action: "To be uploaded" }
      ]
    ]
  },
  applicationSummary: {
    title: "Visa Application Summary",
    fields: [
      { label: "Country", value: "Germany" },
      { label: "University", value: "TU Munich" },
      { label: "Program", value: "MS in Data Science" },
      { label: "Intake", value: "Fall 2026" },
      { label: "Visa Type", value: "Student Visa (D)" },
      { label: "Visa Category", value: "National Visa (D)" },
      { label: "Application No.", value: "-" },
      { label: "Tracking ID", value: "-" },
      { label: "Date Started", value: "-" },
      { label: "Status", value: "APS is In Progress" }
    ]
  },
  counselor: {
    name: "Priya Mehta",
    role: "Visa Counselor",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  statsFooter: [
    { value: "4 - 6 Weeks", label: "APS Processing Time" },
    { value: "15 - 30 Working Days", label: "Visa Processing Time" },
    { value: "€75 (Non-refundable)", label: "Visa Fee (Approx.)" },
    { value: "Apply Early", label: "At least 3 months before intake" }
  ]
};


const dashboardData2 = {
  page: {
    title: "APS Approval",
    status: "Completed",
    subtitle: "Congratulations! Your APS certificate has been approved.",
    breadcrumbs: ["My Journey", "Visa Process", "APS Approval"]
  },
  user: {
    name: "Ananya Sharma",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  steps: [
    { id: 1, label: "APS Applied", status: "Completed", date: "10 May 2024", isActive: false },
    { id: 2, label: "APS Approval", status: "Completed", date: "28 May 2024", isActive: true },
    { id: 3, label: "Visa Application", status: "Pending", date: "", isActive: false },
    { id: 4, label: "Biometrics", status: "Pending", date: "", isActive: false },
    { id: 5, label: "Visa Decision", status: "Pending", date: "", isActive: false },
    { id: 6, label: "Visa Approval", status: "Pending", date: "", isActive: false }
  ],
  banner: {
    type: "success",
    title: "Your APS certificate has been approved!",
    subtitle: "You are now eligible to apply for your student visa.",
    buttonText: "View Certificate",
    buttonIcon: "Download"
  },
  sections: {
    approvalDetails: {
      title: "1. APS Approval Details",
      items: [
        { icon: "User", label: "Application Type", value: "Individual" },
        { icon: "FileText", label: "Reference / Tracking ID", value: "APS123456789" },
        { icon: "FileCheck", label: "Certificate No.", value: "APS-DE-2024-001234" },
        { icon: "Globe", label: "Country", value: "🇩🇪 Germany", isFlag: true },
        { icon: "Calendar", label: "Date Applied", value: "10 May 2024" },
        { icon: "CheckCircle", label: "Status", value: "Approved", isHighlight: true },
        { icon: "Building2", label: "University", value: "TU Munich" },
        { icon: "Calendar", label: "Date Approved", value: "28 May 2024" },
        { icon: "Shield", label: "Approved By", value: "APS Germany" }
      ],
      certificate: {
        title: "APS Certificate",
        status: "Approved"
      }
    },
    whatHappensNext: {
      title: "2. What Happens Next?",
      description: "You can now proceed with your visa application. Make sure to submit your application within the visa validity period.",
      steps: [
        { icon: "FileText", title: "1. Visa Application", description: "Fill and submit your student visa application." },
        { icon: "User", title: "2. Biometrics", description: "Book and attend your biometrics appointment." },
        { icon: "Clock", title: "3. Visa Decision", description: "Your application will be reviewed by the embassy." },
        { icon: "CheckCircle2", title: "4. Visa Approved", description: "Once approved, you will receive your visa." }
      ],
      actionButton: "Start Visa Application"
    },
    documents: {
      title: "3. Documents Submitted for APS",
      columns: ["Document Name", "Status", "Remarks"],
      rows: [
        { name: "Passport Copy (First & Last Page)", status: "Verified", remarks: "Accepted" },
        { name: "Academic Transcripts", status: "Verified", remarks: "Accepted" },
        { name: "Degree Certificate / Provisional Certificate", status: "Verified", remarks: "Accepted" },
        { name: "IELTS / English Proficiency Certificate", status: "Verified", remarks: "Accepted" },
        { name: "CV / Resume", status: "Verified", remarks: "Accepted" },
        { name: "APS Application Form", status: "Verified", remarks: "Accepted" },
        { name: "Statement of Purpose (SOP)", status: "Verified", remarks: "Accepted" }
      ],
      buttonText: "View All Submitted Documents"
    }
  },
  sidebar: {
    summary: {
      title: "Application Summary",
      editLabel: "Edit",
      fields: [
        { label: "Country", value: "🇩🇪 Germany", isFlag: true },
        { label: "University", value: "TU Munich" },
        { label: "Program", value: "MS in Data Science" },
        { label: "Intake", value: "Fall 2026" },
        { label: "Application No.", value: "APS123456789" },
        { label: "Date Applied", value: "10 May 2024" },
        { label: "Date Approved", value: "28 May 2024" },
        { label: "Status", value: "Approved", isHighlight: true }
      ]
    },
    statusTimeline: {
      title: "APS Approval Status",
      items: [
        { title: "Application Submitted", date: "10 May 2024", status: "Completed" },
        { title: "Under Review", date: "15 May 2024", status: "Completed" },
        { title: "Documents Verified", date: "22 May 2024", status: "Completed" },
        { title: "APS Approved", date: "28 May 2024", status: "Completed", isActive: true }
      ]
    },
    guide: {
      title: "APS Guide",
      viewAll: "View All",
      items: [
        { icon: "HelpCircle", title: "What is APS?", subtitle: "Learn about APS" },
        { icon: "FileText", title: "APS Process Explained", subtitle: "Step by step process" },
        { icon: "FileCheck", title: "Documents Required", subtitle: "Check document list" },
        { icon: "AlertCircle", title: "APS Evaluation Criteria", subtitle: "How documents are evaluated" },
        { icon: "Clock", title: "Processing Time", subtitle: "How long does it take?" },
        { icon: "ThumbsUp", title: "Tips for Smooth Approval", subtitle: "Important guidelines" }
      ]
    },
    counselor: {
      title: "Need Help?",
      name: "Priya Mehta",
      role: "Study Abroad Expert",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: "4.8",
      students: "128",
      buttons: ["Chat", "Call", "Email"],
      actionButton: "Chat with Counselor"
    }
  },
  footer: {
    processingTime: "4 - 6 Weeks",
    visaTime: "15 - 30 Working Days",
    visaFee: "€75 (Non-refundable)",
    applyEarly: "Apply Early"
  }
};


const dashboardData3 = {
  page: {
    title: "Visa Application",
    status: "In Progress",
    subtitle: "Complete and submit your visa application for processing.",
    breadcrumbs: ["My Journey", "Visa Process", "Visa Application"]
  },
  user: {
    name: "Ananya Sharma",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  steps: [
    { id: 1, label: "APS Applied", status: "Completed", date: "10 May 2024", isActive: false },
    { id: 2, label: "APS Approval", status: "Completed", date: "28 May 2024", isActive: false },
    { id: 3, label: "Visa Application", status: "In Progress", date: "", isActive: true },
    { id: 4, label: "Biometrics", status: "Upcoming", date: "", isActive: false },
    { id: 5, label: "Visa Decision", status: "Upcoming", date: "", isActive: false },
    { id: 6, label: "Visa Approval", status: "Upcoming", date: "", isActive: false }
  ],
  banner: {
    type: "info",
    title: "You can now complete and submit your visa application.",
    subtitle: "Please fill in all the required details accurately and upload the necessary documents.",
    buttonText: "View Full Timeline"
  },
  progress: 72,
  sections: {
    applicationInfo: {
      title: "Application Information",
      editLabel: "Edit",
      items: [
        { icon: "User", label: "Visa Type", value: "Student Visa (D)" },
        { icon: "FileCheck", label: "Visa Category", value: "National Visa (D)" },
        { icon: "Globe", label: "Country", value: "Germany" },
        { icon: "Briefcase", label: "Purpose of Stay", value: "Higher Education" },
        { icon: "Calendar", label: "Intake", value: "Fall 2026" },
        { icon: "Building2", label: "University", value: "TU Munich" },
        { icon: "FileText", label: "Program", value: "MS in Data Science" },
        { icon: "Clock", label: "Duration of Stay", value: "24 Months" },
        { icon: "CreditCard", label: "Application Fee", value: "€750", isHighlight: true },
        { icon: "CheckCircle", label: "Payment Status", value: "Paid" },
        { icon: "FileCheck", label: "Application No.", value: "APS123456789" },
        { icon: "User", label: "Tracking ID", value: "APS123456789" },
        { icon: "Calendar", label: "Date Started", value: "10 May 2024" },
        { icon: "Building2", label: "Embassy Assigned", value: "German Embassy, New Delhi" },
        { icon: "Globe", label: "Application Method", value: "Online" },
        { icon: "Clock", label: "Current Status", value: "In Progress" }
      ]
    },
    personalInfo: {
      title: "Personal Information",
      editLabel: "Edit",
      items: [
        { label: "Full Name", value: "Ananya Sharma" },
        { label: "Date of Birth", value: "12 Aug 2002" },
        { label: "Gender", value: "Female" },
        { label: "Nationality", value: "Indian" },
        { label: "Passport No.", value: "A1234567" },
        { label: "Passport Expiry", value: "15 Dec 2027" },
        { label: "Place of Birth", value: "New Delhi, India" },
        { label: "Marital Status", value: "Single" },
        { label: "Phone Number", value: "+91 9876543210" },
        { label: "WhatsApp Number", value: "+91 9876543210" },
        { label: "Email Address", value: "ananya.sharma@email.com" },
        { label: "Current Address", value: "Bangalore, Karnataka, India" },
        { label: "Permanent Address", value: "Bangalore, Karnataka, India" }
      ]
    },
    familyInfo: {
      title: "Family Information",
      editLabel: "Edit",
      father: {
        name: "Rajesh Sharma",
        occupation: "Business",
        phone: "+91 9876543210"
      },
      mother: {
        name: "Neha Sharma",
        occupation: "Homemaker",
        phone: ""
      }
    },
    travelInfo: {
      title: "Travel Information",
      editLabel: "Edit",
      items: [
        { label: "Intended Date of Entry", value: "15 Sep 2026" },
        { label: "Intended Length of Stay", value: "24 Months" },
        { label: "Port of Entry", value: "Frankfurt Airport" },
        { label: "Accommodation in Germany", value: "Student Accommodation" },
        { label: "Previous Travel", value: "No" },
        { label: "Previous Visa Refusal", value: "No" },
        { label: "Visa Refusal Details", value: "N/A" },
        { label: "Emergency Contact", value: "+91 9876543210" },
        { label: "Emergency Contact Name", value: "Rajesh Sharma" }
      ]
    },
    academicInfo: {
      title: "Academic Information",
      editLabel: "Edit",
      items: [
        { label: "Highest Qualification", value: "Bachelor's Degree" },
        { label: "Institution Name", value: "ABC University" },
        { label: "Course Name", value: "Computer Science" },
        { label: "University Registration", value: "ABC University" },
        { label: "Year of Graduation", value: "2024" },
        { label: "Percentage / CGPA", value: "8.5" },
        { label: "Language Proficiency", value: "IELTS - 7.5 Overall" },
        { label: "German Language", value: "A1" },
        { label: "APS Certificate No.", value: "APS87654321" },
        { label: "Admission Letter Status", value: "Received" }
      ]
    },
    financialInfo: {
      title: "Financial Information",
      editLabel: "Edit",
      items: [
        { label: "Blocked Account", value: "DE89370400440532013000" },
        { label: "Blocked Account No.", value: "1234567890" },
        { label: "Amount Deposited", value: "€11,208" },
        { label: "Education Loan", value: "No" },
        { label: "Loan Amount", value: "N/A" },
        { label: "Sponsor Name", value: "Rajesh Sharma (Father)" },
        { label: "Tuition Fee Paid", value: "€5,000" },
        { label: "Living Expenses Paid", value: "€6,208" },
        { label: "Financial Documents", value: "Uploaded" },
        { label: "Health Insurance", value: "Uploaded" }
      ]
    },
    documents: {
      title: "Documents Uploaded",
      viewAll: "View All",
      rows: [
        { name: "Passport (First & Last Page)", status: "Uploaded", date: "10 May 2024", size: "1.2 MB", action: "view" },
        { name: "APS Certificate", status: "Uploaded", date: "10 May 2024", size: "850 KB", action: "view" },
        { name: "University Admission Letter", status: "Uploaded", date: "10 May 2024", size: "1.5 MB", action: "view" },
        { name: "Financial Documents (Blocked Account)", status: "Uploaded", date: "10 May 2024", size: "2.1 MB", action: "view" },
        { name: "Proof of Accommodation", status: "Pending", date: "10 May 2024", size: "-", action: "upload" },
        { name: "CV / Resume", status: "Uploaded", date: "10 May 2024", size: "450 KB", action: "view" },
        { name: "Academic Transcripts", status: "Uploaded", date: "10 May 2024", size: "3.2 MB", action: "view" },
        { name: "IELTS Score Card", status: "Uploaded", date: "10 May 2024", size: "600 KB", action: "view" },
        { name: "Health Insurance", status: "Uploaded", date: "10 May 2024", size: "850 KB", action: "view" },
        { name: "Visa Application Form", status: "Pending", date: "10 May 2024", size: "-", action: "upload" },
        { name: "Application Fee Receipt", status: "Completed", date: "10 May 2024", size: "120 KB", action: "view" }
      ]
    },
    declarations: {
      title: "Declaration",
      checkboxText: "I declare that all information provided in this application is true and correct to the best of my knowledge.",
      date: "20 May 2024",
      name: "Ananya Sharma"
    }
  },
  sidebar: {
    summary: {
      title: "Visa Application Summary",
      editLabel: "Edit",
      fields: [
        { label: "Country", value: "Germany" },
        { label: "University", value: "TU Munich" },
        { label: "Program", value: "MS in Data Science" },
        { label: "Intake", value: "Fall 2026" },
        { label: "Visa Type", value: "Student Visa (D)" },
        { label: "Visa Category", value: "National Visa (D)" },
        { label: "Application No.", value: "VA202406501001" },
        { label: "Tracking ID", value: "APS123456789" },
        { label: "Date Started", value: "10 May 2024" },
        { label: "Last Updated", value: "20 May 2024 11:30 AM" },
        { label: "Status", value: "In Progress", isHighlight: true },
        { label: "Embassy", value: "German Embassy, New Delhi" },
        { label: "VFS Center", value: "VFS Global, New Delhi" }
      ]
    },
    progressSteps: [
      { label: "Personal Information", status: "Completed", icon: "User" },
      { label: "Travel Information", status: "Completed", icon: "Plane" },
      { label: "Academic Information", status: "Completed", icon: "GraduationCap" },
      { label: "Family Information", status: "Completed", icon: "Home" },
      { label: "Financial Information", status: "Completed", icon: "CreditCard" },
      { label: "Documents Uploaded", status: "In Progress", icon: "UploadCloud" },
      { label: "Declaration", status: "Pending", icon: "CheckCircle" },
      { label: "Final Submission", status: "Pending", icon: "CheckCircle" }
    ],
    guide: {
      title: "Visa Guide",
      viewAll: "View All",
      items: [
        { icon: "FileText", title: "How to Fill Visa Application Form", subtitle: "Step by step guide" },
        { icon: "FileCheck", title: "Documents Required", subtitle: "List of required documents" },
        { icon: "Camera", title: "Photo Requirements", subtitle: "Check photo specifications" },
        { icon: "Video", title: "Visa Interview Guide", subtitle: "Prepare for your interview" },
        { icon: "AlertCircle", title: "Common Rejection Reasons", subtitle: "Avoid common mistakes" },
        { icon: "Clock", title: "Processing Time", subtitle: "How long does it take?" },
        { icon: "Info", title: "Do's & Don'ts", subtitle: "Important guidelines" },
        { icon: "BookOpen", title: "Germany Living Guide", subtitle: "Prepare for your stay" },
        { icon: "Shield", title: "Embassy Rules", subtitle: "Important embassy rules" },
        { icon: "FileText", title: "Biometrics Guide", subtitle: "Biometrics process" }
      ]
    },
    counselor: {
      title: "Need Help?",
      name: "Priya Mehta",
      role: "Visa Counselor",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: "4.8",
      students: "128",
      actionButton: "Chat with Counselor"
    }
  },
  footer: {
    processingTime: "4 - 6 Weeks",
    visaTime: "15 - 30 Working Days",
    visaFee: "€75 (Non-refundable)",
    applyEarly: "Apply Early"
  }
};


const dashboardData4 = {
  page: {
    title: "Biometrics Appointment",
    status: "Scheduled",
    subtitle: "Complete your biometrics appointment and track status.",
    breadcrumbs: ["My Journey", "Visa Process", "Biometrics"]
  },
  user: {
    name: "Ananya Sharma",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  steps: [
    { id: 1, label: "APS Applied", status: "Completed", date: "10 May 2024", isActive: false },
    { id: 2, label: "APS Approval", status: "Completed", date: "28 May 2024", isActive: false },
    { id: 3, label: "Visa Application", status: "Completed", date: "30 May 2024", isActive: false },
    { id: 4, label: "Biometrics", status: "Scheduled", date: "30 May 2024", isActive: true },
    { id: 5, label: "Visa Decision", status: "Upcoming", date: "", isActive: false },
    { id: 6, label: "Visa Approval", status: "Upcoming", date: "", isActive: false }
  ],
  banner: {
    type: "info",
    title: "Your biometrics appointment is confirmed.",
    subtitle: "Please check the details below and follow all instructions carefully.",
    primaryAction: "Reschedule",
    secondaryAction: "Download Appointment Letter"
  },
  sections: {
    appointmentDetails: {
      title: "1. Appointment Details",
      items: [
        { label: "Appointment Date", value: "30 May 2024", icon: "Calendar" },
        { label: "Appointment Time", value: "10:30 AM", icon: "Clock" },
        { label: "Center Name", value: "VFS Global - New Delhi", icon: "Building2" },
        { label: "Reference / Booking ID", value: "DEL1234567890", icon: "FileText" },
        { label: "Center Address", value: "VFS Global, 1st Floor, Shivaji Stadium Metro Station, Connaught Place, New Delhi - 110001", icon: "MapPin", fullWidth: true },
        { label: "Contact Number", value: "+91 11 4263 0303", icon: "Phone" },
        { label: "Email", value: "infodelhi@vfshelpline.com", icon: "Mail" },
        { label: "Working Hours", value: "08:00 AM - 05:00 PM (Mon - Sat)", icon: "Clock" }
      ],
      infoCards: [
        { label: "Visa Type", value: "Student Visa (D)" },
        { label: "Country", value: "Germany" },
        { label: "Application No.", value: "VA202406501001" },
        { label: "Passport No.", value: "A1234567" },
        { label: "Status", value: "Scheduled" },
        { label: "Reschedule Available", value: "Yes (Before 28 May 2024)" },
        { label: "Cancel Available", value: "Yes (Before 28 May 2024)" },
        { label: "Fees Paid", value: "INR 1,650", isHighlight: true }
      ]
    },
    whatIsBiometrics: {
      title: "2. What is Biometrics?",
      description: "Biometrics is the process of capturing your fingerprints and photograph as per the embassy requirements. This is a mandatory step for visa processing.",
      watchButton: "Watch Video"
    },
    documentsToCarry: {
      title: "3. Documents to Carry",
      items: [
        "Passport (Original)",
        "Biometrics Appointment Confirmation Letter",
        "Visa Application Form",
        "Recent Passport Size Photographs (2)",
        "Any documents requested by VFS / Embassy"
      ],
      note: "Note: All documents must be original. Photocopies are not required unless requested."
    },
    biometricsProcess: {
      title: "4. Biometrics Process",
      steps: [
        { title: "Document Verification", description: "Your documents will be verified by the officer." },
        { title: "Photograph Capture", description: "Your photograph will be taken." },
        { title: "Fingerprint Capture", description: "Your fingerprints (10 fingers) will be scanned." },
        { title: "Process Completed", description: "You will receive a confirmation slip." }
      ]
    },
    beforeYouGo: {
      title: "5. Before You Go",
      items: [
        { text: "Do not apply hand cream or makeup before appointment.", icon: "Hand" },
        { text: "Make sure your fingers are clean and dry.", icon: "Drop" },
        { text: "Wear proper attire for photograph.", icon: "Shirt" },
        { text: "Carry Original Passport & Documents.", icon: "FileText" },
        { text: "Do not forget your appointment confirmation.", icon: "FileCheck" }
      ]
    },
    feesDetails: {
      title: "6. Fees Details",
      items: [
        { description: "Biometrics Fee (VFS)", amount: "1,650", status: "Paid" },
        { description: "Service Charge", amount: "550", status: "Paid" },
        { description: "VAT / Service Tax", amount: "0", status: "Paid" },
        { description: "Total", amount: "1,650", status: "Paid", isTotal: true }
      ],
      paymentDate: "22 May 2024",
      paymentMode: "Online (Debit/Credit)"
    },
    appointmentHistory: {
      title: "7. Appointment History",
      items: [
        { date: "22 May 2024", time: "09:15 AM", status: "Appointment Booked" },
        { date: "22 May 2024", time: "09:20 AM", status: "Visa Application Submitted" },
        { date: "22 May 2024", time: "09:25 AM", status: "Fees Paid" },
        { date: "30 May 2024", time: "10:30 AM", status: "Appointment Scheduled" }
      ]
    },
    afterBiometrics: {
      title: "8. Post Biometrics - What Happens Next?",
      steps: [
        { title: "Biometrics Submitted", description: "Your biometrics will be submitted to the embassy.", icon: "Fingerprint" },
        { title: "Data Verification", description: "Embassy will verify your information.", icon: "FileCheck" },
        { title: "Background Check", description: "Your application goes through background verification.", icon: "Shield" },
        { title: "Visa Decision", description: "Embassy will make a decision on your visa.", icon: "CheckCircle" },
        { title: "Passport Collection", description: "You will be notified once your passport is ready for collection.", icon: "FileOutput" }
      ]
    },
    declaration: {
      title: "Declaration",
      checkboxText: "I declare that I have read and understood all the instructions for biometrics appointment. All the information provided by me is true and correct.",
      date: "22 May 2024",
      name: "Ananya Sharma"
    }
  },
  sidebar: {
    summary: {
      title: "Application Summary",
      editLabel: "Edit",
      fields: [
        { label: "Country", value: "Germany" },
        { label: "Visa Type", value: "Student Visa (D)" },
        { label: "Application No.", value: "VA202406501001" },
        { label: "Name", value: "Ananya Sharma" },
        { label: "Date of Birth", value: "12 Aug 2002" },
        { label: "Passport No.", value: "A1234567" },
        { label: "Date of Application", value: "10 May 2024" },
        { label: "Application Status", value: "In Progress", isHighlight: true }
      ]
    },
    progressSteps: [
      { label: "Biometrics Appointment", status: "Completed", icon: "CheckCircle" },
      { label: "Documents Prepared", status: "Completed", icon: "FileText" },
      { label: "Fees Paid", status: "Completed", icon: "CreditCard" },
      { label: "Appointment Confirmed", status: "Completed", icon: "CheckCircle" },
      { label: "Biometrics Completed", status: "Pending", icon: "Clock" }
    ],
    importantInfo: {
      title: "Important Information",
      items: [
        "Please reach the center 15 minutes before your appointment time.",
        "Lateness may not be allowed to attend the appointment.",
        "Mobile phones and electronic gadgets are not allowed inside the center.",
        "Biometric data once captured is valid for 59 months.",
        "Children below 12 years may be exempted from fingerprint capture."
      ]
    },
    counselor: {
      title: "Need Help?",
      name: "Priya Mehta",
      role: "Visa Counselor",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: "4.8",
      students: "128",
      actionButton: "Chat with Counselor"
    },
    quickLinks: {
      title: "Quick Links",
      items: [
        "VFS Global Website",
        "Check Appointment",
        "Reschedule Appointment",
        "Cancel Appointment",
        "VFS Center Locator",
        "Download Guidelines"
      ]
    }
  },
  footer: {
    processingTime: "4 - 6 Weeks",
    visaTime: "15 - 30 Working Days",
    visaFee: "€75 (Non-refundable)",
    applyEarly: "Apply Early"
  }
};


const dashboardData = {
  page: {
    title: "Visa Decision",
    status: "Under Review by Embassy",
    subtitle: "The embassy is currently reviewing your application. Please track the status below.",
    breadcrumbs: ["My Journey", "Visa Process", "Visa Decision"]
  },
  user: {
    name: "Ananya Sharma",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  steps: [
    { id: 1, label: "APS Applied", status: "Completed", date: "10 May 2024", isActive: false },
    { id: 2, label: "APS Approval", status: "Completed", date: "28 May 2024", isActive: false },
    { id: 3, label: "Visa Application", status: "Completed", date: "30 May 2024", isActive: false },
    { id: 4, label: "Biometrics", status: "Completed", date: "10 Jun 2024", isActive: false },
    { id: 5, label: "Visa Decision", status: "Under Review", date: "", isActive: true },
    { id: 6, label: "Visa Approval", status: "Upcoming", date: "", isActive: false }
  ],
  banner: {
    type: "info",
    title: "Your application is under review by the German Embassy.",
    subtitle: "This usually takes 15 - 20 working days. You will be notified via email & SMS once a decision is made.",
    action: "View Embassy Update"
  },
  sections: {
    applicationDetails: {
      title: "Application Details",
      items: [
        { label: "Visa Type", value: "Student Visa (D)", icon: "User" },
        { label: "Country", value: "Germany", icon: "Globe", isFlag: true },
        { label: "Application No.", value: "VA202406501001", icon: "FileText" },
        { label: "Tracking ID", value: "APS123456789", icon: "FileSearch" },
        { label: "Applicant Name", value: "Ananya Sharma", icon: "User" },
        { label: "Date of Birth", value: "12 Aug 2002", icon: "Calendar" },
        { label: "Passport No.", value: "A1234567", icon: "FileCheck" },
        { label: "Date of Application", value: "10 May 2024", icon: "Calendar" },
        { label: "University", value: "TU Munich", icon: "Building2" },
        { label: "Program", value: "MS in Data Science", icon: "FileText" },
        { label: "Intake", value: "Fall 2026", icon: "Calendar" },
        { label: "Status", value: "Under Review", icon: "Clock", isHighlight: true },
        { label: "Embassy", value: "German Embassy, New Delhi", icon: "Building2" },
        { label: "VFS Center", value: "VFS Global, New Delhi", icon: "MapPin" },
        { label: "Last Updated", value: "20 May 2024 11:30 AM", icon: "Clock" },
        { label: "Assigned Officer", value: "-", icon: "User" }
      ]
    },
    currentStatus: {
      title: "Current Status",
      status: "Application Under Review",
      description: "Your application is being processed by the visa officer. Please do not contact the embassy during this time.",
      details: [
        { label: "Application received at embassy", value: "10 May 2024" },
        { label: "Estimated Decision Date", value: "05 Jun 2024" },
        { label: "Days Elapsed", value: "5 Days" },
        { label: "Maximum Processing Time", value: "30 Working Days" }
      ]
    },
    decisionTimeline: {
      title: "Decision Timeline",
      items: [
        { label: "Application Submitted", date: "10 May 2024", status: "completed", description: "Your visa application has been submitted successfully." },
        { label: "Application Received by Embassy", date: "15 May 2024", status: "completed", description: "Your application has been received by the embassy." },
        { label: "Under Review", date: "20 May 2024", status: "active", description: "Your application is under review by the visa officer." },
        { label: "Decision Pending", date: "", status: "pending", description: "The decision will be taken after document verification." },
        { label: "Decision Communicated", date: "", status: "pending", description: "You will be notified once the decision is available." },
        { label: "Passport Collection", date: "", status: "pending", description: "Collect your passport from the VFS center." }
      ]
    },
    whatHappensNext: {
      title: "What Happens Next?",
      steps: [
        { title: "Document Verification", description: "Your documents will be verified by the embassy." },
        { title: "Background Check", description: "Your background will be verified." },
        { title: "Final Decision", description: "The embassy will make a decision on your visa." },
        { title: "Decision Notification", description: "You will be notified via email/SMS." },
        { title: "Passport Return", description: "Your passport will be returned via VFS." }
      ],
      importantNote: {
        title: "Important Note",
        items: [
          "Please keep your passport valid.",
          "Do not book travel tickets until visa is approved.",
          "Keep checking your email for updates."
        ]
      }
    },
    submittedDocuments: {
      title: "Submitted Documents (11/11)",
      columns: ["Document Name", "Status", "Submitted On", "Remarks"],
      rows: [
        { name: "Passport (First & Last Page)", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "APS Certificate", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "University Admission Letter", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Financial Documents (Blocked Account)", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Proof of Accommodation", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "CV / Resume", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Academic Transcripts", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "IELTS Score Card", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Health Insurance", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Visa Application Form", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Application Fee Receipt", status: "Verified", date: "10 May 2024", remarks: "Accepted" }
      ]
    },
    embassyUpdate: {
      title: "Embassy Update",
      viewAll: "View All",
      items: [
        { date: "20 May 2024 11:30 AM", status: "Current Status", description: "Your application is under review by the visa officer. We will update you once the decision is made." },
        { date: "15 May 2024 10:45 AM", status: "Update", description: "Your application has been received by the embassy." },
        { date: "10 May 2024 02:00 PM", status: "Update", description: "Your application has been submitted successfully." }
      ]
    },
    declaration: {
      title: "Declaration",
      checkboxText: "I understand that my application is under review and the decision is at the sole discretion of the embassy. I will abide by the official outcome regarding the decision.",
      date: "20 May 2024",
      name: "Ananya Sharma"
    }
  },
  sidebar: {
    summary: {
      title: "Application Summary",
      editLabel: "Edit",
      fields: [
        { label: "Country", value: "Germany", isFlag: true },
        { label: "University", value: "TU Munich" },
        { label: "Program", value: "MS in Data Science" },
        { label: "Intake", value: "Fall 2026" },
        { label: "Visa Type", value: "Student Visa (D)" },
        { label: "Visa Category", value: "National Visa (D)" },
        { label: "Application No.", value: "VA202406501001" },
        { label: "Tracking ID", value: "APS123456789" },
        { label: "Date Started", value: "10 May 2024" },
        { label: "Last Updated", value: "20 May 2024 11:30 AM" },
        { label: "Current Status", value: "Under Review", isHighlight: true },
        { label: "Embassy", value: "German Embassy, New Delhi" },
        { label: "VFS Center", value: "VFS Global, New Delhi" }
      ]
    },
    progressSteps: [
      { label: "APS Applied", status: "Completed" },
      { label: "APS Approval", status: "Completed" },
      { label: "Visa Application", status: "Completed" },
      { label: "Biometrics", status: "Completed" },
      { label: "Visa Decision", status: "Under Review" },
      { label: "Visa Approval", status: "Upcoming" }
    ],
    counselor: {
      title: "Need Help?",
      name: "Priya Mehta",
      role: "Visa Counselor",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: "4.8",
      students: "128",
      actionButton: "Chat with Counselor"
    },
    quickLinks: {
      title: "Quick Links",
      items: [
        { text: "Check Application Status", icon: "CheckCircle" },
        { text: "View Submitted Documents", icon: "FileText" },
        { text: "Track via Email / SMS", icon: "Mail" },
        { text: "Contact Embassy", icon: "Phone" },
        { text: "Download Guidelines", icon: "Download" },
        { text: "Visa Processing Time", icon: "Clock" }
      ]
    }
  },
  footer: {
    processingTime: "4 - 6 Weeks",
    visaTime: "15 - 30 Working Days",
    visaFee: "€75 (Non-refundable)",
    applyEarly: "Apply Early"
  }
};


const dashboardData6 = {
  page: {
    title: "Visa Approved",
    status: "Approved",
    subtitle: "Congratulations! Your visa has been approved.",
    breadcrumbs: ["My Journey", "Visa Process", "Visa Approved"]
  },
  user: {
    name: "Ananya Sharma",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  steps: [
    { id: 1, label: "APS Applied", status: "Completed", date: "10 May 2024", isActive: false },
    { id: 2, label: "APS Approval", status: "Completed", date: "28 May 2024", isActive: false },
    { id: 3, label: "Visa Application", status: "Completed", date: "30 May 2024", isActive: false },
    { id: 4, label: "Biometrics", status: "Completed", date: "10 Jun 2024", isActive: false },
    { id: 5, label: "Visa Decision", status: "Completed", date: "05 Jun 2024", isActive: false },
    { id: 6, label: "Visa Approved", status: "Completed", date: "07 Jun 2024", isActive: true }
  ],
  banner: {
    type: "success",
    title: "Your visa has been approved!",
    subtitle: "Please check your visa details below and follow the instructions to collect your passport.",
    action: "Download Visa Approval Letter"
  },
  sections: {
    visaApprovalDetails: {
      title: "Visa Approval Details",
      items: [
        { label: "Visa Status", value: "Approved", icon: "CheckCircle", isHighlight: true },
        { label: "Visa Type", value: "Student Visa (D)", icon: "User" },
        { label: "Visa Category", value: "National Visa (D)", icon: "FileCheck" },
        { label: "Country", value: "Germany", icon: "Globe", isFlag: true },
        { label: "Application No.", value: "VA202406501001", icon: "FileText" },
        { label: "Visa Number", value: "VIS123456789", icon: "FileSearch" },
        { label: "Tracking ID", value: "APS123456789", icon: "FileCheck" },
        { label: "Passport No.", value: "A1234567", icon: "FileCheck" },
        { label: "Date of Birth", value: "12 Aug 2002", icon: "Calendar" },
        { label: "Validity From", value: "15 Jun 2024", icon: "Calendar" },
        { label: "Validity Till", value: "14 Sep 2026", icon: "Calendar" },
        { label: "Duration of Stay", value: "2 Years 3 Months", icon: "Clock" },
        { label: "Number of Entries", value: "Multiple", icon: "CheckCheckIcon" },
        { label: "Issued On", value: "05 Jun 2024", icon: "Calendar" },
        { label: "Issued At", value: "German Embassy, New Delhi", icon: "Building2" },
        { label: "Collection Location", value: "VFS Global, New Delhi", icon: "MapPin" },
        { label: "Passport Collection By", value: "15 Jun 2024", icon: "Calendar" },
        { label: "Remarks", value: "Approved", icon: "MessageCircle" }
      ]
    },
    congratulations: {
      title: "Congratulations!",
      message: "Your hard work and effort have paid off! We are proud to be a part of your journey. Wishing you a successful and bright future in Germany!",
      icon: "Award"
    },
    whatHappensNext: {
      title: "What Happens Next?",
      steps: [
        { title: "Collect your passport from VFS center.", icon: "FileOutput" },
        { title: "Plan your travel to Germany.", icon: "Plane" },
        { title: "Prepare for your journey.", icon: "Briefcase" },
        { title: "Start your academic journey.", icon: "GraduationCap" }
      ]
    },
    visaDetails: {
      title: "Visa Details",
      items: [
        { label: "Purpose of Stay", value: "Higher Education" },
        { label: "University", value: "TU Munich" },
        { label: "Program", value: "MS in Data Science" },
        { label: "Intake", value: "Fall 2026" },
        { label: "Place of Study", value: "Munich, Germany" },
        { label: "Language of Instruction", value: "English" },
        { label: "Financial Proof Verified", value: "Yes" },
        { label: "Medical Insurance", value: "Required" },
        { label: "Accommodation Status", value: "Arranged after arrival" },
        { label: "Blocked Account Verified", value: "Yes" },
        { label: "APS Certificate No.", value: "APS87654321" },
        { label: "Health Insurance Validity", value: "15 Jun 2024 to 14 Sep 2026" }
      ]
    },
    passportCollection: {
      title: "Passport Collection Details",
      items: [
        { label: "Collection Location", value: "VFS Global, New Delhi" },
        { label: "Collection Date", value: "05 Jun 2024" },
        { label: "Collection Time", value: "08:00 AM - 05:00 PM" },
        { label: "Original ID Proof", value: "Required" }
      ],
      note: "Please carry your original ID proof and appointment confirmation while collecting your passport."
    },
    documentsSummary: {
      title: "Documents Summary (11/11)",
      columns: ["Document Name", "Status", "Submitted On", "Remarks"],
      rows: [
        { name: "Passport (First & Last Page)", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "APS Certificate", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "University Admission Letter", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Financial Documents (Blocked Account)", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Proof of Accommodation", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "CV / Resume", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Academic Transcripts", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "IELTS Score Card", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Health Insurance", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Visa Application Form", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
        { name: "Application Fee Receipt", status: "Verified", date: "10 May 2024", remarks: "Accepted" }
      ]
    },
    embassyMessage: {
      title: "Embassy Message",
      message: "We are pleased to inform you that your visa application has been approved. We wish you a successful academic journey in Germany."
    },
    importantInfo: {
      title: "Important Information",
      items: [
        { title: "Travel to Germany", description: "Get your flight tickets and travel insurance." },
        { title: "Residence Permit", description: "Apply for residence permit within 90 days of arrival." },
        { title: "University Registration", description: "Complete your registration at the university." },
        { title: "Report to Authorities", description: "Mandatory registration with local authorities." }
      ]
    }
  },
  sidebar: {
    summary: {
      title: "Application Summary",
      editLabel: "Edit",
      fields: [
        { label: "Country", value: "Germany", isFlag: true },
        { label: "University", value: "TU Munich" },
        { label: "Program", value: "MS in Data Science" },
        { label: "Intake", value: "Fall 2026" },
        { label: "Visa Type", value: "Student Visa (D)" },
        { label: "Visa Category", value: "National Visa (D)" },
        { label: "Application No.", value: "VA202406501001" },
        { label: "Tracking ID", value: "APS123456789" },
        { label: "Date Started", value: "10 May 2024" },
        { label: "Last Updated", value: "07 Jun 2024 11:30 AM" },
        { label: "Current Status", value: "Visa Approved", isHighlight: true },
        { label: "Embassy", value: "German Embassy, New Delhi" },
        { label: "VFS Center", value: "VFS Global, New Delhi" }
      ]
    },
    progressSteps: [
      { label: "APS Applied", status: "Completed" },
      { label: "APS Approval", status: "Completed" },
      { label: "Visa Application", status: "Completed" },
      { label: "Biometrics", status: "Completed" },
      { label: "Visa Decision", status: "Completed" },
      { label: "Visa Approved", status: "Completed" }
    ],
    counselor: {
      title: "Your Counselor",
      name: "Priya Mehta",
      role: "Visa Counselor",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: "4.8",
      students: "128",
      actionButton: "Chat with Counselor"
    },
    quickLinks: {
      title: "Quick Links",
      items: [
        { text: "Download Visa Approval Letter", icon: "Download" },
        { text: "Check Passport Collection Status", icon: "CheckCircle" },
        { text: "Provide Travel Details", icon: "Plane" },
        { text: "Book Flight Tickets", icon: "Ticket" },
        { text: "Germany Living Guide", icon: "BookOpen" },
        { text: "Health Insurance Guide", icon: "Heart" },
        { text: "Open Blocked Account", icon: "CreditCard" },
        { text: "Track Application", icon: "FileSearch" }
      ]
    },
    timeline: {
      title: "Your Journey Timeline",
      viewAll: "View All",
      items: [
        { date: "10 May 2024", status: "APS Applied" },
        { date: "18 May 2024", status: "APS Approved" },
        { date: "22 May 2024", status: "Visa Application" },
        { date: "30 May 2024", status: "Biometrics" },
        { date: "05 Jun 2024", status: "Visa Decision" },
        { date: "07 Jun 2024", status: "Visa Approved" }
      ]
    }
  },
  footer: {
    processingTime: "4 - 6 Weeks",
    visaTime: "15 - 30 Working Days",
    visaFee: "€75 (Non-refundable)",
    applyEarly: "Apply Early",
    disclaimer: "Disclaimer: Final decision is at the sole discretion of the embassy."
  }
};




// ============================================
// COMPONENT MAPPING
// ============================================

const iconMap = {
  User: User,
  FileText: FileText,
  FileCheck: FileCheck,
  Globe: Globe,
  Calendar: Calendar,
  CheckCircle: CheckCircle,
  Building2: Building2,
  Shield: Shield,
  Clock: Clock,
  CheckCircle2: CheckCircle2,
  HelpCircle: HelpCircle,
  AlertCircle: AlertCircle,
  ThumbsUp: ThumbsUp,
  Download: Download,
  Briefcase: Briefcase,
  CreditCard: CreditCard,
  Edit3: Edit3,
  UploadCloud: UploadCloud,
  Eye: Eye,
  Trash2: Trash2,
  Info: Info,
  PlayCircle: PlayCircle,
  Video: Video,
  Home: Home,
  Plane: Plane,
  Heart: Heart,
  GraduationCap: GraduationCap,
  Camera: Camera,
  MapPin: MapPin,
  Phone: Phone,
  Mail: Mail,
  Fingerprint: Fingerprint,
  FileOutput: FileOutput,
  RefreshCw: RefreshCw,
  EyeOff: EyeOff,
  FileSearch: FileSearch,
  FileSignature: FileSignature,
  FileDigit: FileDigit,
  FileBox: FileBox,
  Search: Search,
  CheckCheck: CheckCheck
};

// ============================================
// COMPONENTS
// ============================================

const ProgressStep = ({ step, index, total }) => {
  const isLast = index === total - 1;
  const isActive = step.isActive;
  const status = step.status;

  let circleBg = 'bg-gray-200';
  let lineBg = 'bg-gray-200';
  let labelColor = 'text-gray-500';

  if (status === 'Completed') {
    circleBg = 'bg-green-500';
    lineBg = 'bg-green-500';
    labelColor = 'text-green-600';
  } else if (isActive) {
    circleBg = 'bg-blue-600';
    lineBg = 'bg-blue-500';
    labelColor = 'text-blue-600';
  }

  return (
    <div className="flex flex-col items-center relative flex-1 min-w-[80px]">
      {!isLast && (
        <div className={`absolute top-5 left-[60%] w-full h-1 -z-10 ${lineBg}`}></div>
      )}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 ${isActive || status === 'Completed' ? 'border-green-500 bg-white' : 'border-gray-300 bg-white'}`}>
        {status === 'Completed' ? (
          <CheckCircle2 size={20} className="text-green-500" />
        ) : isActive ? (
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
        ) : (
          <span className="text-sm font-bold text-gray-500">{step.id}</span>
        )}
      </div>
      <div className="mt-2 text-center">
        <div className={`text-xs font-bold ${labelColor}`}>{step.label}</div>
        <div className="text-[10px] text-gray-400">{step.date}</div>
        <div className={`text-[10px] font-medium mt-1 ${labelColor}`}>{step.status}</div>
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
        <p className="text-[10px] text-gray-500">{item.label}</p>
        <p className={`text-sm font-medium ${item.isHighlight ? 'text-blue-600' : 'text-gray-800'}`}>
          {item.isFlag ? <span className="flex items-center gap-1"><span>🇩🇪</span> {item.value}</span> : item.value}
        </p>
      </div>
    </div>
  );
};

const StatusDetailItem = ({ item }) => (
  <div className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
    <p className="text-[10px] text-gray-500">{item.label}</p>
    <p className="text-sm font-medium text-gray-800">{item.value}</p>
  </div>
);

const TimelineItem = ({ item, index }) => {
  const isActive = item.status === 'active';
  const isCompleted = item.status === 'completed';
  const isPending = item.status === 'pending';

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-blue-600' : isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}>
          {isCompleted && <Check size={12} className="text-white" />}
          {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
          {isPending && <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
        </div>
        {index < 5 && <div className={`w-0.5 h-6 ${isActive ? 'bg-blue-300' : isCompleted ? 'bg-green-300' : 'bg-gray-200'}`}></div>}
      </div>
      <div className="pb-4 flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-xs font-bold ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
            {item.label}
          </p>
          <span className="text-[10px] text-gray-400">{item.date}</span>
        </div>
        <p className="text-[10px] text-gray-500">{item.description}</p>
      </div>
    </div>
  );
};

const WhatHappensStep = ({ step, index }) => (
  <div className="flex items-start gap-3 mb-3 last:mb-0">
    <div className="flex flex-col items-center">
      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-blue-600">{index + 1}</span>
      </div>
      {index < 4 && <div className="w-0.5 h-4 bg-gray-200 mt-1"></div>}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-800">{step.title}</p>
      <p className="text-[10px] text-gray-500">{step.description}</p>
    </div>
  </div>
);

const DocumentRow = ({ row }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center py-2 border-b border-gray-50 last:border-0 gap-1">
    <div className="flex items-center gap-2 flex-1">
      <FileText size={12} className="text-gray-500" />
      <span className="text-xs text-gray-700">{row.name}</span>
    </div>
    <div className="flex items-center gap-3 sm:gap-4 text-[10px]">
      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">{row.status}</span>
      <span className="text-gray-400">{row.date}</span>
      <span className="text-gray-400">{row.remarks}</span>
    </div>
  </div>
);

const EmbassyUpdateItem = ({ item }) => (
  <div className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
    <div className="flex flex-col items-center">
      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
      <div className="w-0.5 h-6 bg-gray-200"></div>
    </div>
    <div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-400">{item.date}</span>
        <span className="text-[10px] text-blue-600 font-medium">{item.status}</span>
      </div>
      <p className="text-xs text-gray-600">{item.description}</p>
    </div>
  </div>
);

const ProgressCheckItem = ({ item }) => {
  const isCompleted = item.status === 'Completed';
  const isActive = item.status === 'Under Review';
  const isUpcoming = item.status === 'Upcoming';

  return (
    <div className="flex items-center gap-2 py-1">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-200'}`}>
        {isCompleted && <Check size={10} className="text-white" />}
        {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
      </div>
      <span className={`text-xs ${isCompleted ? 'text-gray-600' : isActive ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
        {item.label}
      </span>
      <span className={`text-[10px] ml-auto ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        {item.status}
      </span>
    </div>
  );
};

const QuickLinkItem = ({ item }) => {
  const IconComponent = iconMap[item.icon] || HelpCircle;
  return (
    <div className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded">
      <div className="flex items-center gap-2">
        <div className="p-1 bg-gray-50 rounded-full">
          <IconComponent size={10} className="text-gray-500" />
        </div>
        <span className="text-xs text-gray-600">{item.text}</span>
      </div>
      <ChevronDown size={10} className="text-gray-400 -rotate-90" />
    </div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function VisaDecisionPage() {
  const data = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">


      {/* --- Main Content --- */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {data.page.title}
            <span className="text-xs font-normal px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
              {data.page.status}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">{data.page.subtitle}</p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 overflow-x-auto">
          <div className="flex justify-between min-w-[600px] relative">
            {data.steps.map((step, index) => (
              <ProgressStep key={step.id} step={step} index={index} total={data.steps.length} />
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-1 flex-shrink-0 mt-0.5">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-blue-800">{data.banner.title}</h4>
              <p className="text-xs text-blue-700 mt-0.5">{data.banner.subtitle}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white border border-blue-200 text-blue-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            {data.banner.action} <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* --- Left Column --- */}
          <div className="col-span-12 lg:col-span-9 space-y-6">

            {/* Application Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">{data.sections.applicationDetails.title}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
                {data.sections.applicationDetails.items.map((item, idx) => (
                  <DetailItem key={idx} item={item} />
                ))}
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">{data.sections.currentStatus.title}</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Clock size={28} className="text-blue-600" />
                  </div>
                  <h4 className="font-bold text-sm text-blue-800">{data.sections.currentStatus.status}</h4>
                  <p className="text-xs text-gray-600 mt-1">{data.sections.currentStatus.description}</p>
                </div>
                <div className="flex-1 space-y-2">
                  {data.sections.currentStatus.details.map((item, idx) => (
                    <StatusDetailItem key={idx} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Decision Timeline & What Happens Next */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">{data.sections.decisionTimeline.title}</h3>
                <div className="space-y-1">
                  {data.sections.decisionTimeline.items.map((item, idx) => (
                    <TimelineItem key={idx} item={item} index={idx} />
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">{data.sections.whatHappensNext.title}</h3>
                <div className="space-y-1">
                  {data.sections.whatHappensNext.steps.map((step, idx) => (
                    <WhatHappensStep key={idx} step={step} index={idx} />
                  ))}
                </div>
                <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                  <h5 className="text-xs font-bold text-orange-800 flex items-center gap-1">
                    <AlertCircle size={12} /> {data.sections.whatHappensNext.importantNote.title}
                  </h5>
                  <ul className="mt-1 space-y-1">
                    {data.sections.whatHappensNext.importantNote.items.map((text, idx) => (
                      <li key={idx} className="text-[10px] text-orange-700 flex items-start gap-1">
                        <div className="mt-0.5">•</div>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Submitted Documents & Embassy Update */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">{data.sections.submittedDocuments.title}</h3>
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">View All Documents →</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-2 text-[10px] font-semibold text-gray-500 text-left">Document Name</th>
                        <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">Status</th>
                        <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">Submitted On</th>
                        <th className="pb-2 text-[10px] font-semibold text-gray-500 text-right">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sections.submittedDocuments.rows.map((row, idx) => (
                        <DocumentRow key={idx} row={row} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">{data.sections.embassyUpdate.title}</h3>
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">{data.sections.embassyUpdate.viewAll}</span>
                </div>
                <div className="space-y-1">
                  {data.sections.embassyUpdate.items.map((item, idx) => (
                    <EmbassyUpdateItem key={idx} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">{data.sections.declaration.title}</h3>
              <div className="flex items-start gap-3 mb-4">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <p className="text-xs text-gray-600">{data.sections.declaration.checkboxText}</p>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <p className="text-[10px] text-gray-500">Date</p>
                    <p className="font-medium">{data.sections.declaration.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Applicant Name</p>
                    <p className="font-medium">{data.sections.declaration.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded hover:bg-gray-50">Save & Print</button>
                </div>
              </div>
            </div>

          </div>

          {/* --- Right Column --- */}
          <div className="col-span-12 lg:col-span-3 space-y-6">

            {/* Application Summary */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-800">{data.sidebar.summary.title}</h4>
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">{data.sidebar.summary.editLabel}</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {data.sidebar.summary.fields.map((field, idx) => (
                  <div key={idx} className={`flex justify-between ${idx !== data.sidebar.summary.fields.length - 1 ? 'border-b border-gray-50 pb-1.5' : ''}`}>
                    <span className="text-gray-500">{field.label}</span>
                    <span className={`font-medium ${field.isHighlight ? 'text-blue-600' : 'text-gray-800'}`}>
                      {field.isFlag ? <span className="flex items-center gap-1"><span>🇩🇪</span> {field.value}</span> : field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Circle */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
              <h4 className="text-sm font-bold text-gray-800 w-full mb-2">Application Progress</h4>
              <div className="relative w-28 h-28 mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" cy="50" r="45" 
                    stroke="#3b82f6" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * 85 / 100)} 
                    strokeLinecap="round" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">85%</span>
                  <span className="text-[10px] text-gray-400">Completed</span>
                </div>
              </div>
              <div className="w-full space-y-1 mt-1">
                {data.sidebar.progressSteps.map((item, idx) => (
                  <ProgressCheckItem key={idx} item={item} />
                ))}
              </div>
            </div>

            {/* Counselor */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 mb-3">{data.sidebar.counselor.title}</h4>
              <div className="flex items-center gap-3 mb-3">
                <img src={data.sidebar.counselor.avatar} alt="Counselor" className="w-10 h-10 rounded-full" />
                <div>
                  <h5 className="text-xs font-bold text-gray-800">{data.sidebar.counselor.name}</h5>
                  <p className="text-[10px] text-gray-500">{data.sidebar.counselor.role}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex -space-x-1">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 border border-white"></div>
                      ))}
                    </div>
                    <span className="text-[8px] text-gray-400">{data.sidebar.counselor.rating} ({data.sidebar.counselor.students} students)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <button className="flex-1 p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-center"><MessageCircle size={14} className="text-gray-500" /></button>
                <button className="flex-1 p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-center"><Phone size={14} className="text-gray-500" /></button>
                <button className="flex-1 p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-center"><Mail size={14} className="text-gray-500" /></button>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">{data.sidebar.counselor.actionButton}</button>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 mb-2">{data.sidebar.quickLinks.title}</h4>
              <div className="space-y-0.5">
                {data.sidebar.quickLinks.items.map((item, idx) => (
                  <QuickLinkItem key={idx} item={item} />
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}