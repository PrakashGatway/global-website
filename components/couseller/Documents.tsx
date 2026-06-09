"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileCheck,
    FileText,
    CheckCircle,
    AlertCircle,
    Clock,
    X,
    ChevronDown,
    ChevronUp,
    File,
    Image as ImageIcon,
    Loader2,
    FileX,
} from 'lucide-react';
import axiosInstance from '@/app/axiosInstance';
import toast from 'react-hot-toast';
import { useGlobal } from '@/src/statecontext';

// ─── Types ─────────────────────────────────────────
interface DocumentData {
    url: string;
    status: 'pending' | 'approved' | 'rejected' | string;
    uploadedAt?: string;
    uploadedBy?: string;
    fileName?: string;
    originalName?: string;  // Added original name field
    path?: string;
}

interface Profile {
    documents?: Record<string, DocumentData>;
    [key: string]: any;
}

interface User {
    _id: string;
    name: string;
    email: string;
    [key: string]: any;
}

interface DocumentsProps {
    profile: Profile | null;
    user: User | null;
    studentId: string;
    onUpdate?: () => void;
}

// ─── Document Definitions ─────────────────────────
const MANDATORY_DOCUMENTS = [
    { key: 'passport', name: 'Passport', institution: 'All Universities', description: 'Valid passport with at least 6 months validity' },
    { key: '10th_marksheet', name: 'Std. 10th Marksheet', institution: 'All Universities', description: 'Secondary school certificate' },
    { key: '12th_marksheet', name: 'Std. 12th Marksheet', institution: 'All Universities', description: 'Higher secondary certificate' },
    { key: 'graduation_marksheet', name: 'Graduation Marksheet', institution: 'All Universities', description: 'All semester/year marksheets (if applicable)', optional: true },
    { key: 'ielts_score', name: 'IELTS/TOEFL/PTE Score Card', institution: 'All Universities', description: 'English proficiency test result' },
    { key: 'passport_photo', name: 'Passport Size Photo', institution: 'All Universities', description: 'Recent passport-size photograph' },
];

const NON_MANDATORY_DOCUMENTS = [
    { key: 'cv', name: 'CV / Resume', institution: 'All Universities', description: 'Updated curriculum vitae' },
    { key: 'work_experience', name: 'Work Experience Letter', institution: 'Select Universities', description: 'If you have work experience' },
    { key: 'internship_cert', name: 'Internship Certificate', institution: 'Select Universities', description: 'Internship completion proof' },
    { key: 'other_certificates', name: 'Other Certificates', institution: 'Optional', description: 'Any additional supporting documents' },
];


