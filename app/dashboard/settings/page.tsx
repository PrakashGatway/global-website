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
    const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'work' | 'preferences' | 'security' | 'applications'>('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [saving, setSaving] = useState(false)

    const { profile } = useGlobal()
    console.log(profile)

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

    const [educationForm, setEducationForm] = useState<Education>({
        level: '',
        institution: '',
        country: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: '',
        isCurrent: false
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


    // Fetch user data
    useEffect(() => {
        setUser(profile)
        setLoading(false)
    }, [profile])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('image', file)

        try {
            setUploadingImage(true)
            const response = await axiosInstance.post('/users/profile/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setUser(prev => prev ? { ...prev, profileImage: response.data.result.url } : null)
        } catch (error) {
            console.error('Error uploading image:', error)
        } finally {
            setUploadingImage(false)
        }
    }
    const handleProfileUpdate = async () => {
        try {
            setSaving(true)
            const response = await axiosInstance.patch('/users/profile', profileForm)
            setUser(prev => prev ? { ...prev, ...response.data.result } : null)
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="flex-1 sm:px-6">
            <div className="">
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* Profile Image */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full border-4 p-2 border-primary/30 overflow-hidden shadow-md">
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
                        <div className="bg-card  border border-border min-h-[80vh] rounded-2xl p-6 sticky top-[73px]">
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
                                    isCompleted={!!(user?.name && user?.phone && user?.dateOfBirth)}
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
                                    title="Work Experience"
                                    description="Add your professional experience"
                                    isCompleted={workExperiences.length > 0}
                                    isActive={activeTab === 'work'}
                                    onClick={() => setActiveTab('work')}
                                />
                                <ProfileCompletionStep
                                    step={5}
                                    title="Study Preferences"
                                    description="Set your course preferences"
                                    isCompleted={!!user?.metadata?.preferredStudyLevel}
                                    isActive={activeTab === 'preferences'}
                                    onClick={() => setActiveTab('preferences')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-card border border-border rounded-2xl p-6 min-h-[70vh]">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold">Personal Information</h2>
                                            <button
                                                onClick={() => { setIsEditing(!isEditing), setProfileForm(prev => ({ ...prev, name: user?.name || '', phone: user?.phone || '', dateOfBirth: user?.dateOfBirth || '' })) }}
                                                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                            >
                                                {isEditing ? (
                                                    <>
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </>
                                                ) : (
                                                    <>
                                                        <Edit2 className="w-4 h-4" />
                                                        Edit
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Full Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.name}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Email</label>
                                                        <input
                                                            type="email"
                                                            value={user?.email}
                                                            disabled
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            value={profileForm.phone}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">First Language</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.firstLanguage}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, firstLanguage: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={profileForm.dateOfBirth}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Nationality</label>
                                                        <select
                                                            value={profileForm.nationality}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, nationality: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        >
                                                            <option value="">Select Nationality</option>
                                                            <option value="USA">United States</option>
                                                            <option value="UK">United Kingdom</option>
                                                            <option value="Canada">Canada</option>
                                                            <option value="Australia">Australia</option>
                                                            <option value="India">India</option>
                                                            {/* Add more countries */}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Gender</label>
                                                        <select
                                                            value={profileForm.gender}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value as any }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Passport Number</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm?.passportNumber}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, passportNumber: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={profileForm.passportExpiry}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, passportExpiry: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Marital Status</label>
                                                        <select
                                                            value={profileForm.maritalStatus}
                                                            onChange={(e) => setProfileForm(prev => ({ ...prev, maritalStatus: e.target.value as any }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="single">Single</option>
                                                            <option value="married">Married</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={handleProfileUpdate}
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
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                                                        <p className="font-medium">{user?.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                                                        <p className="font-medium">{user?.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Phone</p>
                                                        <p className="font-medium">{user?.phone || 'Not provided'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                                                        <p className="font-medium">
                                                            {user?.dateOfBirth ? format(new Date(user.dateOfBirth), 'MMMM dd, yyyy') : 'Not provided'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Nationality</p>
                                                        <p className="font-medium">{user?.nationality || 'Not provided'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">First Language</p>
                                                        <p className="font-medium">{user?.firstLanguage || 'Not provided'}</p>
                                                    </div>
                                                       <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Marital Status</p>
                                                        <p className="font-medium">{user?.maritalStatus || 'Not provided'}</p>
                                                    </div>
                                                       <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Passport Number</p>
                                                        <p className="font-medium">{user?.passportNumber || 'Not provided'}</p>
                                                    </div>
                                                     <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Passport Expiry</p>
                                                        <p className="font-medium">{user?.passportExpiry || 'Not provided'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Gender</p>
                                                        <p className="font-medium capitalize">{user?.gender || 'Not provided'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Education Tab */}
                            {activeTab === 'education' && (
                                <motion.div
                                    key="education"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold">Education History</h2>
                                            <button
                                                onClick={() => {
                                                    setEducationForm({
                                                        level: '',
                                                        institution: '',
                                                        country: '',
                                                        fieldOfStudy: '',
                                                        startDate: '',
                                                        endDate: '',
                                                        grade: '',
                                                        isCurrent: false
                                                    })
                                                    setEditingEducationIndex(null)
                                                    setShowEducationForm(true)
                                                }}
                                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                Add Education
                                            </button>
                                        </div>

                                        {showEducationForm && (
                                            <div className="mb-6 p-6 border-2 border-primary/20 rounded-xl bg-primary/5">
                                                <h3 className="font-semibold mb-4">
                                                    {editingEducationIndex !== null ? 'Edit Education' : 'Add New Education'}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Level</label>
                                                        <select
                                                            value={educationForm.level}
                                                            onChange={(e) => setEducationForm(prev => ({ ...prev, level: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        >
                                                            <option value="">Select Level</option>
                                                            <option value="High School">High School</option>
                                                            <option value="Bachelor's">Bachelor's</option>
                                                            <option value="Master's">Master's</option>
                                                            <option value="PhD">PhD</option>
                                                            <option value="Diploma">Diploma</option>
                                                            <option value="Certificate">Certificate</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Institution</label>
                                                        <input
                                                            type="text"
                                                            value={educationForm.institution}
                                                            onChange={(e) => setEducationForm(prev => ({ ...prev, institution: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Country</label>
                                                        <input
                                                            type="text"
                                                            value={educationForm.country}
                                                            onChange={(e) => setEducationForm(prev => ({ ...prev, country: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Field of Study</label>
                                                        <input
                                                            type="text"
                                                            value={educationForm.fieldOfStudy}
                                                            onChange={(e) => setEducationForm(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Start Date</label>
                                                        <input
                                                            type="date"
                                                            value={educationForm.startDate}
                                                            onChange={(e) => setEducationForm(prev => ({ ...prev, startDate: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">End Date</label>
                                                        <input
                                                            type="date"
                                                            value={educationForm.endDate}
                                                            onChange={(e) => setEducationForm(prev => ({ ...prev, endDate: e.target.value }))}
                                                            disabled={educationForm.isCurrent}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background disabled:bg-muted"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Grade</label>
                                                        <input
                                                            type="text"
                                                            value={educationForm.grade}
                                                            onChange={(e) => setEducationForm(prev => ({ ...prev, grade: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                            placeholder="e.g., 3.8 GPA, First Class"
                                                        />
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={educationForm.isCurrent}
                                                                onChange={(e) => setEducationForm(prev => ({ ...prev, isCurrent: e.target.checked }))}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">I am currently studying here</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <button
                                                        onClick={() => {
                                                            setShowEducationForm(false)
                                                            setEditingEducationIndex(null)
                                                        }}
                                                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleProfileUpdate}
                                                        disabled={saving}
                                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                                    >
                                                        {saving ? (
                                                            <>
                                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4" />
                                                                {editingEducationIndex !== null ? 'Update' : 'Save'}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {educations.length > 0 ? (
                                                educations.map((edu, index) => (
                                                    <EducationCard
                                                        key={edu._id}
                                                        education={edu}
                                                        onEdit={() => {
                                                            setEducationForm(edu)
                                                            setEditingEducationIndex(index)
                                                            setShowEducationForm(true)
                                                        }}
                                                        onDelete={() => {
                                                            const updated = educations.filter((_, i) => i !== index)
                                                            setEducations(updated)
                                                            axiosInstance.patch('/users/profile', {
                                                                metadata: { ...user?.metadata, education: updated }
                                                            })
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <div className="text-center py-12">
                                                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                    <h3 className="font-semibold mb-2">No Education History</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Add your educational background to help us find the right programs for you.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Work Experience Tab */}
                            {activeTab === 'work' && (
                                <motion.div
                                    key="work"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold">Work Experience</h2>
                                            <button
                                                onClick={() => {
                                                    setWorkForm({
                                                        title: '',
                                                        company: '',
                                                        location: '',
                                                        startDate: '',
                                                        endDate: '',
                                                        isCurrent: false,
                                                        description: ''
                                                    })
                                                    setEditingWorkIndex(null)
                                                    setShowWorkForm(true)
                                                }}
                                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                Add Experience
                                            </button>
                                        </div>

                                        {showWorkForm && (
                                            <div className="mb-6 p-6 border-2 border-primary/20 rounded-xl bg-primary/5">
                                                <h3 className="font-semibold mb-4">
                                                    {editingWorkIndex !== null ? 'Edit Experience' : 'Add New Experience'}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Job Title</label>
                                                        <input
                                                            type="text"
                                                            value={workForm.title}
                                                            onChange={(e) => setWorkForm(prev => ({ ...prev, title: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Company</label>
                                                        <input
                                                            type="text"
                                                            value={workForm.company}
                                                            onChange={(e) => setWorkForm(prev => ({ ...prev, company: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Location</label>
                                                        <input
                                                            type="text"
                                                            value={workForm.location}
                                                            onChange={(e) => setWorkForm(prev => ({ ...prev, location: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">Start Date</label>
                                                        <input
                                                            type="date"
                                                            value={workForm.startDate}
                                                            onChange={(e) => setWorkForm(prev => ({ ...prev, startDate: e.target.value }))}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">End Date</label>
                                                        <input
                                                            type="date"
                                                            value={workForm.endDate}
                                                            onChange={(e) => setWorkForm(prev => ({ ...prev, endDate: e.target.value }))}
                                                            disabled={workForm.isCurrent}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background disabled:bg-muted"
                                                        />
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={workForm.isCurrent}
                                                                onChange={(e) => setWorkForm(prev => ({ ...prev, isCurrent: e.target.checked }))}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">I currently work here</span>
                                                        </label>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-sm font-medium mb-1 block">Description</label>
                                                        <textarea
                                                            value={workForm.description}
                                                            onChange={(e) => setWorkForm(prev => ({ ...prev, description: e.target.value }))}
                                                            rows={3}
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                            placeholder="Describe your responsibilities and achievements..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <button
                                                        onClick={() => {
                                                            setShowWorkForm(false)
                                                            setEditingWorkIndex(null)
                                                        }}
                                                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleProfileUpdate}
                                                        disabled={saving}
                                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                                    >
                                                        {saving ? (
                                                            <>
                                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4" />
                                                                {editingWorkIndex !== null ? 'Update' : 'Save'}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {workExperiences.length > 0 ? (
                                                workExperiences.map((work, index) => (
                                                    <WorkCard
                                                        key={work._id}
                                                        work={work}
                                                        onEdit={() => {
                                                            setWorkForm(work)
                                                            setEditingWorkIndex(index)
                                                            setShowWorkForm(true)
                                                        }}
                                                        onDelete={() => {
                                                            const updated = workExperiences.filter((_, i) => i !== index)
                                                            setWorkExperiences(updated)
                                                            axiosInstance.patch('/users/profile', {
                                                                metadata: { ...user?.metadata, workExperience: updated }
                                                            })
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <div className="text-center py-12">
                                                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                    <h3 className="font-semibold mb-2">No Work Experience</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Add your professional experience to strengthen your profile.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <motion.div
                                    key="preferences"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-6">Study Preferences</h2>

                                        <div className="space-y-6">
                                            {/* Preferred Study Level */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Preferred Study Level</label>
                                                <select
                                                    value={preferencesForm.preferredStudyLevel}
                                                    onChange={(e) => setPreferencesForm(prev => ({ ...prev, preferredStudyLevel: e.target.value }))}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                >
                                                    <option value="">Select Level</option>
                                                    <option value="undergraduate">Undergraduate</option>
                                                    <option value="postgraduate">Postgraduate</option>
                                                    <option value="diploma">Diploma</option>
                                                    <option value="certificate">Certificate</option>
                                                    <option value="phd">PhD</option>
                                                </select>
                                            </div>

                                            {/* Preferred Countries */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Preferred Countries</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'New Zealand', 'Ireland'].map((country) => (
                                                        <label key={country} className="flex items-center gap-2 p-2 border border-border rounded-lg hover:bg-muted">
                                                            <input
                                                                type="checkbox"
                                                                value={country}
                                                                checked={preferencesForm.preferredCountries.includes(country)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setPreferencesForm(prev => ({
                                                                            ...prev,
                                                                            preferredCountries: [...prev.preferredCountries, country]
                                                                        }))
                                                                    } else {
                                                                        setPreferencesForm(prev => ({
                                                                            ...prev,
                                                                            preferredCountries: prev.preferredCountries.filter(c => c !== country)
                                                                        }))
                                                                    }
                                                                }}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">{country}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Preferred Intakes */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Preferred Intakes</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                                                        <label key={month} className="flex items-center gap-2 p-2 border border-border rounded-lg hover:bg-muted">
                                                            <input
                                                                type="checkbox"
                                                                value={month}
                                                                checked={preferencesForm.preferredIntakes.includes(month)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setPreferencesForm(prev => ({
                                                                            ...prev,
                                                                            preferredIntakes: [...prev.preferredIntakes, month]
                                                                        }))
                                                                    } else {
                                                                        setPreferencesForm(prev => ({
                                                                            ...prev,
                                                                            preferredIntakes: prev.preferredIntakes.filter(m => m !== month)
                                                                        }))
                                                                    }
                                                                }}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">{month}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Budget Range */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Annual Budget (USD)</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <input
                                                            type="number"
                                                            value={preferencesForm.budget.min}
                                                            onChange={(e) => setPreferencesForm(prev => ({
                                                                ...prev,
                                                                budget: { ...prev.budget, min: parseInt(e.target.value) }
                                                            }))}
                                                            placeholder="Min"
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="number"
                                                            value={preferencesForm.budget.max}
                                                            onChange={(e) => setPreferencesForm(prev => ({
                                                                ...prev,
                                                                budget: { ...prev.budget, max: parseInt(e.target.value) }
                                                            }))}
                                                            placeholder="Max"
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Test Scores */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Test Scores</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">IELTS</span>
                                                        <input
                                                            type="text"
                                                            value={preferencesForm.testScores.ielts}
                                                            onChange={(e) => setPreferencesForm(prev => ({
                                                                ...prev,
                                                                testScores: { ...prev.testScores, ielts: e.target.value }
                                                            }))}
                                                            placeholder="e.g., 6.5"
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">TOEFL</span>
                                                        <input
                                                            type="text"
                                                            value={preferencesForm.testScores.toefl}
                                                            onChange={(e) => setPreferencesForm(prev => ({
                                                                ...prev,
                                                                testScores: { ...prev.testScores, toefl: e.target.value }
                                                            }))}
                                                            placeholder="e.g., 90"
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">PTE</span>
                                                        <input
                                                            type="text"
                                                            value={preferencesForm.testScores.pte}
                                                            onChange={(e) => setPreferencesForm(prev => ({
                                                                ...prev,
                                                                testScores: { ...prev.testScores, pte: e.target.value }
                                                            }))}
                                                            placeholder="e.g., 60"
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">GRE</span>
                                                        <input
                                                            type="text"
                                                            value={preferencesForm.testScores.gre}
                                                            onChange={(e) => setPreferencesForm(prev => ({
                                                                ...prev,
                                                                testScores: { ...prev.testScores, gre: e.target.value }
                                                            }))}
                                                            placeholder="e.g., 320"
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">GMAT</span>
                                                        <input
                                                            type="text"
                                                            value={preferencesForm.testScores.gmat}
                                                            onChange={(e) => setPreferencesForm(prev => ({
                                                                ...prev,
                                                                testScores: { ...prev.testScores, gmat: e.target.value }
                                                            }))}
                                                            placeholder="e.g., 700"
                                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleProfileUpdate}
                                                    disabled={saving}
                                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                                >
                                                    {saving ? (
                                                        <>
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            Save Preferences
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    )
}