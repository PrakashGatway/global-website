"use client";

import React, { useState, useEffect, useRef, AnyActionArg, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mail,
    Phone,
    User,
    Loader2,
    ChevronDown,
    Globe,
    Calendar,
    Flag,
    GraduationCap,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Shield,
    Lock,
    Sparkles,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { toast } from "react-hot-toast";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { STUDY_LEVELS } from "@/utils/schema";

interface RegisterStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Country {
    _id?: string;
    code: string;
    name: string;
    dialCode: string;
    flag?: string;
}

interface FormData {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    password: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    intake: string;
    role: string;
    tuitionfee: string;
    passportNumber: string;
    passportExpiry: string;
    firstLanguage: string;
    maritalStatus: string;
    assignedTo: string;
}

type Step = 1 | 2;

const RegisterStudentModal: React.FC<RegisterStudentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countriesList, setCountriesList] = useState<Country[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [countriesLoading, setCountriesLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState([])


    const [formData, setFormData] = useState<any>({
        name: "",
        email: "",
        phone: "",
        countryCode: "+91",
        password: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        firstLanguage: "",
        maritalStatus: "single",
        assignedTo: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});


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
        fetchCategories()
    }, [fetchCategories])

    // Fetch countries and counsellors on mount
    useEffect(() => {
        const fetchData = async () => {
            setCountriesLoading(true);
            try {
                const [countriesRes] = await Promise.all([
                    axiosInstance.get("/countries?limit=250")
                ]);
                setCountriesList(countriesRes.data.data || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setCountriesLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCountryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);


    const validateStep = (step: Step): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = "Name is required";

            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "Please enter a valid email";
            }

            if (!formData.phone.trim()) {
                newErrors.phone = "Phone number is required";
            } else if (!/^\d{7,15}$/.test(formData.phone)) {
                newErrors.phone = "Please enter a valid phone number";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => (prev < 4 ? (prev + 1) as Step : prev));
        } else {
            toast.error("Please fill all required fields");
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => (prev > 1 ? (prev - 1) as Step : prev));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        setLoading(true);

        try {
            const userData = {
                name: formData.name.trim(),
                email: formData.email.toLowerCase().trim(),
                phone: `${formData.phone}`,
                dateOfBirth: formData.dateOfBirth || undefined,
                gender: formData.gender || undefined,
                nationality: formData.nationality || undefined,
                intake: formData.intake || undefined,
                firstLanguage: formData.firstLanguage || undefined,
                maritalStatus: formData.maritalStatus || "single",
                preferences: {
                    preferredCountries: formData.preferredCountries || [],
                    preferredIntake: formData.preferredIntake || [],
                    preferredCourse: formData.preferredCourse || [],
                    level: formData.level || "",
                    budgetRange: {
                        min: Number(formData.budgetMin) || 0,
                        max: Number(formData.budgetMax) || 0,
                    },
                },
                hasAcceptedTerms: true,
            };

            const response = await axiosInstance.post("/users", userData);

            if (response.data.success) {
                setShowSuccess(true);
                toast.success("Student registered successfully! 🎉");
                setTimeout(() => {
                    resetForm();
                    onSuccess();
                    onClose();
                }, 2000);
            }
        } catch (error: any) {
            console.error("Error creating student:", error);
            const errorMsg =
                error.response?.data?.message || "Failed to register student";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            countryCode: "+91",
            password: "",
            dateOfBirth: "",
            gender: "",
            nationality: "",
            firstLanguage: "",
            maritalStatus: "single",
            assignedTo: "",
        });
        setErrors({});
        setCurrentStep(1);
        setShowSuccess(false);
    };

    const currentYear = new Date().getFullYear();

    const yearOptions = Array.from(
        { length: 8 },
        (_, index) => currentYear + index
    );

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const getStepProgress = () => {
        return (currentStep / 2) * 100;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-px"
                    onClick={handleClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    className="relative w-full max-w-5xl bg-white rounded h-[80vh] overflow-hidden flex flex-col"
                >
                    {/* Success Overlay */}
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        initial={{ rotate: -180, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        Successfully Registered!
                                    </h3>
                                    <p className="text-gray-500">
                                        Student has been added to the system
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Header */}
                    <div className="bg-gray-300 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Register New Student
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 bg-white/50 rounded-full transition-colors group"
                        >
                            <X className="w-5 h-5 text-gray-800 group-hover:text-black transition-colors" />
                        </button>
                    </div>



                    <div className="px-6 py-2.5 bg-white relative border-b border-slate-200">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gray-100"
                            initial={{ width: 0 }}
                            animate={{ width: `${getStepProgress()}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                        <div className="flex items-center relative z-1 justify-between">
                            {[1, 2].map((step) => (
                                <div key={step} className="flex items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${currentStep >= step
                                            ? "bg-gradient-to-br from-[#F26D44] to-orange-600 text-white shadow-md"
                                            : "bg-slate-200 text-slate-500"
                                            }`}
                                    >
                                        {currentStep > step ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            step
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm font-medium hidden sm:block ${currentStep >= step ? "text-[#F26D44]" : "text-slate-400"
                                            }`}
                                    >
                                        {step === 1 && "Personal"}
                                        {step === 2 && "Education"}
                                    </span>
                                    {step < 4 && (
                                        <div
                                            className={`w-8 h-0.5 ml-2 hidden sm:block ${currentStep > step ? "bg-[#F26D44]" : "bg-slate-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 overflow-y-auto px-6 py-6"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Step 1: Personal Information */}
                                {currentStep === 1 && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <User className="w-5 h-5 text-[#F26D44]" />
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Personal Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter Name"
                                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${errors.name
                                                            ? "border-red-400 ring-2 ring-red-100"
                                                            : "border-gray-200"
                                                            } rounded focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all`}
                                                    />
                                                </div>
                                                {errors.name && (
                                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Mobile Number <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-2">
                                                    {/* <div className="relative" ref={dropdownRef}>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowCountryDropdown(!showCountryDropdown)
                                                            }
                                                            className="h-[46px] px-3 bg-gray-50 border border-gray-200 rounded flex items-center gap-2 hover:border-[#F26D44] focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 transition-all"
                                                        >
                                                            <Globe className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm font-medium text-gray-700 min-w-[30px]">
                                                                {formData.countryCode}
                                                            </span>
                                                        </button>
                                                    </div> */}

                                                    <div className="relative flex-1">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            placeholder="Mobile Number"
                                                            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${errors.phone
                                                                ? "border-red-400 ring-2 ring-red-100"
                                                                : "border-gray-200"
                                                                } rounded focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all`}
                                                        />
                                                    </div>
                                                </div>
                                                {errors.phone && (
                                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Email Address */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter Email Address"
                                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${errors.email
                                                            ? "border-red-400 ring-2 ring-red-100"
                                                            : "border-gray-200"
                                                            } rounded focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all`}
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Date of Birth
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="date"
                                                        name="dateOfBirth"
                                                        value={formData.dateOfBirth}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Gender
                                                </label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Nationality
                                                </label>

                                                <Autocomplete
                                                    options={countriesList}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    value={
                                                        countriesList.find(
                                                            (country) => country.name === formData.nationality
                                                        ) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            nationality: newValue?.name || "",
                                                        }));
                                                    }}
                                                    isOptionEqualToValue={(option, value) =>
                                                        option.name === value.name
                                                    }
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            height: "46px",
                                                            backgroundColor: "#F9FAFB",
                                                            borderRadius: "6px",

                                                            "& fieldset": {
                                                                borderColor: "#E5E7EB",
                                                            },

                                                            "&:hover fieldset": {
                                                                borderColor: "#F26D44",
                                                            },

                                                            "&.Mui-focused fieldset": {
                                                                borderColor: "#F26D44",
                                                                borderWidth: "1.5px",
                                                            },
                                                        },

                                                        "& .MuiInputBase-input": {
                                                            padding: "0 !important",
                                                            fontSize: "14px",
                                                        },
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Select Nationality"
                                                            InputProps={{
                                                                ...(params.InputProps || {}),
                                                                startAdornment: (
                                                                    <>
                                                                        <InputAdornment position="start">
                                                                            <Flag size={16} className="text-gray-400" />
                                                                        </InputAdornment>
                                                                        {params.InputProps?.startAdornment ?? null}
                                                                    </>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                    renderOption={(props, option) => (
                                                        <li {...props}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{option.flag}</span>
                                                                <span>{option.name}</span>
                                                            </div>
                                                        </li>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    First Language
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstLanguage"
                                                    value={formData.firstLanguage}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter First Language"
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Marital Status
                                                </label>
                                                <select
                                                    name="maritalStatus"
                                                    value={formData.maritalStatus}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all"
                                                >
                                                    <option value="single">Single</option>
                                                    <option value="married">Married</option>
                                                    <option value="divorced">Divorced</option>
                                                    <option value="widowed">Widowed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}



                                {/* Step 4: Education & Preferences */}
                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Education & Preferences
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                            {/* Preferred Country */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Preferred Country
                                                </label>

                                                <Autocomplete
                                                    options={countriesList}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    value={
                                                        countriesList.find(
                                                            (country) =>
                                                                country.name === formData.preferredCountries?.[0]
                                                        ) || null
                                                    }
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            height: "46px",
                                                            backgroundColor: "#F9FAFB",
                                                            borderRadius: "6px",

                                                            "& fieldset": {
                                                                borderColor: "#E5E7EB",
                                                            },

                                                            "&:hover fieldset": {
                                                                borderColor: "#F26D44",
                                                            },

                                                            "&.Mui-focused fieldset": {
                                                                borderColor: "#F26D44",
                                                                borderWidth: "1.5px",
                                                            },
                                                        },

                                                        "& .MuiInputBase-input": {
                                                            paddingX: "8px !important",
                                                            fontSize: "16px",
                                                        },
                                                    }}
                                                    onChange={(event, newValue) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            preferredCountries: newValue ? [newValue.name] : [],
                                                        }));
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Select Country"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Intake */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Preferred Intake Year
                                                </label>

                                                <select
                                                    value={formData.preferredIntake?.[0] || ""}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            preferredIntake: [e.target.value],
                                                        }))
                                                    }
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded"
                                                >
                                                    <option value="">Select Year</option>

                                                    {yearOptions.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Preferred Course */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Preferred Course
                                                </label>

                                                <select
                                                    value={formData.preferredCourse?.[0] || ""}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            preferredCourse: [e.target.value],
                                                        }))
                                                    }
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded"
                                                >
                                                    <option value="">Select Year</option>

                                                    {categories.map((item) => (
                                                        <option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Study Level */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Study Level
                                                </label>

                                                <select
                                                    value={formData.level}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            level: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded"
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
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Budget Min ( ₹ )
                                                </label>

                                                <input
                                                    type="number"
                                                    value={formData.budgetMin}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            budgetMin: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded"
                                                />
                                            </div>

                                            {/* Budget Max */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Budget Max ( ₹ )
                                                </label>

                                                <input
                                                    type="number"
                                                    value={formData.budgetMax}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            budgetMax: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </form>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all font-medium"
                        >
                            Cancel
                        </button>

                        <div className="flex items-center gap-3">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-medium flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Previous
                                </button>
                            )}

                            {currentStep < 2 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 transition-all font-medium flex items-center gap-2 shadow-lg shadow-[#F26D44]/25"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 transition-all font-medium flex items-center gap-2 shadow-lg shadow-[#F26D44]/25"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            Register Student
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RegisterStudentModal;