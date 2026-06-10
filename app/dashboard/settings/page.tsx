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

export default function ProfilePage() {
  const router = useRouter();

  const { profile, allProfile, updateProfile } = useGlobal();
  const [activeTab, setActiveTab] = useState("overview");
  const menuItems = [
    { key: "overview", label: "Overview" },
    { key: "documents", label: "Documents" },
    { key: "preference", label: "Preferences" }
  ];

  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [educations, setEducations] = useState<any[]>([]);
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [countries, setCountries] = useState([])

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/countries?limit=300')
      const data = response.data.data
      setCountries(data)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }, [])

  useEffect(() => {
    fetchCountries()
  }, [fetchCountries])

  // Initialize React Hook Form with validation
  const methods = useForm<any>({
    defaultValues: {
      profile: {
        name: '',
        phone: '',
        dateOfBirth: '',
        nationality: '',
        gender: '',
        firstLanguage: '',
        maritalStatus: '',
        passportExpiry: '',
        passportNumber: '',
        intake: '',
        tuitionfee: '',
      },
      address: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        postalcode: ''
      },
      education: {
        summary: {
          countryOfEducation: '',
          highestEducationLevel: '',
          gradingScheme: '',
          graduated: ''
        },
        schools: [
          {
            country: '',
            institutionName: '',
            educationLevel: '',
            gradingScheme: '',
            startDate: '',
            endDate: '',
            degreeName: '',
            address: '',
            city: '',
            state: '',
            postalcode: ''
          }
        ]
      },
      testscore: {
        englishscore: {
          englishStatus: "",
          englishTest: "",
          reading: "",
          listening: "",
          writing: "",
          speaking: "",
          examDate: "",
          totalScore: ""
        },
        coursescore: {
          hasGmat: {
            gmatTotal: { score: "", rank: "" },
            gmatVerbal: { score: "", rank: "" },
            gmatQuantitative: { score: "", rank: "" },
            gmatAwa: { score: "", rank: "" },
            gmatExamDate: ""
          },
          hasGre: {
            greTotal: { score: "", rank: "" },
            greVerbal: { score: "", rank: "" },
            greQuantitative: { score: "", rank: "" },
            greAwa: { score: "", rank: "" },
            greExamDate: ""
          }
        }
      },
      visaStudypermit: {
        preferredStudyLevel: '',
        preferredCountries: [],
        preferredIntakes: [],
        budget: {
          min: 0,
          max: 0,
          currency: 'USD'
        },
        visaRefused: '',
        validVisas: [],
        visaDetails: ''
      },
      Document: {
        academicDocuments: {
          tenthMarksheet: "",
          twelfthMarksheet: "",
        },
        otherDocuments: {
          UpdatedCV: "",
          ExperienceCertificate: "",
          Photographs: "",
          IELTSscorecard: "",
          LOR: "",
        }
      }
    },
    mode: "onChange"
  });

  const { reset, watch, formState: { errors, isValid }, trigger, getValues, setValue } = methods;

  useEffect(() => {
    if (!profile) return;

    const formatDate = (date: string) => {
      return date ? date.split('T')[0] : '';
    };

    reset({
      profile: {
        name: profile.name || '',
        phone: profile.phone || '',
        dateOfBirth: formatDate(profile.dateOfBirth),
        nationality: profile.nationality || '',
        gender: profile.gender || '',
        firstLanguage: profile.firstLanguage || '',
        maritalStatus: profile.maritalStatus || '',
        passportExpiry: formatDate(profile.passportExpiry),
        passportNumber: profile.passportNumber || '',
        intake: profile.intake || '',
        tuitionfee: profile.tuitionfee || ''
      },
      address: allProfile?.profile?.currentAddress && {
        address1: allProfile.profile.currentAddress.addressLine1 || '',
        address2: allProfile.profile.currentAddress.addressLine2 || '',
        city: allProfile.profile.currentAddress.city || '',
        state: allProfile.profile.currentAddress.state || '',
        country: allProfile.profile.currentAddress.country || '',
        postalcode: allProfile.profile.currentAddress.postalCode || ''
      },
      education: {
        schools: allProfile?.profile?.educationHistory && allProfile.profile?.educationHistory.map((school: any) => ({
          country: school.country || '',
          institutionName: school.institutionName || '',
          educationLevel: school.educationLevel || '',
          gradingScheme: school.gradingScheme || '',
          graduationDate: formatDate(school.graduationDate),
          startDate: formatDate(school.startDate),
          endDate: formatDate(school.endDate),
          degreeName: school.degreeName || '',
          address: school.address || '',
          city: school.city || '',
          state: school.state || '',
          postalCode: school.postalCode || ''
        })),
        summary: allProfile?.profile?.highestAcademic && {
          countryOfEducation: allProfile.profile.highestAcademic.countryOfEducation || '',
          highestEducationLevel: allProfile.profile.highestAcademic.highestEducationLevel || '',
          gradingScheme: allProfile.profile.highestAcademic.gradingScheme || '',
          graduated: allProfile.profile.highestAcademic.graduated ? "yes" : 'no'
        }
      },
      testscore: {
        englishscore: {
          englishStatus: allProfile.profile.englishProficiencyScore?.englishStatus || '',
          englishTest: allProfile.profile.englishProficiencyScore?.englishTest || '',
          reading: allProfile.profile.englishProficiencyScore?.reading || '',
          listening: allProfile.profile.englishProficiencyScore?.listening || '',
          writing: allProfile.profile.englishProficiencyScore?.writing || '',
          speaking: allProfile.profile.englishProficiencyScore?.speaking || '',
          examDate: formatDate(allProfile.profile.englishProficiencyScore?.examDate),
          totalScore: allProfile.profile.englishProficiencyScore?.totalScore || ''
        },
        coursescore: {
          hasGmat: allProfile.profile.hasGmat ? {
            gmatTotal: { score: allProfile.profile.gmatScore?.totalScore?.score || '', rank: allProfile.profile.gmatScore?.totalScore?.rank || '' },
            gmatVerbal: { score: allProfile.profile.gmatScore?.verbal?.score || '', rank: allProfile.profile.gmatScore?.verbal?.rank || '' },
            gmatQuantitative: { score: allProfile.profile.gmatScore?.quantitative?.score || '', rank: allProfile.profile.gmatScore?.quantitative?.rank || '' },
            gmatAwa: { score: allProfile.profile.gmatScore?.analyticalWriting?.score || '', rank: allProfile.profile.gmatScore?.analyticalWriting?.rank || '' },
            gmatExamDate: formatDate(allProfile.profile.gmatScore?.examDate)
          } : allProfile.profile.hasGmat,
          hasGre: allProfile.profile.hasGre ? {
            greTotal: { score: allProfile.profile.greScore?.totalScore?.score || '', rank: allProfile.profile.greScore?.totalScore?.rank || '' },
            greVerbal: { score: allProfile.profile.greScore?.verbal?.score || '', rank: allProfile.profile.greScore?.verbal?.rank || '' },
            greQuantitative: { score: allProfile.profile.greScore?.quantitative?.score || '', rank: allProfile.profile.greScore?.quantitative?.rank || '' },
            greAwa: { score: allProfile.profile.greScore?.analyticalWriting?.score || '', rank: allProfile.profile.greScore?.analyticalWriting?.rank || '' },
            greExamDate: formatDate(allProfile.profile.greScore?.examDate)
          } : allProfile.profile.hasGre
        }
      },
      visaStudypermit: {
        preferredStudyLevel: allProfile.profile.preferences?.preferredStudyLevel || '',
        preferredCountries: allProfile.profile.preferences?.preferredCountries || [],
        preferredIntakes: allProfile.profile.preferences?.preferredIntakes || [],
        budget: allProfile.profile.preferences?.budget || { min: 0, max: 0, currency: 'USD' },
        visaRefused: allProfile.profile.visaRefused ? 'yes' : 'no',
        validVisas: allProfile.profile.validVisas || [],
        visaDetails: allProfile.profile.visaRefusedInfo || ''
      },
      // FIXED: Updated Document structure to match new schema
      Document: {
        academicDocuments: {
          tenthMarksheet: allProfile?.profile?.documents?.academic?.tenthMarksheet || "",
          twelfthMarksheet: allProfile?.profile?.documents?.academic?.twelfthMarksheet || "",
        },
        otherDocuments: {
          UpdatedCV: allProfile?.profile?.documents?.other?.cv || "",
          ExperienceCertificate: allProfile?.profile?.documents?.other?.experience || "",
          Photographs: allProfile?.profile?.documents?.other?.photograph || "",
          IELTSscorecard: allProfile?.profile?.documents?.other?.ieltsScorecard || "",
          LOR: allProfile?.profile?.documents?.other?.lor || "",
        }
      }
    });

    setEducations(allProfile.profile.educations || []);
    setWorkExperiences(allProfile.profile.workExperiences || []);
    setLoading(false);
  }, [profile, allProfile, reset]);

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
    <FormProvider {...methods}>
      <main className="px-4 flex-1">
        {/* Main Content */}
        <div className="mx-auto mt-3">
          <div className="flex flex-col lg:flex-row gap-3">
           <div className="lg:w-80 sticky top-6 self-start">
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </FormProvider>
  );
}