const DocumentSection: React.FC<any> = ({
    title,
    documents,
    onUpload,
    onView,
    isExpanded,
    onToggle,
    uploadingDoc,
    handleStatusChange,
    updatingStatus,
    statusModal,
    setStatusModal,
    remarks,
    setRemarks,

}) => {
    const completedCount = documents.filter(d => d.data?.url).length;

    const { profile } = useGlobal()


    return (
        <div className="bg-white border border-gray-200 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="text-left">
                        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                        <p className="text-xs text-gray-500">
                            {completedCount} of {documents.length} documents uploaded
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {documents.length === 0 ? (
                            <div className="p-8 text-center">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">No documents in this category</p>
                            </div>
                        ) : (
                            documents.map((doc) => {
                                const isUploading = uploadingDoc === doc.key;
                                return (
                                    <div key={doc.key} className="p-4 relative sm:p-5 hover:bg-gray-50 transition-colors">
                                        <div className="absolute top-1 bottom-1 left-0 bg-orange-500 rounded-r-full w-1.5 shadow-xl flex items-center justify-center" />
                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                            <div className="flex-1 w-full">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {doc.data?.url ? (
                                                        doc.data.status === 'approved' ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                                        ) : doc.data.status === 'rejected' ? (
                                                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                                                        ) : (
                                                            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                                                        )
                                                    ) : null}
                                                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                                        {doc.name}
                                                        {doc.isMandatory && (
                                                            <span className="text-red-500 ml-1" title="Mandatory">*</span>
                                                        )}
                                                    </h4>
                                                </div>

                                                <div className="space-y-1 font-medium">
                                                    {doc.description && (
                                                        <p className="text-xs text-gray-500">{doc.description}</p>
                                                    )}
                                                    {doc.institution && (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-gray-500">Required for:</span>
                                                            <span className="font-medium text-gray-700">{doc.institution}</span>
                                                        </div>
                                                    )}
                                                    {doc.applicationId && (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-gray-500">Required for:</span>
                                                            <span className="font-medium text-gray-700">{doc.applicationId}</span>
                                                        </div>
                                                    )}
                                                    {doc.data?.status === "rejected" && doc.data?.remarks && (
                                                        <div className=" py-1">
                                                            <div className="flex items-start gap-1">
                                                                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                                                                <div>
                                                                    <p className="text-xs text-red-500">
                                                                        {doc?.data?.remarks}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {doc.data?.url && (
                                                        <>
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${doc.data.status === "approved"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : doc.data.status === "rejected"
                                                                            ? "bg-red-100 text-red-700"
                                                                            : "bg-amber-100 text-amber-700"
                                                                        }`}
                                                                >
                                                                    {(doc.data.status || "pending")
                                                                        .charAt(0)
                                                                        .toUpperCase() +
                                                                        (doc.data.status || "pending").slice(1)}
                                                                </span>


                                                                {doc.data.status === "pending" && (profile?.role == "admin" || profile?.role == "counsellor") && (
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() =>
                                                                                setStatusModal({
                                                                                    open: true,
                                                                                    docKey: doc.key,
                                                                                    status: "approved",
                                                                                })
                                                                            }
                                                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                                                        >
                                                                            Approve
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                setStatusModal({
                                                                                    open: true,
                                                                                    docKey: doc.key,
                                                                                    status: "rejected",
                                                                                })
                                                                            }
                                                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col my-auto justify-center items-center sm:items-end gap-2 w-full sm:w-auto">

                                                {isUploading ? (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-lg">
                                                        <Loader2 className="w-4 h-4 animate-spin text-[#F26D44]" />
                                                        <span className="text-xs font-medium text-gray-600">Uploading...</span>
                                                    </div>
                                                ) : !doc.data?.url ? (
                                                    <button
                                                        className="px-3 py-1.5 bg-[#F26D44] text-white rounded-lg"
                                                        onClick={() => onUpload(doc.key, doc.name)}
                                                    >
                                                        Upload
                                                    </button>
                                                ) : doc.data.status === "rejected" ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => onView(doc.data!.url)}
                                                            className="px-3 py-1.5 bg-gray-100 rounded-lg"
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            onClick={() => onUpload(doc.key, doc.name)}
                                                            className="px-3 py-1.5 bg-[#F26D44] text-white rounded-lg"
                                                        >
                                                            Re-upload
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="px-3 py-1.5 bg-gray-100 rounded-lg"

                                                        onClick={() => onView(doc.data!.url)}
                                                    >
                                                        View
                                                    </button>
                                                )}
                                                {doc.data?.uploadedAt && (
                                                    <div className="flex items-center gap-2 text-xs font-medium">
                                                        <span className="text-gray-500">Uploaded:</span>
                                                        <span className="text-gray-700">
                                                            {new Date(doc.data.uploadedAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {statusModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white w-full max-w-lg p-6 font-medium"
                        >
                            <h3 className="text-lg text-gray-700 font-bold mb-1">
                                Confirm Document Review
                            </h3>

                            <p className="text-sm text-gray-600 mb-4">
                                Are you sure you want to{" "}
                                <span
                                    className={`font-semibold ${statusModal.status === "approved"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {statusModal.status}
                                </span>{" "}
                                this document?
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Comment
                                    {statusModal.status === "rejected" && (
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    )}
                                </label>

                                <textarea
                                    value={remarks}
                                    onChange={(e) =>
                                        setRemarks(e.target.value)
                                    }
                                    rows={4}
                                    placeholder={
                                        statusModal.status === "approved"
                                            ? "Optional comment..."
                                            : "Enter rejection reason..."
                                    }
                                    className="w-full border p-3 text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setStatusModal({
                                            open: false,
                                            docKey: "",
                                            status: "",
                                        });
                                        setRemarks("");
                                    }}
                                    className="px-4 py-1.5 border hover:bg-green-800 cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleStatusChange}
                                    disabled={updatingStatus}
                                    className={`px-4 py-1.5 hover:bg-green-800 cursor-pointer text-white ${statusModal.status === "approved"
                                        ? "bg-green-600"
                                        : "bg-red-600"
                                        }`}
                                >
                                    {updatingStatus
                                        ? "Processing..."
                                        : `Confirm ${statusModal.status}`}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Main Documents Component ─────────────────────
const Documents: React.FC<DocumentsProps> = ({ application, profile, studentId, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'your-documents' | 'ooshas-documents'>('your-documents');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'not-uploaded'>('all');
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        mandatory: true,
        'non-mandatory': false,
        ooshas: true,
    });


    console.log(profile?.documents && JSON.parse(profile?.documents), "profile");

    const { profile: user } = useGlobal();

    const [requirementModal, setRequirementModal] = useState(false);
    const [requirementForm, setRequirementForm] = useState({
        docName: "",
        description: "",
        isMandatory: true
    });


    const [statusModal, setStatusModal] = useState({
        open: false,
        docKey: "",
        status: "" as "approved" | "rejected" | "",
    });

    const [remarks, setRemarks] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentUploadKey, setCurrentUploadKey] = useState<string | null>(null);
    const [currentUploadName, setCurrentUploadName] = useState<string | null>(null);

    const mapDocuments = (docList: typeof MANDATORY_DOCUMENTS, isMandatory: boolean) => {
        return docList.map(doc => ({
            ...doc,
            isMandatory,
            data: profile?.documents ? JSON.parse(profile?.documents)?.[doc.key] : null,
        }));
    };

    const yourMandatoryDocs = mapDocuments(MANDATORY_DOCUMENTS, true);
    const yourNonMandatoryDocs = mapDocuments(NON_MANDATORY_DOCUMENTS, false);

    // Filter documents
    const filterDocs = (docs: ReturnType<typeof mapDocuments>) => {
        return docs.filter(doc => {
            const matchesSearch = !searchQuery ||
                doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.description?.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesFilter = true;
            if (filterStatus === 'pending') matchesFilter = doc.data?.status === 'pending';
            else if (filterStatus === 'approved') matchesFilter = doc.data?.status === 'approved';
            else if (filterStatus === 'rejected') matchesFilter = doc.data?.status === 'rejected';
            else if (filterStatus === 'not-uploaded') matchesFilter = !doc.data?.url;

            return matchesSearch && matchesFilter;
        });
    };

    const parsedDocuments = profile?.documents
        ? JSON.parse(profile.documents)
        : {};


    const predefinedKeys = [
        ...MANDATORY_DOCUMENTS.map(doc => doc.key),
        ...NON_MANDATORY_DOCUMENTS.map(doc => doc.key),
    ];

    const customDocuments = Object.values(parsedDocuments).filter(
        (doc: any) => !predefinedKeys.includes(doc.docKey)
    );

    const customMandatoryDocs = customDocuments
        .filter((doc: any) => (doc.type == "mandatory" || !doc.type))
        .map((doc: any) => ({
            key: doc.docKey,
            name: doc.docName,
            description: doc.description,
            applicationId: doc.applicationId,
            isMandatory: true,
            data: doc
        }));

    const customNonMandatoryDocs = customDocuments
        .filter((doc: any) => doc.type === "non-mandatory")
        .map((doc: any) => ({
            key: doc.docKey,
            name: doc.docName,
            description: doc.description,
            applicationId: doc.applicationId,
            isMandatory: false,
            data: doc
        }));

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleUpload = (docKey: string, docName: string) => {
        setCurrentUploadKey(docKey);
        setCurrentUploadName(docName);
        fileInputRef.current?.click();
    };

    const handleStatusChange = async () => {
        try {
            if (
                statusModal.status === "rejected" &&
                !remarks.trim()
            ) {
                toast.error("Please enter rejection reason");
                return;
            }

            setUpdatingStatus(true);

            await axiosInstance.patch(
                `/users/docs?student=${studentId}`,
                {
                    docKey: statusModal.docKey,
                    status: statusModal.status,
                    remarks,
                }
            );

            toast.success(
                `Document ${statusModal.status} successfully`
            );

            setStatusModal({
                open: false,
                docKey: "",
                status: "",
            });

            setRemarks("");

            onUpdate?.();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update document status"
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUploadKey) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only PDF, JPG, and PNG files are allowed');
            return;
        }

        setUploadingDoc(currentUploadKey);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('docKey', currentUploadKey);
            formData.append('docName', currentUploadName || currentUploadKey);
            formData.append('originalName', file.name);
            const response = await axiosInstance.post(`/upload/documents?student=${studentId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(`${currentUploadName || currentUploadKey} uploaded successfully!`);
            if (onUpdate) onUpdate();
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload document');
        } finally {
            setUploadingDoc(null);
            setCurrentUploadKey(null);
            setCurrentUploadName(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const createDocumentRequirement = async () => {
        try {
            if (!requirementForm.docName.trim()) {
                return toast.error("Document name is required");
            }

            await axiosInstance.put(
                `/users/requirement?student=${studentId}`,
                {
                    docKey: requirementForm.docName
                        .toLowerCase()
                        .replace(/\s+/g, "_"),

                    docName: requirementForm.docName,
                    description: requirementForm.description,
                    applicationId: application?.applicationNumber,
                    isMandatory: requirementForm.isMandatory
                }
            );

            toast.success("Document requirement created");

            setRequirementForm({
                docName: "",
                description: "",
                isMandatory: true
            });

            setRequirementModal(false);

            onUpdate?.();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create requirement"
            );
        }
    };

    const handleView = (docUrl: string) => {
        window.open(`https://api.ooshasglobal.com${docUrl}`, '_blank');
    };

    const handleDelete = async (docKey: string, docName: string) => {
        if (!window.confirm(`Are you sure you want to delete ${docName}?`)) return;

        try {
            await axiosInstance.delete(`/upload/documents?student=${studentId}&docKey=${docKey}`);
            toast.success('Document deleted successfully!');
            if (onUpdate) onUpdate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete document');
        }
    };

    const filteredMandatory = filterDocs([
        ...yourMandatoryDocs,
        ...customMandatoryDocs,
    ]);

    const filteredNonMandatory = filterDocs([
        ...yourNonMandatoryDocs,
        ...customNonMandatoryDocs,
    ]);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 border-2 py-1 pb-3 px-3 border-gray-200 overflow-hidden"
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="flex justify-center border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('your-documents')}
                    className={`px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'your-documents'
                        ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-orange-600"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    Your Documents
                </button>
                <button
                    onClick={() => setActiveTab('ooshas-documents')}
                    className={`px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'ooshas-documents'
                        ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-orange-600"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    OOSHAS Documents
                </button>
            </div>
            {(user?.role === "admin" || user?.role === "counsellor") && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setRequirementModal(true)}
                        className="px-4 py-2 bg-[#F26D44] text-white text-sm"
                    >
                        + Request Document
                    </button>
                </div>
            )}
            {activeTab === 'your-documents' && (
                <>
                    <DocumentSection
                        title="Mandatory Documents"
                        icon={<FileCheck className="w-5 h-5 text-[#F26D44]" />}
                        documents={filteredMandatory}
                        onUpload={handleUpload}
                        onView={handleView}
                        onDelete={handleDelete}
                        isExpanded={expandedSections['mandatory']}
                        onToggle={() => toggleSection('mandatory')}
                        uploadingDoc={uploadingDoc}
                        handleStatusChange={handleStatusChange}
                        updatingStatus={updatingStatus}
                        statusModal={statusModal}
                        setStatusModal={setStatusModal}
                        remarks={remarks}
                        setRemarks={setRemarks}
                    />

                    {/* Non-Mandatory Documents */}
                    <DocumentSection
                        title="Non-Mandatory Documents"
                        icon={<FileText className="w-5 h-5 text-[#F26D44]" />}
                        documents={filteredNonMandatory}
                        onUpload={handleUpload}
                        onView={handleView}
                        onDelete={handleDelete}
                        isExpanded={expandedSections['non-mandatory']}
                        onToggle={() => toggleSection('non-mandatory')}
                        uploadingDoc={uploadingDoc}
                        handleStatusChange={handleStatusChange}
                        updatingStatus={updatingStatus}
                        statusModal={statusModal}
                        setStatusModal={setStatusModal}
                        remarks={remarks}
                        setRemarks={setRemarks}
                    />
                </>
            )}

            <AnimatePresence>
                {requirementModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white w-full max-w-lg p-6"
                        >
                            <h3 className="text-lg font-bold mb-4">
                                Request New Document
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Document Name
                                    </label>

                                    <input
                                        type="text"
                                        value={requirementForm.docName}
                                        onChange={(e) =>
                                            setRequirementForm((prev) => ({
                                                ...prev,
                                                docName: e.target.value,
                                            }))
                                        }
                                        placeholder="Bank Statement"
                                        className="w-full border p-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Document Type
                                    </label>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRequirementForm((prev) => ({
                                                    ...prev,
                                                    isMandatory: true,
                                                }))
                                            }
                                            className={`py-2 px-4 border text-sm font-medium transition-all ${requirementForm.isMandatory
                                                ? "bg-[#F26D44] text-white border-[#F26D44]"
                                                : "bg-white text-gray-700 border-gray-300"
                                                }`}
                                        >
                                            Mandatory
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRequirementForm((prev) => ({
                                                    ...prev,
                                                    isMandatory: false,
                                                }))
                                            }
                                            className={`py-2 px-4 border text-sm font-medium transition-all ${!requirementForm.isMandatory
                                                ? "bg-[#F26D44] text-white border-[#F26D44]"
                                                : "bg-white text-gray-700 border-gray-300"
                                                }`}
                                        >
                                            Non-Mandatory
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Description
                                    </label>

                                    <textarea
                                        rows={4}
                                        value={requirementForm.description}
                                        onChange={(e) =>
                                            setRequirementForm((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="Upload last 6 months bank statement"
                                        className="w-full border p-3"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setRequirementModal(false);

                                        setRequirementForm({
                                            docName: "",
                                            description: "",
                                        });
                                    }}
                                    className="px-4 py-2 border"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={createDocumentRequirement}
                                    className="px-4 py-2 bg-[#F26D44] text-white"
                                >
                                    Create Requirement
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {activeTab === "ooshas-documents" && (
                <div className="bg-white border border-gray-200 rounded-lg p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <FileX className="w-10 h-10 text-gray-400" />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            No Documents Available
                        </h3>

                        <p className="text-sm text-gray-500 max-w-md">
                            There are currently no Ooshas documents available for this student.
                            Documents will appear here once they are uploaded or generated.
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Documents;