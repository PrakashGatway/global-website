"ues client"

import { AlertCircle, BadgeDollarSign, Bell, Building2, Calendar, CalendarDays, Check, CheckCircle2, Clock3, Download, FileCheck, FileText, Globe, GraduationCap, Hash, Hourglass, Info, Mail, MessageCircle, Phone, Share2, User, Users } from "lucide-react";
import Comments from "./comments";


export default function SubmittedtoSchool({currentstep,application,profile,allProfile}){

      const counselor = {
  name: "Rahul Sharma",
  designation: "Senior Admissions Advisor",
  email: "rahul.sharma@ooshas.com",
  phone: "+91 98765 43210",
  image:
    "https://randomuser.me/api/portraits/men/32.jpg",
};

const submittedDocuments = [
  {
    id: 1,
    name: "Passport / ID Proof",
    uploaded: true,
  },
  {
    id: 2,
    name: "Academic Transcript / Marksheet",
    uploaded: true,
  },
  {
    id: 3,
    name: "High School Certificate / Diploma",
    uploaded: true,
  },
  {
    id: 4,
    name: "English Language Proficiency Proof",
    uploaded: true,
  },
  {
    id: 5,
    name: "Curriculum Vitae (CV)",
    uploaded: true,
  },
  {
    id: 6,
    name: "Motivation Letter",
    uploaded: true,
  },
  {
    id: 7,
    name: "Reference Letter (Optional)",
    uploaded: true,
  },
];

const applicationSummary = [
  {
    label: "Program",
    value: "Bachelor of Computer Science",
  },
  {
    label: "Application No.",
    value: "OS1779706950795",
  },
  {
    label: "Intake",
    value: "March 2026",
  },
  {
    label: "Country",
    value: "Italy",
  },
];

const timeline = [
  {
    title: "Application Received",
    description:
      "University has received your application successfully",
    status: "completed",
  },
  {
    title: "Initial Review",
    description:
      "The admission team will now review your application and documents.",
    status: "current",
  },
  {
    title: "Further Evaluation",
    description:
      "You may be contacted if additional information or documents are required.",
    status: "pending",
  },
  {
    title: "Admission Decision",
    description:
      "You will be notified once a decision is made.",
    status: "pending",
  },
];

const submissionDetails = [
  {
    icon: Hash,
    label: "Application ID",
    value: "OS1779706950795",
  },
  {
    icon: GraduationCap,
    label: "Program",
    value: "Bachelor of Computer Science",
  },
  {
    icon: Calendar,
    label: "Intake",
    value: "March 2026",
  },
  {
    icon: CalendarDays,
    label: "Submission Date",
    value: "22 May 2025, 02:45 PM",
  },
  {
    icon: User,
    label: "Submitted By",
    value: "OOSHAS Global Admissions Team",
  },
  {
    icon: Globe,
    label: "Submission Method",
    value: "Online Application Portal",
  },
  {
    icon: BadgeDollarSign,
    label: "Application Fee",
    value: "€90",
    status: "Paid",
  },
];

const applicationTimeline = [
  {
    date: "20 May 2025, 10:30 AM",
    title: "Application Started",
    status: "completed",
  },
  {
    date: "20 May 2025, 11:45 AM",
    title: "Under OOSHAS Review",
    status: "completed",
  },
  {
    date: "22 May 2025, 02:45 PM",
    title: "Submitted to School",
    status: "completed",
  },
  {
    date: "",
    title: "Awaiting School Response",
    subtitle: "In Progress",
    status: "current",
  },
  {
    date: "",
    title: "Admission Processing",
    subtitle: "Pending",
    status: "pending",
  },
  {
    date: "",
    title: "Offer Received",
    subtitle: "Pending",
    status: "pending",
  },
];

const nextSteps = [
  {
    title: "Under Review by University",
    description:
      "The university admissions team is reviewing your application, academic records and supporting documents.",
    icon: Users,
  },
  {
    title: "Additional Information (If Any)",
    description:
      "If any further information or documents are required, the university will contact you directly.",
    icon: FileText,
  },
  {
    title: "Decision Notification",
    description:
      "You will be notified here and via email once a decision has been made.",
    icon: Bell,
  },
];

const nextSteps2 = [
  {
    title: "Review Offer",
    description:
      "Read your offer letter and program details carefully.",
  },
  {
    title: "Accept Offer",
    description:
      "Accept your offer by the respond by date.",
  },
  {
    title: "Pay Enrollment Deposit",
    description:
      "Pay the required deposit as mentioned in the offer letter.",
  },
  {
    title: "Prepare for Enrollment",
    description:
      "Complete visa, accommodation and pre-arrival requirements.",
  },
];

const offerDetails = [
  {
    label: "Program",
    value: "Bachelor of Computer Science",
  },
  {
    label: "Faculty/School",
    value: "School of Engineering",
  },
  {
    label: "Start Date",
    value: "15 September 2026",
  },
  {
    label: "Duration",
    value: "3 Years",
  },
  {
    label: "Tuition Fee (per year)",
    value: "€2,345",
  },
  {
    label: "Offer Type",
    value: "Full Time",
  },
  {
    label: "Conditions",
    value: "No conditions",
  },
];

const importantDates = [
  {
    title: "Offer Received",
    date: "04 June 2025",
    status: "completed",
  },
  {
    title: "Respond By",
    date: "18 June 2025",
    status: "current",
    extra: "14 Days Left",
  },
  {
    title: "Enrollment Deposit Deadline",
    date: "02 July 2025",
    status: "pending",
  },
  {
    title: "Program Start Date",
    date: "15 September 2026",
    status: "pending",
  },
];

  const details = [
    { label: "Student Name", value: "Rohit Kumar" },
    { label: "Date of Birth", value: "15 Jan 2004" },
    { label: "Nationality", value: "India" },
    { label: "Passport No.", value: "Z5678901" },
    { label: "Program", value: "Bachelor of computer science" },
    { label: "Start Date", value: "15 September 2026" },
    { label: "End Date", value: "14 September 2029" },
    { label: "CAS Issue Date", value: "06 June 2025" },
    { label: "CAS Expiry Date", value: "06 September 2025" },
    { label: "Tuition Fee (per year)", value: "€2,345" },
    { label: "CAS Number", value: "E4G6-3F8H-9L2K-7L1M" },
    { label: "Sponsor Licence Number", value: "L2G34H15" },
  ];

    const Parsedocuments =
    typeof allProfile?.profile?.documents === "string"
      ? JSON.parse(allProfile.profile.documents)
      : allProfile.profile.documents;

  console.log(Parsedocuments);

  const documentList = Object.values(Parsedocuments || {});

    return(
        <>
        <div className="  md:py-6">
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">

    {/* LEFT CONTENT */}
    {currentstep?.step !== "OfferReceived" ? (
        <div className="xl:col-span-9 space-y-5">

      {/* Top Status Card */}
      {currentstep.step === "ConfirmmationLetter" ? ( <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 md:p-2 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Illustration */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-40 h-40 md:w-52 md:h-52 bg-orange-50 rounded-2xl flex items-center justify-center">
            <FileCheck className="w-20 h-20 md:w-20 md:h-20 text-orange-500" />
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <h2 className="text-xl md:text-lg font-bold text-slate-900">
              Congratulations! Your Confirmation Letter is Ready
            </h2>

            <span className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              Received
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2 text-slate-600 text-sm md:text-sm">
            <p>
              Your Confirmation of Acceptance for Studies (CAS) has been
              issued by the University of Bologna.
            </p>

            <p>
              You can download your CAS letter below and start your visa
              application process.
            </p>
          </div>

          {/* Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-2">
                Document Type
              </p>

              <h4 className="font-semibold text-slate-800 leading-6 text-sm">
                CAS 
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-2">
                CAS Number
              </p>

              <h4 className="font-semibold text-orange-600 break-all text-sm">
                E4G6-3F8H-9J2K-7L1M
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-2">
                Issued On
              </p>

              <h4 className="font-semibold text-slate-800 text-sm">
                06 June 2025
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-2">
                Valid Until
              </p>

              <h4 className="font-semibold text-slate-800 text-sm">
                06 September 2025
              </h4>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 text-sm">
              <Download size={18} />
              Download CAS Letter
            </button>

            <button className="flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-medium px-6 py-3 rounded-xl transition-all duration-300 text-sm">
              <Share2 size={18} />
              Share with Counselor
            </button>
          </div>
        </div>
      </div>
    </div>
    ) : currentstep?.step === "SubmitToSchool" ? (
      <div className="bg-white border border-slate-200 p-6">
  <div className="flex flex-col lg:flex-row gap-5">

    <div className="flex justify-center lg:justify-start">
          <div className="w-32 h-32 md:w-40 md:h-40  flex items-center justify-center">
            <img src="/school-icon.png" alt="" />
          </div>
        </div>

    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h2 className="font-bold text-lg text-slate-800">
          Application Submitted to School
        </h2>

        <span className="px-3 py-1  bg-orange-100 text-orange-700 text-xs font-semibold">
          Completed
        </span>
      </div>

      <p className="text-slate-500 text-sm">
        Your application has been successfully submitted
        to the University of Bologna.
      </p>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            
            {/* Submitted On */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-orange-500" />
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">
                  Submitted on
                </p>

                <h4 className="font-semibold text-slate-900">
                  22 May 2025, 02:45 PM
                </h4>
              </div>
            </div>

            {/* Submitted To */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-500" />
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">
                  Submitted to
                </p>

                <h4 className="font-semibold text-slate-900">
                  University of Bologna, Italy
                </h4>
              </div>
            </div>

          </div>
    </div>
  </div>
</div>) : currentstep?.step === "AwaitingSchoolResponse" ? (
   <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 md:p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Left Illustration */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-32 h-32 md:w-40 md:h-40  flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/9727/9727531.png" alt="" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <h2 className="text-xl md:text-lg font-bold text-slate-900">
              Awaiting School Response
            </h2>

            <span className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
              In Progress
            </span>
          </div>

          {/* Description */}
          <div className="space-y-1 text-slate-600 text-sm">
            <p>
              Your application has been received by the University of Bologna.
            </p>

            <p>
              The admissions team is currently reviewing your application and
              supporting documents.
            </p>
          </div>

          {/* Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            
            {/* Submitted On */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-orange-500" />
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">
                  Submitted on
                </p>

                <h4 className="font-semibold text-slate-900">
                  22 May 2025, 02:45 PM
                </h4>
              </div>
            </div>

            {/* Submitted To */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-500" />
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">
                  Submitted to
                </p>

                <h4 className="font-semibold text-slate-900">
                  University of Bologna, Italy
                </h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
) : null}
      {/* Alert */}
      <div className="bg-orange-50 border border-orange-100  px-4 py-3 flex items-center gap-3">
  <Info className="w-5 h-5 text-orange-600" />

  <p className="text-sm text-orange-700">
    You will be notified once the university starts
    reviewing your application.
  </p>
</div>
      {/* Details + Timeline */}
     {currentstep.step === "ConfirmmationLetter" ? (
      <>
       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          <button className="px-6 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 whitespace-nowrap">
            CAS Details
          </button>

          <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
            Important Information
          </button>

          <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
            What You Can Do Next
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          {/* Left Side */}
          <div>
            <div className="space-y-5">
              {details.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </p>

                  <p className="text-sm text-gray-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div>
            <div className="border border-gray-200 rounded-lg bg-white p-3 shadow-sm">
              <div className="aspect-[3/4] overflow-hidden rounded">
                <img
                  src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200"
                  alt="CAS Document"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-4 border border-blue-200 bg-blue-50 rounded-lg p-4 flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                i
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Please verify all details in your CAS letter. In case of any
                discrepancies, contact your admissions counselor immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div></>
    ) :
    ( <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200  overflow-hidden">
  <div className="border-b">
    <div className="flex">
      <button className="px-6 py-4 text-sm font-semibold text-orange-600 border-b-2 border-orange-600">
        Submission Details
      </button>
    </div>
  </div>

  <div className="p-5 space-y-4">
  {currentstep?.step === "SubmitToSchool" ? (
    <div className="space-y-4">
  {/* Application ID */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Hash className="w-4 h-4 text-slate-500" />
      <span className="text-sm text-slate-600">
        Application ID
      </span>
    </div>

    <span className="text-sm font-medium text-slate-800">
      {application?.applicationNumber}
    </span>
  </div>

  {/* Program */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <GraduationCap className="w-4 h-4 text-slate-500" />
      <span className="text-sm text-slate-600">
        Program
      </span>
    </div>

    <span className="text-sm font-medium text-slate-800">
      {application?.course?.name}
    </span>
  </div>

  {/* Intake */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Calendar className="w-4 h-4 text-slate-500" />
      <span className="text-sm text-slate-600">
        Intake
      </span>
    </div>

    <span className="text-sm font-medium text-slate-800">
      {application?.intake}
    </span>
  </div>

  {/* Submission Date */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <CalendarDays className="w-4 h-4 text-slate-500" />
      <span className="text-sm text-slate-600">
        Submission Date
      </span>
    </div>

    <span className="text-sm font-medium text-slate-800">
      {new Date(application?.createdAt).toLocaleString("en-IN")}
    </span>
  </div>



  {/* Application Fee */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <BadgeDollarSign className="w-4 h-4 text-slate-500" />
      <span className="text-sm text-slate-600">
        Application Fee
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
        Paid
      </span>

      <span className="text-sm font-medium text-slate-800">
        €{application?.course?.applicationFee}
      </span>
    </div>
  </div>
</div>
  ) : currentstep?.step === "AwaitingSchoolResponse" ? (
    <div className="space-y-6">
      {applicationTimeline.map((item, index) => (
        <div key={index} className="relative flex gap-4">
          {index !== applicationTimeline.length - 1 && (
            <div className="absolute left-[10px] top-6 h-full w-[2px] bg-slate-200" />
          )}

          <div className="z-10">
            {item.status === "completed" && (
              <div className="w-5 h-5  border-2 border-green-500 bg-white flex items-center justify-center">
                <Check className="w-3 h-3 text-green-500" />
              </div>
            )}

            {item.status === "current" && (
              <div className="w-5 h-5  bg-orange-600 flex items-center justify-center">
                <Hourglass className="w-3 h-3 text-white" />
              </div>
            )}

            {item.status === "pending" && (
              <div className="w-5 h-5  border-2 border-slate-300 bg-white" />
            )}
          </div>

          <div>
            {item.date && (
              <p className="text-xs text-slate-500 mb-1">
                {item.date}
              </p>
            )}

            <h4 className="font-medium text-sm text-slate-800">
              {item.title}
            </h4>

            {item.subtitle && (
              <p
                className={`text-sm mt-1 ${
                  item.status === "current"
                    ? "text-orange-600 font-medium"
                    : "text-slate-400"
                }`}
              >
                {item.subtitle}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : null}
</div>
</div>

<div className="bg-white border border-slate-200  overflow-hidden">
  <div className="border-b">
    <div className="flex">
      <button className="px-6 py-4 text-sm font-semibold text-slate-700">
        What Happens Next?
      </button>
    </div>
  </div>

  <div className="p-5">
    {currentstep.step === "SubmitToSchool" ? (
        timeline.map((step, index) => (
      <div
        key={index}
        className="relative flex gap-4 pb-8 last:pb-0"
      >
        {index !== timeline.length - 1 && (
          <div className="absolute left-[10px] top-6 w-[2px] h-full bg-slate-200" />
        )}

        <div>
          {step.status === "completed" && (
            <div className="w-5 h-5 bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          )}

          {step.status === "current" && (
            <div className="w-5 h-5  bg-orange-100 flex items-center justify-center">
              <Clock3 className="w-4 h-4 text-orange-600" />
            </div>
          )}

          {step.status === "pending" && (
            <div className="w-5 h-5  border-2 border-slate-300 bg-white" />
          )}
        </div>

        <div>
          <h4 className="font-semibold text-sm text-slate-800">
            {step.title}
          </h4>

          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {step.description}
          </p>
        </div>
      </div>
    ))
    ) : currentstep.step === "AwaitingSchoolResponse" ? (
        <>
         <div className="space-y-8">
    {nextSteps.map((step, index) => {
      const Icon = step.icon;

      return (
        <div key={index} className="flex gap-4">
          <div className="w-12 h-12  bg-orange-50 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-orange-600" />
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-800">
              {step.title}
            </h4>

            <p className="text-sm text-slate-500 mt-1 leading-6">
              {step.description}
            </p>
          </div>
        </div>
      );
    })}
  </div>

  <div className="mt-8 bg-amber-50 border border-amber-200  p-4 flex gap-3">
    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />

    <div>
      <h4 className="font-medium text-amber-900">
        Please Note
      </h4>

      <p className="text-sm text-amber-700 mt-1">
        Processing time varies by program and workload.
        You can continue to track your application status here.
      </p>
    </div>
  </div></>
    ) :null}
    
  </div>
</div>
      </div>)}
      {/* Update Section */}
      <div className="bg-white border border-slate-200  p-5">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Need to Update Something?
      </h3>

      <p className="text-sm text-slate-500 max-w-2xl">
        If you need to update any information or documents,
        please contact your counselor.
      </p>
    </div>

    <button className="flex items-center justify-center gap-2 px-5 py-3 border border-orange-200 text-orange-600 font-medium hover:bg-orange-50 transition whitespace-nowrap">
      <MessageCircle className="w-4 h-4" />
      Contact Counselor
    </button>

  </div>
</div>

    </div>
    ) : (
        <div className="xl:col-span-9 space-y-5">
  {/* Offer Banner */}
  <div className="bg-white border border-slate-200  p-6">

  <div className="flex flex-col lg:flex-row gap-6">

    <div className="flex gap-5 flex-1">

      <div className="w-24 h-24 shrink-0">
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/receive-mail-3d-icon-png-download-5231900.png"
          alt=""
          className="w-full"
        />
      </div>

      <div className="flex-1">

        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2\xl font-bold text-slate-800">
            Congratulations! You've Received an Offer
          </h2>

          <span className="px-3 py-1  bg-green-100 text-green-700 text-xs font-medium">
            Offer Received
          </span>
        </div>

        <p className="text-slate-600 mt-2">
          Great news! The University of Bologna is pleased
          to offer you admission to the program.
        </p>

        <p className="text-slate-600">
          Please review your offer letter and the next steps below.
        </p>

      </div>
    </div>

  </div>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

    <div className="border p-4">
      <p className="text-xs text-slate-500">
        Offer Date
      </p>
      <p className="font-semibold">
        04 June 2025
      </p>
    </div>

    <div className="border  p-4">
      <p className="text-xs text-slate-500">
        Offer Status
      </p>
      <p className="font-semibold text-green-600">
        Unconditional
      </p>
    </div>

    <div className="border  p-4">
      <p className="text-xs text-slate-500">
        Respond By
      </p>
      <p className="font-semibold">
        18 June 2025
      </p>
      <p className="text-orange-500 text-sm">
        (14 Days Left)
      </p>
    </div>

    <div className="border p-4">
      <p className="text-xs text-slate-500">
        Issued By
      </p>
      <p className="font-semibold">
        Admissions Office
      </p>
      <p className="text-sm text-slate-500">
        University of Bologna
      </p>
    </div>

  </div>

  <div className="flex flex-wrap gap-3 mt-5">
    <button className="px-5 py-3 text-sm  bg-orange-600 text-white font-medium">
      View Offer Letter
    </button>

    <button className="px-5 py-3 text-sm  border border-orange-200 text-orange-600 font-medium">
      Download Offer Letter
    </button>
  </div>

</div>

  {/* Success Bar */}
  <div className="bg-green-50 border border-green-100  px-4 py-3">
  <p className="text-green-700 text-sm">
    Please read your offer letter carefully and follow the
    instructions to accept your offer.
  </p>
</div>

  {/* Cards Section */}
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">

    {/* What's Next */}
    <div className="xl:col-span-4">
       <div className="bg-white border p-5 h-full">

  <h3 className="font-semibold text-lg mb-5">
    What's Next?
  </h3>

  <div className="space-y-5">
    {nextSteps2.map((step,index)=>(
      <div key={index} className="flex gap-3">

        <div className="w-8 h-8 bg-orange-50 flex items-center justify-center shrink-0">
          {index + 1}
        </div>

        <div>
          <h4 className="font-medium text-sm">
            {step.title}
          </h4>

          <p className="text-xs text-slate-500">
            {step.description}
          </p>
        </div>

      </div>
    ))}
  </div>

  <button className="mt-6 w-full border border-orange-200 text-orange-600 py-3  font-medium text-xs">
    View Next Steps Guide →
  </button>

</div>
    </div>

    {/* Offer Details */}
    <div className="xl:col-span-4">
    <div className="bg-white border p-5 h-full">

  <h3 className="font-semibold text-lg mb-5">
    Key Offer Details
  </h3>

  <div className="space-y-4">
    {offerDetails.map((item,index)=>(
      <div
        key={index}
        className="flex justify-between gap-4"
      >
        <span className="text-slate-500 text-xs">
          {item.label}
        </span>

        <span className="font-medium text-right text-xs">
          {item.value}
        </span>
      </div>
    ))}
  </div>

  <div className="mt-5 bg-orange-50  p-4">
    <p className="text-xs text-orange-700 ">
      This is an official offer of admission.
      The full details are available in your offer letter.
    </p>
  </div>

</div>
    </div>

    {/* Important Dates */}
    <div className="xl:col-span-4">
      <div className="bg-white border p-5 h-full">

  <h3 className="font-semibold text-lg mb-5">
    Important Dates
  </h3>

  <div className="space-y-5">

    {importantDates.map((item,index)=>(
      <div
        key={index}
        className="flex gap-3"
      >

        <div className="mt-1">
          {item.status === "completed" && (
            <div className="w-5 h-5  bg-green-500" />
          )}

          {item.status === "current" && (
            <div className="w-5 h-5  bg-orange-500" />
          )}

          {item.status === "pending" && (
            <div className="w-5 h-5  border-2 border-slate-300" />
          )}
        </div>

        <div>
            <div className="flex gap-4">
          <h4 className="font-medium text-xs">
            {item.title}
          </h4>
           {item.extra && (
            <p className="text-orange-500 text-sm font-medium">
              {item.extra}
            </p>
          )}
          </div>
          
          <p className="text-xs text-slate-500">
            {item.date}
          </p>

         
        </div>

      </div>
    ))}

  </div>

  <div className="mt-6 bg-amber-50 border border-amber-100  p-4">

    <h4 className="font-medium text-amber-800">
      Need Guidance?
    </h4>

    <p className="text-xs text-amber-700 mt-2">
      Talk to your admissions counselor for any help
      with acceptance, visa or other queries.
    </p>

    <button className="mt-4 w-full py-3  border border-orange-200 text-orange-600 font-medium text-xs">
      Contact Counselor
    </button>

  </div>

</div>
    </div>

  </div>
</div>
    )  }
    

    {/* RIGHT SIDEBAR */}
    <div className="xl:col-span-3 space-y-5">
      {/* Summary */}
     <Comments application={application} profile={profile}/>
      {/* Documents */}
      <div className="bg-white border border-slate-200  p-5">
  <div className="flex items-center justify-between mb-5">
    <h3 className="font-semibold text-slate-800 text-sm">
      Documents Submitted
    </h3>

  
  </div>

  <div className="space-y-3">
    <div className="space-y-3">
  {documentList.map((doc) => (
    <div
      key={doc.docKey}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        {doc.status === "approved" ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : doc.status === "pending" ? (
          <Clock3 className="w-4 h-4 text-orange-500" />
        ) : doc.status === "rejected" ? (
          <AlertCircle className="w-4 h-4 text-red-500" />
        ) : (
          <FileText className="w-4 h-4 text-gray-400" />
        )}

        <span className="text-sm text-slate-700">
          {doc.docName}
        </span>
      </div>

      <span
        className={`text-xs font-medium capitalize ${
          doc.status === "approved"
            ? "text-green-600"
            : doc.status === "pending"
            ? "text-orange-600"
            : "text-red-600"
        }`}
      >
        {doc.status}
      </span>
    </div>
  ))}
</div>
  </div>
</div>
      {/* Counselor */}

<div className="bg-white border border-slate-200  p-5">
  <h3 className="text-lg font-semibold text-slate-800 mb-4">
    Your Counselor
  </h3>

  <div className="flex items-center ">
    <img
      src={allProfile?.data?.assignto?.image}
      alt={allProfile?.data?.assignto?.name}
      className="w-14 h-14  object-cover"
    />

    <div>
      <h4 className="font-semibold text-slate-800">
        {allProfile?.data?.assignto?.name}
      </h4>

     
    </div>
  </div>

  <div className="mt-5 space-y-3">
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <Mail className="w-4 h-4 text-slate-400" />
      {allProfile?.data?.assignto?.email}
    </div>

    <div className="flex items-center gap-3 text-sm text-slate-600">
      <Phone className="w-4 h-4 text-slate-400" />
      {allProfile?.data?.assignto?.phone}
    </div>
  </div>

  <div className="grid grid-cols-2 gap-2 mt-5">
    <button className="flex items-center justify-center gap-2 py-2.5  border border-orange-200 text-orange-600 hover:bg-orange-50 transition">
      <MessageCircle className="w-4 h-4" />
      Chat
    </button>

    <button className="flex items-center justify-center gap-2 py-2.5 border border-green-200 text-green-600 hover:bg-green-50 transition">
      <Phone className="w-4 h-4" />
      Call
    </button>
  </div>
</div>
    </div>

  </div>
</div>
</>
    )
}