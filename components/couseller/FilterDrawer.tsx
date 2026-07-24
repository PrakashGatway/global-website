import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/app/axiosInstance";
import Select from "react-select";

const FilterDrawer = ({ 
  isOpen, 
  onClose, 
  filters, 
  setFilters, 
  onApply, 
  countryRes, 
  universities, 
  user 
}) => {
  
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/courses/categories?limit=100");
        setCategoryOptions(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Sync local UI state when parent filters change (e.g., after clicking Save Preferences)
  useEffect(() => {
    // This ensures that when applyPreference sets new values in the parent,
    // the drawer inputs immediately reflect those changes
  }, [filters]);

  // Toggle helpers for multi-select arrays
  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle English score input changes
  const handleEnglishScoreChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      englishScore: {
        ...prev.englishScore,
        [name]: value,
      },
    }));
  };

  // Handle Other exam score input changes
  const handleOtherExamScoreChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      otherExam: {
        ...prev.otherExam,
        overall: value,
      },
    }));
  };

  // Apply button handler - sends data back to parent
  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  // --- OPTIONS ---
  const studyModes = ["Full Time", "Part Time", "Online", "Hybrid"];
  
  const programLevels = [
    "High School (11th-12th)",
    "UG Diploma/ Certificate/ Associate Degree",
    "Undergraduate",
    "PG Diploma /Certificate",
    "Postgraduate",
    "UG+PG (Accelerated) Degree",
    "PhD",
    "Short-term/Summer Programs",
    "Pathway Programs (UG)",
    "Pathway Programs (PG)",
    "Semester Study Abroad",
    "Twinning Programmes (UG)",
    "Twinning Programmes (PG)",
    "English Language Program",
    "Online Programmes / Distance Learning",
    "Hybrid",
    "Grades Below 10th",
  ];

  const gradingOptions = ["Out of 100", "Percentage", "CGPA", "GPA"];

  const examOptions = [
    { value: "ielts", label: "IELTS" },
    { value: "toefl", label: "TOEFL" },
    { value: "pte", label: "PTE" },
    { value: "det", label: "Duolingo (DET)" },
  ];

  const otherExamOptions = [
    { value: "gre", label: "GRE" },
    { value: "gmat", label: "GMAT" },
    { value: "sat", label: "SAT" },
    { value: "act", label: "ACT" },
  ];

  // Custom styles for react-select to match orange theme
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#f97316" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(249, 115, 22, 0.1)" : "none",
      "&:hover": { borderColor: "#f97316" },
      borderRadius: "0.375rem",
      padding: "2px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#fff7ed" : provided.backgroundColor,
      color: "#1f2937",
      "&:hover": { backgroundColor: "#fff7ed" },
    }),
    singleValue: (provided) => ({ ...provided, color: "#1f2937" }),
    placeholder: (provided) => ({ ...provided, color: "#9ca3af" }),
  };

  // --- SAVE PREFERENCES LOGIC ---
  const applyPreference = () => {
    const profile = user?.profile;
    if (!profile) return;

    const prefs = profile.preferences || {};
    const educationHistory = profile.educationHistory || [];
    const workExperience = profile.workExperience || [];

    // 1. Countries Mapping
    const preferredCountries = prefs.preferredCountries || [];
    const countryCodes = (countryRes || [])
      .filter((c) => preferredCountries.includes(c.label))
      .map((c) => c.value);

    // 2. Categories Mapping
    const preferredCategories = prefs.preferredCourse || [];
    const categoryIds = (categoryOptions || [])
      .filter((c) =>
        preferredCategories.some(
          (item) => item.trim().toLowerCase() === c.label?.trim()?.toLowerCase()
        )
      )
      .map((c) => c.value);

    // 3. Level
    const levelFilter = prefs.level ? [prefs.level] : [];

    // 4. Budget Range
    const minFee = prefs.budgetRange?.min?.toString() || "";
    const maxFee = prefs.budgetRange?.max?.toString() || "";

    // 5. Education Scores
    const ug = educationHistory.find(
      (item) => item.educationLevel === "Undergraduate"
    );
    const grade12 = educationHistory.find(
      (item) => item.educationLevel === "Grade 12"
    );

    // 6. Work Experience Calculation
    const totalMonths = workExperience.reduce((total, job) => {
      if (!job.from || !job.to) return total;
      const from = new Date(job.from);
      const to = new Date(job.to);
      const months =
        (to.getFullYear() - from.getFullYear()) * 12 +
        (to.getMonth() - from.getMonth());
      return total + Math.max(months, 0);
    }, 0);
    const totalExperience = (totalMonths / 12).toFixed(1);

    // 7. Parse Stringified Exam Data
    const parseExam = (value) => {
      try {
        if (!value || value === "{}") return {};
        return typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        return {};
      }
    };

    const ieltsData = parseExam(profile.ielts);
    const toeflData = parseExam(profile.toefl);
    const pteData = parseExam(profile.pte);
    const greData = parseExam(profile.gre);
    const gmatData = parseExam(profile.gmat);
    const satData = parseExam(profile.sat);

    // Build otherExam object based on priority
    let otherExam = {};
    if (Object.keys(greData).length > 0) {
      otherExam = {
        exam: "GRE",
        overall: greData.overall || "",
        quantitative: greData.quantitative || "",
        verbal: greData.verbal || "",
        analyticalWriting: greData.analyticalWriting || "",
        examDate: greData.examDate || "",
      };
    } else if (Object.keys(gmatData).length > 0) {
      otherExam = {
        exam: "GMAT",
        overall: gmatData.overall || "",
        quantitative: gmatData.quantitative || "",
        verbal: gmatData.verbal || "",
        analyticalWriting: gmatData.analyticalWriting || "",
        integratedReasoning: gmatData.integratedReasoning || "",
        examDate: gmatData.examDate || "",
      };
    } else if (Object.keys(satData).length > 0) {
      otherExam = {
        exam: "SAT",
        overall: satData.overall || "",
        readingWriting: satData.readingWriting || "",
        math: satData.math || "",
        essay: satData.essay || "",
        examDate: satData.examDate || "",
      };
    }

    // Build englishScore object based on priority
    let englishScore = {};
    if (Object.keys(ieltsData).length > 0) {
      englishScore = {
        exam: "IELTS",
        overall: ieltsData.overall || "",
        listening: ieltsData.listening || "",
        reading: ieltsData.reading || "",
        writing: ieltsData.writing || "",
        speaking: ieltsData.speaking || "",
        examDate: ieltsData.examDate || "",
        yetToReceive: ieltsData.yetToReceive || false,
      };
    } else if (Object.keys(toeflData).length > 0) {
      englishScore = {
        exam: "TOEFL",
        overall: toeflData.overall || "",
        listening: toeflData.listening || "",
        reading: toeflData.reading || "",
        writing: toeflData.writing || "",
        speaking: toeflData.speaking || "",
        examDate: toeflData.examDate || "",
        yetToReceive: toeflData.yetToReceive || false,
      };
    } else if (Object.keys(pteData).length > 0) {
      englishScore = {
        exam: "PTE",
        overall: pteData.overall || "",
        listening: pteData.listening || "",
        reading: pteData.reading || "",
        writing: pteData.writing || "",
        speaking: pteData.speaking || "",
        examDate: pteData.examDate || "",
        yetToReceive: pteData.yetToReceive || false,
      };
    }

    // Update parent filters with all mapped preferences
    setFilters((prev) => ({
      ...prev,
      country: countryCodes[0] || "",
      category: categoryIds[0] || "",
      level: levelFilter,
      minFee,
      maxFee,
      ugScore: ug?.percentage?.toString() || "",
      twelfthScore: grade12?.percentage?.toString() || "",
      workExperience: totalExperience.toString(),
      englishScore,
      otherExam,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={applyPreference}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* COUNTRY & UNIVERSITY */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select country</option>
                    {countryRes?.map((country) => (
                      <option key={country.id} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">University</label>
                  <select
                    value={filters.university}
                    onChange={(e) => handleChange("university", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select university</option>
                    {universities?.length > 0 ? (
                      universities.map((uni) => (
                        <option key={uni.id} value={uni.name}>
                          {uni.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Harvard">Harvard University</option>
                        <option value="Stanford">Stanford University</option>
                        <option value="Oxford">University of Oxford</option>
                        <option value="MIT">MIT</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categoryOptions?.map((opt) => (
                    <option key={opt._id || opt.name} value={opt._id || opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* GRADING SYSTEM (UG) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Grading System (UG)</label>
                  <select
                    value={filters.gradingUG}
                    onChange={(e) => handleChange("gradingUG", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {gradingOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Score (UG) *</label>
                  <input
                    type="text"
                    value={filters.scoreUG}
                    onChange={(e) => handleChange("scoreUG", e.target.value)}
                    placeholder="Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* GRADING SYSTEM (12th) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Grading System (12th)</label>
                  <select
                    value={filters.grading12th}
                    onChange={(e) => handleChange("grading12th", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {gradingOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Score (12th) *</label>
                  <input
                    type="text"
                    value={filters.score12th}
                    onChange={(e) => handleChange("score12th", e.target.value)}
                    placeholder="Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* BACKLOGS */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Backlogs</label>
                <input
                  type="text"
                  value={filters.backlogs}
                  onChange={(e) => handleChange("backlogs", e.target.value)}
                  placeholder="Enter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* WORK EXPERIENCE */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Work Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={filters.workExperience}
                  onChange={(e) => handleChange("workExperience", e.target.value)}
                  placeholder="Enter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* English Proficiency Exam */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-800">English Proficiency Exam</label>
                <Select
                  options={examOptions}
                  placeholder="Select"
                  value={examOptions.find(
                    (item) => item.value.toUpperCase() === filters.englishScore?.exam
                  )}
                  onChange={(option) => {
                    const exam = option?.value?.toUpperCase() || "";
                    setFilters((prev) => ({
                      ...prev,
                      englishScore: {
                        exam,
                        overall: "",
                        listening: "",
                        reading: "",
                        writing: "",
                        speaking: "",
                        examDate: "",
                      },
                    }));
                  }}
                  isClearable
                  styles={customSelectStyles}
                />
              </div>

              {/* English Scores Section */}
              <AnimatePresence>
                {["IELTS", "TOEFL", "PTE"].includes(filters.englishScore?.exam) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-5 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["listening", "reading", "writing", "speaking"].map((field) => (
                          <div key={field}>
                            <label className="block mb-2 text-sm font-medium capitalize">
                              {field} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name={field}
                              value={filters.englishScore?.[field] || ""}
                              onChange={handleEnglishScoreChange}
                              placeholder="Enter"
                              className="w-full py-2 px-4 bg-gray-50 border border-gray-200 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {["IELTS", "TOEFL", "PTE", "DET"].includes(filters.englishScore?.exam) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-2">
                      <label className="block text-sm font-medium">Overall <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        name="overall"
                        value={filters.englishScore?.overall || ""}
                        onChange={handleEnglishScoreChange}
                        placeholder="Enter"
                        className="w-full py-2 px-4 bg-gray-50 border border-gray-200 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Other Exams */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-800">Other Exams</label>
                <Select
                  options={otherExamOptions}
                  placeholder="Select"
                  value={otherExamOptions.find(
                    (item) => item.value.toUpperCase() === filters.otherExam.exam
                  )}
                  onChange={(option) => {
                    const exam = option?.value?.toUpperCase() || "";
                    setFilters((prev) => ({
                      ...prev,
                      otherExam: { ...prev.otherExam, exam, overall: "" },
                    }));
                  }}
                  isClearable
                  styles={customSelectStyles}
                />
              </div>

              {/* Other Exam Score */}
              <AnimatePresence>
                {filters.otherExam.exam && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <label className="block mb-2 text-sm font-medium">
                        Overall Score <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter"
                        value={filters.otherExam?.overall || ""}
                        onChange={handleOtherExamScoreChange}
                        className="w-full py-2 px-4 bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-md"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STUDY MODE */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Study Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {studyModes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleArrayFilter("studyMode", mode)}
                      className={`px-3 py-2 text-sm rounded border transition-colors ${
                        filters.studyMode.includes(mode)
                          ? "bg-orange-50 border-orange-500 text-orange-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* PROGRAM LEVEL */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Program Level</label>
                <div className="space-y-2">
                  {programLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleArrayFilter("programLevel", level)}
                      className={`w-full px-3 py-2 text-left text-sm rounded border transition-colors ${
                        filters.programLevel.includes(level)
                          ? "bg-orange-50 border-orange-500 text-orange-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* TUITION FEES */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-700">Tuition Fees</label>
                  <span className="text-orange-600 font-medium">₹ {filters.tuitionFees.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="100000"
                  value={filters.tuitionFees}
                  onChange={(e) => handleChange("tuitionFees", Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>50L+</span>
                </div>
              </div>
            </div>

            {/* Footer - Apply Button */}
            <div className="border-t border-gray-200 p-6 bg-white shrink-0">
              <button
                onClick={handleApply}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;