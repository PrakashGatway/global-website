"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail, Phone, Calendar, Globe, MapPin, Lock,
  Shield, Bell, Moon, Sun, CreditCard, Wallet,
  Award, BookOpen, Heart, Clock, CheckCircle,
  AlertCircle, Camera, Edit2, Save, X,
  DollarSign, Eye, EyeOff, Settings, UserCircle,
  FileText, MessageCircle, HelpCircle, RefreshCw
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import { useGlobal } from "@/src/statecontext"
import FormRenderer from "../../../components/dashboard/stepForm/formRender"
import profileSchema from "@/app/data/profileSchema.json"
import { validateForm } from "@/utils/validateForm"
import { useForm, FormProvider } from "react-hook-form"
import * as z from "zod"
import toast from "react-hot-toast"

// Define validation schemas for each step
const profileValidationSchema = z.object({
  profile: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationality: z.string().optional(),
    gender: z.string().optional(),
    firstLanguage: z.string().optional(),
    maritalStatus: z.string().optional(),
    passportExpiry: z.string().optional(),
    passportNumber: z.string().optional(),
  })
});

const addressValidationSchema = z.object({
  address: z.object({
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalcode: z.string().min(1, "Postal code is required"),
  })
});

const educationValidationSchema = z.object({
  education: z.object({
    summary: z.object({
      countryOfEducation: z.string().min(1, "Country of education is required"),
      highestEducationLevel: z.string().min(1, "Highest education level is required"),
      gradingScheme: z.string().optional(),
      graduated: z.string().optional(),
    }),
    schools: z.array(z.object({
      country: z.string().min(1, "Country is required"),
      institutionName: z.string().min(1, "Institution name is required"),
      educationLevel: z.string().min(1, "Education level is required"),
      gradingScheme: z.string().optional(),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      degreeName: z.string().min(1, "Degree name is required"),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalcode: z.string().optional(),
    })).min(1, "At least one education entry is required"),
  })
});

const testScoreValidationSchema = z.object({
  testscore: z.object({
    englishscore: z.object({
      englishStatus: z.string().min(1, "Please select your English test status"),
      englishTest: z.string().optional(),
      reading: z.string().optional(),
      listening: z.string().optional(),
      writing: z.string().optional(),
      speaking: z.string().optional(),
      examDate: z.string().optional(),
      totalScore: z.string().optional(),
    }),
    coursescore: z.object({
      hasGmat: z.any().optional(),
      hasGre: z.any().optional(),
    }),
  })
});

const visaValidationSchema = z.object({
  visaStudypermit: z.object({
    preferredStudyLevel: z.string().min(1, "Preferred study level is required"),
    preferredCountries: z.array(z.string()).min(1, "At least one preferred country is required"),
    preferredIntakes: z.array(z.string()).min(1, "At least one intake is required"),
    budget: z.object({
      min: z.number().min(0, "Minimum budget is required"),
      max: z.number().min(0, "Maximum budget is required"),
      currency: z.string(),
    }),
    visaRefused: z.string().optional(),
    validVisas: z.array(z.string()).optional(),
    visaDetails: z.string().optional(),
  })
});

const documentValidationSchema = z.object({
  Document: z.object({
    Passport: z.string().optional(),
    AcademicDocuments: z.string().optional(),
    UpdatedCV: z.string().optional(),
    ExperienceCertificate: z.string().optional(),
    Photographs: z.string().optional(),
    IELTSscorecard: z.string().optional(),
    LOR: z.string().optional(),
  })
});

// Profile Completion Steps Component
const ProfileCompletionStep = ({
  step,
  title,
  description,
  isCompleted,
  isActive,
  onClick,
  hasError
}: {
  step: number
  title: string
  description: string
  isCompleted: boolean
  isActive: boolean
  onClick: () => void
  hasError?: boolean
}) => (
  <motion.div
    className={`flex items-start gap-3 p-3 rounded-xl border-1 transition-all cursor-pointer
            ${isActive ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'}
            ${isCompleted ? 'opacity-75' : ''}
        `}
    onClick={onClick}
  >
    <div className={`
            w-8 h-8 rounded-full flex items-center justify-center font-semibold
            ${isCompleted
        ? 'bg-green-500 text-white'
        : isActive
          ? 'bg-primary text-primary-foreground'
          : hasError
            ? 'bg-red-500 text-white'
            : 'bg-muted text-muted-foreground'
      }
        `}>
      {isCompleted ? <CheckCircle className="w-5 h-5" /> : step}
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </motion.div>
)

