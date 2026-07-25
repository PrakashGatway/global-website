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
import FilterDrawer from "./FilterDrawer";
import Loading from "@/app/loading";


const ApplicationCreate = ({ applicationData = [], appliedPrograms = [], countriesList, user }) => {
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
  const [year, setYear] = useState()
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
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [Drawer, setDrawer] = useState<Boolean>(false);
  const [filters, setFilters] = useState({
    studyMode: [],
    level: [],
    country: "",
    university: "",
    category: [],
    gradingUG: "Out of 100",
    scoreUG: "",
    grading12th: "Out of 100",
    score12th: "",
    backlogs: "",
    workExperience: "",
    englishScore: {
      exam: "",
      overall: "",
      listening: "",
      reading: "",
      writing: "",
      speaking: "",
      examDate: "",
    },
    otherExam: {
      exam: "",
      overall: "",
    },
    maxFee: "",
  });


  // Generate years from 2020 to 2035
  useEffect(() => {
    const yearOptions = [];
    for (let i = 2026; i <= 2035; i++) {
      yearOptions.push(i);
    }
    setYears(yearOptions);
    setSelectedYear("2026");
  }, []);


  const buildFilterQuery = (filters) => {
  const params = new URLSearchParams();

  // 1. Arrays
  if (filters.studyMode?.length) {
    filters.studyMode.forEach((val) =>
      params.append("studyMode", val)
    );
  }

  if (filters.level?.length) {
    filters.level.forEach((val) =>
      params.append("level", val)
    );
  }

  // 2. Simple Strings
  if (filters.country) {
    params.append("country", filters.country);
  }

  if (filters.university) {
    params.append("university", filters.university);
  }

  // category is STRING, not array
  if (filters.category) {
    params.append("category", filters.category);
  }

  if (filters.backlogs) {
    params.append("backlogs", filters.backlogs);
  }

  if (filters.workExperience) {
    params.append("workExperience", filters.workExperience);
  }

  if (filters.minFee) {
    params.append("minFee", filters.minFee);
  }

  if (filters.maxFee) {
    params.append("maxFee", filters.maxFee);
  }

  // 3. Education Scores
  if (filters.ugScore) {
    params.append("ugScore", filters.ugScore);
  }

  if (filters.twelfthScore) {
    params.append("twelfthScore", filters.twelfthScore);
  }

  // 4. English Score - ONE KEY WITH FULL OBJECT
  if (filters.englishScore?.exam) {
    params.append(
      "englishScore",
      JSON.stringify(filters.englishScore)
    );
  }

  // 5. Other Exam - ONE KEY WITH FULL OBJECT
  if (filters.otherExam?.exam) {
    params.append(
      "otherExam",
      JSON.stringify(filters.otherExam)
    );
  }

  return params.toString();
};


console.log(filters)
 

  // Fetch universities
 const fetchUniversities = useCallback(async (filters) => {
  try {
    setLoading(true);

    // 1. Build the query string from filters
    const filterQueryString = buildFilterQuery(filters);

    // 2. Construct the full URL
    // If filters exist, add them; otherwise just use page/limit
    const coursesUrl = `/courses?limit=40&page=${page}${filterQueryString ? '&' + filterQueryString : ''}`;

    console.log("Fetching URL:", coursesUrl); // Debugging: Check your console to see the final URL

    const [response, res] = await Promise.all([
      axiosInstance.get(`/universities?limit=100`),
      axiosInstance.get(coursesUrl), // ✅ Use the dynamic URL here
    ]);

    const data = response.data.result || response.data.data || [];
    setUniversities(data);

    if (res.data && res.data.success) {
      setRecommendedPrograms(res.data.data);
      setPages(res.data.pages);
      setTotal(res.data.total);
      // Note: We removed setPage(res.data.page) to prevent loops, 
      // assuming the API returns the requested page number correctly.
    } else {
      setRecommendedPrograms([]);
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
}, [page]); // ✅ Added 'filters' to dependency array

 const handleApply = () => {
   
  fetchUniversities(filters)
  setPage(1); // Reset to page 1 when filters change
  // The fetch will trigger automatically because 'page' changed 
  // OR you can call fetchUniversities() directly if you prefer
};

  // Handler function
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



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
      //console.log("Please fill all fields before adding a program");
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
      // //console.log("All Selected Programs:", [
      //   ...selectedProgramsList,
      //   newProgram,
      // ]);

      // Reset program selection
      setSelectedProgram("");
    } else if (selectedProgramsList.length >= 3) {
      //console.log("Maximum 3 programs can be selected");
    }
  };

  // Handle remove program
  const handleRemoveProgram = (id) => {
    const updatedList = selectedProgramsList.filter(
      (program) => program.id !== id,
    );
    setSelectedProgramsList(updatedList);
    //console.log("Program Removed. Remaining programs:", updatedList);
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
      //console.log("Recommended Program Added:", newProgram);
      //console.log("All Selected Programs:", [
      //   ...selectedProgramsList,
      //   newProgram,
      // ]);
    } else {
      //console.log("Maximum 10 programs can be selected");
    }
  };

  // Handle submit all programs - FIXED VERSION
  const handleSubmitApplications = async () => {
    //console.log("=== Final Application Submission ===");
    //console.log("Selected Year:", selectedYear);
    //console.log("Selected Intake:", selectedIntake);
    //console.log("Total Programs Selected:", selectedProgramsList.length);
    //console.log(
    //   "Selected Programs Details:",
    //   JSON.stringify(selectedProgramsList, null, 2),
    // );
    //console.log("=== End of Submission ===");

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

      //console.log("All applications created:", results);
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


  const filterCourses = () => {
    const search = searchQuery.trim().toLowerCase();

    if (!search) return;

    const filtered = recommendedPrograms.filter((course) => {
      return (
        course?.name?.toLowerCase().includes(search) ||
        course?.programName?.toLowerCase().includes(search) ||
        course?.university?.name?.toLowerCase().includes(search)
      );
    });

    setRecommendedPrograms(filtered);
    console.log(filtered)
  };

  const handleClearSearch = () => {

    setSearchQuery("");
    fetchUniversities()

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

          <div className="relative flex justify-center items-center border-b border-gray-200">
            {/* Center Buttons */}
            <div className="flex items-center">
              <button
                onClick={() => setprogram(true)}
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${program
                  ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-orange-600"
                  : "text-gray-700 hover:text-gray-900"
                  }`}
              >
                Apply To Programs
              </button>

              <button
                onClick={() => setprogram(false)}
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${!program
                  ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-orange-600"
                  : "text-gray-700 hover:text-gray-900"
                  }`}
              >
                Applied Programs ({applicationData.length})
              </button>
            </div>

            {/* Filter Button - Right End */}
            <button
              onClick={() => setDrawer(true)}
              type="button"
              className="absolute right-0 px-5 py-2.5 bg-orange-500 text-white font-medium cursor-pointer transition"
            >
              Filter
            </button>
          </div>


          {Drawer === true && <FilterDrawer handleApply={handleApply} filters={filters} setFilters={setFilters} user={user} countryRes={countriesList} isOpen={Drawer} universities={universities} onClose={() => setDrawer(false)} />}



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
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.primaryStatus === "approved"
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
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${program.status === "approved"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[3.5fr_1fr_1fr_1.5fr_1fr_auto] gap-4 items-end lg:py-4">
                      {/* Search Programs */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Search Programs
                        </label>
                        <div className="relative w-full">
                          <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            className="w-full py-2.5 px-3 pl-10 pr-9 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-none hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 focus:bg-white outline-none transition-all duration-200"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              // setFilters((prev: any) => ({
                              //     ...prev,
                              //     search: e.target.value,
                              // }));
                            }}
                            placeholder="Search by program name, university..."
                          />
                          {searchQuery && (
                            <button
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-all duration-200"
                              onClick={handleClearSearch}
                            >
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>



                      {/* Year */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Year
                        </label>
                        <div className="relative w-full">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-orange-500 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <select
                            className="w-full py-2.5 px-3 pl-10 pr-9 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-none appearance-none cursor-pointer hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 focus:bg-white outline-none transition-all duration-200"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                          >
                            <option value="">All Years</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                          </select>
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>



                      {/* Buttons */}
                      <div className="flex items-center gap-2 mb-px">
                        <button
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#f26d44] border-none cursor-pointer whitespace-nowrap shadow-sm hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-orange-500/20 active:translate-y-0 transition-all duration-200"
                          onClick={filterCourses}

                        >
                          <span>Search Programs</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {recommendedPrograms.length > 0 && (
                      <div className="text-left">
                        <h3 className="text-md font-semibold text-gray-900 mb-3">
                          Recommended Programs By Ooshas
                        </h3>
                        <div className="space-y-4">
                          {loading ? (
                            <div className="flex items-center justify-center py-10">
                              <p>Loading programs...</p>
                            </div>
                          ) :
                            (recommendedPrograms.map((program, idx) => (
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
                            )))
                          }

                          {pages > 1 && !loading && (
                            <div className="mt-6">
                              <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
                                {/* Previous Button */}
                                <button
                                  onClick={() => handlePageChange(page - 1)}
                                  disabled={page === 1}
                                  className={`
              flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
              ${page === 1
                                      ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                                      : 'border-orange-200 text-orange-600 bg-white hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm'
                                    }
            `}
                                >
                                  <ChevronLeft size={16} />
                                  <span className="hidden sm:inline">Previous</span>
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                  {(() => {
                                    const pageNumbers = [];
                                    const maxVisible = 5;

                                    if (pages <= maxVisible) {
                                      for (let i = 1; i <= pages; i++) pageNumbers.push(i);
                                    } else {
                                      pageNumbers.push(1);
                                      if (page > 3) pageNumbers.push('...');

                                      const start = Math.max(2, page - 1);
                                      const end = Math.min(pages - 1, page + 1);

                                      for (let i = start; i <= end; i++) {
                                        pageNumbers.push(i);
                                      }

                                      if (page < pages - 2) pageNumbers.push('...');
                                      pageNumbers.push(pages);
                                    }

                                    return pageNumbers.map((pageNum, idx) => {
                                      if (pageNum === '...') {
                                        return (
                                          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 text-sm">
                                            •••
                                          </span>
                                        );
                                      }

                                      const isActive = pageNum === page;
                                      return (
                                        <button
                                          key={pageNum}
                                          onClick={() => handlePageChange(pageNum)}
                                          className={`
                      min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive
                                              ? 'bg-gradient-to-r from-[#F26D44] to-orange-600 text-white shadow-md shadow-orange-200 scale-105'
                                              : 'text-gray-700 bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
                                            }
                    `}
                                        >
                                          {pageNum}
                                        </button>
                                      );
                                    });
                                  })()}
                                </div>

                                {/* Next Button */}
                                <button
                                  onClick={() => handlePageChange(page + 1)}
                                  disabled={page === pages}
                                  className={`
              flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
              ${page === pages
                                      ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                                      : 'border-orange-200 text-orange-600 bg-white hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm'
                                    }
            `}
                                >
                                  <span className="hidden sm:inline">Next</span>
                                  <ChevronRight size={16} />
                                </button>
                              </nav>

                              {/* Page Info */}
                              <div className="mt-3 text-center text-xs text-gray-500">
                                Page {page} of {pages} • {total.toLocaleString()} total programs
                              </div>
                            </div>
                          )}
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