"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Mail, Phone, Calendar, Globe, MapPin, Lock,
    Shield, Bell, Moon, Sun, CreditCard, Wallet,
    Award, BookOpen, Heart, Clock, CheckCircle,
    AlertCircle, Camera, Edit2, Save, X, ChevronRight,
    LogOut, Trash2, Download, Upload, Flag, Users,
    GraduationCap, Briefcase, Home, Star, TrendingUp,
    DollarSign, Eye, EyeOff, Settings, UserCircle,
    FileText, MessageCircle, HelpCircle, RefreshCw
} from "lucide-react"
import axiosInstance from "@/app/axiosInstance"
import Image from "next/image"
import { format } from "date-fns"
import { useGlobal } from "@/src/statecontext"
import FormRenderer from "../../../components/dashboard/stepForm/formRender"
import { profileSchema } from "@/config/schema"
import { validateForm } from "@/utils/validateForm"
import { useForm, FormProvider } from "react-hook-form"

interface Education {
    _id?: string
    level: string
    institution: string
    country: string
    fieldOfStudy: string
    startDate: string
    endDate: string
    grade: string
    isCurrent: boolean
}

interface WorkExperience {
    _id?: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    isCurrent: boolean
    description: string
}

interface Application {
    _id: string
    universityId: string
    universityName: string
    courseId: string
    courseName: string
    status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected'
    submittedDate: string
    decisionDate?: string
}

// Profile Completion Steps Component
const ProfileCompletionStep = ({
    step,
    title,
    description,
    isCompleted,
    isActive,
    onClick
}: {
    step: number
    title: string
    description: string
    isCompleted: boolean
    isActive: boolean
    onClick: () => void
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

// Education Card Component
const EducationCard = ({
    education,
    onEdit,
    onDelete
}: {
    education: Education
    onEdit: () => void
    onDelete: () => void
}) => (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="font-semibold">{education.fieldOfStudy}</h4>
                <p className="text-sm text-muted-foreground">{education.institution}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={onEdit} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={onDelete} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <GraduationCap className="w-3 h-3" />
            <span>{education.level}</span>
            <span>•</span>
            <MapPin className="w-3 h-3" />
            <span>{education.country}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
            <span>{format(new Date(education.startDate), 'MMM yyyy')} - {education.isCurrent ? 'Present' : format(new Date(education.endDate), 'MMM yyyy')}</span>
            <span className="font-medium">Grade: {education.grade}</span>
        </div>
    </div>
)

// Work Experience Card Component
const WorkCard = ({
    work,
    onEdit,
    onDelete
}: {
    work: WorkExperience
    onEdit: () => void
    onDelete: () => void
}) => (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="font-semibold">{work.title}</h4>
                <p className="text-sm text-muted-foreground">{work.company}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={onEdit} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={onDelete} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" />
            <span>{work.location}</span>
        </div>
        <p className="text-sm mb-2 line-clamp-2">{work.description}</p>
        <div className="text-xs text-muted-foreground">
            {format(new Date(work.startDate), 'MMM yyyy')} - {work.isCurrent ? 'Present' : format(new Date(work.endDate), 'MMM yyyy')}
        </div>
    </div>
)

// Main Profile Page Component
interface ProfileFormData {
  profile: {
    name: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    gender: 'male' | 'female' | 'other' | '';
    firstLanguage: string;
    maritalStatus: string;
    passportExpiry: string;
    passportNumber: string;
  };
  address: {
    address1: string;
    address2: string
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  education: {
    countryOfEducation: string;
    highestEducationLevel: string;
    gradingScheme: string;
    gradeAverage: string;
    graduated: string;
  };
  testscore: {
    ielts?: string;
    toefl?: string;
    pte?: string;
    gre?: string;
    gmat?: string;
  };
  visaStudypermit: {
    preferredStudyLevel: string;
    preferredCountries: string[];
    preferredIntakes: string[];
    budget: {
      min: number;
      max: number;
      currency: string;
    };
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile , allprofile} = useGlobal();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'education' | 'testscore' | 'visaStudypermit'>('profile');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [educations, setEducations] = useState<any[]>([]);
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);

// const profiledata = profiledata?.data




    const [countries, setCountries] = useState([])
      const [page, setPage] = useState(1)
    

    const [filters, setFilters] = useState({
        country: "",
        city: "",
        uni_type: "",
        has_accommodation: "",
        min_acceptance_rate: "",
        max_acceptance_rate: "",
        sort_by: "name",
        sort_order: "asc"
      })
  

      const fetchCountries = useCallback(async () => {
          try {
            const response = await axiosInstance.get('/countries?limit=300')
            const data = response.data.data
            let formatData = data.map(country => ({ label: country.name, value: country.code }))
            setCountries(formatData)
          } catch (error) {
            console.error('Error fetching countries:', error)
          }
        })
      
        useEffect(() => {
          fetchCountries()
        },[])


          const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPage(1)
  }

  // Initialize React Hook Form
  const methods = useForm<ProfileFormData>({
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
        passportNumber: ''
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

  // ⭐ repeatable array
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
  // Match the 'sections' key from your schema
  englishscore: {
    // Match the first radio field name
    englishStatus: "", 
    // Match the nested radio field name (inside children)
    englishTest: "", 
    
    // Optional: Pre-fill score fields if needed, otherwise empty strings work
    reading: "",
    listening: "",
    writing: "",
    speaking: "",
    examDate: "",
    totalScore: ""
  },
  
  // Match the 'coursescore' section
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
        }
      }
    }

  });

  const { reset, watch, formState: { errors } } = methods;

  // Fetch user data and reset form
  useEffect(() => {
    if (!profile && !allprofile) return;

    // Format dates properly
    const formatDate = (date: string) => {
      return date ? date.split('T')[0] : '';
    };

    // Reset form with profile data
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
        passportNumber: profile.passportNumber || ''
      },
      address: {
        address1: profile.address?.address1 || '',
        address2: profile.address?.address2 || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        country: profile.address?.country || '',
        postalcode: profile.address?.postalcode || ''
      },
      education: {
        countryOfEducation: profile.education?.countryOfEducation || '',
        highestEducationLevel: profile.education?.highestEducationLevel || '',
        gradingScheme: profile.education?.gradingScheme || '',
        gradeAverage: profile.education?.gradeAverage || '',
        graduated: profile.education?.graduated || ''
      },
      testscore: {
        ielts: profile.testScores?.ielts || '',
        toefl: profile.testScores?.toefl || '',
        pte: profile.testScores?.pte || '',
        gre: profile.testScores?.gre || '',
        gmat: profile.testScores?.gmat || ''
      },
      visaStudypermit: {
        preferredStudyLevel: profile.preferences?.preferredStudyLevel || '',
        preferredCountries: profile.preferences?.preferredCountries || [],
        preferredIntakes: profile.preferences?.preferredIntakes || [],
        budget: profile.preferences?.budget || { min: 0, max: 0, currency: 'USD' }
      }
    });

    setEducations(profile.educations || []);
    setWorkExperiences(profile.workExperiences || []);
    setLoading(false);
  }, [profile, reset]);

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
      // Update profile image in context
      profile({ ...profile, profileImage: response.data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
  const subscription = methods.watch((value) => {
    console.log("LIVE FORM DATA 🔥", value);
  });

  return () => subscription.unsubscribe();
}, [methods]);



