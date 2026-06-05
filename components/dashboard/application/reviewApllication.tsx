"use client"

import { AlertCircle, CheckCircle, CheckCircle2, Circle, ClipboardCheck, Clock3, Download, Eye, FileText, Info } from "lucide-react"



export default function ReviewApplication(){

      const checklist = [
    {
      title: "Personal Information Verification",
      status: "Completed",
    },
    {
      title: "Academic Records Verification",
      status: "Completed",
    },
    {
      title: "Passport Validation",
      status: "Completed",
    },
    {
      title: "SOP Review",
      status: "In Review",
    },
    {
      title: "Financial Documents",
      status: "Pending",
    },
    {
      title: "Course Eligibility Check",
      status: "Completed",
    },
  ];

  const documents = [
    {
      id: 1,
      name: "Passport / ID Proof",
      type: "passport",
      status: "Under Review",
      lastUpdated: "21 May 2025",
      viewUrl: "#",
      replaceAllowed: true,
    },
    {
      id: 2,
      name: "Academic Transcript / Marksheet",
      type: "transcript",
      status: "Verified",
      lastUpdated: "21 May 2025",
      viewUrl: "#",
      replaceAllowed: false,
    },
    {
      id: 3,
      name: "IELTS Certificate",
      type: "ielts",
      status: "Verified",
      lastUpdated: "20 May 2025",
      viewUrl: "#",
      replaceAllowed: false,
    },
    {
      id: 4,
      name: "SOP (Statement of Purpose)",
      type: "sop",
      status: "In Review",
      lastUpdated: "21 May 2025",
      viewUrl: "#",
      replaceAllowed: true,
    },
    {
      id: 5,
      name: "CV / Resume",
      type: "resume",
      status: "Verified",
      lastUpdated: "20 May 2025",
      viewUrl: "#",
      replaceAllowed: false,
    },
  ];


    const getStatusStyle = (status = "") => {
    const normalizedStatus = status.trim().toLowerCase();

    if (
      normalizedStatus === "completed" ||
      normalizedStatus === "verified"
    ) {
      return "bg-green-100 text-green-700 border border-green-200";
    }

    if (
      normalizedStatus === "in review" ||
      normalizedStatus === "under review"
    ) {
      return "bg-orange-100 text-orange-600 border border-orange-200";
    }

    if (normalizedStatus === "pending") {
      return "bg-gray-100 text-gray-600 border border-gray-200";
    }

    return "bg-slate-100 text-slate-600 border border-slate-200";
  };

return(
    <><div className="max-w-7xl mx-auto p-4 md:p-6 space-y-5 grid grid-cols-8 gap-2">
              {/* Top Status Card */}
              <div className="col-span-6">
                <div className="bg-orange-50 border border-[#E5E7EB] p-4 md:p-6 mb-2">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-100 flex items-center justify-center">
                        <img src="https://www.freeiconspng.com/uploads/review-icon-png-9.png" alt="" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl md:text-xl font-bold text-[#1E293B]">
                            Under OOSHAS Review
                          </h2>

                          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 ">
                            In Progress
                          </span>
                        </div>

                        <p className="text-gray-500 mt-2 max-w-xl text-sm">
                          Our admissions team is reviewing your application and documents.
                          We'll notify you once the review is completed.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                          <div className="border px-4 py-3">
                            <p className="text-xs text-gray-500">
                              Review started
                            </p>
                            <p className="font-semibold">
                              20 May 2025, 11:45 AM
                            </p>
                          </div>

                          <div className="border px-4 py-3">
                            <p className="text-xs text-gray-500">
                              Expected completion
                            </p>
                            <p className="font-semibold">
                              1–2 Working Days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <img
                      src="/review-illustration.png"
                      className="w-40 md:w-56"
                      alt=""
                    />
                  </div>
                </div>
                {/* Checklist + Counselor */}
                <div className="grid lg:grid-cols-2 gap-5 mb-2">
                  <div className="bg-white border p-5 ">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-50 flex items-center justify-center">
                          <ClipboardCheck className="w-4 h-4 text-orange-600" />
                        </div>

                        <h3 className="font-bold text-lg text-[#1E293B]">
                          Review Checklist
                        </h3>
                      </div>

                      <button className="text-orange-600 font-medium">
                        View Details
                      </button>
                    </div>

                    <div className="space-y-4">
                      {checklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            {item.status === "Completed" ? (
                              <CheckCircle size={18} className="text-green-500" />
                            ) : item.status === "In Review" ? (
                              <Clock3 size={18} className="text-orange-500" />
                            ) : (
                              <AlertCircle size={18} className="text-gray-400" />
                            )}

                            <span className="text-sm text-gray-700">
                              {item.title}
                            </span>
                          </div>

                          <span
                            className={`px-3 py-1 text-xs font-medium ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border p-5">
                    <h3 className="font-bold text-lg mb-5">
                      Counselor Update
                    </h3>

                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-purple-100"></div>

                      <div>
                        <h4 className="font-semibold">
                          Rahul Sharma
                        </h4>

                        <p className="text-sm text-gray-500">
                          Senior Admissions Advisor
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F6F1FF] p-4">
                      <p className="text-gray-700">
                        We have verified your academic documents.
                        Please upload your latest passport copy for final verification.
                      </p>
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                      Last Updated: 21 May 2025, 04:30 PM
                    </p>
                  </div>
                </div>
                {/* Documents Table */}
                <div className="bg-white border p-5">
                  <h3 className="font-bold text-lg mb-5">
                    Document Verification
                  </h3>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500">
                          <th>Document</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc.id} className="border-t text-sm">
                            <td>{doc.name}</td>
                            <td className="py-3">
                              <span
                                className={`px-3 py-1  text-xs font-medium ${getStatusStyle(
                                  doc.status
                                )}`}
                              >
                                {doc.status}
                              </span>
                            </td>
                            <td>{doc.lastUpdated}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                {/* View Button */}
                                <button className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-100 hover:bg-orange-100 transition">
                                  <Eye className="w-3 h-3" />
                                  View
                                </button>

                                {/* Replace Button */}
                                <button className="flex items-center justify-center w-8 h-7 text-orange-600 border border-gray-200  hover:bg-gray-50 transition">
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="border p-4"
                      >
                        <h4 className="font-semibold">
                          {doc.name}
                        </h4>

                        <p>{doc.status}</p>
                        <p>{doc.lastUpdated}</p>

                        <div className="flex gap-3 mt-3">
                          <button>View</button>
                          <button>Replace</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-5">
                    <button className="text-orange-600 font-semibold">
                      View All Documents →
                    </button>
                  </div>
                </div>

              </div>
              <div className="space-y-4 col-span-2">
                {/* Application Summary */}
                <div className="bg-white border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-slate-800">
                      Application Summary
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Program</span>
                      <span className="font-medium text-right">
                        Bachelor of Computer Science
                      </span>
                    </div>

                    <div className="flex justify-between text-sm border-t pt-3">
                      <span className="text-slate-500">Application ID</span>
                      <span className="font-medium text-orange-600">
                        OS1779706950795
                      </span>
                    </div>

                    <div className="flex justify-between text-sm border-t pt-3">
                      <span className="text-slate-500">Intake</span>
                      <span>March 2026</span>
                    </div>

                    <div className="flex justify-between text-sm border-t pt-3">
                      <span className="text-slate-500">University</span>
                      <span className="text-right">
                        University of Bologna
                      </span>
                    </div>

                    <div className="flex justify-between text-sm border-t pt-3">
                      <span className="text-slate-500">Country</span>
                      <span>Italy</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-white border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4">
                    Overall Review Progress
                  </h3>

                  <p className="text-green-600 font-semibold text-sm mb-2">
                    80% Complete
                  </p>

                  <div className="w-full h-2 bg-slate-200 overflow-hidden">
                    <div className="h-full w-[80%] bg-green-500" />
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <Clock3 className="w-5 h-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-800">
                      Review Timeline
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-sm">
                          20 May 2025, 10:30 AM
                        </p>
                        <p className="text-slate-500 text-sm">
                          Application Started
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-sm">
                          20 May 2025, 11:45 AM
                        </p>
                        <p className="text-slate-500 text-sm">
                          Submitted to OOSHAS
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock3 className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <p className="font-medium text-sm">
                          21 May 2025, 04:30 PM
                        </p>
                        <p className="text-slate-500 text-sm">
                          Documents Under Review
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Circle className="w-5 h-5 text-slate-300 mt-1" />
                      <div>
                        <p className="font-medium text-sm text-slate-400">
                          Pending
                        </p>
                        <p className="text-slate-400 text-sm">
                          Application Submission
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-white border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-slate-800">
                      Questions? We're here to help!
                    </h3>
                  </div>

                  <p className="text-sm text-slate-500 mb-4">
                    Contact your advisor or our support team.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="border border-orange-200 text-orange-600 py-2 text-xs font-medium hover:bg-orange-50">
                      Chat with Advisor
                    </button>

                    <button className="border border-orange-200 text-orange-600 py-2 text-xs font-medium hover:bg-orange-50">
                      Email Support
                    </button>
                  </div>
                </div>
              </div>

            </div></>)
}