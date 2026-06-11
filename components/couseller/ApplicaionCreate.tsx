import React, { useCallback, useEffect, useState } from "react";
import {
  FileText,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import { toast, Toaster } from "sonner";

const ApplicationCreate = ({ applicationData = [], appliedPrograms = [] }) => {
  const router = useRouter();
  const [aps, setaps] = useState(false);
  const [program, setprogram] = useState(true);

  // State for filters
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedIntake, setSelectedIntake] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  
  // State for dropdown options
  const [years, setYears] = useState([]);
  const [intakes, setIntakes] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);

  // State for selected programs list
  const [selectedProgramsList, setSelectedProgramsList] = useState([]);

  // State for recommended programs
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);

  // Generate years from 2020 to 2035
  useEffect(() => {
    const yearOptions = [];
    for (let i = 2026; i <= 2035; i++) {
      yearOptions.push(i);
    }
    setYears(yearOptions);
    setSelectedYear("2026");
  }, []);

  // Fetch universities
  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);

      const [response, res] = await Promise.all([
        axiosInstance.get(`/universities?limit=100`),
        axiosInstance.get("/courses?limit=250"),
      ]);
      const data = response.data.result || response.data.data || [];
      setUniversities(data);
      setRecommendedPrograms(res.data.data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch programs based on selected university
  const fetchPrograms = useCallback(async () => {
    if (!selectedUniversity) {
      setPrograms([]);
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/courses?university=${selectedUniversity}&limit=100`,
      );
      const data = response.data.result || response.data.data || [];
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedUniversity]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Handle add program
  const handleAddProgram = () => {
    if (
      !selectedYear ||
      !selectedIntake ||
      !selectedUniversity ||
      !selectedProgram
    ) {
      console.log("Please fill all fields before adding a program");
      return;
    }

    const programToAdd = programs.find((p) => p._id === selectedProgram);
    if (programToAdd && selectedProgramsList.length < 3) {
      const newProgram = {
        id: Date.now(),
        programId: programToAdd._id,
        name: programToAdd.name,
        university: selectedUniversity,
        universityName: universities.find((u) => u._id === selectedUniversity)
          ?.name,
        country: universities.find((u) => u._id === selectedUniversity)
          ?.country,
        year: selectedYear,
        intake: selectedIntake,
        tuitionFee: programToAdd.tuitionFee,
        applicationFee: programToAdd.applicationFee,
      };

      setSelectedProgramsList([...selectedProgramsList, newProgram]);

      // Log to console
      console.log("Program Added:", newProgram);
      console.log("All Selected Programs:", [
        ...selectedProgramsList,
        newProgram,
      ]);

      // Reset program selection
      setSelectedProgram("");
    } else if (selectedProgramsList.length >= 3) {
      console.log("Maximum 3 programs can be selected");
    }
  };

  // Handle remove program
  const handleRemoveProgram = (id) => {
    const updatedList = selectedProgramsList.filter(
      (program) => program.id !== id,
    );
    setSelectedProgramsList(updatedList);
    console.log("Program Removed. Remaining programs:", updatedList);
  };

  // Handle add recommended program
  const handleAddRecommendedProgram = (program) => {
    if (selectedProgramsList.length < 10) {
      const newProgram = {
        id: Date.now(),
        programId: program._id,
        name: program.name,
        university: program.university?._id || program.universityId,
        universityName: program.university?.name || program.universityName,
        year: selectedYear || "2026",
        intake: program.suggestedIntake || selectedIntake || "Sep-2026",
        tuitionFee: program.tuitionFee,
        country: program.university?.country || "",
        applicationFee: program.applicationFee,
      };

      setSelectedProgramsList([...selectedProgramsList, newProgram]);
      console.log("Recommended Program Added:", newProgram);
      console.log("All Selected Programs:", [
        ...selectedProgramsList,
        newProgram,
      ]);
    } else {
      console.log("Maximum 10 programs can be selected");
    }
  };

  // Handle submit all programs - FIXED VERSION
  const handleSubmitApplications = async () => {
    console.log("=== Final Application Submission ===");
    console.log("Selected Year:", selectedYear);
    console.log("Selected Intake:", selectedIntake);
    console.log("Total Programs Selected:", selectedProgramsList.length);
    console.log(
      "Selected Programs Details:",
      JSON.stringify(selectedProgramsList, null, 2),
    );
    console.log("=== End of Submission ===");

    if (selectedProgramsList.length === 0) {
      toast.error("No programs to submit");
      return;
    }

    try {
      // Use Promise.all to wait for all API calls to complete
      const submissionPromises = selectedProgramsList.map(async (ele) => {
        const payload = {
          country: ele?.country,
          course: ele?.programId,
          intake: ele?.intake,
        };
        const response = await axiosInstance.post('/applications', payload);
        return response.data;
      });
      
      const results = await Promise.all(submissionPromises);
      
      console.log("All applications created:", results);
      toast.success(`Successfully created ${results.length} application(s)`);
      
      // Optional: Clear the selected programs list after successful submission
      setSelectedProgramsList([]);
      
    } catch (error) {
      console.error("Something went wrong: ", error);
      toast.error("Failed to create applications. Please try again.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <Toaster />
      {!aps ? (
        <div className="bg-white  p-4 shadow-sm border border-gray-200">

          {/* <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10  bg-orange-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#F26D44]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  applicationData
                </h2>
                <p className="text-xs text-gray-500">
                  Total {applicationData.length} applicationData
                </p>
              </div>
            </div>
            <button
              onClick={() => setaps(!aps)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white  hover:from-[#E05D34] hover:to-orange-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md"
            >
              <FileText size={16} />
              Add New
            </button>
          </div> */}

          <div className="flex justify-center border-b border-gray-200">
            <button
              onClick={() => setprogram(true)}
              className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                program
                  ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-orange-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Apply To Programs
            </button>
            <button
              onClick={() => setprogram(false)}
              className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                !program
                  ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-orange-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Applied Programs ({`${applicationData.length}`})
            </button>
          </div>

          {!program ? (
            <>
              {applicationData.length === 0 ? (
                <div className=" py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    No applicationData Yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Create your first application to get started
                  </p>
                  <button className="px-5 py-2 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white  text-sm font-medium">
                    Create Application
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  {applicationData.map((app, idx) => (
                    <motion.div
                      key={app._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() =>
                        router.push(`/dashboard/application_details/${app._id}`)
                      }
                      className="bg-gray-50  p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-gray-900 group-hover:text-[#F26D44] transition">
                              {app.applicationNumber ||
                                `Application #${idx + 1}`}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                app.primaryStatus === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : app.primaryStatus === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {app.primaryStatus || "Pending"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {app.course?.name || "Course not specified"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.course?.university?.name ||
                              "University not specified"}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {app.intake || "Intake not set"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              Updated {formatDate(app.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-gray-400 group-hover:text-[#F26D44] transition self-center"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Applied Programs Section */}
              <div className="space-y-3 mt-4">
                {appliedPrograms && appliedPrograms.length > 0 ? (
                  appliedPrograms.map((program, idx) => (
                    <motion.div
                      key={program._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() =>
                        router.push(`/dashboard/program_details/${program._id}`)
                      }
                      className="bg-gray-50  p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-gray-900 group-hover:text-[#F26D44] transition">
                              {program.programName ||
                                program.name ||
                                `Program #${idx + 1}`}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                program.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : program.status === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : program.status === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {program.status || "Applied"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {program.course?.name ||
                              program.courseName ||
                              "Course not specified"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {program.university?.name ||
                              program.universityName ||
                              "University not specified"}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {program.applicationDate ||
                                program.appliedDate ||
                                "Date not set"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              Applied{" "}
                              {formatDate(
                                program.createdAt || program.appliedAt,
                              )}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-gray-400 group-hover:text-[#F26D44] transition self-center"
                        />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-2">
                    <h3 className="text-md font-semibold text-gray-900 mb-2 text-left">
                      Quick Add Program
                    </h3>

                    <div className="bg-gradient-to-r from-orange-50 to-amber-50  p-2 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 ">
                        {/* Select Year */}
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        >
                          <option value="">Select Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>

                        {/* Select Intake */}
                        <select
                          value={selectedIntake}
                          onChange={(e) => setSelectedIntake(e.target.value)}
                          className="px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        >
                          <option value="">Select Intake</option>
                          {intakes.map((intake) => (
                            <option key={intake} value={intake}>
                              {intake}
                            </option>
                          ))}
                        </select>

                        {/* Select University */}
                        <select
                          value={selectedUniversity}
                          onChange={(e) =>
                            setSelectedUniversity(e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        >
                          <option value="">Select University</option>
                          {universities.map((uni) => (
                            <option key={uni._id} value={uni._id}>
                              {uni.name}
                            </option>
                          ))}
                        </select>

                        {/* Select Program */}
                        <select
                          value={selectedProgram}
                          onChange={(e) => setSelectedProgram(e.target.value)}
                          className="px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          disabled={!selectedUniversity}
                        >
                          <option value="">Select Program</option>
                          {programs.map((prog) => (
                            <option key={prog._id} value={prog._id}>
                              {prog.name}
                            </option>
                          ))}
                        </select>

                        {/* Add Button */}
                        <button
                          onClick={handleAddProgram}
                          className="px-4 py-2 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white  hover:from-[#E05D34] hover:to-orange-700 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-semibold text-gray-900">
                          Selected Programs (Max 3 programs)
                        </h3>
                        {selectedProgramsList.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {selectedProgramsList.length}/10 selected
                          </span>
                        )}
                      </div>

                      {selectedProgramsList.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50  border border-gray-200">
                          <p className="text-sm text-gray-500">
                            Let's get started, add programs to proceed with
                            applications.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedProgramsList.map((program, idx) => (
                            <div
                              key={program.id}
                              className="bg-gray-50  p-3 border border-gray-200 flex justify-between items-center"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">
                                  {program.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {program.universityName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {program.year} - {program.intake}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveProgram(program.id)}
                                className="p-1 hover:bg-red-100 rounded transition-colors"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </div>
                          ))}

                          {selectedProgramsList.length > 0 && (
                            <button
                              onClick={handleSubmitApplications}
                              className="w-full mt-4 px-4 py-2 bg-green-600 text-white  hover:bg-green-700 transition-all text-sm font-medium"
                            >
                              Submit {selectedProgramsList.length}{" "}
                              Application(s)
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {recommendedPrograms.length > 0 && (
                      <div className="text-left">
                        <h3 className="text-md font-semibold text-gray-900 mb-3">
                          Recommended Programs By Ooshas
                        </h3>
                        <div className="space-y-4">
                          {recommendedPrograms.map((program, idx) => (
                            <div
                              key={program._id || idx}
                              className="border border-gray-200  p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col lg:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    {program.name}
                                  </h4>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {program.tags?.map((tag, tagIdx) => (
                                      <span
                                        key={tagIdx}
                                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {program.university?.name ||
                                      program.universityName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {program.university?.country ||
                                      program.country}
                                  </p>
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Suggested Intake:
                                      </span>{" "}
                                      {program.suggestedIntake || "Sep-2026"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Duration:
                                      </span>{" "}
                                      {program.duration || "48 Month(s)"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                  <div className="text-right mb-3">
                                    <p className="text-sm text-gray-500">
                                      Tuition Fee
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">
                                      ₹
                                      {program.tuitionFee?.toLocaleString() ||
                                        "0"}
                                    </p>

                                    {program.applicationFee !== 0 && (
                                      <p className="text-xs text-gray-500">
                                        Application Fee
                                      </p>
                                    )}
                                    {program.applicationFee !== 0 && (
                                      <p className="text-sm font-medium text-green-600">
                                        {program.applicationFee === 0
                                          ? "FREE"
                                          : `₹${program.applicationFee} `}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/programs/${program.slug}`,
                                        )
                                      }
                                      className="px-3 py-1.5 border border-orange-600 text-orange-600  hover:bg-orange-50 transition-all text-xs font-medium flex items-center gap-1"
                                    >
                                      <Eye size={14} />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleAddRecommendedProgram(program)
                                      }
                                      className="px-3 py-1.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white  hover:from-[#E05D34] hover:to-orange-700 transition-all text-xs font-medium flex items-center gap-1"
                                    >
                                      <Plus size={14} />
                                      Apply Now
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10  bg-orange-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#F26D44]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Create New Application
                </h2>
                <p className="text-xs text-gray-500">
                  Fill in the details below
                </p>
              </div>
            </div>
            <button
              onClick={() => setaps(!aps)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white  hover:from-[#E05D34] hover:to-orange-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          </div>
          {/* Your application creation form goes here */}
          <div className="text-center py-8">
            <p className="text-gray-500">
              Application creation form will be here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCreate;