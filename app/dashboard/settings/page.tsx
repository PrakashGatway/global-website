"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail,
  AlertCircle, Camera,
  FileText, MessageCircle, HelpCircle, RefreshCw
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { useGlobal } from "@/src/statecontext"
import { useForm, FormProvider } from "react-hook-form"
import toast from "react-hot-toast"
import Documents from "@/components/couseller/Documents"
import ProfileTabs from "@/components/couseller/ProfileSteps"
import { STUDY_LEVELS } from "@/utils/schema"

export default function ProfilePage() {
  const router = useRouter();

  const { profile, allProfile, updateProfile } = useGlobal();
  const [activeTab, setActiveTab] = useState("overview");

  const [categories, setCategories] = useState([])
  const menuItems = [
    { key: "overview", label: "Overview" },
    { key: "documents", label: "Documents" },
    { key: "preference", label: "Preferences" }
  ];
  
  const menuItems1 = [
    { key: "/dashboard/support", label: "Support" },
    { key: "/dashboard/notifications", label: "Notificaions" },
    { key: "/dashboard/payment", label: "Payments" },
    { key: "/dashboard/application", label: "Application" },
    { key: "/dashboard/accommodation", label:"Accommodation"},
    { key: "/dashboard/visa", label:"Visa"}
  ];

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [educations, setEducations] = useState<any[]>([]);
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [countries, setCountries] = useState([])

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/countries?limit=300')
      const data = response?.data?.data
      setCountries(data)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }, [])

  useEffect(() => {
    fetchCountries()
  }, [fetchCountries])

  // Initialize React Hook Form with validation
  const { handleSubmit, register, getValues, setValue, reset } = useForm();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const response = await axiosInstance.put('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      profile({ ...profile, profileImage: response.data.url });
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };


  const onSubmit = async () => {
    const allValues = getValues();

    const payload = {
      preferredCountries: allValues.countryInterested
        ? [allValues.countryInterested]
        : [],
      preferredCourse: allValues.studyPreference
        ? [allValues.studyPreference]
        : [],
      level: allValues.studyLevel || "",
      budgetRange: {
        min: Number(allValues.budgetMin) || 0,
        max: Number(allValues.financialFunds) || 0,
      },
      preferredIntake: allValues.intake
        ? [allValues.intake]
        : [],
    };

    try {
      await axiosInstance.put("/auth/profile", {
        preferences: payload,
      });
      updateProfile()
      toast.success("Preferences updated successfully");

    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to update preferences"
      );
    }
  };


  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/courses/categories?limit=300')
      const data = response.data.data
      let formatData = data.map(category => ({ label: category.name, value: category.slug, icon: category.icon, description: category.description }))
      setCategories(formatData)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  useEffect(() => {
    const pref = allProfile?.profile?.preferences;

    if (!pref) return;

    reset({
      countryInterested: pref?.preferredCountries?.[0] || "",
      intake: pref?.preferredIntake?.[0] || "",
      studyPreference: pref?.preferredCourse?.[0] || "",
      studyLevel: pref?.level || "",
      budgetMin: pref?.budgetRange?.min || "",
      financialFunds: pref?.budgetRange?.max || "",
    });
    fetchCategories()
  }, [allProfile, reset]);

  console.log(categories)



  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }




  return (
    <main className="px-4 flex-1">
      {/* Main Content */}
      <div className="mx-auto mt-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="lg:w-80 md:sticky top-6 self-start">
            <div className="mb-3 ">
              <div className="bg-card border border-border p-3">
                <div className="flex flex-col md:flex-row w-full items-center gap-3">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/30 overflow-hidden shadow-md">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <User className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow hover:scale-105 transition cursor-pointer"
                    >
                      {uploadingImage ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Camera className="w-3 h-3" />
                      )}
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>

                  {/* User Info */}
                  <div className="flex !w-full flex-col overflow-hidden text-center md:text-left">
                    <h1 className="text-base font-bold mb-1 capitalize">
                      {profile?.name || 'User'}
                    </h1>
                    <p className="text-muted-foreground text-sm word-break flex items-center justify-center md:justify-start gap-1">
                      <Mail className="w-4 h-4" />
                      {profile?.email || 'No email found'}
                    </p>

                    {profile?.role !== "counsellor" && (<div className="mt-2 max-w-xl">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Profile Completion</span>
                        <span className="font-semibold text-primary">
                          {allProfile?.profile?.profileCompletion}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${allProfile?.profile?.profileCompletion}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border space-y-1 p-2">
              {menuItems.map((item) => (
                <motion.div
                  key={item.key}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.key)}
                  className="relative cursor-pointer px-5 py-4"
                >
                  {activeTab === item.key && (
                    <motion.div
                      layoutId="activeSidebar"
                      className="absolute inset-0 bg-green-50 border-l-4 border-green-500"
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3">
                    <FileText
                      className={`w-4 h-4 ${activeTab === item.key
                        ? "text-green-700"
                        : "text-gray-500"
                        }`}
                    />

                    <span
                      className={`text-sm ${activeTab === item.key
                        ? "font-semibold text-green-700"
                        : "text-gray-700"
                        }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div className="block md:hidden">
                
               {menuItems1.map((item) => (
                <motion.div
                  key={item.key}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(item.key)}
                  className="relative cursor-pointer px-5 py-4"
                >
                 
                  <div className="relative z-10 flex items-center gap-3">
                    <FileText
                      className={`w-4 h-4 ${activeTab === item.key
                        ? "text-green-700"
                        : "text-gray-500"
                        }`}
                    />

                    <span
                      className={`text-sm ${activeTab === item.key
                        ? "font-semibold text-green-700"
                        : "text-gray-700"
                        }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="flex-1">
            <div className="flex-1">
              {activeTab === "overview" && (
                <ProfileTabs
                  studentId={profile?._id}
                  user={profile}
                  profile={allProfile?.profile}
                  countriesList={countries}
                  onUpdate={updateProfile}
                />
              )}
              {activeTab === "documents" && (
                <Documents
                  profile={allProfile?.profile}
                  studentId={profile?._id}
                  onUpdate={updateProfile}
                />
              )}

              {activeTab === "preference" && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Education & Preferences
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Preferred Country */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preferred Country
                        </label>

                        <select
                          {...register("countryInterested")}
                          className="w-full h-12 px-4 border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        >
                          <option value="">Select Country</option>

                          {countries?.map((item) => (
                            <option key={item?.name} value={item?.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Intake Year */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preferred Intake Year
                        </label>

                        <select
                          {...register("intake")}
                          className="w-full h-12 px-4 border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        >
                          <option value="">Select Year</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                        </select>
                      </div>

                      {/* Preferred Course */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preferred Course
                        </label>

                        <select
                          {...register("studyPreference")}
                          className="w-full h-12 px-4 border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        >
                          <option value="">Select Course</option>
                          {categories?.map((item) =>
                            <option key={item?.value} value={item.value}>
                              {item.label}</option>
                          )}
                        </select>
                      </div>

                      {/* Study Level */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Study Level
                        </label>

                        <select
                          {...register("studyLevel")}
                          className="w-full h-12 px-4 border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        >
                          <option value="">Select Level</option>
                          {STUDY_LEVELS.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Budget Min */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Budget Min (₹)
                        </label>

                        <input
                          type="number"
                          {...register("budgetMin")}
                          placeholder="Enter Minimum Budget"
                          className="w-full h-12 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        />
                      </div>

                      {/* Budget Max */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Budget Max (₹)
                        </label>

                        <input
                          type="number"
                          {...register("financialFunds")}
                          placeholder="Enter Maximum Budget"
                          className="w-full h-12 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-300"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}