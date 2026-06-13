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

  console.log(depositData)

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

                <div className="w-20 h-20 bg-orange-100 flex items-center rounded-full justify-center">
                  <img src="/enroll-application.gif" alt="" className="w-full" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800">
                      Pay Enrollment Deposit
                    </h2>

                    <span className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 ">
                      In Progress
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    To confirm your seat, please pay the enrollment deposit before the deadline.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

                    <div className="border  p-3">
                      <p className="text-xs text-gray-500">Deposit Amount</p>
                      <h4 className="font-bold mt-1">{metadata?.amount}</h4>
                      <p className="text-xs text-gray-400">
                        Non-refundable
                      </p>
                    </div>

                    <div className="border p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Payment Deadline</p>

                      <h4 className="font-bold mt-1">
                        {metadata?.paymentDeadline}
                      </h4>

                      <p
                        className={`text-xs mt-1 ${daysLeft <= 3
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
                      <p className="text-xs text-gray-500">Offer Deadline</p>
                      <h4 className="font-bold mt-1">{metadata?.offerDeadline}</h4>
                      <p
                        className={`text-xs mt-1 ${offerdateleft <= 3
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
                      <p className="text-xs text-gray-500">Currency</p>
                      <h4 className="font-bold mt-1">{metadata?.currency}</h4>

                    </div>

                  </div>
                </div>
              </div>

              {/* Alert */}
              <div className="mt-5 bg-orange-50 border border-orange-100 p-3 text-sm text-orange-700">
                Your admission is not confirmed until the enrollment deposit is received by the university.
              </div>

            </div>

            <div>   {/* Tabs */}
              <div className="flex overflow-x-auto gap-8 border-b mt-6 text-sm">

                <button
                  onClick={() => setontab("Paymentdetail")}
                  className={`pb-3 font-medium border-b-2 ${ontab === "Paymentdetail"
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-orange-600"
                    }`}
                >
                  Payment Details
                </button>
                <button
                  onClick={() => setontab("Paymentmethod")}
                  className={`pb-3 font-medium border-b-2 ${ontab === "Paymentmethod"
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-orange-600"
                    }`}
                >
                  Payment Method
                </button>
                <button
                  onClick={() => {
                    setontab("Paymentinstruction")
                  }}
                  className={`pb-3 font-medium border-b-2 ${ontab === "Paymentinstruction"
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-orange-600"
                    }`}
                >
                  Instruction
                </button>


              </div>

              {/* Content */}
              {ontab === "Paymentdetail" && (
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                  {/* Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Program</span>
                      <span>{metadata?.program}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Faculty</span>
                      <span>{metadata?.faculty}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date</span>
                      <span>{metadata?.startDate}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration</span>
                      <span>{metadata?.duration}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Tuition Fee</span>
                      <span>{metadata?.tuitionFee}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Deposit</span>
                      <span className="font-semibold">{metadata?.amount}</span>
                    </div>
                  </div>

                  {/* Why Card */}
                  <div className="bg-green-50 border border-green-100 p-5">
                    <h3 className="font-semibold mb-4">
                      Why Enrollment Deposit?
                    </h3>

                    <ul className="space-y-3 text-sm text-gray-700">
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
                        whileHover={{ y: -2 }}
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
                  {paymentMethod === "forex" ? (
                    <div className="bg-blue-50 border border-blue-100  p-5">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">
                        Forex Payment
                      </h3>

                      <p className="text-slate-600 mb-4">
                        Pay your enrollment deposit securely through our authorized forex
                        payment partners. This option is recommended for international
                        students as it offers competitive exchange rates and faster
                        processing.
                      </p>

                      <ul className="space-y-2 text-sm text-slate-700">
                        <li>✓ Competitive foreign exchange rates</li>
                        <li>✓ Secure international transactions</li>
                        <li>✓ Fast payment confirmation</li>
                        <li>✓ Support for multiple currencies</li>
                        <li>✓ Dedicated payment assistance</li>
                      </ul>

                      <div className="mt-5 p-4 bg-white rounded-lg border">
                        <p className="font-medium">Required Information</p>
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                          <li>• Student Application ID</li>
                          <li>• Student Full Name</li>
                          <li>• University Name</li>
                          <li>• Enrollment Deposit Amount</li>
                        </ul>
                      </div>
                    </div>) : paymentMethod === "direct" ? (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">
                          Direct Payment
                        </h3>

                        <p className="text-slate-600 mb-4">
                          Transfer the enrollment deposit directly to the university's bank
                          account using the banking details provided below. Ensure that you
                          include your application reference number in the payment remarks.
                        </p>

                        <ul className="space-y-2 text-sm text-slate-700">
                          <li>✓ Direct payment to university account</li>
                          <li>✓ Accepted worldwide through bank transfer</li>
                          <li>✓ Transparent payment process</li>
                          <li>✓ Suitable for self-sponsored students</li>
                          <li>✓ Official payment confirmation issued</li>
                        </ul>

                        <div className="mt-5 p-4 bg-white rounded-lg border">
                          <p className="font-medium mb-2">Important Notes</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Include your application ID as reference.</li>
                            <li>• Upload payment receipt after transfer.</li>
                            <li>• Processing may take 2–5 business days.</li>
                            <li>• Ensure the full deposit amount is received.</li>
                          </ul>
                        </div>
                      </div>
                    ) : null}
                </>
              )}



              {ontab === "Paymentinstruction" && (
                <div className="mt-6">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">
                      Payment Instructions
                    </h3>

                    <p className="text-slate-600 mb-4">
                      Please carefully follow the instructions below to ensure your
                      enrollment deposit is processed successfully and without delay.
                    </p>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            Select Your Preferred Payment Method
                          </p>
                          <p className="text-sm text-slate-600">
                            Choose either Forex Payment or Direct Payment based on your
                            convenience and country of residence.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            Complete the Payment
                          </p>
                          <p className="text-sm text-slate-600">
                            Transfer the exact enrollment deposit amount and ensure all
                            transaction charges are covered.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            Save Payment Receipt
                          </p>
                          <p className="text-sm text-slate-600">
                            Download or take a screenshot of the payment confirmation
                            receipt for your records.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                          4
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            Upload Proof of Payment
                          </p>
                          <p className="text-sm text-slate-600">
                            Upload the payment receipt through the student portal or share
                            it with your counselor for verification.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                          5
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            Await Confirmation
                          </p>
                          <p className="text-sm text-slate-600">
                            The university will verify the payment and update your
                            application status once the funds are received.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-white border border-orange-200 rounded-lg">
                      <h4 className="font-semibold text-orange-600 mb-2">
                        Important Notes
                      </h4>

                      <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Include your Application ID in payment remarks.</li>
                        <li>• Ensure the payment amount matches the deposit requested.</li>
                        <li>• Processing may take 2–5 business days.</li>
                        <li>• Keep a copy of the payment receipt until confirmation.</li>
                        <li>• Contact your counselor if payment is not reflected after 5 business days.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Important */}
              <div className="bg-orange-50 border border-orange-200 p-4 mt-6">
                <h4 className="font-semibold text-orange-700">
                  Important
                </h4>

                <p className="text-sm text-orange-600 mt-1">
                  Please pay the enrollment deposit before 18 June 2025 to secure your seat.
                </p>
              </div></div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 ">
                Pay Now
              </button>

              <button className="border border-gray-300 px-6 py-3">
                I'll Pay Later
              </button>
            </div>

            {/* Timeline */}
            <div className="mt-8 border-t pt-6">
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

                    <h4 className="text-sm font-semibold mt-3">
                      {item}
                    </h4>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="xl:col-span-4 space-y-4">
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

          {/* Payment Summary */}
          <div className="bg-white  border p-5">
            <h3 className="font-semibold mb-4">
              Payment Summary
            </h3>

            <div className="flex justify-between">
              <span>Tuition Fee</span>
              <span>{metadata?.tuitionFee}</span>
            </div>

            <div className="flex justify-between mt-2">
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

                <p className="text-sm text-gray-500">
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