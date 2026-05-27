"use client"

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  FileText,
  User,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Fingerprint,
  Globe,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MessageCircle,
  Download,
  Printer,
  Bell,
  Eye,
  ExternalLink,
  TrendingUp,
  Shield,
  BookOpen,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Rigthsidebar } from "@/components/dashboard/application/rightsidebar";
import axiosInstance from "@/app/axiosInstance";

// ============================================
// TYPES
// ============================================

type DocumentStatus = "Verified" | "Pending" | "Rejected";

interface SubmittedDocument {
  name: string;
  status: DocumentStatus;
  submittedOn: string;
  remarks: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
}

interface EmbassyUpdate {
  date: string;
  time: string;
  title: string;
  message: string;
}

interface VisaDecisionData {
  // Application Summary
  country: string;
  university: string;
  program: string;
  intake: string;
  visaType: string;
  visaCategory: string;
  applicationNo: string;
  trackingId: string;
  dateStarted: string;
  lastUpdated: string;
  currentStatus: string;
  embassy: string;
  vfsCenter: string;

  // Personal Details
  dateOfBirth: string;
  passportNo: string;

  // Timeline
  timeline: TimelineEvent[];

  // Submitted Documents
  documents: SubmittedDocument[];

  // Embassy Updates
  embassyUpdates: EmbassyUpdate[];

  // Next Steps
  nextSteps: string[];

  // Important Notes
  importantNotes: string[];

  // Counselor Info
  counselor: {
    name: string;
    rating: number;
    studentsHelped: number;
  };

  // Declaration
  declarationText: string;
  applicantName: string;
  applicantEmail: string;
}

// ============================================
// MOCK DATA (Replace with API call)
// ============================================

const mockVisaDecisionData: VisaDecisionData = {
  country: "Germany",
  university: "TU Munich",
  program: "MS in Data Science",
  intake: "Fall 2026",
  visaType: "Student Visa (D)",
  visaCategory: "National Visa (D)",
  applicationNo: "VA20240501001",
  trackingId: "APS123456789",
  dateStarted: "10 May 2024",
  lastUpdated: "20 May 2024 11:30 AM",
  currentStatus: "Under Review",
  embassy: "German Embassy, New Delhi",
  vfsCenter: "VFS Global, New Delhi",
  dateOfBirth: "12 Aug 2002",
  passportNo: "A1234567",

  timeline: [
    {
      date: "10 May 2024",
      title: "Application Submitted",
      description: "Your visa application has been submitted successfully.",
      status: "completed"
    },
    {
      date: "15 May 2024",
      title: "Application Received by Embassy",
      description: "Your application has been received by the embassy.",
      status: "completed"
    },
    {
      date: "20 May 2024",
      title: "Under Review",
      description: "Your application is under review by the visa officer.",
      status: "current"
    },
    {
      date: "Pending",
      title: "Decision Communicated",
      description: "Your application has been communicated to the embassy.",
      status: "pending"
    },
    {
      date: "Pending",
      title: "Passport Collection",
      description: "Collect your passport from the VFS center.",
      status: "pending"
    }
  ],

  documents: [
    { name: "Passport (First & Last Page)", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "APS Certificate", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "University Admission Letter", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "Financial Documents (Blocked Account)", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "Proof of Accommodation", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "CV / Resume", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "Academic Transcripts", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "IELTS Score Card", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "Health Insurance", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "Visa Application Form", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
    { name: "Application Fee Receipt", status: "Verified", submittedOn: "10 May 2024", remarks: "Accepted" },
  ],

  embassyUpdates: [
    {
      date: "20 May 2024",
      time: "11:30 AM",
      title: "Current Status",
      message: "Your application is under review by the visa officer. We will update you once the decision is made."
    },
    {
      date: "15 May 2024",
      time: "09:45 AM",
      title: "Application Received",
      message: "Your application has been received by the embassy."
    },
    {
      date: "10 May 2024",
      time: "04:20 PM",
      title: "Application Submitted",
      message: "Your application has been submitted successfully."
    }
  ],

  nextSteps: [
    "Document Verification - The officer will verify your documents.",
    "Background Check - Your background may be verified.",
    "Final Decision - The officer will make a decision on your visa.",
    "Decision Notification - You will be informed via email/SMS.",
    "Passport Return - Your passport will be returned via VFS."
  ],

  importantNotes: [
    "Please ensure your passport is valid.",
    "Do not book travel tickets until visa is approved.",
    "Keep checking your email for updates."
  ],

  counselor: {
    name: "Priya Mehta",
    rating: 4.9,
    studentsHelped: 128
  },

  declarationText: "I understand that my application is under review and the decision is at the sole discretion of the embassy. I will await the official communication regarding the decision.",
  applicantName: "Ananya Sharma",
  applicantEmail: "ananya.sharma@example.com"
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function VisaDecisionPage() {
  const [data, setData] = useState<VisaDecisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["summary", "timeline", "documents", "updates", "nextsteps"])
  );
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [signature, setSignature] = useState("");


  useEffect(() => {
    // Flag to track component mount status
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/visa/user');
        console.log(res.data.data, "user ");

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Only update state if component is still mounted
        if (isMounted) {
          setData(mockVisaDecisionData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          // Handle your errors safely here
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function runs when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);


  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "completed":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "current":
        return <Clock size={16} className="text-amber-500" />;
      case "pending":
        return <AlertCircle size={16} className="text-slate-400" />;
      case "under review":
        return <Clock size={16} className="text-amber-500" />;
      default:
        return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "current":
      case "under review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "pending":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // Implement save/export functionality
    alert("Application details saved successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading visa decision details...</p>
        </div>
      </div>
    );
  }

  // if (!data) {
  // return (
  //   <div className="h-[80vh] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
  //     <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">

  //       {/* Icon */}
  //       <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
  //         <AlertCircle size={40} className="text-amber-500" />
  //       </div>

  //       {/* Heading */}
  //       <h2 className="text-2xl font-bold text-slate-800 mb-3">
  //         Offer Letter Not Available Yet
  //       </h2>

  //       {/* Description */}
  //       <p className="text-slate-600 leading-relaxed mb-6">
  //         Your offer letter has not been received yet. 
  //         Please wait while the university reviews your application.
  //         Once the offer letter is available, it will appear here automatically.
  //       </p>

  //       {/* Status Badge */}
  //       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
  //         <Clock size={16} />
  //         Waiting for University Response
  //       </div>
  //     </div>
  //   </div>
  // );
  // }

  return (

    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto px-6 py-6 space-y-5">
        <div className="mb-6">
          {/* <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span>My Journey</span>
            <ChevronRight size={14} />
            <span>Visa Process</span>
            <ChevronRight size={14} />
            <span className="text-violet-600 font-medium">Visa Decision</span>
          </div> */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Visa Decision</h1>
              <p className="text-slate-500 mt-1">The embassy is currently reviewing your application. Please track the status below.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
              >
                <Printer size={18} />
                <span className="hidden sm:inline">Save & Print</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition shadow-sm"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Download Summary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current Status Banner */}
        <div className="mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100">
              <Clock size={24} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">Current Status: {data?.currentStatus}</h3>
              <p className="text-amber-700 text-sm mt-1">
                Your application is being reviewed by the visa officer.
                Please do not contact the embassy during this time.
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-amber-600">
                <span className="flex items-center gap-1">
                  <Bell size={12} /> Email alerts enabled
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Processing Time: 15 – 30 Working Days (After biometric)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left/Center */}
          <div className="lg:col-span-2 space-y-5">

            {/* Application Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection("summary")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-violet-600" />
                  <h2 className="font-semibold text-slate-800">Application Summary</h2>
                </div>
                {expandedSections.has("summary") ? (
                  <ChevronDown size={18} className="text-slate-400" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400" />
                )}
              </button>

              {expandedSections.has("summary") && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500">Country</label>
                      <p className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                        <Globe size={14} /> {data?.country}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">University</label>
                      <p className="font-medium text-slate-800">{data?.university}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Program</label>
                      <p className="font-medium text-slate-800">{data?.program}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Intake</label>
                      <p className="font-medium text-slate-800">{data?.intake}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Visa Type</label>
                      <p className="font-medium text-slate-800">{data?.visaType}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Visa Category</label>
                      <p className="font-medium text-slate-800">{data?.visaCategory}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Application No.</label>
                      <p className="font-medium text-slate-800">{data?.applicationNo}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Tracking ID</label>
                      <p className="font-medium text-slate-800">{data?.trackingId}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Date Started</label>
                      <p className="font-medium text-slate-800">{data?.dateStarted}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Last Updated</label>
                      <p className="font-medium text-slate-800">{data?.lastUpdated}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Embassy</label>
                      <p className="font-medium text-slate-800">{data?.embassy}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">VFS Center</label>
                      <p className="font-medium text-slate-800">{data?.vfsCenter}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-500">Date of Birth</label>
                        <p className="font-medium text-slate-800">{data?.dateOfBirth}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Passport No.</label>
                        <p className="font-medium text-slate-800">{data?.passportNo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Decision Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection("timeline")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-violet-600" />
                  <h2 className="font-semibold text-slate-800">Decision Timeline</h2>
                </div>
                {expandedSections.has("timeline") ? (
                  <ChevronDown size={18} className="text-slate-400" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400" />
                )}
              </button>

              {expandedSections.has("timeline") && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                  <div className="relative">
                    {data?.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4 pb-8 last:pb-0 relative">
                        <div className="flex flex-col items-center">
                          <div className={`p-1.5 rounded-full ${event.status === "completed" ? "bg-emerald-100" :
                              event.status === "current" ? "bg-amber-100" : "bg-slate-100"
                            }`}>
                            {getStatusIcon(event.status)}
                          </div>
                          {idx < data?.timeline.length - 1 && (
                            <div className={`w-0.5 flex-1 mt-2 ${event.status === "completed" ? "bg-emerald-200" : "bg-slate-200"
                              }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h3 className={`font-semibold ${event.status === "current" ? "text-amber-700" : "text-slate-800"
                              }`}>
                              {event.title}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                                event.status === "current" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                              }`}>
                              {event.date}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submitted Documents */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection("documents")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-violet-600" />
                  <h2 className="font-semibold text-slate-800">
                    Submitted Documents
                    <span className="ml-2 text-xs text-slate-500 font-normal">({data?.documents.filter(d => d.status === "Verified").length}/{data?.documents.length})</span>
                  </h2>
                </div>
                {expandedSections.has("documents") ? (
                  <ChevronDown size={18} className="text-slate-400" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400" />
                )}
              </button>

              {expandedSections.has("documents") && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left py-2 px-3 text-slate-600 font-medium">Document Name</th>
                          <th className="text-left py-2 px-3 text-slate-600 font-medium">Status</th>
                          <th className="text-left py-2 px-3 text-slate-600 font-medium">Submitted On</th>
                          <th className="text-left py-2 px-3 text-slate-600 font-medium">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.documents.map((doc, idx) => (
                          <tr key={idx} className="border-t border-slate-100">
                            <td className="py-2 px-3 text-slate-700">{doc.name}</td>
                            <td className="py-2 px-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                {getStatusIcon(doc.status)}
                                {doc.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-500">{doc.submittedOn}</td>
                            <td className="py-2 px-3 text-slate-500">{doc.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* What Happens Next? */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection("nextsteps")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-violet-600" />
                  <h2 className="font-semibold text-slate-800">What Happens Next?</h2>
                </div>
                {expandedSections.has("nextsteps") ? (
                  <ChevronDown size={18} className="text-slate-400" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400" />
                )}
              </button>

              {expandedSections.has("nextsteps") && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data?.nextSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                        <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Rigthsidebar />

        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          button, .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}