"ues client"

import { BadgeDollarSign, Calendar, CalendarDays, CheckCircle2, Clock3, FileText, Globe, GraduationCap, Hash, Info, Mail, MessageCircle, Phone, User } from "lucide-react";


export default function SubmittedtoSchool(){

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

    return(
        <>
        <div className="max-w-7xl mx-auto p-4 md:p-6">
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

    {/* LEFT CONTENT */}
    <div className="xl:col-span-8 space-y-5">

      {/* Top Status Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
  <div className="flex flex-col lg:flex-row gap-5">

    <div className="w-24 h-24 shrink-0">
      <img
        src="/school-icon.png"
        alt=""
        className="w-full"
      />
    </div>

    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h2 className="font-bold text-2xl text-slate-800">
          Application Submitted to School
        </h2>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          Completed
        </span>
      </div>

      <p className="text-slate-500">
        Your application has been successfully submitted
        to the University of Bologna.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <div className="border rounded-xl p-3">
          <p className="text-xs text-slate-500">
            Submitted on
          </p>

          <p className="font-semibold">
            22 May 2025, 02:45 PM
          </p>
        </div>

        <div className="border rounded-xl p-3">
          <p className="text-xs text-slate-500">
            Submitted to
          </p>

          <p className="font-semibold">
            University of Bologna, Italy
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
      {/* Alert */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
  <Info className="w-5 h-5 text-blue-600" />

  <p className="text-sm text-blue-700">
    You will be notified once the university starts
    reviewing your application.
  </p>
</div>
      {/* Details + Timeline */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
  <div className="border-b">
    <div className="flex">
      <button className="px-6 py-4 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">
        Submission Details
      </button>
    </div>
  </div>

  <div className="p-5 space-y-4">
    {submissionDetails.map((item, index) => {
      const Icon = item.icon;

      return (
        <div
          key={index}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">
              {item.label}
            </span>
          </div>

          <div className="text-right">
            {item.status ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Paid
                </span>

                <span className="text-sm font-medium">
                  €90
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-slate-800">
                {item.value}
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>

<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
  <div className="border-b">
    <div className="flex">
      <button className="px-6 py-4 text-sm font-semibold text-slate-700">
        What Happens Next?
      </button>
    </div>
  </div>

  <div className="p-5">
    {timeline.map((step, index) => (
      <div
        key={index}
        className="relative flex gap-4 pb-8 last:pb-0"
      >
        {index !== timeline.length - 1 && (
          <div className="absolute left-[10px] top-6 w-[2px] h-full bg-slate-200" />
        )}

        <div>
          {step.status === "completed" && (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          )}

          {step.status === "current" && (
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock3 className="w-4 h-4 text-blue-600" />
            </div>
          )}

          {step.status === "pending" && (
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
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
    ))}
  </div>
</div>
      </div>
      {/* Update Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
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

    <button className="flex items-center justify-center gap-2 px-5 py-3 border border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition whitespace-nowrap">
      <MessageCircle className="w-4 h-4" />
      Contact Counselor
    </button>

  </div>
</div>

    </div>

    {/* RIGHT SIDEBAR */}
    <div className="xl:col-span-4 space-y-5">
      {/* Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
  <h3 className="text-lg font-semibold text-slate-800 mb-4">
    Application Summary
  </h3>

  <div className="space-y-4">
    {applicationSummary.map((item, index) => (
      <div
        key={index}
        className={`flex justify-between gap-4 ${
          index !== applicationSummary.length - 1
            ? "border-b border-slate-100 pb-3"
            : ""
        }`}
      >
        <span className="text-sm text-slate-500">
          {item.label}
        </span>

        <span className="text-sm font-medium text-slate-800 text-right max-w-[180px]">
          {item.value}
        </span>
      </div>
    ))}
  </div>
</div>
      {/* Documents */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
  <div className="flex items-center justify-between mb-5">
    <h3 className="font-semibold text-slate-800 text-lg">
      Documents Submitted (7)
    </h3>

    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
      View All
    </button>
  </div>

  <div className="space-y-3">
    {submittedDocuments.map((doc) => (
      <div
        key={doc.id}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />

          <span className="text-sm text-slate-700">
            {doc.name}
          </span>
        </div>

        <FileText className="w-4 h-4 text-slate-400" />
      </div>
    ))}
  </div>
</div>
      {/* Counselor */}

<div className="bg-white border border-slate-200 rounded-xl p-5">
  <h3 className="text-lg font-semibold text-slate-800 mb-4">
    Your Counselor
  </h3>

  <div className="flex items-center gap-4">
    <img
      src={counselor.image}
      alt={counselor.name}
      className="w-14 h-14 rounded-full object-cover"
    />

    <div>
      <h4 className="font-semibold text-slate-800">
        {counselor.name}
      </h4>

      <p className="text-sm text-slate-500">
        {counselor.designation}
      </p>
    </div>
  </div>

  <div className="mt-5 space-y-3">
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <Mail className="w-4 h-4 text-slate-400" />
      {counselor.email}
    </div>

    <div className="flex items-center gap-3 text-sm text-slate-600">
      <Phone className="w-4 h-4 text-slate-400" />
      {counselor.phone}
    </div>
  </div>

  <div className="grid grid-cols-2 gap-2 mt-5">
    <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
      <MessageCircle className="w-4 h-4" />
      Chat
    </button>

    <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition">
      <Phone className="w-4 h-4" />
      Call
    </button>
  </div>
</div>
    </div>

  </div>
</div></>
    )
}