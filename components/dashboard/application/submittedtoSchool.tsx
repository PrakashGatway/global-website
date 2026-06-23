"ues client"

import { AlertCircle, BadgeDollarSign, Bell, Building2, Calendar, CalendarDays, Check, CheckCircle2, Clock3, Download, FileCheck, FileText, Globe, GraduationCap, Hash, Hourglass, Info, Mail, MessageCircle, Phone, Share2, User, Users } from "lucide-react";
import Comments from "./comments";
import { useState } from "react";
import axiosInstance, { baseUrl, fileBaseurl, imageBaseUrl } from "@/app/axiosInstance";
import toast from "react-hot-toast";
import Link from "next/link";


export default function SubmittedtoSchool({ currentstep, application, profile, allProfile, activity, fetchApplication }) {

  const [showPreview, setShowPreview] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [hasvisa, sethasvisa] = useState(false)
  const [visa, setvisa] = useState(false)

  const handleDownload = async () => {
    const fileUrl = fileBaseurl(application?.documents?.[0]?.docUrl);

    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Offer-Letter.jpg";

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const [formData, setFormData] = useState({
    visaType: "",
    visaNumber: "",
    passportNumber: "",
    countryOfIssue: "",
    visaIssuedOn: "",
    visaValidUntil: "",
  });

  const submitStatus = async () => {
    try {
      const documentId = application?.documents?.[0]?._id;
      const payload = {
        status: actionType === "approve" ? "Approved" : "Rejected",
        rejectReason:
          actionType === "reject" ? rejectionReason : "",
      };

      const res = await axiosInstance.put(
        `/applications/documents/${application?._id}/${documentId}`,
        payload
      );

      console.log(documentId)

      toast.success("Document status updated successfully");
      setShowActionModal(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };
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
      ? JSON.parse(allProfile?.profile?.documents)
      : allProfile?.profile?.documents;


  const documentList = Object.values(Parsedocuments || {});

  const upcomingSteps = [


    {
      title: "Prepare for Enrollment",
      description:
        "Submit remaining documents and prepare for your studies.",
    },

    {
      title: "Pay Enrollment Deposit",
      description:
        "Complete the enrollment deposit payment before the deadline.",
    },
    {
      title: "Accept Offer",
      description:
        "Confirm acceptance of the offer to continue the enrollment process.",
    },
    {
      title: "Review Offer",
      description:
        "Carefully review the offer details provided by the institution.",
    },
  ];

  const statusDetail = application?.statusDetails
    ? JSON.parse(application.statusDetails)
    : [];
  const completeDetail = statusDetail?.find((item) =>
    item.status === "Completed"
  )


  const handleSelectionVisa = async () => {
    try {
      if (hasvisa === false) {
        const res = await axiosInstance.post("/visa", {
          userId: allProfile?.data?._id,
          applicationId: application?.applicationNumber,
          country: application?.country,
          course: application?.course?._id,
        });
        await fetchApplication()
        toast.success("Visa application submitted successfully!");
        console.log(res.data);
      } else {
        const res = await axiosInstance.put(
          `/applications/${application?._id}`,
          {
            isVisa: true,
            visaDetails: {
              visaType: formData.visaType,
              visaNumber: formData.visaNumber,
              passportNumber: formData.passportNumber,
              countryOfIssue: formData.countryOfIssue,
              visaIssuedOn: formData.visaIssuedOn,
              visaValidUntil: formData.visaValidUntil,
            },
          }
        );
        await fetchApplication()

        toast.success("Visa details updated successfully!");

      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }
  };

  const offerLetter = application?.documents?.find(
    item => item?.docType === "offer letter"
  );

  const isAlreadyDecided =
    offerLetter?.status === "Approved" ||
    offerLetter?.status === "Rejected";

  const handleOpenActionModal = () => {
    if (isAlreadyDecided) {
      toast.error(
        `You have already ${offerLetter.status.toLowerCase()} this offer letter.`
      );
      return;
    }

    setShowActionModal(true);
  };




  const endDate =
    application?.documents?.find(
      item => item?.docType === "offer letter"
    )?.extra?.endDate;

  const daysLeft = endDate
    ? Math.ceil(
      (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
    )
    : null;




  const downloadCASLetter = () => {
    const fileUrl = completeDetail?.metadata?.completed?.offerLetterDocUrl;

    if (!fileUrl) return toast.error("CAS Letter not found");

    const link = document.createElement("a");
    link.href = `${fileBaseurl}${fileUrl}`;
    link.download = fileUrl.split("/").pop();

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <>
      <div className="  md:py-2">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">

          {/* LEFT CONTENT */}
          {currentstep?.step !== "OfferReceived" ? (
            <div className="xl:col-span-8 space-y-5">

              {/* Top Status Card */}
              {currentstep.step === "Completed" ? (<div className="w-full bg-[#fefaf8] border border-orange-400 p-4 md:p-2 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Left Illustration */}
                  <div className="relative">
                    <>
                      <style jsx>{`
    @keyframes pendulum {
      0% {
        transform: rotate(-6deg);
      }
      50% {
        transform: rotate(10deg);
      }
      100% {
        transform: rotate(-6deg);
      }
    }

    .pendulum {
      animation: pendulum 5.5s ease-in-out infinite;
      transform-origin: top center;
    }
  `}</style>

                      <div className="w-20 h-20 md:w-40 md:h-40 bg-orange-100 rounded-full flex items-center justify-center">
                        <img
                          src="/confirmmation.png"
                          alt=""
                          className="pendulum w-full h-full object-contain"
                        />
                      </div>
                    </>
                    <div className="absolute -top-25 lg:block hidden">
                      <img src="/celebration.gif" alt="" className="w-60 h-60" />
                    </div>
                  </div>



                  {/* Right Content */}
                  <div className="flex-1">
                    {/* Heading */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      <h2 className="text-lg md:text-lg font-bold text-slate-900">
                        Congratulations! Your Confirmation Letter is Ready
                      </h2>

                      <span className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-green-100 text-green-700 text-base font-medium">
                        Received
                      </span>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 text-slate-600 text-base md:text-base">
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
                        <p className="text-base text-slate-500 mb-2">
                          Document Type
                        </p>

                        <h4 className="font-semibold text-slate-800 leading-6 text-base">
                          CAS
                        </h4>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-base text-slate-500 mb-2">
                          CAS Number
                        </p>

                        <h4 className="font-semibold text-orange-600 break-all text-base">
                          {completeDetail?.metadata?.completed?.casNumber}
                        </h4>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-base text-slate-500 mb-2">
                          Issued On
                        </p>

                        <h4 className="font-semibold text-slate-800 text-base">
                          {completeDetail?.metadata?.completed?.issuedOn}

                        </h4>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-base text-slate-500 mb-2">
                          Valid Until
                        </p>

                        <h4 className="font-semibold text-slate-800 text-base">
                          {completeDetail?.metadata?.completed?.validUntil}

                        </h4>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <button onClick={downloadCASLetter} className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 text-base">
                        <Download size={18} />
                        Download CAS Letter
                      </button>


                    </div>
                  </div>
                </div>
              </div>
              ) : currentstep?.step === "SubmitToSchool" ? (
                <div className="bg-[#fefaf8] border border-orange-400 p-6">
                  <div className="flex flex-col lg:flex-row gap-5">

                    <div className="flex justify-center lg:justify-start">
                      <div className="w-16 h-16 md:w-40 md:h-40 rounded-full bg-orange-100 flex items-center justify-center">

                        <img src="/submittedschool.gif" alt="" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="font-bold text-lg text-slate-800">
                          Application Submitted to School
                        </h2>

                        <span className="px-3 py-1  bg-orange-100 text-orange-700 text-base font-semibold">
                          Completed
                        </span>
                      </div>

                      <p className="text-slate-500 text-base">
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
                            <p className="text-base text-slate-500 mb-1">
                              Submitted on
                            </p>

                            <h4 className="font-semibold text-slate-900">
                              {new Date(application.updatedAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </h4>
                          </div>
                        </div>

                        {/* Submitted To */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-orange-500" />
                          </div>

                          <div>
                            <p className="text-base text-slate-500 mb-1">
                              Submitted to
                            </p>

                            <h4 className="font-semibold text-slate-900">
                              {application?.course?.university?.name}
                            </h4>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>) : currentstep?.step === "AwaitingSchoolResponse" ? (
                  <div className="w-full bg-[#fefaf8] border border-orange-400 p-4 md:p-6 lg:p-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                      {/* Left Illustration */}
                      <div className="flex justify-center lg:justify-start">
                        <div className="w-16 h-16 md:w-40 md:h-40 rounded-full bg-orange-100 flex items-center justify-center">

                          <img src="/awaitting-res.gif" alt="" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                          <h2 className="text-lg md:text-lg font-bold text-slate-900">
                            Awaiting School Response
                          </h2>

                          <span className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-base font-medium">
                            In Progress
                          </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-1 text-slate-600 text-base">
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
                              <p className="text-base text-slate-500 mb-1">
                                Submitted on
                              </p>

                              <h4 className="font-semibold text-slate-900">
                                {new Date(application.updatedAt).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </h4>
                            </div>
                          </div>

                          {/* Submitted To */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-orange-500" />
                            </div>

                            <div>
                              <p className="text-base text-slate-500 mb-1">
                                Submitted to
                              </p>

                              <h4 className="font-semibold text-slate-900">
                                {application?.course?.university?.name}
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

                <p className="text-base text-orange-700">
                  You will be notified once the university starts
                  reviewing your application.
                </p>
              </div>
              {/* Details + Timeline */}
              {currentstep.step === "Completed" ? (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                      <div className="flex overflow-x-auto">
                        <button className="px-6 py-4 text-base font-medium text-blue-600 border-b-2 border-blue-600 whitespace-nowrap">
                          CAS Details
                        </button>


                      </div>
                    </div>

                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] gap-8">
                        {/* Left Side */}
                        <div>
                          <div className="space-y-5">
                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">Student Name</p>
                              <p className="text-base text-gray-600">{allProfile?.data?.name}</p>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">Date of Birth</p>
                              <p className="text-base text-gray-600">{allProfile?.data?.dateOfBirth}</p>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">Nationality</p>
                              <p className="text-base text-gray-600">{allProfile?.data?.nationality}</p>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">Passport No.</p>
                              <p className="text-base text-gray-600">{allProfile?.data?.passportNumber}</p>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">Program</p>
                              <p className="text-base text-gray-600">{application?.course?.name}</p>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">Start Date</p>
                              <p className="text-base text-gray-600">15 September 2026</p>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">End Date</p>
                              <p className="text-base text-gray-600">14 September 2029</p>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">CAS Issue Date</p>
                              <p className="text-base text-gray-600">{completeDetail?.metadata?.completed?.issuedOn}</p>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">CAS Expiry Date</p>
                              <p className="text-base text-gray-600">{completeDetail?.metadata?.completed?.validUntil}</p>
                            </div>



                            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
                              <p className="text-base font-semibold text-gray-800">CAS Number</p>
                              <p className="text-base text-gray-600">{completeDetail?.metadata?.completed?.casNumber}</p>
                            </div>


                          </div>
                        </div>

                        {/* Right Side */}
                        <div>
                          <div className="border border-gray-200 rounded-lg bg-white p-3 shadow-sm">
                            <div className="h-95 overflow-hidden rounded">
                              <img
                                src={`/${fileBaseurl(completeDetail?.metadata?.completed?.offerLetterDocUrl)}`}
                                alt="CAS Document"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div></>
              ) :
                (<div className="grid lg:grid-cols-2 gap-5">
                  <div className="bg-white border border-slate-200  overflow-hidden">
                    <div className="border-b">
                      <div className="flex">
                        <button className="px-6 py-4 text-base font-semibold text-orange-600 border-b-2 border-orange-600">
                          Submission Details
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-4  max-h-[300px] overflow-y-auto ">
                      {currentstep?.step === "SubmitToSchool" ? (
                        <div className="space-y-4">
                          {/* Application ID */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Hash className="w-4 h-4 text-slate-500" />
                              <span className="text-base text-slate-600">
                                Application ID
                              </span>
                            </div>

                            <span className="text-base font-medium text-slate-800">
                              {application?.applicationNumber}
                            </span>
                          </div>

                          {/* Program */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <GraduationCap className="w-4 h-4 text-slate-500" />
                              <span className="text-base text-slate-600">
                                Program
                              </span>
                            </div>

                            <span className="text-base font-medium text-slate-800">
                              {application?.course?.name}
                            </span>
                          </div>

                          {/* Intake */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-base text-slate-600">
                                Intake
                              </span>
                            </div>

                            <span className="text-base font-medium text-slate-800">
                              {application?.intake}
                            </span>
                          </div>

                          {/* Submission Date */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CalendarDays className="w-4 h-4 text-slate-500" />
                              <span className="text-base text-slate-600">
                                Submission Date
                              </span>
                            </div>

                            <span className="text-base font-medium text-slate-800">
                              {new Date(application?.createdAt).toLocaleString("en-IN")}
                            </span>
                          </div>



                          {/* Application Fee */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <BadgeDollarSign className="w-4 h-4 text-slate-500" />
                              <span className="text-base text-slate-600">
                                Application Fee
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-base font-medium bg-green-100 text-green-700 rounded-full">
                                Paid
                              </span>

                              <span className="text-base font-medium text-slate-800">
                                €{application?.course?.applicationFee}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : currentstep?.step === "AwaitingSchoolResponse" ? (
                        <div className="space-y-6">
                          {activity?.map((item, index) => (
                            <div key={item._id} className="relative flex gap-4">
                              {index !== activity.length - 1 && (
                                <div className="absolute left-[10px] top-6 h-full w-[2px] bg-slate-200" />
                              )}

                              <div className="z-10">
                                {item.action === "STATUS_CHANGED" ? (
                                  <div className="w-5 h-5 border-2 border-green-500 bg-white flex items-center justify-center">
                                    <Check className="w-3 h-3 text-green-500" />
                                  </div>
                                ) : item.action === "APPLICATION_UPDATED" ? (
                                  <div className="w-5 h-5 bg-orange-600 flex items-center justify-center">
                                    <Hourglass className="w-3 h-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border-2 border-slate-300 bg-white" />
                                )}
                              </div>

                              <div>
                                <p className="text-base text-slate-500 mb-1">
                                  {new Date(item.createdAt).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>

                                <h4 className="font-medium text-base text-slate-800">
                                  {item.newValue || item.action.replaceAll("_", " ")}
                                </h4>

                                <p
                                  className={`text-base mt-1 ${item.action === "STATUS_CHANGED"
                                    ? "text-green-600 font-medium"
                                    : "text-slate-400"
                                    }`}
                                >
                                  {item.description}
                                </p>
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
                        <button className="px-6 py-4 text-base text-base font-semibold text-slate-700">
                          What Happens Next?
                        </button>
                      </div>
                    </div>

                    <div className="p-2 max-h-[300px] overflow-y-auto ">
                      {currentstep.step === "SubmitToSchool" ? (
                        activity?.map((item, index) => (
                          <>
                            {index === 0 && item.newValue === "SubmitToSchool" && (
                              <>
                                <div className="space-y-2 mb-2">
                                  <div className="flex gap-4">
                                    <div className="w-5 h-5 border-2 border-slate-300 bg-white rounded-sm " />
                                    <div>
                                      <h4 className="font-semibold text-base text-slate-400">
                                        Offer Received
                                      </h4>
                                      <p className="text-base text-slate-400 mt-1">
                                        Pending
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex gap-4">
                                    <div className="w-5 h-5 border-2 border-slate-300 bg-white rounded-sm mt-1" />
                                    <div>
                                      <h4 className="font-semibold text-base text-slate-400">
                                        Awaiting School Response
                                      </h4>
                                      <p className="text-base text-slate-400 mt-1">
                                        Pending
                                      </p>
                                    </div>
                                  </div>
                                </div>


                              </>
                            )}
                            <div
                              key={item._id}
                              className="relative flex gap-4 pb-3 last:pb-0"
                            >
                              {index !== activity.length - 1 && (
                                <div className="absolute left-[10px] top-6 w-[2px] h-full bg-slate-200" />
                              )}

                              <div>
                                {item.action === "STATUS_CHANGED" ? (
                                  <div className="w-5 h-5 bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  </div>
                                ) : item.action === "APPLICATION_UPDATED" ? (
                                  <div className="w-5 h-5 bg-orange-100 flex items-center justify-center">
                                    <Clock3 className="w-4 h-4 text-orange-600" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border-2 border-slate-300 bg-white" />
                                )}
                              </div>

                              <div>
                                <h4 className="font-semibold text-base text-slate-800">
                                  {item.newValue || item.action.replaceAll("_", " ")}
                                </h4>

                                <p className="text-base text-slate-500 mt-1">
                                  {new Date(item.createdAt).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>

                                <p className="text-base text-slate-500 mt-1 max-w-xs">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                          </>
                        ))

                      ) : currentstep.step === "AwaitingSchoolResponse" ? activity?.map((item, index) => {
                        console.log(item)
                        return (
                          <>
                            {item.newValue === "AwaitingSchoolResponse" && (
                              <>
                                <div className="relative flex gap-4 pb-8 ">
                                  <div className="w-5 h-5 border-2 border-slate-300 bg-white" />

                                  <div>
                                    <h4 className="font-semibold text-base text-slate-400">
                                      Pay Enrollenment Deposit
                                    </h4>
                                    <p className="text-base text-slate-400 mt-1">
                                      Pending
                                    </p>
                                  </div>
                                </div>

                                <div className="relative flex gap-4 pb-8">
                                  <div className="w-5 h-5 border-2 border-slate-300 bg-white" />

                                  <div>
                                    <h4 className="font-semibold text-base text-slate-400">
                                      Offer Received
                                    </h4>
                                    <p className="text-base text-slate-400 mt-1">
                                      Pending
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                            <div
                              key={item._id}
                              className="relative flex gap-4 pb-2 last:pb-0"
                            >
                              {index !== activity.length - 1 && (
                                <div className="absolute left-[10px] top-6 w-[2px] h-full bg-slate-200" />
                              )}

                              <div>
                                {item.action === "STATUS_CHANGED" ? (
                                  <div className="w-5 h-5 bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  </div>
                                ) : item.action === "APPLICATION_UPDATED" ? (
                                  <div className="w-5 h-5 bg-orange-100 flex items-center justify-center">
                                    <Clock3 className="w-4 h-4 text-orange-600" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border-2 border-slate-300 bg-white" />
                                )}
                              </div>

                              <div>
                                <h4 className="font-semibold text-base text-slate-800">
                                  {item.newValue || item.action.replaceAll("_", " ")}
                                </h4>

                                <p className="text-base text-slate-500 mt-1">
                                  {new Date(item.createdAt).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>

                                <p className="text-base text-slate-500 mt-1 max-w-xs">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                          </>
                        )
                      }) : null}



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

                    <p className="text-base text-slate-500 max-w-2xl">
                      If you need to update any information or documents,
                      please contact your counselor.
                    </p>
                  </div>

                  <Link href={"/dashboard/support"}>
                    <button className="flex items-center justify-center gap-2 px-5 py-3 border border-orange-200 text-orange-600 font-medium hover:bg-orange-50 transition whitespace-nowrap">
                      <MessageCircle className="w-4 h-4" />
                      Contact Counselor
                    </button></Link>

                </div>
              </div>

            </div>
          ) : (
            <div className="xl:col-span-8 space-y-5">
              {/* Offer Banner */}
              <div className="bg-[#fefaf8] border border-orange-400  p-6">

                <div className="flex flex-col lg:flex-row gap-6">

                  <div className="flex gap-20 ">

                    <div className="w-16 h-16 md:w-34 md:h-34 rounded-full bg-orange-100 flex items-center justify-center relative z-1 ml-14">

                      <img
                        src="/offer-application.png"
                        alt=""
                        className="w-full "
                      />

                      <div className="absolute -right-30 -top-5 -z-10">
                        <img src="/star.gif" alt="" className="w-40" />
                      </div>
                      <div className="absolute -left-30 -top-5 -z-10">
                        <img src="/star.gif" alt="" className="w-40" />
                      </div>
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-800">
                          {offerLetter?.name || ""}
                        </h2>

                        <span className="px-3 py-1  bg-green-100 text-green-700 text-base font-medium">
                          Offer Received
                        </span>
                      </div>

                      <p className="text-slate-600 mt-2 text-base">
                        {offerLetter?.description || ""}
                      </p>

                      <p className="text-slate-600 text-base">
                        Please review your offer letter and the next steps below.
                      </p>

                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                  <div className="border p-4">
                    <p className="text-base text-slate-500">
                      Offer Date
                    </p>
                    <p className="font-semibold">
                      {
                        application?.documents?.find(
                          item => item.docType === "offer letter"
                        )?.extra?.startDate &&
                        new Date(
                          application?.documents.find(
                            item => item.docType === "offer letter"
                          )?.extra?.startDate
                        ).toLocaleDateString("en-IN")
                      }
                    </p>
                  </div>

                  <div className="border  p-4">
                    <p className="text-base text-slate-500">
                      Offer Status
                    </p>
                    <p className="font-semibold text-red-600">
                      {offerLetter?.status}
                    </p>
                  </div>

                  <div className="border p-4">
                    <p className="text-base text-slate-500">
                      Respond By
                    </p>

                    <p className="font-semibold">
                      {endDate
                        ? new Date(endDate).toLocaleDateString("en-IN")
                        : "N/A"}

                      {daysLeft !== null && (
                        <span
                          className={`text-base ml-1 ${daysLeft <= 3
                            ? "text-red-500"
                            : daysLeft <= 7
                              ? "text-yellow-500"
                              : "text-orange-500"
                            }`}
                        >
                          (
                          {daysLeft > 0
                            ? `${daysLeft} Days Left`
                            : daysLeft === 0
                              ? "Last Day"
                              : "Expired"}
                          )
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="border p-4">
                    <p className="text-base text-slate-500">
                      Issued By
                    </p>
                    <p className="font-semibold">
                      {application?.documents?.find(item => item?.docType === "offer letter")?.extra?.issuedBy}
                    </p>

                  </div>

                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="px-5 py-3 text-base bg-orange-600 text-white font-medium"
                  >
                    View Offer Letter
                  </button>

                  <button
                    onClick={handleOpenActionModal}
                    className="px-5 py-3 text-base border border-orange-200 text-orange-600 font-medium"
                  >
                    Take Action
                  </button>
                </div>

              </div>

              {/* Success Bar */}
              <div className="bg-green-50 border border-green-100  px-4 py-3">
                <p className="text-green-700 text-base">
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

                    <div className="max-h-[320px] overflow-y-auto pr-2 space-y-2">
                      {/* Upcoming Steps */}
                      {upcomingSteps.map((step, index) => (
                        <div
                          key={`upcoming-${index}`}
                          className="flex gap-3 opacity-60"
                        >
                          <div className="w-8 h-8 border border-slate-300 bg-white flex items-center justify-center shrink-0">
                            {activity.length + index + 1}
                          </div>

                          <div>
                            <h4 className="font-medium text-base text-slate-500">
                              {step.title}
                            </h4>

                            <p className="text-base text-slate-400">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                      {activity?.map((item, index) => (
                        <div key={item._id} className="flex gap-3">
                          <div className="w-8 h-8 bg-orange-50 flex items-center justify-center shrink-0 font-medium text-orange-600">
                            {activity.length - index}
                          </div>

                          <div>
                            <h4 className="font-medium text-base">
                              {item.newValue || item.action.replaceAll("_", " ")}
                            </h4>

                            <p className="text-base text-slate-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}


                    </div>


                  </div>
                </div>

                {/* Offer Details */}
                <div className="xl:col-span-4">
                  <div className="bg-white border p-5 h-full">

                    <h3 className="font-semibold text-lg mb-5">
                      Key Offer Details
                    </h3>


                    <div className="space-y-4">
                      {application?.documents?.find((item) => item.docType === "offer letter")?.extra?.other?.map((item, i) =>
                        <>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500 text-base">
                              {item?.key}
                            </span>

                            <span className="font-medium text-right text-base">
                              {item?.value}
                            </span>
                          </div>
                        </>
                      )
                      }



                    </div>


                    <div className="mt-5 bg-orange-50  p-4">
                      <p className="text-base text-orange-700 ">
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

                      <div className="space-y-4">

                        {/* Offer Received */}
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <div className="w-5 h-5 bg-green-500" />
                          </div>

                          <div>
                            <div className="flex gap-4">
                              <h4 className="font-medium text-base">
                                Offer Received
                              </h4>
                            </div>

                          </div>
                        </div>

                        {/* Respond By */}
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <div className="w-5 h-5 bg-orange-500" />
                          </div>

                          <div>
                            <div className="flex gap-4">
                              <h4 className="font-medium text-base">
                                Respond By
                              </h4>

                              <p className="text-orange-500 text-base font-medium">
                                14 Days Left
                              </p>
                            </div>

                          </div>
                        </div>

                        {/* Enrollment Deposit Deadline */}
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <div className="w-5 h-5 border-2 border-slate-300" />
                          </div>

                          <div>
                            <div className="flex gap-4">
                              <h4 className="font-medium text-base">
                                Enrollment Deposit Deadline
                              </h4>
                            </div>

                            <p className="text-base text-slate-500">
                              {statusDetail?.find((item) => item?.status === "PayEnrollenmentDeposit")?.metadata?.deposit?.paymentDeadline}
                            </p>
                          </div>
                        </div>



                      </div>

                    </div>

                    <div className="mt-6 bg-amber-50 border border-amber-100  p-4">

                      <h4 className="font-medium text-amber-800">
                        Need Guidance?
                      </h4>

                      <p className="text-base text-amber-700 mt-2">
                        Talk to your admissions counselor for any help
                        with acceptance, visa or other queries.
                      </p>
                      <Link href={"/dashboard/support"}>
                        <button className="mt-4 w-full py-3  border border-orange-200 text-orange-600 font-medium text-base">
                          Contact Counselor
                        </button></Link>

                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {showPreview && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white w-[90%] max-w-5xl h-[90vh] rounded-lg overflow-hidden animate-in fade-in zoom-in duration-300">

                <div className="flex justify-between items-center border-b px-6 py-4">
                  <h3 className="font-semibold text-lg">
                    Offer Letter Preview
                  </h3>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 text-base bg-orange-600 text-white rounded-md"
                    >
                      <Download size={16} />
                      Download
                    </button>

                    <button
                      onClick={() => setShowPreview(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <img
                  src={fileBaseurl(application?.documents?.[0]?.docUrl)}
                  alt="Offer Letter"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {showActionModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-300">
                <h3 className="text-lg font-semibold text-slate-800">
                  Offer Letter Decision
                </h3>

                <p className="text-base text-slate-500 mt-2">
                  Please review the offer letter carefully before proceeding.
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setActionType("approve")
                      setvisa(true)
                      setShowActionModal(false)
                    }}
                    className={`flex-1 py-3 border ${actionType === "approve"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-slate-200"
                      }`}
                  >
                    Approve Offer
                  </button>

                  <button
                    onClick={() => setActionType("reject")}
                    className={`flex-1 py-3 border ${actionType === "reject"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200"
                      }`}
                  >
                    Reject Offer
                  </button>
                </div>

                {actionType === "reject" && (
                  <div className="mt-5">
                    <label className="block text-base font-medium mb-2">
                      Rejection Reason
                    </label>

                    <textarea
                      rows={4}
                      value={rejectionReason}
                      onChange={(e) =>
                        setRejectionReason(e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-lg p-3"
                      placeholder="Please provide a reason for rejecting this offer..."
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="px-5 py-2 border border-slate-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submitStatus}
                    disabled={
                      actionType === "reject" && !rejectionReason.trim()
                    }
                    className={`px-5 py-2 text-white ${actionType === "approve"
                      ? "bg-green-600"
                      : "bg-red-600"
                      }`}
                  >
                    Submit Decision
                  </button>
                </div>
              </div>
            </div>
          )}

          {visa && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-300">
                <h2 className="text-lg font-bold text-center text-gray-800 mb-2">
                  Visa Information
                </h2>

                <p className="text-base text-gray-500 text-center mb-6">
                  Do you currently have a valid Visa?
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer border border-gray-200 rounded-xl px-4 py-4 hover:border-green-500 hover:bg-green-50 transition-all">
                    <input
                      type="radio"
                      name="hasVisa"
                      checked={hasvisa === true}
                      onChange={() => {
                        sethasvisa(true)
                        setvisa(false)
                      }}
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-gray-700">
                      Yes, I have a Visa
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer border border-gray-200 rounded-xl px-4 py-4 hover:border-red-500 hover:bg-red-50 transition-all">
                    <input
                      type="radio"
                      name="hasVisa"
                      checked={hasvisa === false}
                      onChange={() => sethasvisa(false)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-gray-700">
                      No, I don't have a Visa
                    </span>
                  </label>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      setvisa(false)
                      submitStatus()
                      handleSelectionVisa()

                    }}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasvisa && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                  Visa Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Visa Type */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Visa Type
                    </label>
                    <input
                      type="text"
                      value={formData.visaType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visaType: e.target.value,
                        })
                      }
                      placeholder="Student Visa"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  {/* Visa Number */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Visa Number
                    </label>
                    <input
                      type="text"
                      value={formData.visaNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visaNumber: e.target.value,
                        })
                      }
                      placeholder="Enter Visa Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  {/* Passport Number */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={formData.passportNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          passportNumber: e.target.value,
                        })
                      }
                      placeholder="Enter Passport Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  {/* Country of Issue */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Country of Issue
                    </label>
                    <input
                      type="text"
                      value={formData.countryOfIssue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countryOfIssue: e.target.value,
                        })
                      }
                      placeholder="Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  {/* Visa Issued On */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Visa Issued On
                    </label>
                    <input
                      type="date"
                      value={formData.visaIssuedOn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visaIssuedOn: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  {/* Visa Valid Until */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Visa Valid Until
                    </label>
                    <input
                      type="date"
                      value={formData.visaValidUntil}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visaValidUntil: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      sethasvisa(false)
                      setActionType("")
                    }}
                    className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    onClick={() => {
                      handleSelectionVisa()
                      sethasvisa(false)
                    }}
                  >
                    Save Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT SIDEBAR */}
          <div className="xl:col-span-4 space-y-5">
            {/* Summary */}
            <div className="bg-white p-4  border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-bold text-gray-800">Application Summary</h4>
              </div>
              <div className="space-y-1.5 text-base">
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
            {/* Documents */}
            <div className="bg-white border border-slate-200  p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-800 text-base">
                  Documents Submitted
                </h3>


              </div>

              <div className="space-y-3">
                <div className="space-y-3">
                  {documentList.map((doc) => {
                    if (
                      doc.applicationId &&
                      doc.applicationId !== application?.applicationNumber
                    ) {
                      return null;
                    }
                    return (
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

                          <span className="text-base text-slate-700">
                            {doc.docName}
                          </span>
                        </div>

                        <span
                          className={`text-base font-medium capitalize ${doc.status === "approved"
                            ? "text-green-600"
                            : doc.status === "pending"
                              ? "text-orange-600"
                              : "text-red-600"
                            }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* Counselor */}

            <div className="bg-white border border-slate-200  p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Your Counselor
              </h3>

              <div className="flex items-center gap-4">
                <img
                  src={"/profile-application.gif"}
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
                <div className="flex items-center gap-3 text-base text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {allProfile?.data?.assignto?.email}
                </div>

                <div className="flex items-center gap-3 text-base text-slate-600">
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