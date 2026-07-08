"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Search, UserPlus, Users, Loader2, ArrowLeft, ArrowRight, CheckCircle2
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { toast } from "react-hot-toast";
import RegisterStudentModal from "@/components/couseller/NewUser"; // Adjust path as needed

// --- Types & Constants ---
type FlowStep = 'selection' | 'search_existing' | 'application_form';

interface NewApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// Application Form Steps Configuration
const APP_STEPS = [
    {
        name: "Basic Information",
        fields: [
            { name: "name", label: "Full Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "text", required: true },
            { name: "dateOfBirth", label: "Date of Birth", type: "date" },
            { name: "nationality", label: "Nationality", type: "select" },
            { name: "gender", label: "Gender", type: "select", options: ["male", "female", "other"] },
        ]
    },
    {
        name: "Application Details",
        fields: [
            { name: "destinationCountry", label: "Destination Country", type: "select", required: true },
            { name: "university", label: "University", type: "select", required: true },
            { name: "course", label: "Course", type: "select", required: true },
            { name: "intake", label: "Intake", type: "select" },
        ]
    }
];
// --- Sub-Components ---

// Generic Field Renderer matching the RegisterStudentModal styling
const ModalFieldRenderer = ({ field, value, onChange, options = [], selectedCourse }) => {
    const baseClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all text-sm";

    if (field.type === 'select') {
        const selectOptions = options.length > 0 ? options : (field.options || []).map(o => typeof o === 'string' ? { label: o, value: o } : o);
        //console.log(options)
        return (
            <select value={value || ""} onChange={(e) => onChange(e.target.value)} className={baseClass}>
                <option value="">Select {field.label}</option>
                {selectOptions.map((opt, idx) => (
                    <option key={idx} value={field.name == "nationality" ? opt.label : opt.value}>{opt.label}</option>
                ))}
            </select>
        );
    }

    return (
        <input
            type={field.type || 'text'}
            value={
                field.type === "date"
                    ? value
                        ? new Date(value).toISOString().split("T")[0]
                        : ""
                    : value || ""
            }
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label}`}
            className={baseClass}
        />
    );
};

const SelectionView = ({ onExisting, onNew }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="h-full flex flex-col items-center justify-center gap-6 p-4"
    >
        <p className="text-gray-500 text-center max-w-md text-lg">
            Is this application for an already registered student, or do you need to create a new student profile first?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button
                onClick={onExisting}
                className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#F26D44] hover:bg-orange-50 transition-all group text-left"
            >
                <div className="w-12 h-12 bg-orange-100 text-[#F26D44] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F26D44] group-hover:text-white transition-colors">
                    <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#F26D44]">Existing Student</h3>
                <p className="text-sm text-gray-500 mt-1">Search and select from registered students.</p>
            </button>
            <button
                onClick={onNew}
                className="p-6 border-2 border-gray-200 rounded-2xl hover:border-[#F26D44] hover:bg-orange-50 transition-all group text-left"
            >
                <div className="w-12 h-12 bg-orange-100 text-[#F26D44] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F26D44] group-hover:text-white transition-colors">
                    <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#F26D44]">New Student</h3>
                <p className="text-sm text-gray-500 mt-1">Register a new student to create their application.</p>
            </button>
        </div>
    </motion.div>
);

const SearchView = ({ searchTerm, setSearchTerm, results, isSearching, onSelect, onBack }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="h-full flex flex-col p-6"
    >
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26D44]/20 focus:border-[#F26D44] transition-all"
                autoFocus
            />
            {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F26D44] animate-spin" />}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
            {results.length === 0 && !isSearching && searchTerm && (
                <p className="text-center text-gray-400 py-10">No students found.</p>
            )}
            {!searchTerm && (
                <p className="text-center text-gray-400 py-10">Start typing to search for students...</p>
            )}
            {results.map(student => (
                <button
                    key={student._id}
                    onClick={() => onSelect(student)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-[#F26D44] hover:bg-orange-50 transition-all flex items-center justify-between group"
                >
                    <div>
                        <h4 className="font-semibold uppercase text-gray-800 group-hover:text-[#F26D44]">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.email} • {student.phone}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#F26D44] transition-colors" />
                </button>
            ))}
        </div>

        <div className="pt-4 border-t border-gray-100 mt-4">
            <button onClick={onBack} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all font-medium flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
        </div>
    </motion.div>
);

// --- Main Component ---

const NewApplicationModal: React.FC<NewApplicationModalProps> = ({ isOpen, onClose, onSuccess, selectedCourse }) => {
    const [flowStep, setFlowStep] = useState<FlowStep>('selection');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Application form state
    const [appStep, setAppStep] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic options for application form
    const [countries, setCountries] = useState<any[]>([]);
    const [universities, setUniversities] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [intakes, setIntakes] = useState([]);


    //console.log(selectedCourse)


    // Debounced search effect
    useEffect(() => {
        if (flowStep !== 'search_existing') return;
        if (!searchTerm) {
            setSearchResults([]);
            return;
        }

        const timerId = setTimeout(async () => {
            setIsSearching(true);
            try {
                // Adjust API endpoint as needed
                const res = await axiosInstance.get(`/users?search=${encodeURIComponent(searchTerm)}`);
                setSearchResults(res.data.data || res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timerId);
    }, [searchTerm, flowStep]);

    // Fetch countries for application form
    useEffect(() => {

        if (flowStep === 'application_form') {
            axiosInstance.get('/countries?limit=250')
                .then(res => {
                    const data = res.data.data || res.data || [];
                    setCountries(data.map((c: any) => ({ label: c.name, value: c.code || c.name })));
                })
                .catch(err => console.error(err));
        }
    }, [flowStep]);

    // Fetch universities when destination country changes
    useEffect(() => {
        if (selectedCourse) {
            setFormData((p) => ({ ...p, destinationCountry: selectedCourse?.country }))
        }
        if (formData.destinationCountry || selectedCourse) {
            axiosInstance.get(`/universities`, {
                params: {
                    country: formData.destinationCountry || selectedCourse?.country,
                    isWeb: true,
                    limit: 300,

                },
            })
                .then(res => {
                    const data = res.data.result || res.data || [];
                    setUniversities(data.map((u: any) => ({ label: u.name, value: u._id })));
                    selectedCourse &&
                        setTimeout(() => {
                            setFormData((prev) => ({
                                ...prev,
                                university: selectedCourse?.university?._id,
                            }));
                        }, 100);
                })
                .catch(err => setUniversities([]));
        } else {
            setUniversities([]);
            setCourses([]);
        }
    }, [formData.destinationCountry, selectedCourse?.country]);

    // Fetch courses when university changes
    useEffect(() => {
        if (formData.university) {
            axiosInstance.get(`/courses?university=${formData.university}& isExtra= false`)
                .then(res => {
                    const data = res.data.data || res.data || [];
                    //console.log(data)
                    setCourses(
                        data.map((c) => ({
                            label: c.name,
                            value: c._id,
                            university: c.university,
                            metaInfo: c.metaInfo
                        }))
                    );
                    selectedCourse &&
                        setTimeout(() => {
                            setFormData((prev) => ({
                                ...prev,
                                course: selectedCourse?._id,
                            }));
                        }, 100);
                })
                .catch(err => setCourses([]));
        } else {
            setCourses([]);
        }
    }, [formData.university]);

    const handleSelectExisting = (student) => {
        setSelectedStudent(student);

        setFormData(prev => ({
            ...prev,
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            dateOfBirth: student.dateOfBirth || "",
            nationality: student.nationality || "",
            gender: student.gender || "",

        }));

        setFlowStep("application_form");
    };

    useEffect(() => {
        if (!formData.course) {
            setIntakes([]);
            return;
        }

        const selectedCourse = courses.find(

            (course) => course.value === formData.course
        );

        if (selectedCourse) {
            const intakeOptions = selectedCourse?.metaInfo?.Intakes
                ? selectedCourse.metaInfo.Intakes
                    .split(",")
                    .map((intake: string) => ({
                        label: intake.trim(),
                        value: intake.trim(),
                    }))
                    .filter((item) => item.value)
                : (selectedCourse?.university?.intakes || []).map((intake: string) => ({
                    label: intake,
                    value: intake,
                }));

            setIntakes(intakeOptions);
        }
    }, [formData.course, courses]);



    const handleNewUserSuccess = (newStudent: any) => {
        if (newStudent) {
            setSelectedStudent(newStudent);
            setFormData(prev => ({
                ...prev,
                name: newStudent.name,
                email: newStudent.email,
                phone: newStudent.phone,
            }));
            setFlowStep('application_form');
            toast.success("Student created! Now fill the application details.");
        } else {
            toast.success("Student created! Please search for them to continue.");
            setFlowStep('search_existing');
        }
        setShowRegisterModal(false);
    };

    const handleSubmitApplication = async () => {
        const currentStepFields = APP_STEPS[appStep].fields;
        for (const field of currentStepFields) {
            if (field.required && !formData[field.name]) {
                toast.error(`${field.label} is required`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const payload = {
                student: selectedStudent._id,
                destinationCountry: formData.destinationCountry,
                destinationcourse: formData.course,
                intake: formData.intake
            };
            await axiosInstance.post('/applications/existing_user', payload);
            toast.success("Application submitted successfully!");
            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit application");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetModal = () => {
        setFlowStep('selection');
        setSelectedStudent(null);
        setSearchTerm("");
        setSearchResults([]);
        setAppStep(0);
        setFormData({});
        setUniversities([]);
        setCourses([]);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const getOptionsForField = (fieldName: string) => {
        if (fieldName === 'nationality' || fieldName === 'country' || fieldName === 'destinationCountry') return countries;
        if (fieldName === 'university') return universities;
        if (fieldName === 'course') return courses;
        if (fieldName === "intake") {
            return intakes;
        }
        return [];
    };

    if (!isOpen) return null;

    const currentStepData = APP_STEPS[appStep];

    return (
        <>
            {/* Main Modal */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-px"
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                        className="relative w-full max-w-5xl bg-white rounded h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="bg-gray-300 px-6 py-3 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">
                                {flowStep === 'selection' && "Create New Application"}
                                {flowStep === 'search_existing' && "Select Existing Student"}
                                {flowStep === 'application_form' && `Application for ${selectedStudent?.name}`}
                            </h2>
                            <button onClick={handleClose} className="p-2 hover:bg-white/10 bg-white/50 rounded-full transition-colors group">
                                <X className="w-5 h-5 text-gray-800 group-hover:text-black transition-colors" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <AnimatePresence mode="wait">
                                {flowStep === 'selection' && (
                                    <SelectionView
                                        key="selection"
                                        onExisting={() => setFlowStep('search_existing')}
                                        onNew={() => setShowRegisterModal(true)}
                                    />
                                )}
                                {flowStep === 'search_existing' && (
                                    <SearchView
                                        key="search"
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        results={searchResults}
                                        isSearching={isSearching}
                                        onSelect={handleSelectExisting}
                                        onBack={() => setFlowStep('selection')}
                                    />
                                )}
                                {flowStep === 'application_form' && (
                                    <motion.div
                                        key="app_form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full flex flex-col"
                                    >
                                        {/* Stepper */}
                                        <div className="px-6 py-2.5 bg-white relative border-b border-slate-200">
                                            <motion.div
                                                className="absolute inset-y-0 left-0 bg-gray-100"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((appStep + 1) / APP_STEPS.length) * 100}%` }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                            />
                                            <div className="flex items-center relative z-10 justify-between">
                                                {APP_STEPS.map((step, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${appStep >= idx
                                                            ? "bg-gradient-to-br from-[#F26D44] to-orange-600 text-white shadow-md"
                                                            : "bg-slate-200 text-slate-500"
                                                            }`}>
                                                            {appStep > idx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                                        </div>
                                                        <span className={`text-sm font-medium hidden sm:block ${appStep >= idx ? "text-[#F26D44]" : "text-slate-400"}`}>
                                                            {step.name}
                                                        </span>
                                                        {idx < APP_STEPS.length - 1 && (
                                                            <div className={`w-8 h-0.5 ml-2 hidden sm:block ${appStep > idx ? "bg-[#F26D44]" : "bg-slate-200"}`} />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Form Content */}
                                        <div className="flex-1 overflow-y-auto px-6 py-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentStepData.name}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {currentStepData.fields.map(field => {
                                                    //console.log(field)
                                                    return (

                                                        <div key={field.name} className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700">
                                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                                            </label>
                                                            <ModalFieldRenderer
                                                                field={field}
                                                                value={formData[field.name] }
                                                                onChange={(val) => setFormData(prev => ({ ...prev, [field.name]: val }))}
                                                                options={getOptionsForField(field.name)}
                                                                selectedCourse={selectedCourse}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                            <button
                                                onClick={() => {
                                                    if (appStep === 0) {
                                                        setFlowStep('search_existing'); // Go back to search
                                                    } else {
                                                        setAppStep(prev => prev - 1);
                                                    }
                                                }}
                                                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all font-medium flex items-center gap-2"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                {appStep === 0 ? "Change Student" : "Previous"}
                                            </button>
                                            <div className="flex items-center gap-3">
                                                {appStep < APP_STEPS.length - 1 ? (
                                                    <button
                                                        onClick={() => setAppStep(prev => prev + 1)}
                                                        className="px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 transition-all font-medium flex items-center gap-2 shadow-lg shadow-[#F26D44]/25"
                                                    >
                                                        Next <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={handleSubmitApplication}
                                                        disabled={isSubmitting}
                                                        className="px-6 py-2.5 bg-gradient-to-r from-[#F26D44] to-orange-600 text-white rounded-xl hover:from-[#E05D34] hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 transition-all font-medium flex items-center gap-2 shadow-lg shadow-[#F26D44]/25"
                                                    >
                                                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Application"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Nested Register Student Modal */}
            {showRegisterModal && (
                <RegisterStudentModal
                    isOpen={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                    onSuccess={handleNewUserSuccess}
                />
            )}
        </>
    );
};

export default NewApplicationModal;