export default function ProfilePage() {
  const router = useRouter();
  const { profile, allProfile, updateProfile } = useGlobal();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'education' | 'testscore' | 'visaStudypermit' | 'Document'>('profile');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [educations, setEducations] = useState<any[]>([]);
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [stepErrors, setStepErrors] = useState<Record<string, boolean>>({});
  const [countries, setCountries] = useState([])

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/countries?limit=300')
      const data = response.data.data
      let formatData = data.map(country => ({ label: country.name, value: country.code }))
      setCountries(formatData)
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
        Passport: "",
        AcademicDocuments: "",
        UpdatedCV: "",
        ExperienceCertificate: "",
        Photographs: "",
        IELTSscorecard: "",
        LOR: ""
      }
    },
    mode: "onChange"
  });

  const { reset, watch, formState: { errors, isValid }, trigger, getValues, setValue } = methods;

  // Function to validate a specific step
  const validateStep = async (step: string): Promise<boolean> => {
    let validationSchema;

    switch (step) {
      case 'profile':
        validationSchema = profileValidationSchema;
        break;
      case 'address':
        validationSchema = addressValidationSchema;
        break;
      case 'education':
        validationSchema = educationValidationSchema;
        break;
      case 'testscore':
        validationSchema = testScoreValidationSchema;
        break;
      case 'visaStudypermit':
        validationSchema = visaValidationSchema;
        break;
      // case 'Document':
      //   validationSchema = documentValidationSchema;
        // break;
      default:
        return true;
    }

    try {
      const values = getValues();
      await validationSchema.parseAsync(values);
      setStepErrors(prev => ({ ...prev, [step]: false }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setStepErrors(prev => ({ ...prev, [step]: true }));
        await trigger(step === 'visaStudypermit' ? 'visaStudypermit' : step);
      }
      return false;
    }
  };

  const handleStepChange = async (step: typeof activeTab) => {
    setActiveTab(step);
  };

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
        tuitionfee : profile.tuitionfee || ''
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
      Document: allProfile?.profile?.documents || {
        Passport: "",
        AcademicDocuments: "",
        UpdatedCV: "",
        ExperienceCertificate: "",
        Photographs: "",
        IELTSscorecard: "",
        LOR: ""
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

  
  const buildProfilePayload = (values) => {
  console.log("Building payload with values:", values);
  
  return {
    currentAddress: {
      addressLine1: values.address?.address1 || "",
      addressLine2: values.address?.address2 || "",
      city: values.address?.city || "",
      state: values.address?.state || "",
      country: values.address?.country || "",
      postalCode: values.address?.postalcode || "",
    },
    highestAcademic: {
      countryOfEducation: values.education?.summary?.countryOfEducation || "",
      highestEducationLevel: values.education?.summary?.highestEducationLevel || "",
      gradingScheme: values.education?.summary?.gradingScheme || "",
      graduated: values.education?.summary?.graduated === "true",
    },
    educationHistory: values.education?.schools?.map((school) => ({
      educationLevel: school.educationLevel,
      institutionName: school.institutionName,
      gradingScheme: school.gradingScheme,
      startDate: school.startDate,
      endDate: school.endDate,
      degreeName: school.degreeName,
      address: school.address,
      city: school.city,
      state: school.state,
      country: school.country,
      postalCode: school.postalcode,
    })) || [],
    englishProficiencyScore: {
      englishStatus: values.testscore?.englishscore?.englishStatus || "",
      englishTest: values.testscore?.englishscore?.englishTest || "",
      reading: values.testscore?.englishscore?.reading || "",
      listening: values.testscore?.englishscore?.listening || "",
      writing: values.testscore?.englishscore?.writing || "",
      speaking: values.testscore?.englishscore?.speaking || "",
      examDate: values.testscore?.englishscore?.examDate || "",
      totalScore: values.testscore?.englishscore?.totalScore || "",
    },
    hasGmat: !!values.testscore?.coursescore?.hasGmat,
    hasGre: !!values.testscore?.coursescore?.hasGre,
    gmatScore: values.testscore?.coursescore?.hasGmat ? {
      totalScore: {
        score: Number(values.testscore.coursescore.hasGmat?.gmatTotal?.score) || null,
        rank: Number(values.testscore.coursescore.hasGmat?.gmatTotal?.rank) || null,
      },
      verbal: {
        score: Number(values.testscore.coursescore.hasGmat?.gmatVerbal?.score) || null,
        rank: Number(values.testscore.coursescore.hasGmat?.gmatVerbal?.rank) || null,
      },
      quantitative: {
        score: Number(values.testscore.coursescore.hasGmat?.gmatQuantitative?.score) || null,
        rank: Number(values.testscore.coursescore.hasGmat?.gmatQuantitative?.rank) || null,
      },
      analyticalWriting: {
        score: Number(values.testscore.coursescore.hasGmat?.gmatAwa?.score) || null,
        rank: Number(values.testscore.coursescore.hasGmat?.gmatAwa?.rank) || null,
      },
      examDate: values.testscore.coursescore.hasGmat?.gmatExamDate || null,
    } : undefined,
    greScore: values.testscore?.coursescore?.hasGre ? {
      totalScore: {
        score: Number(values.testscore.coursescore.hasGre?.greTotal?.score) || null,
        rank: Number(values.testscore.coursescore.hasGre?.greTotal?.rank) || null,
      },
      verbal: {
        score: Number(values.testscore.coursescore.hasGre?.greVerbal?.score) || null,
        rank: Number(values.testscore.coursescore.hasGre?.greVerbal?.rank) || null,
      },
      quantitative: {
        score: Number(values.testscore.coursescore.hasGre?.greQuantitative?.score) || null,
        rank: Number(values.testscore.coursescore.hasGre?.greQuantitative?.rank) || null,
      },
      analyticalWriting: {
        score: Number(values.testscore.coursescore.hasGre?.greAwa?.score) || null,
        rank: Number(values.testscore.coursescore.hasGre?.greAwa?.rank) || null,
      },
      examDate: values.testscore.coursescore.hasGre?.greExamDate || null,
    } : undefined,
    visaRefused: values.visaStudypermit?.visaRefused === "yes",
    validVisas: values.visaStudypermit?.validVisas || [],
    visaRefusedInfo: values.visaStudypermit?.visaDetails || "",
    preferences: {
      preferredCountries: values.visaStudypermit?.preferredCountries || [],
      preferredIntake: values.visaStudypermit?.preferredIntakes || [],
      preferredCourse: values.visaStudypermit?.preferredStudyLevel || "",
      budgetRange: {
        min: values.visaStudypermit?.budget?.min || 0,
        max: values.visaStudypermit?.budget?.max || 0,
      },
    },
        // Include documents in the payload
    documents: {
      ...(allProfile?.profile?.documents || {}),

  ...Object.entries(values?.Document?.documents || {}).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        key: key, // ✅ send field name
        url: value,
        status: value ? "true" : "false",
        
      };

      return acc;
    },
    {}
  )
}
  };
};

  const handleSave = async () => {
  try {
    const isValid = await validateStep(activeTab);
    if (!isValid) {
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast.error("Please fill all required fields");
      return;
    }

    const formValues = methods.getValues();
    console.log("form data", formValues);
    setSaving(true);

    if (activeTab === 'profile') {
      await axiosInstance.put("/auth/profile", formValues.profile);
      toast.success("Profile updated successfully!");
    } else {
      // Build payload including documents
      const payload = buildProfilePayload(formValues);
      console.log(payload, "payload",formValues.documents);
      
      // Send the payload (which includes documents) to profile_info
      await axiosInstance.post("/auth/profile_info", payload);
      toast.success("Profile information updated successfully!");
    }

    updateProfile();
  } catch (err: any) {
    console.error("Save error:", err);
    toast.error(err.response?.data?.message || err.message || "An error occurred while saving your profile.");
  } finally {
    setSaving(false);
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

  // Check completion status for each step
  const isStepCompleted = (step: string) => {
    switch (step) {
      case 'profile':
        return !!(watch('profile.name') && watch('profile.phone') && watch('profile.dateOfBirth'));
      case 'address':
        return !!(watch('address.address1') && watch('address.city') && watch('address.country'));
      case 'education':
        return watch('education.schools')?.length > 0 &&
          watch('education.schools')[0]?.institutionName;
      case 'testscore':
        return !!(watch('testscore.englishscore.englishStatus'));
      case 'visaStudypermit':
        return !!(watch('visaStudypermit.validVisas') &&
          watch('visaStudypermit.validVisas')?.length > 0);
      case 'Document':
        return !!(watch('Document.Passport') && watch('Document.AcademicDocuments'));
      default:
        return false;
    }
  };

  return (
    <FormProvider {...methods}>
      <main className="px-4 flex-1">
        {/* Main Content */}
        <div className="mx-auto mt-3">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Sidebar Navigation */}
            <div className="lg:w-80 ">
              {/* Profile Header */}
              <div className="mb-3">
                <div className="bg-card border border-border rounded-2xl p-3">
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

              <div className="bg-card border border-border rounded-2xl p-6 sticky top-[43px]">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Complete Your Profile
                </h3>
                <div className="space-y-2">
                  <ProfileCompletionStep
                    step={1}
                    title="Basic Information"
                    description="Add your personal details"
                    isCompleted={isStepCompleted('profile')}
                    isActive={activeTab === 'profile'}
                    hasError={stepErrors.profile}
                    onClick={() => handleStepChange('profile')}
                  />
                  {profile?.role !== "counsellor" && (
                    <>
                      <ProfileCompletionStep
                        step={2}
                        title="Address Information"
                        description="Add your address details"
                        isCompleted={isStepCompleted('address')}
                        isActive={activeTab === 'address'}
                        hasError={stepErrors.address}
                        onClick={() => handleStepChange('address')}
                      />
                      <ProfileCompletionStep
                        step={3}
                        title="Education History"
                        description="Add your academic background"
                        isCompleted={isStepCompleted('education')}
                        isActive={activeTab === 'education'}
                        hasError={stepErrors.education}
                        onClick={() => handleStepChange('education')}
                      />

                      <ProfileCompletionStep
                        step={4}
                        title="Document Upload"
                        description="Add your academic & other documents"
                        isCompleted={isStepCompleted('Document')}
                        isActive={activeTab === 'Document'}
                        hasError={stepErrors.Document}
                        onClick={() => handleStepChange('Document')}
                      />
{/* 
                      <ProfileCompletionStep
                        step={5}
                        title="Test Scores"
                        description="Add your standardized test scores"
                        isCompleted={isStepCompleted('testscore')}
                        isActive={activeTab === 'testscore'}
                        hasError={stepErrors.testscore}
                        onClick={() => handleStepChange('testscore')}
                      />
                      <ProfileCompletionStep
                        step={6}
                        title="Visa & Study Permit"
                        description="Set your visa details"
                        isCompleted={isStepCompleted('visaStudypermit')}
                        isActive={activeTab === 'visaStudypermit'}
                        hasError={stepErrors.visaStudypermit}
                        onClick={() => handleStepChange('visaStudypermit')}
                      /> */}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                  >
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-6">
                        {profileSchema[activeTab]?.title}
                      </h2>

                      {/* Render form based on active tab */}
                      <div className="space-y-6">
                        <FormRenderer
                          schema={profileSchema[activeTab]}
                          sectionKey={activeTab}
                          countries={countries}
                        />

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 border-t border-border">
                          <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {saving ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </FormProvider>
  );
}