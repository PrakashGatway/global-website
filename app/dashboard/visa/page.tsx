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
  FileInput, FileClock, CheckCheckIcon, Sparkles, Star, LayoutDashboard
} from 'lucide-react';
import axiosInstance from '@/app/axiosInstance';


const visaJourneyData = {
  steps: [
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
        action: "View APS Application"
      },
      sections: {
        overview: {
          title: "APS Application Overview",
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
            { label: "Estimated Result Date", value: "25 Jun 2024" }
          ]
        },
        whatIsThis: {
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
        documents: {
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
        }
      }
    },
    {
      id: 2,
      label: "APS Approval",
      route: "aps-approval",
      page: {
        title: "APS Approval",
        status: "Completed",
        subtitle: "Congratulations! Your APS certificate has been approved."
      },
      banner: {
        type: "success",
        title: "Your APS certificate has been approved!",
        subtitle: "You are now eligible to apply for your student visa.",
        action: "View Certificate"
      },
      sections: {
        approvalDetails: {
          title: "APS Approval Details",
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
          title: "What Happens Next?",
          description: "You can now proceed with your visa application. Make sure to submit your application within the visa validity period.",
          steps: [
            { icon: "FileText", title: "Visa Application", description: "Fill and submit your student visa application." },
            { icon: "User", title: "Biometrics", description: "Book and attend your biometrics appointment." },
            { icon: "Clock", title: "Visa Decision", description: "Your application will be reviewed by the embassy." },
            { icon: "CheckCircle2", title: "Visa Approved", description: "Once approved, you will receive your visa." }
          ],
          actionButton: "Start Visa Application"
        },
        documents: {
          title: "Documents Submitted for APS",
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
      statusTimeline: [
        { title: "Application Submitted", date: "10 May 2024", status: "Completed" },
        { title: "Under Review", date: "15 May 2024", status: "Completed" },
        { title: "Documents Verified", date: "22 May 2024", status: "Completed" },
        { title: "APS Approved", date: "28 May 2024", status: "Completed", isActive: true }
      ]
    },
    {
      id: 3,
      label: "Visa Application",
      route: "visa-application",
      page: {
        title: "Visa Application",
        status: "In Progress",
        subtitle: "Complete and submit your visa application for processing."
      },
      banner: {
        type: "info",
        title: "You can now complete and submit your visa application.",
        subtitle: "Please fill in all the required details accurately and upload the necessary documents.",
        action: "View Full Timeline"
      },
      progress: 72,
      sections: {
        applicationInfo: {
          title: "Application Information",
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
            { icon: "FileCheck", label: "Application No.", value: "VA202406501001" },
            { icon: "User", label: "Tracking ID", value: "APS123456789" },
            { icon: "Calendar", label: "Date Started", value: "10 May 2024" },
            { icon: "Building2", label: "Embassy Assigned", value: "German Embassy, New Delhi" },
            { icon: "Globe", label: "Application Method", value: "Online" },
            { icon: "Clock", label: "Current Status", value: "In Progress" }
          ]
        },
        personalInfo: {
          title: "Personal Information",
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
          father: { name: "Rajesh Sharma", occupation: "Business", phone: "+91 9876543210" },
          mother: { name: "Neha Sharma", occupation: "Homemaker", phone: "" }
        },
        travelInfo: {
          title: "Travel Information",
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
            { name: "Visa Application Form", status: "Pending", date: "10 May 2024", size: "-", action: "upload" }
          ]
        },
        declarations: {
          title: "Declaration",
          checkboxText: "I declare that all information provided in this application is true and correct to the best of my knowledge.",
          date: "20 May 2024",
          name: "Ananya Sharma"
        }
      },
      progressSteps: [
        { label: "Personal Information", status: "Completed" },
        { label: "Travel Information", status: "Completed" },
        { label: "Academic Information", status: "Completed" },
        { label: "Family Information", status: "Completed" },
        { label: "Financial Information", status: "Completed" },
        { label: "Documents Uploaded", status: "In Progress" },
        { label: "Declaration", status: "Pending" },
        { label: "Final Submission", status: "Pending" }
      ]
    },
    {
      id: 4,
      label: "Biometrics",
      route: "biometrics",
      page: {
        title: "Biometrics Appointment",
        status: "Scheduled",
        subtitle: "Complete your biometrics appointment and track status."
      },
      banner: {
        type: "info",
        title: "Your biometrics appointment is confirmed.",
        subtitle: "Please check the details below and follow all instructions carefully.",
        action: "Download Appointment Letter",
        secondaryAction: "Reschedule"
      },
      sections: {
        appointmentDetails: {
          title: "Appointment Details",
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
          title: "What is Biometrics?",
          description: "Biometrics is the process of capturing your fingerprints and photograph as per the embassy requirements. This is a mandatory step for visa processing.",
          watchButton: "Watch Video"
        },
        documentsToCarry: {
          title: "Documents to Carry",
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
          title: "Biometrics Process",
          steps: [
            { title: "Document Verification", description: "Your documents will be verified by the officer." },
            { title: "Photograph Capture", description: "Your photograph will be taken." },
            { title: "Fingerprint Capture", description: "Your fingerprints (10 fingers) will be scanned." },
            { title: "Process Completed", description: "You will receive a confirmation slip." }
          ]
        },
        beforeYouGo: {
          title: "Before You Go",
          items: [
            { text: "Do not apply hand cream or makeup before appointment." },
            { text: "Make sure your fingers are clean and dry." },
            { text: "Wear proper attire for photograph." },
            { text: "Carry Original Passport & Documents." },
            { text: "Do not forget your appointment confirmation." }
          ]
        },
        feesDetails: {
          title: "Fees Details",
          items: [
            { description: "Biometrics Fee (VFS)", amount: "1,650", status: "Paid" },
            { description: "Service Charge", amount: "550", status: "Paid" },
            { description: "Total", amount: "2,200", status: "Paid", isTotal: true }
          ],
          paymentDate: "22 May 2024",
          paymentMode: "Online (Debit/Credit)"
        },
        appointmentHistory: {
          title: "Appointment History",
          items: [
            { date: "22 May 2024", time: "09:15 AM", status: "Appointment Booked" },
            { date: "22 May 2024", time: "09:20 AM", status: "Visa Application Submitted" },
            { date: "22 May 2024", time: "09:25 AM", status: "Fees Paid" },
            { date: "30 May 2024", time: "10:30 AM", status: "Appointment Scheduled" }
          ]
        },
        afterBiometrics: {
          title: "Post Biometrics - What Happens Next?",
          steps: [
            { title: "Biometrics Submitted", description: "Your biometrics will be submitted to the embassy.", icon: "Fingerprint" },
            { title: "Data Verification", description: "Embassy will verify your information.", icon: "FileCheck" },
            { title: "Background Check", description: "Your application goes through background verification.", icon: "Shield" },
            { title: "Visa Decision", description: "Embassy will make a decision on your visa.", icon: "CheckCircle" },
            { title: "Passport Collection", description: "You will be notified once your passport is ready.", icon: "FileOutput" }
          ]
        },
        declaration: {
          title: "Declaration",
          checkboxText: "I declare that I have read and understood all the instructions for biometrics appointment.",
          date: "22 May 2024",
          name: "Ananya Sharma"
        }
      },
      importantInfo: [
        "Please reach the center 15 minutes before your appointment time.",
        "Lateness may not be allowed to attend the appointment.",
        "Mobile phones and electronic gadgets are not allowed inside the center.",
        "Biometric data once captured is valid for 59 months."
      ]
    },
    {
      id: 5,
      label: "Visa Decision",
      route: "visa-decision",
      page: {
        title: "Visa Decision",
        status: "Under Review by Embassy",
        subtitle: "The embassy is currently reviewing your application. Please track the status below."
      },
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
            { label: "Last Updated", value: "20 May 2024 11:30 AM", icon: "Clock" }
          ]
        },
        currentStatus: {
          title: "Current Status",
          status: "Application Under Review",
          description: "Your application is being processed by the visa officer.",
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
            { label: "Application Received by Embassy", date: "15 May 2024", status: "completed", description: "Your application has been received." },
            { label: "Under Review", date: "20 May 2024", status: "active", description: "Your application is under review by the visa officer." },
            { label: "Decision Pending", date: "", status: "pending", description: "The decision will be taken after document verification." },
            { label: "Decision Communicated", date: "", status: "pending", description: "You will be notified once the decision is available." }
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
            { name: "Visa Application Form", status: "Verified", date: "10 May 2024", remarks: "Accepted" }
          ]
        },
        embassyUpdate: {
          title: "Embassy Update",
          items: [
            { date: "20 May 2024 11:30 AM", status: "Current Status", description: "Your application is under review by the visa officer." },
            { date: "15 May 2024 10:45 AM", status: "Update", description: "Your application has been received by the embassy." },
            { date: "10 May 2024 02:00 PM", status: "Update", description: "Your application has been submitted successfully." }
          ]
        },
        declaration: {
          title: "Declaration",
          checkboxText: "I understand that my application is under review and the decision is at the sole discretion of the embassy.",
          date: "20 May 2024",
          name: "Ananya Sharma"
        }
      }
    },
    {
      id: 6,
      label: "Visa Approved",
      route: "visa-approved",
      page: {
        title: "Visa Approved",
        status: "Approved",
        subtitle: "Congratulations! Your visa has been approved."
      },
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
          rows: [
            { name: "Passport (First & Last Page)", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "APS Certificate", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "University Admission Letter", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Financial Documents", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Proof of Accommodation", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "CV / Resume", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Academic Transcripts", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "IELTS Score Card", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Health Insurance", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Visa Application Form", status: "Verified", date: "10 May 2024", remarks: "Accepted" }
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
      }
    }
  ],
  user: {
    name: "Ananya Sharma",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  sidebar: {
    summary: {
      title: "Application Summary",
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
        { label: "Last Updated", value: "07 Jun 2024 11:30 AM" }
      ]
    },
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
        { text: "Track Application", icon: "FileSearch" },
        { text: "Download Documents", icon: "Download" },
        { text: "Contact Support", icon: "HelpCircle" },
        { text: "Visa Guide", icon: "BookOpen" }
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


const ProgressStep = ({ step, index, total, currentStepId }) => {
  const isLast = index === total - 1;
  const isActive = step.id === currentStepId;
  const status = getStepStatus(step.id, currentStepId);
  
  let circleBg = 'bg-gray-200';
  let lineBg = 'bg-gray-200';
  let labelColor = 'text-gray-500';

  if (status === 'completed') {
    circleBg = 'bg-green-500';
    lineBg = 'bg-green-500';
    labelColor = 'text-green-600';
  } else if (isActive) {
    circleBg = 'bg-[#f56e45]';
    lineBg = 'bg-[#f56e45]';
    labelColor = 'text-[#f56e45]';
  }

  return (
    <div className="flex flex-col items-center relative flex-1 min-w-[80px]">
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
        <div className={`text-xs font-bold ${labelColor}`}>{step.label}</div>
        <div className={`text-[10px] font-medium mt-1 ${labelColor}`}>
          {status === 'completed' ? 'Completed' : isActive ? 'In Progress' : 'Upcoming'}
        </div>
      </div>
    </div>
  );
};

const getStepStatus = (stepId, currentStepId) => {
  if (stepId < currentStepId) return 'completed';
  if (stepId === currentStepId) return 'active';
  return 'locked';
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
      <span className="text-xs text-gray-700">{row.name}</span>
    </div>
    <div className="flex items-center gap-3 sm:gap-4 text-[10px]">
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
        <span className="text-xs text-gray-600">{item.text}</span>
      </div>
      <ChevronDown size={10} className="text-gray-400 -rotate-90" />
    </div>
  );
};