const buildProfilePayload = (values) => {
  return {
    // ADDRESS
    currentAddress: {
      addressLine1: values.address.address1,
      addressLine2: values.address.address2,
      city: values.address.city,
      state: values.address.state,
      country: values.address.country,
      postalCode: values.address.postalcode,
    },

    // EDUCATION SUMMARY
    highestAcademic: {
      countryOfEducation:
        values.education.summary.countryOfEducation,
      highestEducationLevel:
        values.education.summary.highestEducationLevel,
      gradingScheme:
        values.education.summary.gradingScheme,
      graduated:
        values.education.summary.graduated === "true",
    },

    // EDUCATION HISTORY
    educationHistory:
      values.education.schools?.map((school) => ({
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

    // ENGLISH TEST
    englishProficiencyScore: {
      englishStatus:
        values.testscore.englishscore.englishStatus,
      englishTest:
        values.testscore.englishscore.englishTest,
      reading: values.testscore.englishscore.reading,
      listening: values.testscore.englishscore.listening,
      writing: values.testscore.englishscore.writing,
      speaking: values.testscore.englishscore.speaking,
      examDate: values.testscore.englishscore.examDate,
    },

   // FLAGS (convert object → boolean)
hasGmat: !!values.testscore.coursescore.hasGmat,
hasGre: !!values.testscore.coursescore.hasGre,

// GMAT SCORE
gmatScore: values.testscore.coursescore.hasGmat
  ? {
      totalScore: {
        score: Number(
          values.testscore.coursescore.hasGmat?.gmatTotal?.score
        ) || null,
        rank: Number(
          values.testscore.coursescore.hasGmat?.gmatTotal?.rank
        ) || null,
      },
      verbal: {
        score: Number(
          values.testscore.coursescore.hasGmat?.gmatVerbal?.score
        ) || null,
        rank: Number(
          values.testscore.coursescore.hasGmat?.gmatVerbal?.rank
        ) || null,
      },
      quantitative: {
        score: Number(
          values.testscore.coursescore.hasGmat?.gmatQuantitative?.score
        ) || null,
        rank: Number(
          values.testscore.coursescore.hasGmat?.gmatQuantitative?.rank
        ) || null,
      },
      analyticalWriting: {
        score: Number(
          values.testscore.coursescore.hasGmat?.gmatAwa?.score
        ) || null,
        rank: Number(
          values.testscore.coursescore.hasGmat?.gmatAwa?.rank
        ) || null,
      },
      examDate:
        values.testscore.coursescore.hasGmat?.gmatExamDate || null,
    }
  : undefined,

  // ✅ GRE SCORE
greScore: values.testscore.coursescore.hasGre
  ? {
      totalScore: {
        score: Number(
          values.testscore.coursescore.hasGre?.greTotal?.score
        ) || null,
        rank: Number(
          values.testscore.coursescore.hasGre?.greTotal?.rank
        ) || null,
      },
      verbal: {
        score: Number(
          values.testscore.coursescore.hasGre?.greVerbal?.score
        ) || null,
        rank: Number(
          values.testscore.coursescore.hasGre?.greVerbal?.rank
        ) || null,
      },
      quantitative: {
        score: Number(
          values.testscore.coursescore.hasGre?.greQuantitative?.score
        ) || null,
        rank: Number(
          values.testscore.coursescore.hasGre?.greQuantitative?.rank
        ) || null,
      },
      analyticalWriting: {
        score: Number(
          values.testscore.coursescore.hasGre?.greAwa?.score
        ) || null,
        rank: Number(
          values.testscore.coursescore.hasGre?.greAwa?.rank
        ) || null,
      },
      examDate:
        values.testscore.coursescore.hasGre?.greExamDate || null,
    }
  : undefined,

    // STUDY PREFERENCES
   // ================= VISA =================
visaRefused:
  values.visaStudypermit.visaRefused === "yes",

validVisas:
  values.visaStudypermit.validVisas || [],

visaRefusedInfo:
  values.visaStudypermit.visaDetails || "",

// ================= STUDY PREFERENCES =================
preferences: {
  preferredCountries:
    values.visaStudypermit.preferredCountries,
  preferredIntake:
    values.visaStudypermit.preferredIntakes,
  preferredCourse:
    values.visaStudypermit.preferredStudyLevel,
  budgetRange: {
    min: values.visaStudypermit.budget.min,
    max: values.visaStudypermit.budget.max,
  },
},
  };
};


  const handleSave = async () => {
  try {
    setSaving(true);

    const formValues = methods.getValues();
    console.log("FINAL FORM VALUES", formValues);

    const payload = buildProfilePayload(formValues);

    await axiosInstance.post(
      "/auth/profile_info",
      payload
    );

  } catch (err) {
    console.error(err);
  } finally {
    setSaving(false);
  }
};

  // Calculate profile completion
  const calculateCompletion = () => {
    const values = methods.getValues();
    let completed = 0;
    const total = 5;

    if (values.profile.name && values.profile.phone && values.profile.dateOfBirth) completed++;
    if (values.address.address1 && values.address.address2 && values.address.city && values.address.country) completed++;
    if (educations.length > 0) completed++;
    if (values.testscore.ielts || values.testscore.toefl) completed++;
    if (values.visaStudypermit.preferredStudyLevel) completed++;

    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  

  const completionPercentage = calculateCompletion();

  return (
    <FormProvider {...methods}>
      <main className="flex-1 sm:px-6 min-h-0">
        {/* Profile Header */}
        <div className="container mx-auto mt-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-primary/30 overflow-hidden shadow-md">
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
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
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
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-1 capitalize">
                  {profile?.name || 'User'}
                </h1>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {profile?.email || 'No email found'}
                </p>

                <div className="mt-2 max-w-xl">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profile Completion</span>
                    <span className="font-semibold text-primary">
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto mt-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-[73px]">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Complete Your Profile
                </h3>
                <div className="space-y-2">
                  <ProfileCompletionStep
                    step={1}
                    title="Basic Information"
                    description="Add your personal details"
                    isCompleted={!!(watch('profile.name') && watch('profile.phone') && watch('profile.dateOfBirth'))}
                    isActive={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                  />
                  <ProfileCompletionStep
                    step={2}
                    title="Address Information"
                    description="Add your address details"
                    isCompleted={!!(watch('address.address') && watch('address.city'))}
                    isActive={activeTab === 'address'}
                    onClick={() => setActiveTab('address')}
                  />
                  <ProfileCompletionStep
                    step={3}
                    title="Education History"
                    description="Add your academic background"
                    isCompleted={educations.length > 0}
                    isActive={activeTab === 'education'}
                    onClick={() => setActiveTab('education')}
                  />
                  <ProfileCompletionStep
                    step={4}
                    title="Test Scores"
                    description="Add your standardized test scores"
                    isCompleted={!!(watch('testscore.ielts') || watch('testscore.toefl'))}
                    isActive={activeTab === 'testscore'}
                    onClick={() => setActiveTab('testscore')}
                  />
                  <ProfileCompletionStep
                    step={5}
                    title="Study Preferences"
                    description="Set your course preferences"
                    isCompleted={!!watch('visaStudypermit.preferredStudyLevel')}
                    isActive={activeTab === 'visaStudypermit'}
                    onClick={() => setActiveTab('visaStudypermit')}
                  />
                </div>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
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

                      {/* Education List (if needed) */}
                      {activeTab === 'education' && educations.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-border">
                          <h3 className="font-semibold mb-4">Saved Education</h3>
                          {educations.map((edu, index) => (
                            <div key={index} className="bg-muted/30 rounded-lg p-4 mb-3">
                              <p className="font-medium">{edu.institution}</p>
                              <p className="text-sm text-muted-foreground">
                                {edu.degree} - {edu.fieldOfStudy}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

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
      </main>
    </FormProvider>
  );
}