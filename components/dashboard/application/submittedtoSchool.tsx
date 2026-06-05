"ues client"

import { BadgeDollarSign, Bell, Calendar, CalendarDays, Check, CheckCircle2, Clock3, FileText, Globe, GraduationCap, Hash, Hourglass, Info, Mail, MessageCircle, Phone, User, Users } from "lucide-react";


export default function SubmittedtoSchool({currentstep}){

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

    return(
        <>
        <div className="max-w-7xl mx-auto  md:py-6">
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">

    {/* LEFT CONTENT */}
    {currentstep?.step !== "OfferReceived" ? (
        <div className="xl:col-span-9 space-y-5">

      {/* Top Status Card */}
      <div className="bg-white border border-slate-200 p-6">
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

        <span className="px-3 py-1  bg-orange-100 text-orange-700 text-xs font-semibold">
          Completed
        </span>
      </div>

      <p className="text-slate-500">
        Your application has been successfully submitted
        to the University of Bologna.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <div className="border  p-3">
          <p className="text-xs text-slate-500">
            Submitted on
          </p>

          <p className="font-semibold">
            22 May 2025, 02:45 PM
          </p>
        </div>

        <div className="border  p-3">
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
      <div className="bg-orange-50 border border-orange-100  px-4 py-3 flex items-center gap-3">
  <Info className="w-5 h-5 text-orange-600" />

  <p className="text-sm text-orange-700">
    You will be notified once the university starts
    reviewing your application.
  </p>
</div>
      {/* Details + Timeline */}
      <div className="grid lg:grid-cols-2 gap-5">
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
    submissionDetails.map((item, index) => {
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
                <span className="px-2 py-1  text-xs font-medium bg-green-100 text-green-700">
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
    })
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
          <h4 className="font-semibold text-xs text-slate-800">
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
    ) : null}
    
  </div>
</div>
      </div>
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
    ) }
    

    {/* RIGHT SIDEBAR */}
    <div className="xl:col-span-3 space-y-5">
      {/* Summary */}
      <div className="bg-white border border-slate-200  p-5">
  <h3 className="text-sm font-semibold text-slate-800 mb-4">
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
      <div className="bg-white border border-slate-200  p-5">
  <div className="flex items-center justify-between mb-5">
    <h3 className="font-semibold text-slate-800 text-sm">
      Documents Submitted
    </h3>

    <button className="text-orange-600 text-xs font-medium hover:text-orange-700">
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

<div className="bg-white border border-slate-200  p-5">
  <h3 className="text-lg font-semibold text-slate-800 mb-4">
    Your Counselor
  </h3>

  <div className="flex items-center gap-4">
    <img
      src={counselor.image}
      alt={counselor.name}
      className="w-14 h-14  object-cover"
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