import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";

export default function ProgramHeader({ searchQuery, setSearchQuery, countries, course, levels, categories }) {
    const [intake, setIntake] = useState("");
    const [year, setYear] = useState("");
    const [nationality, setNationality] = useState("");
    const [state, setState] = useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [programLevelSearch, setProgramLevelSearch] = useState("");
    const [isProgramLevelOpen, setIsProgramLevelOpen] = useState(false);
    const programLevelRef = useRef(null);

    // Advanced filter states
    const [selectedProgramLevels, setSelectedProgramLevels] = useState([]);
    const [country, setCountry] = useState("United States of America");
    const [provinceState, setProvinceState] = useState("");
    const [studyArea, setStudyArea] = useState("");
    const [disciplineArea, setDisciplineArea] = useState("");
    const [duration, setDuration] = useState("");
    const [eslAvailable, setEslAvailable] = useState(false);

    // Requirements states
    const [pte, setPte] = useState(false);
    const [toefl, setToefl] = useState(false);
    const [ielts, setIelts] = useState(false);
    const [det, setDet] = useState(false);
    const [sat, setSat] = useState(false);
    const [act, setAct] = useState(false);
    const [gre, setGre] = useState(false);
    const [gmat, setGmat] = useState(false);
    const [withoutEnglish, setWithoutEnglish] = useState(false);
    const [withoutGRE, setWithoutGRE] = useState(false);
    const [withoutGMAT, setWithoutGMAT] = useState(false);
    const [withoutMaths, setWithoutMaths] = useState(false);
    const [stemPrograms, setStemPrograms] = useState(false);

    console.log(duration)
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (programLevelRef.current && !programLevelRef.current.contains(event.target)) {
                setIsProgramLevelOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        console.log({
            searchQuery, intake, year, nationality, state,
            selectedProgramLevels, country, provinceState, studyArea,
            disciplineArea, duration, eslAvailable
        });
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
    };

    const toggleProgramLevel = (value) => {
        setSelectedProgramLevels(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const removeProgramLevel = (value) => {
        setSelectedProgramLevels(prev => prev.filter(item => item !== value));
    };

    const clearAllProgramLevels = () => {
        setSelectedProgramLevels([]);
        setProgramLevelSearch("");
    };

    const filteredProgramLevels = levels.filter(option =>
        option.label.toLowerCase().includes(programLevelSearch.toLowerCase())
    );

    {/* Study Area */ }
    const options = categories?.map((item) => ({
        value: item.label,
        label: item.label,
    }));

    const programLevelOptions = levels.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    const DurationOption = [{ value: "0-1 Years" }, { value: "1-2 Years" }, { value: "2-3 Years" }, { value: "3-4 Years" }, { value: "4 or Above Years" }].map((item) => ({
        value: item.value,
        label: item.value
    }))

    // Custom Select Styles
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#f9fafb",
            borderColor: state.isFocused ? "#f97316" : "#e5e7eb",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#f97316",
            },
            borderRadius: 0,
            minHeight: "40px",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#ff8243"
                : state.isFocused
                    ? "#f9fafb"
                    : "#fff",
            color: state.isSelected ? "#fff" : "#111827",
            cursor: "pointer",
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
    };

    return (
        <div className="bg-white shadow-sm max-w-[1400px] mx-auto overflow-hidden">
            <div className="p-5">
                {/* Main Filter Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_0.8fr_1.2fr_1.2fr_auto] gap-4 items-end">
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
                                onChange={(e) => setSearchQuery(e.target.value)}
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

                    {/* Intake */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Intake
                        </label>
                        <div className="relative w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-orange-500 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <select
                                className="w-full py-2.5 px-3 pl-10 pr-9 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-none appearance-none cursor-pointer hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 focus:bg-white outline-none transition-all duration-200"
                                value={intake}
                                onChange={(e) => setIntake(e.target.value)}
                            >
                                <option value="">All Intakes</option>
                                <option value="jan">January</option>
                                <option value="feb">February</option>
                                <option value="mar">March</option>
                                <option value="apr">April</option>
                                <option value="may">May</option>
                                <option value="jun">June</option>
                                <option value="jul">July</option>
                                <option value="aug">August</option>
                                <option value="sep">September</option>
                                <option value="oct">October</option>
                                <option value="nov">November</option>
                                <option value="dec">December</option>
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
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

                    {/* Nationality */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Nationality
                        </label>
                        <div className="relative w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-orange-500 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <select
                                className="w-full py-2.5 px-3 pl-10 pr-9 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-none appearance-none cursor-pointer hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 focus:bg-white outline-none transition-all duration-200"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                            >
                                {countries?.map((item) => (
                                    <option key={item?.code} value={item?.value}>
                                        {item?.label}
                                    </option>
                                ))}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* State */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            State
                        </label>
                        <div className="relative w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-orange-500 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <select
                                className="w-full py-2.5 px-3 pl-10 pr-9 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-none appearance-none cursor-pointer hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 focus:bg-white outline-none transition-all duration-200"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="">Student's State</option>
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 border-none cursor-pointer whitespace-nowrap shadow-sm hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-orange-500/20 active:translate-y-0 transition-all duration-200"
                            onClick={handleSearch}
                        >
                            <span>Search Programs</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Advanced Filter Toggle */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={toggleAdvancedFilters}
                        className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors duration-200"
                    >
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ${showAdvancedFilters ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Advanced Search
                        <span className="text-xs text-gray-400">+</span>
                    </button>
                </div>

                {/* Advanced Filters - Animated Section */}
                <div
                    className={`overflow-visible transition-all duration-500 ease-in-out ${showAdvancedFilters ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="border-t border-gray-200 pt-6">
                        {/* Three Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Column 1: Program Level */}
                            <div className="flex flex-col gap-2">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Program Level</h3>
                                <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-2">
                                    {programLevelOptions.map((option) => (
                                        <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedProgramLevels.includes(option.value)}
                                                onChange={() => toggleProgramLevel(option.value)}
                                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Column 2: Other Filters */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Other Filters</h3>

                                {/* Country */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Country
                                    </label>
                                    <Select
                                        options={countries?.map((item) => ({
                                            value: item.label,
                                            label: item.label,
                                        }))}
                                        value={countries
                                            ?.map((item) => ({
                                                value: item.label,
                                                label: item.label,
                                            }))
                                            .find((option) => option.value === country)}
                                        onChange={(selected) => setCountry(selected?.value || "")}
                                        placeholder="Select Country"
                                        isSearchable
                                        isClearable
                                        styles={customSelectStyles}
                                        menuPortalTarget={document.body}
                                    />
                                </div>

                                {/* Province | State */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Province | State
                                    </label>

                                    <input
                                        type="text"
                                        value={provinceState}
                                        onChange={(e) => setProvinceState(e.target.value)}
                                        placeholder="Enter Province | State"
                                        className="w-full py-2 px-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-none placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 focus:bg-white"
                                    />
                                </div>

                                {/* Study Area */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Category
                                    </label>
                                    <Select
                                        options={options}
                                        value={options?.find((option) => option.value === studyArea)}
                                        onChange={(selected) => setStudyArea(selected?.value || "")}
                                        placeholder="Select Category"
                                        isSearchable
                                        isClearable
                                        styles={customSelectStyles}
                                        menuPortalTarget={document.body}
                                    />
                                </div>

                             

                                {/* Duration */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Duration
                                    </label>
                                    <Select
                                        options={DurationOption}
                                        value={DurationOption.find((option) => option.value === duration)}
                                        onChange={(selected) => setDuration(selected?.value || "")}
                                        placeholder="Select Duration"
                                        isSearchable
                                        isClearable
                                        styles={customSelectStyles}
                                        menuPortalTarget={document.body}
                                    />
                                </div>


                            </div>

                            {/* Column 3: Requirements */}
                            <div className="flex flex-col gap-2">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h3>
                                <div className="flex flex-col gap-1.5">
                                    {[
                                        { id: 'pte', label: 'PTE', state: pte, setState: setPte },
                                        { id: 'toefl', label: 'TOEFL iBT', state: toefl, setState: setToefl },
                                        { id: 'ielts', label: 'IELTS', state: ielts, setState: setIelts },
                                        { id: 'det', label: 'DET', state: det, setState: setDet },
                                        { id: 'sat', label: 'SAT', state: sat, setState: setSat },
                                        { id: 'act', label: 'ACT', state: act, setState: setAct },
                                        { id: 'gre', label: 'GRE', state: gre, setState: setGre },
                                        { id: 'gmat', label: 'GMAT', state: gmat, setState: setGmat },
                                        { id: 'without-english', label: 'Without English Proficiency', state: withoutEnglish, setState: setWithoutEnglish },
                                        { id: 'without-gre', label: 'Without GRE', state: withoutGRE, setState: setWithoutGRE },
                                        { id: 'without-gmat', label: 'Without GMAT', state: withoutGMAT, setState: setWithoutGMAT },
                                        { id: 'without-maths', label: 'Without Maths', state: withoutMaths, setState: setWithoutMaths },
                                        { id: 'stem-programs', label: 'STEM Programs', state: stemPrograms, setState: setStemPrograms },
                                    ].map(({ id, label, state, setState }) => (
                                        <label key={id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={state}
                                                onChange={(e) => setState(e.target.checked)}
                                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Advanced Search Buttons */}
                        <div className="mt-8 flex gap-3">
                            <button
                                className="px-6 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                            <button
                                className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                onClick={() => {
                                    setSelectedProgramLevels([]);
                                    setProgramLevelSearch("");
                                    setCountry("United States of America");
                                    setProvinceState("");
                                    setStudyArea("");
                                    setDisciplineArea("");
                                    setDuration("");
                                    setPte(false);
                                    setToefl(false);
                                    setIelts(false);
                                    setDet(false);
                                    setSat(false);
                                    setAct(false);
                                    setGre(false);
                                    setGmat(false);
                                    setWithoutEnglish(false);
                                    setWithoutGRE(false);
                                    setWithoutGMAT(false);
                                    setWithoutMaths(false);
                                    setStemPrograms(false);
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}