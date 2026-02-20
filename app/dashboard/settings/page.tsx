"use client"

import { useState, useEffect } from "react"
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
export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'education' | 'testscore' | 'visaStudypermit' | 'security' | 'applications'>('profile')
    const [uploadingImage, setUploadingImage] = useState(false)
    const [saving, setSaving] = useState(false)
    const [schools, setSchools] = useState<any[]>([{}]);

    const { profile } = useGlobal()

    // React Hook Form
    const methods = useForm({
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
                address: '',
                city: '',
                state: '',
                country: '',
                postalCode: ''
            },
            education: {
                countryOfEducation: "",
                highestEducationLevel: "",
                gradingScheme: "",
                gradeAverage: "",
                graduated: ""
            }
        }
    })

    const { reset, watch, setValue } = methods

    // Form States
    const [profileForm, setProfileForm] = useState({
        name: '',
        phone: '',
        dateOfBirth: '',
        nationality: '',
        gender: '' as 'male' | 'female' | 'other' | '',
        firstLanguage: '',
        maritalStatus: "",
        passportExpiry: '',
        passportNumber: ''
    })

    const [educationForm, setEducationForm] = useState({
        countryOfEducation: "",
        highestEducationLevel: "",
        gradingScheme: "",
        gradeAverage: "",
        graduated: ""
    })

    const [workForm, setWorkForm] = useState<WorkExperience>({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
    })

    const [preferencesForm, setPreferencesForm] = useState({
        preferredStudyLevel: '',
        preferredCountries: [] as string[],
        preferredIntakes: [] as string[],
        budget: {
            min: 0,
            max: 0,
            currency: 'USD'
        },
        testScores: {
            ielts: '',
            toefl: '',
            pte: '',
            gre: '',
            gmat: ''
        }
    })

    const [educations, setEducations] = useState<Education[]>([])
    const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([])
    const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null)
    const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null)
    const [showEducationForm, setShowEducationForm] = useState(false)
    const [showWorkForm, setShowWorkForm] = useState(false)
    const [errors, setErrors] = useState({})

    // Fetch user data
    useEffect(() => {
        if (!profile) return
        setUser(profile)

        const profileData = {
            ...profile,
            address: profile.address?.address || "",
            city: profile.address?.city || "",
            state: profile.address?.state || "",
            country: profile.address?.country || "",
            postalCode: profile.address?.postalCode || ""
        }

        setProfileForm(prev => ({
            ...prev,
            ...profileData
        }))

        // Reset react-hook-form with user data
        reset({
            profile: {
                name: profile.name || '',
                phone: profile.phone || '',
                dateOfBirth: profile.dateOfBirth
                    ? profile.dateOfBirth.split("T")[0]
                    : "",
                nationality: profile.nationality || '',
                gender: profile.gender || '',
                firstLanguage: profile.firstLanguage || '',
                maritalStatus: profile.maritalStatus || '',
                passportExpiry: profile.passportExpiry
                ? profile.passportExpiry.split("T")[0]
                :"",
                passportNumber: profile.passportNumber || ''
            },
            address: {
                address: profile.address?.address || '',
                city: profile.address?.city || '',
                state: profile.address?.state || '',
                country: profile.address?.country || '',
                postalCode: profile.address?.postalCode || ''
            },
            education: {
                countryOfEducation: profile.education?.countryOfEducation || "",
                highestEducationLevel: profile.education?.highestEducationLevel || "",
                gradingScheme: profile.education?.gradingScheme || "",
                gradeAverage: profile.education?.gradeAverage || "",
                graduated: profile.education?.graduated || ""
            }
        })

        setLoading(false)
    }, [profile, reset])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('image', file)

        try {
            setUploadingImage(true)
            const response = await axiosInstance.put('/upload/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            profile.profileImage = response.data.url
        } catch (error) {
            console.error('Error uploading image:', error)
        } finally {
            setUploadingImage(false)
        }
    }

    const handleProfileUpdate = async (payload: any) => {
        try {
            setSaving(true)
            const response = await axiosInstance.put(
                '/auth/profile',
                payload
            )
            setUser(prev =>
                prev ? { ...prev, ...response.data.result } : null
            )
            profile(response.data.result) // update global
            console.log()
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setSaving(false)
        }
    }

    const addSchool = () => {
        if (schools.length >= 3) return // 🚫 limit
        setSchools(prev => [...prev, {}])
    }

    const removeSchool = (index: number) => {
        setSchools(prev => prev.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        let schema
        let payload

        if (activeTab === "profile") {
            schema = profileSchema.profile
            payload = watch('profile') // ✅ Get from react-hook-form
        }

        if (activeTab === "address") {
            schema = profileSchema.address
            payload = { address: watch('address') }
        }

        if (activeTab === "education") {
            payload = { education: watch('education') }
        }

        if (schema) {
            const validationErrors = validateForm(schema, payload)
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors)
                return
            }
        }

        setErrors({})
        await handleProfileUpdate(payload)
    }

    const handleSectionSave = (sectionKey: string) => {
        console.log("Saving:", sectionKey, educationForm)
        // API call here
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen ">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    const values = watch();

    useEffect(() => {
  console.log("FORM VALUES 👉", values);
}, [values]);

    return (
        <FormProvider {...methods}>
            <main className="flex-1 sm:px-6">
                <div className="">
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full border-4 border-primary/30 overflow-hidden shadow-md">
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.name}
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
                                <h1 className="text-2xl font-bold mb-1 capitalize">{user?.name || 'User'}</h1>
                                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user?.email || "Nomailfound@gmail.com"}
                                </p>

                                <div className="mt-2 max-w-xl">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Profile Completion</span>
                                        <span className="font-semibold text-primary">{10}%</span>
                                    </div>
                                    <div className="h-3 bg-muted rounded-full ">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${10}%` }}
                                            transition={{ duration: 0.6 }}
                                            className="h-full bg-primary rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto mt-3">
                    <div className="flex gap-3">
                        <div className="w-80 flex-shrink-0 sticky top-[30px] self-start">
                            <div className="bg-card border border-border min-h-[80vh] rounded-2xl p-6 sticky top-[73px]">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    Complete Your Profile
                                </h3>
                                <div className="space-y-2">
                                    <ProfileCompletionStep
                                        step={1}
                                        title="Basic Information"
                                        description="Add your personal details"
                                        isCompleted={!!(user?.name && user?.phone && user?.dateOfBirth)}
                                        isActive={activeTab === 'profile'}
                                        onClick={() => setActiveTab('profile')}
                                    />
                                    <ProfileCompletionStep
                                        step={2}
                                        title="Address Information"
                                        description="Add your address details"
                                        isCompleted={!!(user?.address?.address)}
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
                                        description="Add your professional experience"
                                        isCompleted={workExperiences.length > 0}
                                        isActive={activeTab === 'testscore'}
                                        onClick={() => setActiveTab('testscore')}
                                    />
                                    <ProfileCompletionStep
                                        step={5}
                                        title="Study Preferences"
                                        description="Set your course preferences"
                                        isCompleted={!!user?.metadata?.preferredStudyLevel}
                                        isActive={activeTab === 'visaStudypermit'}
                                        onClick={() => setActiveTab('visaStudypermit')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                {Object.entries(profileSchema).map(([key, value]) => (
                                    <div key={key}>
                                        {activeTab === key && (
                                            <>
                                                {value.type === "multi" ?
                                                    <div className="space-y-6">
                                                        {Object.entries(value.sections ?? {}).map(
                                                            ([sectionKey, section]: any) => (
                                                                <motion.div
                                                                    key={sectionKey}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                >
                                                                    <div className="bg-card border rounded-2xl p-6">
                                                                        <h2 className="text-xl font-bold mb-6">
                                                                            {section.title}
                                                                        </h2>

                                                                        {/* SINGLE FORM */}
                                                                        {section.type === "single" && (
                                                                            <>
                                                                                <FormRenderer
                                                                                    schema={section}
                                                                                    formData={educationForm}
                                                                                    setFormData={setEducationForm}
                                                                                    errors={errors}
                                                                                />

                                                                                {/* ✅ SAVE BUTTON */}
                                                                                <div className="flex justify-end mt-6">
                                                                                    <button
                                                                                        onClick={() => handleSectionSave(key)}
                                                                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                                                                                    >
                                                                                        Save & Continue
                                                                                    </button>
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {/* REPEATABLE FORM (Schools) */}
                                                                        {section.type === "repeatable" && (
                                                                            <>
                                                                                {schools.map((school, index) => (
                                                                                    <>
                                                                                        <div
                                                                                            key={index}
                                                                                            className="relative border rounded-xl p-5 mb-10"
                                                                                        >
                                                                                            {/* ✅ Delete Button */}
                                                                                            {schools.length > 1 && (
                                                                                                <button
                                                                                                    onClick={() => removeSchool(index)}
                                                                                                    className="absolute top-3 right-3 text-red-500 text-sm font-medium hover:text-red-700"
                                                                                                >
                                                                                                    Delete
                                                                                                </button>
                                                                                            )}

                                                                                            {/* School Title */}
                                                                                            <h3 className="font-semibold mb-4">
                                                                                                School {index + 1}
                                                                                            </h3>

                                                                                            <FormRenderer
                                                                                                schema={section}
                                                                                                formData={school}
                                                                                                setFormData={(data: any) => {
                                                                                                    setSchools(prev => {
                                                                                                        const updated = [...prev]
                                                                                                        updated[index] = data
                                                                                                        return updated
                                                                                                    })
                                                                                                }}
                                                                                                errors={errors}
                                                                                            />
                                                                                        </div>

                                                                                        {/* ✅ SAVE BUTTON */}
                                                                                        <div className="flex justify-end mt-6">
                                                                                            <button
                                                                                                onClick={() => handleSectionSave(key)}
                                                                                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                                                                                            >
                                                                                                Save & Continue
                                                                                            </button>
                                                                                        </div>
                                                                                    </>
                                                                                ))}

                                                                                {/* ✅ Add Button */}
                                                                                <button
                                                                                    onClick={addSchool}
                                                                                    disabled={schools.length >= 3}
                                                                                    className={`mt-2 font-medium ${schools.length >= 3
                                                                                        ? "text-gray-400 cursor-not-allowed"
                                                                                        : "text-primary hover:underline"
                                                                                        }`}
                                                                                >
                                                                                    + Add Attended School
                                                                                </button>

                                                                                {/* Limit Message */}
                                                                                {schools.length >= 3 && (
                                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                                        Maximum 3 schools allowed
                                                                                    </p>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )
                                                        )}
                                                    </div>
                                                    :
                                                    <motion.div
                                                        key="profile"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        className="space-y-6"
                                                    >
                                                        <div className="bg-card border border-border rounded-2xl p-6 min-h-[70vh]">
                                                            <h2 className="text-xl font-bold mb-6">{value.title}</h2>

                                                            {/* Always show form inputs */}
                                                            <div className="space-y-4">
                                                                <FormRenderer
                                                                    schema={value}
                                                                    formData={watch(key)}
                                                                    setFormData={(data) => {
                                                                        // ✅ Update react-hook-form state directly
                                                                        Object.entries(data).forEach(([field, value]) => {
                                                                            setValue(`${key}.${field}`, value, {
                                                                                shouldValidate: true,
                                                                                shouldDirty: true,
                                                                                shouldTouch: true
                                                                            })
                                                                        })
                                                                    }}
                                                                    errors={errors}
                                                                    sectionKey={key}
                                                                    register={methods.register}
                                                                    control={methods.control}
                                                                    setValue={setValue}
                                                                />

                                                                <div className="flex justify-end">
                                                                    <button
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
                                                }
                                            </>
                                        )}
                                    </div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </FormProvider>
    )
}