import React, { useState, useMemo } from "react";
import Select from "react-select";

// Custom styles for react-select
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#F9FAFB",
    borderColor: state.isFocused ? "#f26d44" : "#e5e7eb",
    borderWidth: "1px",
    borderRadius: "0",
    minHeight: "38px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(242, 109, 68, 0.1)" : "none",
    "&:hover": {
      borderColor: "#f26d44",
      backgroundColor: "#F3F4F6",
    },
    fontSize: "14px",
    transition: "all 0.2s ease",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "rgba(242, 109, 68, 0.1)"
      : state.isFocused
        ? "rgba(242, 109, 68, 0.05)"
        : "transparent",
    color: state.isSelected ? "#f26d44" : "#1f2937",
    padding: "8px 12px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "rgba(242, 109, 68, 0.15)",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
    fontSize: "14px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
    fontSize: "14px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#6b7280",
    padding: "8px",
    "&:hover": {
      color: "#f26d44",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#6b7280",
    padding: "8px",
    "&:hover": {
      color: "#f26d44",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
    marginTop: "4px",
    zIndex: 999,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "300px",
    padding: "4px 0",
  }),
  input: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

// SVG Icons
const FilterListIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PublicIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SchoolIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const CategoryIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const WorkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MenuBookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ClearIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ProgramFilters({
  filters,
  handleFilterChange,
  clearFilters,
  getActiveFilterCount,
  countries,
  universities,
  categories,
  studyModes,
  levels,
  showFilters,
  setShowFilters,
  isCleared,
  setIsCleared,
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [gradingSystem, setGradingSystem] = useState("");
  const [score, setScore] = useState("");
  const [otherExam, setOtherExam] = useState("");
  const [otherExamScore, setOtherExamScore] = useState("");
  const [fee, setFee] = useState(50000);


  const examOptions = [
    { value: "none", label: "I don't have this" },
    { value: "later", label: "I will provide this later" },
    { value: "ielts", label: "IELTS" },
    { value: "toefl", label: "TOEFL" },
    { value: "pte", label: "PTE" },
    { value: "det", label: "DET (Duolingo English Test)" },
  ];

  const otherExamOptions = [
    { value: "sat", label: "SAT" },
    { value: "act", label: "ACT" },
    { value: "gre", label: "GRE" },
    { value: "gmat", label: "GMAT" },
  ];

  const [englishExam, setEnglishExam] = useState("");
  const [scores, setScores] = useState({
    listening: "",
    reading: "",
    writing: "",
    speaking: "",
    overall: "",
  });

  const handleScoreChange = (e) => {
    const { name, value } = e.target;

    setScores((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Sample user profile data (replace with your actual context)
  const allProfile = {
    profile: {
      preferences: {
        level: "Postgraduate",
        preferredCountries: ["United States"],
        preferredCourse: ["Computer Science"],
      },
    },
  };

  // Determine selected level with preference fallback
  const selectedLevel = useMemo(() => {
    if (isCleared) return null;
    if (filters.level) return filters.level;

    const preferredLevel = allProfile?.profile?.preferences?.level?.toLowerCase();
    if (preferredLevel) {
      const matchedLevel = levels?.find(
        item => item.label?.toLowerCase() === preferredLevel
      );
      return matchedLevel?.value || null;
    }
    return null;
  }, [isCleared, filters.level, allProfile, levels]);

  // Helper to get selected option object
  const getSelectedOption = (options, value) => {
    if (!options || !value) return null;
    return options.find(opt => opt.value === value) || null;
  };

  // Reusable Select Component
  const FilterSelect = ({
    label,
    icon: Icon,
    options = [],
    value,
    onChange,
    placeholder,
    isClearable = true,
    noOptionsMessage = "No options available"
  }) => {
    const selectedOption = getSelectedOption(options, value);

    const inputClass =
      "w-full h-[52px] px-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";

    return (
      <div className="flex flex-col gap-1.5 ">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {label}
          </label>
        </div>
        <Select
          options={options}
          value={selectedOption}
          onChange={(option) => onChange(option ? option.value : "")}
          placeholder={placeholder}
          isClearable={isClearable}
          styles={customSelectStyles}
          noOptionsMessage={() => noOptionsMessage}
          isSearchable={true}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
    );
  };

  // Filter Content Component
  const FilterContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50/50 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterListIcon className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-sm">Filter Programs</span>
        </div>
        {mobileDrawerOpen && (
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Filters Body */}
      <div className="p-4 flex-1  flex flex-col gap-4">
        {/* Country Filter */}
        <FilterSelect
          label="Country"
          icon={PublicIcon}
          options={countries}
          value={isCleared ? "" : filters.country ||
            countries?.find(
              item => item.label?.toLowerCase() ===
                allProfile?.profile?.preferences?.preferredCountries?.[0]?.toLowerCase()
            )?.value || ""
          }
          onChange={(value) => {
            setIsCleared(false);
            handleFilterChange("country", value);
          }}
          placeholder="Select country"
        />

        {/* University Filter */}
        <FilterSelect
          label="University"
          icon={SchoolIcon}
          options={universities}
          value={filters.university}
          onChange={(value) => handleFilterChange("university", value)}
          placeholder="Select university"
        />

        {/* Category Filter */}
        <FilterSelect
          label="Category"
          icon={CategoryIcon}
          options={categories}
          value={isCleared ? "" : filters.category ||
            categories?.find(
              item => item.label?.toLowerCase() ===
                allProfile?.profile?.preferences?.preferredCourse?.[0]?.toLowerCase()
            )?.value || ""
          }
          onChange={(value) => {
            setIsCleared(false);
            handleFilterChange("category", value);
          }}
          placeholder="Select category"
        />

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2">
          {/* Grading System */}
          <div className="h-full grid grid-cols-1">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Grading System (UG)

            </label>

            <span className="w-full py-2 rounded-md border border-gray-200 bg-gray-50 px-4 text-base placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10">
              Out of 100
            </span>
          </div>

          {/* Score */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Score (UG)
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full py-2 rounded-md border border-gray-200 bg-gray-50 px-4 text-base placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
            />
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2">
          {/* Grading System */}
          <div className="h-full grid grid-cols-1">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Grading System (12th)


            </label>

            <span className="w-full py-2 rounded-md border border-gray-200 bg-gray-50 px-4 text-base placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10">
              Out of 100
            </span>
          </div>

          {/* Score */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Score (12th)
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full py-2 rounded-md border border-gray-200 bg-gray-50 px-4 text-base placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Backlogs */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800">
              Backlogs
            </label>

            <input
              type="number"
              placeholder="Enter"
              className="w-full py-2 px-4 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-md placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
            />
          </div>

          {/* Work Experience */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800">
              Work Experience (Years)
            </label>

            <input
              type="number"
              placeholder="Enter"
              className="w-full py-2 px-4 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-md placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800">English Proficiency Exam
          </label>

          <Select
            options={examOptions}
            placeholder="Select"
            value={examOptions.find((item) => item.value === englishExam)}
            onChange={(option) => {
              setEnglishExam(option?.value || "");
              setScores({
                listening: "",
                reading: "",
                writing: "",
                speaking: "",
                overall: "",
              });
            }}
            isClearable
            styles={customSelectStyles}
          />
        </div>
        <div
          className={`transition-all duration-500  overflow-hidden ${englishExam &&
            !["none", "later"].includes(englishExam)
            ? "max-h-[700px] opacity-100 mt-1"
            : "max-h-0 opacity-0"
            }`}
        >

          {["ielts", "toefl", "pte"].includes(englishExam) && (
            <div className=" space-y-5">

              <div className="grid grid-cols-2 gap-4">

                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium">
                    Listening <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="listening"
                    value={scores.listening}
                    onChange={handleScoreChange}
                    placeholder="Enter"
                    className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Reading <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="reading"
                    value={scores.reading}
                    onChange={handleScoreChange}
                    placeholder="Enter"
                    className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Writing <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="writing"
                    value={scores.writing}
                    onChange={handleScoreChange}
                    placeholder="Enter"
                    className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Speaking <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="speaking"
                    value={scores.speaking}
                    onChange={handleScoreChange}
                    placeholder="Enter"
                    className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>

              </div>



            </div>
          )}


          {["ielts", "toefl", "pte", "det"].includes(englishExam) && (
            <div>
              <label className="block  text-sm font-medium">
                Overall <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="overall"
                value={scores.overall}
                onChange={handleScoreChange}
                placeholder="Enter"
                className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ">
          <label className="text-sm font-medium text-gray-800">
            Other Exams
          </label>

          <Select
            options={otherExamOptions}
            placeholder="Select"
            value={otherExamOptions.find(
              (item) => item.value === otherExam
            )}
            onChange={(option) => {
              setOtherExam(option?.value || "");
              setOtherExamScore("");
            }}
            isClearable
            styles={customSelectStyles}
          />
        </div>


        <div
          className={`overflow-hidden transition-all duration-500 ${otherExam
            ? "max-h-[200px] opacity-100 translate-y-0 "
            : "max-h-0 opacity-0 -translate-y-2"
            }`}
        >
          <div>
            <label className="block mb-2 text-sm font-medium">
              Overall Score <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              placeholder="Enter"
              value={otherExamScore}
              onChange={(e) => setOtherExamScore(e.target.value)}
              className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
            />
          </div>
        </div>

        {/* Study Mode Filter */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <WorkIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Study Mode
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {studyModes.map((mode) => (
              <button
                key={mode.value}
                className={`text-left text-sm font-medium px-3 py-1.5 border transition-all duration-200 ${filters.studyMode === mode.value
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-orange-500 hover:bg-orange-50/30"
                  }`}
                onClick={() => handleFilterChange("studyMode", filters.studyMode === mode.value ? "" : mode.value)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MenuBookIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Program Level
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {levels.map((level) => (
              <button
                key={level.value}
                className={`text-xs font-medium px-2.5 py-1 border transition-all duration-200 ${selectedLevel === level.value
                  ? "bg-orange-50 text-orange-500 border-orange-500"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-orange-500 hover:bg-orange-50/30"
                  }`}
                onClick={() => handleFilterChange("level", filters.level === level.value ? "" : level.value)}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Active Filters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {filters.country && (
                <div className="flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-medium px-2 py-0.5">
                  <span>{countries.find(c => c.value === filters.country)?.label || filters.country}</span>
                  <button
                    onClick={() => handleFilterChange("country", "")}
                    className="hover:text-orange-700 transition-colors"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.studyMode && (
                <div className="flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-medium px-2 py-0.5">
                  <span>{filters.studyMode}</span>
                  <button
                    onClick={() => handleFilterChange("studyMode", "")}
                    className="hover:text-orange-700 transition-colors"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.level && (
                <div className="flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-medium px-2 py-0.5">
                  <span>{levels.find(l => l.value === filters.level)?.label || filters.level}</span>
                  <button
                    onClick={() => handleFilterChange("level", "")}
                    className="hover:text-orange-700 transition-colors"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.university && (
                <div className="flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-medium px-2 py-0.5">
                  <span>{universities.find(u => u.value === filters.university)?.label || filters.university}</span>
                  <button
                    onClick={() => handleFilterChange("university", "")}
                    className="hover:text-orange-700 transition-colors"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.category && (
                <div className="flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-medium px-2 py-0.5">
                  <span>{categories.find(c => c.value === filters.category)?.label || filters.category}</span>
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className="hover:text-orange-700 transition-colors"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}


        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-orange-600">
              Tuition Fees
            </h3>

            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold">
              ₹ {fee >= 1000 ? `${fee / 1000}k` : fee}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            className="range-slider w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <span>0</span>
            <span>25k</span>
            <span>50k</span>
            <span>75k</span>
            <span>100k</span>
          </div>

          <label className="flex items-center justify-end gap-2 mt-5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              Above 100K
            </span>
          </label>
        </div>
      </div>



      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-between items-center">
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ClearIcon className="w-4 h-4" />
          Clear all
        </button>
        <button
          onClick={() => {
            if (mobileDrawerOpen) setMobileDrawerOpen(false);
          }}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Count active filters for mobile badge
  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[320px] flex-shrink-0 sticky top-4 z-30">
        <div className="border border-gray-200 bg-white shadow-md overflow-hidden h-full flex flex-col">
          <FilterContent />
        </div>
      </div>

      {/* Mobile: Filter Button + Drawer */}
      <div className="lg:hidden w-full">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <FilterListIcon className="w-4 h-4" />
            <span>Filters</span>
          </div>
          {activeFilterCount > 0 && (
            <span className="bg-white text-orange-500 w-5 h-5 flex items-center justify-center text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile Drawer - Overlay */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-[320px] h-full bg-white shadow-2xl border-l border-gray-200 animate-slideInRight">
              <FilterContent />
            </div>
          </div>
        )}
      </div>

      {/* CSS for mobile animation */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}