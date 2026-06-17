"use client"

import { AlertCircle, CheckCircle, CheckCircle2, Circle, ClipboardCheck, Clock3, Download, Eye, FileText, Info, Paperclip, SendHorizonal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import Comments from "./comments";
import axiosInstance, { baseUrl, fileBaseurl } from "@/app/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



export default function ReviewApplication({ application, allProfile, profile, activity }) {
  const [previewImage, setPreviewImage] = useState(null);


  const Parsedocuments =
    typeof allProfile?.profile?.documents === "string"
      ? JSON.parse(allProfile.profile.documents)
      : allProfile?.profile?.documents;

  console.log(activity);

  const documentList = Object.values(Parsedocuments || {});

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 rounded-full";

      case "pending":
        return "bg-orange-100 text-orange-700 rounded-full";

      case "rejected":
        return "bg-red-100 text-red-700 rounded-full";

      default:
        return "bg-gray-100 text-gray-700 rounded-full";
    }
  };

  return (
    <><div className=" p-4 md:p-2 space-y-5 grid grid-cols-12 gap-2">
      {/* Top Status Card */}
      <div className="col-span-8">
        <div className="bg-[#fefaf8] border border-orange-400 p-4 md:p-6 mb-2">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-100 flex items-center justify-center">
                <img src="/review-application.gif" alt="" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl md:text-xl font-bold text-[#1E293B]">
                    Under OOSHAS Review
                  </h2>

                  <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 ">
                    In Progress
                  </span>
                </div>

                <p className="text-gray-500 mt-2 max-w-xl text-sm">
                  Our admissions team is reviewing your application and documents.
                  We'll notify you once the review is completed.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="border px-4 py-3">
                    <p className="text-sm text-gray-500">
                      Review started
                    </p>
                    <p className="font-semibold">
                      {
                        activity?.map((item) =>
                          item.newValue === "ReviewbyOoshas" ? (
                            <p key={item._id}>{new Date(item.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}</p>
                          ) : null
                        )
                      }
                    </p>
                  </div>

                  <div className="border px-4 py-3">
                    <p className="text-sm text-gray-500">
                      Expected completion
                    </p>
                    <p className="font-semibold">
                      1–2 Working Days
                    </p>
                  </div>
                </div>
              </div>
            </div>

          
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


            </div>

            <div className="space-y-4">
              {documentList.map((item) => {
                if (
                  item.applicationId &&
                  item.applicationId !== application?.applicationNumber
                ) {
                  return null;
                }
                return (
                  <div
                    key={item.docKey}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      {item.status === "approved" ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : item.status === "pending" ? (
                        <Clock3 size={18} className="text-orange-500" />
                      ) : (
                        <AlertCircle size={18} className="text-red-500" />
                      )}

                      <span className="text-sm text-gray-700">
                        {item?.docName}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 text-sm font-medium ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="bg-white border p-5">
            <h3 className="font-bold text-lg mb-5">
              Counselor Update
            </h3>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-purple-100">
                <img src={allProfile?.data?.assignto?.profileImage || ""} alt="" />
              </div>

              <div>
                <h4 className="font-semibold">
                  {allProfile?.data?.assignto?.name}
                </h4>

                <p className="text-sm text-gray-500">
                  {allProfile?.data?.assignto?.role}
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
                {documentList.map((doc) => {
                  if (
                    doc.applicationId &&
                    doc.applicationId !== application?.applicationNumber
                  ) {
                    return null;
                  }
                  return (
                    <tr key={doc.docKey} className="border-t text-sm">
                      <td className="py-3">{doc.docName}</td>

                      <td className="py-3">
                        <span
                          className={`px-3 py-1 text-sm font-medium ${getStatusStyle(
                            doc.status
                          )}`}
                        >
                          {doc.status}
                        </span>
                      </td>

                      <td className="py-3">
                        {new Date(doc.updatedAt || doc.uploadedAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <button
                            onClick={() => setPreviewImage(`${fileBaseurl(doc.url)}`)}
                            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-100 hover:bg-orange-100 transition"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>

                          {/* Download */}
                          {doc?.status === "approved" && <a
                            href={`${fileBaseurl(doc.url)}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-8 h-7 text-orange-600 border border-gray-200 hover:bg-gray-50 transition"
                          >
                            <Download className="w-3 h-3" />
                          </a>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {documentList.map((doc) => (
              <div
                key={doc.docKey}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                  <h4 className="font-semibold text-gray-800 text-sm leading-5">
                    {doc.docName}
                  </h4>

                  <span
                    className={`px-2.5 py-1 text-sm font-medium rounded-full whitespace-nowrap ${getStatusStyle(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Document Type</span>
                    <span className="text-gray-800 font-medium">
                      {doc.originalName}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Updated</span>
                    <span className="text-gray-800">
                      {new Date(
                        doc.updatedAt || doc.uploadedAt
                      ).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      setPreviewImage(
                        `${fileBaseurl(doc.url)}`
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-600 border border-orange-200 py-2.5 rounded-lg text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>

                  <a
                    href={`${fileBaseurl(doc.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 py-2.5 rounded-lg text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>


              </div>
            ))}
          </div>


        </div>

      </div>
      <div className="space-y-4 col-span-4">
        {/* Application Summary */}
          <div className="bg-white p-4  border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-800">Application Summary</h4>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Student Name</span>
                  <span className="font-medium text-gray-800">{application?.student?.name || "--"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Student Email</span>
                  <span className="font-medium text-gray-800">{application?.student?.email || "--"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Student Phone</span>
                  <span className="font-medium text-gray-800">{application?.student?.phone || "--"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Country</span>
                  <span className="font-medium text-gray-800 flex items-center gap-1">
                    {application?.country || "India"}
                  </span>
                </div>
               
                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500">Course</span>
                  <span className="font-medium text-gray-800">{application?.course?.name || application?.course?.name || "Computer Science"}</span>
                </div>
                {application.applicationId && (
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span className="text-gray-500">Application ID</span>
                    <span className="font-medium text-gray-800">{application.applicationId}</span>
                  </div>
                )}
              </div>
            </div>

        <Comments application={application} profile={profile} />

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
        <div className="bg-white border border-slate-200 p-5 shadow-sm h-100 overflow-y-auto">
          <div className="flex items-center gap-2 mb-5">
            <Clock3 className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">
              Review Timeline
            </h3>
          </div>

          <div className="space-y-5">
            {activity?.length > 0 ? (
              activity.map((item, index) => (
                <div key={item._id || index} className="flex gap-3">
                  {item.action === "STATUS_CHANGED" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  ) : (
                    <Clock3 className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  )}

                  <div>
                    <p className="font-medium text-sm">
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="text-slate-500 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-3">
                <Circle className="w-5 h-5 text-slate-300 mt-1" />
                <div>
                  <p className="font-medium text-sm text-slate-400">
                    No Activity Found
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Card */}
        {/* <div className="bg-white border border-slate-200 p-5 shadow-sm">
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
        </div> */}
      </div>

    </div>
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white p-3 rounded-lg max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white"
            >
              ✕
            </button>

            <img
              src={previewImage}
              alt="Document Preview"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}