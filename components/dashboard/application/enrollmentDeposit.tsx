"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";



const EnrollmentDeposit = ({ application, allprofile }) => {

  const [ontab, setontab] = useState("Paymentdetail")



  const parsedStatusDetails = application?.statusDetails
    ? JSON.parse(application?.statusDetails)
    : [];

  const depositData = parsedStatusDetails.find(
    (item) => item.status === "PayEnrollenmentDeposit"
  );

  //console.log(depositData)

  const metadata = depositData?.metadata?.deposit

  const paymentDeadline = metadata?.paymentDeadline;

  const daysLeft = paymentDeadline
    ? Math.ceil(
      (new Date(paymentDeadline) - new Date()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;



  const offerdateleft = metadata?.offerDeadline
    ? Math.ceil((
      new Date(metadata?.offerDeadline) - new Date()) /
      (1000 * 60 * 60 * 24))
    : 0;



  const [paymentMethod, setPaymentMethod] = useState("forex");




  return (
    <div className=" bg-white min-h-screen p-2">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">

        {/* LEFT SECTION */}
        <div className="xl:col-span-8 space-y-4">

          {/* Header Card */}
          <div className="  grid grid-cols-1">
            <div className="border border-orange-400 p-4">
              <div className="flex flex-col lg:flex-row items-start gap-5 ">

                <div className="w-40 h-40 bg-orange-100 flex items-center rounded-full justify-center">
                  <img src="/enroll-application.gif" alt="" className="w-full" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-800">
                      Pay Enrollment Deposit
                    </h2>

                    <span className="bg-orange-100 text-orange-700 text-base font-medium px-3 py-1 ">
                      In Progress
                    </span>
                  </div>

                  <p className="text-base text-gray-600 mt-2">
                    To confirm your seat, please pay the enrollment deposit before the deadline.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

                    <div className="border  p-3">
                      <p className="text-base text-gray-500">Deposit Amount</p>
                      <h4 className="font-bold mt-1">{metadata?.amount}</h4>
                      <p className="text-base text-gray-400">
                        Non-refundable
                      </p>
                    </div>

                    <div className="border p-3 rounded-lg">
                      <p className="text-base text-gray-500">Payment Deadline</p>

                      <h4 className="font-bold mt-1">
                        {metadata?.paymentDeadline}
                      </h4>

                      <p
                        className={`text-base mt-1 ${daysLeft <= 3
                          ? "text-red-600"
                          : daysLeft <= 7
                            ? "text-orange-600"
                            : "text-green-600"
                          }`}
                      >
                        {daysLeft > 0
                          ? `${daysLeft} Day${daysLeft > 1 ? "s" : ""} Left`
                          : "Deadline Expired"}
                      </p>
                    </div>

                    <div className="border p-3">
                      <p className="text-base text-gray-500">Offer Deadline</p>
                      <h4 className="font-bold mt-1">{metadata?.offerDeadline}</h4>
                      <p
                        className={`text-base mt-1 ${offerdateleft <= 3
                          ? "text-red-600"
                          : offerdateleft <= 7
                            ? "text-orange-600"
                            : "text-green-600"
                          }`}
                      >
                        {offerdateleft > 0
                          ? `${offerdateleft} Day${offerdateleft > 1 ? "s" : ""} Left`
                          : "Deadline Expired"}
                      </p>
                    </div>

                    <div className="border p-3">
                      <p className="text-base text-gray-500">Currency</p>
                      <h4 className="font-bold mt-1">{metadata?.currency}</h4>

                    </div>

                  </div>
                </div>
              </div>

              {/* Alert */}
              <div className="mt-5 bg-orange-50 border border-orange-100 p-3 text-base text-orange-700">
                Your admission is not confirmed until the enrollment deposit is received by the university.
              </div>

            </div>

            <div>   {/* Tabs */}
              <div className="flex overflow-x-auto gap-8 border-b mt-6 text-base">
                {[
                  { id: "Paymentdetail", label: "Payment Details" },
                  { id: "Paymentmethod", label: "Payment Method" },
                  { id: "Paymentinstruction", label: "Instruction" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setontab(tab.id)}
                    className="relative pb-3 font-medium"
                  >
                    {ontab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-600"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}

                    <span
                      className={
                        ontab === tab.id
                          ? "text-orange-600"
                          : "text-gray-500 hover:text-orange-600"
                      }
                    >
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Content */}
              {ontab === "Paymentdetail" && (
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    {metadata?.paymentdetails?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <span className="text-gray-500 font-medium">
                          {item.key}
                        </span>
                        <span className="text-gray-900">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Why Card */}
                  <div className="bg-green-50 border border-green-100 p-5">
                    <h3 className="font-semibold mb-4">
                      Why Enrollment Deposit?
                    </h3>

                    <ul className="space-y-3 text-base text-gray-700">
                      <li>✓ Confirms your seat in the program</li>
                      <li>✓ Required for visa application process</li>
                      <li>✓ Adjusted in tuition fee</li>
                      <li>✓ Non-refundable if cancelled</li>
                    </ul>
                  </div>
                </div>
              )}

              {ontab === "Paymentmethod" && (
                <>
                  <div className="flex gap-4 my-4">
                    {[
                      { id: "forex", label: "Forex Payment" },
                      { id: "direct", label: "Direct Payment" },
                    ].map((item) => (
                      <motion.div
                        key={item.id}

                        whileTap={{ scale: 0.98 }}
                        className="relative "
                      >
                        <button
                          onClick={() => setPaymentMethod(item.id)}
                          className="relative px-5 py-3 font-medium z-10 cursor-pointer"
                        >
                          {paymentMethod === item.id && (
                            <motion.div
                              layoutId="activePaymentMethod"
                              className="absolute inset-0 bg-orange-50 border border-orange-500 "
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 30,
                              }}
                            />
                          )}

                          <span
                            className={`relative z-10 ${paymentMethod === item.id
                              ? "text-orange-600 font-semibold"
                              : "text-gray-600"
                              }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  {
                    paymentMethod === "forex" &&
                    metadata?.paymentmethod
                      ?.filter(item => item.method === "Forex Payment")?.map((item, i) => (
                        <div key={i}>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.value }}
                          />
                        </div>
                      ))
                  }

                  {
                    paymentMethod === "direct" &&
                    metadata?.paymentmethod
                      ?.filter(item => item.method === "Direct Payment")
                      ?.map((item, i) => (
                        <div key={i}>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.value }}
                          />
                        </div>
                      ))
                  }

                </>
              )}



              {ontab === "Paymentinstruction" && (
               <div className="text-black mt-2" dangerouslySetInnerHTML={{
                __html : metadata?.intInstruction
               }}>
                
               </div>
               
              )}

              {/* Important */}
              <div className="bg-orange-50 border border-orange-200 p-4 mt-6">
                <h4 className="font-semibold text-orange-700">
                  Important
                </h4>

                <p className="text-base text-orange-600 mt-1">
                  Please pay the enrollment deposit before 18 June 2025 to secure your seat.
                </p>
              </div></div>

            {/* Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 ">
                Pay Now
              </button>

              <button className="border border-gray-300 px-6 py-3">
                I'll Pay Later
              </button>
            </div> */}

            {/* Timeline */}
            {/* <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-5">
                What Happens Next?
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">

                {[
                  "Deposit Paid",
                  "Payment Confirmed",
                  "Admission Confirmed",
                  "Visa Process",
                  "Prepare To Enroll",
                ].map((item) => (
                  <div key={item} className="text-center">
                    <div className="w-10 h-10 mx-auto border-2 border-orange-500 flex items-center justify-center">
                      ✓
                    </div>

                    <h4 className="text-base font-semibold mt-3">
                      {item}
                    </h4>
                  </div>
                ))}

              </div>
            </div> */}

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white p-4  border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-bold text-gray-800">Application Summary</h4>
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

          {/* Payment Summary */}
          <div className="bg-white  border p-5">
            <h3 className="font-semibold mb-4 text-lg">
              Payment Summary
            </h3>

            <div className="flex justify-between text-base">
              <span>Tuition Fee</span>
              <span>{metadata?.tuitionFee}</span>
            </div>

            <div className="flex justify-between mt-2 text-base">
              <span>Enrollment Deposit</span>
              <span>{metadata?.amount}</span>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-orange-600">
              <span>Total Payable</span>
              <span>
                {(Number(metadata?.tuitionFee) || 0) -
                  (Number(metadata?.amount) || 0)}
              </span>            </div>
          </div>

          {/* Counselor */}
          <div className="bg-white border p-5">
            <h3 className="font-semibold">
              Need Help?
            </h3>

            <div className="flex items-center gap-3 mt-4">
              <img className="w-10 h-10" src={"/profile-application.gif"} alt="" />

              <div>
                <h4 className="font-semibold">
                  {allprofile?.data?.assignto?.name}
                </h4>

                <p className="text-base text-gray-500">
                  {allprofile?.data?.assignto?.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <button className="border py-2">
                Call
              </button>

              <button className="border py-2">
                Email
              </button>

              <button className="border py-2">
                Chat
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnrollmentDeposit;