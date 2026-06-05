// components/dashboard/profile/ProfileFormContainer.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";

interface ProfileFormContainerProps {
  userId: string;
  onComplete?: () => void;
}

type TabType = "basic" | "academic" | "work" | "test";

export default function ProfileFormContainer({
  userId,
  onComplete,
}: ProfileFormContainerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);

  // Fetch countries
  const fetchCountries = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/countries?limit=300");
      setCountries(res.data.data || []);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  }, []);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/users/${userId}`);
      const userData = res.data.data || res.data;
      setProfileData({
        user: userData,
        profile: userData.profile || {},
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCountries();
    fetchProfile();
  }, [fetchCountries, fetchProfile]);

  // Save handler
  const handleSave = async (tabData: any) => {
    setSaving(true);
    try {
      let payload: any = {};

      switch (activeTab) {
        case "basic":
          // Update user fields
          await axiosInstance.put(`/users/${userId}`, {
            name: tabData.name,
            phone: tabData.phone,
            dateOfBirth: tabData.dateOfBirth,
            gender: tabData.gender,
            maritalStatus: tabData.maritalStatus,
            firstLanguage: tabData.firstLanguage,
            nationality: tabData.nationality,
          });

          // Update address
          if (tabData.currentAddress) {
            payload.currentAddress = tabData.currentAddress;
          }
          if (tabData.permanentAddress) {
            payload.permanentAddress = tabData.permanentAddress;
          }
          break;

        case "academic":
          payload.highestAcademic = tabData.highestAcademic;
          payload.educationHistory = tabData.educationHistory;
          break;

        case "work":
          payload.otherDetails = {
            ...profileData?.profile?.otherDetails,
            workExperience: tabData.workExperience,
          };
          break;

        case "test":
          payload.englishProficiencyScore = tabData.englishProficiencyScore;
          payload.hasGmat = tabData.hasGmat;
          payload.gmatScore = tabData.gmatScore;
          payload.hasGre = tabData.hasGre;
          payload.greScore = tabData.greScore;
          payload.satScore = tabData.satScore;
          break;
      }

      // Save profile info if there's payload
      if (Object.keys(payload).length > 0) {
        await axiosInstance.post(`/auth/profile_info`, payload);
      }

      toast.success("Profile updated successfully!");
      await fetchProfile();
      onComplete?.();
    } catch (err: any) {
      console.error("Error saving:", err);
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Details", icon: User },
    { id: "academic", label: "Academic Details", icon: GraduationCap },
    { id: "work", label: "Work Experience", icon: Briefcase },
    { id: "test", label: "Test Information", icon: FileText },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#F26D44]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-[#F26D44] border-b-2 border-[#F26D44]"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "basic" && (
              <BasicDetailsTab
                data={profileData}
                countries={countries}
                onSave={handleSave}
                saving={saving}
              />
            )}
            {activeTab === "academic" && (
              <AcademicDetailsTab
                data={profileData}
                countries={countries}
                onSave={handleSave}
                saving={saving}
              />
            )}
            {activeTab === "work" && (
              <WorkExperienceTab
                data={profileData}
                onSave={handleSave}
                saving={saving}
              />
            )}
            {activeTab === "test" && (
              <TestInformationTab
                data={profileData}
                onSave={handleSave}
                saving={saving}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}



import { Mail, Phone, Calendar, Flag, Home, MapPin } from "lucide-react";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";

interface BasicDetailsTabProps {
  data: any;
  countries: any[];
  onSave: (data: any) => void;
  saving: boolean;
}

export function BasicDetailsTab({
  data,
  countries,
  onSave,
  saving,
}: BasicDetailsTabProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    firstLanguage: "",
    nationality: "",
    currentAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    permanentAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = data.user || {};
      const profile = data.profile || {};
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth?.split("T")[0] || "",
        gender: user.gender || "",
        maritalStatus: user.maritalStatus || "",
        firstLanguage: user.firstLanguage || "",
        nationality: user.nationality || "",
        currentAddress: {
          addressLine1: profile.currentAddress?.addressLine1 || "",
          addressLine2: profile.currentAddress?.addressLine2 || "",
          city: profile.currentAddress?.city || "",
          state: profile.currentAddress?.state || "",
          country: profile.currentAddress?.country || "",
          postalCode: profile.currentAddress?.postalCode || "",
        },
        permanentAddress: {
          addressLine1: profile.permanentAddress?.addressLine1 || "",
          addressLine2: profile.permanentAddress?.addressLine2 || "",
          city: profile.permanentAddress?.city || "",
          state: profile.permanentAddress?.state || "",
          country: profile.permanentAddress?.country || "",
          postalCode: profile.permanentAddress?.postalCode || "",
        },
      });
    }
  }, [data]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (
    type: "currentAddress" | "permanentAddress",
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User size={20} className="text-[#F26D44]" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl">
              <Mail size={16} className="text-gray-400" />
              <span className="text-sm text-gray-800">{formData.email}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Marital Status
            </label>
            <select
              value={formData.maritalStatus}
              onChange={(e) => handleChange("maritalStatus", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              First Language
            </label>
            <input
              type="text"
              value={formData.firstLanguage}
              onChange={(e) => handleChange("firstLanguage", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Nationality
            </label>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option?.name || ""}
              value={
                countries.find((c) => c.name === formData.nationality) || null
              }
              onChange={(_, newValue) =>
                handleChange("nationality", newValue?.name || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Flag size={16} className="text-gray-400" />
                        </InputAdornment>
                        {params?.InputProps?.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "46px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Current Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Home size={20} className="text-[#F26D44]" />
          Current Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Address Line 1
            </label>
            <input
              type="text"
              value={formData.currentAddress.addressLine1}
              onChange={(e) =>
                handleAddressChange(
                  "currentAddress",
                  "addressLine1",
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.currentAddress.addressLine2}
              onChange={(e) =>
                handleAddressChange(
                  "currentAddress",
                  "addressLine2",
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              City
            </label>
            <input
              type="text"
              value={formData.currentAddress.city}
              onChange={(e) =>
                handleAddressChange("currentAddress", "city", e.target.value)
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              State
            </label>
            <input
              type="text"
              value={formData.currentAddress.state}
              onChange={(e) =>
                handleAddressChange("currentAddress", "state", e.target.value)
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Country
            </label>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option?.name || ""}
              value={
                countries.find(
                  (c) => c.name === formData.currentAddress.country
                ) || null
              }
              onChange={(_, newValue) =>
                handleAddressChange(
                  "currentAddress",
                  "country",
                  newValue?.name || ""
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params?.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <MapPin size={16} className="text-gray-400" />
                        </InputAdornment>
                        {params?.InputProps?.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "46px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.currentAddress.postalCode}
              onChange={(e) =>
                handleAddressChange(
                  "currentAddress",
                  "postalCode",
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Home size={20} className="text-[#F26D44]" />
          Permanent Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Address Line 1
            </label>
            <input
              type="text"
              value={formData.permanentAddress.addressLine1}
              onChange={(e) =>
                handleAddressChange(
                  "permanentAddress",
                  "addressLine1",
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.permanentAddress.addressLine2}
              onChange={(e) =>
                handleAddressChange(
                  "permanentAddress",
                  "addressLine2",
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              City
            </label>
            <input
              type="text"
              value={formData.permanentAddress.city}
              onChange={(e) =>
                handleAddressChange(
                  "permanentAddress",
                  "city",
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              State
            </label>
            <input
              type="text"
              value={formData.permanentAddress.state}
              onChange={(e) =>
                handleAddressChange(
                  "permanentAddress",
                  "state",
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Country
            </label>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option?.name || ""}
              value={
                countries.find(
                  (c) => c.name === formData.permanentAddress.country
                ) || null
              }
              onChange={(_, newValue) =>
                handleAddressChange(
                  "permanentAddress",
                  "country",
                  newValue?.name || ""
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <MapPin size={16} className="text-gray-400" />
                        </InputAdornment>
                        {params?.InputProps?.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "46px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.permanentAddress.postalCode}
              onChange={(e) =>
                handleAddressChange(
                  "permanentAddress",
                  "postalCode",
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={() => onSave(formData)}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

import { Plus, Trash2 } from "lucide-react";

interface AcademicDetailsTabProps {
  data: any;
  countries: any[];
  onSave: (data: any) => void;
  saving: boolean;
}

export function AcademicDetailsTab({
  data,
  countries,
  onSave,
  saving,
}: AcademicDetailsTabProps) {
  const [highestAcademic, setHighestAcademic] = useState({
    countryOfEducation: "",
    highestEducationLevel: "",
    gradingScheme: "",
    gradeAverage: "",
    graduated: false,
  });

  const [educationHistory, setEducationHistory] = useState<any[]>([]);

  useEffect(() => {
    if (data?.profile) {
      const profile = data.profile;
      setHighestAcademic({
        countryOfEducation: profile.highestAcademic?.countryOfEducation || "",
        highestEducationLevel:
          profile.highestAcademic?.highestEducationLevel || "",
        gradingScheme: profile.highestAcademic?.gradingScheme || "",
        gradeAverage: profile.highestAcademic?.gradeAverage || "",
        graduated: profile.highestAcademic?.graduated || false,
      });
      setEducationHistory(profile.educationHistory || []);
    }
  }, [data]);

  const addEducation = () => {
    setEducationHistory([
      ...educationHistory,
      {
        educationLevel: "",
        institutionName: "",
        gradingScheme: "",
        startDate: "",
        endDate: "",
        degreeName: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationHistory(educationHistory.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...educationHistory];
    updated[index] = { ...updated[index], [field]: value };
    setEducationHistory(updated);
  };

  return (
    <div className="space-y-6">
      {/* Highest Academic Qualification */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <GraduationCap size={20} className="text-[#F26D44]" />
          Highest Academic Qualification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Country of Education
            </label>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option?.name || ""}
              value={
                countries.find(
                  (c) => c.name === highestAcademic.countryOfEducation
                ) || null
              }
              onChange={(_, newValue) =>
                setHighestAcademic({
                  ...highestAcademic,
                  countryOfEducation: newValue?.name || "",
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <MapPin size={16} className="text-gray-400" />
                        </InputAdornment>
                        {params?.InputProps?.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "46px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Education Level
            </label>
            <select
              value={highestAcademic.highestEducationLevel}
              onChange={(e) =>
                setHighestAcademic({
                  ...highestAcademic,
                  highestEducationLevel: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            >
              <option value="">Select Level</option>
              <option value="high_school">High School</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD</option>
              <option value="diploma">Diploma</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Grading Scheme
            </label>
            <input
              type="text"
              value={highestAcademic.gradingScheme}
              onChange={(e) =>
                setHighestAcademic({
                  ...highestAcademic,
                  gradingScheme: e.target.value,
                })
              }
              placeholder="e.g., GPA, Percentage, CGPA"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Grade Average
            </label>
            <input
              type="text"
              value={highestAcademic.gradeAverage}
              onChange={(e) =>
                setHighestAcademic({
                  ...highestAcademic,
                  gradeAverage: e.target.value,
                })
              }
              placeholder="e.g., 3.8, 85%, 9.2"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase cursor-pointer">
              <input
                type="checkbox"
                checked={highestAcademic.graduated}
                onChange={(e) =>
                  setHighestAcademic({
                    ...highestAcademic,
                    graduated: e.target.checked,
                  })
                }
                className="w-4 h-4 text-[#F26D44] rounded"
              />
              Graduated
            </label>
          </div>
        </div>
      </div>

      {/* Education History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <GraduationCap size={20} className="text-[#F26D44]" />
            Education History
          </h3>
          <button
            onClick={addEducation}
            className="px-4 py-2 bg-[#F26D44] text-white rounded-lg text-sm font-medium hover:bg-[#E05D34] transition flex items-center gap-2"
          >
            <Plus size={16} />
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {educationHistory.map((edu, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">
                  Education #{index + 1}
                </h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Education Level
                  </label>
                  <select
                    value={edu.educationLevel}
                    onChange={(e) =>
                      updateEducation(index, "educationLevel", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  >
                    <option value="">Select Level</option>
                    <option value="high_school">High School</option>
                    <option value="bachelor">Bachelor's</option>
                    <option value="master">Master's</option>
                    <option value="phd">PhD</option>
                    <option value="diploma">Diploma</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={edu.institutionName}
                    onChange={(e) =>
                      updateEducation(index, "institutionName", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Degree Name
                  </label>
                  <input
                    type="text"
                    value={edu.degreeName}
                    onChange={(e) =>
                      updateEducation(index, "degreeName", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Grading Scheme
                  </label>
                  <input
                    type="text"
                    value={edu.gradingScheme}
                    onChange={(e) =>
                      updateEducation(index, "gradingScheme", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={edu.startDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      updateEducation(index, "startDate", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={edu.endDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      updateEducation(index, "endDate", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Address
                  </label>
                  <input
                    type="text"
                    value={edu.address}
                    onChange={(e) =>
                      updateEducation(index, "address", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    value={edu.city}
                    onChange={(e) =>
                      updateEducation(index, "city", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    State
                  </label>
                  <input
                    type="text"
                    value={edu.state}
                    onChange={(e) =>
                      updateEducation(index, "state", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Country
                  </label>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option?.name || ""}
                    value={
                      countries.find((c) => c.name === edu.country) || null
                    }
                    onChange={(_, newValue) =>
                      updateEducation(index, "country", newValue?.name || "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <MapPin size={16} className="text-gray-400" />
                              </InputAdornment>
                              {params?.InputProps?.startAdornment}
                            </>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "46px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                          },
                        }}
                      />
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={edu.postalCode}
                    onChange={(e) =>
                      updateEducation(index, "postalCode", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={() =>
            onSave({ highestAcademic, educationHistory })
          }
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

import {Building } from "lucide-react";

interface WorkExperienceTabProps {
  data: any;
  onSave: (data: any) => void;
  saving: boolean;
}

export function WorkExperienceTab({
  data,
  onSave,
  saving,
}: WorkExperienceTabProps) {
  const [workExperience, setWorkExperience] = useState<any[]>([]);

  useEffect(() => {
    if (data?.profile?.otherDetails?.workExperience) {
      setWorkExperience(data.profile.otherDetails.workExperience);
    }
  }, [data]);

  const addWork = () => {
    setWorkExperience([
      ...workExperience,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      },
    ]);
  };

  const removeWork = (index: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const updateWork = (index: number, field: string, value: any) => {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [field]: value };
    setWorkExperience(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Briefcase size={20} className="text-[#F26D44]" />
          Work Experience
        </h3>
        <button
          onClick={addWork}
          className="px-4 py-2 bg-[#F26D44] text-white rounded-lg text-sm font-medium hover:bg-[#E05D34] transition flex items-center gap-2"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {workExperience.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Briefcase size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 font-medium">No work experience added</p>
          <p className="text-sm text-gray-500 mt-1">
            Click "Add Experience" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {workExperience.map((work, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">
                  Experience #{index + 1}
                </h4>
                <button
                  onClick={() => removeWork(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Company Name
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
                    <Building size={16} className="text-gray-400" />
                    <input
                      type="text"
                      value={work.company}
                      onChange={(e) =>
                        updateWork(index, "company", e.target.value)
                      }
                      placeholder="Enter company name"
                      className="flex-1 outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Position/Title
                  </label>
                  <input
                    type="text"
                    value={work.position}
                    onChange={(e) =>
                      updateWork(index, "position", e.target.value)
                    }
                    placeholder="Enter your position"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={work.startDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      updateWork(index, "startDate", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={work.endDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      updateWork(index, "endDate", e.target.value)
                    }
                    disabled={work.currentlyWorking}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] disabled:opacity-50"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase cursor-pointer">
                    <input
                      type="checkbox"
                      checked={work.currentlyWorking}
                      onChange={(e) =>
                        updateWork(
                          index,
                          "currentlyWorking",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-[#F26D44] rounded"
                    />
                    Currently Working Here
                  </label>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Description
                  </label>
                  <textarea
                    value={work.description}
                    onChange={(e) =>
                      updateWork(index, "description", e.target.value)
                    }
                    rows={3}
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={() => onSave({ workExperience })}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}



interface TestInformationTabProps {
  data: any;
  onSave: (data: any) => void;
  saving: boolean;
}

export function TestInformationTab({
  data,
  onSave,
  saving,
}: TestInformationTabProps) {
  const [englishProficiencyScore, setEnglishProficiencyScore] = useState({
    englishStatus: "",
    englishTest: "",
    reading: "",
    listening: "",
    writing: "",
    speaking: "",
    examDate: "",
  });

  const [hasGmat, setHasGmat] = useState(false);
  const [gmatScore, setGmatScore] = useState({
    totalScore: { score: "", rank: "" },
    verbal: { score: "", rank: "" },
    quantitative: { score: "", rank: "" },
    analyticalWriting: { score: "", rank: "" },
    examDate: "",
  });

  const [hasGre, setHasGre] = useState(false);
  const [greScore, setGreScore] = useState({
    totalScore: { score: "", rank: "" },
    verbal: { score: "", rank: "" },
    quantitative: { score: "", rank: "" },
    analyticalWriting: { score: "", rank: "" },
    examDate: "",
  });

  const [satScore, setSatScore] = useState({
    totalScore: { score: "", rank: "" },
    verbal: { score: "", rank: "" },
    quantitative: { score: "", rank: "" },
    analyticalWriting: { score: "", rank: "" },
    examDate: "",
  });

  useEffect(() => {
    if (data?.profile) {
      const profile = data.profile;
      setEnglishProficiencyScore({
        englishStatus: profile.englishProficiencyScore?.englishStatus || "",
        englishTest: profile.englishProficiencyScore?.englishTest || "",
        reading: profile.englishProficiencyScore?.reading || "",
        listening: profile.englishProficiencyScore?.listening || "",
        writing: profile.englishProficiencyScore?.writing || "",
        speaking: profile.englishProficiencyScore?.speaking || "",
        examDate:
          profile.englishProficiencyScore?.examDate?.split("T")[0] || "",
      });
      setHasGmat(profile.hasGmat || false);
      setGmatScore({
        totalScore: {
          score: profile.gmatScore?.totalScore?.score?.toString() || "",
          rank: profile.gmatScore?.totalScore?.rank?.toString() || "",
        },
        verbal: {
          score: profile.gmatScore?.verbal?.score?.toString() || "",
          rank: profile.gmatScore?.verbal?.rank?.toString() || "",
        },
        quantitative: {
          score: profile.gmatScore?.quantitative?.score?.toString() || "",
          rank: profile.gmatScore?.quantitative?.rank?.toString() || "",
        },
        analyticalWriting: {
          score:
            profile.gmatScore?.analyticalWriting?.score?.toString() || "",
          rank: profile.gmatScore?.analyticalWriting?.rank?.toString() || "",
        },
        examDate: profile.gmatScore?.examDate?.split("T")[0] || "",
      });
      setHasGre(profile.hasGre || false);
      setGreScore({
        totalScore: {
          score: profile.greScore?.totalScore?.score?.toString() || "",
          rank: profile.greScore?.totalScore?.rank?.toString() || "",
        },
        verbal: {
          score: profile.greScore?.verbal?.score?.toString() || "",
          rank: profile.greScore?.verbal?.rank?.toString() || "",
        },
        quantitative: {
          score: profile.greScore?.quantitative?.score?.toString() || "",
          rank: profile.greScore?.quantitative?.rank?.toString() || "",
        },
        analyticalWriting: {
          score:
            profile.greScore?.analyticalWriting?.score?.toString() || "",
          rank: profile.greScore?.analyticalWriting?.rank?.toString() || "",
        },
        examDate: profile.greScore?.examDate?.split("T")[0] || "",
      });
      setSatScore({
        totalScore: {
          score: profile.satScore?.totalScore?.score?.toString() || "",
          rank: profile.satScore?.totalScore?.rank?.toString() || "",
        },
        verbal: {
          score: profile.satScore?.verbal?.score?.toString() || "",
          rank: profile.satScore?.verbal?.rank?.toString() || "",
        },
        quantitative: {
          score: profile.satScore?.quantitative?.score?.toString() || "",
          rank: profile.satScore?.quantitative?.rank?.toString() || "",
        },
        analyticalWriting: {
          score:
            profile.satScore?.analyticalWriting?.score?.toString() || "",
          rank: profile.satScore?.analyticalWriting?.rank?.toString() || "",
        },
        examDate: profile.satScore?.examDate?.split("T")[0] || "",
      });
    }
  }, [data]);

  const ScoreSection = ({
    title,
    scores,
    setScores,
    enabled,
    setEnabled,
  }: any) => (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 text-[#F26D44] rounded"
          />
          Taken this test
        </label>
      </div>

      {enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Total Score
            </label>
            <input
              type="number"
              value={scores.totalScore.score}
              onChange={(e) =>
                setScores({
                  ...scores,
                  totalScore: {
                    ...scores.totalScore,
                    score: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Percentile Rank
            </label>
            <input
              type="number"
              value={scores.totalScore.rank}
              onChange={(e) =>
                setScores({
                  ...scores,
                  totalScore: {
                    ...scores.totalScore,
                    rank: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Verbal Score
            </label>
            <input
              type="number"
              value={scores.verbal.score}
              onChange={(e) =>
                setScores({
                  ...scores,
                  verbal: { ...scores.verbal, score: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Verbal Rank
            </label>
            <input
              type="number"
              value={scores.verbal.rank}
              onChange={(e) =>
                setScores({
                  ...scores,
                  verbal: { ...scores.verbal, rank: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Quantitative Score
            </label>
            <input
              type="number"
              value={scores.quantitative.score}
              onChange={(e) =>
                setScores({
                  ...scores,
                  quantitative: {
                    ...scores.quantitative,
                    score: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Quantitative Rank
            </label>
            <input
              type="number"
              value={scores.quantitative.rank}
              onChange={(e) =>
                setScores({
                  ...scores,
                  quantitative: {
                    ...scores.quantitative,
                    rank: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Analytical Writing Score
            </label>
            <input
              type="number"
              value={scores.analyticalWriting.score}
              onChange={(e) =>
                setScores({
                  ...scores,
                  analyticalWriting: {
                    ...scores.analyticalWriting,
                    score: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Analytical Writing Rank
            </label>
            <input
              type="number"
              value={scores.analyticalWriting.rank}
              onChange={(e) =>
                setScores({
                  ...scores,
                  analyticalWriting: {
                    ...scores.analyticalWriting,
                    rank: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Exam Date
            </label>
            <input
              type="date"
              value={scores.examDate}
              onChange={(e) =>
                setScores({ ...scores, examDate: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* English Proficiency */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText size={20} className="text-[#F26D44]" />
          English Proficiency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Status
            </label>
            <select
              value={englishProficiencyScore.englishStatus}
              onChange={(e) =>
                setEnglishProficiencyScore({
                  ...englishProficiencyScore,
                  englishStatus: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            >
              <option value="">Select Status</option>
              <option value="taken">Test Taken</option>
              <option value="not_taken">Not Taken Yet</option>
              <option value="waived">Waived</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Test Type
            </label>
            <select
              value={englishProficiencyScore.englishTest}
              onChange={(e) =>
                setEnglishProficiencyScore({
                  ...englishProficiencyScore,
                  englishTest: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            >
              <option value="">Select Test</option>
              <option value="ielts">IELTS</option>
              <option value="toefl">TOEFL</option>
              <option value="pte">PTE</option>
              <option value="duolingo">Duolingo</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Reading Score
            </label>
            <input
              type="text"
              value={englishProficiencyScore.reading}
              onChange={(e) =>
                setEnglishProficiencyScore({
                  ...englishProficiencyScore,
                  reading: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Listening Score
            </label>
            <input
              type="text"
              value={englishProficiencyScore.listening}
              onChange={(e) =>
                setEnglishProficiencyScore({
                  ...englishProficiencyScore,
                  listening: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Writing Score
            </label>
            <input
              type="text"
              value={englishProficiencyScore.writing}
              onChange={(e) =>
                setEnglishProficiencyScore({
                  ...englishProficiencyScore,
                  writing: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Speaking Score
            </label>
            <input
              type="text"
              value={englishProficiencyScore.speaking}
              onChange={(e) =>
                setEnglishProficiencyScore({
                  ...englishProficiencyScore,
                  speaking: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Exam Date
            </label>
            <input
              type="date"
              value={englishProficiencyScore.examDate}
              onChange={(e) =>
                setEnglishProficiencyScore({
                  ...englishProficiencyScore,
                  examDate: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44]"
            />
          </div>
        </div>
      </div>

      {/* GMAT */}
      <ScoreSection
        title="GMAT Score"
        scores={gmatScore}
        setScores={setGmatScore}
        enabled={hasGmat}
        setEnabled={setHasGmat}
      />

      {/* GRE */}
      <ScoreSection
        title="GRE Score"
        scores={greScore}
        setScores={setGreScore}
        enabled={hasGre}
        setEnabled={setHasGre}
      />

      {/* SAT */}
      <ScoreSection
        title="SAT Score"
        scores={satScore}
        setScores={setSatScore}
        enabled={true}
        setEnabled={() => {}}
      />

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={() =>
            onSave({
              englishProficiencyScore,
              hasGmat,
              gmatScore,
              hasGre,
              greScore,
              satScore,
            })
          }
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}