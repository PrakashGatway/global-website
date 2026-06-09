"use client"


const EnrollmentDeposit = () => {
  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT SECTION */}
        <div className="xl:col-span-8 space-y-4">

          {/* Header Card */}
          <div className="bg-white  border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row items-start gap-5">

              <div className="w-20 h-20 bg-orange-50 flex items-center justify-center">
                💳
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
                    <h4 className="font-bold mt-1">€1,200</h4>
                    <p className="text-xs text-gray-400">
                      Non-refundable
                    </p>
                  </div>

                  <div className="border p-3">
                    <p className="text-xs text-gray-500">Payment Deadline</p>
                    <h4 className="font-bold mt-1">18 Jun 2025</h4>
                    <p className="text-xs text-orange-600">
                      14 Days Left
                    </p>
                  </div>

                  <div className="border p-3">
                    <p className="text-xs text-gray-500">Offer Deadline</p>
                    <h4 className="font-bold mt-1">18 Jun 2025</h4>
                    <p className="text-xs text-orange-600">
                      14 Days Left
                    </p>
                  </div>

                  <div className="border p-3">
                    <p className="text-xs text-gray-500">Currency</p>
                    <h4 className="font-bold mt-1">EUR</h4>
                    <p className="text-xs text-gray-400">
                      Euro
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Alert */}
            <div className="mt-5 bg-orange-50 border border-orange-100 p-3 text-sm text-orange-700">
              Your admission is not confirmed until the enrollment deposit is received by the university.
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-8 border-b mt-6 text-sm">
              <button className="border-b-2 border-orange-600 pb-3 text-orange-600 font-medium">
                Payment Details
              </button>

              <button className="pb-3 text-gray-500">
                Payment Methods
              </button>

              <button className="pb-3 text-gray-500">
                Instructions
              </button>

              <button className="pb-3 text-gray-500">
                Transaction History
              </button>
            </div>

            {/* Content */}
            <div className="grid lg:grid-cols-2 gap-6 mt-6">

              {/* Details */}
              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-500">Program</span>
                  <span>Bachelor of Computer Science</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Faculty</span>
                  <span>School of Engineering</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Start Date</span>
                  <span>15 Sept 2026</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span>3 Years</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Tuition Fee</span>
                  <span>€2,345</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Deposit</span>
                  <span className="font-semibold">
                    €1,200
                  </span>
                </div>

              </div>

              {/* Why Card */}
              <div className="bg-green-50 border border-green-100  p-5">
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

            {/* Important */}
            <div className="bg-orange-50 border border-orange-200 p-4 mt-6">
              <h4 className="font-semibold text-orange-700">
                Important
              </h4>

              <p className="text-sm text-orange-600 mt-1">
                Please pay the enrollment deposit before 18 June 2025 to secure your seat.
              </p>
            </div>

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

          {/* Application Summary */}
          <div className="bg-white border p-5">
            <h3 className="font-semibold mb-4">
              Application Summary
            </h3>
          </div>

          {/* Payment Summary */}
          <div className="bg-white  border p-5">
            <h3 className="font-semibold mb-4">
              Payment Summary
            </h3>

            <div className="flex justify-between">
              <span>Tuition Fee</span>
              <span>€2,345</span>
            </div>

            <div className="flex justify-between mt-2">
              <span>Enrollment Deposit</span>
              <span>€1,200</span>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-orange-600">
              <span>Total Payable</span>
              <span>€1,200</span>
            </div>
          </div>

          {/* Counselor */}
          <div className="bg-white border p-5">
            <h3 className="font-semibold">
              Need Help?
            </h3>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-14 h-14 bg-gray-200" />

              <div>
                <h4 className="font-semibold">
                  Rahul Sharma
                </h4>

                <p className="text-sm text-gray-500">
                  Senior Admission Advisor
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