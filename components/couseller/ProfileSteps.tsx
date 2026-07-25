"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, GraduationCap, Briefcase, FileCheck, Edit2, Save, Loader2 } from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { toast } from "sonner";

interface ProfileTabsProps {
  studentId: string;
  user: any;
  profile: any;
  countriesList: any[];
  onUpdate: () => void; // Callback to refresh parent data
}

const TABS = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "academic", label: "Academic Qualifications", icon: GraduationCap },
  { id: "work", label: "Work Experience", icon: Briefcase },
  { id: "tests", label: "Tests", icon: FileCheck },
];

export default function ProfileTabs({ studentId, user, profile, countriesList, onUpdate }: ProfileTabsProps) {

  const [activeInnerTab, setActiveInnerTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const TAB_ORDER = ["personal", "academic", "work", "tests"];
  const goToNextStep = () => {
    const currentIndex = TAB_ORDER.indexOf(activeInnerTab);

    if (currentIndex < TAB_ORDER.length - 1) {
      setActiveInnerTab(TAB_ORDER[currentIndex + 1]);
    }
  };

  // const searchParams = ""

  const activetab = ""


  useEffect(() => {
    if (activetab === "academic") {
      setActiveInnerTab("academic");
    }
    if (activetab === "work") {
      setActiveInnerTab("work")
    }
    if (activetab === "tests") {
      setActiveInnerTab("tests")
    }
  }, [activetab]);

  const goToPreviousStep = () => {
    const currentIndex = TAB_ORDER.indexOf(activeInnerTab);

    if (currentIndex > 0) {
      setActiveInnerTab(TAB_ORDER[currentIndex - 1]);
    }
  };


  useEffect(() => {
    if (isEditing) {
      setFormData({
        personal: {
          Firstname: user?.Firstname || "",
          Middlename: user?.Middlename || "",
          Lastname: user?.Lastname || "",
          email: user?.email || "",
          phone: user?.phone || "",
          dateOfBirth: user?.dateOfBirth || "",
          gender: user?.gender || "",
          maritalStatus: user?.maritalStatus || "",
          firstLanguage: user?.firstLanguage || "",
          nationality: user?.nationality || "",
          familyDetails: user?.familyDetails
        },
        academic: {
          highestAcademic: profile?.highestAcademic || {},
          educationHistory: profile?.educationHistory || [],
        },
        work: profile?.workExperience || []

      });
    }
  }, [isEditing, user, profile]);

  console.log(formData)

  return (
    <div className="bg-white border-2 border-gray-200 overflow-hidden">
      <div className="flex items-center justify-start gap-2 overflow-x-auto hide-scrollbar border-b bg-gray-50 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveInnerTab(tab.id);
              setIsEditing(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-all whitespace-nowrap ${activeInnerTab === tab.id
              ? "bg-[#F26D44] text-white shadow"
              : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="p-4 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeInnerTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >


            {activeInnerTab === "personal" && (
              <PersonalInfoTab
                user={user}
                profile={profile}
                countriesList={countriesList}
                onSave={async (data) => {
                  const payload = {
                    Firstname: data.Firstname,
                    Middlename: data.Middlename,
                    Lastname: data.Lastname,
                    phone: data.phone,
                    dateOfBirth: data.dateOfBirth,
                    gender: data.gender,
                    maritalStatus: data.maritalStatus,
                    firstLanguage: data.firstLanguage,
                    nationality: data.nationality,
                    currentAddress: data.currentAddress,
                    permanentAddress: data.permanentAddress,
                    passportNumber: data.passportNumber,
                    passportDetail: {
                      issueDate: data.passportIssueDate || user.passportDetail?.issueDate,
                      expiryDate: data.passportExpiry || user.passportDetail?.expiryDate,
                      issueCountry: data.passportIssueCountry || user.passportDetail?.issueCountry
                    },
                    // ADD THIS LINE TO SAVE FAMILY DETAILS
                    familyDetails: data.familyDetails
                  };
                  await axiosInstance.put(`/users/${studentId}`, payload);
                  toast.success("Personal information updated");
                  onUpdate();
                }}
              />
            )}

            {activeInnerTab === "academic" && (
              <AcademicQualificationTab
                profileData={profile}
                countries={countriesList}
                onSave={async (payload) => {
                  await axiosInstance.put(`/users/${studentId}`, payload);
                  toast.success("Education information saved");
                  onUpdate(); // Refresh parent data
                }}
              />
            )}

            {activeInnerTab === "work" && (
              <WorkExperienceTab
                data={profile?.workExperience || []}
                onSave={async (val) => {
                  await axiosInstance.put(`/users/${studentId}`, {
                    "workExperience": val
                  });
                  toast.success("Work experience saved");
                  onUpdate();
                }}
              />
            )}

            {activeInnerTab === "tests" && (
              <TestsTab
                data={{
                  ielts: JSON?.parse(profile?.ielts) || {},
                  toefl: JSON?.parse(profile?.toefl) || {},
                  gre: JSON?.parse(profile?.gre) || {},
                  sat: JSON?.parse(profile?.sat) || {},
                  gmat: JSON?.parse(profile?.gmat) || {},
                  pte: JSON?.parse(profile?.pte) || {},
                }}
                onSave={async (val) => {
                  await axiosInstance.put(`/users/${studentId}`, {
                    "ielts": val.ielts,
                    "toefl": val.toefl,
                    "gre": val.gre,
                    "sat": val.sat,
                    "gmat": val.gmat,
                    "pte": val.pte
                  });
                  toast.success("Test scores saved");
                  onUpdate();
                }}
              />
            )}
          </motion.div>
          {/* <div className="flex justify-between mt-3 pt-4 ">
            <button
              onClick={goToPreviousStep}
              disabled={activeInnerTab === TAB_ORDER[0]}
              className="px-4 py-2 bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={goToNextStep}
              disabled={activeInnerTab === TAB_ORDER[TAB_ORDER.length - 1]}
              className="px-4 py-2 bg-[#F26D44] text-white hover:bg-[#e45f35] disabled:opacity-50"
            >
              Continue to Next
            </button>
          </div> */}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useMemo } from "react";

interface Props {
  profileData: any;
  countries: any[];
  onSave: (data: any) => Promise<void>;
}

export function AcademicQualificationTab({ profileData, countries, onSave }: Props) {
  const [formData, setFormData] = useState<any>({});
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    // FIX 1: Ensure we filter out null/undefined items when initializing
    const safeHistory = (profileData?.educationHistory || []).filter((item: any) => item != null);

    setFormData({
      highestAcademic: profileData?.highestAcademic || {},
      educationHistory: safeHistory,
    });
  }, [profileData]);

  const highestLevel = formData?.highestAcademic?.highestEducationLevel || "";

  const educationFlow = useMemo(
    () => ({
      Postgraduate: ["Postgraduate", "Undergraduate", "Grade 12", "Grade 10"],
      Undergraduate: ["Undergraduate", "Grade 12", "Grade 10"],
      Diploma: ["UG Diploma / Certificate", "Grade 12", "Grade 10"],
      "Grade 12": ["Grade 12", "Grade 10"],
      "Grade 10": ["Grade 10"],
    }),
    []
  );

  const visibleSections = educationFlow[highestLevel as keyof typeof educationFlow] || [];

  const handleSectionSave = async (sectionName: string, sectionData: any) => {
    let payload: any = {};

    if (sectionName === 'summary') {
      payload = { "highestAcademic": sectionData };
    } else if (sectionName === 'education') {
      // FIX: Filter out nulls, but keep entries that have ANY meaningful data 
      // (not just institution/degree). Location data is also meaningful.
      const validData = (sectionData || []).filter((item: any) => {
        if (!item) return false;
        // Check if at least one significant field is filled
        return item.institutionName || item.degreeName || item.country || item.state || item.city || item.board;
      });

      console.log("Saving Education Payload:", validData); // Debugging log
      payload = { "educationHistory": validData };
    }

    await onSave(payload);
    setEditingSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionName);
      return newSet;
    });
  };

  const toggleEditSection = (sectionName: string) => {
    setEditingSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  const updateHighestAcademic = (field: string, value: any) => {
    // FIX 3: Create a safe copy of history excluding nulls
    const currentHistory = (formData.educationHistory || []).filter((item: any) => item != null);
    let educationHistory = [...currentHistory];

    if (field === "highestEducationLevel") {
      const levels = educationFlow[value as keyof typeof educationFlow] || [];

      educationHistory = levels.map((level) => {
        // FIX 4: Safe find - 'e' is guaranteed not to be null because we filtered above
        const existing = educationHistory.find(
          (e: any) => e.educationLevel === level
        );

        return (
          existing || {
            educationLevel: level,
            institutionName: "",
            degreeName: "",
            country: "",
            state: "",
            city: "",
            gradingScheme: "",
            startDate: "",
            endDate: "",
          }
        );
      });
    }

    setFormData((prev: any) => ({
      ...prev,
      highestAcademic: {
        ...prev.highestAcademic,
        [field]: value,
      },
      educationHistory,
    }));
  };

  const updateEducation = (
    educationLevel: string, // Note: In your JSX, you sometimes pass index here for custom items, see below
    field: string,
    value: any
  ) => {
    setFormData((prev: any) => {
      // FIX 5: Filter nulls before processing
      const history = (prev.educationHistory || []).filter((item: any) => item != null);

      // If educationLevel is a number (index), handle custom dynamic fields differently
      // But based on your current logic, you seem to pass level string usually. 
      // However, in your JSX for custom items, you passed idx. Let's make this robust.

      let existingIndex = -1;

      // Try to find by level first
      if (typeof educationLevel === 'string') {
        existingIndex = history.findIndex((edu: any) => edu.educationLevel === educationLevel);
      }

      // If not found by string, and it looks like an index (from your custom add logic potentially), 
      // we might need to adjust how updateEducation is called. 
      // For now, assuming standard flow:

      if (existingIndex >= 0) {
        history[existingIndex] = {
          ...history[existingIndex],
          [field]: value,
        };
      } else {
        // If it's a new item or not found, push. 
        // Note: Your custom add logic adds { educationLevel: "Other Certificate", isNew: true }
        // If you are updating a custom item, ensure you identify it correctly.
        // For simplicity, if we can't find it by level, we might need to look by reference or index.
        // Given the error, let's stick to fixing the null access.

        // Fallback: if educationLevel is actually an index (number) passed from custom renderer
        if (typeof educationLevel === 'number') {
          if (history[educationLevel]) {
            history[educationLevel] = { ...history[educationLevel], [field]: value };
          }
        } else {
          // Add new if truly missing
          history.push({
            educationLevel: typeof educationLevel === 'string' ? educationLevel : "Unknown",
            [field]: value,
          });
        }
      }

      return {
        ...prev,
        educationHistory: history,
      };
    });
  };

  const MAX_CUSTOM_EDUCATION = 2;

  const addNewEducation = () => {
    const currentHistory = (formData.educationHistory || []).filter((item: any) => item != null);
    const customCount = currentHistory.filter(
      (e) => !visibleSections.includes(e.educationLevel)
    ).length;

    if (customCount >= MAX_CUSTOM_EDUCATION) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      educationHistory: [
        ...currentHistory, // Use cleaned history
        {
          educationLevel: "Other Certificate",
          isNew: true,
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    const currentHistory = (formData.educationHistory || []).filter((item: any) => item != null);
    const newHistory = [...currentHistory];
    newHistory.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, educationHistory: newHistory }));
  };

  const SectionHeader = ({ title, sectionName }: { title: string; sectionName: string }) => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (editingSections.has(sectionName)) {
            let sectionData: any = {};
            if (sectionName === 'summary') {
              sectionData = formData.highestAcademic;
            } else if (sectionName === 'education') {
              // Filter nulls here too
              const validData = (formData.educationHistory || []).filter(
                (edu: any) => edu != null && (edu.institutionName || edu.degreeName)
              );
              sectionData = validData;
            }
            handleSectionSave(sectionName, sectionData);
          } else {
            toggleEditSection(sectionName);
          }
        }}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all  ${editingSections.has(sectionName)
          ? "bg-gradient-to-r from-[#F26D44] to-orange-600 text-white shadow-lg shadow-[#F26D44]/25"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
      >
        {editingSections.has(sectionName) ? (
          <><Save size={14} /> Save</>
        ) : (
          <><Edit2 size={14} /> Edit</>
        )}
      </motion.button>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Summary Section */}
      <div className="bg-gray-50 p-4  border border-gray-200">
        <SectionHeader title="Education Summary" sectionName="summary" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Country Of Education
            </label>
            {editingSections.has("summary") ? (
              <select
                className="w-full border border-gray-300  p-2.5 text-sm focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] outline-none"
                value={formData?.highestAcademic?.countryOfEducation || ""}
                onChange={(e) => updateHighestAcademic("countryOfEducation", e.target.value)}
              >
                <option value="">Select Country</option>
                {countries.map((c: any) => (
                  <option key={c._id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            ) : (
              <div className="w-full bg-white border border-gray-200  p-2.5 text-sm text-gray-700">
                {formData?.highestAcademic?.countryOfEducation || "N/A"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Highest Level Of Education
            </label>
            {editingSections.has("summary") ? (
              <select
                className="w-full border border-gray-300  p-2.5 text-sm focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] outline-none"
                value={highestLevel}
                onChange={(e) => updateHighestAcademic("highestEducationLevel", e.target.value)}
              >
                <option value="">Select Level</option>
                <option>Postgraduate</option>
                <option>Undergraduate</option>
                <option>Diploma</option>
                <option>Grade 12</option>
                <option>Grade 10</option>
              </select>
            ) : (
              <div className="w-full bg-white border border-gray-200  p-2.5 text-sm text-gray-700 capitalize">
                {highestLevel || "N/A"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4  border border-gray-200">
        <SectionHeader title="Education History" sectionName="education" />
        <div className="space-y-4">
          {visibleSections.map((level, index) => {
            // FIX 6: Safe access during render
            const cleanHistory = (formData?.educationHistory || []).filter((item: any) => item != null);
            const education = cleanHistory.find(
              (e: any) => e?.educationLevel === level
            ) || { educationLevel: level };

            return (
              <EducationCard
                key={level}
                level={level}
                education={education}
                isEditing={editingSections.has("education")}
                countries={countries}
                onChange={(field, val) =>
                  updateEducation(level, field, val)
                }
                onRemove={() => removeEducation(index)}
                canRemove={cleanHistory.length > 1}
              />
            );
          })}

          {editingSections.has("education") && (formData?.educationHistory || []).filter((item: any) => item != null).map((edu: any, idx: number) => {
            if (!edu.educationLevel || visibleSections.includes(edu.educationLevel)) return null;
            return (
              <EducationCard
                key={`custom-${idx}`}
                level={edu.educationLevel || "Additional Education"}
                education={edu}
                isEditing={true}
                countries={countries}
                // Pass index for custom items so updateEducation knows which one to update if level isn't unique
                onChange={(field, val) => updateEducation(idx, field, val)}
                onRemove={() => removeEducation(idx)}
                canRemove={true}
              />
            );
          })}

          {!editingSections.has("education") && (formData?.educationHistory || []).filter((item: any) => item != null).length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 ">
              <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No education records added</p>
            </div>
          )}
        </div>

        {editingSections.has("education") && (
          <div className="flex justify-center items-center border-2 mt-3 border-dashed border-gray-200 p-4">
            <button
              onClick={addNewEducation}
              className="flex items-center gap-2 px-3 py-1.5 text-base font-medium bg-gray-200 text-gray-700  hover:bg-gray-200 transition"
            >
              <Plus size={14} /> Add Education
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import { Country, State, City } from "country-state-city";
import boards from "@/components/couseller/board.json"

// --- Sub-component for individual education entry ---
function EducationCard({ level, education, isEditing, countries, onChange, onRemove, canRemove }: any) {
  const isSchool = level === "Grade 12" || level === "Grade 10";


  const fields = [
    { label: isSchool ? "School Name" : "Institution Name", key: "institutionName" },
    ...(isSchool
      ? [{ label: "Board", key: "board", type: "board-select" }]
      : [{ label: "Degree Awarded", key: "degreeName" }]),
    { label: "Country", key: "country", type: "country-select" },
    { label: "State", key: "state", type: "state-select" },
    { label: "City", key: "city", type: "city-select" },
    ...(!isSchool ? [{ label: "Grading Scheme", key: "gradingScheme" }] : []),
    { label: isSchool ? "Percentage" : "Percentage", key: "percentage" },
    { label: "Start Date", key: "startDate", type: "month" },
    { label: "End Date", key: "endDate", type: "month" },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  // 1. Get All Countries (Memoized ideally, but okay here for simplicity if list is small)
  // Note: Using the 'countries' prop passed from parent is better if it matches your DB.
  // But for State/City library, we need ISO codes.

  // Find selected country object from the library to get ISO code
  const selectedCountryObj = Country.getAllCountries().find(
    (c) => c.name === education.country
  );

  // Get States based on ISO code
  const states = selectedCountryObj
    ? State.getStatesOfCountry(selectedCountryObj.isoCode)
    : [];

  // Find selected state object
  const selectedStateObj = states.find(
    (s) => s.name === education.state
  );

  // Get Cities based on ISO codes
  const cities =
    selectedCountryObj && selectedStateObj
      ? City.getCitiesOfState(
        selectedCountryObj.isoCode,
        selectedStateObj.isoCode
      )
      : [];


  const boardOptions =
    education.country === "India"
      ? boards[education.state as keyof typeof boards] || []
      : [];

      

      

  return (
    <div className="border border-gray-200 overflow-hidden relative group">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-800">{level}</h4>
        </div>
        {isEditing && canRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((f: any) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              {f.label}
            </label>

            {isEditing ? (
              f.type === "country-select" ? (
                <select
                  className="w-full border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] outline-none"
                  value={education.country || ""}
                  onChange={(e) => {
                    const newCountry = e.target.value;
                    // Update Country
                    onChange(f.key, newCountry);
                    // Reset State and City because they depend on Country
                    onChange("state", "");
                    onChange("city", "");
                  }}
                >
                  <option value="">Select Country</option>
                  {/* Use the countries prop if available, otherwise fallback to library */}
                  {(countries && countries.length > 0 ? countries : Country.getAllCountries()).map((c: any) => (
                    <option key={c._id || c.isoCode || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : f.type === "board-select" && education.country == "India" ? (

                <select
                  className="w-full border border-gray-300 p-2.5 text-sm disabled:bg-gray-100"
                  value={education?.degreeName?.toUpperCase() || ""}
                  onChange={(e) => onChange("degreeName", e.target.value)}
                  disabled={!education.state}
                >
                  <option value="">Select Board</option>

                  {boardOptions.map((board) => (
                    <option key={board} value={board}>
                      {board}
                    </option>
                  ))}
                </select>
              ) : f.type === "state-select" ? (
                <select
                  className="w-full border border-gray-300 p-2.5 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                  value={education.state || ""}
                  onChange={(e) => {
                    const newState = e.target.value;
                    onChange("state", newState);
                    // Reset City because it depends on State
                    onChange("city", "");
                  }}
                  disabled={!education.country || states.length === 0}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              ) : f.type === "city-select" ? (
                <select
                  className="w-full border border-gray-300 p-2.5 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                  value={education.city || ""}
                  onChange={(e) => onChange("city", e.target.value)}
                  disabled={!education.state || cities.length === 0}
                >
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={`${city.name}-${index}`} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              ) : f.type === "month" ? (
                <input
                  type="month"
                  className="w-full border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] outline-none"
                  value={
                    education[f.key]
                      ? new Date(education[f.key]).toISOString().slice(0, 7)
                      : ""
                  }
                  onChange={(e) => onChange(f.key, e.target.value)}
                />
              ) : (
                <input
                  type={f.type || "text"}
                  className="w-full border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] outline-none"
                  value={education[f.key] || ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder={`Enter ${f.label.toLowerCase()}`}
                />
              )
            ) :  (
              <div className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm text-gray-700 min-h-[42px] flex items-center">
                {f.type === "month" ? (
                  formatDate(education[f.key])
                ) : f.type === "board-select" ? (
                  // FIX: Convert to uppercase for display if it's a board field
                  education.degreeName 
                    ? education.degreeName.toUpperCase() 
                    : "N/A"
                ) : (
                  // Default display for other fields
                  education[f.key] || "N/A"
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import {
  Mail, Phone, Calendar, Heart, Languages, Globe,
  Home, MapPin, Hash, CreditCard, CalendarDays
} from "lucide-react";

const Field = ({ label, editingSections, formatDate, displayValue, formData, value, icon: Icon, type = "text", options, disabled = false, onChange, fieldKey, section, error }: any) => {
  const getFieldValue = (fieldKey: string) => {
    if (fieldKey.includes(".")) {
      const [parent, child] = fieldKey.split(".");
      return formData?.[parent]?.[child] || "";
    }

    return formData?.[fieldKey] || "";
  }

  const hasError = error && editingSections.has(section);


  return (
    <div key={fieldKey} className="space-y-2">
      <label className={`text-xs font-medium uppercase tracking-wide ${hasError ? "text-red-500" : "text-gray-500"}`}>
        {label} {error && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${hasError ? "text-red-400" : "text-gray-400"}`} />}

        {editingSections.has(section) ? (
          type === "select" ? (
            <select
              value={getFieldValue(fieldKey) || ""}
              onChange={(e) => onChange(fieldKey, e.target.value)}
              disabled={disabled}
              className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-white border focus:outline-none focus:ring-2 transition-all text-sm ${hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                }`}
            >
              <option value="">Select {label}</option>
              {options?.map((opt: string) => (
                <option key={opt} value={opt} className="capitalize">{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={getFieldValue(fieldKey) || ""}
              onChange={(e) => onChange(fieldKey, e.target.value)}
              disabled={disabled}
              className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-white border focus:outline-none focus:ring-2 transition-all text-sm ${hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                }`}
            />
          )
        ) : (
          <div className={`w-full overflow-hidden ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-gray-50/50 border border-gray-200/60 text-sm text-gray-800 capitalize min-h-[42px] flex items-center ${hasError ? "bg-red-50/10" : ""}`}>
            {type === "date" ? formatDate(value) : displayValue(value)}
          </div>
        )}

        {/* Show Error Message below input if exists */}
        {hasError && (
          <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>
        )}
      </div>
    </div>
  )
};

export function PersonalInfoTab({ user, profile, countriesList, onSave }: any) {
  const [formData, setFormData] = useState<any>({});
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());


  const [errors, setErrors] = useState<Record<string, string>>({});



  useEffect(() => {
    setFormData({
      Firstname: user?.Firstname || "",
      Middlename: user?.Middlename || "",
      Lastname: user?.Lastname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: user?.gender || "",
      maritalStatus: user?.maritalStatus || "",
      firstLanguage: user?.firstLanguage || "",
      nationality: user?.nationality || "",
      currentAddress: profile?.currentAddress,
      permanentAddress: profile && profile?.permanentAddress,
      passportNumber: user?.passportNumber || "",
      passportExpiry: user?.passportDetail?.expiryDate || "",
      passportIssueDate: user?.passportDetail?.issueDate || "",
      passportIssueCountry: user?.passportDetail?.issueCountry || "",
      familyDetails: {
        motherName: user?.familyDetails?.motherName || profile?.familyDetails?.motherName || "",
        motherPhone: user?.familyDetails?.motherPhone || profile?.familyDetails?.motherPhone || "",
        motherOccupation: user?.familyDetails?.motherOccupation || profile?.familyDetails?.motherOccupation || "",
        fatherName: user?.familyDetails?.fatherName || profile?.familyDetails?.fatherName || "",
        fatherPhone: user?.familyDetails?.fatherPhone || profile?.familyDetails?.fatherPhone || "",
        fatherOccupation: user?.familyDetails?.fatherOccupation || profile?.familyDetails?.fatherOccupation || "",
      }
    });
    // Clear errors when data reloads
    setErrors({});
  }, [user, profile]);

  

  const validatePersonalInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.Firstname?.trim()) newErrors["Firstname"] = "First name is required";
    if (!formData.Lastname?.trim()) newErrors["Lastname"] = "Last name is required";
    if (!formData.email?.trim()) newErrors["email"] = "Email is required";
    if (!formData.phone?.trim()) newErrors["phone"] = "Phone number is required";
    if (!formData.dateOfBirth) newErrors["dateOfBirth"] = "Date of birth is required";
    if (!formData.gender) newErrors["gender"] = "Gender is required";
    if (!formData.maritalStatus) newErrors["maritalStatus"] = "Marital status is required";
    if (!formData.nationality) newErrors["nationality"] = "Nationality is required";



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const validateCurrentAddress = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentAddress?.addressLine1?.trim())
      newErrors["currentAddress.addressLine1"] = "Address Line 1 is required";

    if (!formData.currentAddress?.city?.trim())
      newErrors["currentAddress.city"] = "City is required";

    if (!formData.currentAddress?.state?.trim())
      newErrors["currentAddress.state"] = "State is required";

    if (!formData.currentAddress?.postalCode?.trim())
      newErrors["currentAddress.postalCode"] = "Postal Code is required";

    if (!formData.currentAddress?.country?.trim())
      newErrors["currentAddress.country"] = "Country is required";

    setErrors(prev => ({ ...prev, ...newErrors }));

    return Object.keys(newErrors).length === 0;
  };


  const validatePermanentAddress = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.permanentAddress?.addressLine1?.trim())
      newErrors["permanentAddress.addressLine1"] = "Address Line 1 is required";

    if (!formData.permanentAddress?.city?.trim())
      newErrors["permanentAddress.city"] = "City is required";

    if (!formData.permanentAddress?.state?.trim())
      newErrors["permanentAddress.state"] = "State is required";

    if (!formData.permanentAddress?.postalCode?.trim())
      newErrors["permanentAddress.postalCode"] = "Postal Code is required";

    if (!formData.permanentAddress?.country?.trim())
      newErrors["permanentAddress.country"] = "Country is required";

    setErrors(prev => ({ ...prev, ...newErrors }));

    return Object.keys(newErrors).length === 0;
  };


  const validatePassport = () => {
    const newErrors: Record<string, string> = {};

    // Passport Number
    if (!formData.passportNumber?.trim()) {
      newErrors["passportNumber"] = "Passport number is required";
    } else if (!/^[A-Za-z0-9]{6,15}$/.test(formData.passportNumber.trim())) {
      newErrors["passportNumber"] =
        "Passport number must be 6-15 letters/numbers";
    }

    // Issue Date
    if (!formData.passportIssueDate) {
      newErrors["passportIssueDate"] = "Issue date is required";
    }

    // Expiry Date
    if (!formData.passportExpiry) {
      newErrors["passportExpiry"] = "Expiry date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiry = new Date(formData.passportExpiry);
      expiry.setHours(0, 0, 0, 0);

      if (expiry < today) {
        newErrors["passportExpiry"] =
          "Passport has expired. Please enter a valid passport.";
      }
    }

    // Expiry must be after Issue Date
    if (formData.passportIssueDate && formData.passportExpiry) {
      const issue = new Date(formData.passportIssueDate);
      const expiry = new Date(formData.passportExpiry);

      if (expiry <= issue) {
        newErrors["passportExpiry"] =
          "Expiry date must be after issue date";
      }
    }

    // Issue Country
    if (!formData.passportIssueCountry?.trim()) {
      newErrors["passportIssueCountry"] =
        "Issue country is required";
    }

    setErrors(prev => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };


  const validateFamilyDetails = () => {
    const newErrors: Record<string, string> = {};

    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const occupationRegex = /^[A-Za-z ]+$/;

    // Mother Name
    if (!formData.familyDetails?.motherName?.trim()) {
      newErrors["familyDetails.motherName"] = "Mother name is required";
    } else if (!nameRegex.test(formData.familyDetails.motherName.trim())) {
      newErrors["familyDetails.motherName"] =
        "Mother name should contain only letters";
    } else if (
      formData.familyDetails.motherName.trim().length < 2 ||
      formData.familyDetails.motherName.trim().length > 50
    ) {
      newErrors["familyDetails.motherName"] =
        "Mother name must be between 2 and 50 characters";
    }

    // Mother Phone
    if (!formData.familyDetails?.motherPhone?.trim()) {
      newErrors["familyDetails.motherPhone"] = "Mother phone is required";
    } else if (!phoneRegex.test(formData.familyDetails.motherPhone.trim())) {
      newErrors["familyDetails.motherPhone"] =
        "Enter a valid 10-digit mobile number";
    }

    // Mother Occupation
    if (!formData.familyDetails?.motherOccupation?.trim()) {
      newErrors["familyDetails.motherOccupation"] =
        "Mother occupation is required";
    } else if (
      !occupationRegex.test(formData.familyDetails.motherOccupation.trim())
    ) {
      newErrors["familyDetails.motherOccupation"] =
        "Occupation should contain only letters";
    }

    // Father Name
    if (!formData.familyDetails?.fatherName?.trim()) {
      newErrors["familyDetails.fatherName"] = "Father name is required";
    } else if (!nameRegex.test(formData.familyDetails.fatherName.trim())) {
      newErrors["familyDetails.fatherName"] =
        "Father name should contain only letters";
    } else if (
      formData.familyDetails.fatherName.trim().length < 2 ||
      formData.familyDetails.fatherName.trim().length > 50
    ) {
      newErrors["familyDetails.fatherName"] =
        "Father name must be between 2 and 50 characters";
    }

    // Father Phone
    if (!formData.familyDetails?.fatherPhone?.trim()) {
      newErrors["familyDetails.fatherPhone"] = "Father phone is required";
    } else if (!phoneRegex.test(formData.familyDetails.fatherPhone.trim())) {
      newErrors["familyDetails.fatherPhone"] =
        "Enter a valid 10-digit mobile number";
    }

    // Father Occupation
    if (!formData.familyDetails?.fatherOccupation?.trim()) {
      newErrors["familyDetails.fatherOccupation"] =
        "Father occupation is required";
    } else if (
      !occupationRegex.test(formData.familyDetails.fatherOccupation.trim())
    ) {
      newErrors["familyDetails.fatherOccupation"] =
        "Occupation should contain only letters";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };


  const handleSectionSave = async (sectionName: string, sectionData: any) => {

    if (sectionName === "personal") {
      if (!validatePersonalInfo()) return;
    }

    if (sectionName === "currentAddress") {
      if (!validateCurrentAddress()) return;
    }

    if (sectionName === "permanentAddress") {
      if (!validatePermanentAddress()) return;
    }

    if (sectionName === "passport") {
      if (!validatePassport()) return;
    }

    if (sectionName === "familyDetails") {
      if (!validateFamilyDetails()) return;
    }

    await onSave(sectionData);

    setEditingSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionName);
      return newSet;
    });

    setErrors({});
  };

  const toggleEditSection = (sectionName: string) => {
    setEditingSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
    // Clear errors when entering edit mode to give fresh start
    if (sectionName === 'personal') setErrors({});
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const displayValue = (val: any) => val == null || val == undefined || val == "" ? "N/A" : val;

  const updateNested = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const SectionHeader = ({ title, sectionName }: { title: string; sectionName: string }) => (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (editingSections.has(sectionName)) {
            let sectionData: any = {};
            if (sectionName === 'personal') {
              sectionData = {
                Firstname: formData.Firstname,
                Middlename: formData.Middlename,
                Lastname: formData.Lastname,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                maritalStatus: formData.maritalStatus,
                firstLanguage: formData.firstLanguage,
                nationality: formData.nationality,
              };
            } else if (sectionName === 'currentAddress') {
              sectionData = { currentAddress: formData.currentAddress };
            } else if (sectionName === 'permanentAddress') {
              sectionData = { permanentAddress: formData.permanentAddress };
            } else if (sectionName === 'passport') {
              sectionData = {
                passportNumber: formData.passportNumber,
                passportExpiry: formData.passportExpiry,
                passportIssueDate: formData.passportIssueDate,
                passportIssueCountry: formData.passportIssueCountry,
              };
            } else if (sectionName === 'familyDetails') {
              sectionData = { familyDetails: formData.familyDetails };
            }
            handleSectionSave(sectionName, sectionData);
          } else {
            toggleEditSection(sectionName);
          }
        }}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all  ${editingSections.has(sectionName)
          ? "bg-gradient-to-r from-[#F26D44] to-orange-600 text-white shadow-lg shadow-[#F26D44]/25"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
      >
        {editingSections.has(sectionName) ? (
          <><Save size={14} /> Save</>
        ) : (
          <><Edit2 size={14} /> Edit</>
        )}
      </motion.button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white border border-gray-200">
        <SectionHeader title="Personal Information" sectionName="personal" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <Field
            label="First Name"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.Firstname}
            icon={User}
            fieldKey="Firstname"
            section="personal"
            error={errors["Firstname"]} // Pass error prop
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />

          <Field
            label="Middle Name"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.Middlename}
            icon={User}
            fieldKey="Middlename"
            section="personal"
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />

          <Field
            label="Last Name"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.Lastname}
            icon={User}
            fieldKey="Lastname"
            section="personal"
            error={errors["Lastname"]} // Pass error prop
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />

          <Field
            label="Email"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.email}
            icon={Mail}
            fieldKey="email"
            section="personal"
            disabled
            type="email"
            error={errors["email"]} // Pass error prop
            onChange={() => { }}
          />
          <Field
            label="Phone"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.phone}
            icon={Phone}
            fieldKey="phone"
            section="personal"
            type="tel"
            error={errors["phone"]} // Pass error prop
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
          <Field
            label="Date of Birth"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.dateOfBirth}
            icon={Calendar}
            fieldKey="dateOfBirth"
            section="personal"
            type="date"
            error={errors["dateOfBirth"]} // Pass error prop
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
          <Field
            label="Gender"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.gender}
            icon={User}
            fieldKey="gender"
            section="personal"
            type="select"
            options={["male", "female", "other"]}
            error={errors["gender"]} // Pass error prop
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
          <Field
            label="Marital Status"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.maritalStatus}
            icon={Heart}
            fieldKey="maritalStatus"
            section="personal"
            type="select"
            options={["single", "married", "divorced", "widowed"]}
            error={errors["maritalStatus"]} // Pass error prop
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
          <Field
            label="First Language"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.firstLanguage}
            icon={Languages}
            fieldKey="firstLanguage"
            section="personal"
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
          <Field
            label="Nationality"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.nationality}
            icon={Globe}
            fieldKey="nationality"
            section="personal"
            type="select"
            options={countriesList.map((c: any) => c.name)}
            error={errors["nationality"]} // Pass error prop
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
        </div>
      </div>

      {/* Section 2: Current Address */}
      <div className="p-4 bg-white border border-gray-200 ">
        <SectionHeader title="Current Address" sectionName="currentAddress" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field
            label="Address Line 1"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.currentAddress?.addressLine1}
            icon={Home}
            fieldKey="currentAddress.addressLine1"
            section="currentAddress"
            error={errors["currentAddress.addressLine1"]}
            onChange={(k: string, v: any) => updateNested("currentAddress", "addressLine1", v)}
          />
          <Field
            label="Address Line 2"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.currentAddress?.addressLine2}
            icon={Home}
            fieldKey="currentAddress.addressLine2"
            section="currentAddress"
            onChange={(k: string, v: any) => updateNested("currentAddress", "addressLine2", v)}
          />
          <Field
            label="City"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.currentAddress?.city}
            icon={MapPin}
            fieldKey="currentAddress.city"
            section="currentAddress"
            error={errors["currentAddress.city"]}
            onChange={(k: string, v: any) => updateNested("currentAddress", "city", v)}
          />
          <Field
            label="State"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.currentAddress?.state}
            icon={MapPin}
            fieldKey="currentAddress.state"
            section="currentAddress"
            error={errors["currentAddress.state"]}
            onChange={(k: string, v: any) => updateNested("currentAddress", "state", v)}
          />
          <Field
            label="Postal Code"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.currentAddress?.postalCode}
            icon={Hash}
            fieldKey="currentAddress.postalCode"
            section="currentAddress"
            error={errors["currentAddress.postalCode"]}
            onChange={(k: string, v: any) => updateNested("currentAddress", "postalCode", v)}
          />
          <Field
            label="Country"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.currentAddress?.country}
            icon={Globe}
            fieldKey="currentAddress.country"
            section="currentAddress"
            type="select"
            error={errors["currentAddress.country"]}
            options={countriesList.map((c: any) => c.name)}
            onChange={(k: string, v: any) => updateNested("currentAddress", "country", v)}
          />
        </div>
      </div>

      {/* Section 3: Permanent Address */}
      <div className="p-4 bg-white border border-gray-200 ">
        <SectionHeader title="Permanent Address" sectionName="permanentAddress" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field
            label="Address Line 1"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.permanentAddress?.addressLine1}
            icon={Home}
            fieldKey="permanentAddress.addressLine1"
            section="permanentAddress"
            error={errors["permanentAddress.addressLine1"]}
            onChange={(k: string, v: any) => updateNested("permanentAddress", "addressLine1", v)}
          />
          <Field
            label="Address Line 2"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.permanentAddress?.addressLine2}
            icon={Home}
            fieldKey="permanentAddress.addressLine2"
            section="permanentAddress"

            onChange={(k: string, v: any) => updateNested("permanentAddress", "addressLine2", v)}
          />
          <Field
            label="City"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.permanentAddress?.city}
            icon={MapPin}
            fieldKey="permanentAddress.city"
            section="permanentAddress"
            error={errors["permanentAddress.city"]}
            onChange={(k: string, v: any) => updateNested("permanentAddress", "city", v)}
          />
          <Field
            label="State"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.permanentAddress?.state}
            icon={MapPin}
            fieldKey="permanentAddress.state"
            section="permanentAddress"
            error={errors["permanentAddress.state"]}
            onChange={(k: string, v: any) => updateNested("permanentAddress", "state", v)}
          />
          <Field
            label="Postal Code"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.permanentAddress?.postalCode}
            icon={Hash}
            fieldKey="permanentAddress.postalCode"
            section="permanentAddress"
            error={errors["permanentAddress.postalCode"]}
            onChange={(k: string, v: any) => updateNested("permanentAddress", "postalCode", v)}
          />
          <Field
            label="Country"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={profile?.permanentAddress?.country}
            icon={Globe}
            fieldKey="permanentAddress.country"
            section="permanentAddress"
            error={errors["permanentAddress.country"]}
            type="select"
            options={countriesList.map((c: any) => c.name)}
            onChange={(k: string, v: any) => updateNested("permanentAddress", "country", v)}
          />
        </div>
      </div>

      {/* Section 4: Passport Information */}
      <div className="p-4 bg-white border border-gray-200 ">
        <SectionHeader title="Passport Information" sectionName="passport" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field
            label="Passport Number"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.passportNumber}
            icon={CreditCard}
            fieldKey="passportNumber"
            section="passport"
            error={errors["passportNumber"]}
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
          <Field
            label="Issue Date"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.passportDetail?.issueDate}
            icon={Calendar}
            fieldKey="passportIssueDate"
            section="passport"
            error={errors["passportIssueDate"]}
            type="date"
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
          <Field
            label="Expiry Date"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.passportDetail?.expiryDate}
            icon={CalendarDays}
            fieldKey="passportExpiry"
            section="passport"
            error={errors["passportExpiry"]}
            type="date"
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
          <Field
            label="Issue Country"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={user?.passportDetail?.issueCountry}
            icon={Globe}
            fieldKey="passportIssueCountry"
            section="passport"
            error={errors["passportIssueCountry"]}
            type="select"
            options={countriesList.map((c: any) => c.name)}
            onChange={(k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }))}
          />
        </div>
      </div>

      {/* Section 5: Family Details (New) */}
      <div className="p-4 bg-white border border-gray-200">
        <SectionHeader title="Family Details" sectionName="familyDetails" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Mother's Details */}
          <div className="col-span-full mt-2 mb-2 pb-2 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Mother's Information</h4>
          </div>

          <Field
            label="Mother's Name"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={formData.familyDetails?.motherName}
            icon={User}
            fieldKey="familyDetails.motherName"
            section="familyDetails"
            error={errors["familyDetails.motherName"]}
            onChange={(k: string, v: any) => updateNested("familyDetails", "motherName", v)}
          />
          <Field
            label="Mother's Phone"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={formData.familyDetails?.motherPhone}
            icon={Phone}
            fieldKey="familyDetails.motherPhone"
            section="familyDetails"
            error={errors["familyDetails.motherPhone"]}
            type="tel"
            onChange={(k: string, v: any) => updateNested("familyDetails", "motherPhone", v)}
          />
          <Field
            label="Mother's Occupation"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={formData.familyDetails?.motherOccupation}
            icon={Briefcase}
            fieldKey="familyDetails.motherOccupation"
            section="familyDetails"
            onChange={(k: string, v: any) => updateNested("familyDetails", "motherOccupation", v)}
          />

          {/* Father's Details */}
          <div className="col-span-full mt-4 mb-2 pb-2 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Father's Information</h4>
          </div>

          <Field
            label="Father's Name"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={formData.familyDetails?.fatherName}
            icon={User}
            fieldKey="familyDetails.fatherName"
            section="familyDetails"
            error={errors["familyDetails.fatherName"]}
            onChange={(k: string, v: any) => updateNested("familyDetails", "fatherName", v)}
          />
          <Field
            label="Father's Phone"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={formData.familyDetails?.fatherPhone}
            icon={Phone}
            fieldKey="familyDetails.fatherPhone"
            section="familyDetails"
            error={errors["familyDetails.fatherPhone"]}
            type="tel"
            onChange={(k: string, v: any) => updateNested("familyDetails", "fatherPhone", v)}
          />
          <Field
            label="Father's Occupation"
            editingSections={editingSections}
            formatDate={formatDate}
            displayValue={displayValue}
            formData={formData}
            value={formData.familyDetails?.fatherOccupation}
            icon={Briefcase}
            fieldKey="familyDetails.fatherOccupation"
            section="familyDetails"
            error={errors["familyDetails.fatherOccupation"]}
            onChange={(k: string, v: any) => updateNested("familyDetails", "fatherOccupation", v)}
          />
        </div>
      </div>
    </div>
  );
}

import { Plus, Trash2 } from "lucide-react";

interface WorkExperienceTabProps {
  data: any[];
  onSave: (data: any[]) => Promise<void>;
}

export function WorkExperienceTab({ data, onSave }: WorkExperienceTabProps) {
  const [workList, setWorkList] = useState<any[]>([]);
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (editingSections.size > 0 || data !== workList) {
      setWorkList(data && data.length > 0 ? [...data] : [{ isNew: true }]);
    }
  }, [data, editingSections]);

  const handleSectionSave = async () => {
    const validData = workList.filter(w => w.companyName || w.designation);
    await onSave(validData);
    setEditingSections(new Set());
  };

  const toggleEditSection = () => {
    setEditingSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has("work")) {
        newSet.delete("work");
      } else {
        newSet.add("work");
      }
      return newSet;
    });
  };

  const addNew = () => setWorkList([...workList, { isNew: true }]);

  const removeEntry = (index: number) => {
    setWorkList(workList.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: string, value: any) => {
    const newList = [...workList];
    newList[index] = { ...newList[index], [field]: value };
    setWorkList(newList);
  };

  // Format YYYY-MM-DD to "Mon YYYY" for display
  const formatDate = (d?: string) => {
    if (!d) return "Present";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return d;
    }
  };

  // Convert YYYY-MM-DD to YYYY-MM for <input type="month">
  const toMonthInputValue = (d?: string) => {
    if (!d) return "";
    try {
      return d.slice(0, 7); // "2024-06"
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Section Header with Edit/Save Toggle */}
      <div className="bg-white p-4 border border-gray-200 ">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#F26D44]" />
            <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (editingSections.has("work")) {
                handleSectionSave();
              } else {
                toggleEditSection();
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all  ${editingSections.has("work")
              ? "bg-gradient-to-r from-[#F26D44] to-orange-600 text-white shadow-lg shadow-[#F26D44]/25"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {editingSections.has("work") ? (
              <><Save size={14} /> Save</>
            ) : (
              <><Edit2 size={14} /> Edit</>
            )}
          </motion.button>
        </div>

        {/* Work Entries List */}
        <div className="space-y-4">
          {workList.map((work, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200  relative group">
              {/* Remove Button (only visible in edit mode) */}
              {editingSections.has("work") && workList.length > 1 && (
                <button
                  onClick={() => removeEntry(idx)}
                  className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Company / Organization</label>
                  {editingSections.has("work") ? (
                    <input
                      value={work.companyName || ""}
                      onChange={(e) => updateField(idx, "companyName", e.target.value)}
                      placeholder="Enter company name"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] text-sm "
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-800 font-medium  min-h-[42px] flex items-center">
                      {work.companyName || "N/A"}
                    </div>
                  )}
                </div>

                {/* Designation (matches schema key) */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Designation</label>
                  {editingSections.has("work") ? (
                    <input
                      value={work.designation || ""}
                      onChange={(e) => updateField(idx, "designation", e.target.value)}
                      placeholder="Enter designation"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] text-sm "
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-800  min-h-[42px] flex items-center">
                      {work.designation || "N/A"}
                    </div>
                  )}
                </div>

                {/* Location (Optional visual field, not in schema but useful) */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {editingSections.has("work") ? (
                      <input
                        value={work.location || ""}
                        onChange={(e) => updateField(idx, "location", e.target.value)}
                        placeholder="City, Country"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] text-sm "
                      />
                    ) : (
                      <div className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-800  min-h-[42px] flex items-center">
                        {work.location || "N/A"}
                      </div>
                    )}
                  </div>
                </div>

                {/* From Date (matches schema key) */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">From</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {editingSections.has("work") ? (
                      <input
                        type="month"
                        value={toMonthInputValue(work.from)}
                        onChange={(e) => updateField(idx, "from", e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] text-sm "
                      />
                    ) : (
                      <div className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-800  min-h-[42px] flex items-center">
                        {formatDate(work.from)}
                      </div>
                    )}
                  </div>
                </div>

                {/* To Date (matches schema key) */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">To</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {editingSections.has("work") ? (
                      <input
                        type="month"
                        value={toMonthInputValue(work.to)}
                        onChange={(e) => updateField(idx, "to", e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] text-sm "
                      />
                    ) : (
                      <div className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-800  min-h-[42px] flex items-center">
                        {work.to ? formatDate(work.to) : "Present"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!editingSections.has("work") && workList.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 ">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No work experience recorded</p>
            </div>
          )}

          {/* Add New Button (only in edit mode) */}
          {editingSections.has("work") && (
            <button
              onClick={addNew}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#F26D44] hover:text-[#F26D44]  transition font-medium"
            >
              <Plus size={16} /> Add Work Experience
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { Award } from "lucide-react";
import {
  ChevronDown, FileText, Info,
  CheckCircle2, Circle
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

const TEST_CONFIGS = [
  {
    id: "ielts",
    label: "IELTS",
    icon: FileText,
    fields: [
      { key: "ielts.overall", label: "Overall Score*", placeholder: "Overall Score", span: "md:col-span-1" },
      { key: "ielts.trfNo", label: "TRF No", placeholder: "T: TRF No.", span: "md:col-span-1" },
      { key: "ielts.examDate", label: "Date of Examination", placeholder: "Dt. of Examination", type: "date", span: "md:col-span-1" },
      { key: "ielts.listening", label: "Listening*", placeholder: "L:", span: "md:col-span-1" },
      { key: "ielts.reading", label: "Reading*", placeholder: "R:", span: "md:col-span-1" },
      { key: "ielts.writing", label: "Writing*", placeholder: "W:", span: "md:col-span-1" },
      { key: "ielts.speaking", label: "Speaking*", placeholder: "S:", span: "md:col-span-1" },
    ],
    extraFields: [
      { key: "ielts.yetToReceive", label: "Yet to Receive?", type: "boolean-toggle", options: ["No", "Yes"] },
      { key: "ielts.resultDate", label: "Test Result Date*", placeholder: "Enter Test Result Date", type: "date" },
      {
        key: "ielts.waiver", label: "IELTS Waiver", type: "waiver-group", waiverOptions: ["No", "Yes"],
        waiverExtras: [
          { key: "ielts.waiver12thMarks", label: "12th English Marks", placeholder: "Out of 100" },
          { key: "ielts.moi", label: "Medium of Instruction (MOI)", type: "checkbox" }
        ]
      }
    ]
  },
  {
    id: "toefl",
    label: "TOEFL",
    icon: FileText,
    fields: [
      { key: "toefl.overall", label: "Overall Score*", placeholder: "Overall Score", span: "md:col-span-1" },
      { key: "toefl.examDate", label: "Date of Examination", placeholder: "Dt. of Examination", type: "date", span: "md:col-span-1" },
      { key: "toefl.reading", label: "Reading*", placeholder: "R:", span: "md:col-span-1" },
      { key: "toefl.listening", label: "Listening*", placeholder: "L:", span: "md:col-span-1" },
      { key: "toefl.speaking", label: "Speaking*", placeholder: "S:", span: "md:col-span-1" },
      { key: "toefl.writing", label: "Writing*", placeholder: "W:", span: "md:col-span-1" },
    ],
    extraFields: [
      { key: "toefl.yetToReceive", label: "Yet to Receive?", type: "boolean-toggle", options: ["No", "Yes"] },
      { key: "toefl.resultDate", label: "Test Result Date*", placeholder: "Enter Test Result Date", type: "date" },
      {
        key: "toefl.waiver", label: "TOEFL Waiver", type: "waiver-group", waiverOptions: ["No", "Yes"],
        waiverExtras: [
          { key: "toefl.waiver12thMarks", label: "12th English Marks", placeholder: "Out of 100" },
          { key: "toefl.moi", label: "Medium of Instruction (MOI)", type: "checkbox" }
        ]
      }
    ]
  },
  {
    id: "gre",
    label: "GRE",
    icon: FileText,
    fields: [
      { key: "gre.overall", label: "Overall Score*", placeholder: "Overall Score", span: "md:col-span-1" },
      { key: "gre.examDate", label: "Date of Examination", placeholder: "Dt. of Examination", type: "date", span: "md:col-span-1" },
      { key: "gre.quantitative", label: "Quantitative*", placeholder: "Q:", span: "md:col-span-1" },
      { key: "gre.verbal", label: "Verbal*", placeholder: "V:", span: "md:col-span-1" },
      { key: "gre.analyticalWriting", label: "Analytical Writing*", placeholder: "AW:", span: "md:col-span-1" },
    ],
    extraFields: []
  },
  {
    id: "pte",
    label: "PTE",
    icon: FileText,
    fields: [
      { key: "pte.overall", label: "Overall Score*", placeholder: "Overall Score", span: "md:col-span-1" },
      { key: "pte.registrationNo", label: "Registration No", placeholder: "Registration No.", span: "md:col-span-1" },
      { key: "pte.examDate", label: "Date of Examination", placeholder: "Dt. of Examination", type: "date", span: "md:col-span-1" },
      { key: "pte.listening", label: "Listening*", placeholder: "Listening", span: "md:col-span-1" },
      { key: "pte.reading", label: "Reading*", placeholder: "Reading", span: "md:col-span-1" },
      { key: "pte.writing", label: "Writing*", placeholder: "Writing", span: "md:col-span-1" },
      { key: "pte.speaking", label: "Speaking*", placeholder: "Speaking", span: "md:col-span-1" },
    ],
    extraFields: [
      {
        key: "pte.yetToReceive",
        label: "Yet to Receive?",
        type: "boolean-toggle",
        options: ["No", "Yes"]
      },
      {
        key: "pte.resultDate",
        label: "Test Result Date*",
        placeholder: "Enter Test Result Date",
        type: "date"
      },
      {
        key: "pte.waiver",
        label: "PTE Waiver",
        type: "waiver-group",
        waiverOptions: ["No", "Yes"],
        waiverExtras: [
          {
            key: "pte.waiver12thMarks",
            label: "12th English Marks",
            placeholder: "Out of 100"
          },
          {
            key: "pte.moi",
            label: "Medium of Instruction (MOI)",
            type: "checkbox"
          }
        ]
      }
    ]
  },
  {
    id: "gmat",
    label: "GMAT",
    icon: FileText,
    fields: [
      { key: "gmat.overall", label: "Overall Score*", placeholder: "Overall Score", span: "md:col-span-1" },
      { key: "gmat.examDate", label: "Date of Examination", placeholder: "Dt. of Examination", type: "date", span: "md:col-span-1" },
      { key: "gmat.quantitative", label: "Quantitative*", placeholder: "Q:", span: "md:col-span-1" },
      { key: "gmat.verbal", label: "Verbal*", placeholder: "V:", span: "md:col-span-1" },
      { key: "gmat.analyticalWriting", label: "Analytical Writing*", placeholder: "AW:", span: "md:col-span-1" },
      { key: "gmat.integratedReasoning", label: "Integrated Reasoning*", placeholder: "IR:", span: "md:col-span-1" },
    ],
    extraFields: []
  },
  {
    id: "sat",
    label: "SAT",
    icon: FileText,
    fields: [
      {
        key: "sat.overall",
        label: "Overall Score*",
        placeholder: "Overall Score",
        span: "md:col-span-1",
      },
      {
        key: "sat.examDate",
        label: "Date of Examination",
        placeholder: "Dt. of Examination",
        type: "date",
        span: "md:col-span-1",
      },
      {
        key: "sat.readingWriting",
        label: "Reading & Writing*",
        placeholder: "RW:",
        span: "md:col-span-1",
      },
      {
        key: "sat.math",
        label: "Math*",
        placeholder: "M:",
        span: "md:col-span-1",
      },
      {
        key: "sat.essay",
        label: "Essay",
        placeholder: "E:",
        span: "md:col-span-1",
      },
    ],
    extraFields: [],
  }
];

export function TestsTab({ data, onSave }: TestsTabProps) {
  const [formData, setFormData] = useState<any>({});
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  const setNestedValue = (path: string, value: any) => {
    setFormData((prev: any) => {
      const newObj = JSON.parse(JSON.stringify(prev || {}));
      const keys = path.split('.');
      let current: any = newObj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newObj;
    });
  };

  useEffect(() => {
    setFormData(data || {});
    setErrors({});

    if (editingSections.size === 0 && data) {
      const expanded = new Set<string>();
      TEST_CONFIGS.forEach(config => {
        const hasData = config.fields.some((f: any) => {
          const val = getNestedValue(data, f.key);
          return val !== undefined && val !== null && val !== "";
        });
        if (hasData) expanded.add(config.id);
      });
      setExpandedAccordions(expanded);
    }
  }, [data, editingSections]);

  const validateResultDate = (testId: string) => {
    const newErrors: Record<string, string> = {};
    const resultDateKey = `${testId}.resultDate`;
    const resultDate = getNestedValue(formData, resultDateKey);

    if (resultDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(resultDate);

      if (selectedDate < today) {
        newErrors[resultDateKey] = "Result date cannot be in the past. Please select today or a future date.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleEditSection = (testId: string) => {
    setEditingSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
        setExpandedAccordions(e => new Set(e).add(testId));
      }
      return newSet;
    });
    setErrors({});
  };

  const handleSaveSection = async (testId: string) => {
    const isValid = validateResultDate(testId);
    if (!isValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    await onSave(formData);
    setEditingSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(testId);
      return newSet;
    });
    setErrors({});
  };

  const toggleAccordion = (testId: string) => {
    setExpandedAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) newSet.delete(testId);
      else newSet.add(testId);
      return newSet;
    });
  };

  const handleDatePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    toast.warning("Pasting dates is not allowed. Please select from the calendar.");
  };

  const visibleTests = TEST_CONFIGS;

  return (
    <div className="space-y-3">
      {editingSections.size > 1 && (
        <div className="flex justify-end mb-2 sticky top-0 z-10 bg-white/95 backdrop-blur p-2 border border-gray-200 shadow-sm">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#F26D44] to-orange-600 text-white shadow-lg shadow-[#F26D44]/25 transition-all"
          >
            <Save size={14} /> Save All Changes
          </motion.button>
        </div>
      )}

      {visibleTests.map((config) => {
        const Icon = config.icon;
        const isEditing = editingSections.has(config.id);
        const isExpanded = expandedAccordions.has(config.id);

        const yetToReceiveKey = `${config.id}.yetToReceive`;
        const isYetToReceive = getNestedValue(formData, yetToReceiveKey) === true;
        const resultDateKey = `${config.id}.resultDate`;
        const resultDateError = errors[resultDateKey];

        // ✅ Check if waiver is enabled
        const waiverKey = `${config.id}.waiver`;
        const isWaiverEnabled = getNestedValue(formData, waiverKey) === true;

        return (
          <div key={config.id} className="border border-gray-200 overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion(config.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-semibold text-orange-600">{config.label}</span>

                {config.fields.some((f: any) => getNestedValue(formData, f.key)) && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">
                    Completed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEditing) {
                      handleSaveSection(config.id);
                    } else {
                      toggleEditSection(config.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${isEditing
                    ? "bg-gradient-to-r from-[#F26D44] to-orange-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {isEditing ? <><Save size={12} /> Save</> : <><Edit2 size={12} /> Edit</>}
                </motion.button>

                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                    }`}
                />
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-4 border-t pt-6 border-gray-100">
                    {/* ✅ Main Fields - HIDDEN when waiver is enabled OR yet to receive is yes */}
                    {(!isYetToReceive && !isWaiverEnabled) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {config.fields.map((field: any) => {
                          const value = getNestedValue(formData, field.key);
                          return (
                            <div key={field.key} className={`${field.span || ""}`}>
                              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                {field.label}
                              </label>
                              {isEditing ? (
                                <input
                                  type={field.type === "date" ? "date" : "text"}
                                  value={value || ""}
                                  onChange={(e) => setNestedValue(field.key, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] text-sm transition-all"
                                />
                              ) : (
                                <div className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200/60 text-sm text-gray-700 min-h-[42px] flex items-center">
                                  {value || <span className="text-gray-400 italic">{field.placeholder}</span>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* ✅ Show message when Yet to Receive is Yes */}
                    {isYetToReceive && !isWaiverEnabled && isEditing && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                        <p className="text-orange-800 text-sm">
                          Test results are pending. Please enter the result date once received.
                        </p>
                      </div>
                    )}

                    {/* ✅ Show message when Waiver is Yes */}
                    {isWaiverEnabled && isEditing && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-orange-800 text-sm font-medium">Waiver Applied</p>
                            <p className="text-orange-700 text-xs mt-1">
                              Test scores are not required. Please provide your 12th English marks and/or Medium of Instruction details below.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ✅ Extra Fields - ALWAYS SHOWN */}
                    {config.extraFields.length > 0 && (
                      <div className="space-y-4 pt-2 border-t border-dashed border-gray-200">
                        {config.extraFields.map((extra: any) => {
                          if (extra.type === "boolean-toggle") {
                            const value = getNestedValue(formData, extra.key);
                            return (
                              <div key={extra.key} className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700">{extra.label}</label>
                                <div className="flex items-center gap-3">
                                  {extra.options.map((opt: string) => {
                                    const isSelected =
                                      (opt === "Yes" && value === true) ||
                                      (opt === "No" && value === false) ||
                                      (opt === "No" && value === undefined);
                                    return (
                                      <button
                                        key={opt}
                                        disabled={!isEditing}
                                        onClick={() => setNestedValue(extra.key, opt === "Yes")}
                                        className={`flex items-center gap-1.5 text-sm transition-all ${isSelected
                                          ? "text-[#F26D44] font-medium"
                                          : "text-gray-400"
                                          } ${!isEditing ? "cursor-default" : "cursor-pointer"}`}
                                      >
                                        {isSelected ? (
                                          <CheckCircle2 className="w-4 h-4 fill-current" />
                                        ) : (
                                          <Circle className="w-4 h-4" />
                                        )}
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }

                          if (extra.type === "date") {
                            const value = getNestedValue(formData, extra.key);
                            const hasError = extra.key === resultDateKey && resultDateError;

                            return (
                              <div key={extra.key}>
                                <label className={`block text-xs font-medium uppercase tracking-wide mb-1.5 ${hasError ? "text-red-500" : "text-gray-500"
                                  }`}>
                                  {extra.label} {hasError && <span className="text-red-500">*</span>}
                                </label>
                                {isEditing ? (
                                  <input
                                    type="date"
                                    value={value || ""}
                                    onChange={(e) => {
                                      setNestedValue(extra.key, e.target.value);
                                      if (hasError) setErrors({});
                                    }}
                                    onPaste={handleDatePaste}
                                    min={new Date().toISOString().split('T')[0]}
                                    disabled={isWaiverEnabled} // ✅ Disable date when waiver is enabled
                                    className={`w-full md:w-64 px-3 py-2.5 bg-gray-50 border focus:outline-none focus:ring-2 text-sm transition-all ${hasError
                                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                      : isWaiverEnabled
                                        ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                                        : "border-gray-200 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                                      }`}
                                  />
                                ) : (
                                  <div className="w-full md:w-64 px-3 py-2.5 bg-gray-50/70 border border-gray-200/60 text-sm text-gray-700 min-h-[42px] flex items-center">
                                    {value || <span className="text-gray-400 italic">{extra.placeholder}</span>}
                                  </div>
                                )}
                                {hasError && isEditing && (
                                  <p className="text-xs text-red-500 mt-1">{resultDateError}</p>
                                )}
                              </div>
                            );
                          }

                          if (extra.type === "waiver-group") {
                            const waiverValue = getNestedValue(formData, extra.key);
                            const isWaived = waiverValue === true;

                            return (
                              <div key={extra.key} className="space-y-3">
                                <div className="flex items-center gap-4 flex-wrap">
                                  <div className="flex items-center gap-1.5">
                                    <Info className="w-3.5 h-3.5 text-orange-500" />
                                    <label className="text-sm font-medium text-gray-700">{extra.label}</label>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {extra.waiverOptions.map((opt: string) => {
                                      const isSelected =
                                        (opt === "Yes" && isWaived) || (opt === "No" && !isWaived);
                                      return (
                                        <button
                                          key={opt}
                                          disabled={!isEditing}
                                          onClick={() => setNestedValue(extra.key, opt === "Yes")}
                                          className={`flex items-center gap-1.5 text-sm transition-all ${isSelected
                                            ? "text-[#F26D44] font-medium"
                                            : "text-gray-400"
                                            } ${!isEditing ? "cursor-default" : "cursor-pointer"}`}
                                        >
                                          {isSelected ? (
                                            <CheckCircle2 className="w-4 h-4 fill-current" />
                                          ) : (
                                            <Circle className="w-4 h-4" />
                                          )}
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* ✅ Only show waiver extras if Waiver is YES */}
                                {isWaived && (
                                  <div className="pl-8 flex flex-wrap items-center gap-4">
                                    {extra.waiverExtras.map((we: any) => {
                                      if (we.type === "checkbox") {
                                        const checked = !!getNestedValue(formData, we.key);
                                        return (
                                          <label
                                            key={we.key}
                                            className={`flex items-center gap-2 text-sm text-gray-600 ${!isEditing ? "opacity-60" : ""
                                              }`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={checked}
                                              disabled={!isEditing}
                                              onChange={(e) => setNestedValue(we.key, e.target.checked)}
                                              className="w-4 h-4 accent-[#F26D44]"
                                            />
                                            {we.label}
                                          </label>
                                        );
                                      }
                                      const val = getNestedValue(formData, we.key);
                                      return (
                                        <div key={we.key} className="flex items-center gap-2">
                                          <label className="text-sm text-gray-600">{we.label}</label>
                                          {isEditing ? (
                                            <input
                                              type="text"
                                              value={val || ""}
                                              onChange={(e) => setNestedValue(we.key, e.target.value)}
                                              placeholder={we.placeholder}
                                              className="px-3 py-1.5 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] text-sm w-28"
                                            />
                                          ) : (
                                            <div className="px-3 py-1.5 bg-gray-50/70 border border-gray-200/60 text-sm text-gray-700 min-h-[34px] flex items-center">
                                              {val || <span className="text-gray-400 italic">{we.placeholder}</span>}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {!isWaived && isEditing && (
                                  <p className="text-xs text-gray-400 pl-8 italic">
                                    Select "Yes" above to enter waiver details.
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {visibleTests.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 bg-white">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No test types configured</p>
        </div>
      )}
    </div>
  );
}