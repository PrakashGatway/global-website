export default function ApplicationForm() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="bg-white border border-[#f26d44] shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-5 bg-[#f26d44]">
          <h1 className="text-xl font-semibold text-white">
            Application Form
          </h1>
          <p className="text-sm text-white mt-1">
            Please fill in all the required details. Fields marked with *
            are mandatory.
          </p>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Personal Information */}
          <div className="border border-gray-200  p-5">
            <h2 className="font-semibold text-gray-900 mb-5">
              1. Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Rohit Kumar"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Gender *
                </label>
                <select className="w-full h-11 border border-gray-300 px-3">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nationality *
                </label>
                <select className="w-full h-11 border border-gray-300 px-3">
                  <option>India</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Country of Birth *
                </label>
                <select className="w-full h-11 border border-gray-300 px-3">
                  <option>India</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Place of Birth *
                </label>
                <input
                  type="text"
                  placeholder="New Delhi"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Passport Number
                </label>
                <input
                  type="text"
                  placeholder="P1234567"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Passport Expiry Date
                </label>
                <input
                  type="date"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Secondary Email
                </label>
                <input
                  type="email"
                  placeholder="rohit@example.com"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-5">
              2. Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="test@example.com"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mobile Number *
                </label>

                <div className="flex gap-2">
                  <select className="w-20 h-11 border border-gray-300">
                    <option>+91</option>
                  </select>

                  <input
                    type="text"
                    className="flex-1 h-11 border border-gray-300 px-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Alternate Number
                </label>

                <div className="flex gap-2">
                  <select className="w-20 h-11 border border-gray-300">
                    <option>+91</option>
                  </select>

                  <input
                    type="text"
                    className="flex-1 h-11 border border-gray-300 px-3"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Current Address *
              </label>

              <textarea
                rows={4}
                placeholder="123 Green Park, New Delhi"
                className="w-full border border-gray-300 p-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>

                <select className="w-full h-11 border border-gray-300 px-3">
                  <option>India</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  State / Province
                </label>

                <input
                  type="text"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  City
                </label>

                <input
                  type="text"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  PIN / Postal Code
                </label>

                <input
                  type="text"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div className="border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-5">
              3. Academic Background
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Highest Education Level *
                </label>

                <select className="w-full h-11 border border-gray-300 px-3">
                  <option>High School / Senior Secondary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  School / Institution *
                </label>

                <input
                  type="text"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Country *
                </label>

                <select className="w-full h-11 border border-gray-300 px-3">
                  <option>India</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Board / University *
                </label>

                <input
                  type="text"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Year of Completion *
                </label>

                <select className="w-full h-11 border border-gray-300 px-3">
                  <option>2020</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Result / Grade *
                </label>

                <input
                  type="text"
                  className="w-full h-11 border border-gray-300 px-3"
                />
              </div>
            </div>

            {/* Upload */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">
                Upload Marksheet / Certificate *
              </label>

              <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-orange-500 transition">
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                />

                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer"
                >
                  <p className="text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-orange-600 font-medium">
                      Browse
                    </span>
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    PDF, JPG, PNG (Max 5 MB)
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button className="bg-primary hover:bg-[#f26d44] text-white px-6 py-3 font-medium">
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}