const Step1APSApplied = ({ data, currentStepId }) => {
  const stepData = data.steps[0];
  
  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.overview.title}</h3>
          <span className="text-xs text-gray-500">Updated: {stepData.sections.overview.updated}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.overview.details.map((detail, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-500">{detail.label}</p>
              <p className={`text-sm font-medium ${detail.highlight ? 'text-[#f56e45]' : 'text-gray-800'}`}>
                {detail.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-orange-50 p-3 rounded border border-orange-100 flex items-center gap-2">
          <div className="bg-[#f56e45] rounded-full p-1">
            <CheckCircle2 size={12} className="text-white" />
          </div>
          <span className="text-xs text-orange-800">Once your APS is approved, you will be able to start your Visa Application.</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">{stepData.sections.whatIsThis.title}</h3>
        <p className="text-xs text-gray-500 mb-4">{stepData.sections.whatIsThis.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stepData.sections.whatIsThis.items.map((item, idx) => {
            const IconComp = iconMap[item.icon] || HelpCircle;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <IconComp className="text-[#f56e45] mb-1" size={20} />
                <p className="text-[10px] text-gray-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-1">Prepare for Visa Application</h3>
        <p className="text-xs text-gray-500 mb-4">Complete these steps while waiting for your APS result.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stepData.sections.preparationCards.map((card, idx) => {
            const IconComp = iconMap[card.icon] || HelpCircle;
            return (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-3"><IconComp className="text-orange-400" size={28} /></div>
                <h4 className="font-bold text-xs text-gray-800 mb-1">{card.title}</h4>
                <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">{card.desc}</p>
                <button className="text-[#f56e45] text-[10px] font-bold border border-orange-200 bg-orange-50 px-3 py-1 rounded hover:bg-orange-100">{card.btnText}</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.documents.title}</h3>
          <button className="text-[#f56e45] text-xs font-bold bg-orange-50 px-3 py-1 rounded">View All Documents →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {stepData.sections.documents.columns.map((column, colIdx) => (
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
                      <span className="text-xs font-medium text-gray-700">{doc.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">{doc.status}</span>
                      <span className="text-[10px] text-[#f56e45] cursor-pointer hover:underline">{doc.action}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Completed</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> In Progress</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> To be uploaded</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Not Required</span>
        </div>
      </div>
    </>
  );
};

const Step2APSApproval = ({ data, currentStepId }) => {
  const stepData = data.steps[1];
  
  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.approvalDetails.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.approvalDetails.items.map((item, idx) => (
            <DetailItem key={idx} item={item} />
          ))}
        </div>
        <div className="mt-6 pt-6 flex justify-center">
          <div className="bg-white border border-green-200 rounded-lg p-4 w-full max-w-[280px] flex items-center gap-4 shadow-sm">
            <div className="flex-1">
              <FileText size={40} className="text-green-600 mb-1" />
              <h5 className="font-bold text-sm text-gray-800">{stepData.sections.approvalDetails.certificate.title}</h5>
              <p className="text-[10px] text-green-600 font-medium">{stepData.sections.approvalDetails.certificate.status}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-full">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.whatHappensNext.title}</h3>
        <p className="text-xs text-gray-500 mb-6">{stepData.sections.whatHappensNext.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stepData.sections.whatHappensNext.steps.map((step, idx) => {
            const IconComponent = iconMap[step.icon] || FileText;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <IconComponent size={18} className="text-green-600" />
                </div>
                <h5 className="text-xs font-bold text-gray-800">{step.title}</h5>
                <p className="text-[10px] text-gray-500 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <button className="flex items-center gap-2 bg-[#f56e45] hover:bg-[#f56e45] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm">
            {stepData.sections.whatHappensNext.actionButton} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.documents.title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {stepData.sections.documents.columns.map((col, idx) => (
                  <th key={idx} className="pb-2 text-[10px] font-semibold text-gray-500 text-left">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stepData.sections.documents.rows.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2 text-xs text-gray-700">{row.name}</td>
                  <td className="py-2"><span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded">{row.status}</span></td>
                  <td className="py-2 text-[10px] text-gray-500">{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <button className="flex items-center gap-2 border border-orange-200 bg-orange-50 text-[#f56e45] text-xs font-medium px-4 py-2 rounded-lg">
            <Eye size={14} /> {stepData.sections.documents.buttonText}
          </button>
        </div>
      </div>
    </>
  );
};

const Step3VisaApplication = ({ data, currentStepId }) => {
  const stepData = data.steps[2];
  
  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.applicationInfo.title}</h3>
          <span className="text-xs text-[#f56e45] cursor-pointer hover:underline flex items-center gap-1">
            {/* <Edit3 size={12} /> Edit */}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.applicationInfo.items.map((item, idx) => (
            <DetailItem key={idx} item={item} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.personalInfo.title}</h3>
          <span className="text-xs text-[#f56e45] cursor-pointer hover:underline flex items-center gap-1">
            {/* <Edit3 size={12} /> Edit */}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.personalInfo.items.map((item, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.familyInfo.title}</h3>
          <span className="text-xs text-[#f56e45] cursor-pointer hover:underline flex items-center gap-1">
            {/* <Edit3 size={12} /> Edit */}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-lg p-4">
            <h5 className="text-xs font-bold text-gray-700 mb-3">Father's Details</h5>
            <div className="space-y-2">
              <div><span className="text-[10px] text-gray-500">Name</span><p className="font-medium text-sm">{stepData.sections.familyInfo.father.name}</p></div>
              <div><span className="text-[10px] text-gray-500">Occupation</span><p className="font-medium text-sm">{stepData.sections.familyInfo.father.occupation}</p></div>
              <div><span className="text-[10px] text-gray-500">Phone</span><p className="font-medium text-sm">{stepData.sections.familyInfo.father.phone}</p></div>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <h5 className="text-xs font-bold text-gray-700 mb-3">Mother's Details</h5>
            <div className="space-y-2">
              <div><span className="text-[10px] text-gray-500">Name</span><p className="font-medium text-sm">{stepData.sections.familyInfo.mother.name}</p></div>
              <div><span className="text-[10px] text-gray-500">Occupation</span><p className="font-medium text-sm">{stepData.sections.familyInfo.mother.occupation}</p></div>
              <div><span className="text-[10px] text-gray-500">Phone</span><p className="font-medium text-sm text-gray-400">{stepData.sections.familyInfo.mother.phone || "N/A"}</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.travelInfo.title}</h3>
          <span className="text-xs text-[#f56e45] cursor-pointer hover:underline flex items-center gap-1">
            {/* <Edit3 size={12} /> Edit */}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.travelInfo.items.map((item, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.academicInfo.title}</h3>
          <span className="text-xs text-[#f56e45] cursor-pointer hover:underline flex items-center gap-1">
            {/* <Edit3 size={12} /> Edit */}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.academicInfo.items.map((item, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.financialInfo.title}</h3>
          <span className="text-xs text-[#f56e45] cursor-pointer hover:underline flex items-center gap-1">
            {/* <Edit3 size={12} /> Edit */}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.financialInfo.items.map((item, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.documents.title}</h3>
          <span className="text-xs text-[#f56e45] cursor-pointer hover:underline">View All</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-[10px] font-semibold text-gray-500">Document Name</th>
                <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">Status</th>
                <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">Updated On</th>
                <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">File Size</th>
                <th className="pb-2 text-[10px] font-semibold text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {stepData.sections.documents.rows.map((row, idx) => {
                const statusColor = row.status === 'Uploaded' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50';
                return (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-2"><div className="flex items-center gap-2"><FileText size={12} className="text-gray-500"/><span className="text-xs text-gray-700">{row.name}</span></div></td>
                    <td className="py-2 text-center"><span className={`text-[10px] ${statusColor} px-2 py-0.5 rounded`}>{row.status}</span></td>
                    <td className="py-2 text-center text-[10px] text-gray-400">{row.date}</td>
                    <td className="py-2 text-center text-[10px] text-gray-400">{row.size}</td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {row.action === 'view' ? <Eye size={14} className="text-[#f56e45] cursor-pointer" /> : <UploadCloud size={14} className="text-orange-500 cursor-pointer" />}
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
            <p className="text-[10px] text-gray-400">Accepted formats: PDF, JPG, PNG (Max size: 10MB each)</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.declarations.title}</h3>
        <div className="flex items-start gap-3 mb-4">
          <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#f56e45]" />
          <p className="text-xs text-gray-600">{stepData.sections.declarations.checkboxText}</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div><p className="text-[10px] text-gray-500">Date</p><p className="font-medium">{stepData.sections.declarations.date}</p></div>
            <div><p className="text-[10px] text-gray-500">Applicant Name</p><p className="font-medium">{stepData.sections.declarations.name}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded hover:bg-gray-50">Save as Draft</button>
            <button className="bg-white border border-orange-200 text-[#f56e45] text-xs font-medium px-4 py-2 rounded hover:bg-orange-50">Continue Later</button>
            <button className="bg-[#f56e45] text-white text-xs font-medium px-6 py-2 rounded hover:bg-[#f56e45]">Review Application</button>
          </div>
        </div>
      </div>
    </>
  );
};

const Step4Biometrics = ({ data, currentStepId }) => {
  const stepData = data.steps[3];
  
  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.appointmentDetails.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 mb-6">
          {stepData.sections.appointmentDetails.items.map((item, idx) => (
            <div key={idx} className={item.fullWidth ? 'col-span-full' : ''}>
              <div className="flex items-start gap-2">
                <div className="p-1.5 bg-orange-50 rounded-lg flex-shrink-0">
                  {iconMap[item.icon] && React.createElement(iconMap[item.icon], { size: 14, className: "text-orange-600" })}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">{item.label}</p>
                  <p className="text-sm font-medium text-gray-800">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stepData.sections.appointmentDetails.infoCards.map((item, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-3">
              <p className="text-[10px] text-gray-500">{item.label}</p>
              <p className={`text-sm font-medium ${item.isHighlight ? 'text-green-600' : 'text-gray-800'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">{stepData.sections.whatIsBiometrics.title}</h3>
        <p className="text-xs text-gray-500 mb-3">{stepData.sections.whatIsBiometrics.description}</p>
        <button className="flex items-center gap-2 text-orange-600 text-xs font-medium hover:underline">
          <PlayCircle size={16} /> {stepData.sections.whatIsBiometrics.watchButton}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">{stepData.sections.documentsToCarry.title}</h3>
          <div className="space-y-1 mb-3">
            {stepData.sections.documentsToCarry.items.map((text, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-green-600" />
                </div>
                <span className="text-xs text-gray-700">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 italic">{stepData.sections.documentsToCarry.note}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">{stepData.sections.biometricsProcess.title}</h3>
          <div className="space-y-1">
            {stepData.sections.biometricsProcess.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-orange-600">{idx + 1}</span>
                  </div>
                  {idx < 3 && <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{step.title}</p>
                  <p className="text-[10px] text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">{stepData.sections.beforeYouGo.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {stepData.sections.beforeYouGo.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 py-1">
              <div className="p-1 bg-gray-50 rounded-full"><CheckCircle2 size={12} className="text-green-500" /></div>
              <span className="text-xs text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">{stepData.sections.feesDetails.title}</h3>
            <button className="flex items-center gap-1 text-xs text-orange-600"><Download size={12} /> Download Receipt</button>
          </div>
          <div className="space-y-1">
            {stepData.sections.feesDetails.items.map((item, idx) => (
              <div key={idx} className={`flex justify-between items-center py-2 border-b border-gray-50 last:border-0 ${item.isTotal ? 'font-bold' : ''}`}>
                <span className="text-xs text-gray-700">{item.description}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-gray-800">{item.amount}</span>
                  <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-gray-400 border-t pt-2">
            <p>Payment Date: {stepData.sections.feesDetails.paymentDate}</p>
            <p>Payment Mode: {stepData.sections.feesDetails.paymentMode}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.appointmentHistory.title}</h3>
          <div className="space-y-1">
            {stepData.sections.appointmentHistory.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-1.5">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {idx < 3 && <div className="w-0.5 h-4 bg-gray-200"></div>}
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500">{item.date}</span>
                  <span className="text-gray-500">{item.time}</span>
                  <span className="text-gray-700">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.afterBiometrics.title}</h3>
        <div className="flex flex-wrap justify-between gap-2">
          {stepData.sections.afterBiometrics.steps.map((step, idx) => {
            const IconComp = iconMap[step.icon] || Fingerprint;
            return (
              <div key={idx} className="flex flex-col items-center text-center flex-1 min-w-[100px]">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <IconComp size={18} className="text-orange-600" />
                </div>
                <p className="text-[10px] font-bold text-gray-800">{step.title}</p>
                <p className="text-[8px] text-gray-500 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.declaration.title}</h3>
        <div className="flex items-start gap-3 mb-4">
          <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-600" />
          <p className="text-xs text-gray-600">{stepData.sections.declaration.checkboxText}</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div><p className="text-[10px] text-gray-500">Date</p><p className="font-medium">{stepData.sections.declaration.date}</p></div>
            <div><p className="text-[10px] text-gray-500">Applicant Name</p><p className="font-medium">{stepData.sections.declaration.name}</p></div>
          </div>
          <button className="border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded hover:bg-gray-50">Save & Print</button>
        </div>
      </div>
    </>
  );
};

const Step5VisaDecision = ({ data, currentStepId }) => {
  const stepData = data.steps[4];
  
  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.applicationDetails.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.applicationDetails.items.map((item, idx) => (
            <DetailItem key={idx} item={item} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.currentStatus.title}</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-orange-50 p-4 rounded-lg border border-orange-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <Clock size={28} className="text-orange-600" />
            </div>
            <h4 className="font-bold text-sm text-orange-800">{stepData.sections.currentStatus.status}</h4>
            <p className="text-xs text-gray-600 mt-1">{stepData.sections.currentStatus.description}</p>
          </div>
          <div className="flex-1 space-y-2">
            {stepData.sections.currentStatus.details.map((item, idx) => (
              <div key={idx} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <p className="text-[10px] text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.decisionTimeline.title}</h3>
          <div className="space-y-1">
            {stepData.sections.decisionTimeline.items.map((item, idx) => {
              const isActive = item.status === 'active';
              const isCompleted = item.status === 'completed';
              return (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-orange-600' : isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {isCompleted && <Check size={12} className="text-white" />}
                      {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    {idx < 4 && <div className={`w-0.5 h-6 ${isActive ? 'bg-orange-300' : isCompleted ? 'bg-green-300' : 'bg-gray-200'}`}></div>}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{item.label}</p>
                      <span className="text-[10px] text-gray-400">{item.date}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.whatHappensNext.title}</h3>
          <div className="space-y-1">
            {stepData.sections.whatHappensNext.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-orange-600">{idx + 1}</span>
                  </div>
                  {idx < 4 && <div className="w-0.5 h-4 bg-gray-200 mt-1"></div>}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{step.title}</p>
                  <p className="text-[10px] text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg">
            <h5 className="text-xs font-bold text-orange-800 flex items-center gap-1">
              <AlertCircle size={12} /> {stepData.sections.whatHappensNext.importantNote.title}
            </h5>
            <ul className="mt-1 space-y-1">
              {stepData.sections.whatHappensNext.importantNote.items.map((text, idx) => (
                <li key={idx} className="text-[10px] text-orange-700 flex items-start gap-1">
                  <div className="mt-0.5">•</div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">{stepData.sections.submittedDocuments.title}</h3>
            <span className="text-xs text-orange-600 cursor-pointer hover:underline">View All Documents →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              {/* <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-[10px] font-semibold text-gray-500">Document Name</th>
                  <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">Status</th>
                  <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">Submitted On</th>
                  <th className="pb-2 text-[10px] font-semibold text-gray-500 text-right">Remarks</th>
                </tr>
              </thead> */}
              <tbody>
                {stepData.sections.submittedDocuments.rows.map((row, idx) => (
                  <DocumentRow key={idx} row={row} showSize={false} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">{stepData.sections.embassyUpdate.title}</h3>
            <span className="text-xs text-orange-600 cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-1">
            {stepData.sections.embassyUpdate.items.map((item, idx) => (
              <div key={idx} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                    <span className="text-[10px] text-orange-600 font-medium">{item.status}</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.declaration.title}</h3>
        <div className="flex items-start gap-3 mb-4">
          <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-600" />
          <p className="text-xs text-gray-600">{stepData.sections.declaration.checkboxText}</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div><p className="text-[10px] text-gray-500">Date</p><p className="font-medium">{stepData.sections.declaration.date}</p></div>
            <div><p className="text-[10px] text-gray-500">Applicant Name</p><p className="font-medium">{stepData.sections.declaration.name}</p></div>
          </div>
          <button className="border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded hover:bg-gray-50">Save & Print</button>
        </div>
      </div>
    </>
  );
};


const Step6VisaApproved = ({ data, currentStepId }) => {
  const stepData = data.steps[5];
  
  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.visaApprovalDetails.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.visaApprovalDetails.items.map((item, idx) => (
            <DetailItem key={idx} item={item} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <Award size={32} className="text-green-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">{stepData.sections.congratulations.title}</h3>
          <p className="text-xs text-gray-600 mt-2">{stepData.sections.congratulations.message}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.whatHappensNext.title}</h3>
          <div className="flex flex-wrap justify-between gap-2">
            {stepData.sections.whatHappensNext.steps.map((step, idx) => {
              const IconComp = iconMap[step.icon] || FileOutput;
              return (
                <div key={idx} className="flex flex-col items-center text-center flex-1 min-w-[80px]">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                    <IconComp size={18} className="text-orange-600" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-700">{step.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.visaDetails.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-3">
          {stepData.sections.visaDetails.items.map((item, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.passportCollection.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-3 mb-3">
          {stepData.sections.passportCollection.items.map((item, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-2">
          <Info size={14} className="text-orange-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-orange-700">{stepData.sections.passportCollection.note}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{stepData.sections.documentsSummary.title}</h3>
          <span className="text-xs text-orange-600 cursor-pointer hover:underline">View All Documents →</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-[10px] font-semibold text-gray-500">Document Name</th>
                <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">Status</th>
                <th className="pb-2 text-[10px] font-semibold text-gray-500 text-center">Submitted On</th>
                <th className="pb-2 text-[10px] font-semibold text-gray-500 text-right">Remarks</th>
              </tr>
            </thead> */}
            <tbody>
              {stepData.sections.documentsSummary.rows.map((row, idx) => (
                <DocumentRow key={idx} row={row} showSize={false} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-orange-600"><MessageCircle size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">{stepData.sections.embassyMessage.title}</h3>
            <p className="text-sm text-gray-600">{stepData.sections.embassyMessage.message}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">{stepData.sections.importantInfo.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {stepData.sections.importantInfo.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2">
              <div className="mt-0.5"><CheckCircle2 size={12} className="text-green-500" /></div>
              <div>
                <p className="text-xs font-bold text-gray-700">{item.title}</p>
                <p className="text-[10px] text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export default function VisaJourneyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  
const visaJourneyData = {
  steps: [
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
        action: "View APS Application"
      },
      sections: {
        overview: {
          title: "APS Application Overview",
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
            { label: "Estimated Result Date", value: "25 Jun 2024" }
          ]
        },
        whatIsThis: {
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
        documents: {
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
        }
      }
    },
    {
      id: 2,
      label: "APS Approval",
      route: "aps-approval",
      page: {
        title: "APS Approval",
        status: "Completed",
        subtitle: "Congratulations! Your APS certificate has been approved."
      },
      banner: {
        type: "success",
        title: "Your APS certificate has been approved!",
        subtitle: "You are now eligible to apply for your student visa.",
        action: "View Certificate"
      },
      sections: {
        approvalDetails: {
          title: "APS Approval Details",
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
          title: "What Happens Next?",
          description: "You can now proceed with your visa application. Make sure to submit your application within the visa validity period.",
          steps: [
            { icon: "FileText", title: "Visa Application", description: "Fill and submit your student visa application." },
            { icon: "User", title: "Biometrics", description: "Book and attend your biometrics appointment." },
            { icon: "Clock", title: "Visa Decision", description: "Your application will be reviewed by the embassy." },
            { icon: "CheckCircle2", title: "Visa Approved", description: "Once approved, you will receive your visa." }
          ],
          actionButton: "Start Visa Application"
        },
        documents: {
          title: "Documents Submitted for APS",
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
      statusTimeline: [
        { title: "Application Submitted", date: "10 May 2024", status: "Completed" },
        { title: "Under Review", date: "15 May 2024", status: "Completed" },
        { title: "Documents Verified", date: "22 May 2024", status: "Completed" },
        { title: "APS Approved", date: "28 May 2024", status: "Completed", isActive: true }
      ]
    },
    {
      id: 3,
      label: "Visa Application",
      route: "visa-application",
      page: {
        title: "Visa Application",
        status: "In Progress",
        subtitle: "Complete and submit your visa application for processing."
      },
      banner: {
        type: "info",
        title: "You can now complete and submit your visa application.",
        subtitle: "Please fill in all the required details accurately and upload the necessary documents.",
        action: "View Full Timeline"
      },
      progress: 72,
      sections: {
        applicationInfo: {
          title: "Application Information",
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
            { icon: "FileCheck", label: "Application No.", value: "VA202406501001" },
            { icon: "User", label: "Tracking ID", value: "APS123456789" },
            { icon: "Calendar", label: "Date Started", value: "10 May 2024" },
            { icon: "Building2", label: "Embassy Assigned", value: "German Embassy, New Delhi" },
            { icon: "Globe", label: "Application Method", value: "Online" },
            { icon: "Clock", label: "Current Status", value: "In Progress" }
          ]
        },
        personalInfo: {
          title: "Personal Information",
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
          father: { name: "Rajesh Sharma", occupation: "Business", phone: "+91 9876543210" },
          mother: { name: "Neha Sharma", occupation: "Homemaker", phone: "" }
        },
        travelInfo: {
          title: "Travel Information",
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
            { name: "Visa Application Form", status: "Pending", date: "10 May 2024", size: "-", action: "upload" }
          ]
        },
        declarations: {
          title: "Declaration",
          checkboxText: "I declare that all information provided in this application is true and correct to the best of my knowledge.",
          date: "20 May 2024",
          name: "Ananya Sharma"
        }
      },
      progressSteps: [
        { label: "Personal Information", status: "Completed" },
        { label: "Travel Information", status: "Completed" },
        { label: "Academic Information", status: "Completed" },
        { label: "Family Information", status: "Completed" },
        { label: "Financial Information", status: "Completed" },
        { label: "Documents Uploaded", status: "In Progress" },
        { label: "Declaration", status: "Pending" },
        { label: "Final Submission", status: "Pending" }
      ]
    },
    {
      id: 4,
      label: "Biometrics",
      route: "biometrics",
      page: {
        title: "Biometrics Appointment",
        status: "Scheduled",
        subtitle: "Complete your biometrics appointment and track status."
      },
      banner: {
        type: "info",
        title: "Your biometrics appointment is confirmed.",
        subtitle: "Please check the details below and follow all instructions carefully.",
        action: "Download Appointment Letter",
        secondaryAction: "Reschedule"
      },
      sections: {
        appointmentDetails: {
          title: "Appointment Details",
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
          title: "What is Biometrics?",
          description: "Biometrics is the process of capturing your fingerprints and photograph as per the embassy requirements. This is a mandatory step for visa processing.",
          watchButton: "Watch Video"
        },
        documentsToCarry: {
          title: "Documents to Carry",
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
          title: "Biometrics Process",
          steps: [
            { title: "Document Verification", description: "Your documents will be verified by the officer." },
            { title: "Photograph Capture", description: "Your photograph will be taken." },
            { title: "Fingerprint Capture", description: "Your fingerprints (10 fingers) will be scanned." },
            { title: "Process Completed", description: "You will receive a confirmation slip." }
          ]
        },
        beforeYouGo: {
          title: "Before You Go",
          items: [
            { text: "Do not apply hand cream or makeup before appointment." },
            { text: "Make sure your fingers are clean and dry." },
            { text: "Wear proper attire for photograph." },
            { text: "Carry Original Passport & Documents." },
            { text: "Do not forget your appointment confirmation." }
          ]
        },
        feesDetails: {
          title: "Fees Details",
          items: [
            { description: "Biometrics Fee (VFS)", amount: "1,650", status: "Paid" },
            { description: "Service Charge", amount: "550", status: "Paid" },
            { description: "Total", amount: "2,200", status: "Paid", isTotal: true }
          ],
          paymentDate: "22 May 2024",
          paymentMode: "Online (Debit/Credit)"
        },
        appointmentHistory: {
          title: "Appointment History",
          items: [
            { date: "22 May 2024", time: "09:15 AM", status: "Appointment Booked" },
            { date: "22 May 2024", time: "09:20 AM", status: "Visa Application Submitted" },
            { date: "22 May 2024", time: "09:25 AM", status: "Fees Paid" },
            { date: "30 May 2024", time: "10:30 AM", status: "Appointment Scheduled" }
          ]
        },
        afterBiometrics: {
          title: "Post Biometrics - What Happens Next?",
          steps: [
            { title: "Biometrics Submitted", description: "Your biometrics will be submitted to the embassy.", icon: "Fingerprint" },
            { title: "Data Verification", description: "Embassy will verify your information.", icon: "FileCheck" },
            { title: "Background Check", description: "Your application goes through background verification.", icon: "Shield" },
            { title: "Visa Decision", description: "Embassy will make a decision on your visa.", icon: "CheckCircle" },
            { title: "Passport Collection", description: "You will be notified once your passport is ready.", icon: "FileOutput" }
          ]
        },
        declaration: {
          title: "Declaration",
          checkboxText: "I declare that I have read and understood all the instructions for biometrics appointment.",
          date: "22 May 2024",
          name: "Ananya Sharma"
        }
      },
      importantInfo: [
        "Please reach the center 15 minutes before your appointment time.",
        "Lateness may not be allowed to attend the appointment.",
        "Mobile phones and electronic gadgets are not allowed inside the center.",
        "Biometric data once captured is valid for 59 months."
      ]
    },
    {
      id: 5,
      label: "Visa Decision",
      route: "visa-decision",
      page: {
        title: "Visa Decision",
        status: "Under Review by Embassy",
        subtitle: "The embassy is currently reviewing your application. Please track the status below."
      },
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
            { label: "Last Updated", value: "20 May 2024 11:30 AM", icon: "Clock" }
          ]
        },
        currentStatus: {
          title: "Current Status",
          status: "Application Under Review",
          description: "Your application is being processed by the visa officer.",
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
            { label: "Application Received by Embassy", date: "15 May 2024", status: "completed", description: "Your application has been received." },
            { label: "Under Review", date: "20 May 2024", status: "active", description: "Your application is under review by the visa officer." },
            { label: "Decision Pending", date: "", status: "pending", description: "The decision will be taken after document verification." },
            { label: "Decision Communicated", date: "", status: "pending", description: "You will be notified once the decision is available." }
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
            { name: "Visa Application Form", status: "Verified", date: "10 May 2024", remarks: "Accepted" }
          ]
        },
        embassyUpdate: {
          title: "Embassy Update",
          items: [
            { date: "20 May 2024 11:30 AM", status: "Current Status", description: "Your application is under review by the visa officer." },
            { date: "15 May 2024 10:45 AM", status: "Update", description: "Your application has been received by the embassy." },
            { date: "10 May 2024 02:00 PM", status: "Update", description: "Your application has been submitted successfully." }
          ]
        },
        declaration: {
          title: "Declaration",
          checkboxText: "I understand that my application is under review and the decision is at the sole discretion of the embassy.",
          date: "20 May 2024",
          name: "Ananya Sharma"
        }
      }
    },
    {
      id: 6,
      label: "Visa Approved",
      route: "visa-approved",
      page: {
        title: "Visa Approved",
        status: "Approved",
        subtitle: "Congratulations! Your visa has been approved."
      },
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
          rows: [
            { name: "Passport (First & Last Page)", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "APS Certificate", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "University Admission Letter", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Financial Documents", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Proof of Accommodation", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "CV / Resume", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Academic Transcripts", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "IELTS Score Card", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Health Insurance", status: "Verified", date: "10 May 2024", remarks: "Accepted" },
            { name: "Visa Application Form", status: "Verified", date: "10 May 2024", remarks: "Accepted" }
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
      }
    }
  ],
  user: {
    name: "Ananya Sharma",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  sidebar: {
    summary: {
      title: "Application Summary",
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
        { label: "Last Updated", value: "07 Jun 2024 11:30 AM" }
      ]
    },
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
        { text: "Track Application", icon: "FileSearch" },
        { text: "Download Documents", icon: "Download" },
        { text: "Contact Support", icon: "HelpCircle" },
        { text: "Visa Guide", icon: "BookOpen" }
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
  const data = visaJourneyData;

  // Get current step data
  const currentStepData = data.steps.find(step => step.id === currentStep) || data.steps[0];
  const pageData = currentStepData.page;
  const bannerData = currentStepData.banner;

  const visaDetilas = async () => {
    try {
      const url = await axiosInstance.get('/visa/my');
      console.log(url.data);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    visaDetilas();
  },[]);

  // Render the appropriate step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1APSApplied data={data} currentStepId={currentStep} />;
      case 2:
        return <Step2APSApproval data={data} currentStepId={currentStep} />;
      case 3:
        return <Step3VisaApplication data={data} currentStepId={currentStep} />;
      case 4:
        return <Step4Biometrics data={data} currentStepId={currentStep} />;
      case 5:
        return <Step5VisaDecision data={data} currentStepId={currentStep} />;
      case 6:
        return <Step6VisaApproved data={data} currentStepId={currentStep} />;
      default:
        return <Step1APSApplied data={data} currentStepId={currentStep} />;
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {pageData.title}
            <span className={`text-xs font-normal px-2 py-0.5 rounded ${
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
          <p className="text-sm text-gray-500 mt-1">{pageData.subtitle}</p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 overflow-x-auto">
          <div className="flex justify-between min-w-[600px] relative">
            {data.steps.map((step, index) => (
              <div key={step.id} onClick={() => setCurrentStep(step.id)} className="cursor-pointer">
                <ProgressStep 
                  step={step} 
                  index={index} 
                  total={data.steps.length} 
                  currentStepId={currentStep}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className={`${getBannerStyles()} rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border`}>
          <div className="flex items-start gap-3">
            <div className={`${getBannerIconStyles()} rounded-full p-1 flex-shrink-0 mt-0.5`}>
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{bannerData.title}</h4>
              <p className="text-xs mt-0.5">{bannerData.subtitle}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white border border-orange-200 text-[#f56e45] text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            {bannerData.secondaryAction && bannerData.secondaryAction}
            {bannerData.action && !bannerData.secondaryAction && <Download size={14} />}
            {bannerData.action || (bannerData.secondaryAction && bannerData.action)}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Dynamic Content */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {renderStepContent()}
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Application Summary */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-800">{data.sidebar.summary.title}</h4>
                {/* <span className="text-xs text-[#f56e45] cursor-pointer hover:underline">Edit</span> */}
              </div>
              <div className="space-y-1.5 text-xs">
                {data.sidebar.summary.fields.map((field, idx) => (
                  <div key={idx} className={`flex justify-between ${idx !== data.sidebar.summary.fields.length - 1 ? 'border-b border-gray-50 pb-1.5' : ''}`}>
                    <span className="text-gray-500">{field.label}</span>
                    <span className="font-medium text-gray-800">
                      {field.isFlag ? <span className="flex items-center gap-1"><span>🇩🇪</span> {field.value}</span> : field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status Card for Step 1 */}
            {currentStep === 1 && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Application Progress</h4>
                <div className="relative w-28 h-28 mx-auto mb-2">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                    <circle cx="50" cy="50" r="45" stroke="#f6793b" strokeWidth="8" fill="transparent" strokeDasharray="283" strokeDashoffset="240" strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">15%</span>
                    <span className="text-[10px] text-gray-400">Completed</span>
                  </div>
                </div>
                <div className="w-full space-y-1 mt-1">
                  {data.steps.map((step, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          step.id < currentStep ? 'bg-green-500' : 
                          step.id === currentStep ? 'bg-[#f56e45]' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-xs text-gray-600">{step.label}</span>
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {step.id < currentStep ? 'Completed' : step.id === currentStep ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Timeline for Step 2 */}
            {currentStep === 2 && data.steps[1].statusTimeline && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-3">APS Approval Status</h4>
                <div className="relative pl-4">
                  {data.steps[1].statusTimeline.map((item, idx) => (
                    <div key={idx} className="relative pl-6 pb-6 last:pb-0">
                      {idx < 3 && <div className="absolute left-2.5 top-3 bottom-0 w-0.5 bg-green-500"></div>}
                      <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 border-white ${item.status === 'Completed' ? 'bg-green-500' : 'bg-green-500'} ring-1 ring-gray-200 flex items-center justify-center`}>
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                      <div className="ml-1">
                        <p className="text-xs font-bold text-gray-800">{item.title}</p>
                        <p className="text-[10px] text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Steps for Step 3 */}
            {currentStep === 3 && data.steps[2].progressSteps && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-3">Application Progress</h4>
                <div className="space-y-1">
                  {data.steps[2].progressSteps.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-1.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        item.status === 'Completed' ? 'bg-green-500' : 
                        item.status === 'In Progress' ? 'bg-[#f56e45]' : 'bg-gray-200'
                      }`}>
                        {item.status === 'Completed' && <Check size={12} className="text-white" />}
                        {item.status === 'In Progress' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span className={`text-xs ${
                        item.status === 'Completed' ? 'text-gray-600' : 
                        item.status === 'In Progress' ? 'text-[#f56e45] font-medium' : 'text-gray-400'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Info for Step 4 */}
            {currentStep === 4 && data.steps[3].importantInfo && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-3">Important Information</h4>
                <div className="space-y-2">
                  {data.steps[3].importantInfo.map((text, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="mt-0.5 text-orange-500"><Info size={12} /></div>
                      <p className="text-xs text-gray-600">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visa Guide for all steps */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-gray-800">Visa Guide</h4>
                <span className="text-xs text-[#f56e45] cursor-pointer hover:underline">View All</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded">
                  <div className="flex items-center gap-2"><div className="p-1 bg-gray-50 rounded-full"><HelpCircle size={10} className="text-gray-500" /></div><span className="text-xs text-gray-600">What is APS Certificate?</span></div>
                  <ChevronDown size={10} className="text-gray-400 -rotate-90" />
                </div>
                <div className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded">
                  <div className="flex items-center gap-2"><div className="p-1 bg-gray-50 rounded-full"><FileText size={10} className="text-gray-500" /></div><span className="text-xs text-gray-600">Documents Required for Visa</span></div>
                  <ChevronDown size={10} className="text-gray-400 -rotate-90" />
                </div>
                <div className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded">
                  <div className="flex items-center gap-2"><div className="p-1 bg-gray-50 rounded-full"><Clock size={10} className="text-gray-500" /></div><span className="text-xs text-gray-600">Visa Processing Time</span></div>
                  <ChevronDown size={10} className="text-gray-400 -rotate-90" />
                </div>
                <div className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded">
                  <div className="flex items-center gap-2"><div className="p-1 bg-gray-50 rounded-full"><AlertCircle size={10} className="text-gray-500" /></div><span className="text-xs text-gray-600">Common Rejection Reasons</span></div>
                  <ChevronDown size={10} className="text-gray-400 -rotate-90" />
                </div>
              </div>
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
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 border border-white"></div>)}
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
              <button className="w-full bg-[#f56e45] hover:bg-[#f56e45] text-white text-xs font-bold py-2 rounded-lg transition-colors">{data.sidebar.counselor.actionButton}</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-8 border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><p className="text-xs font-bold text-orange-600">{data.footer.processingTime}</p><p className="text-[10px] text-gray-500">APS Processing Time</p></div>
          <div><p className="text-xs font-bold text-orange-600">{data.footer.visaTime}</p><p className="text-[10px] text-gray-500">Visa Processing Time</p></div>
          <div><p className="text-xs font-bold text-orange-600">{data.footer.visaFee}</p><p className="text-[10px] text-gray-500">Visa Fee (Approx.)</p></div>
          <div><p className="text-xs font-bold text-orange-600">{data.footer.applyEarly}</p><p className="text-[10px] text-gray-500">At least 3 months before intake</p></div>
        </div>
        <div className="mt-2 text-center"><p className="text-[8px] text-gray-400">{data.footer.disclaimer}</p></div> */}

      </main>
    </div>
  );
}